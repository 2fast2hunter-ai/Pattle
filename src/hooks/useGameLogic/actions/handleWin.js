import { trackQuestProgress, calculateEloChange, setBattleActive } from '../../../utils/db';
import { getPlayerMaxXpForLevel } from '../../../utils/gameMechanics';
import { calculateMaxXp, recalculatePetStats, calculatePetTotalXpForLevel } from '../../../utils/mechanics/petStats';
import { TOWER_STAGES } from '../../../data/gameData';
import { db } from '../../../firebase';
import { doc, getDoc, increment, arrayUnion, updateDoc, runTransaction } from 'firebase/firestore';

export const handleWin = async (state, showNotification, startBattleFn, reward, winningTeamIds, enemyRating, damageReport) => {
    const { user, myPets, activeBattle, setActiveBattle, autoBattleRemaining, setAutoBattleRemaining, setCurrentView } = state;
    if (!user) return;

    const isAuto = autoBattleRemaining > 0;
    const isFriendly = activeBattle?.isFriendly;
    const isTower = activeBattle?.isTower;
    const towerStage = activeBattle?.towerStage;

    // 1. ELO Berechnung (Nur wenn nicht Friendly und nicht Tower)
    let eloChange = 0;
    if (!isFriendly && !isTower) {
        eloChange = calculateEloChange(user.rating, enemyRating || 1000, true);
    }

    // 2. Belohnungen (Coins & XP)
    let coinsGain = reward?.coins || 0;
    let xpGain = reward?.xp || 0;
    let gemsGain = 0;

    // SECURITY CAP: Verhindert absurde Werte durch einfache Manipulation
    // Ein normaler Kampf gibt selten mehr als diese Werte
    if (coinsGain > 5000) coinsGain = 5000;
    if (xpGain > 5000) xpGain = 5000;

    let towerRewardMsg = "";
    const itemsToAdd = [];

    // TOWER REWARD LOGIC
    if (isTower) {
        const stageConfig = TOWER_STAGES.find(s => s.id === towerStage);
        if (stageConfig && stageConfig.reward) {
            const r = stageConfig.reward;
            if (r.type === 'COINS') coinsGain += r.amount;
            else if (r.type === 'GEMS') {
                gemsGain += r.amount;
                towerRewardMsg = `+${r.amount} Edelsteine`;
            }
            else if (r.type === 'CONSUMABLE' || r.type === 'LOOTBOX') {
                for(let i=0; i<r.amount; i++) {
                    itemsToAdd.push({ id: Date.now() + Math.random(), type: r.type, variant: r.variant });
                }
                towerRewardMsg = `+${r.amount}x ${r.variant}`;
            }
        }
    }

    // Buffs prüfen
    if (user.buffs?.coinBoostMatches > 0) coinsGain *= 2;
    if (user.buffs?.xpBoostMatches > 0) xpGain *= 2;

    // 3. XP für Pets verteilen (DIREKT ÜBER IDs)
    // Mindestens 1 XP pro Pet, wenn XP vergeben werden
    const xpPerPet = xpGain > 0 ? Math.max(1, Math.floor(xpGain / Math.max(1, winningTeamIds.length))) : 0;
    let levelUpCount = 0;

    if (xpGain > 0 && winningTeamIds.length > 0) {
      console.log(`[HandleWin] Verteile ${xpPerPet} XP an ${winningTeamIds.length} Pets.`);
      for (const petId of winningTeamIds) {
        if (!petId) continue;
        try {
            // Transaktion: Sicherer Lese-Schreib-Vorgang
            const leveledUp = await runTransaction(db, async (transaction) => {
                const petRef = doc(db, "pets", petId);
                const petDoc = await transaction.get(petRef);
                
                if (!petDoc.exists()) {
                    console.warn(`[HandleWin] Pet ${petId} nicht in DB gefunden.`);
                    return false;
                }
                
                const data = petDoc.data();
                console.log(`[HandleWin] Pet ${petId} (${data.name}) - Aktuell: Lvl ${data.level}, XP ${data.xp}`);
                
                // SICHERHEITS-CHECKS: Verhindert NaN/Reset Fehler
                let currentLvl = Number(data.level);
                if (!Number.isFinite(currentLvl) || currentLvl < 1) currentLvl = 1; // Fallback nur wenn wirklich kaputt
                
                let currentXp = Number(data.xp);
                if (!Number.isFinite(currentXp) || currentXp < 0) currentXp = 0;
                
                const rarity = data.rarity || 'COMMON';

                // AUTO-FIX: Falls XP durch den alten Bug "relativ" statt "kumulativ" gespeichert wurden
                const minXpForLevel = calculatePetTotalXpForLevel(currentLvl, rarity);
                if (currentXp < minXpForLevel && currentLvl > 1) {
                    console.log(`[HandleWin] Repariere XP für ${data.name}: ${currentXp} -> ${currentXp + minXpForLevel}`);
                    currentXp += minXpForLevel;
                }

                let maxXp = Number(data.maxXp);
                // Fallback für MaxXP falls fehlerhaft
                if (!Number.isFinite(maxXp) || maxXp <= 0) {
                    maxXp = calculateMaxXp(currentLvl, rarity);
                }

                // Berechnung
                let newXp = currentXp + xpPerPet;
                let newLevel = currentLvl;
                let didLevelUp = false;

                // Level-Up Loop (Max Level 100)
                while (newXp >= maxXp && newLevel < 100) {
                    // newXp bleibt kumulativ, wir ziehen nichts ab!
                    newLevel++;
                    didLevelUp = true;
                    maxXp = calculateMaxXp(newLevel, rarity);
                }

                // SCHUTZ VOR LEVEL-VERLUST
                if (newLevel < currentLvl) {
                    console.error(`[HandleWin] ACHTUNG: Level-Verlust erkannt für ${petId}! Setze zurück auf ${currentLvl}.`);
                    newLevel = currentLvl;
                }

                // Cap bei Level 100
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
                    // Stats neu berechnen
                    const updatedPetBase = { ...data, level: newLevel };
                    const newStats = recalculatePetStats(updatedPetBase, newLevel);
                    
                    updates.maxHp = Number(newStats.maxHp) || 10;
                    updates.hp = Number(newStats.maxHp) || 10; // Vollheilung
                    updates.atk = Number(newStats.atk) || 1;
                    updates.def = Number(newStats.def) || 1;
                    updates.ap = Number(newStats.ap) || 1;
                    updates.res = Number(newStats.res) || 1;
                    updates.speed = Number(newStats.speed) || 1;
                }

                console.log(`[HandleWin] Update für ${petId}:`, updates);
                transaction.update(petRef, updates);
                return didLevelUp;
            });

            if (leveledUp) levelUpCount++;

        } catch (err) {
            console.error(`[HandleWin] Fehler bei XP Transaktion für Pet ${petId}:`, err);
        }
      }
    }

    if (levelUpCount > 0) {
        await trackQuestProgress(user, 'LEVEL_UP_PET', levelUpCount);
    }

    // 4. Player XP
    let newPlayerXp = (user.xp || 0) + xpGain;
    
    // 5. DB Update
    const userUpdates = { 
        coins: increment(Math.floor(coinsGain)),
        xp: increment(Math.floor(xpGain)), 
        rating: increment(Math.floor(eloChange)),
        "stats.pvpWins": increment(1),
        "stats.pvpTotal": increment(1)
    };

    if (gemsGain > 0) {
        userUpdates.gems = increment(gemsGain);
    }

    if (itemsToAdd.length > 0) {
        userUpdates.inventory = arrayUnion(...itemsToAdd);
    }

    // Nur wenn KEIN Auto-Kampf mehr folgt, setzen wir den Status zurück
    if (!isAuto || autoBattleRemaining <= 1) {
        userUpdates.isInBattle = false;
    }

    if (isTower) {
        // Fortschritt erhöhen, wenn es die aktuelle Stufe war
        const currentProgress = user.towerProgress || 1;
        if (towerStage === currentProgress) {
            userUpdates.towerProgress = currentProgress + 1;
        }
    }

    if (user.buffs?.coinBoostMatches > 0) userUpdates["buffs.coinBoostMatches"] = increment(-1);
    if (user.buffs?.xpBoostMatches > 0) userUpdates["buffs.xpBoostMatches"] = increment(-1);

    const userRef = doc(db, "users", user.id);
    // Direktes Update für den User
    await updateDoc(userRef, userUpdates);

    if (!isAuto || autoBattleRemaining <= 1) {
        await setBattleActive(user.id, false);
    }

    // Quest Tracking
    if (!isFriendly) {
        // Kurze Pause um DB-Konflikte (400 Bad Request) mit updateUser zu vermeiden
        await new Promise(r => setTimeout(r, 200));

        // Batch WIN events um DB-Konflikte zu vermeiden
        const winSubTypes = ['WIN_PVP'];
        // Wir haben teamPets entfernt, daher holen wir Typen aus dem State oder lassen es generisch
        // Um DB-Reads zu sparen, tracken wir hier nur den generischen Win. 
        // (Element-Wins sind Bonus und weniger kritisch als XP)
        // Falls activeBattle da ist, können wir Typen daraus holen:
        if (activeBattle?.myTeam) activeBattle.myTeam.forEach(p => winSubTypes.push(`WIN_${p.type}`));
        
        await trackQuestProgress(user, 'WIN_PVP', 1, winSubTypes);
        await trackQuestProgress(user, 'EARN_XP', xpGain);
    }

    // 6. UI Feedback
    if (isAuto) {
        if (autoBattleRemaining > 1) {
            setAutoBattleRemaining(prev => prev - 1);
            startBattleFn();
        } else {
            setAutoBattleRemaining(0);
            showNotification("Auto-Kampf abgeschlossen!", "success");
            setCurrentView('arena-hub');
            setActiveBattle(null);
        }
    } else if (isTower) {
        showNotification(`Stufe ${towerStage} geschafft! ${towerRewardMsg}`, "success");
        setCurrentView('tower'); // Zurück zum Turm
        setActiveBattle(null);
    } else {
        if (!isFriendly) showNotification(`Sieg! +${coinsGain} Gold, +${xpGain} XP`, "success");
        else showNotification("Sieg! (Freundschaftsspiel)", "success");
        setCurrentView('arena-hub');
        setActiveBattle(null);
    }
};