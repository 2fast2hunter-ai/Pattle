import React, { lazy, Suspense } from 'react';
import { ALLOWED_TYPES } from '../../data/gameData';

const MainMenu = lazy(() => import('../../screens/MainMenu'));
const AchievementsScreen = lazy(() => import('../../screens/AchievementsScreen'));
const ArenaHub = lazy(() => import('../../screens/ArenaHub'));
const PetHub = lazy(() => import('../../screens/PetHub'));
const ItemInventoryScreen = lazy(() => import('../../screens/ItemInventoryScreen'));
const ShopScreen = lazy(() => import('../../screens/ShopScreen'));
const BreedingScreen = lazy(() => import('../../screens/BreedingScreen'));
const HatcheryScreen = lazy(() => import('../../screens/HatcheryScreen'));
const TeamEditScreen = lazy(() => import('../../screens/TeamEditScreen'));
const PetDetailScreen = lazy(() => import('../../screens/PetDetailScreen'));
const BattleScreen = lazy(() => import('../../screens/BattleScreen'));
const ProfileScreen = lazy(() => import('../../screens/ProfileScreen'));
const QuestsScreen = lazy(() => import('../../screens/QuestsScreen'));
const LeaderboardScreen = lazy(() => import('../../screens/LeaderboardScreen'));
const SettingsScreen = lazy(() => import('../../screens/SettingsScreen'));
const FriendProfileScreen = lazy(() => import('../../screens/FriendProfileScreen'));
const MarketplaceScreen = lazy(() => import('../../screens/MarketplaceScreen'));
const InventoryScreen = lazy(() => import('../../screens/InventoryScreen'));
const VillageScreen = lazy(() => import('../../screens/VillageScreen'));
const ResourceDetailScreen = lazy(() => import('../../screens/ResourceDetailScreen'));
const VillageMilestonesScreen = lazy(() => import('../../screens/VillageMilestonesScreen'));
const VillageTradingScreen = lazy(() => import('../../screens/VillageTradingScreen'));
const VillageCosmeticsScreen = lazy(() => import('../../screens/VillageCosmeticsScreen'));
const TowerScreen = lazy(() => import('../../screens/TowerScreen'));
const LegalScreen = lazy(() => import('../../screens/LegalScreen'));
const PatchesScreen = lazy(() => import('../../screens/PatchesScreen'));
const FeedbackScreen = lazy(() => import('../../screens/FeedbackScreen'));
const GuildScreen = lazy(() => import('../../screens/GuildScreen'));
const GuildChatScreen = lazy(() => import('../../screens/GuildChatScreen'));
const GuildLeaderboardScreen = lazy(() => import('../../screens/GuildLeaderboardScreen'));
const DungeonScreen = lazy(() => import('../../screens/DungeonScreen'));
const DungeonRunScreen = lazy(() => import('../../screens/DungeonRunScreen'));
const ChatScreen = lazy(() => import('../../screens/ChatScreen'));
const AdminDashboardScreen = lazy(() => import('../../screens/AdminDashboardScreen'));
const GearInventoryScreen = lazy(() => import('../../screens/GearInventoryScreen'));
const DexScreen = lazy(() => import('../../screens/DexScreen'));

const ScreenFallback = () => (
    <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

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
    renamePet, releasePet, addToTeam, removeFromTeam, autoFillTeam,
    handleBuyMarket, handleSellMarket, handleSellResource, handleRemoveListing,
    startBattle, startGauntletBattle, startTowerBattle, startFriendBattle,
    startDungeonRun, startDungeonRoomBattle, collectDungeonLoot,
    handleAddFriend, handleAcceptFriendRequest, handleDeclineFriendRequest, handleUpdateProfile, handleLogout,
    settings, setSettings,
    claimMilestone, tradeResources, buyCosmetic, buySpecialOffer, addIdleTime,
    buyLootbox, buyTickets, claimTimedReward, breedPets
}) {

    const marketListings = gameLogic.marketListings;
    const activePetDetail = selectedPetDetail ? myPets.find(p => p.id === selectedPetDetail.id) : null;
    const getAvailablePets = () => myPets.filter(p => !p.isEgg && !busyPets.includes(p.id));

    // VILLAGE HELPERS
    const productionRates = gameLogic.calculateProductionRate ? gameLogic.calculateProductionRate : () => { };

    let screen;
    switch (currentView) {
        case 'menu': screen = <MainMenu user={user} t={t} onQuests={() => setCurrentView('quests')} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} onProfile={() => setCurrentView('profile')} onSettings={() => setCurrentView('settings')} onVillage={() => setCurrentView('village')} onAchievements={() => setCurrentView('achievements')} onGuild={() => setCurrentView('guild')} onChat={() => setCurrentView('chat')} tutorialHighlight={tutorialHighlight} />; break;
        case 'achievements': screen = <AchievementsScreen user={user} onBack={() => setCurrentView('menu')} t={t} lang={settings?.language || 'de'} />; break;

        case 'village': screen = <VillageScreen user={user} pets={myPets} t={t} onBack={() => setCurrentView('menu')} onCollect={handleCollectVillage} onSelectResource={handleOpenResource} productionRates={productionRates} onOpenMilestones={() => setCurrentView('village-milestones')} onOpenTrading={() => setCurrentView('village-trading')} onAddIdleTime={addIdleTime} onAddIdleTimeByAd={gameLogic.addIdleTimeByAd} onOpenCosmetics={() => setCurrentView('village-cosmetics')} onToggleTrainingPet={handleToggleTrainingPet} />; break;
        case 'village-detail': screen = selectedResource && <ResourceDetailScreen resourceId={selectedResource} user={user} pets={myPets} onBack={() => setCurrentView('village')} onAssignWorker={handleOpenVillageSelector} onRemoveWorker={gameLogic.removeWorker} onUpgradeBuilding={gameLogic.upgradeBuilding} productionRates={productionRates} onCollect={handleCollectVillage} />; break;

        case 'village-select-pet': screen = selectedVillageSlot && (
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
                title={t ? t('label_select_worker') : 'Select Worker'}
                onBack={() => {
                    const isTraining = selectedVillageSlot.resourceId === 'training';
                    setCurrentView(isTraining ? 'village' : 'village-detail');
                }}
                onSelectPet={handleAssignVillageWorker}
                highlightMode={true}
                t={t}
            />
        ); break;

        case 'village-milestones': screen = <VillageMilestonesScreen user={user} onBack={() => setCurrentView('village')} onClaim={claimMilestone} t={t} />; break;
        case 'village-trading': screen = <VillageTradingScreen user={user} onBack={() => setCurrentView('village')} onTrade={tradeResources} t={t} />; break;
        case 'village-cosmetics': screen = <VillageCosmeticsScreen user={user} onBack={() => setCurrentView('village')} onBuy={buyCosmetic} onBuySpecial={buySpecialOffer} t={t} />; break;

        case 'item-inventory': screen = <ItemInventoryScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onRedeemTicket={gameLogic.handleRedeemTicket} onStartIncubation={handleStartIncubationWrapper} user={user} onUseConsumable={handleUseItemRequest} onOpenLootbox={handleOpenLootboxWrapper} t={t} tutorialHighlight={tutorialHighlight} />; break;
        case 'item-use-select-pet': screen = <InventoryScreen pets={myPets.filter(p => !p.isEgg)} title={t ? t('label_select_pet') : 'Select a Pet'} onBack={() => setCurrentView('item-inventory')} onSelectPet={handleApplyItemToPet} highlightMode={true} t={t} />; break;

        case 'shop': screen = <ShopScreen onBack={() => setCurrentView('menu')} onBuyBox={buyLootbox} onBuyTickets={buyTickets} onWatchAd={handleWatchAd} user={user} onClaimTimedReward={claimTimedReward} showNotification={gameLogic.showNotification} t={t} />; break;
        case 'marketplace': screen = <MarketplaceScreen user={user} listings={marketListings} onBack={() => setCurrentView('menu')} onBuy={handleBuyMarket} onSell={handleSellMarket} onSellResource={handleSellResource} onRemoveListing={handleRemoveListing} myPets={myPets} t={t} />; break;

        case 'leaderboard': screen = <LeaderboardScreen user={user} onBack={() => setCurrentView('menu')} onViewPlayer={(player) => { if (player.id === user.id) { setCurrentView('profile'); } else { setSelectedFriend(player); setCurrentView('leaderboard-player-profile'); } }} t={t} />; break;
        case 'leaderboard-player-profile': screen = selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('leaderboard')} onStartBattle={startFriendBattle} t={t} />; break;

        case 'quests': screen = <QuestsScreen user={user} onBack={() => setCurrentView('menu')} t={t} />; break;
        case 'arena-hub': screen = <ArenaHub user={user} onBack={() => setCurrentView('menu')} onBattle={startBattle} onTeam={() => setCurrentView('team-edit')} onLeaderboard={() => setCurrentView('leaderboard')} onAutoBattle={handleAutoBattle} onTower={() => setCurrentView('tower')} onGauntlet={startGauntletBattle} onDungeon={() => setCurrentView('dungeon')} t={t} tutorialHighlight={tutorialHighlight} />; break;
        case 'tower': screen = <TowerScreen user={user} onBack={() => setCurrentView('arena-hub')} onStartStage={startTowerBattle} t={t} />; break;
        case 'dungeon': screen = <DungeonScreen user={user} onBack={() => setCurrentView('arena-hub')} onStartRun={startDungeonRun} t={t} />; break;
        case 'dungeon-run': screen = activeBattle?.isDungeon && <DungeonRunScreen battleState={activeBattle} onEnterBattle={startDungeonRoomBattle} onCollectLoot={collectDungeonLoot} t={t} />; break;
        case 'pet-hub': screen = <PetHub onBack={() => setCurrentView('menu')} onInventory={() => setCurrentView('inventory')} onItemInventory={() => setCurrentView('item-inventory')} onBreed={() => setCurrentView('breeding')} onHatchery={() => setCurrentView('hatchery')} onDex={() => setCurrentView('dex')} t={t} tutorialHighlight={tutorialHighlight} />; break;
        case 'hatchery': screen = <HatcheryScreen pets={myPets} user={user} onBack={() => setCurrentView('pet-hub')} onHatchEgg={handleHatchEggWrapper} onReduceCooldown={handleReduceCooldownWrapper} onStartIncubation={handleStartIncubationWrapper} onWatchAdForHatch={handleWatchAdForHatchWrapper} t={t} tutorialHighlight={tutorialHighlight} />; break;
        case 'dex': screen = <DexScreen myPets={myPets} onBack={() => setCurrentView('pet-hub')} t={t} />; break;

        case 'team-edit': screen = <TeamEditScreen user={user} pets={myPets} onBack={() => setCurrentView('arena-hub')} onAddPet={(slotIndex) => { setSelectedSlotForTeam(slotIndex); setCurrentView('team-select-pet'); }} onRemovePet={removeFromTeam} onAutoFill={autoFillTeam} t={t} tutorialHighlight={tutorialHighlight} />; break;
        case 'team-select-pet': screen = <InventoryScreen pets={getAvailablePets()} title={t ? t('label_select_team_pet') : 'Select Pet for Team'} onBack={() => setCurrentView('team-edit')} onSelectPet={(id) => addToTeam(id)} highlightMode={true} filterEggs={true} t={t} />; break;

        case 'inventory': screen = <InventoryScreen pets={myPets} title={t('pethub_inventory_btn')} onBack={() => setCurrentView('pet-hub')} onSelectPet={(id) => { const p = myPets.find(p => p.id === id); if (p.isEgg) return; setSelectedPetDetail(p); setCurrentView('pet-detail'); }} filterEggs={true} t={t} />; break;
        case 'pet-detail': screen = activePetDetail && <PetDetailScreen pet={activePetDetail} user={user} onBack={() => setCurrentView('inventory')} onRenamePet={renamePet} onReleasePet={releasePet} onOpenGear={() => setCurrentView('gear-inventory')} t={t} />; break;
        case 'gear-inventory': screen = activePetDetail && <GearInventoryScreen pet={activePetDetail} user={user} onBack={() => setCurrentView('pet-detail')} onEquipGear={gameLogic.equipGear} onUnequipGear={gameLogic.unequipGear} onSellGear={gameLogic.sellGear} t={t} />; break;

        case 'breeding': screen = <BreedingScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onBreed={breedPets} onReduceCooldown={handleReduceCooldownWrapper} user={user} t={t} />; break;
        case 'battle': screen = activeBattle && <BattleScreen battleState={activeBattle} setBattleState={setActiveBattle} user={user} onWin={handleWinWrapper} onLose={handleLose} isAutoBattle={autoBattleRemaining > 0} autoBattleRemaining={autoBattleRemaining} onCancelAutoBattle={cancelAutoBattle} t={t} lowPowerMode={settings?.lowPowerMode === true} />; break;
        case 'profile': screen = <ProfileScreen user={user} pets={myPets} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={handleAddFriend} onAcceptFriendRequest={handleAcceptFriendRequest} onDeclineFriendRequest={handleDeclineFriendRequest} onBack={() => setCurrentView('menu')} onUpdateProfile={handleUpdateProfile} t={t} />; break;
        case 'friend-profile': screen = selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} onStartBattle={startFriendBattle} t={t} />; break;
        case 'settings': screen = <SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout} onBack={() => setCurrentView('menu')} onNavigate={setCurrentView} t={t} />; break;
        case 'legal-imprint': screen = <LegalScreen type='imprint' onBack={() => setCurrentView('settings')} t={t} />; break;
        case 'legal-privacy': screen = <LegalScreen type='privacy' onBack={() => setCurrentView('settings')} t={t} />; break;
        case 'patches': screen = <PatchesScreen onBack={() => setCurrentView('settings')} t={t} />; break;
        case 'feedback': screen = <FeedbackScreen onBack={() => setCurrentView('settings')} user={user} t={t} />; break;
        case 'admin': screen = <AdminDashboardScreen onBack={() => setCurrentView('settings')} />; break;

        case 'chat': screen = <ChatScreen user={user} onBack={() => setCurrentView('menu')} onViewPlayer={(player) => { if (!player) { setCurrentView('profile'); } else { setSelectedFriend(player); setCurrentView('chat-player-profile'); } }} t={t} />; break;
        case 'chat-player-profile': screen = selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('chat')} onStartBattle={startFriendBattle} t={t} />; break;

        case 'guild': screen = <GuildScreen user={user} onBack={() => setCurrentView('menu')} onOpenChat={() => setCurrentView('guild-chat')} onOpenLeaderboard={() => setCurrentView('guild-leaderboard')} showNotification={gameLogic.showNotification} />; break;
        case 'guild-chat': screen = <GuildChatScreen user={user} onBack={() => setCurrentView('guild')} />; break;
        case 'guild-leaderboard': screen = <GuildLeaderboardScreen user={user} onBack={() => setCurrentView('guild')} />; break;

        default: screen = null;
    }

    return <Suspense fallback={<ScreenFallback />}>{screen}</Suspense>;
}
