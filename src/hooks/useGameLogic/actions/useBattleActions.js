import { RARITIES, ABILITIES, TYPES } from '../../../data/gameData';
import { generatePet, calculateEloChange } from '../../../utils/gameMechanics';
import { updateUser, updatePetInDB, trackQuestProgress } from '../../../utils/db';

export function useBattleActions(state, showNotification) {
    const { user, myPets, setActiveBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    // --- START BATTLE ---
    const startBattle = () => {
        if (!user) return; 
        
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
        
        if (validTeamIds.length === 0) { 
            showNotification("Dein Team ist leer!", 'error'); 
            if (autoBattleRemaining > 0) setAutoBattleRemaining(0);
            return; 
        }
        
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
        
        setActiveBattle({ 
            myTeam: myBattleTeam, 
            enemyTeam: enemyBattleTeam, 
            myIndex: 0, 
            enemyIndex: 0, 
            log: [`Kampf gestartet! (Auto: ${autoBattleRemaining > 0 ? autoBattleRemaining : 'Aus'})`], 
            turn: playerFirst ? 'PLAYER' : 'ENEMY', 
            isOver: false, 
            round: 1 
        });
        
        setCurrentView('battle');
    };

    // --- WIN LOGIC ---
    const handleWin = async (reward, winningTeamIds, enemyRating) => {
        if (!user) return;
        const targetRating = enemyRating || user.rating || 1000;
        const eloChange = calculateEloChange(user.rating || 1000, targetRating, true);
        const today = new Date().toLocaleDateString();
        
        let xpGain = reward.xp;
        let coinsGain = reward.coins;
        
        const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
        let newBuffs = { ...currentBuffs };

        if (currentBuffs.coinBoostMatches > 0) {
            coinsGain *= 2;
            newBuffs.coinBoostMatches -= 1;
            showNotification("Doppelte Münzen aktiviert!", "success");
        }
        if (currentBuffs.xpBoostMatches > 0) {
            xpGain *= 2;
            newBuffs.xpBoostMatches -= 1;
            showNotification("Doppelte XP aktiviert!", "success");
        }

        let newLevel = user.level || 1;
        let newXp = (user.xp || 0) + xpGain;
        let newXpToNext = user.xpToNextLevel || 100; 
        let newCoins = (user.coins || 0) + coinsGain;
        let newGems = user.gems || 0;
        
        while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; }

        await updateUser(user.id, { 
            coins: newCoins, 
            gems: newGems, 
            rating: (user.rating || 1000) + eloChange, 
            xp: newXp, 
            level: newLevel, 
            xpToNextLevel: newXpToNext, 
            lastEloDate: today, 
            stats: { ...user.stats, pvpWins: (user.stats?.pvpWins || 0) + 1, pvpTotal: (user.stats?.pvpTotal || 0) + 1 },
            buffs: newBuffs
        });

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
        trackQuestProgress(user, 'WIN_PVP', 1);
        trackQuestProgress(user, 'EARN_XP', xpGain);

        // --- AUTO BATTLE LOOP ---
        if (autoBattleRemaining > 1) {
            setAutoBattleRemaining(prev => prev - 1);
            // Nächsten Kampf sofort starten
            startBattle(); 
        } else {
            // Fertig
            if (autoBattleRemaining === 1) {
                setAutoBattleRemaining(0);
                showNotification("Auto-Kampf Sequenz abgeschlossen!", "success");
            }
            setCurrentView('arena-hub');
        }
    };

    // --- LOSE LOGIC ---
    const handleLose = async (enemyRating) => {
        if (!user) return;
        const targetRating = enemyRating || user.rating || 1000;
        const eloChange = calculateEloChange(user.rating || 1000, targetRating, false);
        const today = new Date().toLocaleDateString();
        
        let xpGain = 10;
        let coinsGain = 5;

        const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
        let newBuffs = { ...currentBuffs };

        if (currentBuffs.coinBoostMatches > 0) { coinsGain *= 2; newBuffs.coinBoostMatches -= 1; showNotification("Doppelte Münzen aktiviert!", "success"); }
        if (currentBuffs.xpBoostMatches > 0) { xpGain *= 2; newBuffs.xpBoostMatches -= 1; showNotification("Doppelte XP aktiviert!", "success"); }

        let newLevel = user.level || 1; let newXp = (user.xp || 0) + xpGain; let newXpToNext = user.xpToNextLevel || 100; let newCoins = (user.coins || 0) + coinsGain; let newGems = user.gems || 0;
        while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; }
        
        await updateUser(user.id, { 
            rating: Math.max(0, (user.rating || 1000) + eloChange), 
            xp: newXp, level: newLevel, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, 
            stats: { ...user.stats, pvpTotal: (user.stats?.pvpTotal || 0) + 1 },
            lastEloDate: today,
            buffs: newBuffs
        });
        
        const idsToLevel = state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : [];
        const petXpGain = 10;
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

        // --- AUTO BATTLE LOOP ---
        if (autoBattleRemaining > 1) {
            setAutoBattleRemaining(prev => prev - 1);
            startBattle();
        } else {
            if (autoBattleRemaining === 1) {
                setAutoBattleRemaining(0);
                showNotification("Auto-Kampf Sequenz abgeschlossen!", "success");
            }
            setCurrentView('arena-hub');
        }
    };

    // --- AUTO BATTLE INIT (GRAFISCH) ---
    const handleAutoBattle = async (ticketsToUse = 1) => {
        if (!user) return;
        if ((user.adTickets || 0) < ticketsToUse) {
            showNotification("Nicht genügend Tickets!", "error");
            return;
        }

        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
        if (validTeamIds.length === 0) { showNotification("Team ist leer!", "error"); return; }

        // Tickets abziehen
        await updateUser(user.id, { adTickets: user.adTickets - ticketsToUse });
        
        // Anzahl der Kämpfe setzen (1 Ticket = 10 Kämpfe)
        const totalBattles = ticketsToUse * 10;
        setAutoBattleRemaining(totalBattles);
        
        showNotification(`Starte ${totalBattles} Auto-Kämpfe...`, "success");
        
        // Ersten Kampf starten
        // Wichtig: startBattle nutzt den aktuellen State. Da setAutoBattleRemaining async ist,
        // übergeben wir hier nichts, aber handleWin wird den neuen State lesen.
        // Für den ERSTEN Kampf ist es egal, ob die Variable schon gesetzt ist, 
        // wichtig ist sie erst am Ende von handleWin.
        startBattle();
    };

    return { startBattle, handleWin, handleLose, handleAutoBattle };
}