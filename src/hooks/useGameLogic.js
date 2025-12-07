import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase.js'; 
import { useGameLogicState } from './useGameLogic/useGameLogicState'; 
import { useGameActions } from './useGameLogic/useGameActions'; 
import { checkAndResetQuests, checkAndInitVillage, listenToUser, listenToPets, listenToMarket, checkAndResolveInterruptedBattle, updateUser } from '../utils/db'; 

export function useGameLogic() {
    const [userId, setUserId] = useState(null); 
    
    const gameLogicState = useGameLogicState(userId); 
    const actions = useGameActions(gameLogicState, setUserId); 
    
    const actionsRef = useRef(actions);
    const stateRef = useRef(gameLogicState);
    const initialBattleCheckDone = useRef(false);

    useEffect(() => {
        actionsRef.current = actions;
        stateRef.current = gameLogicState;
    });

    // --- A. DATENBANK LISTENER ---
    useEffect(() => {
        if (!userId) {
            initialBattleCheckDone.current = false;
            return;
        }
        
        console.log(">>> START: Datenbank-Verbindung für", userId);

        const unsubUser = listenToUser(userId, async (userData) => {
            stateRef.current.setUser(userData);
            
            // --- ELO RESET CHECK (NEUER TAG) ---
            // FIX: ISO Datum nutzen (YYYY-MM-DD)
            const today = new Date().toISOString().split('T')[0];
            
            if (userData.lastEloDate !== today) {
                console.log("[Logic] Neuer Tag erkannt! Setze Elo-Startwert zurück.");
                updateUser(userId, {
                    lastEloDate: today,
                    startEloToday: userData.rating || 1000
                });
            }
            // -----------------------------------
            
            if (stateRef.current.currentView === 'auth' || stateRef.current.authLoading) {
                stateRef.current.setAuthLoading(false);
                stateRef.current.setCurrentView('menu');
            }

            checkAndResetQuests(userData).catch(e => console.error("Quest Error:", e));
            
            // --- KAMPF-ABBRUCH CHECK ---
            if (!initialBattleCheckDone.current) {
                initialBattleCheckDone.current = true; 
                if (userData.isInBattle) {
                    setTimeout(async () => {
                         const resolution = await checkAndResolveInterruptedBattle(userData.id);
                         if (resolution && resolution.resolved) {
                             if (actionsRef.current.showNotification) {
                                 actionsRef.current.showNotification(`Kampf wurde abgebrochen! Niederlage (-${resolution.ratingLoss} Rating).`, 'error');
                             }
                             stateRef.current.setCurrentView('arena-hub'); 
                         }
                    }, 500);
                }
            }

            checkAndInitVillage(userData).catch(e => console.error("Village Init Error:", e));
        });

        const unsubPets = listenToPets(userId, (petsData) => {
            stateRef.current.setMyPets(petsData);
        });

        const unsubMarket = listenToMarket((marketData) => {
            stateRef.current.setMarketListings(marketData);
        });

        return () => {
            unsubUser();
            unsubPets();
            unsubMarket();
        };
    }, [userId]);

    // --- B. AUTO LOGIN ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                console.log("Auth: User erkannt:", currentUser.uid);
                await actionsRef.current.handleLogin(currentUser, currentUser.displayName);
            } else {
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