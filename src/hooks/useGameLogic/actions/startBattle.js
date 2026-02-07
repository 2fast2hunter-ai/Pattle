import { generatePet } from '../../../utils/gameMechanics';
import { setBattleActive } from '../../../utils/db';
import { TYPES } from '../../../data/gameData';

export const startBattle = async (state, showNotification) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    const myTeam = user.team.map(id => myPets.find(p => p.id === id)).filter(Boolean);
    if (myTeam.length === 0) {
        showNotification("Dein Team ist leer!", "error");
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
        
        const enemy = generatePet(enemyLevel, randomType, 'COMMON', null, 'ENEMY');
        enemy.currentHp = enemy.maxHp;
        enemy.currentCd = 0;
        enemyTeam.push(enemy);
    }

    const battleState = { myTeam, enemyTeam, myIndex: 0, enemyIndex: 0, turn: 'PLAYER', log: ["Kampf beginnt!"], isOver: false, round: 1, isFriendly: false };
    
    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};