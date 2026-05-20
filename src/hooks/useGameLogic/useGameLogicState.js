import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../../data/translations';

export function useGameLogicState(userId) {
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('auth');
    const [authLoading, setAuthLoading] = useState(true);

    const [myPets, setMyPets] = useState([]);
    const [marketListings, setMarketListings] = useState([]);

    // UI States
    const [activeBattle, setActiveBattle] = useState(null);
    const [selectedPetDetail, setSelectedPetDetail] = useState(null);

    // SETTINGS: Laden aus LocalStorage (Persistenz)
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('game_settings');
            if (saved) return JSON.parse(saved);
        } catch (e) { console.error("Settings load error", e); }
        return { musicEnabled: true, soundEnabled: true, language: 'de' };
    });

    // Translation Helper
    const t = (key, params = {}) => {
        let text = TRANSLATIONS[settings?.language || 'de']?.[key] || key;
        Object.entries(params).forEach(([k, v]) => text = text.replace(`{${k}}`, v));
        return text;
    };

    // SETTINGS: Speichern bei Änderung
    useEffect(() => { localStorage.setItem('game_settings', JSON.stringify(settings)); }, [settings]);

    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [selectedSlotForTeam, setSelectedSlotForTeam] = useState(null);
    const [notification, setNotification] = useState(null);
    const [lootResult, setLootResult] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [previousLevel, setPreviousLevel] = useState(null);

    const [autoBattleRemaining, setAutoBattleRemaining] = useState(0);
    const [idleReturnResult, setIdleReturnResult] = useState(null);

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
        autoBattleRemaining, setAutoBattleRemaining,
        idleReturnResult, setIdleReturnResult,
        t
    };
}