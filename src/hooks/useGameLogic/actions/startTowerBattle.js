import { TOWER_STAGES, TYPES } from '../../../data/gameData';
import { generatePet } from '../../../utils/gameMechanics';
import { setBattleActive } from '../../../utils/db';

export const startTowerBattle = async (state, showNotification, stageId) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    const stageConfig = TOWER_STAGES.find(s => s.id === stageId);
    if (!stageConfig) return;

    // Team Validierung
    const myTeam = user.team.map(id => myPets.find(p => p.id === id)).filter(Boolean);
    if (myTeam.length === 0) {
        showNotification("Dein Team ist leer!", "error");
        return;
    }

    // Gegner Generieren
    const enemyTeam = [];
    const typeKeys = Object.keys(TYPES);
    
    for (let i = 0; i < stageConfig.enemyCount; i++) {
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        // Level entspricht der Stufe
        const enemy = generatePet(stageConfig.enemyLevel, randomType, stageConfig.enemyRarity, null, 'TOWER_ENEMY');
        enemy.currentHp = enemy.maxHp;
        enemy.currentCd = 0;
        enemyTeam.push(enemy);
    }

    // Kampf starten
    const battleState = { 
        myTeam, 
        enemyTeam, 
        myIndex: 0, 
        enemyIndex: 0, 
        turn: 'PLAYER', 
        log: [`Turm Stufe ${stageId} beginnt!`], 
        isOver: false, 
        round: 1, 
        isTower: true, 
        towerStage: stageId,
        isFriendly: false 
    };
    
    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};