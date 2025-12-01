import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { useGameLogicState } from './useGameLogic/useGameLogicState'; 
import { useGameActions } from './useGameLogic/useGameActions'; 
import { getMaxEnergy } from '../utils/gameMechanics';
import { updateUser } from '../utils/db';


export function useGameLogic() {
    const [userId, setUserId] = useState(null); 
    
    const gameLogicState = useGameLogicState(userId); 
    
    // Wir übergeben eine Wrapper-Funktion für setUserId, um den State lokal und im Hook zu setzen
    const actions = useGameActions(gameLogicState, setUserId); 

    // --- CORE HOOKS ---

    // A. AUTO LOGIN CHECK (Verbesserte Logik)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // 1. Setze UserId, damit der State-Hook (useGameLogicState) anfängt zu laden
                setUserId(currentUser.uid);
                
                // 2. Führe Login-Logik aus (DB-Check etc.)
                await actions.handleLogin(currentUser, currentUser.displayName);
                
                // HINWEIS: Wir setzen hier NICHT sofort authLoading auf false!
                // Das machen wir erst, wenn der User-State im nächsten Effekt da ist.
            } else {
                // Kein User eingeloggt -> Ladezustand beenden, damit AuthScreen gezeigt wird
                setUserId(null);
                gameLogicState.setAuthLoading(false);
            }
        });

        return () => unsubscribe();
    }, []); // Leeres Array, damit dies nur EINMAL beim Start läuft

    // B. LADEZUSTAND MANAGEN (Wartet auf User-Daten)
    useEffect(() => {
        // Wenn wir eine UserId haben UND die User-Daten aus der DB geladen wurden (gameLogicState.user ist nicht null)
        if (userId && gameLogicState.user) {
            gameLogicState.setAuthLoading(false);
            // Nur navigieren, wenn wir noch auf 'auth' stehen (verhindert Zurücksetzen beim Neuladen)
            if (gameLogicState.currentView === 'auth') {
                gameLogicState.setCurrentView('menu');
            }
        }
    }, [userId, gameLogicState.user]); // Reagiert, sobald User-Daten da sind


    // C. PASSIVE EFFEKTE (Level Up und Energy Regen)
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
    }, [gameLogicState.user?.level, gameLogicState.user?.id]); // Abhängigkeiten optimiert

    // ENERGY REGENERATION
    useEffect(() => {
        const { user } = gameLogicState;
        if (!user) return;
        const interval = setInterval(() => {
            const now = Date.now();
            const msPerEnergy = 1000 * 60 * 5; 
            const timeDiff = now - user.lastEnergyUpdate;
            
            if (timeDiff >= msPerEnergy) {
                const energyToGain = Math.floor(timeDiff / msPerEnergy);
                const maxEn = getMaxEnergy(user.level);
                
                if (user.energy < maxEn) {
                     const newEnergy = Math.min(maxEn, user.energy + energyToGain);
                     const newLastUpdate = user.lastEnergyUpdate + (energyToGain * msPerEnergy);
                     updateUser(userId, { energy: newEnergy, lastEnergyUpdate: newLastUpdate });
                } else { 
                     updateUser(userId, { lastEnergyUpdate: now });
                }
            }
        }, 10000); 
        return () => clearInterval(interval);
    }, [gameLogicState.user, userId]); 


    return { ...gameLogicState, ...actions };
}