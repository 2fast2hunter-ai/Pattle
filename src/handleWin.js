import { updateUser, updatePetInDB, trackQuestProgress, calculateEloChange, setBattleActive } from './src/utils/db';
import { calculateMaxXp, recalculatePetStats, getPlayerMaxXpForLevel } from './src/utils/gameMechanics';
import { TOWER_STAGES } from './src/data/gameData';

export const handleWin = async (state, showNotification, startBattleFn, reward, winningTeamIds, enemyRating, damageReport) => {
    const { user, myPets, activeBattle, setActiveBattle, autoBattleRemaining, setAutoBattleRemaining, setCurrentView } = state;
    if (!user) return;

    const isAuto = autoBattleRemaining > 0;
    const isFriendly = activeBattle?.isFriendly;
    const isTower = activeBattle?.isTower;
    const towerStage = activeBattle?.towerStage;

    // 1. ELO Berechnung (Nur wenn nicht Friendly und nicht Tower)
    let newRating = user.rating;
    if (!isFriendly && !isTower) {
        const eloChange = calculateEloChange(user.rating, enemyRating || 1000, true);
        newRating += eloChange;
    }

    // 2. Belohnungen (Coins & XP)
    let coinsGain = reward?.coins || 0;
    let xpGain = reward?.xp || 0;
    let towerRewardMsg = "";
    let newInventory = [...(user.inventory || [])];

    // TOWER REWARD LOGIC
    if (isTower) {
        const stageConfig = TOWER_STAGES.find(s => s.id === towerStage);
        if (stageConfig && stageConfig.reward) {
            const r = stageConfig.reward;
            if (r.type === 'COINS') coinsGain += r.amount;
            else if (r.type === 'GEMS') {
                // Gems direkt adden
                await updateUser(user.id, { gems: (user.gems || 0) + r.amount });
                towerRewardMsg = `+${r.amount} Edelsteine`;
            }
            else if (r.type === 'CONSUMABLE' || r.type === 'LOOTBOX') {
                for(let i=0; i<r.amount; i++) {
                    newInventory.push({ id: Date.now() + Math.random(), type: r.type, variant: r.variant });
                }
                towerRewardMsg = `+${r.amount}x ${r.variant}`;
            }
        }
    }

    // Buffs prüfen
    if (user.buffs?.coinBoostMatches > 0) coinsGain *= 2;
    if (user.buffs?.xpBoostMatches > 0) xpGain *= 2;

    // 3. XP für Pets verteilen
    const teamPets = myPets.filter(p => winningTeamIds.includes(p.id));
    const xpPerPet = Math.floor(xpGain / Math.max(1, teamPets.length));

    for (const pet of teamPets) {
        let pXp = (pet.xp || 0) + xpPerPet;
        let pLevel = pet.level || 1;
        let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel, pet.rarity);
        
        let leveledUp = false;
        while (pXp >= currentMaxXp) {
            pXp -= currentMaxXp;
            pLevel++;
            currentMaxXp = calculateMaxXp(pLevel, pet.rarity);
            leveledUp = true;
        }

        if (leveledUp) {
            const newStats = recalculatePetStats(pet, pLevel);
            await updatePetInDB(pet.id, { ...newStats, xp: pXp });
            trackQuestProgress(user, 'LEVEL_UP_PET', 1);
        } else {
            await updatePetInDB(pet.id, { xp: pXp });
        }
    }

    // 4. Player XP
    let newPlayerXp = (user.xp || 0) + xpGain;
    let newLevel = user.level;
    let newXpToNext = user.xpToNextLevel;
    
    // Player Level Up Logic (vereinfacht, da Progression.js das eigentlich macht, aber hier direkt für Feedback)
    // Wir nutzen die DB-Funktion beim nächsten Load, aber für UI Feedback:
    // ... (Hier könnte man calculatePlayerLevel nutzen)

    // 5. DB Update
    const updates = { 
        coins: user.coins + coinsGain,
        inventory: newInventory,
        xp: newPlayerXp, 
        rating: newRating,
        isInBattle: false,
        "stats.pvpWins": (user.stats?.pvpWins || 0) + 1,
        "stats.pvpTotal": (user.stats?.pvpTotal || 0) + 1
    };

    if (isTower) {
        // Fortschritt erhöhen, wenn es die aktuelle Stufe war
        if (towerStage === user.towerProgress) {
            updates.towerProgress = user.towerProgress + 1;
        }
    }

    if (user.buffs?.coinBoostMatches > 0) updates["buffs.coinBoostMatches"] = user.buffs.coinBoostMatches - 1;
    if (user.buffs?.xpBoostMatches > 0) updates["buffs.xpBoostMatches"] = user.buffs.xpBoostMatches - 1;

    await updateUser(user.id, updates);
    await setBattleActive(user.id, false);

    // Quest Tracking
    if (!isFriendly) {
        trackQuestProgress(user, 'WIN_PVP', 1);
        trackQuestProgress(user, 'EARN_XP', xpGain);
        // Elementar Quests
        teamPets.forEach(p => {
            trackQuestProgress(user, `WIN_${p.type}`, 1);
        });
    }

    // 6. UI Feedback
    if (isAuto) {
        if (autoBattleRemaining > 1) {
            setAutoBattleRemaining(prev => prev - 1);
            setTimeout(() => startBattleFn(), 3000); // Nächster Kampf in 3s
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