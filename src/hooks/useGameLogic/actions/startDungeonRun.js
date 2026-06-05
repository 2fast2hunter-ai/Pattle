import { generateDungeonRooms, getDungeonKeysRemaining } from '../../../data/dungeonData';
import { updateUser } from '../../../utils/db';

export const startDungeonRun = async (state, showNotification) => {
    const { user, myPets, setActiveBattle, setCurrentView, t } = state;
    if (!user) return;

    const keysRemaining = getDungeonKeysRemaining(user);
    if (keysRemaining <= 0) {
        showNotification(t ? t('dungeon_no_keys_notif') : 'No dungeon keys left today!', 'error');
        return;
    }

    const myTeam = (user.team || []).map(id => myPets.find(p => p.id === id)).filter(Boolean);
    if (myTeam.length === 0) {
        showNotification(t ? t('notif_team_empty') : 'Your team is empty!', 'error');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const keysData = user.dungeonKeys || {};
    const currentUsed = keysData.date === today ? (keysData.used || 0) : 0;
    await updateUser(user.id, { dungeonKeys: { date: today, used: currentUsed + 1 } });

    const playerLevel = user.level || 1;
    const rooms = generateDungeonRooms(playerLevel);

    setActiveBattle({
        isDungeon: true,
        dungeonRooms: rooms,
        dungeonFloor: 1,
        myTeam: myTeam.map(p => ({ ...p, hp: p.maxHp, currentCd: 0 })),
        accumulatedRewards: { coins: 0, xp: 0, gems: 0 },
    });
    setCurrentView('dungeon-run');
};
