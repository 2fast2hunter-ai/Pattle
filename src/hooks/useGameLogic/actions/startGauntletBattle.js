import { generatePet } from '../../../utils/gameMechanics';
import { setBattleActive, markSpeciesSeen } from '../../../utils/db';
import { TYPES } from '../../../data/gameData';
import { trackBattleStarted } from '../../../utils/analytics';

export const startGauntletBattle = async (state, showNotification) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    // 1. Team Validate
    const myTeam = (user.team || []).map(id => myPets.find(p => p.id === id)).filter(Boolean);
    if (myTeam.length === 0) {
        showNotification(state.t ? state.t('notif_team_empty') : 'Your team is empty!', "error");
        return;
    }

    // 2. Initial Enemy Generation (Round 1)
    // Level 1, 1 Enemy
    const typeKeys = Object.keys(TYPES);
    const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    const enemy = generatePet(1, randomType, 'COMMON', null, 'GAUNTLET');
    enemy.currentHp = enemy.maxHp;
    enemy.currentCd = 0;
    const enemyTeam = [enemy];

    // 3. Battle State with Gauntlet Flags
    const battleState = {
        myTeam: myTeam.map(p => ({ ...p, currentHp: p.hp, currentCd: 0 })), // Fresh start
        enemyTeam,
        myIndex: 0,
        enemyIndex: 0,
        turn: 'PLAYER',
        log: [state.t ? state.t('battle_log_gauntlet_start') : 'Gauntlet Round 1 begins!'],
        isOver: false,
        round: 1,
        isGauntlet: true,
        gauntletRound: 1,
        accumulatedRewards: { xp: 0, coins: 0 },
        gauntletScore: 0,
        isFriendly: false,
        gauntletTeamSnapshot: myTeam.map(p => ({ ...p })), // Complete snapshot of initial team for summary
        gauntletTeamIds: myTeam.map(p => p.id)
    };

    const seenIds = [...new Set(enemyTeam.map(p => p.species).filter(Boolean))];
    markSpeciesSeen(user.id, seenIds);

    trackBattleStarted('gauntlet');
    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};
