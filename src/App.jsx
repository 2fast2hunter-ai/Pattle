import React, { useState } from 'react';
import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import { Loader2 } from 'lucide-react';
import { HeaderHUD } from "./components/GameLayout"; 
import Notification from "./components/ui/Notification";
import GameModals from "./components/GameModals";
import { ALLOWED_TYPES, BASE_ANIMALS } from './data/gameData'; 
import PetAvatar from './components/PetAvatar';
import TutorialOverlay from './components/ui/TutorialOverlay';

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
    releasePet, claimTimedReward, openLootbox, handleUpdateProfile, setUser
  } = gameLogic;

  const [selectedVillageSlot, setSelectedVillageSlot] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedConsumableId, setSelectedConsumableId] = useState(null);
  // NEU: State für Menge
  const [selectedConsumableQuantity, setSelectedConsumableQuantity] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPet, setLoadingPet] = useState(null);

  // --- TUTORIAL LOGIC ---
  const tutorialStep = user ? (user.tutorialStep !== undefined ? user.tutorialStep : (user.level === 1 && user.xp === 0 ? 0 : 10)) : 10;
  const isTutorialActive = tutorialStep < 10;

  const getTutorialState = () => {
      if (!isTutorialActive) return { msg: null, highlight: null };
      
      switch (tutorialStep) {
          case 0: return { msg: "Willkommen! Gehe zuerst zu deiner SAMMLUNG.", highlight: 'pethub', view: 'menu' };
          case 1: return { msg: "Öffne deinen RUCKSACK.", highlight: 'items', view: 'pet-hub' };
          case 2: return { msg: "Öffne die STARTER BOX!", highlight: 'STARTER', view: 'item-inventory' };
          case 3: return { msg: "Gehe zurück zur BRUTSTÄTTE.", highlight: 'hatchery', view: 'pet-hub' }; // User muss ggf. erst zurück navigeren
          case 4: return { msg: "Lege das Ei in den Inkubator.", highlight: 'slot-0', view: 'hatchery' };
          case 5: return { msg: "Gehe zurück ins Hauptmenü zur ARENA.", highlight: 'arena', view: 'menu' };
          case 6: return { msg: "Verwalte dein TEAM.", highlight: 'team', view: 'arena-hub' };
          case 7: return { msg: "Füge dein neues Pet hinzu.", highlight: 'slot-0', view: 'team-edit' };
          case 8: return { msg: "Starte deinen ersten KAMPF!", highlight: 'battle', view: 'arena-hub' };
          case 9: return { msg: "Gewinne den Kampf!", highlight: null, view: 'battle' };
          default: return { msg: null, highlight: null };
      }
  };

  const { msg: tutorialMsg, highlight: tutorialHighlight } = getTutorialState();

  // Tutorial Fortschrittsprüfung
  React.useEffect(() => {
      if (!user || !isTutorialActive) return;
      
      const advance = (newStep) => {
          const newUser = { ...user, tutorialStep: newStep };
          setUser(newUser); // Optimistisches Update
          gameLogic.handleUpdateProfile({ tutorialStep: newStep }); // DB Update
      };

      if (tutorialStep === 0 && currentView === 'pet-hub') advance(1);
      if (tutorialStep === 1 && currentView === 'item-inventory') advance(2);
      // Step 2 -> 3 passiert beim Öffnen der Box (siehe unten wrapper)
      if (tutorialStep === 3 && currentView === 'hatchery') advance(4);
      // Step 4 -> 5 passiert beim Starten der Inkubation (siehe unten wrapper)
      if (tutorialStep === 5 && currentView === 'arena-hub') advance(6);
      if (tutorialStep === 6 && currentView === 'team-edit') advance(7);
      if (tutorialStep === 7 && user.team.filter(Boolean).length > 0) advance(8);
      if (tutorialStep === 8 && currentView === 'battle') advance(9);
      // Step 9 -> 10 passiert beim Sieg (siehe unten wrapper)

  }, [user, currentView, tutorialStep]);

  // Wrapper für Actions um Tutorial zu triggern
  const handleOpenLootboxWrapper = async (id, variant) => {
      const res = await openLootbox(id, variant);
      if (res && tutorialStep === 2) {
          const newUser = { ...user, tutorialStep: 3 };
          setUser(newUser);
          gameLogic.handleUpdateProfile({ tutorialStep: 3 });
      }
      return res;
  };

  const handleStartIncubationWrapper = async (id) => {
      await startIncubation(id);
      if (tutorialStep === 4) {
          const newUser = { ...user, tutorialStep: 5 };
          setUser(newUser);
          gameLogic.handleUpdateProfile({ tutorialStep: 5 });
      }
  };

  const handleWinWrapper = async (reward, team, rating, dmg) => {
      await handleWin(reward, team, rating, dmg);
      if (tutorialStep === 9) {
          const newUser = { ...user, tutorialStep: 10 };
          setUser(newUser);
          gameLogic.handleUpdateProfile({ tutorialStep: 10 });
          gameLogic.showNotification("Tutorial abgeschlossen! Viel Spaß!", "success");
      }
  };
  // ----------------------

  React.useEffect(() => {
      if (authLoading) {
          // Zufälliges Pet für den Ladebildschirm wählen
          const keys = Object.keys(BASE_ANIMALS);
          if (keys.length > 0) {
              const randomKey = keys[Math.floor(Math.random() * keys.length)];
              setLoadingPet({
                  ...BASE_ANIMALS[randomKey],
                  species: randomKey,
                  rarity: 'MYTHIC',
                  level: 100
              });
          }

          setLoadingProgress(0);
          const interval = setInterval(() => {
              setLoadingProgress(prev => {
                  if (prev >= 100) { clearInterval(interval); return 100; }
                  return prev + 1;
              });
          }, 40); // Füllt sich in ca. 4 Sekunden (100 * 40ms = 4000ms)
          return () => clearInterval(interval);
      }
  }, [authLoading]);

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

  if (authLoading) return (
    <div className="flex flex-col h-screen bg-slate-900 text-white justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-1000">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.6)] mb-8 animate-bounce border-4 border-white/10">
                {loadingPet ? <PetAvatar pet={loadingPet} className="w-24 h-24 drop-shadow-md" /> : <span className="text-6xl">🦁</span>}
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 drop-shadow-lg text-center">Pattle</h1>
            
            <div className="w-64 h-1.5 bg-slate-800/50 rounded-full overflow-hidden border border-white/10 mb-6 relative shadow-inner backdrop-blur-sm">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-75 ease-linear shadow-[0_0_15px_rgba(168,85,247,0.6)]" 
                    style={{ width: `${loadingProgress}%` }}
                ></div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-xl">
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Lade Welt... {Math.floor(loadingProgress)}%</p>
            </div>
        </div>
    </div>
  );

  if (currentView === 'auth' || !user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 font-sans text-white overflow-hidden relative">
      {/* Notification Wrapper: Hoher Z-Index für Sichtbarkeit über Modals */}
      {isTutorialActive && <TutorialOverlay message={tutorialMsg} step={tutorialStep} />}
      
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
        <div className="w-full"><HeaderHUD user={user} /></div>
      )}
      
      <main className="flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
        <div className="h-full w-full overflow-hidden">
          
          {currentView === 'menu' && (<MainMenu user={user} t={t} onQuests={() => setCurrentView('quests')} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} onProfile={() => setCurrentView('profile')} onSettings={() => setCurrentView('settings')} onVillage={() => setCurrentView('village')} tutorialHighlight={tutorialHighlight} />)}
          
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

          {currentView === 'item-inventory' && (<ItemInventoryScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onRedeemTicket={handleRedeemTicket} onStartIncubation={handleStartIncubationWrapper} user={user} onUseConsumable={handleUseItemRequest} onOpenLootbox={handleOpenLootboxWrapper} t={t} tutorialHighlight={tutorialHighlight} />)}
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
          {currentView === 'arena-hub' && <ArenaHub user={user} onBack={() => setCurrentView('menu')} onBattle={startBattle} onTeam={() => setCurrentView('team-edit')} onLeaderboard={() => setCurrentView('leaderboard')} onAutoBattle={handleAutoBattle} onTower={() => setCurrentView('tower')} t={t} tutorialHighlight={tutorialHighlight} />}
          {currentView === 'tower' && <TowerScreen user={user} onBack={() => setCurrentView('arena-hub')} onStartStage={startTowerBattle} t={t} />}
          {currentView === 'pet-hub' && <PetHub onBack={() => setCurrentView('menu')} onInventory={() => setCurrentView('inventory')} onItemInventory={() => setCurrentView('item-inventory')} onBreed={() => setCurrentView('breeding')} onHatchery={() => setCurrentView('hatchery')} t={t} tutorialHighlight={tutorialHighlight} />}
          {currentView === 'hatchery' && <HatcheryScreen pets={myPets} user={user} onBack={() => setCurrentView('pet-hub')} onHatchEgg={hatchEgg} onReduceCooldown={handleReduceCooldown} onStartIncubation={handleStartIncubationWrapper} t={t} tutorialHighlight={tutorialHighlight} />}
          
          {currentView === 'team-edit' && <TeamEditScreen user={user} pets={myPets} onBack={() => setCurrentView('arena-hub')} onAddPet={(slotIndex) => { setSelectedSlotForTeam(slotIndex); setCurrentView('team-select-pet'); }} onRemovePet={removeFromTeam} t={t} tutorialHighlight={tutorialHighlight} />}
          
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
          {currentView === 'battle' && activeBattle && <BattleScreen battleState={activeBattle} setBattleState={setActiveBattle} user={user} onWin={handleWinWrapper} onLose={handleLose} isAutoBattle={autoBattleRemaining > 0} autoBattleRemaining={autoBattleRemaining} onCancelAutoBattle={cancelAutoBattle} t={t} />}
          {currentView === 'profile' && <ProfileScreen user={user} pets={myPets} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={handleAddFriend} onBack={() => setCurrentView('menu')} onUpdateProfile={handleUpdateProfile} t={t} />}
          {currentView === 'friend-profile' && selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} onStartBattle={startFriendBattle} t={t} />}
          {currentView === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout} onBack={() => setCurrentView('menu')} t={t} />}

        </div>
      </main>
    </div>
  );
}