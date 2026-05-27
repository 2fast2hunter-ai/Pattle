import React from 'react';
import MainMenu from '../../screens/MainMenu';
import AchievementsScreen from '../../screens/AchievementsScreen';
import ArenaHub from '../../screens/ArenaHub';
import PetHub from '../../screens/PetHub';
import ItemInventoryScreen from '../../screens/ItemInventoryScreen';
import ShopScreen from '../../screens/ShopScreen';
import BreedingScreen from '../../screens/BreedingScreen';
import HatcheryScreen from '../../screens/HatcheryScreen';
import TeamEditScreen from '../../screens/TeamEditScreen';
import PetDetailScreen from '../../screens/PetDetailScreen';
import BattleScreen from '../../screens/BattleScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import QuestsScreen from '../../screens/QuestsScreen';
import LeaderboardScreen from '../../screens/LeaderboardScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import FriendProfileScreen from '../../screens/FriendProfileScreen';
import MarketplaceScreen from '../../screens/MarketplaceScreen';
import InventoryScreen from '../../screens/InventoryScreen';
import VillageScreen from '../../screens/VillageScreen';
import ResourceDetailScreen from '../../screens/ResourceDetailScreen';
import VillageMilestonesScreen from '../../screens/VillageMilestonesScreen';
import VillageTradingScreen from '../../screens/VillageTradingScreen';
import VillageCosmeticsScreen from '../../screens/VillageCosmeticsScreen';
import TowerScreen from '../../screens/TowerScreen';
import LegalScreen from '../../screens/LegalScreen';
import PatchesScreen from '../../screens/PatchesScreen';
import FeedbackScreen from '../../screens/FeedbackScreen';
import { ALLOWED_TYPES } from '../../data/gameData';

export default function ScreenRouter({
    currentView, setCurrentView, user, gameLogic, t, tutorialHighlight,
    myPets, busyPets, selectedVillageSlot, setSelectedVillageSlot,
    selectedResource, setSelectedResource,
    selectedPetDetail, setSelectedPetDetail,
    selectedFriend, setSelectedFriend,
    selectedSlotForTeam, setSelectedSlotForTeam,
    activeBattle, setActiveBattle, autoBattleRemaining,
    handleCollectVillage, handleOpenVillageSelector, handleOpenResource,
    handleToggleTrainingPet, handleAssignVillageWorker,
    handleUseItemRequest, handleApplyItemToPet,
    handleOpenLootboxWrapper, handleStartIncubationWrapper, handleReduceCooldownWrapper,
    handleHatchEggWrapper, handleWinWrapper, handleLose,
    handleWatchAd, handleWatchAdForHatchWrapper, handleAutoBattle, cancelAutoBattle,
    renamePet, releasePet, addToTeam, removeFromTeam,
    handleBuyMarket, handleSellMarket, handleSellResource, handleRemoveListing,
    startBattle, startGauntletBattle, startTowerBattle, startFriendBattle,
    handleAddFriend, handleUpdateProfile, handleLogout,
    settings, setSettings,
    claimMilestone, tradeResources, buyCosmetic, buySpecialOffer, addIdleTime,
    buyLootbox, buyTickets, claimTimedReward, breedPets
}) {

    const marketListings = gameLogic.marketListings;
    const activePetDetail = selectedPetDetail ? myPets.find(p => p.id === selectedPetDetail.id) : null;
    const getAvailablePets = () => myPets.filter(p => !p.isEgg && !busyPets.includes(p.id));

    // VILLAGE HELPERS
    const productionRates = gameLogic.calculateProductionRate ? gameLogic.calculateProductionRate : () => { };

    switch (currentView) {
        case 'menu': return <MainMenu user={user} t={t} onQuests={() => setCurrentView('quests')} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} onProfile={() => setCurrentView('profile')} onSettings={() => setCurrentView('settings')} onVillage={() => setCurrentView('village')} onAchievements={() => setCurrentView('achievements')} tutorialHighlight={tutorialHighlight} />;
        case 'achievements': return <AchievementsScreen user={user} onBack={() => setCurrentView('menu')} t={t} lang={settings?.language || 'de'} />;

        case 'village': return <VillageScreen user={user} pets={myPets} t={t} onBack={() => setCurrentView('menu')} onCollect={handleCollectVillage} onSelectResource={handleOpenResource} productionRates={productionRates} onOpenMilestones={() => setCurrentView('village-milestones')} onOpenTrading={() => setCurrentView('village-trading')} onAddIdleTime={addIdleTime} onAddIdleTimeByAd={gameLogic.addIdleTimeByAd} onOpenCosmetics={() => setCurrentView('village-cosmetics')} onToggleTrainingPet={handleToggleTrainingPet} />;
        case 'village-detail': return selectedResource && <ResourceDetailScreen resourceId={selectedResource} user={user} pets={myPets} onBack={() => setCurrentView('village')} onAssignWorker={handleOpenVillageSelector} onRemoveWorker={gameLogic.removeWorker} onUpgradeBuilding={gameLogic.upgradeBuilding} productionRates={productionRates} onCollect={handleCollectVillage} />;

        case 'village-select-pet': return selectedVillageSlot && (
            <InventoryScreen
                pets={myPets.filter(p => {
                    if (p.isEgg || busyPets.includes(p.id)) return false;
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
        );

        case 'village-milestones': return <VillageMilestonesScreen user={user} onBack={() => setCurrentView('village')} onClaim={claimMilestone} t={t} />;
        case 'village-trading': return <VillageTradingScreen user={user} onBack={() => setCurrentView('village')} onTrade={tradeResources} t={t} />;
        case 'village-cosmetics': return <VillageCosmeticsScreen user={user} onBack={() => setCurrentView('village')} onBuy={buyCosmetic} onBuySpecial={buySpecialOffer} t={t} />;

        case 'item-inventory': return <ItemInventoryScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onRedeemTicket={gameLogic.handleRedeemTicket} onStartIncubation={handleStartIncubationWrapper} user={user} onUseConsumable={handleUseItemRequest} onOpenLootbox={handleOpenLootboxWrapper} t={t} tutorialHighlight={tutorialHighlight} />;
        case 'item-use-select-pet': return <InventoryScreen pets={myPets.filter(p => !p.isEgg)} title="Wähle ein Pet" onBack={() => setCurrentView('item-inventory')} onSelectPet={handleApplyItemToPet} highlightMode={true} t={t} />;

        case 'shop': return <ShopScreen onBack={() => setCurrentView('menu')} onBuyBox={buyLootbox} onBuyTickets={buyTickets} onWatchAd={handleWatchAd} user={user} onClaimTimedReward={claimTimedReward} showNotification={gameLogic.showNotification} t={t} />;
        case 'marketplace': return <MarketplaceScreen user={user} listings={marketListings} onBack={() => setCurrentView('menu')} onBuy={handleBuyMarket} onSell={handleSellMarket} onSellResource={handleSellResource} onRemoveListing={handleRemoveListing} myPets={myPets} t={t} />;

        case 'leaderboard': return <LeaderboardScreen user={user} onBack={() => setCurrentView('menu')} onViewPlayer={(player) => { if (player.id === user.id) { setCurrentView('profile'); } else { setSelectedFriend(player); setCurrentView('leaderboard-player-profile'); } }} t={t} />;
        case 'leaderboard-player-profile': return selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('leaderboard')} onStartBattle={startFriendBattle} />;

        case 'quests': return <QuestsScreen user={user} onBack={() => setCurrentView('menu')} t={t} />;
        case 'arena-hub': return <ArenaHub user={user} onBack={() => setCurrentView('menu')} onBattle={startBattle} onTeam={() => setCurrentView('team-edit')} onLeaderboard={() => setCurrentView('leaderboard')} onAutoBattle={handleAutoBattle} onTower={() => setCurrentView('tower')} onGauntlet={startGauntletBattle} t={t} tutorialHighlight={tutorialHighlight} />;
        case 'tower': return <TowerScreen user={user} onBack={() => setCurrentView('arena-hub')} onStartStage={startTowerBattle} t={t} />;
        case 'pet-hub': return <PetHub onBack={() => setCurrentView('menu')} onInventory={() => setCurrentView('inventory')} onItemInventory={() => setCurrentView('item-inventory')} onBreed={() => setCurrentView('breeding')} onHatchery={() => setCurrentView('hatchery')} t={t} tutorialHighlight={tutorialHighlight} />;
        case 'hatchery': return <HatcheryScreen pets={myPets} user={user} onBack={() => setCurrentView('pet-hub')} onHatchEgg={handleHatchEggWrapper} onReduceCooldown={handleReduceCooldownWrapper} onStartIncubation={handleStartIncubationWrapper} onWatchAdForHatch={handleWatchAdForHatchWrapper} t={t} tutorialHighlight={tutorialHighlight} />;

        case 'team-edit': return <TeamEditScreen user={user} pets={myPets} onBack={() => setCurrentView('arena-hub')} onAddPet={(slotIndex) => { setSelectedSlotForTeam(slotIndex); setCurrentView('team-select-pet'); }} onRemovePet={removeFromTeam} t={t} tutorialHighlight={tutorialHighlight} />;
        case 'team-select-pet': return <InventoryScreen pets={getAvailablePets()} title="Wähle Pet für Team" onBack={() => setCurrentView('team-edit')} onSelectPet={(id) => addToTeam(id)} highlightMode={true} filterEggs={true} t={t} />;

        case 'inventory': return <InventoryScreen pets={myPets} title={t('pethub_inventory_btn')} onBack={() => setCurrentView('pet-hub')} onSelectPet={(id) => { const p = myPets.find(p => p.id === id); if (p.isEgg) return; setSelectedPetDetail(p); setCurrentView('pet-detail'); }} filterEggs={true} t={t} />;
        case 'pet-detail': return activePetDetail && <PetDetailScreen pet={activePetDetail} user={user} onBack={() => setCurrentView('inventory')} onRenamePet={renamePet} onReleasePet={releasePet} t={t} />;

        case 'breeding': return <BreedingScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onBreed={breedPets} onReduceCooldown={handleReduceCooldownWrapper} user={user} t={t} />;
        case 'battle': return activeBattle && <BattleScreen battleState={activeBattle} setBattleState={setActiveBattle} user={user} onWin={handleWinWrapper} onLose={handleLose} isAutoBattle={autoBattleRemaining > 0} autoBattleRemaining={autoBattleRemaining} onCancelAutoBattle={cancelAutoBattle} t={t} />;
        case 'profile': return <ProfileScreen user={user} pets={myPets} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={handleAddFriend} onBack={() => setCurrentView('menu')} onUpdateProfile={handleUpdateProfile} t={t} />;
        case 'friend-profile': return selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} onStartBattle={startFriendBattle} t={t} />;
        case 'settings': return <SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout} onBack={() => setCurrentView('menu')} onNavigate={setCurrentView} t={t} />;
        case 'legal-imprint': return <LegalScreen type='imprint' onBack={() => setCurrentView('settings')} t={t} />;
        case 'legal-privacy': return <LegalScreen type='privacy' onBack={() => setCurrentView('settings')} t={t} />;
        case 'patches': return <PatchesScreen onBack={() => setCurrentView('settings')} t={t} />;
        case 'feedback': return <FeedbackScreen onBack={() => setCurrentView('settings')} user={user} t={t} />;

        default: return null;
    }
}
