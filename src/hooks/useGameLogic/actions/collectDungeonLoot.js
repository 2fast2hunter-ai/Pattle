import { db } from '../../../firebase';
import { doc, increment, updateDoc } from 'firebase/firestore';

export const collectDungeonLoot = async (state, showNotification) => {
    const { activeBattle, user, setActiveBattle, setCurrentView, t } = state;
    if (!activeBattle?.isDungeon) return;

    const room = activeBattle.dungeonRooms[activeBattle.dungeonFloor - 1];
    if (room.type !== 'LOOT') return;

    const newAccumulated = {
        coins: activeBattle.accumulatedRewards.coins + room.reward.coins,
        xp: activeBattle.accumulatedRewards.xp + room.reward.xp,
        gems: (activeBattle.accumulatedRewards.gems || 0) + (room.reward.gems || 0),
    };

    const nextFloor = activeBattle.dungeonFloor + 1;
    const isRunComplete = nextFloor > activeBattle.dungeonRooms.length;

    showNotification(
        t ? t('dungeon_loot_collected', { coins: room.reward.coins }) : `Loot collected! +${room.reward.coins} Gold`,
        'success'
    );

    if (isRunComplete) {
        const userRef = doc(db, 'users', user.id);
        const dbUpdates = {
            coins: increment(Math.floor(newAccumulated.coins)),
            xp: increment(Math.floor(newAccumulated.xp)),
            'stats.dungeonRuns': increment(1),
            'stats.dungeonBestFloor': Math.max(user.stats?.dungeonBestFloor || 0, activeBattle.dungeonRooms.length),
        };
        if (newAccumulated.gems > 0) dbUpdates.gems = increment(newAccumulated.gems);
        await updateDoc(userRef, dbUpdates);

        setActiveBattle(null);
        showNotification(
            t ? t('dungeon_complete_notif', { coins: Math.floor(newAccumulated.coins), xp: Math.floor(newAccumulated.xp) })
              : `Dungeon Complete! +${Math.floor(newAccumulated.coins)} Gold, +${Math.floor(newAccumulated.xp)} XP`,
            'success'
        );
        setCurrentView('dungeon');
    } else {
        const updatedRun = {
            isDungeon: true,
            dungeonRooms: activeBattle.dungeonRooms,
            dungeonFloor: nextFloor,
            myTeam: activeBattle.myTeam,
            accumulatedRewards: newAccumulated,
        };
        setActiveBattle(updatedRun);
        setCurrentView('dungeon-run');
    }
};
