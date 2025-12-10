// src/hooks/useGameLogic/actions/useBattleActions.js

import { RARITIES, ABILITIES, TYPES, SPECIES_BY_TYPE, ZODIAC_ANIMALS } from '../../../data/gameData'; 
import { XP_GAIN } from '../../../data/levelData';
import { generatePet, calculateEloChange, recalculatePetStats, calculateMaxXp } from '../../../utils/gameMechanics';
import { getXpToNextPlayerLevel, calculatePlayerLevel } from '../../../utils/mechanics/progression';
import { updateUser, updatePetInDB, trackQuestProgress, setBattleActive } from '../../../utils/db'; 

export function useBattleActions(state, showNotification) {
    const { user, myPets, setActiveBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    // Hilfsfunktion: Zufällige Seltenheit basierend auf Drop-Chancen wählen
    const getWeightedRarity = () => {
        const roll = Math.random() * 100;
        let total = 0;
        // Wir iterieren durch die definierten Rarities
        for (const key of Object.keys(RARITIES)) {
            total += RARITIES[key].dropChance;
            if (roll <= total) return key;
        }
        return 'COMMON'; // Fallback
    };

    // --- BATTLE START (NEUE LOGIK: ZUFALLSGEGNER) ---
    const startBattle = async () => { 
        if (!user) return; 
        
        // Team Validierung
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); 
        if (validTeamIds.length === 0) { 
            showNotification("Dein Team ist leer!", 'error'); 
            if (autoBattleRemaining > 0) setAutoBattleRemaining(0); 
            return; 
        } 
        
        await setBattleActive(user.id, true); 
        
        // Eigenes Team vorbereiten (HP voll für den Kampf simulieren)
        const myBattleTeam = validTeamIds.map(id => { 
            const p = myPets.find(pet => pet.id === id); 
            return { ...p, currentCd: 0, hp: p.maxHp }; 
        }); 
        
        const enemyBattleTeam = []; 
        const teamSize = myBattleTeam.length; // Gegneranzahl passt sich Spieler-Teamgröße an

        // Gegner generieren
        for (let i = 0; i < teamSize; i++) { 
            // 1. Level anpassen (Spielerlevel +/- 1)
            const playerLevel = user.level || 1;
            const levelVariance = Math.floor(Math.random() * 3) - 1; // Ergibt -1, 0 oder 1
            const enemyLevel = Math.max(1, playerLevel + levelVariance);

            // 2. Zufällige Seltenheit bestimmen
            const enemyRarity = getWeightedRarity();

            // 3. Pet generieren (Typ & Spezies sind zufällig, da wir null übergeben)
            // generatePet berechnet automatisch die korrekten Stats (atk, def, hp...)
            const enemyPet = generatePet(
                enemyLevel, 
                null,           // Zufälliger Typ
                enemyRarity,    // Zufällige (gewichtete) Seltenheit
                null,           // Keine vererbten Stats
                'ENEMY'         // Quelle
            );

            // 4. Für den Kampf anpassen
            enemyPet.id = `enemy_${i}_${Date.now()}`; // Einzigartige ID für React Keys
            enemyPet.currentCd = 0;
            // Name anpassen, damit es wild wirkt
            enemyPet.name = `Wildes ${enemyPet.name}`;

            enemyBattleTeam.push(enemyPet); 
        } 
        
        // Initiative bestimmen (Wer fängt an?)
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
            return { ...p, currentCd: 0, hp: p.maxHp }; 
        }); 
        
        const enemyBattleTeam = friendTeamPets.map((p, i) => ({ 
            ...p, 
            id: `friend_pet_${i}_${Date.now()}`, 
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

    // --- WIN LOGIC ---
    const handleWin = async (reward, winningTeamIds, enemyRating, damageReport = {}) => {
        if (state.activeBattle?.isFriendly) {
            await setBattleActive(user.id, false);
            setCurrentView('friend-profile');
            return;
        }
        if (!user) return;
        const targetRating = enemyRating || user.rating || 1000;
        const eloChange = calculateEloChange(user.rating || 1000, targetRating, true);
        const today = new Date().toISOString().split('T')[0];
        
        // --- NEUE XP WERTE ---
        let xpGain = XP_GAIN.PLAYER_WIN; 
        let coinsGain = reward.coins; 
        
        const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
        let newBuffs = { ...currentBuffs };
        if (currentBuffs.coinBoostMatches > 0) { coinsGain *= 2; newBuffs.coinBoostMatches -= 1; showNotification("Doppelte Münzen aktiviert!", "success"); }
        if (currentBuffs.xpBoostMatches > 0) { xpGain *= 2; newBuffs.xpBoostMatches -= 1; showNotification("Doppelte XP aktiviert!", "success"); }

        // --- PLAYER LEVEL UP LOGIC ---
        let currentXp = (user.xp || 0) + xpGain;
        let newLevel = calculatePlayerLevel(currentXp);
        let newXpToNext = getXpToNextPlayerLevel(newLevel);
        
        let newCoins = (user.coins || 0) + coinsGain;
        let newGems = user.gems || 0;

        if (newLevel > user.level) {
            newCoins += 1000; 
            newGems += 5;
        }

        let updateData = { 
            coins: newCoins, 
            gems: newGems, 
            rating: (user.rating || 1000) + eloChange, 
            xp: currentXp, 
            level: newLevel, 
            xpToNextLevel: newXpToNext, 
            lastEloDate: today, 
            stats: { ...user.stats, pvpWins: (user.stats?.pvpWins || 0) + 1, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, 
            buffs: newBuffs, 
            isInBattle: false 
        };

        if (user.lastEloDate !== today) { updateData.startEloToday = user.rating || 1000; }
        await updateUser(user.id, updateData);

        // --- BATTLE PET LEVEL UP ---
        const idsToLevel = winningTeamIds || (state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : []);
        const petBaseXp = XP_GAIN.PET_WIN_BASE; 

        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                let pXp = (pet.xp || 0) + petBaseXp; 
                let pLevel = pet.level || 1; 
                
                let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel, pet.rarity);
                let leveledUpCount = 0;

                while (pXp >= currentMaxXp) { 
                    pLevel++;
                    currentMaxXp = calculateMaxXp(pLevel, pet.rarity);
                    leveledUpCount++; 
                }
                
                if (leveledUpCount > 0) { 
                    const newStats = recalculatePetStats({ ...pet, level: pLevel }, pLevel);
                    updatePetInDB(petId, { 
                        ...newStats, 
                        xp: pXp, 
                        hp: newStats.maxHp 
                    }); 
                    trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount); 
                } else { 
                    updatePetInDB(petId, { xp: pXp }); 
                }
            }
        });

        // --- TRACKING FÜR ELEMENT-SIEGE ---
        const winningPets = winningTeamIds 
            ? myPets.filter(p => winningTeamIds.includes(p.id)) 
            : (state.activeBattle ? state.activeBattle.myTeam : []);

        const uniqueTypes = [...new Set(winningPets.map(p => p.type))];
        uniqueTypes.forEach(type => {
            if (type) {
                trackQuestProgress(user, `WIN_${type}`, 1);
            }
        });

        trackQuestProgress(user, 'WIN_PVP', 1); 
        trackQuestProgress(user, 'EARN_XP', xpGain);

        if (autoBattleRemaining > 1) { setAutoBattleRemaining(prev => prev - 1); startBattle(); } 
        else { if (autoBattleRemaining === 1) { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgeschlossen!", "success"); } setCurrentView('arena-hub'); }
    };

    // --- LOSE LOGIC ---
    const handleLose = async (enemyRating) => {
        if (state.activeBattle?.isFriendly) {
            await setBattleActive(user.id, false);
            setCurrentView('friend-profile');
            return;
        }
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

        let updateData = { 
            rating: Math.max(0, (user.rating || 1000) + eloChange), 
            xp: currentXp, 
            level: newLevel, 
            xpToNextLevel: newXpToNext, 
            coins: newCoins, 
            gems: newGems, 
            stats: { ...user.stats, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, 
            lastEloDate: today, 
            buffs: newBuffs, 
            isInBattle: false 
        };

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
                
                while (pXp >= currentMaxXp) { 
                    pLevel++; 
                    currentMaxXp = calculateMaxXp(pLevel, pet.rarity); 
                    leveledUpCount++; 
                }
                
                if (leveledUpCount > 0) { 
                    const newStats = recalculatePetStats({ ...pet, level: pLevel }, pLevel);
                    updatePetInDB(petId, { 
                        ...newStats, 
                        xp: pXp, 
                        hp: newStats.maxHp 
                    }); 
                    trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount); 
                } else { 
                    updatePetInDB(petId, { xp: pXp }); 
                }
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