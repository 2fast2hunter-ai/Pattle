import { generatePet } from '../../../utils/gameMechanics';
import { setBattleActive, markSpeciesSeen } from '../../../utils/db';
import { TYPES } from '../../../data/gameData';
import { trackBattleStarted } from '../../../utils/analytics';

export const startDungeonRoomBattle = async (state, showNotification) => {
    const { activeBattle, setActiveBattle, setCurrentView, user, t } = state;
    if (!activeBattle?.isDungeon) return;

    const { dungeonRooms, dungeonFloor, myTeam } = activeBattle;
    const room = dungeonRooms[dungeonFloor - 1];
    if (!room || room.type === 'LOOT') return;

    const livingPets = myTeam.filter(p => (p.hp || 0) > 0);
    if (livingPets.length === 0) {
        showNotification(t ? t('dungeon_all_ko') : 'All pets are KO!', 'error');
        return;
    }

    const typeKeys = Object.keys(TYPES);
    const enemyTeam = [];
    for (let i = 0; i < room.enemyCount; i++) {
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        const enemy = generatePet(room.enemyLevel, randomType, room.enemyRarity, null, 'DUNGEON');
        enemy.hp = enemy.maxHp;
        enemy.currentCd = 0;
        enemyTeam.push(enemy);
    }

    const firstAliveIndex = myTeam.findIndex(p => (p.hp || 0) > 0);

    const battleState = {
        ...activeBattle,
        enemyTeam,
        myIndex: firstAliveIndex,
        enemyIndex: 0,
        turn: 'PLAYER',
        log: [
            room.isBoss
                ? (t ? t('dungeon_log_boss_start', { floor: dungeonFloor }) : `Floor ${dungeonFloor} — Boss appears!`)
                : (t ? t('dungeon_log_battle_start', { floor: dungeonFloor }) : `Floor ${dungeonFloor} battle begins!`)
        ],
        isOver: false,
        round: 1,
        isFriendly: false,
    };

    const seenIds = [...new Set(enemyTeam.map(p => p.species).filter(Boolean))];
    markSpeciesSeen(user.id, seenIds);

    trackBattleStarted('dungeon');
    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};
