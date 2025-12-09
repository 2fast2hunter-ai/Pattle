import { RARITIES, ABILITIES, TYPES, SPECIES_BY_TYPE, ZODIAC_ANIMALS } from '../../../data/gameData'; // Imports erweitert
import { XP_GAIN } from '../../../data/levelData';
import { generatePet, calculateEloChange, getLevelUpStats, calculateMaxXp } from '../../../utils/gameMechanics';
import { getXpToNextPlayerLevel, calculatePlayerLevel } from '../../../utils/mechanics/progression';
import { updateUser, updatePetInDB, trackQuestProgress, setBattleActive } from '../../../utils/db'; 

export function useBattleActions(state, showNotification) {
    const { user, myPets, setActiveBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    // --- BATTLE START (NEUE LOGIK: SPIEGELUNG) ---
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
        
        // Eigenes Team vorbereiten (HP voll)
        const myBattleTeam = validTeamIds.map(id => { 
            const p = myPets.find(pet => pet.id === id); 
            return { ...p, currentCd: 0, hp: p.maxHp }; 
        }); 
        
        const enemyBattleTeam = []; 
        const typeKeys = Object.keys(TYPES);

        // Gegner erstellen (Spiegelung mit Variation)
        for (let i = 0; i < myBattleTeam.length; i++) { 
            const playerPet = myBattleTeam[i]; 
            
            // 1. Stats Multiplier (zwischen 0.85 und 1.15)
            // Das sorgt dafür, dass der Gegner +/- 15% Stärke hat
            const statMult = 0.85 + (Math.random() * 0.30);
            
            // 2. Neuer Typ & Spezies (Anders als das Spieler-Pet)
            let enemyType = playerPet.type;
            let safetyCounter = 0;
            // Versuche einen anderen Typ zu finden
            while (enemyType === playerPet.type && safetyCounter < 20) {
                enemyType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
                safetyCounter++;
            }
            
            // Spezies für den neuen Typ wählen
            const possibleSpecies = SPECIES_BY_TYPE[enemyType] || [];
            let enemySpecies = 'UNKNOWN';
            if (possibleSpecies.length > 0) {
                enemySpecies = possibleSpecies[Math.floor(Math.random() * possibleSpecies.length)];
            }
            
            // 3. Neue Ability passend zum Typ wählen
            const matchingAbilities = Object.keys(ABILITIES).filter(key => ABILITIES[key].element === enemyType);
            const newAbilityId = matchingAbilities.length > 0 ? matchingAbilities[Math.floor(Math.random() * matchingAbilities.length)] : 'tackle';

            // 4. Enemy Pet Objekt bauen
            const enemyPet = {
                ...playerPet, // Basis-Kopie der Spieler-Werte
                id: `enemy_${i}_${Date.now()}`,
                source: 'ENEMY',
                
                // Neue Identität setzen
                type: enemyType,
                species: enemySpecies,
                name: ZODIAC_ANIMALS[enemySpecies]?.label || 'Wildes Monster',
                abilityId: newAbilityId,
                
                // Angepasste Stats (Multiplikator anwenden)
                maxHp: Math.floor(playerPet.maxHp * statMult),
                hp: Math.floor(playerPet.maxHp * statMult),
                atk: Math.floor(playerPet.atk * statMult),
                def: Math.floor(playerPet.def * statMult),
                ap: Math.floor(playerPet.ap * statMult),
                res: Math.floor(playerPet.res * statMult),
                speed: Math.floor(playerPet.speed * statMult),
                
                currentCd: 0,
                // Visuelle Dinge zurücksetzen
                isShiny: false, 
                customBackground: null
            };
            
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

    const startFriendBattle = async (friendTeamPets) => { if (!user) return; await setBattleActive(user.id, true); const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); return; } const myBattleTeam = validTeamIds.map(id => { const p = myPets.find(pet => pet.id === id); return { ...p, currentCd: 0, hp: p.maxHp }; }); const enemyBattleTeam = friendTeamPets.map((p, i) => ({ ...p, id: `friend_pet_${i}_${Date.now()}`, currentCd: 0, hp: p.maxHp })); if (enemyBattleTeam.length === 0) { showNotification("Dieser Freund hat kein Team aufgestellt!", "error"); return; } const p1 = myBattleTeam[0]; const e1 = enemyBattleTeam[0]; const playerFirst = p1.speed >= e1.speed; setActiveBattle({ myTeam: myBattleTeam, enemyTeam: enemyBattleTeam, myIndex: 0, enemyIndex: 0, log: [`Freundschaftskampf gestartet!`], turn: playerFirst ? 'PLAYER' : 'ENEMY', isOver: false, round: 1, isFriendly: true }); setCurrentView('battle'); };

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
        let xpGain = XP_GAIN.PLAYER_WIN; // 200
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
                
                let currentMaxXp = calculateMaxXp(pLevel, pet.rarity);
                let leveledUpCount = 0;
                let currentStats = { maxHp: pet.maxHp, atk: pet.atk, def: pet.def, ap: pet.ap, res: pet.res, speed: pet.speed };

                while (pXp >= currentMaxXp) { 
                    pLevel++;
                    currentMaxXp = calculateMaxXp(pLevel, pet.rarity);
                    leveledUpCount++; 
                    
                    const growth = getLevelUpStats(pet.rarity); 
                    currentStats.maxHp += growth.hp; 
                    currentStats.atk += growth.atk; 
                    currentStats.def += growth.def; 
                    currentStats.ap += growth.ap; 
                    currentStats.res += growth.res; 
                    currentStats.speed += growth.speed; 
                }
                
                if (leveledUpCount > 0) { 
                    updatePetInDB(petId, { ...currentStats, level: pLevel, xp: pXp, maxXp: currentMaxXp, hp: currentStats.maxHp }); 
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
        
        let xpGain = XP_GAIN.PLAYER_LOSE; // 20
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
                let currentMaxXp = calculateMaxXp(pLevel, pet.rarity); 
                let leveledUpCount = 0; 
                let currentStats = { maxHp: pet.maxHp, atk: pet.atk, def: pet.def, ap: pet.ap, res: pet.res, speed: pet.speed };
                
                while (pXp >= currentMaxXp) { 
                    pLevel++; 
                    currentMaxXp = calculateMaxXp(pLevel, pet.rarity); 
                    leveledUpCount++; 
                    const growth = getLevelUpStats(pet.rarity); 
                    currentStats.maxHp += growth.hp; currentStats.atk += growth.atk; currentStats.def += growth.def; currentStats.ap += growth.ap; currentStats.res += growth.res; currentStats.speed += growth.speed; 
                }
                
                if (leveledUpCount > 0) { updatePetInDB(petId, { ...currentStats, level: pLevel, xp: pXp, maxXp: currentMaxXp, hp: currentStats.maxHp }); trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount); } 
                else { updatePetInDB(petId, { xp: pXp }); }
            }
        });

        if (autoBattleRemaining > 1) { setAutoBattleRemaining(prev => prev - 1); startBattle(); } 
        else { if (autoBattleRemaining === 1) { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgeschlossen!", "success"); } setCurrentView('arena-hub'); }
    };

    const handleAutoBattle = async (ticketsToUse = 1) => { if (!user) return; if ((user.adTickets || 0) < ticketsToUse) { showNotification("Nicht genügend Tickets!", "error"); return; } const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); if (validTeamIds.length === 0) { showNotification("Team ist leer!", "error"); return; } await updateUser(user.id, { adTickets: user.adTickets - ticketsToUse }); const totalBattles = ticketsToUse * 10; setAutoBattleRemaining(totalBattles); showNotification(`Starte ${totalBattles} Auto-Kämpfe...`, "success"); startBattle(); };
    const cancelAutoBattle = () => { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgebrochen.", "info"); };

    return { startBattle, handleWin, handleLose, handleAutoBattle, cancelAutoBattle, startFriendBattle };
}