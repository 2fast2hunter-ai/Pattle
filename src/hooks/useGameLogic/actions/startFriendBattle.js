import { setBattleActive } from '../../../utils/db';

export const startFriendBattle = async (state, showNotification, friendTeam) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    const myTeam = user.team.map(id => myPets.find(p => p.id === id)).filter(Boolean);
    if (myTeam.length === 0) {
        showNotification("Dein Team ist leer!", "error");
        return;
    }

    // Bereite Freundes-Team vor (HP voll)
    const enemyTeam = friendTeam.map(p => ({ ...p, currentHp: p.maxHp, currentCd: 0 }));

    const battleState = { myTeam, enemyTeam, myIndex: 0, enemyIndex: 0, turn: 'PLAYER', log: ["Freundschaftskampf beginnt!"], isOver: false, round: 1, isFriendly: true };
    
    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
};