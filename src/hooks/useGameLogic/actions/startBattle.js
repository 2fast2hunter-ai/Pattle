import { generatePet } from '../../../utils/gameMechanics';
import { setBattleActive, markSpeciesSeen } from '../../../utils/db';
import { TYPES } from '../../../data/gameData';
import { trackBattleStarted } from '../../../utils/analytics';
import { applyGearToPet } from '../../../utils/mechanics/gearUtils';

const rollEnemyRarity = (playerLevel) => {
    const roll = Math.random() * 100;
    if (playerLevel <= 10) {
        return 'COMMON';
    } else if (playerLevel <= 25) {
        // ~70% COMMON, ~25% UNCOMMON, ~5% RARE
        if (roll < 70) return 'COMMON';
        if (roll < 95) return 'UNCOMMON';
        return 'RARE';
    } else if (playerLevel <= 40) {
        // ~40% COMMON, ~40% UNCOMMON, ~15% RARE, ~5% EPIC
        if (roll < 40) return 'COMMON';
        if (roll < 80) return 'UNCOMMON';
        if (roll < 95) return 'RARE';
        return 'EPIC';
    } else {
        // ~10% COMMON, ~40% UNCOMMON, ~35% RARE, ~15% EPIC
        if (roll < 10) return 'COMMON';
        if (roll < 50) return 'UNCOMMON';
        if (roll < 85) return 'RARE';
        return 'EPIC';
    }
};

export const startBattle = async (state, showNotification, overridePets = null) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    const sourcePets = Array.isArray(overridePets) ? overridePets : myPets;
    const gearInventory = user.gearInventory || [];
    const myTeam = (user.team || [])
        .map(id => sourcePets.find(p => p.id === id))
        .filter(Boolean)
        .map(p => applyGearToPet(p, gearInventory));
    if (myTeam.length === 0) {
        showNotification(state.t ? state.t('notif_team_empty') : 'Your team is empty!', "error");
        return;
    }

    // Generiere Gegner basierend auf User-Rating
    const enemyTeam = [];
    const enemyCount = Math.min(5, Math.max(1, Math.floor(user.level / 5) + 1));
    const typeKeys = Object.keys(TYPES);

    for (let i = 0; i < enemyCount; i++) {
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];

        // Anfänger-Schutz: Bis Level 5 sind Gegner immer Level 1
        const enemyLevel = user.level <= 5 ? 1 : Math.max(1, user.level + Math.floor(Math.random() * 3) - 1);

        const enemy = generatePet(enemyLevel, randomType, rollEnemyRarity(user.level), null, 'ENEMY');
        enemy.currentHp = enemy.maxHp;
        enemy.currentCd = 0;
        enemyTeam.push(enemy);
    }

    const battleState = { myTeam, enemyTeam, myIndex: 0, enemyIndex: 0, turn: 'PLAYER', log: [state.t ? state.t('battle_log_start') : 'Battle begins!'], isOver: false, round: 1, isFriendly: false };

    const seenIds = [...new Set(enemyTeam.map(p => p.species).filter(Boolean))];
    markSpeciesSeen(user.id, seenIds);

    trackBattleStarted('pvp');
    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};