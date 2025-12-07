import React, { useState } from 'react';
import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { HeaderHUD } from "./components/GameLayout"; 
import Notification from "./components/ui/Notification";
import GameModals from "./components/GameModals";
import { ALLOWED_TYPES } from './data/gameData'; 

// Screens
import AuthScreen from './screens/AuthScreen';
import MainMenu from './screens/MainMenu';
import ArenaHub from './screens/ArenaHub';
import PetHub from './screens/PetHub';
import ItemInventoryScreen from './screens/ItemInventoryScreen';
import ShopScreen from './screens/ShopScreen';
import BreedingScreen from './screens/BreedingScreen';
import HatcheryScreen from './screens/HatcheryScreen';
import TeamEditScreen from './screens/TeamEditScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import BattleScreen from './screens/BattleScreen';
import ProfileScreen from './screens/ProfileScreen';
import QuestsScreen from './screens/QuestsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import FriendProfileScreen from './screens/FriendProfileScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import InventoryScreen from './screens/InventoryScreen';
import VillageScreen from './screens/VillageScreen'; 
import ResourceDetailScreen from './screens/ResourceDetailScreen';
import VillageMilestonesScreen from './screens/VillageMilestonesScreen';
import VillageTradingScreen from './screens/VillageTradingScreen';
import VillageCosmeticsScreen from './screens/VillageCosmeticsScreen';

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

export default function App() {
  const gameLogic = useGameLogic();
  
  const { 
    user, currentView, setCurrentView, authLoading, 
    handleLogin, handleLogout, notification, lootResult, setLootResult,
    showLevelUpModal, setShowLevelUpModal, 
    myPets, marketListings, activeBattle, setActiveBattle, 
    selectedPetDetail, setSelectedPetDetail, selectedSlotForTeam, setSelectedSlotForTeam,
    selectedFriend, setSelectedFriend, settings, setSettings,
    buyLootbox, buyTickets, handleRedeemTicket, handleReduceCooldown, watchAdForReward,
    startBattle, handleWin, handleLose, handleAddFriend,
    handleBuyMarket, handleSellMarket, addToTeam, removeFromTeam,
    hatchEgg, startIncubation, breedPets,
    handleAutoBattle, autoBattleRemaining, cancelAutoBattle, startFriendBattle,
    handleRemoveListing, renamePet,
    assignWorker, removeWorker, collectVillageResources, upgradeBuilding, calculateProductionRate,
    tradeResources, claimMilestone, addIdleTime, 
    buyCosmetic, buySpecialOffer, applyXpItem,
    releasePet,claimTimedReward 
  } = gameLogic;

  const [selectedVillageSlot, setSelectedVillageSlot] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedConsumableId, setSelectedConsumableId] = useState(null);
  // NEU: State für Menge
  const [selectedConsumableQuantity, setSelectedConsumableQuantity] = useState(1);

  const activePetDetail = selectedPetDetail ? myPets.find(p => p.id === selectedPetDetail.id) : null;

  const getBusyPetIds = () => {
      if (!user) return new Set();
      const teamIds = (user.team || []).filter(Boolean);
      const workerIds = [];
      if (user.village && user.village.workers) {
          Object.values(user.village.workers).forEach(slotArray => {
              if (Array.isArray(slotArray)) {
                  slotArray.forEach(id => {
                      if (id) workerIds.push(id);
                  });
              }
          });
      }
      return new Set([...teamIds, ...workerIds]);
  };
  const busyPetIds = getBusyPetIds();

  const getAvailablePets = () => {
      return myPets.filter(p => !p.isEgg && !busyPetIds.has(p.id));
  };

  const handleCollectVillage = async () => {
      const result = await collectVillageResources();
      if (result && result.items && result.items.length > 0) {
           const counts = {};
           result.items.forEach(itemLabel => { counts[itemLabel] = (counts[itemLabel] || 0) + 1; });
           const rewardsText = Object.entries(counts).map(([name, count]) => `${count}x ${name}`).join(', ');
           gameLogic.showNotification(`Gesammelt: ${rewardsText} (+${result.xp} XP)`, 'success');
      } else if (result && result.xp > 0) {
           gameLogic.showNotification(`Gesammelt: +${result.xp} XP`, 'success');
      }
  };

  const handleOpenResource = (resKey) => { setSelectedResource(resKey); setCurrentView('village-detail'); };
  const handleOpenVillageSelector = (resourceId, slotIndex) => { setSelectedVillageSlot({ resourceId, slotIndex }); setCurrentView('village-select-pet'); };
  const handleAssignVillageWorker = (petId) => { if (selectedVillageSlot) { assignWorker(selectedVillageSlot.resourceId, selectedVillageSlot.slotIndex, petId); setSelectedVillageSlot(null); setCurrentView('village-detail'); } };
  
  // ITEM HANDLER MIT MENGE
  const handleUseItemRequest = (itemId, quantity = 1) => { 
      setSelectedConsumableId(itemId); 
      setSelectedConsumableQuantity(quantity);
      setCurrentView('item-use-select-pet'); 
  };
  
  const handleApplyItemToPet = async (petId) => { 
      if (selectedConsumableId) { 
          await applyXpItem(petId, selectedConsumableId, selectedConsumableQuantity); 
          setSelectedConsumableId(null); 
          setCurrentView('item-inventory'); 
      } 
  };

  if (authLoading) return (<div className="flex flex-col h-screen bg-slate-900 text-white justify-center items-center"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" /><p className="text-slate-400 font-bold animate-pulse">Lade Spieldaten...</p></div>);
  if (currentView === 'auth' || !user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 font-sans text-white sm:max-w-md mx-auto shadow-2xl overflow-hidden sm:border-x border-slate-800 relative">
      {notification && <Notification notification={notification} />}
      {lootResult && <GameModals.LootboxModal pet={lootResult} onClose={() => setLootResult(null)} />}
      {showLevelUpModal && <GameModals.LevelUpModal level={user.level} onClose={() => setShowLevelUpModal(false)} />}
      {currentView !== 'battle' && <HeaderHUD user={user} />}
      
      <main className="flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
        <div className="h-full overflow-y-auto p-4 scrollbar-hide pb-10">
          
          {currentView === 'menu' && (<MainMenu user={user} onQuests={() => setCurrentView('quests')} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} onProfile={() => setCurrentView('profile')} onSettings={() => setCurrentView('settings')} onVillage={() => setCurrentView('village')} />)}
          
          {currentView === 'village' && (<VillageScreen user={user} onBack={() => setCurrentView('menu')} onCollect={handleCollectVillage} onSelectResource={handleOpenResource} productionRates={calculateProductionRate} onOpenMilestones={() => setCurrentView('village-milestones')} onOpenTrading={() => setCurrentView('village-trading')} onAddIdleTime={addIdleTime} onOpenCosmetics={() => setCurrentView('village-cosmetics')} />)}
          {currentView === 'village-detail' && selectedResource && (<ResourceDetailScreen resourceId={selectedResource} user={user} pets={myPets} onBack={() => setCurrentView('village')} onAssignWorker={handleOpenVillageSelector} onRemoveWorker={removeWorker} onUpgradeBuilding={upgradeBuilding} productionRates={calculateProductionRate} onCollect={handleCollectVillage} />)}
          
          {currentView === 'village-select-pet' && selectedVillageSlot && (
              <InventoryScreen 
                  pets={myPets.filter(p => {
                      if (p.isEgg || busyPetIds.has(p.id)) return false;
                      const resId = selectedVillageSlot.resourceId;
                      const allowed = ALLOWED_TYPES[resId];
                      if (!allowed || !allowed.includes(p.type)) return false;
                      const currentWorkerIds = user.village?.workers?.[resId] || [];
                      const isDuplicateType = currentWorkerIds.some((wId, index) => {
                          if (index === selectedVillageSlot.slotIndex) return false;
                          if (!wId) return false;
                          const worker = myPets.find(wp => wp.id === wId);
                          return worker && worker.type === p.type;
                      });
                      if (isDuplicateType) return false;
                      return true;
                  })} 
                  title="Arbeiter wählen" 
                  onBack={() => setCurrentView('village-detail')} 
                  onSelectPet={handleAssignVillageWorker} 
                  highlightMode={true} 
              />
          )}

          {currentView === 'village-milestones' && (<VillageMilestonesScreen user={user} onBack={() => setCurrentView('village')} onClaim={claimMilestone} />)}
          {currentView === 'village-trading' && (<VillageTradingScreen user={user} onBack={() => setCurrentView('village')} onTrade={tradeResources} />)}
          {currentView === 'village-cosmetics' && (<VillageCosmeticsScreen user={user} onBack={() => setCurrentView('village')} onBuy={buyCosmetic} onBuySpecial={buySpecialOffer} />)}

          {currentView === 'item-inventory' && (<ItemInventoryScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onRedeemTicket={handleRedeemTicket} onStartIncubation={startIncubation} user={user} onUseConsumable={handleUseItemRequest} />)}
          {currentView === 'item-use-select-pet' && (<InventoryScreen pets={myPets.filter(p => !p.isEgg)} title="Wähle ein Pet" onBack={() => setCurrentView('item-inventory')} onSelectPet={handleApplyItemToPet} highlightMode={true} />)}

          {currentView === 'shop' && <ShopScreen onBack={() => setCurrentView('menu')} onBuyBox={buyLootbox} onBuyTickets={buyTickets} onWatchAd={watchAdForReward} user={user} onClaimTimedReward={claimTimedReward} />}
          {currentView === 'marketplace' && <MarketplaceScreen user={user} listings={marketListings} onBack={() => setCurrentView('menu')} onBuy={handleBuyMarket} onSell={handleSellMarket} onRemoveListing={handleRemoveListing} myPets={myPets} />}
          {currentView === 'leaderboard' && <LeaderboardScreen user={user} onBack={() => setCurrentView('menu')} />}
          {currentView === 'quests' && <QuestsScreen user={user} onBack={() => setCurrentView('menu')} />}
          {currentView === 'arena-hub' && <ArenaHub user={user} onBack={() => setCurrentView('menu')} onBattle={startBattle} onTeam={() => setCurrentView('team-edit')} onLeaderboard={() => setCurrentView('leaderboard')} onAutoBattle={handleAutoBattle} />}
          {currentView === 'pet-hub' && <PetHub onBack={() => setCurrentView('menu')} onInventory={() => setCurrentView('inventory')} onItemInventory={() => setCurrentView('item-inventory')} onBreed={() => setCurrentView('breeding')} onHatchery={() => setCurrentView('hatchery')} />}
          {currentView === 'hatchery' && <HatcheryScreen pets={myPets} user={user} onBack={() => setCurrentView('pet-hub')} onHatchEgg={hatchEgg} onReduceCooldown={handleReduceCooldown} onStartIncubation={startIncubation} />}
          
          {currentView === 'team-edit' && <TeamEditScreen user={user} pets={myPets} onBack={() => setCurrentView('arena-hub')} onAddPet={(slotIndex) => { setSelectedSlotForTeam(slotIndex); setCurrentView('team-select-pet'); }} onRemovePet={removeFromTeam} />}
          
          {currentView === 'team-select-pet' && (
              <InventoryScreen 
                  pets={getAvailablePets()} 
                  title="Wähle Pet für Team" 
                  onBack={() => setCurrentView('team-edit')} 
                  onSelectPet={(id) => addToTeam(id)} 
                  highlightMode={true} 
                  filterEggs={true} 
              />
          )}

          {currentView === 'inventory' && <InventoryScreen pets={myPets} title="Deine Sammlung" onBack={() => setCurrentView('pet-hub')} onSelectPet={(id) => { const p = myPets.find(p => p.id === id); if (p.isEgg) return; setSelectedPetDetail(p); setCurrentView('pet-detail'); }} />}
          
          {currentView === 'pet-detail' && activePetDetail && (
              <PetDetailScreen 
                  pet={activePetDetail} 
                  onBack={() => setCurrentView('inventory')} 
                  onRenamePet={renamePet} 
                  onReleasePet={releasePet} 
              />
          )}
          
          {currentView === 'breeding' && <BreedingScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onBreed={breedPets} onReduceCooldown={handleReduceCooldown} user={user} />}
          {currentView === 'battle' && activeBattle && <BattleScreen battleState={activeBattle} setBattleState={setActiveBattle} user={user} onWin={handleWin} onLose={handleLose} isAutoBattle={autoBattleRemaining > 0} autoBattleRemaining={autoBattleRemaining} onCancelAutoBattle={cancelAutoBattle} />}
          {currentView === 'profile' && <ProfileScreen user={user} pets={myPets} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={handleAddFriend} onBack={() => setCurrentView('menu')} />}
          {currentView === 'friend-profile' && selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} onStartBattle={startFriendBattle} />}
          {currentView === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout} onBack={() => setCurrentView('menu')} />}

        </div>
      </main>
    </div>
  );
}