// src/hooks/useGameLogic.js
import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useGameLogicState } from './useGameLogic/useGameLogicState';
import { useGameActions } from './useGameLogic/useGameActions';
import { checkAndResetQuests, checkAndInitVillage, listenToUser, listenToPets, listenToMarket, checkAndResolveInterruptedBattle, updateUser, updatePetInDB, deleteField } from '../utils/db'; // updatePetInDB hinzugefügt
import { ABILITIES, SPECIES_ABILITY_MAP } from '../data/gameData'; // Import ABILITIES
import { restoreEggNotifications, scheduleDailyQuestReset } from '../utils/pushNotifications';
import { checkAchievements as checkAchievementsState } from '../utils/checkAchievements';
import { ACHIEVEMENT_TRIGGERS } from '../data/achievements';

export function useGameLogic() {
    const [userId, setUserId] = useState(null); 
    
    const gameLogicState = useGameLogicState(userId); 
    const actions = useGameActions(gameLogicState, setUserId); 
    
    const actionsRef = useRef(actions);
    const stateRef = useRef(gameLogicState);
    const initialBattleCheckDone = useRef(false);
    const isCollectingRef = useRef(false); // Schutz gegen überlappende Aufrufe
    const lastIdleNotificationRef = useRef(0); // Schutz gegen Spam bei abgelaufener Zeit
    const idleReturnCheckedRef = useRef(false); // Einmalige Offline-Auswertung beim Login

    // --- SPLASH SCREEN LOGIC ---
    const minTimePassed = useRef(false);
    const authCheckComplete = useRef(false);

    // 2 Sekunden Mindest-Anzeigezeit für den Splash Screen
    useEffect(() => {
        const timer = setTimeout(() => {
            minTimePassed.current = true;
            attemptFinishLoading();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const attemptFinishLoading = () => {
        // Nur fortfahren, wenn Mindestzeit um ist UND Auth-Check durch ist
        if (!minTimePassed.current || !authCheckComplete.current) return;

        // Wenn wir noch im Loading-Status sind, jetzt beenden
        if (stateRef.current.authLoading) {
            stateRef.current.setAuthLoading(false);
            // Ziel-View basierend auf Login-Status
            if (stateRef.current.user) stateRef.current.setCurrentView('menu');
            else stateRef.current.setCurrentView('auth');
        }
    };
    // ---------------------------

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
            const correctAbilityId = SPECIES_ABILITY_MAP[pet.species];
            if (correctAbilityId && pet.abilityId !== correctAbilityId) {
                // Migrate to species-specific ability
                updatePetInDB(pet.id, { abilityId: correctAbilityId });
            } else if (!pet.abilityId || pet.abilityId === 'tackle') {
                // Fallback: assign type-matching ability for pets without a species map entry
                const matchingAbilityKey = Object.keys(ABILITIES).find(key => ABILITIES[key].element === pet.type && key !== 'tackle');
                if (matchingAbilityKey) {
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
            idleReturnCheckedRef.current = false;
            return;
        }
        
        console.log(">>> START: Database connection for", userId);

        const unsubUser = listenToUser(userId, async (userData) => {
            stateRef.current.setUser(userData);
            
            const today = new Date().toISOString().split('T')[0];
            
            if (userData.lastEloDate !== today) {
                console.log("[Logic] New day detected! Resetting Elo start value.");
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
            
            authCheckComplete.current = true;
            
            // FIX: Wenn Login erfolgreich war (wir haben Daten) und wir noch im Auth-Screen sind -> Weiterleiten
            if (userData && stateRef.current.currentView === 'auth' && !stateRef.current.authLoading) {
                stateRef.current.setCurrentView('menu');
            }
            
            attemptFinishLoading();

            checkAndResetQuests(userData).catch(e => console.error("Quest Error:", e));
            
            if (!initialBattleCheckDone.current) {
                initialBattleCheckDone.current = true; 
                if (userData.isInBattle) {
                    setTimeout(async () => {
                         const resolution = await checkAndResolveInterruptedBattle(userData.id);
                         if (resolution && resolution.resolved) {
                             if (actionsRef.current.showNotification) {
                                 actionsRef.current.showNotification(stateRef.current.t ? stateRef.current.t('notif_battle_interrupted', { loss: resolution.ratingLoss }) : `Battle interrupted! Defeat (-${resolution.ratingLoss} Rating).`, 'error');
                             }
                             stateRef.current.setCurrentView('arena-hub'); 
                         }
                    }, 500);
                }
            }

            checkAndInitVillage(userData).catch(e => console.error("Village Init Error:", e));

            // Einmalige Offline-Auswertung beim ersten Login dieser Session
            if (!idleReturnCheckedRef.current && userData.village) {
                idleReturnCheckedRef.current = true;
                const now = Date.now();
                const lastCollection = userData.village.lastCollectionTime || now;
                const idleExpires = userData.village.idleTimeExpiresAt || 0;
                const offlineGapMs = now - lastCollection;
                // Zeige Modal nur wenn >60s vergangen und Idle-Zeit während der Abwesenheit aktiv war
                if (offlineGapMs > 60000 && idleExpires > lastCollection) {
                    setTimeout(async () => {
                        if (actionsRef.current?.collectVillageResources) {
                            const result = await actionsRef.current.collectVillageResources().catch(() => null);
                            if (result && (result.items?.length > 0 || result.xp > 0)) {
                                stateRef.current.setIdleReturnResult({ ...result, elapsedMs: Math.min(offlineGapMs, idleExpires - lastCollection) });
                            }
                        }
                    }, 1500);
                }
            }
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
                authCheckComplete.current = true;
                attemptFinishLoading();
            }
        });
        return () => unsubscribe();
    }, []); 

    // --- D. AUTO COLLECT VILLAGE (HINTERGRUND) ---
    useEffect(() => {
        if (!userId) return;

        // Reset bei User-Wechsel/Start
        lastIdleNotificationRef.current = 0;

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
                    if (lastIdleNotificationRef.current === 0) {
                        // Beim Start unterdrücken, wenn bereits abgelaufen
                        lastIdleNotificationRef.current = expiresAt;
                    } else if (lastIdleNotificationRef.current !== expiresAt) {
                        if (actions?.showNotification) {
                            actions.showNotification(stateRef.current.t ? stateRef.current.t('notif_village_production_stopped') : 'Village production stopped! Idle time expired.', "error");
                        }
                        lastIdleNotificationRef.current = expiresAt;
                    }
                }
            }
        }, 5000); // Alle 5 Sekunden prüfen

        return () => clearInterval(intervalId);
    }, [userId]);

    // --- E. PUSH NOTIFICATION RESTORE & DAILY RESET ---
    useEffect(() => {
        if (!gameLogicState.myPets) return;
        restoreEggNotifications(gameLogicState.myPets);
    }, [gameLogicState.myPets]);

    useEffect(() => {
        scheduleDailyQuestReset();
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

    // --- F. ACHIEVEMENT CHECK (state_change triggers) ---
    useEffect(() => {
        const { user, myPets, settings } = gameLogicState;
        if (!user || !user.id) return;
        const lang = settings?.language || 'de';
        checkAchievementsState(user, ACHIEVEMENT_TRIGGERS.STATE_CHANGE, {}, actionsRef.current.showNotification, lang, myPets || []);
    }, [gameLogicState.user, gameLogicState.myPets]);

    return { ...gameLogicState, ...actions };
}