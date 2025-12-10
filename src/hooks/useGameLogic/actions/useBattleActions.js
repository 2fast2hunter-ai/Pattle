// src/hooks/useGameLogic/actions/useBattleActions.js

import { RARITIES, ABILITIES, TYPES, SPECIES_BY_TYPE, ZODIAC_ANIMALS } from '../../../data/gameData'; 
import { XP_GAIN } from '../../../data/levelData';
import { generatePet, calculateEloChange, recalculatePetStats, calculateMaxXp } from '../../../utils/gameMechanics';
import { getXpToNextPlayerLevel, calculatePlayerLevel } from '../../../utils/mechanics/progression';
import { updateUser, updatePetInDB, trackQuestProgress, setBattleActive } from '../../../utils/db'; 

export function useBattleActions(state, showNotification) {
    const { user, myPets, setActiveBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    // Hilfsfunktion: Fähigkeit zuweisen (Überschreibt Tackle mit Element-Fähigkeit!)
    const ensureAbility = (pet) => {
        // Wenn das Pet schon eine valide Fähigkeit hat, die NICHT Tackle ist, behalten wir sie.
        if (pet.abilityId && ABILITIES[pet.abilityId] && pet.abilityId !== 'tackle') {
            return pet.abilityId;
        }
        
        // Ansonsten suchen wir eine passende Fähigkeit basierend auf dem Typ
        const matching = Object.keys(ABILITIES).filter(k => ABILITIES[k].element === pet.type);
        
        // Wenn wir eine finden (z.B. Feuerball für Fire), nehmen wir die
        if (matching.length > 0) return matching[0];
        
        // Fallback, falls gar nichts passt
        return 'tackle';
    };

    const getWeightedRarity = () => {
        const roll = Math.random() * 100;
        let total = 0;
        for (const key of Object.keys(RARITIES)) {
            total += RARITIES[key].dropChance;
            if (roll <= total) return key;
        }
        return 'COMMON';
    };

    // --- BATTLE START ---
    const startBattle = async () => { 
        if (!user) return; 
        
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); 
        if (validTeamIds.length === 0) { 
            showNotification("Dein Team ist leer!", 'error'); 
            if (autoBattleRemaining > 0) setAutoBattleRemaining(0); 
            return; 
        } 
        
        await setBattleActive(user.id, true); 
        
        // Eigenes Team vorbereiten
        const myBattleTeam = validTeamIds.map(id => { 
            const p = myPets.find(pet => pet.id === id); 
            return { 
                ...p, 
                abilityId: ensureAbility(p), // Korrigiert Tackle zu richtiger Fähigkeit
                currentCd: 0, // Startet bereit (0 Cooldown)
                hp: p.maxHp 
            }; 
        }); 
        
        const enemyBattleTeam = []; 
        const teamSize = myBattleTeam.length; 

        // Gegner generieren
        for (let i = 0; i < teamSize; i++) { 
            const myPet = myBattleTeam[i];
            const baseLevel = myPet.level || 1;
            const levelVariance = Math.floor(Math.random() * 3) - 1; 
            const enemyLevel = Math.max(1, baseLevel + levelVariance);
            const enemyRarity = getWeightedRarity();

            const enemyPet = generatePet(
                enemyLevel, 
                null, 
                enemyRarity, 
                null, 
                'ENEMY'
            );

            enemyPet.id = `enemy_${i}_${Date.now()}`; 
            enemyPet.currentCd = 0; 
            enemyPet.name = `Wildes ${enemyPet.name}`;
            enemyPet.abilityId = ensureAbility(enemyPet); // Auch Gegner bekommen richtige Skills

            enemyBattleTeam.push(enemyPet); 
        } 
        
        const p1 = myBattleTeam[0]; 
        const e1 = enemyBattleTeam[0]; 
        const playerFirst = p1.speed >= e1.speed; 
        
        setActiveBattle({ 
            myTeam: myBattleTeam, 
            enemyTeam: enemyBattleTeam, 
            myIndex: 0, 
            enemyIndex: 0, 
            log: [`Kampf gestartet! (Auto: ${autoBattleRemaining > 0 ? autoBattleRemaining : 'Aus'})`], 
            turn: playerFirst ? 'PLAYER' : 'ENEMY', 
            isOver: false, 
            round: 1, 
            isFriendly: false 
        }); 
        
        setCurrentView('battle'); 
    };

    const startFriendBattle = async (friendTeamPets) => { 
        if (!user) return; 
        await setBattleActive(user.id, true); 
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); 
        if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); return; } 
        
        const myBattleTeam = validTeamIds.map(id => { 
            const p = myPets.find(pet => pet.id === id); 
            return { ...p, abilityId: ensureAbility(p), currentCd: 0, hp: p.maxHp }; 
        }); 
        
        const enemyBattleTeam = friendTeamPets.map((p, i) => ({ 
            ...p, 
            id: `friend_pet_${i}_${Date.now()}`, 
            abilityId: ensureAbility(p), 
            currentCd: 0, 
            hp: p.maxHp 
        })); 
        
        if (enemyBattleTeam.length === 0) { showNotification("Dieser Freund hat kein Team aufgestellt!", "error"); return; } 
        
        const p1 = myBattleTeam[0]; 
        const e1 = enemyBattleTeam[0]; 
        const playerFirst = p1.speed >= e1.speed; 
        
        setActiveBattle({ 
            myTeam: myBattleTeam, 
            enemyTeam: enemyBattleTeam, 
            myIndex: 0, 
            enemyIndex: 0, 
            log: [`Freundschaftskampf gestartet!`], 
            turn: playerFirst ? 'PLAYER' : 'ENEMY', 
            isOver: false, 
            round: 1, 
            isFriendly: true 
        }); 
        setCurrentView('battle'); 
    };

    // --- WIN / LOSE ---
    const handleWin = async (reward, winningTeamIds, enemyRating, damageReport = {}) => {
        if (state.activeBattle?.isFriendly) { await setBattleActive(user.id, false); setCurrentView('friend-profile'); return; }
        if (!user) return;
        const targetRating = enemyRating || user.rating || 1000;
        const eloChange = calculateEloChange(user.rating || 1000, targetRating, true);
        const today = new Date().toISOString().split('T')[0];
        
        let xpGain = XP_GAIN.PLAYER_WIN; 
        let coinsGain = reward.coins; 
        const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
        let newBuffs = { ...currentBuffs };
        if (currentBuffs.coinBoostMatches > 0) { coinsGain *= 2; newBuffs.coinBoostMatches -= 1; showNotification("Doppelte Münzen aktiviert!", "success"); }
        if (currentBuffs.xpBoostMatches > 0) { xpGain *= 2; newBuffs.xpBoostMatches -= 1; showNotification("Doppelte XP aktiviert!", "success"); }

        let currentXp = (user.xp || 0) + xpGain;
        let newLevel = calculatePlayerLevel(currentXp);
        let newXpToNext = getXpToNextPlayerLevel(newLevel);
        let newCoins = (user.coins || 0) + coinsGain;
        let newGems = user.gems || 0;
        if (newLevel > user.level) { newCoins += 1000; newGems += 5; }

        let updateData = { coins: newCoins, gems: newGems, rating: (user.rating || 1000) + eloChange, xp: currentXp, level: newLevel, xpToNextLevel: newXpToNext, lastEloDate: today, stats: { ...user.stats, pvpWins: (user.stats?.pvpWins || 0) + 1, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, buffs: newBuffs, isInBattle: false };
        if (user.lastEloDate !== today) { updateData.startEloToday = user.rating || 1000; }
        await updateUser(user.id, updateData);

        const idsToLevel = winningTeamIds || (state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : []);
        const petBaseXp = XP_GAIN.PET_WIN_BASE; 

        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                let pXp = (pet.xp || 0) + petBaseXp; 
                let pLevel = pet.level || 1; 
                let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel, pet.rarity);
                let leveledUpCount = 0;
                while (pXp >= currentMaxXp) { pLevel++; currentMaxXp = calculateMaxXp(pLevel, pet.rarity); leveledUpCount++; }
                if (leveledUpCount > 0) { 
                    const newStats = recalculatePetStats({ ...pet, level: pLevel }, pLevel);
                    updatePetInDB(petId, { ...newStats, xp: pXp, hp: newStats.maxHp }); 
                    trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount); 
                } else { updatePetInDB(petId, { xp: pXp }); }
            }
        });

        const winningPets = winningTeamIds ? myPets.filter(p => winningTeamIds.includes(p.id)) : (state.activeBattle ? state.activeBattle.myTeam : []);
        const uniqueTypes = [...new Set(winningPets.map(p => p.type))];
        uniqueTypes.forEach(type => { if (type) trackQuestProgress(user, `WIN_${type}`, 1); });

        trackQuestProgress(user, 'WIN_PVP', 1); 
        trackQuestProgress(user, 'EARN_XP', xpGain);

        if (autoBattleRemaining > 1) { setAutoBattleRemaining(prev => prev - 1); startBattle(); } 
        else { if (autoBattleRemaining === 1) { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgeschlossen!", "success"); } setCurrentView('arena-hub'); }
    };

    const handleLose = async (enemyRating) => {
        if (state.activeBattle?.isFriendly) { await setBattleActive(user.id, false); setCurrentView('friend-profile'); return; }
        if (!user) return;
        const targetRating = enemyRating || user.rating || 1000;
        const eloChange = calculateEloChange(user.rating || 1000, targetRating, false);
        const today = new Date().toISOString().split('T')[0];
        
        let xpGain = XP_GAIN.PLAYER_LOSE; 
        let coinsGain = 5;
        const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
        let newBuffs = { ...currentBuffs };
        if (currentBuffs.coinBoostMatches > 0) { coinsGain *= 2; newBuffs.coinBoostMatches -= 1; showNotification("Doppelte Münzen aktiviert!", "success"); }
        if (currentBuffs.xpBoostMatches > 0) { xpGain *= 2; newBuffs.xpBoostMatches -= 1; showNotification("Doppelte XP aktiviert!", "success"); }

        let currentXp = (user.xp || 0) + xpGain;
        let newLevel = calculatePlayerLevel(currentXp);
        let newXpToNext = getXpToNextPlayerLevel(newLevel);
        let newCoins = (user.coins || 0) + coinsGain;
        let newGems = user.gems || 0;
        if (newLevel > user.level) { newCoins += 1000; newGems += 5; }

        let updateData = { rating: Math.max(0, (user.rating || 1000) + eloChange), xp: currentXp, level: newLevel, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, stats: { ...user.stats, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, lastEloDate: today, buffs: newBuffs, isInBattle: false };
        if (user.lastEloDate !== today) { updateData.startEloToday = user.rating || 1000; }
        await updateUser(user.id, updateData);
        
        const idsToLevel = state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : [];
        const petXpGain = 5; 
        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                let pXp = (pet.xp || 0) + petXpGain; 
                let pLevel = pet.level || 1; 
                let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel, pet.rarity); 
                let leveledUpCount = 0; 
                while (pXp >= currentMaxXp) { pLevel++; currentMaxXp = calculateMaxXp(pLevel, pet.rarity); leveledUpCount++; }
                if (leveledUpCount > 0) { 
                    const newStats = recalculatePetStats({ ...pet, level: pLevel }, pLevel);
                    updatePetInDB(petId, { ...newStats, xp: pXp, hp: newStats.maxHp }); 
                    trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount); 
                } else { updatePetInDB(petId, { xp: pXp }); }
            }
        });

        if (autoBattleRemaining > 1) { setAutoBattleRemaining(prev => prev - 1); startBattle(); } 
        else { if (autoBattleRemaining === 1) { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgeschlossen!", "success"); } setCurrentView('arena-hub'); }
    };

    const handleAutoBattle = async (ticketsToUse = 1) => { 
        if (!user) return; 
        if ((user.adTickets || 0) < ticketsToUse) { showNotification("Nicht genügend Tickets!", "error"); return; } 
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); 
        if (validTeamIds.length === 0) { showNotification("Team ist leer!", "error"); return; } 
        await updateUser(user.id, { adTickets: user.adTickets - ticketsToUse }); 
        const totalBattles = ticketsToUse * 10; 
        setAutoBattleRemaining(totalBattles); 
        showNotification(`Starte ${totalBattles} Auto-Kämpfe...`, "success"); 
        startBattle(); 
    };
    
    const cancelAutoBattle = () => { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgebrochen.", "info"); };

    return { startBattle, handleWin, handleLose, handleAutoBattle, cancelAutoBattle, startFriendBattle };
}