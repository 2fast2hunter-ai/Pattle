import { calculateEloChange, setBattleActive } from '../../../utils/db';
import { playSound } from '../../../utils/soundManager';
import { trackBattleLost } from '../../../utils/analytics';
import { db } from '../../../firebase';
import { increment, doc, updateDoc, runTransaction } from 'firebase/firestore';
import { calculateMaxXp, recalculatePetStats, calculatePetTotalXpForLevel } from '../../../utils/mechanics/petStats';

export const handleLose = async (state, showNotification, startBattleFn, reward, teamIds, enemyRating) => {
    const { user, activeBattle, setActiveBattle, autoBattleRemaining, setAutoBattleRemaining, setCurrentView, t } = state;
    if (!user) return;

    const isAuto = autoBattleRemaining > 0;

    const isFriendly = activeBattle?.isFriendly;
    const isTower = activeBattle?.isTower;
    const isGauntlet = activeBattle?.isGauntlet; // NEU

    // --- GAUNTLET OVERRIDE ---
    if (isGauntlet) {
        // 1. Rewards zusammenführen (akkumulierte + aktuelle Runde)
        const acc = activeBattle.accumulatedRewards || { xp: 0, coins: 0 };
        reward = {
            xp: acc.xp + (reward?.xp || 0),
            coins: acc.coins + (reward?.coins || 0)
        };
        // Highscore-Logik erfolgt unten im zentralen Updates-Block
    }
    // -------------------------

    // 1. XP VERTEILUNG (Auch bei Niederlage)
    const xpGain = reward?.xp || 0;

    if (xpGain > 0 && teamIds && teamIds.length > 0 && !isGauntlet) {
        const xpPerPet = Math.max(1, Math.floor(xpGain / Math.max(1, teamIds.length)));

        if (xpGain > 0) {
            console.log(`[HandleLose] Verteile ${xpPerPet} XP an ${teamIds.length} Pets.`);
            for (const petId of teamIds) {
                if (!petId) continue;
                try {
                    await runTransaction(db, async (transaction) => {
                        const petRef = doc(db, "pets", petId);
                        const petDoc = await transaction.get(petRef);

                        if (!petDoc.exists()) {
                            console.warn(`[HandleLose] Pet ${petId} nicht gefunden.`);
                            return;
                        }

                        const data = petDoc.data();
                        console.log(`[HandleLose] Pet ${petId} (${data.name}) - Aktuell: Lvl ${data.level}, XP ${data.xp}`);

                        // SICHERHEITS-CHECKS
                        let currentLvl = Number(data.level);
                        if (!Number.isFinite(currentLvl) || currentLvl < 1) currentLvl = 1;

                        let currentXp = Number(data.xp);
                        if (!Number.isFinite(currentXp) || currentXp < 0) currentXp = 0;

                        const rarity = data.rarity || 'COMMON';

                        const minXpForLevel = calculatePetTotalXpForLevel(currentLvl, rarity);
                        if (currentXp < minXpForLevel && currentLvl > 1) {
                            currentXp += minXpForLevel;
                        }

                        let maxXp = Number(data.maxXp);
                        if (!Number.isFinite(maxXp) || maxXp <= 0) {
                            maxXp = calculateMaxXp(currentLvl, rarity);
                        }

                        let newXp = currentXp + xpPerPet;
                        let newLevel = currentLvl;
                        let didLevelUp = false;

                        while (newXp >= maxXp && newLevel < 100) {
                            newLevel++;
                            didLevelUp = true;
                            maxXp = calculateMaxXp(newLevel, rarity);
                        }

                        if (newLevel < currentLvl) {
                            console.error(`[HandleLose] Level regression for ${petId}. Correcting to ${currentLvl}.`);
                            newLevel = currentLvl;
                        }

                        if (newLevel >= 100) {
                            newLevel = 100;
                            newXp = 0;
                            maxXp = 2000000000;
                        }

                        const updates = {
                            xp: Math.floor(newXp),
                            level: newLevel,
                            maxXp: Math.floor(maxXp)
                        };

                        if (didLevelUp) {
                            const updatedPetBase = { ...data, level: newLevel };
                            const newStats = recalculatePetStats(updatedPetBase, newLevel);
                            updates.maxHp = Number(newStats.maxHp) || 10;
                            updates.hp = Number(newStats.maxHp) || 10;
                            updates.atk = Number(newStats.atk) || 1;
                            updates.def = Number(newStats.def) || 1;
                            updates.ap = Number(newStats.ap) || 1;
                            updates.res = Number(newStats.res) || 1;
                            updates.speed = Number(newStats.speed) || 1;
                        }

                        console.log(`[HandleLose] Update for ${petId}:`, updates);
                        transaction.update(petRef, updates);
                    });
                } catch (e) { console.error("Lose XP Error:", e); }
            }
        }
    }

    // 2. ELO & STATS
    let newRating = user.rating;
    const updates = {
        isInBattle: false,
        "stats.pvpTotal": (user.stats?.pvpTotal || 0) + 1
    };

    if (isGauntlet) {
        // Gauntlet Specific Logic: Wir nutzen den akkumulierten Score aus dem battleState
        const runScore = activeBattle.gauntletScore || 0;
        const currentHighscore = user?.stats?.gauntletHighscore || 0;

        if (runScore > currentHighscore) {
            updates["stats.gauntletHighscore"] = runScore;
            showNotification(t ? t('gauntlet_highscore_notif', { score: runScore }) : `Neuer Highscore! ${runScore} Punkte!`, "success");
            // WICHTIG: NICHT rating überschreiben! Rating = PVP Elo, Highscore = Gauntlet.
        }

        // Track best gauntlet round for Gauntlet Survivor achievement
        const currentRound = activeBattle.gauntletRound || 1;
        const clearedRounds = Math.max(0, currentRound - 1);
        const currentBestRound = user?.stats?.gauntletBestRound || 0;
        if (clearedRounds > currentBestRound) {
            updates["stats.gauntletBestRound"] = clearedRounds;
        }

        updates.coins = increment(reward?.coins || 0);
        updates.xp = increment(reward?.xp || 0);

    } else if (!isFriendly && !isTower) {
        // Standard PvP Logic
        const eloChange = calculateEloChange(user.rating, enemyRating || 1000, false);
        newRating += eloChange;
        updates.rating = newRating;
    }

    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, updates);


    await setBattleActive(user.id, false);

    const lostBattleType = isTower ? 'tower' : isGauntlet ? 'gauntlet' : isFriendly ? 'friendly' : 'pvp';
    trackBattleLost(lostBattleType);

    if (!isAuto) {
        playSound('lose');
        if (!isGauntlet) {
            showNotification(isTower ? (t ? t('notif_tower_lose') : 'Tower battle lost!') : (t ? t('notif_lose') : 'Defeat!'), "error");
        }
        setCurrentView(isTower ? 'tower' : 'arena-hub');
        setActiveBattle(null);
    } else {
        // Auto-Battle Logik wird im BattleScreen gehandhabt oder hier erweitert
        if (autoBattleRemaining <= 1) {
            setAutoBattleRemaining(0);
            showNotification(t ? t('notif_autobattle_ended_lose') : 'Auto-battle ended (defeat).', "info");
            setCurrentView('arena-hub');
            setActiveBattle(null);
        } else {
            // Weiterkämpfen auch bei Niederlage
            const nextRemaining = autoBattleRemaining - 1;
            setAutoBattleRemaining(nextRemaining);
            showNotification(t ? t('notif_autobattle_next', { remaining: nextRemaining }) : `Defeat! Next battle... (${nextRemaining} remaining)`, "info");

            setCurrentView('arena-hub');
            setActiveBattle(null);

            setTimeout(() => {
                startBattleFn();
            }, 1500);
        }
    }
};