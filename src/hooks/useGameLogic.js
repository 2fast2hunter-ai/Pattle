// src/hooks/useGameLogic.js
import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase.js'; 
import { useGameLogicState } from './useGameLogic/useGameLogicState'; 
import { useGameActions } from './useGameLogic/useGameActions'; 
import { checkAndResetQuests, checkAndInitVillage, listenToUser, listenToPets, listenToMarket, checkAndResolveInterruptedBattle, updateUser, updatePetInDB, deleteField } from '../utils/db'; // updatePetInDB hinzugefügt
import { ABILITIES } from '../data/gameData'; // Import ABILITIES

export function useGameLogic() {
    const [userId, setUserId] = useState(null); 
    
    const gameLogicState = useGameLogicState(userId); 
    const actions = useGameActions(gameLogicState, setUserId); 
    
    const actionsRef = useRef(actions);
    const stateRef = useRef(gameLogicState);
    const initialBattleCheckDone = useRef(false);
    const isCollectingRef = useRef(false); // Schutz gegen überlappende Aufrufe
    const lastIdleNotificationRef = useRef(0); // Schutz gegen Spam bei abgelaufener Zeit

    useEffect(() => {
        actionsRef.current = actions;
        stateRef.current = gameLogicState;
    });

    // --- NEU: AUTO-FIX FÜR FÄHIGKEITEN ---
    // Prüft, ob Pets noch "Tackle" haben und gibt ihnen die richtige Fähigkeit
    useEffect(() => {
        const { myPets } = gameLogicState;
        if (!myPets || myPets.length === 0) return;

        myPets.forEach(pet => {
            // Wenn Pet Tackle hat ODER gar keine AbilityId
            if (!pet.abilityId || pet.abilityId === 'tackle') {
                // Suche passende Fähigkeit basierend auf dem Typ
                const matchingAbilityKey = Object.keys(ABILITIES).find(key => ABILITIES[key].element === pet.type);
                
                // Wenn wir eine bessere Fähigkeit finden, updaten wir das Pet in der DB
                if (matchingAbilityKey && matchingAbilityKey !== 'tackle') {
                    console.log(`[AutoFix] Aktualisiere Fähigkeit für ${pet.name} (${pet.type}): Tackle -> ${ABILITIES[matchingAbilityKey].name}`);
                    updatePetInDB(pet.id, { abilityId: matchingAbilityKey });
                }
            }
        });
    }, [gameLogicState.myPets]); // Führt dies aus, wenn Pets geladen werden
    // --------------------------------------

    // --- A. DATENBANK LISTENER ---
    useEffect(() => {
        if (!userId) {
            initialBattleCheckDone.current = false;
            return;
        }
        
        console.log(">>> START: Datenbank-Verbindung für", userId);

        const unsubUser = listenToUser(userId, async (userData) => {
            stateRef.current.setUser(userData);
            
            const today = new Date().toISOString().split('T')[0];
            
            if (userData.lastEloDate !== today) {
                console.log("[Logic] Neuer Tag erkannt! Setze Elo-Startwert zurück.");
                updateUser(userId, {
                    lastEloDate: today,
                    startEloToday: userData.rating || 1000
                });
            }

            // Saison Belohnung anzeigen
            if (userData.seasonRewardMessage) {
                actionsRef.current.showNotification(userData.seasonRewardMessage, 'success');
                updateUser(userId, { seasonRewardMessage: deleteField() });
            }
            
            if (stateRef.current.currentView === 'auth' || stateRef.current.authLoading) {
                stateRef.current.setAuthLoading(false);
                stateRef.current.setCurrentView('menu');
            }

            checkAndResetQuests(userData).catch(e => console.error("Quest Error:", e));
            
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

    // --- D. AUTO COLLECT VILLAGE (HINTERGRUND) ---
    useEffect(() => {
        if (!userId) return;

        const intervalId = setInterval(async () => {
            if (isCollectingRef.current) return; // Nicht starten, wenn noch ein Request läuft

            const currentUser = stateRef.current.user;
            const actions = actionsRef.current;
            const now = Date.now();

            // Prüfen: User da, Dorf da
            if (currentUser?.village?.idleTimeExpiresAt) {
                const expiresAt = currentUser.village.idleTimeExpiresAt;

                if (now < expiresAt) {
                    // Idle Zeit läuft noch -> Sammeln
                    if (actions?.collectVillageResources) {
                        isCollectingRef.current = true;
                        // Silent Collect: Sammelt Ressourcen & XP. Level-Ups zeigen Benachrichtigungen (in useVillageActions).
                        await actions.collectVillageResources().catch(e => console.error("[AutoCollect] Fehler:", e));
                        isCollectingRef.current = false;
                    }
                } else {
                    // Idle Zeit abgelaufen -> Benachrichtigen (nur einmal pro Ablaufzeit)
                    if (lastIdleNotificationRef.current !== expiresAt) {
                        if (actions?.showNotification) {
                            actions.showNotification("Dorf-Produktion gestoppt! Idle-Zeit abgelaufen.", "error");
                        }
                        lastIdleNotificationRef.current = expiresAt;
                    }
                }
            }
        }, 5000); // Alle 5 Sekunden prüfen

        return () => clearInterval(intervalId);
    }, [userId]);

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