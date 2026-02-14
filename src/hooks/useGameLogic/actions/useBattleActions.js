// src/hooks/useGameLogic/actions/useBattleActions.js

import { startBattle } from './startBattle';
import { startFriendBattle } from './startFriendBattle';
import { handleWin } from './handleWin';
import { handleLose } from './handleLose';
import { handleAutoBattle } from './handleAutoBattle';
import { cancelAutoBattle } from './cancelAutoBattle';
import { startTowerBattle } from './startTowerBattle';
import { startGauntletBattle } from './startGauntletBattle'; // NEU

export function useBattleActions(state, showNotification) {
    // Wrapper functions to inject state and showNotification
    const startBattleFn = () => startBattle(state, showNotification);

    return {
        startBattle: startBattleFn,
        startGauntletBattle: () => startGauntletBattle(state, showNotification), // NEU
        startTowerBattle: (stageId) => startTowerBattle(state, showNotification, stageId),
        startFriendBattle: (friendTeam) => startFriendBattle(state, showNotification, friendTeam),
        handleWin: (reward, winningTeamIds, enemyRating, damageReport) =>
            handleWin(state, showNotification, startBattleFn, reward, winningTeamIds, enemyRating, damageReport),
        handleLose: (reward, teamIds, enemyRating) =>
            handleLose(state, showNotification, startBattleFn, reward, teamIds, enemyRating),
        handleAutoBattle: (tickets) =>
            handleAutoBattle(state, showNotification, startBattleFn, tickets),
        cancelAutoBattle: () => cancelAutoBattle(state, showNotification)
    };
}