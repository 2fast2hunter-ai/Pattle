import { trackQuestProgress, calculateEloChange, setBattleActive } from '../../../utils/db';
import { TOWER_STAGES } from '../../../data/gameData';
import { db } from '../../../firebase';
import { doc, increment, arrayUnion, updateDoc } from 'firebase/firestore';
import { handleGauntletWin, generateGauntletEnemies } from './handleGauntletWin';
import { distributeXP } from './distributeXP';

export const handleWin = async (state, showNotification, startBattleFn, reward, winningTeamIds, enemyRating, damageReport) => {
    const { user, myPets, activeBattle, setActiveBattle, autoBattleRemaining, setAutoBattleRemaining, setCurrentView, t } = state;
    if (!user) return;

    const isAuto = autoBattleRemaining > 0;
    const isFriendly = activeBattle?.isFriendly;
    const isTower = activeBattle?.isTower;
    const towerStage = activeBattle?.towerStage;
    const isGauntlet = activeBattle?.isGauntlet;

    // --- GAUNTLET LOGIC ---
    if (isGauntlet) {
        const { newRewards, nextRound, enemyCount, enemyLevel, enemyRarity, newScore } = handleGauntletWin(activeBattle, reward, setActiveBattle, showNotification);

        try {
            const enemyTeam = await generateGauntletEnemies(enemyCount, enemyLevel, enemyRarity);

            // Survivors Logic
            const survivors = activeBattle.myTeam.filter(p => p.hp > 0).map(p => ({
                ...p,
                currentCd: 0
            }));

            if (survivors.length === 0) {
                startBattleFn(); // Safety fallback
                return;
            }

            const nextBattleState = {
                ...activeBattle,
                myTeam: survivors,
                enemyTeam: enemyTeam,
                myIndex: 0,
                enemyIndex: 0,
                turn: 'PLAYER',
                log: [t ? t('gauntlet_round_start_log', { round: nextRound }) : `Gauntlet Runde ${nextRound} beginnt!`],
                isOver: false,
                round: 1,
                gauntletRound: nextRound,
                accumulatedRewards: newRewards,
                gauntletScore: newScore,
                gauntletTeamIds: activeBattle.gauntletTeamIds || activeBattle.myTeam.map(p => p.id)
            };

            setActiveBattle(nextBattleState);
            showNotification(t ? t('gauntlet_round_start_notif', { round: nextRound }) : `Sieg! Runde ${nextRound} startet...`, "success");
            return;

        } catch (e) {
            console.error("Gauntlet generation error", e);
            return;
        }
    }

    // 1. ELO Berechnung
    let eloChange = 0;
    if (!isFriendly && !isTower) {
        eloChange = calculateEloChange(user.rating, enemyRating || 1000, true);
    }

    // 2. Belohnungen
    let coinsGain = reward?.coins || 0;
    let xpGain = reward?.xp || 0;
    let gemsGain = 0;

    // Security Cap
    if (coinsGain > 5000) coinsGain = 5000;
    if (xpGain > 5000) xpGain = 5000;

    let towerRewardMsg = "";
    const itemsToAdd = [];

    if (isTower) {
        const stageConfig = TOWER_STAGES.find(s => s.id === towerStage);
        if (stageConfig?.reward) {
            const r = stageConfig.reward;
            if (r.type === 'COINS') coinsGain += r.amount;
            else if (r.type === 'GEMS') {
                gemsGain += r.amount;
                towerRewardMsg = `+${r.amount} Edelsteine`;
            }
            else if (r.type === 'CONSUMABLE' || r.type === 'LOOTBOX') {
                for (let i = 0; i < r.amount; i++) {
                    itemsToAdd.push({ id: Date.now() + Math.random(), type: r.type, variant: r.variant });
                }
                towerRewardMsg = `+${r.amount}x ${r.variant}`;
            }
        }
    }

    if (user.buffs?.coinBoostMatches > 0) coinsGain *= 2;
    if (user.buffs?.xpBoostMatches > 0) xpGain *= 2;

    // 3. XP Verteilen via Helper
    if (xpGain > 0 && winningTeamIds.length > 0) {
        await distributeXP(winningTeamIds, xpGain, trackQuestProgress, user);
    }

    // 4. DB Update
    const userUpdates = {
        coins: increment(Math.floor(coinsGain)),
        xp: increment(Math.floor(xpGain)),
        rating: increment(Math.floor(eloChange)),
        "stats.pvpWins": increment(1),
        "stats.pvpTotal": increment(1)
    };

    if (gemsGain > 0) userUpdates.gems = increment(gemsGain);
    if (itemsToAdd.length > 0) userUpdates.inventory = arrayUnion(...itemsToAdd);
    if (!isAuto || autoBattleRemaining <= 1) userUpdates.isInBattle = false;

    if (isTower) {
        const currentProgress = user.towerProgress || 1;
        if (towerStage === currentProgress) {
            userUpdates.towerProgress = currentProgress + 1;
        }
    }

    if (user.buffs?.coinBoostMatches > 0) userUpdates["buffs.coinBoostMatches"] = increment(-1);
    if (user.buffs?.xpBoostMatches > 0) userUpdates["buffs.xpBoostMatches"] = increment(-1);

    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, userUpdates);

    if (!isAuto || autoBattleRemaining <= 1) {
        await setBattleActive(user.id, false);
    }

    // Quest Tracking
    if (!isFriendly) {
        // Delay to avoid race conditions
        await new Promise(r => setTimeout(r, 200));

        const winSubTypes = ['WIN_PVP'];
        if (activeBattle?.myTeam) activeBattle.myTeam.forEach(p => winSubTypes.push(`WIN_${p.type}`));

        await trackQuestProgress(user, 'WIN_PVP', 1, winSubTypes);
        await trackQuestProgress(user, 'EARN_XP', xpGain);
    }

    // 5. UI Feedback
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
        setCurrentView('tower');
        setActiveBattle(null);
    } else {
        if (!isFriendly) showNotification(`Sieg! +${coinsGain} Gold, +${xpGain} XP`, "success");
        else showNotification("Sieg! (Freundschaftsspiel)", "success");
        setCurrentView('arena-hub');
        setActiveBattle(null);
    }
};
