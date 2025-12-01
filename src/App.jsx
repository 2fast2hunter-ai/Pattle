import React from 'react';
import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import { AlertTriangle, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// Components
import { HeaderHUD, BottomNav } from "./components/GameLayout"; 
import Notification from "./components/ui/Notification";
import GameModals from "./components/GameModals";

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

// Error Boundary
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
export default function App() {
  const gameLogic = useGameLogic();
  
  // Destrukturierung für direkten Zugriff
  const { 
    user, currentView, setCurrentView, authLoading, 
    handleLogin, handleLogout, notification, lootResult, setLootResult, // <--- HIER WURDE handleLogout HINZUGEFÜGT
    showLevelUpModal, setShowLevelUpModal, 
    // Spezifische States für Screens
    myPets, marketListings, activeBattle, setActiveBattle, 
    selectedPetDetail, setSelectedPetDetail, selectedSlotForTeam, setSelectedSlotForTeam,
    selectedFriend, setSelectedFriend, settings, setSettings,
    // Aktionen
    buyLootbox, buyTickets, handleRedeemTicket, watchAdForReward,
    startBattle, handleWin, handleLose, handleAddFriend,
    handleBuyMarket, handleSellMarket, addToTeam, removeFromTeam,
    hatchEgg, startIncubation, breedPets
  } = gameLogic;

  // Ladezustand
  if (authLoading) {
      return (
          <div className="flex flex-col h-screen bg-slate-900 text-white justify-center items-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-400 font-bold animate-pulse">Lade Spieldaten...</p>
          </div>
      );
  }

  // Nicht eingeloggt oder User-Daten fehlen noch
  if (currentView === 'auth' || !user) {
      return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans text-white max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-800 relative">
      
      {/* GLOBAL UI OVERLAYS */}
      {notification && <Notification notification={notification} />}
      {lootResult && <GameModals.LootboxModal pet={lootResult} onClose={() => setLootResult(null)} />}
      {showLevelUpModal && <GameModals.LevelUpModal level={user.level} onClose={() => setShowLevelUpModal(false)} />}
      
      <HeaderHUD user={user} />
      
      <main className="flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
        <div className="h-full overflow-y-auto p-4 scrollbar-hide">
          
          {/* SCREEN ROUTING */}
          
          {currentView === 'menu' && (
            <MainMenu 
              user={user} 
              onQuests={() => setCurrentView('quests')} 
              onArena={() => setCurrentView('arena-hub')} 
              onPetHub={() => setCurrentView('pet-hub')} 
              onShop={() => setCurrentView('shop')} 
              onMarketplace={() => setCurrentView('marketplace')} 
              onLeaderboard={() => setCurrentView('leaderboard')} 
            />
          )}

          {currentView === 'shop' && (
            <ShopScreen 
              onBack={() => setCurrentView('menu')} 
              onBuyBox={buyLootbox} 
              onBuyTickets={buyTickets} 
              onWatchAd={watchAdForReward} 
              user={user} 
            />
          )}

          {currentView === 'marketplace' && (
            <MarketplaceScreen 
              user={user} 
              listings={marketListings} 
              onBack={() => setCurrentView('menu')} 
              onBuy={handleBuyMarket} 
              onSell={handleSellMarket} 
              myPets={myPets} 
            />
          )}

          {currentView === 'leaderboard' && <LeaderboardScreen user={user} onBack={() => setCurrentView('menu')} />}
          
          {currentView === 'quests' && <QuestsScreen user={user} onBack={() => setCurrentView('menu')} />}

          {currentView === 'arena-hub' && (
            <ArenaHub 
              onBack={() => setCurrentView('menu')} 
              onBattle={startBattle} 
              onTeam={() => setCurrentView('team-edit')}
              user={user}
              onLeaderboard={() => setCurrentView('leaderboard')}
            />
          )}

          {currentView === 'pet-hub' && (
            <PetHub 
              onBack={() => setCurrentView('menu')} 
              onInventory={() => setCurrentView('inventory')} 
              onItemInventory={() => setCurrentView('item-inventory')} 
              onBreed={() => setCurrentView('breeding')} 
              onHatchery={() => setCurrentView('hatchery')}
            />
          )}

          {currentView === 'hatchery' && (
            <HatcheryScreen 
              pets={myPets} 
              user={user} 
              onBack={() => setCurrentView('pet-hub')} 
              onHatchEgg={hatchEgg}
            />
          )}

          {currentView === 'item-inventory' && (
            <ItemInventoryScreen 
              pets={myPets} 
              onBack={() => setCurrentView('pet-hub')} 
              onRedeemTicket={handleRedeemTicket} 
              onStartIncubation={startIncubation} 
              user={user} 
            />
          )}

          {currentView === 'team-edit' && (
            <TeamEditScreen 
              user={user} 
              pets={myPets} 
              onBack={() => setCurrentView('arena-hub')} 
              onAddPet={(slotIndex) => { 
                setSelectedSlotForTeam(slotIndex); 
                setCurrentView('team-select-pet'); 
              }} 
              onRemovePet={removeFromTeam}
            />
          )}

        {currentView === 'team-select-pet' && (
            <InventoryScreen 
              // FIX: Nur Pets anzeigen, die NICHT schon im Team sind
              pets={myPets.filter(p => !user.team.includes(p.id))} 
              title="Wähle Pet für Team" 
              onBack={() => setCurrentView('team-edit')} 
              onSelectPet={(id) => addToTeam(id)} 
              highlightMode={true} 
              filterEggs={true} 
            />
          )}

          {currentView === 'inventory' && (
            <InventoryScreen 
              pets={myPets} 
              title="Deine Sammlung" 
              onBack={() => setCurrentView('pet-hub')} 
              onSelectPet={(id) => { 
                const p = myPets.find(p => p.id === id); 
                if (p.isEgg) return; 
                setSelectedPetDetail(p); 
                setCurrentView('pet-detail'); 
              }} 
              filterEggs={true} 
            />
          )}

          {currentView === 'pet-detail' && selectedPetDetail && (
            <PetDetailScreen 
              pet={selectedPetDetail} 
              onBack={() => setCurrentView('inventory')}
            />
          )}

          {currentView === 'breeding' && (
            <BreedingScreen 
              pets={myPets} 
              onBack={() => setCurrentView('pet-hub')} 
              onBreed={breedPets} 
              user={user}
            />
          )}

          {currentView === 'battle' && activeBattle && (
            <BattleScreen 
              battleState={activeBattle} 
              setBattleState={setActiveBattle} 
              user={user} 
              onWin={handleWin} 
              onLose={handleLose}
            />
          )}

          {currentView === 'profile' && (
            <ProfileScreen 
              user={user} 
              petCount={myPets.length} 
              onViewFriend={(friend) => { 
                setSelectedFriend(friend); 
                setCurrentView('friend-profile'); 
              }} 
              onAddFriend={handleAddFriend} 
            />
          )}

          {currentView === 'friend-profile' && selectedFriend && (
            <FriendProfileScreen 
              friend={selectedFriend} 
              onBack={() => setCurrentView('profile')} 
            />
          )}

          {currentView === 'settings' && (
            <SettingsScreen 
              settings={settings} 
              setSettings={setSettings} 
              onLogout={handleLogout} 
            />
          )}

        </div>
      </main>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}