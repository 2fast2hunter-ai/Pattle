import React, { useState, useEffect } from 'react';
import './App.css';
import { useGameLogic } from './hooks/useGameLogic';
import { useTutorial } from './hooks/useTutorial';
import { useAppActions } from './hooks/useAppActions';
import { HeaderHUD } from "./components/GameLayout";
import Notification from "./components/ui/Notification";
import GameModals from "./components/GameModals";
import TutorialOverlay from './components/ui/TutorialOverlay';
import LoadingScreen from './components/ui/LoadingScreen';
import ScreenRouter from './components/navigation/ScreenRouter';
import AuthScreen from './screens/AuthScreen';
import { BASE_ANIMALS } from './data/gameData';
import IdleReturnModal from './components/village/IdleReturnModal';
import { playSound, playBGM, setMusicEnabled, setSoundEnabled } from './utils/soundManager';
import { TRANSLATIONS } from './data/translations';
import { trackScreenView, trackSessionDuration } from './utils/analytics';

export default function App() {
    const gameLogic = useGameLogic();
    const {
        user, setUser, currentView, setCurrentView, authLoading, handleLogin, notification,
        lootResult, setLootResult, showLevelUpModal, setShowLevelUpModal, myPets, activeBattle,
        idleReturnResult, setIdleReturnResult,
        settings, handleUpdateProfile,
        selectedPetDetail, setSelectedPetDetail,
        selectedFriend, setSelectedFriend,
        selectedSlotForTeam, setSelectedSlotForTeam
    } = gameLogic;

    const [selectedVillageSlot, setSelectedVillageSlot] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedConsumableId, setSelectedConsumableId] = useState(null);
    const [selectedConsumableQuantity, setSelectedConsumableQuantity] = useState(1);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingPet, setLoadingPet] = useState(null);

    const { tutorialStep, isTutorialActive, tutorialMsg, tutorialHighlight } = useTutorial(user, setUser, currentView, handleUpdateProfile);
    const appActions = useAppActions(gameLogic, user, setUser, tutorialStep);

    useEffect(() => {
        if (authLoading) {
            const keys = Object.keys(BASE_ANIMALS);
            if (keys.length > 0) setLoadingPet({ ...BASE_ANIMALS[keys[Math.floor(Math.random() * keys.length)]], species: keys[Math.floor(Math.random() * keys.length)], rarity: 'MYTHIC', level: 100 });
            setLoadingProgress(0);
            const interval = setInterval(() => setLoadingProgress(p => (p >= 100 ? 100 : p + 1)), 40);
            return () => clearInterval(interval);
        }
    }, [authLoading]);

    useEffect(() => {
        setMusicEnabled(settings?.musicEnabled !== false);
        setSoundEnabled(settings?.soundEnabled !== false);
        if (settings?.musicEnabled !== false) playBGM(currentView);
    }, [currentView, settings]);

    useEffect(() => {
        if (currentView) trackScreenView(currentView);
    }, [currentView]);

    useEffect(() => {
        const sessionStart = Date.now();
        return () => {
            const seconds = Math.round((Date.now() - sessionStart) / 1000);
            trackSessionDuration(seconds);
        };
    }, []);

    useEffect(() => { if (notification) playSound('notification'); }, [notification]);

    const { t } = gameLogic;

    const getBusyPets = () => {
        if (!user) return [];
        const teamIds = (user.team || []).filter(Boolean);
        const workerIds = [];
        if (user.village?.workers) Object.values(user.village.workers).forEach(slot => Array.isArray(slot) && slot.forEach(id => id && workerIds.push(id)));
        return [...teamIds, ...workerIds];
    };

    // Handler Helper
    const handleOpenVillageSelector = (resourceId, slotIndex) => { setSelectedVillageSlot({ resourceId, slotIndex }); setCurrentView('village-select-pet'); };
    const handleToggleTrainingPet = (slotIndex) => { user.village?.workers?.training?.[slotIndex] ? gameLogic.removeWorker('training', slotIndex) : handleOpenVillageSelector('training', slotIndex); };
    const handleAssignVillageWorker = (petId) => {
        gameLogic.assignWorker(selectedVillageSlot.resourceId, selectedVillageSlot.slotIndex, petId);
        setCurrentView(selectedVillageSlot.resourceId === 'training' ? 'village' : 'village-detail'); setSelectedVillageSlot(null);
    };
    const handleUseItemRequest = (itemId, quantity) => { setSelectedConsumableId(itemId); setSelectedConsumableQuantity(quantity); setCurrentView('item-use-select-pet'); };
    const handleApplyItemToPet = async (petId) => { await gameLogic.applyXpItem(petId, selectedConsumableId, selectedConsumableQuantity); setSelectedConsumableId(null); setCurrentView('item-inventory'); };

    if (authLoading) return <LoadingScreen loadingPet={loadingPet} loadingProgress={loadingProgress} />;
    if (currentView === 'auth' || !user) return <AuthScreen onLogin={handleLogin} />;

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 font-sans text-white overflow-hidden relative">
            {isTutorialActive && <TutorialOverlay message={tutorialMsg} step={tutorialStep} />}
            {notification && <div className="absolute top-0 left-0 w-full z-[9999] flex justify-center pt-4 pointer-events-none"><div className="pointer-events-auto w-full max-w-md px-4"><Notification notification={notification} /></div></div>}
            {lootResult && <GameModals.LootboxModal pet={lootResult} onClose={() => setLootResult(null)} t={t} />}
            {showLevelUpModal && <GameModals.LevelUpModal level={user.level} onClose={() => setShowLevelUpModal(false)} />}
            {idleReturnResult && <IdleReturnModal result={idleReturnResult} onClose={() => setIdleReturnResult(null)} t={t} />}

            {currentView !== 'battle' && <div className="w-full"><HeaderHUD user={user} /></div>}

            <main className="flex-1 relative overflow-hidden bg-slate-900">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
                <div className="h-full w-full overflow-hidden">
                    <ScreenRouter
                        currentView={currentView} setCurrentView={setCurrentView} user={user} gameLogic={gameLogic} t={t} tutorialHighlight={tutorialHighlight}
                        myPets={myPets} busyPets={getBusyPets()} selectedVillageSlot={selectedVillageSlot} setSelectedVillageSlot={setSelectedVillageSlot}
                        selectedResource={selectedResource} setSelectedResource={setSelectedResource}
                        selectedPetDetail={selectedPetDetail} setSelectedPetDetail={setSelectedPetDetail}
                        selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend}
                        selectedSlotForTeam={selectedSlotForTeam} setSelectedSlotForTeam={setSelectedSlotForTeam}
                        activeBattle={activeBattle} setActiveBattle={gameLogic.setActiveBattle} autoBattleRemaining={gameLogic.autoBattleRemaining}
                        handleCollectVillage={(silent, rId) => gameLogic.collectVillageResources(rId).then(res => !silent && gameLogic.showNotification("Gesammelt", "success"))}
                        handleOpenVillageSelector={handleOpenVillageSelector} handleOpenResource={(r) => { setSelectedResource(r); setCurrentView('village-detail'); }}
                        handleToggleTrainingPet={handleToggleTrainingPet} handleAssignVillageWorker={handleAssignVillageWorker}
                        handleUseItemRequest={handleUseItemRequest} handleApplyItemToPet={handleApplyItemToPet}
                        handleOpenLootboxWrapper={appActions.handleOpenLootboxWrapper} handleStartIncubationWrapper={appActions.handleStartIncubationWrapper}
                        handleReduceCooldownWrapper={appActions.handleReduceCooldownWrapper} handleHatchEggWrapper={appActions.handleHatchEggWrapper}
                        handleWinWrapper={appActions.handleWinWrapper} handleLose={gameLogic.handleLose} handleWatchAd={appActions.handleWatchAd} handleWatchAdForHatchWrapper={appActions.handleWatchAdForHatchWrapper}
                        handleAutoBattle={gameLogic.handleAutoBattle} cancelAutoBattle={gameLogic.cancelAutoBattle}
                        renamePet={gameLogic.renamePet} releasePet={gameLogic.releasePet} addToTeam={gameLogic.addToTeam} removeFromTeam={gameLogic.removeFromTeam}
                        handleBuyMarket={gameLogic.handleBuyMarket} handleSellMarket={gameLogic.handleSellMarket} handleSellResource={gameLogic.handleSellResource} handleRemoveListing={gameLogic.handleRemoveListing}
                        startBattle={gameLogic.startBattle} startGauntletBattle={gameLogic.startGauntletBattle} startTowerBattle={gameLogic.startTowerBattle} startFriendBattle={gameLogic.startFriendBattle}
                        handleAddFriend={gameLogic.handleAddFriend} handleUpdateProfile={handleUpdateProfile} handleLogout={gameLogic.handleLogout}
                        settings={settings} setSettings={gameLogic.setSettings}
                        claimMilestone={gameLogic.claimMilestone} tradeResources={gameLogic.tradeResources} buyCosmetic={gameLogic.buyCosmetic} buySpecialOffer={gameLogic.buySpecialOffer} addIdleTime={gameLogic.addIdleTime}
                        buyLootbox={gameLogic.buyLootbox} buyTickets={gameLogic.buyTickets} claimTimedReward={gameLogic.claimTimedReward} breedPets={gameLogic.breedPets}
                    />
                </div>
            </main>
        </div>
    );
}