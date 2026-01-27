import { generatePet } from './src/utils/gameMechanics';
import { setBattleActive } from './src/utils/db';
import { ensureAbility, getWeightedRarity } from './battleUtils';

export const startBattle = async (state, showNotification) => {
    const { user, myPets, setActiveBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    if (!user) return;

    const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
    if (validTeamIds.length === 0) {
        showNotification("Dein Team ist leer!", 'error');
        if (autoBattleRemaining > 0) setAutoBattleRemaining(0);
        return;
    }

    await setBattleActive(user.id, true);

    const myBattleTeam = validTeamIds.map(id => {
        const p = myPets.find(pet => pet.id === id);
        return {
            ...p,
            abilityId: ensureAbility(p),
            currentCd: 0,
            hp: p.maxHp
        };
    });

    const enemyBattleTeam = [];
    const teamSize = myBattleTeam.length;

    for (let i = 0; i < teamSize; i++) {
        const myPet = myBattleTeam[i];
        const baseLevel = myPet.level || 1;
        const levelVariance = Math.floor(Math.random() * 3) - 1;
        const enemyLevel = Math.max(1, baseLevel + levelVariance);
        const enemyRarity = getWeightedRarity();

        const enemyPet = generatePet(
            enemyLevel,
            null,
            enemyRarity,
            null,
            'ENEMY'
        );

        enemyPet.id = `enemy_${i}_${Date.now()}`;
        enemyPet.currentCd = 0;
        enemyPet.name = `Wildes ${enemyPet.name}`;
        enemyPet.abilityId = ensureAbility(enemyPet);

        enemyBattleTeam.push(enemyPet);
    }

    const p1 = myBattleTeam[0];
    const e1 = enemyBattleTeam[0];
    const playerFirst = p1.speed >= e1.speed;

    setActiveBattle({
        myTeam: myBattleTeam,
        enemyTeam: enemyBattleTeam,
        myIndex: 0,
        enemyIndex: 0,
        log: [`Kampf gestartet! (Auto: ${autoBattleRemaining > 0 ? autoBattleRemaining : 'Aus'})`],
        turn: playerFirst ? 'PLAYER' : 'ENEMY',
        isOver: false,
        round: 1,
        isFriendly: false
    });

    setCurrentView('battle');
};