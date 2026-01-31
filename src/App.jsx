import React, { useState } from 'react';
import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import { Loader2 } from 'lucide-react';
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
import TowerScreen from './screens/TowerScreen'; // NEU

import ErrorBoundary from './components/ErrorBoundary';
import { playSound, playBGM, setMusicEnabled, setSoundEnabled } from './utils/soundManager';
import { TRANSLATIONS } from './data/translations';
import { trackQuestProgress } from './utils/db';

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
    handleBuyMarket, handleSellMarket, handleSellResource, addToTeam, removeFromTeam, startTowerBattle,
    hatchEgg, startIncubation, breedPets,
    handleAutoBattle, autoBattleRemaining, cancelAutoBattle, startFriendBattle,
    handleRemoveListing, renamePet,
    assignWorker, removeWorker, collectVillageResources, upgradeBuilding, calculateProductionRate,
    tradeResources, claimMilestone, addIdleTime, 
    buyCosmetic, buySpecialOffer, applyXpItem,
    releasePet, claimTimedReward, openLootbox, handleUpdateProfile
  } = gameLogic;

  const [selectedVillageSlot, setSelectedVillageSlot] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedConsumableId, setSelectedConsumableId] = useState(null);
  // NEU: State für Menge
  const [selectedConsumableQuantity, setSelectedConsumableQuantity] = useState(1);

  const activePetDetail = selectedPetDetail ? myPets.find(p => p.id === selectedPetDetail.id) : null;

  // ÜBERSETZUNGS-HELFER
  const t = (key, params = {}) => {
      const lang = settings?.language || 'de';
      let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['de'][key] || key;
      Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, v);
      });
      return text;
  };

  // SOUND & MUSIK MANAGEMENT
  React.useEffect(() => {
      const musicOn = settings?.musicEnabled !== false; // Default true
      const soundOn = settings?.soundEnabled !== false; // Default true
      
      setMusicEnabled(musicOn);
      setSoundEnabled(soundOn);

      // Musik aktualisieren (starten wenn an, stoppen wenn aus wird in setMusicEnabled geregelt)
      if (musicOn) playBGM(currentView);
  }, [currentView, settings?.musicEnabled, settings?.soundEnabled]);

  // SOUND BEI BENACHRICHTIGUNG
  React.useEffect(() => {
      if (notification) {
          playSound('notification');
      }
  }, [notification]);

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

  const handleCollectVillage = async (silent = false, resourceId = null) => {
      const result = await collectVillageResources(resourceId);
      if (silent) return;
      if (result && result.items && result.items.length > 0) {
           const counts = {};
           result.items.forEach(itemId => { counts[itemId] = (counts[itemId] || 0) + 1; });
           const rewardsText = Object.entries(counts).map(([id, count]) => `${count}x ${t('item_' + id)}`).join(', ');
           gameLogic.showNotification(t('notif_collected', { items: rewardsText, xp: result.xp }), 'success');
           playSound('collect');
      } else if (result && result.xp > 0) {
           gameLogic.showNotification(`Gesammelt: +${result.xp} XP`, 'success');
      }
  };

  const handleOpenResource = (resKey) => { setSelectedResource(resKey); setCurrentView('village-detail'); };
  const handleOpenVillageSelector = (resourceId, slotIndex) => { setSelectedVillageSlot({ resourceId, slotIndex }); setCurrentView('village-select-pet'); };
  
  const handleToggleTrainingPet = (slotIndex) => {
      const currentWorker = user.village?.workers?.training?.[slotIndex];
      if (currentWorker) {
          removeWorker('training', slotIndex);
      } else {
          handleOpenVillageSelector('training', slotIndex);
      }
  };

  const handleAssignVillageWorker = (petId) => { 
      if (selectedVillageSlot) { 
          assignWorker(selectedVillageSlot.resourceId, selectedVillageSlot.slotIndex, petId); 
          const isTraining = selectedVillageSlot.resourceId === 'training';
          setSelectedVillageSlot(null); 
          setCurrentView(isTraining ? 'village' : 'village-detail'); 
      } 
  };

  // Wrapper für Werbung, um Quests zu tracken
  const handleWatchAd = async (reward) => {
      await watchAdForReward(reward);
      trackQuestProgress(user, 'WATCH_AD', 1);
  };

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
    <div className="flex flex-col h-full w-full bg-slate-900 font-sans text-white overflow-hidden relative">
      {/* Notification Wrapper: Hoher Z-Index für Sichtbarkeit über Modals */}
      {notification && (
          <div className="absolute top-0 left-0 w-full z-[9999] flex justify-center pt-4 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-md px-4">
                  <Notification notification={notification} />
              </div>
          </div>
      )}
      {lootResult && <GameModals.LootboxModal pet={lootResult} onClose={() => setLootResult(null)} />}
      {showLevelUpModal && <GameModals.LevelUpModal level={user.level} onClose={() => setShowLevelUpModal(false)} />}
      
      {currentView !== 'battle' && (
        <div className="w-full max-w-6xl mx-auto"><HeaderHUD user={user} /></div>
      )}
      
      <main className="flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
        <div className="h-full overflow-y-auto p-4 scrollbar-hide pb-10 w-full max-w-6xl mx-auto">
          
          {currentView === 'menu' && (<MainMenu user={user} t={t} onQuests={() => setCurrentView('quests')} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} onProfile={() => setCurrentView('profile')} onSettings={() => setCurrentView('settings')} onVillage={() => setCurrentView('village')} />)}
          
          {currentView === 'village' && (<VillageScreen user={user} pets={myPets} t={t} onBack={() => setCurrentView('menu')} onCollect={handleCollectVillage} onSelectResource={handleOpenResource} productionRates={calculateProductionRate} onOpenMilestones={() => setCurrentView('village-milestones')} onOpenTrading={() => setCurrentView('village-trading')} onAddIdleTime={addIdleTime} onOpenCosmetics={() => setCurrentView('village-cosmetics')} onToggleTrainingPet={handleToggleTrainingPet} />)}
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
                  onBack={() => {
                      const isTraining = selectedVillageSlot.resourceId === 'training';
                      setCurrentView(isTraining ? 'village' : 'village-detail');
                  }} 
                  onSelectPet={handleAssignVillageWorker} 
                  highlightMode={true} 
                  t={t}
              />
          )}

          {currentView === 'village-milestones' && (<VillageMilestonesScreen user={user} onBack={() => setCurrentView('village')} onClaim={claimMilestone} t={t} />)}
          {currentView === 'village-trading' && (<VillageTradingScreen user={user} onBack={() => setCurrentView('village')} onTrade={tradeResources} t={t} />)}
          {currentView === 'village-cosmetics' && (<VillageCosmeticsScreen user={user} onBack={() => setCurrentView('village')} onBuy={buyCosmetic} onBuySpecial={buySpecialOffer} t={t} />)}

          {currentView === 'item-inventory' && (<ItemInventoryScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onRedeemTicket={handleRedeemTicket} onStartIncubation={startIncubation} user={user} onUseConsumable={handleUseItemRequest} onOpenLootbox={openLootbox} t={t} />)}
          {currentView === 'item-use-select-pet' && (<InventoryScreen pets={myPets.filter(p => !p.isEgg)} title="Wähle ein Pet" onBack={() => setCurrentView('item-inventory')} onSelectPet={handleApplyItemToPet} highlightMode={true} t={t} />)}

          {currentView === 'shop' && <ShopScreen onBack={() => setCurrentView('menu')} onBuyBox={buyLootbox} onBuyTickets={buyTickets} onWatchAd={handleWatchAd} user={user} onClaimTimedReward={claimTimedReward} showNotification={gameLogic.showNotification} t={t} />}
          {currentView === 'marketplace' && <MarketplaceScreen user={user} listings={marketListings} onBack={() => setCurrentView('menu')} onBuy={handleBuyMarket} onSell={handleSellMarket} onSellResource={handleSellResource} onRemoveListing={handleRemoveListing} myPets={myPets} t={t} />}
          {/* HIER HINZUGEFÜGT: onSellResource={handleSellResource} */}
          
          {currentView === 'leaderboard' && (
            <LeaderboardScreen 
                user={user} 
                onBack={() => setCurrentView('menu')} 
                onViewPlayer={(player) => {
                    if (player.id === user.id) {
                        setCurrentView('profile');
                    } else {
                        setSelectedFriend(player);
                        setCurrentView('leaderboard-player-profile');
                    }
                }}
                t={t} 
            />
          )}
          
          {/* Profilansicht für Spieler aus der Rangliste (Zurück -> Rangliste) */}
          {currentView === 'leaderboard-player-profile' && selectedFriend && (
            <FriendProfileScreen 
                friend={selectedFriend} 
                onBack={() => setCurrentView('leaderboard')} 
                onStartBattle={startFriendBattle} 
            />
          )}

          {currentView === 'quests' && <QuestsScreen user={user} onBack={() => setCurrentView('menu')} t={t} />}
          {currentView === 'arena-hub' && <ArenaHub user={user} onBack={() => setCurrentView('menu')} onBattle={startBattle} onTeam={() => setCurrentView('team-edit')} onLeaderboard={() => setCurrentView('leaderboard')} onAutoBattle={handleAutoBattle} onTower={() => setCurrentView('tower')} t={t} />}
          {currentView === 'tower' && <TowerScreen user={user} onBack={() => setCurrentView('arena-hub')} onStartStage={startTowerBattle} t={t} />}
          {currentView === 'pet-hub' && <PetHub onBack={() => setCurrentView('menu')} onInventory={() => setCurrentView('inventory')} onItemInventory={() => setCurrentView('item-inventory')} onBreed={() => setCurrentView('breeding')} onHatchery={() => setCurrentView('hatchery')} t={t} />}
          {currentView === 'hatchery' && <HatcheryScreen pets={myPets} user={user} onBack={() => setCurrentView('pet-hub')} onHatchEgg={hatchEgg} onReduceCooldown={handleReduceCooldown} onStartIncubation={startIncubation} t={t} />}
          
          {currentView === 'team-edit' && <TeamEditScreen user={user} pets={myPets} onBack={() => setCurrentView('arena-hub')} onAddPet={(slotIndex) => { setSelectedSlotForTeam(slotIndex); setCurrentView('team-select-pet'); }} onRemovePet={removeFromTeam} t={t} />}
          
          {currentView === 'team-select-pet' && (
              <InventoryScreen 
                  pets={getAvailablePets()} 
                  title="Wähle Pet für Team" 
                  onBack={() => setCurrentView('team-edit')} 
                  onSelectPet={(id) => addToTeam(id)} 
                  highlightMode={true} 
                  filterEggs={true}
                  t={t} 
              />
          )}

          {currentView === 'inventory' && <InventoryScreen pets={myPets} title={t('pethub_inventory_btn')} onBack={() => setCurrentView('pet-hub')} onSelectPet={(id) => { const p = myPets.find(p => p.id === id); if (p.isEgg) return; setSelectedPetDetail(p); setCurrentView('pet-detail'); }} filterEggs={true} t={t} />}
          
          {currentView === 'pet-detail' && activePetDetail && (
              <PetDetailScreen 
                  pet={activePetDetail} 
                  onBack={() => setCurrentView('inventory')} 
                  onRenamePet={renamePet} 
                  onReleasePet={releasePet}
                  t={t} 
              />
          )}
          
          {currentView === 'breeding' && <BreedingScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onBreed={breedPets} onReduceCooldown={handleReduceCooldown} user={user} t={t} />}
          {currentView === 'battle' && activeBattle && <BattleScreen battleState={activeBattle} setBattleState={setActiveBattle} user={user} onWin={handleWin} onLose={handleLose} isAutoBattle={autoBattleRemaining > 0} autoBattleRemaining={autoBattleRemaining} onCancelAutoBattle={cancelAutoBattle} t={t} />}
          {currentView === 'profile' && <ProfileScreen user={user} pets={myPets} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={handleAddFriend} onBack={() => setCurrentView('menu')} onUpdateProfile={handleUpdateProfile} t={t} />}
          {currentView === 'friend-profile' && selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} onStartBattle={startFriendBattle} t={t} />}
          {currentView === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout} onBack={() => setCurrentView('menu')} t={t} />}

        </div>
      </main>
    </div>
  );
}