import { RARITIES } from '../../../data/gameData';
import { generatePet, calculateEloChange } from '../../../utils/gameMechanics';
import { updateUser, updatePetInDB, trackQuestProgress } from '../../../utils/db';

export function useBattleActions(state, showNotification) {
    const { user, myPets, setActiveBattle, setCurrentView } = state;

    const startBattle = () => {
        if (!user) return; 
        
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
        
        if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); return; }
        
        const myBattleTeam = validTeamIds.map(id => { 
            const p = myPets.find(pet => pet.id === id); 
            return { ...p, currentCd: 0, hp: p.maxHp }; 
        });

        const enemyBattleTeam = [];
        for (let i = 0; i < myBattleTeam.length; i++) {
            const playerPet = myBattleTeam[i];
            let enemyLevel = 1;
            if (user.level >= 4) {
                enemyLevel = playerPet.level;
            } else {
                enemyLevel = Math.max(1, user.level);
            }

            let enemyRarity = 'COMMON'; 
            const roll = Math.random() * 100; 
            if (user.level >= 30 && roll > 90) enemyRarity = 'EPIC'; 
            else if (user.level >= 20 && roll > 80) enemyRarity = 'RARE'; 
            else if (user.level >= 10 && roll > 70) enemyRarity = 'UNCOMMON';
            
            const enemyPet = generatePet(enemyLevel, null, enemyRarity, null, 'ENEMY');
            enemyPet.id = `enemy_${i}_${Date.now()}`;

            if (user.level >= 4) {
                const vary = (val) => Math.max(1, val + (Math.floor(Math.random() * 5) - 2));
                
                enemyPet.maxHp = vary(playerPet.maxHp);
                enemyPet.hp = enemyPet.maxHp;
                enemyPet.atk = vary(playerPet.atk);
                enemyPet.ap = vary(playerPet.ap);
                enemyPet.def = vary(playerPet.def);
                enemyPet.res = vary(playerPet.res);
                enemyPet.speed = vary(playerPet.speed);
            } else {
                enemyPet.hp = enemyPet.maxHp;
            }
            
            enemyPet.currentCd = 0;
            enemyBattleTeam.push(enemyPet);
        }
        
        const p1 = myBattleTeam[0]; const e1 = enemyBattleTeam[0]; const playerFirst = p1.speed >= e1.speed;
        setActiveBattle({ myTeam: myBattleTeam, enemyTeam: enemyBattleTeam, myIndex: 0, enemyIndex: 0, log: [`Kampf gegen Level ${enemyBattleTeam[0].level} Gegner gestartet!`], turn: playerFirst ? 'PLAYER' : 'ENEMY', isOver: false, round: 1 });
        setCurrentView('battle');
    };

    const handleWin = async (reward, winningTeamIds, enemyRating) => {
        if (!user) return;
        const targetRating = enemyRating || user.rating || 1000;
        const eloChange = calculateEloChange(user.rating || 1000, targetRating, true);
        const today = new Date().toLocaleDateString();
        const isNewDay = user.lastEloDate !== today;
        const currentDailyChange = isNewDay ? 0 : (user.dailyEloChange || 0);
        const newDailyChange = currentDailyChange + eloChange;

        let newLevel = user.level || 1;
        let newXp = (user.xp || 0) + reward.xp;
        let newXpToNext = user.xpToNextLevel || 100; 
        let newCoins = (user.coins || 0) + reward.coins;
        let newGems = user.gems || 0;
        
        while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; }

        await updateUser(user.id, { coins: newCoins, gems: newGems, rating: (user.rating || 1000) + eloChange, xp: newXp, level: newLevel, xpToNextLevel: newXpToNext, dailyEloChange: newDailyChange, lastEloDate: today, stats: { ...user.stats, pvpWins: (user.stats?.pvpWins || 0) + 1, pvpTotal: (user.stats?.pvpTotal || 0) + 1 } });

        const questTags = ['WIN_PVP'];
        if (winningTeamIds && winningTeamIds.length > 0) { const firstPet = myPets.find(p => p.id === winningTeamIds[0]); if (firstPet) { questTags.push(`WIN_${firstPet.type}`); } }
        trackQuestProgress(user, 'WIN_PVP', 1, questTags);
        trackQuestProgress(user, 'EARN_XP', reward.xp);

        const idsToLevel = winningTeamIds || (state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : []);
        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                let pXp = (pet.xp || 0) + 50; let pLevel = pet.level || 1; let pMaxXp = pet.maxXp || 100; let changes = {};
                if (!pet.b_hp) { const reverseCalc = (val, lvl) => Math.max(1, Math.floor((val || 10) / (1 + ((lvl || 1) - 1) * 0.1))); pet.b_hp = reverseCalc(pet.maxHp, pLevel); }
                if (pXp >= pMaxXp) {
                    pLevel++; pXp -= pMaxXp; pMaxXp = Math.floor(pMaxXp * 1.2); const rarityKey = pet.rarity || 'COMMON'; const rarityInfo = RARITIES[rarityKey] || RARITIES.COMMON; const rId = rarityInfo.id; const getBoost = () => Math.floor(Math.random() * 2) + rId; const newMaxHp = (pet.maxHp || 10) + getBoost() + 2; 
                    changes = { level: pLevel, xp: pXp, maxXp: pMaxXp, maxHp: newMaxHp, hp: newMaxHp, atk: (pet.atk || 1) + getBoost(), ap: (pet.ap || 1) + getBoost(), def: (pet.def || 1) + getBoost(), res: (pet.res || 1) + getBoost(), speed: (pet.speed || 1) + getBoost() };
                    trackQuestProgress(user, 'LEVEL_UP_PET', 1);
                } else { changes = { xp: pXp }; } updatePetInDB(petId, changes);
            }
        });
        setCurrentView('arena-hub');
    };

    const handleLose = async (enemyRating) => {
        if (!user) return;
        const targetRating = enemyRating || user.rating || 1000;
        const eloChange = calculateEloChange(user.rating || 1000, targetRating, false);
        const today = new Date().toLocaleDateString();
        const isNewDay = user.lastEloDate !== today;
        const currentDailyChange = isNewDay ? 0 : (user.dailyEloChange || 0);
        const newDailyChange = currentDailyChange + eloChange;
        const lossReward = { xp: 10, coins: 5 }; const petXpGain = 10; 
        let newLevel = user.level || 1; let newXp = (user.xp || 0) + lossReward.xp; let newXpToNext = user.xpToNextLevel || 100; let newCoins = (user.coins || 0) + lossReward.coins; let newGems = user.gems || 0;
        while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; }
        await updateUser(user.id, { rating: Math.max(0, (user.rating || 1000) + eloChange), xp: newXp, level: newLevel, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, dailyEloChange: newDailyChange, lastEloDate: today, stats: { ...user.stats, pvpTotal: (user.stats?.pvpTotal || 0) + 1 } });
        const idsToLevel = state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : [];
        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                let pXp = (pet.xp || 0) + petXpGain; let pLevel = pet.level || 1; let pMaxXp = pet.maxXp || 100; let changes = {};
                if (!pet.b_hp) { const reverseCalc = (val, lvl) => Math.max(1, Math.floor((val || 10) / (1 + ((lvl || 1) - 1) * 0.1))); pet.b_hp = reverseCalc(pet.maxHp, pLevel); }
                if (pXp >= pMaxXp) {
                    pLevel++; pXp -= pMaxXp; pMaxXp = Math.floor(pMaxXp * 1.2); const rarityKey = pet.rarity || 'COMMON'; const rarityInfo = RARITIES[rarityKey] || RARITIES.COMMON; const rId = rarityInfo.id; const getBoost = () => Math.floor(Math.random() * 2) + rId; const newMaxHp = (pet.maxHp || 10) + getBoost() + 2; changes = { ...changes, level: pLevel, xp: pXp, maxXp: pMaxXp, maxHp: newMaxHp, hp: newMaxHp, atk: (pet.atk || 1) + getBoost(), ap: (pet.ap || 1) + getBoost(), def: (pet.def || 1) + getBoost(), res: (pet.res || 1) + getBoost(), speed: (pet.speed || 1) + getBoost() }; trackQuestProgress(user, 'LEVEL_UP_PET', 1);
                } else { changes = { ...changes, xp: pXp }; } updatePetInDB(petId, changes);
            }
        });
        setCurrentView('arena-hub');
    };

    return { startBattle, handleWin, handleLose };
}