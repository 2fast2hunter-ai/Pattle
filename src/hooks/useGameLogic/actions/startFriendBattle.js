import { setBattleActive, trackQuestProgress } from '../../../utils/db';

export const startFriendBattle = async (state, showNotification, friendTeam) => {
    const { user, myPets, setActiveBattle, setCurrentView } = state;
    if (!user) return;

    const myTeam = (user.team || []).map(id => myPets.find(p => p.id === id)).filter(Boolean);
    if (myTeam.length === 0) {
        showNotification(state.t ? state.t('notif_team_empty') : 'Your team is empty!', "error");
        return;
    }

    // Bereite Freundes-Team vor (HP voll)
    const enemyTeam = friendTeam.map(p => ({ ...p, currentHp: p.maxHp, currentCd: 0 }));

    const battleState = { myTeam, enemyTeam, myIndex: 0, enemyIndex: 0, turn: 'PLAYER', log: [state.t ? state.t('battle_log_friendly_start') : 'Friendly battle begins!'], isOver: false, round: 1, isFriendly: true };

    setActiveBattle(battleState);
    setCurrentView('battle');
    await setBattleActive(user.id, true);
    trackQuestProgress(user, 'CHALLENGE_FRIEND', 1, ['CHALLENGE_FRIEND']);
};