import { useState, useEffect } from 'react';
import { listenToUser, listenToPets, listenToMarket } from '../../utils/db';

export function useGameLogicState(userId) {
    const [user, setUser] = useState(null); 
    const [currentView, setCurrentView] = useState('auth'); 
    const [authLoading, setAuthLoading] = useState(true); 
    
    // ... (restliche States bleiben gleich)
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
    const [previousLevel, setPreviousLevel] = useState(null); 

    // Initial Data Listeners
    useEffect(() => {
        if (!userId) {
            // WICHTIG: Wenn kein User da ist, setzen wir user explizit auf null
            setUser(null);
            return;
        }

        const unsubscribeUser = listenToUser(userId, (userData) => {
            setUser(userData);
        });
        const unsubscribePets = listenToPets(userId, (petsData) => setMyPets(petsData));
        const unsubscribeMarket = listenToMarket((listingsData) => setMarketListings(listingsData));

        return () => {
            unsubscribeUser();
            unsubscribePets();
            unsubscribeMarket();
        };
    }, [userId]);

    return {
        user, setUser, currentView, setCurrentView, authLoading, setAuthLoading,
        myPets, setMyPets, marketListings, setMarketListings,
        activeBattle, setActiveBattle, selectedPetDetail, setSelectedPetDetail, 
        settings, setSettings, showLevelUpModal, setShowLevelUpModal, 
        selectedSlotForTeam, setSelectedSlotForTeam, notification, setNotification, 
        lootResult, setLootResult, selectedFriend, setSelectedFriend, 
        previousLevel, setPreviousLevel
    };
}