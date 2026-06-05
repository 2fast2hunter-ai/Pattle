import { setBattleActive } from '../../../utils/db';
import { db } from '../../../firebase';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { distributeXP } from './distributeXP';

export const handleDungeonWin = async (state, showNotification, activeBattle, winningTeamIds) => {
    const { user, setActiveBattle, setCurrentView, t } = state;

    const room = activeBattle.dungeonRooms[activeBattle.dungeonFloor - 1];
    const roomReward = room.reward;

    const newAccumulated = {
        coins: activeBattle.accumulatedRewards.coins + roomReward.coins,
        xp: activeBattle.accumulatedRewards.xp + roomReward.xp,
        gems: (activeBattle.accumulatedRewards.gems || 0) + (roomReward.gems || 0),
    };

    // Surviving team HP carries over (myTeam has been mutated in-place by setBattleState)
    const updatedTeam = activeBattle.myTeam;

    const nextFloor = activeBattle.dungeonFloor + 1;
    const isRunComplete = nextFloor > activeBattle.dungeonRooms.length;
    const userRef = doc(db, 'users', user.id);

    await setBattleActive(user.id, false);

    if (isRunComplete) {
        const totalCoins = newAccumulated.coins;
        const totalXp = newAccumulated.xp;
        const totalGems = newAccumulated.gems;

        if (totalXp > 0 && winningTeamIds.length > 0) {
            await distributeXP(winningTeamIds, totalXp, () => {}, user).catch(e => console.error('[DungeonWin] XP dist error', e));
        }

        const userUpdates = {
            coins: increment(Math.floor(totalCoins)),
            xp: increment(Math.floor(totalXp)),
            isInBattle: false,
            'stats.dungeonRuns': increment(1),
            'stats.dungeonBestFloor': Math.max(user.stats?.dungeonBestFloor || 0, activeBattle.dungeonRooms.length),
        };
        if (totalGems > 0) userUpdates.gems = increment(totalGems);
        await updateDoc(userRef, userUpdates);

        setActiveBattle(null);
        showNotification(
            t ? t('dungeon_complete_notif', { coins: Math.floor(totalCoins), xp: Math.floor(totalXp) })
              : `Dungeon Complete! +${Math.floor(totalCoins)} Gold, +${Math.floor(totalXp)} XP${totalGems ? `, +${totalGems} Gems` : ''}`,
            'success'
        );
        setCurrentView('dungeon');
    } else {
        const currentBest = user.stats?.dungeonBestFloor || 0;
        const floorJustCleared = activeBattle.dungeonFloor;
        const dbUpdates = { isInBattle: false };
        if (floorJustCleared > currentBest) {
            dbUpdates['stats.dungeonBestFloor'] = floorJustCleared;
        }
        await updateDoc(userRef, dbUpdates);

        const updatedRun = {
            isDungeon: true,
            dungeonRooms: activeBattle.dungeonRooms,
            dungeonFloor: nextFloor,
            myTeam: updatedTeam,
            accumulatedRewards: newAccumulated,
        };

        setActiveBattle(updatedRun);
        showNotification(
            t ? t('dungeon_floor_cleared', { floor: floorJustCleared }) : `Floor ${floorJustCleared} cleared!`,
            'success'
        );
        setCurrentView('dungeon-run');
    }
};
