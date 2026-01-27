import { setBattleActive } from './src/utils/db';
import { ensureAbility } from './battleUtils';

export const startFriendBattle = async (state, showNotification, friendTeamPets) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;

    if (!user) return;
    await setBattleActive(user.id, true);
    const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
    if (validTeamIds.length === 0) { showNotification("Dein Team ist leer!", 'error'); return; }

    const myBattleTeam = validTeamIds.map(id => {
        const p = myPets.find(pet => pet.id === id);
        return { ...p, abilityId: ensureAbility(p), currentCd: 0, hp: p.maxHp };
    });

    const enemyBattleTeam = friendTeamPets.map((p, i) => ({
        ...p,
        id: `friend_pet_${i}_${Date.now()}`,
        abilityId: ensureAbility(p),
        currentCd: 0,
        hp: p.maxHp
    }));

    if (enemyBattleTeam.length === 0) { showNotification("Dieser Freund hat kein Team aufgestellt!", "error"); return; }

    const p1 = myBattleTeam[0];
    const e1 = enemyBattleTeam[0];
    const playerFirst = p1.speed >= e1.speed;

    setActiveBattle({
        myTeam: myBattleTeam,
        enemyTeam: enemyBattleTeam,
        myIndex: 0,
        enemyIndex: 0,
        log: [`Freundschaftskampf gestartet!`],
        turn: playerFirst ? 'PLAYER' : 'ENEMY',
        isOver: false,
        round: 1,
        isFriendly: true
    });
    setCurrentView('battle');
};