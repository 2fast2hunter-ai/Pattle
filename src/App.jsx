import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth'; // NEU: Für Auto-Login
import { auth } from './firebase'; // NEU: Unsere Auth-Instanz

// Daten & Logik
import { RARITIES, QUEST_TYPES } from './data/gameData';
import { generatePet, calculateEloChange, getUnlockedHatcherySlots, getMaxEnergy, determineRarity } from './utils/gameMechanics';
// Datenbank Funktionen
import { 
  initializeUser, listenToUser, listenToPets, listenToMarket, updateUser, 
  addPetToDB, updatePetInDB, createMarketListing, deleteMarketListing, 
  removePetFromDB, findUserPublic, trackQuestProgress
} from './utils/db';

// Components
import { HeaderHUD, BottomNav } from './components/GameLayout';
import { LootboxModal, LevelUpModal } from './components/GameModals';

// Screens
import AuthScreen from './screens/AuthScreen';
import MainMenu from './screens/MainMenu';
import ArenaHub from './screens/ArenaHub';
import PetHub from './screens/PetHub';
import ShopScreen from './screens/ShopScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import InventoryScreen from './screens/InventoryScreen';
import ItemInventoryScreen from './screens/ItemInventoryScreen';
import HatcheryScreen from './screens/HatcheryScreen';
import TeamEditScreen from './screens/TeamEditScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import BreedingScreen from './screens/BreedingScreen';
import BattleScreen from './screens/BattleScreen';
import ProfileScreen from './screens/ProfileScreen';
import FriendProfileScreen from './screens/FriendProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import QuestsScreen from './screens/QuestsScreen';

// Error Boundary für Absturzsicherheit
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
    render() {
      if (this.state.hasError) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Ups, ein Fehler ist aufgetreten!</h1>
            <p className="text-slate-400 mb-6 text-sm">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"><RefreshCw className="w-5 h-5"/> Spiel neu laden</button>
          </div>
        );
      }
      return this.props.children; 
    }
}

// MAIN APP
export default function GameApp() {
  const [user, setUser] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const [currentView, setCurrentView] = useState('auth'); 
  const [authLoading, setAuthLoading] = useState(true); // NEU: Ladezustand beim Start
  
  const [myPets, setMyPets] = useState([]);
  const [marketListings, setMarketListings] = useState([]);
  
  const [activeBattle, setActiveBattle] = useState(null);
  const [selectedPetDetail, setSelectedPetDetail] = useState(null);
  const [settings, setSettings] = useState({ music: true, sfx: true, notifications: false });
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [selectedSlotForTeam, setSelectedSlotForTeam] = useState(null);
  const [notification, setNotification] = useState(null);
  const [lootResult, setLootResult] = useState(null); 
  const [selectedFriend, setSelectedFriend] = useState(null);

  // --- AUTO LOGIN CHECK ---
  useEffect(() => {
    // Prüft beim Start, ob der User noch eingeloggt ist
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            // User gefunden! Wir loggen ihn direkt ein.
            // displayName kann null sein beim Reload, das ist okay, initializeUser holt den Namen aus der DB.
            await handleLogin(currentUser, currentUser.displayName);
        } else {
            // Kein User gefunden -> Login Screen
            setAuthLoading(false);
        }
    });

    return () => unsubscribe();
  }, []);

  // --- INITIAL DATA & LISTENERS ---
  useEffect(() => {
      if (marketListings.length === 0) {
          // Initiale Dummy-Werte für den Markt (nur UI Test)
          // setMarketListings([...]); 
      }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubscribeUser = listenToUser(userId, (userData) => {
        setUser(userData);
        setAuthLoading(false); // Ladebildschirm beenden sobald User-Daten da sind
    });
    const unsubscribePets = listenToPets(userId, (petsData) => setMyPets(petsData));
    const unsubscribeMarket = listenToMarket((listingsData) => setMarketListings(listingsData));

    return () => {
        unsubscribeUser();
        unsubscribePets();
        unsubscribeMarket();
    };
  }, [userId]);

  const showNotification = (msg, type = 'error') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (firebaseUser, displayName) => {
    try {
        await initializeUser(firebaseUser, displayName);
        setUserId(firebaseUser.uid); 
        setCurrentView('menu');
        // Hinweis: setAuthLoading(false) passiert oben im useEffect, sobald die Daten geladen sind
    } catch (error) {
        console.error("Login Fehler:", error);
        showNotification("Fehler beim Laden der Daten", "error");
        setAuthLoading(false);
    }
  };

  const handleLogout = () => { 
      auth.signOut(); // WICHTIG: Auch bei Firebase ausloggen!
      setUser(null); 
      setUserId(null); 
      setMyPets([]); 
      setCurrentView('auth'); 
  };

  // ENERGY REGENERATION
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
        const now = Date.now();
        const msPerEnergy = 1000 * 60 * 5; // 5 Minuten
        const timeDiff = now - user.lastEnergyUpdate;
        
        if (timeDiff >= msPerEnergy) {
            const energyToGain = Math.floor(timeDiff / msPerEnergy);
            const maxEn = getMaxEnergy(user.level);
            
            if (user.energy < maxEn) {
                 const newEnergy = Math.min(maxEn, user.energy + energyToGain);
                 const newLastUpdate = user.lastEnergyUpdate + (energyToGain * msPerEnergy);
                 updateUser(user.id, { energy: newEnergy, lastEnergyUpdate: newLastUpdate });
            } else { 
                 updateUser(user.id, { lastEnergyUpdate: now });
            }
        }
    }, 10000); 
    return () => clearInterval(interval);
  }, [user]);

  // --- ACTIONS ---

  const handleAddFriend = async (friendId) => {
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
      const pet = myPets.find(p => p.id === petId);
      if (!pet) return;
      const newListing = { sellerName: user.username, sellerId: user.id, price: price, pet: pet, createdAt: Date.now() };
      await createMarketListing(newListing);
      await removePetFromDB(petId);
      showNotification("Angebot erstellt!", 'success');
  };

  const addToTeam = (petId) => {
    if (selectedSlotForTeam === null) return;
    const pet = myPets.find(p => p.id === petId);
    if (pet && pet.isEgg) { showNotification("Eier können nicht kämpfen!", 'error'); return; }
    
    const newTeam = [...(user.team || [])];
    while(newTeam.length <= selectedSlotForTeam) { newTeam.push(null); }
    
    const existingIndex = newTeam.indexOf(petId);
    if (existingIndex !== -1) { newTeam[existingIndex] = null; }
    
    newTeam[selectedSlotForTeam] = petId;
    updateUser(user.id, { team: newTeam });
    setCurrentView('team-edit');
    setSelectedSlotForTeam(null);
  };

  const removeFromTeam = (index) => {
    const newTeam = [...user.team];
    newTeam[index] = null;
    updateUser(user.id, { team: newTeam });
  };

  const hatchEgg = (petId, customName) => {
    const pet = myPets.find(p => p.id === petId);
    if (!pet || !pet.isEgg) return;
    if (Date.now() < pet.hatchAt) { showNotification("Noch nicht bereit!", 'error'); return; }
    
    updatePetInDB(petId, { isEgg: false, name: customName || pet.name });
    updateUser(user.id, { stats: { ...user.stats, hatched: user.stats.hatched + 1 } });
    trackQuestProgress(user, QUEST_TYPES.HATCH_EGG, 1);
    
    showNotification(`Geschlüpft: ${customName || pet.name}!`, 'success');
  };

  const startIncubation = (id, type) => {
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
        
        showNotification("Inkubation gestartet!", 'success');
        setCurrentView('hatchery');
    }
  }

  const breedPets = async (parent1Id, parent2Id) => {
    if (user.coins < 200) { showNotification("Nicht genug Münzen!", 'error'); return; }
    
    const p1 = myPets.find(p => p.id === parent1Id);
    const p2 = myPets.find(p => p.id === parent2Id);
    
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
    } else { childType = parentTypes[Math.floor(Math.random() * parentTypes.length)]; }

    const childAbilityId = Math.random() > 0.5 ? p1.abilityId : p2.abilityId;
    const rarityKeys = Object.keys(RARITIES);
    const p1Idx = RARITIES[p1.rarity].id - 1;
    const p2Idx = RARITIES[p2.rarity].id - 1;
    let newRarityIdx = Math.floor((p1Idx + p2Idx) / 2);
    if (Math.random() > 0.85 && newRarityIdx < 9) newRarityIdx++;
    const babyRarityKey = rarityKeys[newRarityIdx];

    const mixStat = (s1, s2) => Math.floor((s1 + s2) / 2 * (0.9 + Math.random() * 0.3)); 
    const inherited = { hp: mixStat(p1.b_hp, p2.b_hp), atk: mixStat(p1.b_atk, p2.b_atk), ap: mixStat(p1.b_ap, p2.b_ap), def: mixStat(p1.b_def, p2.b_def), res: mixStat(p1.b_res, p2.b_res), speed: mixStat(p1.b_speed, p2.b_speed) };

    const finalPet = generatePet(1, childType, babyRarityKey, inherited, 'BREEDING');
    finalPet.secondaryType = childSecType; 
    finalPet.abilityId = childAbilityId; 
    finalPet.name = "Zucht " + finalPet.name; 
    finalPet.isEgg = true; 
    finalPet.hatchAt = 0; 

    await addPetToDB(finalPet, user.id);
    await updateUser(user.id, { 
        coins: user.coins - 200, 
        stats: { ...user.stats, bred: user.stats.bred + 1 }
    });
    trackQuestProgress(user, QUEST_TYPES.BREED_PET, 1);
    trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, 200);
    
    showNotification(`Zucht erfolgreich!`, 'success');
    setCurrentView('item-inventory'); 
  };
  
  const buyLootbox = (boxType, cost, currency) => {
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

  const startBattle = () => {
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
        setTimeout(() => setShowLevelUpModal(true), 500);
    }

    await updateUser(user.id, {
        coins: newCoins,
        gems: newGems,
        rating: user.rating + eloChange,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        energy: newEnergy,
        stats: { ...user.stats, pvpWins: user.stats.pvpWins + 1, pvpTotal: user.stats.pvpTotal + 1 }
    });

    trackQuestProgress(user, QUEST_TYPES.WIN_PVP, 1);
    trackQuestProgress(user, QUEST_TYPES.EARN_XP, reward.xp);

    const idsToLevel = winningTeamIds || (activeBattle ? activeBattle.myTeam.map(p => p.id) : []);
    
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
                changes = {
                    level: pLevel, xp: pXp, maxXp: pMaxXp,
                    maxHp: Math.floor(pet.maxHp * gf), hp: Math.floor(pet.maxHp * gf),
                    atk: Math.floor(pet.atk * gf), ap: Math.floor(pet.ap * gf),
                    def: Math.floor(pet.def * gf), res: Math.floor(pet.res * gf),
                    speed: Math.floor(pet.speed * gf)
                };
            } else {
                changes = { xp: pXp };
            }
            updatePetInDB(petId, changes);
        }
    });

    setCurrentView('arena-hub');
  };

  const handleLose = (enemyRating = 1200) => {
      const eloChange = calculateEloChange(user.rating, enemyRating, false);
      updateUser(user.id, {
          rating: Math.max(0, user.rating + eloChange),
          stats: { ...user.stats, pvpTotal: user.stats.pvpTotal + 1 }
      });
      setCurrentView('arena-hub');
  };

  const GameContent = () => {
      if (authLoading) {
          return (
              <div className="flex flex-col h-screen bg-slate-900 text-white justify-center items-center">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                  <p className="text-slate-400 font-bold animate-pulse">Lade Spieldaten...</p>
              </div>
          );
      }

      if (!user) return <AuthScreen onLogin={handleLogin} />;
      return (
        <div className="flex flex-col h-screen bg-slate-900 font-sans text-white max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-800 relative">
          {notification && (
            <div className={`absolute top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${notification.type === 'error' ? 'bg-red-500/90 border border-red-400 text-white' : 'bg-green-500/90 border border-green-400 text-white'}`}>
              {notification.type === 'error' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              <span className="font-bold text-sm shadow-black drop-shadow-md">{notification.message}</span>
            </div>
          )}
          
          {lootResult && <LootboxModal pet={lootResult} onClose={() => setLootResult(null)} />}
          {showLevelUpModal && (<LevelUpModal level={user.level} onClose={() => setShowLevelUpModal(false)} />)}
          
          <HeaderHUD user={user} />
          <main className="flex-1 relative overflow-hidden bg-slate-900">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
            <div className="h-full overflow-y-auto p-4 scrollbar-hide">
              {currentView === 'menu' && (<MainMenu user={user} onQuests={() => setCurrentView('quests')} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} />)}
              {currentView === 'shop' && <ShopScreen onBack={() => setCurrentView('menu')} onBuyBox={buyLootbox} />}
              {currentView === 'marketplace' && <MarketplaceScreen user={user} listings={marketListings} onBack={() => setCurrentView('menu')} onBuy={handleBuyMarket} onSell={handleSellMarket} myPets={myPets} />}
              {currentView === 'leaderboard' && <LeaderboardScreen user={user} onBack={() => setCurrentView('menu')} />}
              {currentView === 'quests' && <QuestsScreen user={user} onBack={() => setCurrentView('menu')} />}
              {currentView === 'arena-hub' && (<ArenaHub onBack={() => setCurrentView('menu')} onBattle={startBattle} onTeam={() => setCurrentView('team-edit')}/>)}
              {currentView === 'pet-hub' && (<PetHub onBack={() => setCurrentView('menu')} onInventory={() => setCurrentView('inventory')} onItemInventory={() => setCurrentView('item-inventory')} onBreed={() => setCurrentView('breeding')} onHatchery={() => setCurrentView('hatchery')}/>)}
              {currentView === 'hatchery' && (<HatcheryScreen pets={myPets} user={user} onBack={() => setCurrentView('pet-hub')} onHatchEgg={hatchEgg}/>)}
              {currentView === 'item-inventory' && (<ItemInventoryScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onStartIncubation={startIncubation} user={user} />)}
              {currentView === 'team-edit' && (<TeamEditScreen user={user} pets={myPets} onBack={() => setCurrentView('arena-hub')} onAddPet={(slotIndex) => { setSelectedSlotForTeam(slotIndex); setCurrentView('team-select-pet'); }} onRemovePet={removeFromTeam}/>)}
              {currentView === 'team-select-pet' && (<InventoryScreen pets={myPets} title="Wähle Pet für Team" onBack={() => setCurrentView('team-edit')} onSelectPet={(id) => addToTeam(id)} highlightMode={true} filterEggs={true} />)}
              {currentView === 'inventory' && (<InventoryScreen pets={myPets} title="Deine Sammlung" onBack={() => setCurrentView('pet-hub')} onSelectPet={(id) => { const p = myPets.find(p => p.id === id); if (p.isEgg) return; setSelectedPetDetail(p); setCurrentView('pet-detail'); }} filterEggs={true} />)}
              {currentView === 'pet-detail' && selectedPetDetail && (<PetDetailScreen pet={selectedPetDetail} onBack={() => setCurrentView('inventory')}/>)}
              {currentView === 'breeding' && (<BreedingScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onBreed={breedPets} coins={user.coins}/>)}
              {currentView === 'battle' && activeBattle && (<BattleScreen battleState={activeBattle} setBattleState={setActiveBattle} onWin={handleWin} onLose={handleLose}/>)}
              {currentView === 'profile' && <ProfileScreen user={user} petCount={myPets.length} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={(id) => { handleAddFriend(id); }} />}
              {currentView === 'friend-profile' && selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} />}
              {currentView === 'settings' && (<SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout}  />)}
            </div>
          </main>
          <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        </div>
      );
  }

  return (
    <ErrorBoundary>
        <GameContent />
    </ErrorBoundary>
  );
}