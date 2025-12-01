import { RARITIES, QUEST_TYPES, SHOP_ITEMS } from '../../data/gameData';
import { 
    generatePet, 
    calculateEloChange, 
    getUnlockedHatcherySlots, 
    getMaxEnergy, 
    determineRarity, 
    calculateBreedRarity, 
    calculateStatValue 
} from '../../utils/gameMechanics';
import { 
    updateUser, addPetToDB, updatePetInDB, createMarketListing, deleteMarketListing, 
    removePetFromDB, findUserPublic, trackQuestProgress, initializeUser
} from '../../utils/db';
import { auth } from '../../firebase'; 

// *** ADMOB INITIALISIERUNG HILFSVARIABLE ***
const AdMob = (() => {
    if (window.Capacitor) {
        try {
            return window.Capacitor.Plugins.AdMob;
        } catch (e) {
            console.warn("Capacitor AdMob Plugin not found in Plugins namespace.", e);
        }
    }
    return {
        prepareRewardVideoAd: (options) => new Promise(resolve => setTimeout(resolve, 50)), 
        showRewardVideoAd: (options) => new Promise(resolve => {
            setTimeout(() => resolve({ amount: 20, type: 'Energy' }), 500); 
        }),
    };
})();

export function useGameActions(state, setUserId) { 
    const { 
        user, setCurrentView, myPets, marketListings, setActiveBattle, setLootResult, 
        setNotification, setAuthLoading, setMyPets, setUser, selectedSlotForTeam
    } = state;

    const showNotification = (msg, type = 'error') => {
        setNotification({ message: msg, type });
        setTimeout(() => setNotification(null), 3000);
    };
    
    // --- AUTH AKTIONEN ---
    const handleLogin = async (firebaseUser, displayName) => { try { await initializeUser(firebaseUser, displayName); setUserId(firebaseUser.uid); } catch (error) { showNotification("Fehler beim Laden der Daten", "error"); setAuthLoading(false); } };
    const handleLogout = () => { auth.signOut(); setUser(null); setUserId(null); setMyPets([]); setCurrentView('auth'); };

    // --- GAME AKTIONEN ---
    const watchAdForReward = async () => { if (!user) return; const reward = SHOP_ITEMS.AD_REWARD_ENERGY; const maxEnergy = getMaxEnergy(user.level); if (user.energy >= maxEnergy) { showNotification("Energie ist bereits voll!", 'error'); return; } showNotification("Lade Belohnungs-Video...", 'info'); const adUnitId = 'ca-app-pub-3940256099942544/5224354917'; try { await AdMob.prepareRewardVideoAd({ adId: adUnitId }); showNotification("Video geladen. Starte Wiedergabe...", 'info'); } catch (e) { showNotification("Laden fehlgeschlagen (Fehler beim Vorbereiten).", 'error'); return; } try { const result = await AdMob.showRewardVideoAd(); if (result && result.amount) { const newEnergy = Math.min(maxEnergy, user.energy + reward.rewardAmount); await updateUser(user.id, { energy: newEnergy, lastEnergyUpdate: Date.now() }); showNotification(`Video angesehen: +${reward.rewardAmount} Energie!`, 'success'); } else { showNotification("Video nicht abgeschlossen oder abgebrochen.", 'error'); } } catch (e) { showNotification("Fehler beim Abspielen des Videos.", 'error'); } };
    const buyLootbox = (boxType, cost, currency) => { if (!user) return; if (currency === 'COINS') { if (user.coins < cost) { showNotification("Zu wenig Münzen!", 'error'); return; } const newInv = [...(user.inventory || []), { id: Date.now(), type: 'LOOTBOX', variant: boxType }]; updateUser(user.id, { coins: user.coins - cost, inventory: newInv }); trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, cost); } else { if (user.gems < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; } const newInv = [...(user.inventory || []), { id: Date.now(), type: 'LOOTBOX', variant: boxType }]; updateUser(user.id, { gems: user.gems - cost, inventory: newInv }); } showNotification(`${boxType} Box gekauft!`, 'success'); };
    const buyTickets = (item) => { if (!user) return; let cost = item.costAmount; let currency = item.costCurrency; if (currency === 'COINS' && (user.coins || 0) < cost) { showNotification("Zu wenig Münzen!", 'error'); return; } if (currency === 'GEMS' && (user.gems || 0) < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; } const newInventory = [...(user.inventory || [])]; for (let i = 0; i < item.tickets; i++) { newInventory.push({ id: Date.now() + Math.random() + i, type: 'TICKET', variant: 'BREED' }); } const updateData = {}; if (currency === 'COINS') { updateData.coins = user.coins - cost; } else if (currency === 'GEMS') { updateData.gems = user.gems - cost; } updateData.inventory = newInventory; updateUser(user.id, updateData); showNotification(`${item.tickets} Zucht-Tickets gekauft und im Inventar abgelegt!`, 'success'); };
    const handleRedeemTicket = async (ticketId) => { if (!user) return; const ticketItem = user.inventory.find(i => i.id === ticketId && i.type === 'TICKET'); if (!ticketItem) { showNotification("Ticket nicht gefunden.", 'error'); return; } const newInventory = user.inventory.filter(item => item.id !== ticketItem.id); await updateUser(user.id, { inventory: newInventory, redeemedTickets: (user.redeemedTickets || 0) + 1 }); showNotification(`1 Zucht-Ticket eingelöst! Du hast jetzt ${user.redeemedTickets + 1} Tickets.`, 'success'); };
    const startBattle = () => { if (!user) return; const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id)); if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); return; } if (user.energy < 1) { showNotification("Keine Energie!", 'error'); return; } updateUser(user.id, { energy: user.energy - 1 }); const myBattleTeam = validTeamIds.map(id => { const p = myPets.find(pet => pet.id === id); return { ...p, currentCd: 0, hp: p.maxHp }; }); const enemyBattleTeam = []; for (let i = 0; i < myBattleTeam.length; i++) { let enemyLevel = 1; if (user.level < 10) { enemyLevel = Math.max(1, user.level); } else { const variance = Math.floor(Math.random() * 7) - 3; enemyLevel = Math.max(1, user.level + variance); } let enemyRarity = 'COMMON'; const roll = Math.random() * 100; if (user.level >= 30 && roll > 90) enemyRarity = 'EPIC'; else if (user.level >= 20 && roll > 80) enemyRarity = 'RARE'; else if (user.level >= 10 && roll > 70) enemyRarity = 'UNCOMMON'; const enemyPet = generatePet(enemyLevel, null, enemyRarity, null, 'ENEMY'); enemyPet.id = `enemy_${i}_${Date.now()}`; if (enemyLevel === 1) { enemyPet.atk = 1; enemyPet.ap = 1; enemyPet.def = 1; enemyPet.res = 1; enemyPet.speed = 1; enemyPet.maxHp = 10; enemyPet.hp = 10; } else { const growthBonus = Math.floor(enemyLevel / 2); const hpGrowth = enemyLevel * 3; enemyPet.atk += growthBonus; enemyPet.ap += growthBonus; enemyPet.def += Math.floor(growthBonus / 2); enemyPet.res += Math.floor(growthBonus / 2); enemyPet.speed += Math.floor(growthBonus / 2); enemyPet.maxHp += hpGrowth; enemyPet.hp = enemyPet.maxHp; } enemyBattleTeam.push({ ...enemyPet, currentCd: 0, hp: enemyPet.maxHp }); } const p1 = myBattleTeam[0]; const e1 = enemyBattleTeam[0]; const playerFirst = p1.speed >= e1.speed; setActiveBattle({ myTeam: myBattleTeam, enemyTeam: enemyBattleTeam, myIndex: 0, enemyIndex: 0, log: [`Kampf gegen Level ${enemyBattleTeam[0].level} Gegner gestartet!`], turn: playerFirst ? 'PLAYER' : 'ENEMY', isOver: false, round: 1 }); setCurrentView('battle'); };
    const handleWin = async (reward, winningTeamIds, enemyRating = 1200) => { if (!user) return; const eloChange = calculateEloChange(user.rating || 1000, enemyRating, true); let newLevel = user.level || 1; let newXp = (user.xp || 0) + reward.xp; let newXpToNext = user.xpToNextLevel || 100; let newCoins = (user.coins || 0) + reward.coins; let newGems = user.gems || 0; let newEnergy = user.energy || 0; while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; newEnergy = Math.min(getMaxEnergy(newLevel), newEnergy + 2); } await updateUser(user.id, { coins: newCoins, gems: newGems, rating: (user.rating || 1000) + eloChange, xp: newXp, level: newLevel, xpToNextLevel: newXpToNext, energy: newEnergy, stats: { ...user.stats, pvpWins: (user.stats?.pvpWins || 0) + 1, pvpTotal: (user.stats?.pvpTotal || 0) + 1 } }); trackQuestProgress(user, QUEST_TYPES.WIN_PVP, 1); trackQuestProgress(user, QUEST_TYPES.EARN_XP, reward.xp); const idsToLevel = winningTeamIds || (state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : []); idsToLevel.forEach(petId => { const pet = myPets.find(p => p.id === petId); if(pet) { let pXp = (pet.xp || 0) + 50; let pLevel = pet.level || 1; let pMaxXp = pet.maxXp || 100; let changes = {}; if (!pet.b_hp) { const reverseCalc = (val, lvl) => Math.max(1, Math.floor((val || 10) / (1 + ((lvl || 1) - 1) * 0.1))); pet.b_hp = reverseCalc(pet.maxHp, pLevel); } if (pXp >= pMaxXp) { pLevel++; pXp -= pMaxXp; pMaxXp = Math.floor(pMaxXp * 1.2); const rarityKey = pet.rarity || 'COMMON'; const rarityInfo = RARITIES[rarityKey] || RARITIES.COMMON; const rId = rarityInfo.id; const getBoost = () => Math.floor(Math.random() * 2) + rId; const newMaxHp = (pet.maxHp || 10) + getBoost() + 2; changes = { level: pLevel, xp: pXp, maxXp: pMaxXp, maxHp: newMaxHp, hp: newMaxHp, atk: (pet.atk || 1) + getBoost(), ap: (pet.ap || 1) + getBoost(), def: (pet.def || 1) + getBoost(), res: (pet.res || 1) + getBoost(), speed: (pet.speed || 1) + getBoost() }; } else { changes = { xp: pXp }; } updatePetInDB(petId, changes); } }); setCurrentView('arena-hub'); };
    const handleLose = async (enemyRating = 1200) => { if (!user) return; const eloChange = calculateEloChange(user.rating || 1000, enemyRating, false); const lossReward = { xp: 10, coins: 5 }; const petXpGain = 10; let newLevel = user.level || 1; let newXp = (user.xp || 0) + lossReward.xp; let newXpToNext = user.xpToNextLevel || 100; let newCoins = (user.coins || 0) + lossReward.coins; let newGems = user.gems || 0; let newEnergy = user.energy || 0; while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; newEnergy = Math.min(getMaxEnergy(newLevel), newEnergy + 2); } await updateUser(user.id, { rating: Math.max(0, (user.rating || 1000) + eloChange), xp: newXp, level: newLevel, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, energy: newEnergy, stats: { ...user.stats, pvpTotal: (user.stats?.pvpTotal || 0) + 1 } }); const idsToLevel = state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : []; idsToLevel.forEach(petId => { const pet = myPets.find(p => p.id === petId); if(pet) { let pXp = (pet.xp || 0) + petXpGain; let pLevel = pet.level || 1; let pMaxXp = pet.maxXp || 100; let changes = {}; if (!pet.b_hp) { const reverseCalc = (val, lvl) => Math.max(1, Math.floor((val || 10) / (1 + ((lvl || 1) - 1) * 0.1))); pet.b_hp = reverseCalc(pet.maxHp, pLevel); } if (pXp >= pMaxXp) { pLevel++; pXp -= pMaxXp; pMaxXp = Math.floor(pMaxXp * 1.2); const rarityKey = pet.rarity || 'COMMON'; const rarityInfo = RARITIES[rarityKey] || RARITIES.COMMON; const rId = rarityInfo.id; const getBoost = () => Math.floor(Math.random() * 2) + rId; const newMaxHp = (pet.maxHp || 10) + getBoost() + 2; changes = { ...changes, level: pLevel, xp: pXp, maxXp: pMaxXp, maxHp: newMaxHp, hp: newMaxHp, atk: (pet.atk || 1) + getBoost(), ap: (pet.ap || 1) + getBoost(), def: (pet.def || 1) + getBoost(), res: (pet.res || 1) + getBoost(), speed: (pet.speed || 1) + getBoost() }; } else { changes = { ...changes, xp: pXp }; } updatePetInDB(petId, changes); } }); setCurrentView('arena-hub'); };
    const handleAddFriend = async (friendId) => { if (!user || !friendId || friendId === user.id) return; const foundUser = await findUserPublic(friendId); if (foundUser) { const newFriends = [...(user.friends || []), { id: foundUser.id, username: foundUser.username, avatar: foundUser.avatar, level: foundUser.level, rating: foundUser.rating }]; updateUser(user.id, { friends: newFriends }); showNotification(`${foundUser.username} hinzugefügt!`, 'success'); } else { showNotification("Spieler nicht gefunden.", 'error'); } };
    const handleBuyMarket = async (listingId) => { if (!user) return; const listing = marketListings.find(l => l.id === listingId); if (!listing || user.coins < listing.price) { showNotification("Fehler oder zu wenig Münzen.", 'error'); return; } await updateUser(user.id, { coins: user.coins - listing.price, stats: { ...user.stats, marketSpent: user.stats.marketSpent + listing.price } }); await addPetToDB({ ...listing.pet, id: Date.now().toString(), ownerId: user.id }, user.id); await deleteMarketListing(listingId); showNotification(`Gekauft: ${listing.pet.name}`, 'success'); };
    const handleSellMarket = async (petId, price) => { if (!user) return; const pet = myPets.find(p => p.id === petId); if (!pet) return; const newListing = { sellerName: user.username, sellerId: user.id, price: price, pet: pet, createdAt: Date.now() }; await createMarketListing(newListing); await removePetFromDB(petId); showNotification("Angebot erstellt!", 'success'); };
    const addToTeam = (petId) => { if (!user || selectedSlotForTeam === null) return; const pet = myPets.find(p => p.id === petId); if (pet?.isEgg) { showNotification("Eier kämpfen nicht!", 'error'); return; } const newTeam = [...(user.team || [])]; while(newTeam.length <= selectedSlotForTeam) newTeam.push(null); newTeam[state.selectedSlotForTeam] = petId; updateUser(user.id, { team: newTeam }); setCurrentView('team-edit'); state.setSelectedSlotForTeam(null); };
    const removeFromTeam = (index) => { if (!user) return; const newTeam = [...user.team]; newTeam[index] = null; updateUser(user.id, { team: newTeam }); };
    const hatchEgg = (petId, customName) => { if (!user) return; const pet = myPets.find(p => p.id === petId); if (!pet || !pet.isEgg || Date.now() < pet.hatchAt) return; updatePetInDB(petId, { isEgg: false, name: customName || pet.name }); updateUser(user.id, { stats: { ...user.stats, hatched: user.stats.hatched + 1 } }); trackQuestProgress(user, QUEST_TYPES.HATCH_EGG, 1); showNotification(`Geschlüpft: ${customName || pet.name}!`, 'success'); };
    
    // --- MODIFIZIERTE startIncubation ---
    const startIncubation = async (id, type) => { 
        if (!user) return null; // Return null bei Fehler
        
        if (type === 'BOX') { 
            const box = user.inventory.find(i => i.id === id); 
            if (!box) return null; 
            
            const newInv = user.inventory.filter(i => i.id !== id); 
            const newPet = generatePet(1, null, determineRarity(box.variant), null, box.variant === 'STARTER' ? 'STARTER' : 'SHOP'); 
            newPet.isEgg = box.variant !== 'STARTER'; 
            newPet.hatchAt = 0; 
            
            await addPetToDB(newPet, user.id); 
            await updateUser(user.id, { inventory: newInv }); 
            
            // KEIN setLootResult MEHR! Wir geben das Pet zurück.
            return newPet; 

        } else { 
            const pet = myPets.find(p => p.id === id); 
            if (myPets.filter(p => p.isEgg && p.hatchAt > 0).length >= getUnlockedHatcherySlots(user.level)) { 
                showNotification("Brutstätte voll!", 'error'); return null; 
            } 
            
            await updatePetInDB(id, { hatchAt: Date.now() + RARITIES[pet.rarity].hatchDuration }); 
            trackQuestProgress(user, QUEST_TYPES.HATCH_EGG, 1); 
            
            setCurrentView('hatchery'); 
            showNotification("Inkubation gestartet!", 'success'); 
            return null;
        } 
    };
    
    const breedPets = async (parent1Id, parent2Id) => { 
        if (!user || (user.redeemedTickets || 0) < 1) { showNotification("Kein Ticket!", 'error'); return; }
        
        // Brutstätte Check
        if (myPets.filter(p => p.isEgg && p.hatchAt > 0).length >= getUnlockedHatcherySlots(user.level)) {
            showNotification("Brutstätte ist voll!", 'error'); return;
        }

        const p1 = myPets.find(p => p.id === parent1Id);
        const p2 = myPets.find(p => p.id === parent2Id);
        
        const cd1 = RARITIES[p1.rarity].breedCooldown;
        const cd2 = RARITIES[p2.rarity].breedCooldown;

        if ((p1.bredAt || 0) + cd1 > Date.now()) { showNotification(`${p1.name} braucht eine Pause!`, 'error'); return; }
        if ((p2.bredAt || 0) + cd2 > Date.now()) { showNotification(`${p2.name} braucht eine Pause!`, 'error'); return; }
        
        await updateUser(user.id, { redeemedTickets: user.redeemedTickets - 1, stats: { ...user.stats, bred: (user.stats?.bred || 0) + 1 } }); 
        trackQuestProgress(user, QUEST_TYPES.BREED_PET, 1);
        
        await updatePetInDB(p1.id, { bredAt: Date.now() });
        await updatePetInDB(p2.id, { bredAt: Date.now() });
        
        const child = generatePet(1, p1.type, calculateBreedRarity(p1.rarity, p2.rarity), null, 'BREEDING');
        child.isEgg = true;
        child.hatchAt = Date.now() + RARITIES[child.rarity].hatchDuration; 
        
        await addPetToDB(child, user.id); 
        setCurrentView('hatchery'); 
        showNotification("Zucht erfolgreich!", 'success'); 
    };

    return {
        showNotification, handleLogin, handleLogout,
        watchAdForReward, buyLootbox, buyTickets, handleRedeemTicket, 
        startBattle, handleWin, handleLose, handleAddFriend, 
        handleBuyMarket, handleSellMarket, addToTeam, removeFromTeam, 
        hatchEgg, startIncubation, breedPets
    };
}