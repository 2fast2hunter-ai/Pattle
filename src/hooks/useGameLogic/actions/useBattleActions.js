// src/hooks/useGameLogic/actions/useBattleActions.js

import { startBattle } from './startBattle';
import { startFriendBattle } from './startFriendBattle';
import { handleWin } from './handleWin';
import { handleLose } from './handleLose';
import { handleAutoBattle } from './handleAutoBattle';
import { cancelAutoBattle } from './cancelAutoBattle';
import { startTowerBattle } from './startTowerBattle';
import { startGauntletBattle } from './startGauntletBattle';
import { startDungeonRun } from './startDungeonRun';
import { startDungeonRoomBattle } from './startDungeonRoomBattle';
import { collectDungeonLoot } from './collectDungeonLoot';

export function useBattleActions(state, showNotification) {
    const startBattleFn = (overridePets) => startBattle(state, showNotification, overridePets);

    return {
        startBattle: startBattleFn,
        startGauntletBattle: () => startGauntletBattle(state, showNotification),
        startTowerBattle: (stageId) => startTowerBattle(state, showNotification, stageId),
        startFriendBattle: (friendTeam) => startFriendBattle(state, showNotification, friendTeam),
        startDungeonRun: () => startDungeonRun(state, showNotification),
        startDungeonRoomBattle: () => startDungeonRoomBattle(state, showNotification),
        collectDungeonLoot: () => collectDungeonLoot(state, showNotification),
        handleWin: (reward, winningTeamIds, enemyRating, damageReport) =>
            handleWin(state, showNotification, startBattleFn, reward, winningTeamIds, enemyRating, damageReport),
        handleLose: (reward, teamIds, enemyRating) =>
            handleLose(state, showNotification, startBattleFn, reward, teamIds, enemyRating),
        handleAutoBattle: (tickets) =>
            handleAutoBattle(state, showNotification, startBattleFn, tickets),
        cancelAutoBattle: () => cancelAutoBattle(state, showNotification)
    };
}