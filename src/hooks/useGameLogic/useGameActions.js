import { RARITIES, QUEST_TYPES, SHOP_ITEMS, TYPES, SECRET_ANIMALS } from '../../data/gameData'; 
import { 
    generatePet, 
    calculateEloChange, 
    getUnlockedHatcherySlots, 
    determineRarity, 
    calculateBreedRarity, 
    calculateStatValue,
    generateHybridPet 
} from '../../utils/gameMechanics';
import { 
    updateUser, addPetToDB, updatePetInDB, createMarketListing, deleteMarketListing, 
    removePetFromDB, findUserPublic, trackQuestProgress, initializeUser, buyMarketItem
} from '../../utils/db';
import { auth } from '../../firebase'; 

export function useGameActions(state, setUserId) { 
    const { 
        user, setCurrentView, myPets, marketListings, setActiveBattle, setLootResult, 
        setNotification, setAuthLoading, setMyPets, setUser, selectedSlotForTeam
    } = state;

    const showNotification = (msg, type = 'error') => {
        console.log("Notification:", msg, type);
        setNotification({ message: msg, type });
        setTimeout(() => setNotification(null), 3000);
    };
    
    const handleLogin = async (firebaseUser, displayName) => { try { await initializeUser(firebaseUser, displayName); setUserId(firebaseUser.uid); } catch (error) { showNotification("Fehler beim Laden der Daten", "error"); setAuthLoading(false); } };
    const handleLogout = () => { auth.signOut(); setUser(null); setUserId(null); setMyPets([]); setCurrentView('auth'); };

    const buyLootbox = (boxType, cost, currency) => {
        if (!user) return; 
        if (currency === 'COINS') {
            if (user.coins < cost) { showNotification("Zu wenig Münzen!", 'error'); return; }
            const newInv = [...(user.inventory || []), { id: Date.now(), type: 'LOOTBOX', variant: boxType }];
            updateUser(user.id, { coins: user.coins - cost, inventory: newInv });
            trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, cost);
        } else {
            if (user.gems < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; }
            const newInv = [...(user.inventory || []), { id: Date.now(), type: 'LOOTBOX', variant: boxType }];
            updateUser(user.id, { gems: user.gems - cost, inventory: newInv });
        }
        showNotification(`${boxType} Box gekauft!`, 'success');
    };

    const buyTickets = (item) => {
        if (!user) return; 
        let cost = item.costAmount;
        let currency = item.costCurrency;
        if (currency === 'COINS' && (user.coins || 0) < cost) { showNotification("Zu wenig Münzen!", 'error'); return; }
        if (currency === 'GEMS' && (user.gems || 0) < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; }
        const newInventory = [...(user.inventory || [])];
        for (let i = 0; i < item.tickets; i++) { newInventory.push({ id: Date.now() + Math.random() + i, type: 'TICKET', variant: 'BREED' }); }
        const updateData = {};
        if (currency === 'COINS') { updateData.coins = user.coins - cost; trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, cost); } else if (currency === 'GEMS') { updateData.gems = user.gems - cost; }
        updateData.inventory = newInventory;
        updateUser(user.id, updateData); 
        showNotification(`${item.tickets} Zucht-Tickets gekauft und im Inventar abgelegt!`, 'success');
    };

    const handleRedeemTicket = async (ticketId) => {
        if (!user) return; 
        const ticketItem = user.inventory.find(i => i.id === ticketId && i.type === 'TICKET');
        if (!ticketItem) { showNotification("Ticket nicht gefunden.", 'error'); return; }
        const newInventory = user.inventory.filter(item => item.id !== ticketItem.id);
        await updateUser(user.id, { inventory: newInventory, redeemedTickets: (user.redeemedTickets || 0) + 1 });
        showNotification(`1 Zucht-Ticket eingelöst! Du hast jetzt ${user.redeemedTickets + 1} Tickets.`, 'success');
    };
    
    const startBattle = () => {
        if (!user) return; 
        
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
        
        if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); return; }
        
        // Energie Check entfernt
        
        const myBattleTeam = validTeamIds.map(id => { 
            const p = myPets.find(pet => pet.id === id); 
            return { ...p, currentCd: 0, hp: p.maxHp }; 
        });

        const enemyBattleTeam = [];
        for (let i = 0; i < myBattleTeam.length; i++) { 
            let enemyLevel = 1;
            if (user.level < 10) { enemyLevel = Math.max(1, user.level); } else { const variance = Math.floor(Math.random() * 7) - 3; enemyLevel = Math.max(1, user.level + variance); }
            let enemyRarity = 'COMMON'; const roll = Math.random() * 100; if (user.level >= 30 && roll > 90) enemyRarity = 'EPIC'; else if (user.level >= 20 && roll > 80) enemyRarity = 'RARE'; else if (user.level >= 10 && roll > 70) enemyRarity = 'UNCOMMON';
            const enemyPet = generatePet(enemyLevel, null, enemyRarity, null, 'ENEMY');
            enemyPet.id = `enemy_${i}_${Date.now()}`; 
            if (enemyLevel === 1) { enemyPet.atk = 1; enemyPet.ap = 1; enemyPet.def = 1; enemyPet.res = 1; enemyPet.speed = 1; enemyPet.maxHp = 10; enemyPet.hp = 10; } 
            else { const growthBonus = Math.floor(enemyLevel / 2); const hpGrowth = enemyLevel * 3; enemyPet.atk += growthBonus; enemyPet.ap += growthBonus; enemyPet.def += Math.floor(growthBonus / 2); enemyPet.res += Math.floor(growthBonus / 2); enemyPet.speed += Math.floor(growthBonus / 2); enemyPet.maxHp += hpGrowth; enemyPet.hp = enemyPet.maxHp; }
            enemyBattleTeam.push({ ...enemyPet, currentCd: 0, hp: enemyPet.maxHp }); 
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

    const handleAddFriend = async (friendId) => { if (!user || !friendId || friendId === user.id) return; const foundUser = await findUserPublic(friendId); if (foundUser) { const newFriends = [...(user.friends || []), { id: foundUser.id, username: foundUser.username, avatar: foundUser.avatar, level: foundUser.level, rating: foundUser.rating }]; updateUser(user.id, { friends: newFriends }); showNotification(`${foundUser.username} hinzugefügt!`, 'success'); } else { showNotification("Spieler nicht gefunden.", 'error'); } };
    const handleBuyMarket = async (listingId) => { if (!user) return; const result = await buyMarketItem(user, listingId); if (result.success) { showNotification(result.message, 'success'); trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, 1); } else { showNotification(result.message, 'error'); } };
    const handleSellMarket = async (petsToSell, totalPrice) => { if (!user) return; const petArray = Array.isArray(petsToSell) ? petsToSell : [petsToSell]; if (petArray.length === 0) return; const newListing = { sellerName: user.username, sellerId: user.id, price: totalPrice, pet: petArray[0], pets: petArray, quantity: petArray.length, isBundle: petArray.length > 1, createdAt: Date.now() }; await createMarketListing(newListing); for (const p of petArray) { await removePetFromDB(p.id); } showNotification(petArray.length > 1 ? `${petArray.length} Items eingestellt!` : "Angebot erstellt!", 'success'); };
    const addToTeam = (petId) => { if (!user || selectedSlotForTeam === null) return; const pet = myPets.find(p => p.id === petId); if (!pet) return; if (pet.isEgg) { showNotification("Eier kämpfen nicht!", 'error'); return; } const currentTeamIds = user.team || []; const newPetType = pet.type; for (let i = 0; i < currentTeamIds.length; i++) { if (i === selectedSlotForTeam) continue; const slotPetId = currentTeamIds[i]; if (slotPetId) { const slotPet = myPets.find(p => p.id === slotPetId); if (slotPet && slotPet.type === newPetType) { const typeLabel = TYPES[newPetType] ? TYPES[newPetType].label : newPetType; showNotification(`Ein ${typeLabel}-Pet ist bereits im Team!`, 'error'); return; } } } const newTeam = [...currentTeamIds]; while(newTeam.length <= selectedSlotForTeam) { newTeam.push(null); } const existingIndex = newTeam.indexOf(petId); if (existingIndex !== -1) { newTeam[existingIndex] = null; } newTeam[selectedSlotForTeam] = petId; updateUser(user.id, { team: newTeam }); setCurrentView('team-edit'); state.setSelectedSlotForTeam(null); };
    const removeFromTeam = (index) => { if (!user) return; const newTeam = [...user.team]; newTeam[index] = null; updateUser(user.id, { team: newTeam }); };
    const hatchEgg = (petId, customName) => { if (!user) return; const pet = myPets.find(p => p.id === petId); if (!pet || !pet.isEgg) return; if (Date.now() < pet.hatchAt) { showNotification("Noch nicht bereit!", 'error'); return; } updatePetInDB(petId, { isEgg: false, name: customName || pet.name }); updateUser(user.id, { stats: { ...user.stats, hatched: (user.stats?.hatched || 0) + 1 } }); const tags = ['HATCH_EGG', `HATCH_${pet.rarity}`, `HATCH_${pet.type}`]; trackQuestProgress(user, 'HATCH_EGG', 1, tags); showNotification(`Geschlüpft: ${customName || pet.name}!`, 'success'); };
    const startIncubation = async (id, type) => { if (!user) return null; if (type === 'BOX') { const box = user.inventory.find(i => i.id === id); if (!box) return null; const newInv = user.inventory.filter(i => i.id !== id); const newPet = generatePet(1, null, determineRarity(box.variant), null, box.variant === 'STARTER' ? 'STARTER' : 'SHOP'); newPet.isEgg = box.variant !== 'STARTER'; newPet.hatchAt = 0; await addPetToDB(newPet, user.id); await updateUser(user.id, { inventory: newInv }); return newPet; } else { const pet = myPets.find(p => p.id === id); if (myPets.filter(p => p.isEgg && p.hatchAt > 0).length >= getUnlockedHatcherySlots(user.level)) { showNotification("Brutstätte voll!", 'error'); return null; } await updatePetInDB(id, { hatchAt: Date.now() + RARITIES[pet.rarity].hatchDuration }); trackQuestProgress(user, QUEST_TYPES.HATCH_EGG, 1); setCurrentView('hatchery'); showNotification("Inkubation gestartet!", 'success'); return null; } };
    const breedPets = async (parent1Id, parent2Id) => { if (!user || (user.redeemedTickets || 0) < 1) { showNotification("Kein Ticket!", 'error'); return; } if (myPets.filter(p => p.isEgg && p.hatchAt > 0).length >= getUnlockedHatcherySlots(user.level)) { showNotification("Brutstätte ist voll!", 'error'); return; } const p1 = myPets.find(p => p.id === parent1Id); const p2 = myPets.find(p => p.id === parent2Id); const cd1 = RARITIES[p1.rarity].breedCooldown; const cd2 = RARITIES[p2.rarity].breedCooldown; if ((p1.bredAt || 0) + cd1 > Date.now()) { showNotification(`${p1.name} braucht eine Pause!`, 'error'); return; } if ((p2.bredAt || 0) + cd2 > Date.now()) { showNotification(`${p2.name} braucht eine Pause!`, 'error'); return; } await updateUser(user.id, { redeemedTickets: user.redeemedTickets - 1, stats: { ...user.stats, bred: (user.stats?.bred || 0) + 1 } }); trackQuestProgress(user, QUEST_TYPES.BREED_PET, 1); await updatePetInDB(p1.id, { bredAt: Date.now() }); await updatePetInDB(p2.id, { bredAt: Date.now() }); let child; const rollMutation = Math.random() * 100; if (rollMutation <= 10) { child = generateHybridPet(p1, p2); } else { const childType = Math.random() > 0.5 ? p1.type : p2.type; child = generatePet(1, childType, calculateBreedRarity(p1.rarity, p2.rarity), null, 'BREEDING'); const mix = (v1, v2) => Math.floor((v1 + v2) / 2); child.b_hp = mix(p1.b_hp || 10, p2.b_hp || 10); child.b_atk = mix(p1.b_atk || 2, p2.b_atk || 2); } child.isEgg = true; child.hatchAt = Date.now() + RARITIES[child.rarity].hatchDuration; await addPetToDB(child, user.id); const tags = ['BREED_PET', `BREED_${child.type}`]; trackQuestProgress(user, 'BREED_PET', 1, tags); setCurrentView('hatchery'); showNotification("Zucht erfolgreich!", 'success'); };

    return {
        showNotification, handleLogin, handleLogout,
        buyLootbox, buyTickets, handleRedeemTicket, 
        startBattle, handleWin, handleLose, handleAddFriend, 
        handleBuyMarket, handleSellMarket, addToTeam, removeFromTeam, 
        hatchEgg, startIncubation, breedPets
    };
}