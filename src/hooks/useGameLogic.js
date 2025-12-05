import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { useGameLogicState } from './useGameLogic/useGameLogicState'; 
import { useGameActions } from './useGameLogic/useGameActions'; 
// WICHTIG: Diese Importe müssen da sein!
import { checkAndResetQuests, listenToUser, listenToPets, listenToMarket } from '../utils/db';

export function useGameLogic() {
    // 1. STATES
    const [userId, setUserId] = useState(null); 
    
    // 2. HOOKS
    const gameLogicState = useGameLogicState(userId); 
    const actions = useGameActions(gameLogicState, setUserId); 
    
    // Refs (verhindern Endlosschleifen in useEffect)
    const actionsRef = useRef(actions);
    const stateRef = useRef(gameLogicState);
    
    useEffect(() => {
        actionsRef.current = actions;
        stateRef.current = gameLogicState;
    });

    // --- A. DATENBANK LISTENER (DAS HAT GEFEHLT!) ---
    useEffect(() => {
        if (!userId) return;

        console.log(">>> START: Datenbank-Verbindung für", userId);

        // 1. User Daten
        const unsubUser = listenToUser(userId, (userData) => {
            console.log("<<< DATEN: User empfangen");
            stateRef.current.setUser(userData);
            
            // Wenn wir noch im Ladebildschirm oder Auth sind -> ins Spiel!
            if (stateRef.current.currentView === 'auth' || stateRef.current.authLoading) {
                stateRef.current.setAuthLoading(false);
                stateRef.current.setCurrentView('menu');
            }

            // Quests prüfen
            checkAndResetQuests(userData).catch(e => console.error("Quest Error:", e));
        });

        // 2. Pets
        const unsubPets = listenToPets(userId, (petsData) => {
            stateRef.current.setMyPets(petsData);
        });

        // 3. Markt
        const unsubMarket = listenToMarket((marketData) => {
            stateRef.current.setMarketListings(marketData);
        });

        return () => {
            console.log("STOP: Datenbank-Verbindung getrennt");
            unsubUser();
            unsubPets();
            unsubMarket();
        };
    }, [userId]);


    // --- B. AUTO LOGIN (Firebase Auth) ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                console.log("Auth: User erkannt:", currentUser.uid);
                await actionsRef.current.handleLogin(currentUser, currentUser.displayName);
                // HINWEIS: setUserId passiert in handleLogin -> das triggert den Effekt oben (A)
            } else {
                console.log("Auth: Ausgeloggt");
                stateRef.current.setAuthLoading(false);
                stateRef.current.setCurrentView('auth');
            }
        });
        return () => unsubscribe();
    }, []); 


    // --- C. LEVEL UP CHECK ---
    useEffect(() => {
        const { user, previousLevel, setShowLevelUpModal, setPreviousLevel } = gameLogicState;
        
        if (!user) return; 
        
        // Sicherer Check gegen undefined/null
        if (!previousLevel || user.id !== previousLevel?.id) {
            setPreviousLevel({ level: user.level, id: user.id });
            return; 
        }

        if (user.level > previousLevel.level) {
            setShowLevelUpModal(true);
        }

        setPreviousLevel({ level: user.level, id: user.id });
    }, [gameLogicState.user?.level, gameLogicState.user?.id]);

    return { ...gameLogicState, ...actions };
}