import { RARITIES, QUEST_TYPES, SHOP_ITEMS } from '../../data/gameData';
import { generatePet, calculateEloChange, getUnlockedHatcherySlots, getMaxEnergy, determineRarity, calculateBreedRarity } from '../../utils/gameMechanics';
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
    // FALLBACK für Web-App
    return {
        prepareRewardVideoAd: (options) => new Promise(resolve => setTimeout(resolve, 50)), 
        showRewardVideoAd: (options) => new Promise(resolve => {
            setTimeout(() => resolve({ amount: 20, type: 'Energy' }), 500); 
        }),
    };
})();
// *** ENDE ADMOB HILFSVARIABLE ***

export function useGameActions(state, setUserId) { // setPreviousLevel entfernt, da nicht benötigt
    const { 
        user, setCurrentView, myPets, marketListings, setActiveBattle, setLootResult, 
        setNotification, setAuthLoading, setMyPets, previousLevel, setUser, selectedSlotForTeam
    } = state;

    const showNotification = (msg, type = 'error') => {
        setNotification({ message: msg, type });
        setTimeout(() => setNotification(null), 3000);
    };
    
    // --- AUTH AKTIONEN ---
    const handleLogin = async (firebaseUser, displayName) => {
        try {
            await initializeUser(firebaseUser, displayName);
            setUserId(firebaseUser.uid); 
        } catch (error) {
            showNotification("Fehler beim Laden der Daten", "error");
            setAuthLoading(false);
        }
    };
    
    const handleLogout = () => { 
        auth.signOut(); 
        setUser(null); 
        setUserId(null); 
        setMyPets([]); 
        setCurrentView('auth'); 
    };

    // --- GAME AKTIONEN (mit Guard Clauses) ---

    // HINWEIS: Alle Funktionen ab hier benötigen den Guard Clause, da sie auf 'user' zugreifen.

    const watchAdForReward = async () => {
        if (!user) return; // <-- GUARD
        
        const reward = SHOP_ITEMS.AD_REWARD_ENERGY;
        const maxEnergy = getMaxEnergy(user.level);
    
        if (user.energy >= maxEnergy) {
            showNotification("Energie ist bereits voll!", 'error');
            return;
        }
    
        showNotification("Lade Belohnungs-Video...", 'info');
        const adUnitId = 'ca-app-pub-3940256099942544/5224354917'; 
    
        try {
            await AdMob.prepareRewardVideoAd({ adId: adUnitId });
            showNotification("Video geladen. Starte Wiedergabe...", 'info');
        } catch (e) {
            showNotification("Laden fehlgeschlagen (Fehler beim Vorbereiten).", 'error');
            return; 
        }
        
        try {
            const result = await AdMob.showRewardVideoAd();
    
            if (result && result.amount) { 
                const newEnergy = Math.min(maxEnergy, user.energy + reward.rewardAmount);
                await updateUser(user.id, { energy: newEnergy, lastEnergyUpdate: Date.now() });
                showNotification(`Video angesehen: +${reward.rewardAmount} Energie!`, 'success');
            } else {
                 showNotification("Video nicht abgeschlossen oder abgebrochen.", 'error');
            }
        } catch (e) {
            showNotification("Fehler beim Abspielen des Videos.", 'error');
        }
    };
    
    const buyLootbox = (boxType, cost, currency) => {
        if (!user) return; // <-- GUARD
        
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
        if (!user) return; // <-- GUARD
        
        let cost = item.costAmount;
        let currency = item.costCurrency;
        
        if (currency === 'COINS' && (user.coins || 0) < cost) { showNotification("Zu wenig Münzen!", 'error'); return; }
        if (currency === 'GEMS' && (user.gems || 0) < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; }

        const newInventory = [...(user.inventory || [])];
        for (let i = 0; i < item.tickets; i++) {
            newInventory.push({ id: Date.now() + Math.random() + i, type: 'TICKET', variant: 'BREED' });
        }

        const updateData = {};
        if (currency === 'COINS') { updateData.coins = user.coins - cost; } 
        else if (currency === 'GEMS') { updateData.gems = user.gems - cost; }
        updateData.inventory = newInventory;

        updateUser(user.id, updateData); 
        
        showNotification(`${item.tickets} Zucht-Tickets gekauft und im Inventar abgelegt!`, 'success');
    };

    const handleRedeemTicket = async (ticketId) => {
        if (!user) return; // <-- GUARD
        
        const ticketItem = user.inventory.find(i => i.id === ticketId && i.type === 'TICKET');
        if (!ticketItem) { showNotification("Ticket nicht gefunden.", 'error'); return; }
        
        const newInventory = user.inventory.filter(item => item.id !== ticketItem.id);
        
        await updateUser(user.id, {
            inventory: newInventory,
            redeemedTickets: (user.redeemedTickets || 0) + 1
        });
        showNotification(`1 Zucht-Ticket eingelöst! Du hast jetzt ${user.redeemedTickets + 1} Tickets.`, 'success');
    };
    
    const startBattle = () => {
        if (!user) return; // <-- GUARD
        
        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
        if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); return; }
        if (user.energy < 1) { showNotification("Keine Energie!", 'error'); return; }
        
        updateUser(user.id, { energy: user.energy - 1 });
        
        const myBattleTeam = validTeamIds.map(id => { const p = myPets.find(pet => pet.id === id); return { ...p, currentCd: 0, hp: p.maxHp }; });
        const enemyBattleTeam = [];
        const avgLevel = Math.floor(myBattleTeam.reduce((acc, p) => acc + p.level, 0) / myBattleTeam.length);
        for (let i = 0; i < myBattleTeam.length; i++) { const enemyLevel = Math.max(1, avgLevel + Math.floor(Math.random() * 3) - 1); const enemyPet = generatePet(enemyLevel); enemyPet.id = `enemy_${i}`; enemyPet.name = 'Feindl. ' + enemyPet.name; enemyBattleTeam.push({ ...enemyPet, currentCd: 0 }); }
        
        const p1 = myBattleTeam[0]; const e1 = enemyBattleTeam[0]; const playerFirst = p1.speed >= e1.speed;
        setActiveBattle({ myTeam: myBattleTeam, enemyTeam: enemyBattleTeam, myIndex: 0, enemyIndex: 0, log: [`Kampf gestartet!`], turn: playerFirst ? 'PLAYER' : 'ENEMY', isOver: false, round: 1 });
        setCurrentView('battle');
    };

    const handleWin = async (reward, winningTeamIds, enemyRating = 1200) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik (greift auf user zu)
        const eloChange = calculateEloChange(user.rating, enemyRating, true);
        
        let newLevel = user.level;
        let newXp = user.xp + reward.xp;
        let newXpToNext = user.xpToNextLevel;
        let newCoins = user.coins + reward.coins;
        let newGems = user.gems;
        let newEnergy = user.energy;
        
        if (newXp >= newXpToNext) {
            newLevel++;
            newXp -= newXpToNext;
            newXpToNext = Math.floor(newXpToNext * 1.5);
            newCoins += 1000;
            newGems += 5;
            newEnergy = Math.min(getMaxEnergy(newLevel), newEnergy + 2);
        }

        await updateUser(user.id, {
            coins: newCoins, gems: newGems, rating: user.rating + eloChange, xp: newXp, level: newLevel, xpToNextLevel: newXpToNext, energy: newEnergy,
            stats: { ...user.stats, pvpWins: user.stats.pvpWins + 1, pvpTotal: user.stats.pvpTotal + 1 }
        });

        trackQuestProgress(user, QUEST_TYPES.WIN_PVP, 1);
        trackQuestProgress(user, QUEST_TYPES.EARN_XP, reward.xp);

        const idsToLevel = winningTeamIds || (state.activeBattle ? state.activeBattle.myTeam.map(p => p.id) : []);
        
        idsToLevel.forEach(petId => {
            const pet = myPets.find(p => p.id === petId);
            if(pet) {
                let pXp = pet.xp + 50;
                let pLevel = pet.level;
                let pMaxXp = pet.maxXp;
                let changes = {};
                
                if (pXp >= pMaxXp) {
                    pLevel++;
                    pXp -= pMaxXp;
                    pMaxXp = Math.floor(pMaxXp * 1.2);
                    const r = RARITIES[pet.rarity].multi;
                    const gf = 1 + (0.05 * r);
                    changes = { level: pLevel, xp: pXp, maxXp: pMaxXp, maxHp: Math.floor(pet.maxHp * gf), hp: Math.floor(pet.maxHp * gf), atk: Math.floor(pet.atk * gf), ap: Math.floor(pet.ap * gf), def: Math.floor(pet.def * gf), res: Math.floor(pet.res * gf), speed: Math.floor(pet.speed * gf) };
                } else {
                    changes = { xp: pXp };
                }
                updatePetInDB(petId, changes);
            }
        });

        setCurrentView('arena-hub');
    };

    const handleLose = (enemyRating = 1200) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        const eloChange = calculateEloChange(user.rating, enemyRating, false);
        updateUser(user.id, {
            rating: Math.max(0, user.rating + eloChange),
            stats: { ...user.stats, pvpTotal: user.stats.pvpTotal + 1 }
        });
        setCurrentView('arena-hub');
    };

    const handleAddFriend = async (friendId) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        if (!friendId) return;
        if (friendId === user.id) { showNotification("Nicht selbst hinzufügen.", 'error'); return; }
        if (user.friends && user.friends.find(f => f.id === friendId)) { showNotification("Bereits befreundet.", 'error'); return; }
        
        const foundUser = await findUserPublic(friendId);
        if (foundUser) {
            const newFriends = [...(user.friends || []), { id: foundUser.id, username: foundUser.username, avatar: foundUser.avatar, level: foundUser.level, rating: foundUser.rating }];
            updateUser(user.id, { friends: newFriends });
            showNotification(`${foundUser.username} hinzugefügt!`, 'success');
        } else { 
            showNotification("Spieler nicht gefunden.", 'error'); 
        }
    };

    const handleBuyMarket = async (listingId) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        const listing = marketListings.find(l => l.id === listingId);
        if (!listing) return;
        if (user.coins < listing.price) { showNotification("Nicht genug Münzen!", 'error'); return; }

        await updateUser(user.id, { 
            coins: user.coins - listing.price, 
            stats: { ...user.stats, marketSpent: user.stats.marketSpent + listing.price } 
        });
        trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, listing.price);

        const newPet = { ...listing.pet, id: Date.now().toString(), ownerId: user.id };
        await addPetToDB(newPet, user.id);
        await deleteMarketListing(listingId);

        showNotification(`Erfolgreich gekauft: ${newPet.name}`, 'success');
    };

    const handleSellMarket = async (petId, price) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;
        const newListing = { sellerName: user.username, sellerId: user.id, price: price, pet: pet, createdAt: Date.now() };
        await createMarketListing(newListing);
        await removePetFromDB(petId);
        showNotification("Angebot erstellt!", 'success');
    };

    const addToTeam = (petId) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        if (state.selectedSlotForTeam === null) return;
        const pet = myPets.find(p => p.id === petId);
        if (pet && pet.isEgg) { showNotification("Eier können nicht kämpfen!", 'error'); return; }
        
        const newTeam = [...(user.team || [])];
        while(newTeam.length <= state.selectedSlotForTeam) { newTeam.push(null); }
        
        const existingIndex = newTeam.indexOf(petId);
        if (existingIndex !== -1) { newTeam[existingIndex] = null; }
        
        newTeam[state.selectedSlotForTeam] = petId;
        updateUser(user.id, { team: newTeam });
        setCurrentView('team-edit');
        state.setSelectedSlotForTeam(null);
    };

    const removeFromTeam = (index) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        const newTeam = [...user.team];
        newTeam[index] = null;
        updateUser(user.id, { team: newTeam });
    };

    const hatchEgg = (petId, customName) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        const pet = myPets.find(p => p.id === petId);
        if (!pet || !pet.isEgg) return;
        if (Date.now() < pet.hatchAt) { showNotification("Noch nicht bereit!", 'error'); return; }
        
        updatePetInDB(petId, { isEgg: false, name: customName || pet.name });
        updateUser(user.id, { stats: { ...user.stats, hatched: user.stats.hatched + 1 } });
        trackQuestProgress(user, QUEST_TYPES.HATCH_EGG, 1);
        
        showNotification(`Geschlüpft: ${customName || pet.name}!`, 'success');
    };

    const startIncubation = (id, type) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        if (type === 'BOX') {
            const box = user.inventory.find(i => i.id === id);
            if (!box) return;
            
            const newInv = user.inventory.filter(i => i.id !== id);
            const rarityKey = determineRarity(box.variant);
            const isStarter = box.variant === 'STARTER';

            const newPet = generatePet(1, null, rarityKey, null, isStarter ? 'STARTER' : 'SHOP');
            newPet.isEgg = !isStarter; 
            newPet.hatchAt = 0; 
            
            addPetToDB(newPet, user.id);

            if (isStarter) {
                updateUser(user.id, { inventory: newInv, team: [newPet.id] });
                showNotification("Dein erstes Pet ist bereit!", "success");
            } else {
                updateUser(user.id, { inventory: newInv });
            }
            
            setLootResult(newPet);
        } else {
            const incubatingEggs = myPets.filter(p => p.isEgg && p.hatchAt > 0).length;
            const maxSlots = getUnlockedHatcherySlots(user.level);
            if (incubatingEggs >= maxSlots) { showNotification("Brutstätte voll!", 'error'); return; }
            
            const pet = myPets.find(p => p.id === id);
            const duration = RARITIES[pet.rarity].hatchDuration * 1000;
            updatePetInDB(id, { hatchAt: Date.now() + duration });
            trackQuestProgress(user, QUEST_TYPES.HATCH_EGG, 1);
            
            setCurrentView('hatchery');
            showNotification("Inkubation gestartet!", 'success');
        }
    };

    const breedPets = async (parent1Id, parent2Id) => {
        if (!user) return; // <-- GUARD
        // ... Rest der Logik
        const p1 = myPets.find(p => p.id === parent1Id);
        const p2 = myPets.find(p => p.id === parent2Id);
        
        const cooldownDuration = 24 * 60 * 60 * 1000; 
        const now = Date.now();
        
        const p1CooldownEnd = (p1.bredAt || 0) + cooldownDuration;
        const p2CooldownEnd = (p2.bredAt || 0) + cooldownDuration;

        if ((user.redeemedTickets || 0) < 1) { 
            showNotification("Nicht genug Zucht-Tickets! Bitte im Inventar einlösen.", 'error'); 
            return; 
        }

        if (p1CooldownEnd > now || p2CooldownEnd > now) {
            showNotification("Wartezeit der Eltern ist noch nicht abgelaufen!", 'error'); 
            return;
        }
        
        await updateUser(user.id, { redeemedTickets: user.redeemedTickets - 1, stats: { ...user.stats, bred: (user.stats?.bred || 0) + 1 } }); 
        trackQuestProgress(user, QUEST_TYPES.BREED_PET, 1);
        
        const cooldownTime = Date.now();
        await updatePetInDB(p1.id, { bredAt: cooldownTime });
        await updatePetInDB(p2.id, { bredAt: cooldownTime });
        
        const parentTypes = [p1.type];
        if (p1.secondaryType) parentTypes.push(p1.secondaryType);
        if (!parentTypes.includes(p2.type)) parentTypes.push(p2.type);
        if (p2.secondaryType && !parentTypes.includes(p2.secondaryType)) parentTypes.push(p2.secondaryType);
        
        let childType = p1.type;
        let childSecType = null;
        
        if (parentTypes.length > 1 && Math.random() <= 0.05) {
            const t1Index = Math.floor(Math.random() * parentTypes.length);
            childType = parentTypes[t1Index];
            let t2Index = Math.floor(Math.random() * parentTypes.length);
            while(t2Index === t1Index) { t2Index = Math.floor(Math.random() * parentTypes.length); }
            childSecType = parentTypes[t2Index];
        } else {
            childType = parentTypes[Math.floor(Math.random() * parentTypes.length)];
        }

        const childAbilityId = Math.random() > 0.5 ? p1.abilityId : p2.abilityId;
        const babyRarityKey = calculateBreedRarity(p1.rarity, p2.rarity); 

        const mixStat = (s1, s2) => Math.floor((s1 + s2) / 2 * (0.9 + Math.random() * 0.3)); 
        const inherited = { hp: mixStat(p1.b_hp, p2.b_hp), atk: mixStat(p1.b_atk, p2.b_atk), ap: mixStat(p1.b_ap, p2.b_ap), def: mixStat(p1.b_def, p2.b_def), res: mixStat(p1.b_res, p2.b_res), speed: mixStat(p1.b_speed, p2.b_speed) };

        const finalPet = generatePet(1, childType, babyRarityKey, inherited, 'BREEDING');
        finalPet.secondaryType = childSecType; 
        finalPet.abilityId = childAbilityId; 
        finalPet.name = "Zucht " + finalPet.name; 

        const duration = RARITIES[finalPet.rarity].hatchDuration * 1000;
        finalPet.isEgg = true;
        finalPet.hatchAt = Date.now() + duration; 
        
        await addPetToDB(finalPet, user.id);
        
        setCurrentView('hatchery');
        showNotification(`Zucht erfolgreich! Ei startet Inkubation.`, 'success');
    };

    return {
        showNotification, handleLogin, handleLogout,
        watchAdForReward, buyLootbox, buyTickets, handleRedeemTicket, 
        startBattle, handleWin, handleLose, handleAddFriend, handleBuyMarket, handleSellMarket, 
        addToTeam, removeFromTeam, hatchEgg, startIncubation, breedPets
    };
}