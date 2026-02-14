import { generatePet } from '../../../utils/gameMechanics';
import { setBattleActive } from '../../../utils/db';
import { TYPES } from '../../../data/gameData';

export const startGauntletBattle = async (state, showNotification) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    // 1. Team Validate
    const myTeam = user.team.map(id => myPets.find(p => p.id === id)).filter(Boolean);
    if (myTeam.length === 0) {
        showNotification("Dein Team ist leer!", "error");
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
        log: [`Gauntlet Runde 1 beginnt!`],
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

    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};
