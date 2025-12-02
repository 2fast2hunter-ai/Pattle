import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { useGameLogicState } from './useGameLogic/useGameLogicState'; 
import { useGameActions } from './useGameLogic/useGameActions'; 
import { getMaxEnergy } from '../utils/gameMechanics';
import { updateUser, checkAndResetQuests } from '../utils/db';


export function useGameLogic() {
    // 1. STATES FÜR ABHÄNGIGKEITS-KETTE
    const [userId, setUserId] = useState(null); 
    
    // 2. Initialisiere Hooks
    const gameLogicState = useGameLogicState(userId); 
    const actions = useGameActions(gameLogicState, setUserId); 
    
    // Ref, um Endlosschleifen bei useEffect zu vermeiden
    const actionsRef = useRef(actions);
    const stateRef = useRef(gameLogicState);
    
    // Aktualisiere Refs bei jedem Render (für Zugriff in useEffects ohne Re-Trigger)
    useEffect(() => {
        actionsRef.current = actions;
        stateRef.current = gameLogicState;
    });

    // --- CORE HOOKS ---

    // A. AUTO LOGIN CHECK (FIX: Läuft nur EINMAL beim Mounten)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Wenn User eingeloggt: Starte den Login-Prozess
                // Wir nutzen die Refs, damit wir sie nicht in die Dependency-Array packen müssen
                await actionsRef.current.handleLogin(currentUser, currentUser.displayName);
                
                stateRef.current.setCurrentView('menu'); 
                stateRef.current.setAuthLoading(false); 
            } else {
                // Wenn KEIN User gefunden wird: Beende den Ladezustand
                stateRef.current.setAuthLoading(false);
            }
        });

        return () => unsubscribe();
    }, []); // WICHTIG: Leeres Array = Nur beim Start ausführen!


    // B. LADEZUSTAND & QUEST-INIT
    useEffect(() => {
        // Sobald der User geladen ist (gameLogicState.user existiert)
        if (userId && gameLogicState.user) {
            if (gameLogicState.authLoading) {
                gameLogicState.setAuthLoading(false);
            }
            
            // Fix: Quests initialisieren
            checkAndResetQuests(gameLogicState.user).catch(console.error);
        }
    }, [userId, gameLogicState.user]); // Reagiert nur, wenn User-Daten da sind


    // C. PASSIVE EFFEKTE (Level Up)
    useEffect(() => {
        const { user, previousLevel, setShowLevelUpModal, setPreviousLevel } = gameLogicState;
        if (!user || previousLevel === null) return;
        
        if (user.id !== previousLevel.id) {
            setPreviousLevel({ level: user.level, id: user.id });
            return; 
        }

        if (user.level > previousLevel.level) {
            setShowLevelUpModal(true);
        }

        setPreviousLevel({ level: user.level, id: user.id });
    }, [gameLogicState.user?.level, gameLogicState.user?.id]);

    useEffect(() => {
        const { user, setUser } = gameLogicState; // Wir brauchen setUser!
        if (!user) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const msPerEnergy = 1000 * 60 * 5; 
            const timeDiff = now - user.lastEnergyUpdate;
            const maxEn = getMaxEnergy(user.level);

            // Prüfen, ob wir visuell etwas updaten müssen
            if (timeDiff >= msPerEnergy && user.energy < maxEn) {
                const energyGained = Math.floor(timeDiff / msPerEnergy);
                
                if (energyGained > 0) {
                    // WICHTIG: Wir ändern nur den LOKALEN State für die UI.
                    // Wir schreiben NICHT in die Datenbank (spart 99% der Kosten).
                    const newLocalEnergy = Math.min(maxEn, user.energy + energyGained);
                    
                    // Wir "spulen" die lokale Zeit vor, damit der Balken nicht springt
                    // (Das ist nur für die Anzeige, die echte Berechnung passiert bei Aktionen)
                    const newLastUpdate = user.lastEnergyUpdate + (energyGained * msPerEnergy);
                    
                    setUser(prev => ({
                        ...prev,
                        energy: newLocalEnergy,
                        lastEnergyUpdate: newLastUpdate
                    }));
                }
            }
        }, 1000); // Jede Sekunde prüfen ist okay, da wir nur lokal rechnen

        return () => clearInterval(interval);
    }, [gameLogicState.user]); // Abhängigkeit beachten


    // 4. Rückgabe: Alle States und alle Actions
    return { ...gameLogicState, ...actions };
}