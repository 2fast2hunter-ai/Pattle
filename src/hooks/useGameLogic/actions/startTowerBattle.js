import { TOWER_STAGES, TYPES } from '../../../data/gameData';
import { generatePet } from '../../../utils/gameMechanics';
import { setBattleActive, markSpeciesSeen } from '../../../utils/db';
import { trackBattleStarted } from '../../../utils/analytics';

export const startTowerBattle = async (state, showNotification, stageId) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    const stageConfig = TOWER_STAGES.find(s => s.id === stageId);
    if (!stageConfig) return;

    // Team Validierung
    const myTeam = (user.team || []).map(id => {
        const pet = myPets.find(p => p.id === id);
        if (!pet) return null;
        // WICHTIG: Pet klonen und Kampf-Werte initialisieren (hp = maxHp)
        return { ...pet, hp: pet.maxHp, currentCd: 0 };
    }).filter(Boolean);

    if (myTeam.length === 0) {
        showNotification(state.t ? state.t('notif_team_empty') : 'Your team is empty!', "error");
        return;
    }

    // Gegner Generieren
    const enemyTeam = [];
    const typeKeys = Object.keys(TYPES);
    
    for (let i = 0; i < stageConfig.enemyCount; i++) {
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        // Level entspricht der Stufe
        const enemy = generatePet(stageConfig.enemyLevel, randomType, stageConfig.enemyRarity, null, 'TOWER_ENEMY');
        enemy.hp = enemy.maxHp; // hp statt currentHp für Konsistenz mit BattleScreen
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
        log: [state.t ? state.t('battle_log_tower_start', { stage: stageId }) : `Tower Stage ${stageId} begins!`],
        isOver: false, 
        round: 1, 
        isTower: true, 
        towerStage: stageId,
        isFriendly: false 
    };
    
    const seenIds = [...new Set(enemyTeam.map(p => p.species).filter(Boolean))];
    markSpeciesSeen(user.id, seenIds);

    trackBattleStarted('tower');
    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};