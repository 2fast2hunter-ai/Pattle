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
    } else if (playerLevel <= 50) {
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

    // Use highest team pet level as a floor so enemy difficulty keeps pace with pet progression
    const maxTeamPetLevel = myTeam.reduce((max, p) => Math.max(max, p.level || 1), user.level);
    const effectiveLevel = Math.max(user.level, maxTeamPetLevel);

    for (let i = 0; i < enemyCount; i++) {
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];

        // Anfänger-Schutz: Bis Level 5 sind Gegner immer Level 1
        // Enemies are 2–0 levels below effectiveLevel (avg −1) so players win ~80–90% of fights
        const enemyLevel = effectiveLevel <= 5 ? 1 : Math.max(1, effectiveLevel + Math.floor(Math.random() * 3) - 2);

        const enemy = generatePet(enemyLevel, randomType, rollEnemyRarity(effectiveLevel), null, 'ENEMY');
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