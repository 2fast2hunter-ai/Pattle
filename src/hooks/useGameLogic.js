import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { useGameLogicState } from './useGameLogic/useGameLogicState'; 
import { useGameActions } from './useGameLogic/useGameActions'; 
import { updateUser, checkAndResetQuests } from '../utils/db'; 
// WICHTIG: getMaxEnergy IMPORT ENTFERNT!

export function useGameLogic() {
    const [userId, setUserId] = useState(null); 
    
    const gameLogicState = useGameLogicState(userId); 
    const actions = useGameActions(gameLogicState, setUserId); 
    
    const actionsRef = useRef(actions);
    const stateRef = useRef(gameLogicState);
    
    useEffect(() => {
        actionsRef.current = actions;
        stateRef.current = gameLogicState;
    });

    // A. AUTO LOGIN CHECK
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await actionsRef.current.handleLogin(currentUser, currentUser.displayName);
                stateRef.current.setCurrentView('menu'); 
                stateRef.current.setAuthLoading(false); 
            } else {
                stateRef.current.setAuthLoading(false);
            }
        });

        return () => unsubscribe();
    }, []); 

    // B. LADEZUSTAND & QUEST-INIT
    useEffect(() => {
        if (userId && gameLogicState.user) {
            if (gameLogicState.authLoading) {
                gameLogicState.setAuthLoading(false);
            }
            checkAndResetQuests(gameLogicState.user).catch(console.error);
        }
    }, [userId, gameLogicState.user]); 

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

    // 4. Rückgabe: Alle States und alle Actions
    return { ...gameLogicState, ...actions };
}