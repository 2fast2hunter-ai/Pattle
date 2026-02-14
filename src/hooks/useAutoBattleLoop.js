import { useState, useEffect } from 'react';

export function useAutoBattleLoop(battleState, isAutoBattle, autoBattleRemaining, onWin, onLose, damageDealt) {
    const { isOver, myTeam, enemyTeam, isGauntlet } = battleState;
    const [autoProgress, setAutoProgress] = useState(0);

    // Auto Battle Logic
    useEffect(() => {
        if (isOver && isAutoBattle && autoBattleRemaining > 1) {
            const won = enemyTeam[enemyTeam.length - 1].hp === 0;
            const myTeamIds = myTeam.map(p => p.id);
            const rewardCoins = won ? 50 : 5;
            const rewardXp = won ? 50 : 5;
            const duration = 3000;
            const step = 50;
            let elapsed = 0;
            const interval = setInterval(() => {
                elapsed += step;
                const pct = Math.min(100, (elapsed / duration) * 100);
                setAutoProgress(pct);
                if (elapsed >= duration) {
                    clearInterval(interval);
                    if (won) onWin({ coins: rewardCoins, xp: rewardXp }, myTeamIds, null, damageDealt);
                    else onLose({ xp: rewardXp }, myTeamIds);
                }
            }, step);
            return () => clearInterval(interval);
        } else { setAutoProgress(0); }
    }, [isOver, isAutoBattle, autoBattleRemaining, myTeam, enemyTeam, onWin, onLose, damageDealt]);

    // GAUNTLET AUTO NEXT
    useEffect(() => {
        if (isOver && isGauntlet) {
            const won = enemyTeam[enemyTeam.length - 1].hp === 0;
            if (won) {
                // Kurze Verzögerung für Todes-Animation, dann weiter
                const timer = setTimeout(() => {
                    const myTeamIds = myTeam.map(p => p.id);
                    // Dummy Rewards, werden in handleWin für Gauntlet eh ignoriert/akkumuliert
                    onWin({ coins: 0, xp: 0 }, myTeamIds, null, damageDealt);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [isOver, isGauntlet, enemyTeam, myTeam, onWin, damageDealt]);

    return { autoProgress };
}
