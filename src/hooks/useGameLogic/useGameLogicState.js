import { useState } from 'react';

export function useGameLogicState(userId) {
    const [user, setUser] = useState(null); 
    const [currentView, setCurrentView] = useState('auth'); 
    const [authLoading, setAuthLoading] = useState(true); 
    
    const [myPets, setMyPets] = useState([]);
    const [marketListings, setMarketListings] = useState([]);
    
    // UI States
    const [activeBattle, setActiveBattle] = useState(null);
    const [selectedPetDetail, setSelectedPetDetail] = useState(null);
    const [settings, setSettings] = useState({ music: true, sfx: true, notifications: false });
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [selectedSlotForTeam, setSelectedSlotForTeam] = useState(null);
    const [notification, setNotification] = useState(null);
    const [lootResult, setLootResult] = useState(null); 
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [previousLevel, setPreviousLevel] = useState(null); 
    
    const [autoBattleRemaining, setAutoBattleRemaining] = useState(0);

    // HIER KEINE LISTENER MEHR! (Die sind jetzt in useGameLogic.js)

    return {
        user, setUser, 
        currentView, setCurrentView, 
        authLoading, setAuthLoading,
        myPets, setMyPets, 
        marketListings, setMarketListings,
        activeBattle, setActiveBattle, 
        selectedPetDetail, setSelectedPetDetail, 
        settings, setSettings, 
        showLevelUpModal, setShowLevelUpModal, 
        selectedSlotForTeam, setSelectedSlotForTeam, 
        notification, setNotification, 
        lootResult, setLootResult, 
        selectedFriend, setSelectedFriend, 
        previousLevel, setPreviousLevel,
        autoBattleRemaining, setAutoBattleRemaining
    };
}