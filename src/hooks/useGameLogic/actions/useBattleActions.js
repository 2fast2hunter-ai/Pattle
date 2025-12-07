import { RARITIES, ABILITIES, TYPES } from '../../../data/gameData';
import { generatePet, calculateEloChange, getLevelUpStats, calculateMaxXp } from '../../../utils/gameMechanics';
import { updateUser, updatePetInDB, trackQuestProgress, setBattleActive } from '../../../utils/db'; 

export function useBattleActions(state, showNotification) {
    const { user, myPets, setActiveBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    // ... (simulateFight, startBattle, startFriendBattle bleiben gleich, siehe vorheriger Code)
    const simulateFight = (myTeamBase, playerLevel) => { /* ... */ return false; };
    const startBattle = async () => { if (!user) return; const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); if (autoBattleRemaining > 0) setAutoBattleRemaining(0); return; } await setBattleActive(user.id, true); const myBattleTeam = validTeamIds.map(id => { const p = myPets.find(pet => pet.id === id); return { ...p, currentCd: 0, hp: p.maxHp }; }); const enemyBattleTeam = []; for (let i = 0; i < myBattleTeam.length; i++) { const playerPet = myBattleTeam[i]; let enemyLevel = 1; if (user.level >= 4) { enemyLevel = playerPet.level; } else { enemyLevel = Math.max(1, user.level); } let enemyRarity = 'COMMON'; const roll = Math.random() * 100; if (user.level >= 30 && roll > 90) enemyRarity = 'EPIC'; else if (user.level >= 20 && roll > 80) enemyRarity = 'RARE'; else if (user.level >= 10 && roll > 70) enemyRarity = 'UNCOMMON'; const enemyPet = generatePet(enemyLevel, null, enemyRarity, null, 'ENEMY'); enemyPet.id = `enemy_${i}_${Date.now()}`; if (user.level >= 4) { const vary = (val) => Math.max(1, val + (Math.floor(Math.random() * 5) - 2)); enemyPet.maxHp = vary(playerPet.maxHp); enemyPet.hp = enemyPet.maxHp; enemyPet.atk = vary(playerPet.atk); enemyPet.ap = vary(playerPet.ap); enemyPet.def = vary(playerPet.def); enemyPet.res = vary(playerPet.res); enemyPet.speed = vary(playerPet.speed); } else { enemyPet.hp = enemyPet.maxHp; } enemyPet.currentCd = 0; enemyBattleTeam.push(enemyPet); } const p1 = myBattleTeam[0]; const e1 = enemyBattleTeam[0]; const playerFirst = p1.speed >= e1.speed; setActiveBattle({ myTeam: myBattleTeam, enemyTeam: enemyBattleTeam, myIndex: 0, enemyIndex: 0, log: [`Kampf gestartet! (Auto: ${autoBattleRemaining > 0 ? autoBattleRemaining : 'Aus'})`], turn: playerFirst ? 'PLAYER' : 'ENEMY', isOver: false, round: 1, isFriendly: false }); setCurrentView('battle'); };
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
        
        // FIX: ISO Datum
        const today = new Date().toISOString().split('T')[0];
        
        let xpGain = reward.xp;
        let coinsGain = reward.coins;
        
        const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
        let newBuffs = { ...currentBuffs };
        if (currentBuffs.coinBoostMatches > 0) { coinsGain *= 2; newBuffs.coinBoostMatches -= 1; showNotification("Doppelte Münzen aktiviert!", "success"); }
        if (currentBuffs.xpBoostMatches > 0) { xpGain *= 2; newBuffs.xpBoostMatches -= 1; showNotification("Doppelte XP aktiviert!", "success"); }

        let newLevel = user.level || 1; let newXp = (user.xp || 0) + xpGain; let newXpToNext = user.xpToNextLevel || 100; let newCoins = (user.coins || 0) + coinsGain; let newGems = user.gems || 0;
        while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; }

        // --- MIDNIGHT CHECK ---
        let updateData = { 
            coins: newCoins, 
            gems: newGems, 
            rating: (user.rating || 1000) + eloChange, 
            xp: newXp, 
            level: newLevel, 
            xpToNextLevel: newXpToNext, 
            lastEloDate: today, 
            stats: { ...user.stats, pvpWins: (user.stats?.pvpWins || 0) + 1, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, 
            buffs: newBuffs, 
            isInBattle: false 
        };

        if (user.lastEloDate !== today) {
            // Wenn das Datum nicht übereinstimmt, ist es das erste Spiel des Tages.
            // Der Startwert ist das Rating VOR dem Sieg.
            updateData.startEloToday = user.rating || 1000;
        }
        // ----------------------

        await updateUser(user.id, updateData);

        // --- BATTLE PET LEVEL UP ---
        const idsToLevel = winningTeamIds || (state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : []);
        const teamSize = idsToLevel.length;
        const baseXP = 50; const totalXpPool = baseXP * teamSize; const fixedPool = totalXpPool * 0.5; const perfPool = totalXpPool * 0.5;
        const fixedPerPet = teamSize > 0 ? Math.floor(fixedPool / teamSize) : 0;
        let totalTeamDamage = 0; idsToLevel.forEach(id => { totalTeamDamage += (damageReport[id] || 0); });

        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                const myDmg = damageReport[petId] || 0;
                const perfShare = totalTeamDamage > 0 ? Math.floor((myDmg / totalTeamDamage) * perfPool) : 0;
                const xpToGain = fixedPerPet + perfShare;
                let pXp = (pet.xp || 0) + xpToGain; 
                let pLevel = pet.level || 1; 
                let currentMaxXp = calculateMaxXp(pLevel);
                let leveledUpCount = 0;
                let currentStats = { maxHp: pet.maxHp, atk: pet.atk, def: pet.def, ap: pet.ap, res: pet.res, speed: pet.speed };
                while (pXp >= currentMaxXp) { pXp -= currentMaxXp; pLevel++; currentMaxXp = calculateMaxXp(pLevel); leveledUpCount++; const growth = getLevelUpStats(pet.rarity); currentStats.maxHp += growth.hp; currentStats.atk += growth.atk; currentStats.def += growth.def; currentStats.ap += growth.ap; currentStats.res += growth.res; currentStats.speed += growth.speed; }
                if (leveledUpCount > 0) { updatePetInDB(petId, { ...currentStats, level: pLevel, xp: pXp, maxXp: currentMaxXp, hp: currentStats.maxHp }); trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount); } else { updatePetInDB(petId, { xp: pXp }); }
            }
        });

        trackQuestProgress(user, 'WIN_PVP', 1); trackQuestProgress(user, 'EARN_XP', xpGain);
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
        const today = new Date().toISOString().split('T')[0]; // FIX ISO
        let xpGain = 10; let coinsGain = 5;
        const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
        let newBuffs = { ...currentBuffs };
        if (currentBuffs.coinBoostMatches > 0) { coinsGain *= 2; newBuffs.coinBoostMatches -= 1; showNotification("Doppelte Münzen aktiviert!", "success"); }
        if (currentBuffs.xpBoostMatches > 0) { xpGain *= 2; newBuffs.xpBoostMatches -= 1; showNotification("Doppelte XP aktiviert!", "success"); }

        let newLevel = user.level || 1; let newXp = (user.xp || 0) + xpGain; let newXpToNext = user.xpToNextLevel || 100; let newCoins = (user.coins || 0) + coinsGain; let newGems = user.gems || 0;
        while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; }
        
        // --- MIDNIGHT CHECK ---
        let updateData = { 
            rating: Math.max(0, (user.rating || 1000) + eloChange), 
            xp: newXp, level: newLevel, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, 
            stats: { ...user.stats, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, 
            lastEloDate: today, 
            buffs: newBuffs, 
            isInBattle: false 
        };

        if (user.lastEloDate !== today) {
            updateData.startEloToday = user.rating || 1000;
        }
        // ----------------------

        await updateUser(user.id, updateData);
        
        // --- BATTLE PET LEVEL UP ---
        const idsToLevel = state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : [];
        const petXpGain = 5; 
        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                let pXp = (pet.xp || 0) + petXpGain; let pLevel = pet.level || 1; let currentMaxXp = calculateMaxXp(pLevel); let leveledUpCount = 0; let currentStats = { maxHp: pet.maxHp, atk: pet.atk, def: pet.def, ap: pet.ap, res: pet.res, speed: pet.speed };
                while (pXp >= currentMaxXp) { pXp -= currentMaxXp; pLevel++; currentMaxXp = calculateMaxXp(pLevel); leveledUpCount++; const growth = getLevelUpStats(pet.rarity); currentStats.maxHp += growth.hp; currentStats.atk += growth.atk; currentStats.def += growth.def; currentStats.ap += growth.ap; currentStats.res += growth.res; currentStats.speed += growth.speed; }
                if (leveledUpCount > 0) { updatePetInDB(petId, { ...currentStats, level: pLevel, xp: pXp, maxXp: currentMaxXp, hp: currentStats.maxHp }); trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount); } else { updatePetInDB(petId, { xp: pXp }); }
            }
        });

        if (autoBattleRemaining > 1) { setAutoBattleRemaining(prev => prev - 1); startBattle(); } 
        else { if (autoBattleRemaining === 1) { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgeschlossen!", "success"); } setCurrentView('arena-hub'); }
    };

    const handleAutoBattle = async (ticketsToUse = 1) => { if (!user) return; if ((user.adTickets || 0) < ticketsToUse) { showNotification("Nicht genügend Tickets!", "error"); return; } const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); if (validTeamIds.length === 0) { showNotification("Team ist leer!", "error"); return; } await updateUser(user.id, { adTickets: user.adTickets - ticketsToUse }); const totalBattles = ticketsToUse * 10; setAutoBattleRemaining(totalBattles); showNotification(`Starte ${totalBattles} Auto-Kämpfe...`, "success"); startBattle(); };
    const cancelAutoBattle = () => { setAutoBattleRemaining(0); showNotification("Auto-Kampf Sequenz abgebrochen.", "info"); };

    return { startBattle, handleWin, handleLose, handleAutoBattle, cancelAutoBattle, startFriendBattle };
}