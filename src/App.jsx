import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

// Daten & Logik
import { DUMMY_USERS, RARITIES } from './data/gameData';
import { generatePet, calculateEloChange, getUnlockedHatcherySlots, getMaxEnergy, determineRarity } from './utils/gameMechanics';

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
  const [currentView, setCurrentView] = useState('auth'); 
  const [myPets, setMyPets] = useState([]);
  const [activeBattle, setActiveBattle] = useState(null);
  const [selectedPetDetail, setSelectedPetDetail] = useState(null);
  const [settings, setSettings] = useState({ music: true, sfx: true, notifications: false });
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [selectedSlotForTeam, setSelectedSlotForTeam] = useState(null);
  const [notification, setNotification] = useState(null);
  const [lootResult, setLootResult] = useState(null); 
  const [marketListings, setMarketListings] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // --- INITIAL DATA ---
  useEffect(() => {
      if (marketListings.length === 0) {
          const dummy1 = generatePet(10, 'FIRE', 'RARE');
          dummy1.id = 'market_dummy_1';
          const dummy2 = generatePet(5, 'WATER', 'UNCOMMON');
          dummy2.id = 'market_dummy_2';
          
          setMarketListings([
              { id: 'l1', sellerName: 'BotPlayer_X', price: 1200, pet: dummy1 },
              { id: 'l2', sellerName: 'TraderJoe', price: 450, pet: dummy2 }
          ]);
      }
  }, []);

  const showNotification = (msg, type = 'error') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (username, isGuest = false) => {
    const starter1 = generatePet(1, null, 'COMMON');
    const starter2 = generatePet(1, null, 'UNCOMMON');
    setUser({ 
        id: isGuest ? 'guest_123' : 'user_555', 
        username: username || 'Gast Spieler', 
        level: 1, xp: 0, xpToNextLevel: 100, coins: isGuest ? 500 : 500, gems: isGuest ? 10 : 10, avatar: '🛡️', rating: 1000, 
        team: [starter1.id], energy: 10, lastEnergyUpdate: Date.now(), inventory: [], friends: [],
        stats: { pvpWins: 0, pvpTotal: 0, hatched: 0, bred: 0, marketSpent: 0, marketEarned: 0 }
    });
    setMyPets([starter1, starter2]);
    setCurrentView('menu');
  };

  const handleLogout = () => { setUser(null); setCurrentView('auth'); setMyPets([]); };

  // ENERGY REGENERATION HOOK
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
        const now = Date.now();
        const msPerEnergy = 1000 * 60 * 60; // 1 Hour
        const timeDiff = now - user.lastEnergyUpdate;
        if (timeDiff >= msPerEnergy) {
            const energyToGain = Math.floor(timeDiff / msPerEnergy);
            const maxEn = getMaxEnergy(user.level);
            if (user.energy < maxEn) {
                 setUser(u => {
                    const newEnergy = Math.min(maxEn, u.energy + energyToGain);
                    const newLastUpdate = u.lastEnergyUpdate + (energyToGain * msPerEnergy);
                    return { ...u, energy: newEnergy, lastEnergyUpdate: newLastUpdate };
                 });
            } else { setUser(u => ({ ...u, lastEnergyUpdate: now })); }
        }
    }, 10000); 
    return () => clearInterval(interval);
  }, [user]);

  // MARKET BOT SIMULATION
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
        if (Math.random() > 0.9) {
            setMarketListings(prevListings => {
                const myListings = prevListings.filter(l => l.sellerName === user.username);
                if (myListings.length === 0) return prevListings;
                const soldItemIndex = Math.floor(Math.random() * myListings.length);
                const soldItem = myListings[soldItemIndex];
                setUser(u => ({ ...u, coins: u.coins + soldItem.price, stats: { ...u.stats, marketEarned: u.stats.marketEarned + soldItem.price } }));
                showNotification(`Dein Angebot für ${soldItem.pet.name} wurde verkauft! (+${soldItem.price})`, 'success');
                return prevListings.filter(l => l.id !== soldItem.id);
            });
        }
    }, 5000);
    return () => clearInterval(interval);
  }, [user, marketListings]);

  // --- ACTIONS ---
  const handleAddFriend = (friendId) => {
      if (!friendId) return;
      if (friendId === user.id) { showNotification("Du kannst dich nicht selbst hinzufügen.", 'error'); return; }
      if (user.friends.find(f => f.id === friendId)) { showNotification("Bereits befreundet.", 'error'); return; }
      const foundUser = DUMMY_USERS.find(u => u.id === friendId);
      if (foundUser) {
          setUser(prev => ({ ...prev, friends: [...prev.friends, foundUser] }));
          showNotification(`${foundUser.username} wurde hinzugefügt!`, 'success');
      } else { showNotification("Spieler nicht gefunden.", 'error'); }
  };

  const handleBuyMarket = (listingId) => {
      const listing = marketListings.find(l => l.id === listingId);
      if (!listing) return;
      if (user.coins < listing.price) { showNotification("Nicht genug Münzen!", 'error'); return; }
      setUser(prev => ({ ...prev, coins: prev.coins - listing.price, stats: { ...prev.stats, marketSpent: prev.stats.marketSpent + listing.price } }));
      const newItem = { ...listing.pet, id: Date.now() + Math.random().toString() }; 
      setMyPets(prev => [...prev, newItem]);
      setMarketListings(prev => prev.filter(l => l.id !== listingId));
      showNotification(`Erfolgreich gekauft: ${newItem.name}`, 'success');
  };

  const handleSellMarket = (petId, price) => {
      const petIndex = myPets.findIndex(p => p.id === petId);
      if (petIndex === -1) return;
      const petToSell = myPets[petIndex];
      const newMyPets = [...myPets];
      newMyPets.splice(petIndex, 1);
      setMyPets(newMyPets);
      const newListing = { id: Date.now().toString(), sellerName: user.username, price: price, pet: petToSell };
      setMarketListings(prev => [newListing, ...prev]);
      showNotification("Angebot erstellt!", 'success');
  };

  const addToTeam = (petId) => {
    if (selectedSlotForTeam === null) return;
    const pet = myPets.find(p => p.id === petId);
    if (pet && pet.isEgg) { showNotification("Eier können nicht kämpfen! Warte bis es schlüpft.", 'error'); return; }
    const newTeam = [...user.team];
    while(newTeam.length <= selectedSlotForTeam) { newTeam.push(null); }
    const existingIndex = newTeam.indexOf(petId);
    if (existingIndex !== -1) { newTeam[existingIndex] = null; }
    newTeam[selectedSlotForTeam] = petId;
    setUser({...user, team: newTeam});
    setCurrentView('team-edit');
    setSelectedSlotForTeam(null);
  };

  const removeFromTeam = (index) => {
    const newTeam = [...user.team];
    newTeam[index] = null;
    setUser({...user, team: newTeam});
  };

  const hatchEgg = (petId, customName) => {
    const pet = myPets.find(p => p.id === petId);
    if (!pet || !pet.isEgg) return;
    if (Date.now() < pet.hatchAt) { showNotification("Das Ei ist noch nicht bereit!", 'error'); return; }
    setMyPets(pets => pets.map(p => { if (p.id === petId) { return { ...p, isEgg: false, name: customName || p.name }; } return p; }));
    setUser(prev => ({ ...prev, stats: { ...prev.stats, hatched: prev.stats.hatched + 1 } }));
    showNotification(`Ei ist geschlüpft! Es ist ein ${customName || pet.name}!`, 'success');
  };

  const startIncubation = (id, type) => {
    if (type === 'BOX') {
        const box = user.inventory.find(i => i.id === id);
        if (!box) return;
        const newInv = user.inventory.filter(i => i.id !== id);
        setUser(prev => ({ ...prev, inventory: newInv }));
        const rarityKey = determineRarity(box.variant);
        const newEgg = generatePet(1, null, rarityKey, null, 'SHOP');
        newEgg.isEgg = true;
        newEgg.hatchAt = 0; 
        setMyPets(currentPets => [...currentPets, newEgg]);
        setLootResult(newEgg);
    } else {
        const incubatingEggs = myPets.filter(p => p.isEgg && p.hatchAt > 0).length;
        const maxSlots = getUnlockedHatcherySlots(user.level);
        if (incubatingEggs >= maxSlots) { showNotification("Brutstätte ist voll!", 'error'); return; }
        const pet = myPets.find(p => p.id === id);
        const duration = RARITIES[pet.rarity].hatchDuration * 1000;
        setMyPets(pets => pets.map(p => { if (p.id === id) { return { ...p, hatchAt: Date.now() + duration }; } return p; }));
        showNotification("Ei wurde in den Inkubator gelegt!", 'success');
        setCurrentView('hatchery');
    }
  }

  const breedPets = (parent1Id, parent2Id) => {
    if (user.coins < 200) { showNotification("Nicht genug Münzen! Zucht kostet 200.", 'error'); return; }
    const p1 = myPets.find(p => p.id === parent1Id);
    const p2 = myPets.find(p => p.id === parent2Id);
    if (p1.isEgg || p2.isEgg) { showNotification("Du kannst keine Eier züchten!", 'error'); return; }
    
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
    
    setMyPets([...myPets, finalPet]);
    setUser({ ...user, coins: user.coins - 200, stats: { ...user.stats, bred: user.stats.bred + 1 } });
    showNotification(`Erfolg! Ein ${RARITIES[finalPet.rarity].label}-Ei liegt im Item Inventar!`, 'success');
    setCurrentView('item-inventory'); 
  };
  
  const buyLootbox = (boxType, cost, currency) => {
      if (currency === 'COINS') {
          if (user.coins < cost) { showNotification("Nicht genug Münzen!", 'error'); return; }
          setUser(prev => ({ ...prev, coins: prev.coins - cost, inventory: [...prev.inventory, { id: Date.now(), type: 'LOOTBOX', variant: boxType }] }));
      } else {
          if (user.gems < cost) { showNotification("Nicht genug Edelsteine!", 'error'); return; }
          setUser(prev => ({ ...prev, gems: prev.gems - cost, inventory: [...prev.inventory, { id: Date.now(), type: 'LOOTBOX', variant: boxType }] }));
      }
      showNotification(`${boxType} Box gekauft! Schau im Inventar.`, 'success');
  };

  const startBattle = () => {
    const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
    if (validTeamIds.length === 0) { showNotification("Füge zuerst Pets zu deinem Team hinzu!", 'error'); return; }
    if (user.energy < 1) { showNotification("Nicht genug Energie! Warte bis sie sich regeneriert.", 'error'); return; }
    setUser(prev => ({ ...prev, energy: prev.energy - 1 }));
    const myBattleTeam = validTeamIds.map(id => { const p = myPets.find(pet => pet.id === id); return { ...p, currentCd: 0, hp: p.maxHp }; });
    const enemyBattleTeam = [];
    const avgLevel = Math.floor(myBattleTeam.reduce((acc, p) => acc + p.level, 0) / myBattleTeam.length);
    for (let i = 0; i < myBattleTeam.length; i++) { const enemyLevel = Math.max(1, avgLevel + Math.floor(Math.random() * 3) - 1); const enemyPet = generatePet(enemyLevel); enemyPet.id = `enemy_${i}`; enemyPet.name = 'Feindl. ' + enemyPet.name; enemyBattleTeam.push({ ...enemyPet, currentCd: 0 }); }
    const p1 = myBattleTeam[0]; const e1 = enemyBattleTeam[0]; const playerFirst = p1.speed >= e1.speed;
    setActiveBattle({ myTeam: myBattleTeam, enemyTeam: enemyBattleTeam, myIndex: 0, enemyIndex: 0, log: [`Kampf gestartet! Teamgröße: ${myBattleTeam.length} vs ${enemyBattleTeam.length}`], turn: playerFirst ? 'PLAYER' : 'ENEMY', isOver: false, round: 1 });
    setCurrentView('battle');
  };

  const handleWin = (reward, winningTeamIds, enemyRating = 1200) => {
    setUser(currentUser => {
        const newUser = { ...currentUser };
        let leveledUp = false;
        const eloChange = calculateEloChange(newUser.rating, enemyRating, true);
        newUser.coins += reward.coins;
        newUser.rating += eloChange;
        newUser.xp += reward.xp;
        newUser.stats.pvpWins += 1;
        newUser.stats.pvpTotal += 1;
        if (newUser.xp >= newUser.xpToNextLevel) {
            newUser.level += 1;
            newUser.xp -= newUser.xpToNextLevel;
            newUser.xpToNextLevel = Math.floor(newUser.xpToNextLevel * 1.5);
            newUser.coins += 1000;
            newUser.gems += 5;
            const newMax = getMaxEnergy(newUser.level);
            newUser.energy = Math.min(newMax, newUser.energy + 2);
            leveledUp = true;
        }
        if (leveledUp) setTimeout(() => setShowLevelUpModal(true), 500); 
        return newUser;
    });
    const idsToLevel = winningTeamIds || (activeBattle ? activeBattle.myTeam.map(p => p.id) : []);
    setMyPets(currentPets => currentPets.map(p => {
        if (!idsToLevel.includes(p.id)) return p;
        const newPet = { ...p }; 
        newPet.xp += 50;
        newPet.justLeveledUp = false;
        if (newPet.xp >= newPet.maxXp) {
            newPet.level++;
            newPet.xp -= newPet.maxXp;
            newPet.justLeveledUp = true;
            const rarityMulti = RARITIES[newPet.rarity].multi;
            const growthFactor = 1 + (0.05 * rarityMulti);
            newPet.maxHp = Math.floor(newPet.maxHp * growthFactor);
            newPet.hp = newPet.maxHp; 
            newPet.atk = Math.floor(newPet.atk * growthFactor);
            newPet.ap = Math.floor(newPet.ap * growthFactor);
            newPet.def = Math.floor(newPet.def * growthFactor);
            newPet.res = Math.floor(newPet.res * growthFactor);
            newPet.speed = Math.floor(newPet.speed * growthFactor);
            newPet.maxXp = Math.floor(newPet.maxXp * 1.2);
        }
        return newPet;
    }));
    setCurrentView('arena-hub');
  };

  const handleLose = (enemyRating = 1200) => {
      setUser(currentUser => {
          const newUser = { ...currentUser };
          const eloChange = calculateEloChange(newUser.rating, enemyRating, false);
          newUser.rating = Math.max(0, newUser.rating + eloChange); 
          newUser.stats.pvpTotal += 1;
          return newUser;
      });
      setCurrentView('arena-hub');
  };

  const GameContent = () => {
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
              {currentView === 'menu' && (<MainMenu user={user} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} />)}
              {currentView === 'shop' && <ShopScreen onBack={() => setCurrentView('menu')} onBuyBox={buyLootbox} />}
              {currentView === 'marketplace' && <MarketplaceScreen user={user} listings={marketListings} onBack={() => setCurrentView('menu')} onBuy={handleBuyMarket} onSell={handleSellMarket} myPets={myPets} />}
              {currentView === 'leaderboard' && <LeaderboardScreen user={user} onBack={() => setCurrentView('menu')} />}
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
              {currentView === 'profile' && <ProfileScreen user={user} petCount={myPets.length} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={(id) => { if(id === user.id) { showNotification("Du kannst dich nicht selbst hinzufügen", 'error'); return;} const f = DUMMY_USERS.find(u => u.id === id); if(f) { setUser(prev => ({...prev, friends: [...prev.friends, f]})); showNotification("Freund hinzugefügt", 'success'); } else { showNotification("Spieler nicht gefunden", 'error'); } }} />}
              {currentView === 'friend-profile' && selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} />}
              {currentView === 'settings' && (<SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout} />)}
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