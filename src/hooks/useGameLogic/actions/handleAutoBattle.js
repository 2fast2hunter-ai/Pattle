import { updateUser } from '../../../utils/db';

export const handleAutoBattle = async (state, showNotification, startBattleFn, ticketsToUse) => {
    const { user, setAutoBattleRemaining } = state;
    if (!user) return;

    if (user.adTickets < ticketsToUse) {
        showNotification(state.t ? state.t('notif_no_tickets') : 'Not enough tickets!', "error");
        return;
    }

    await updateUser(user.id, { adTickets: user.adTickets - ticketsToUse });
    setAutoBattleRemaining(ticketsToUse * 10);
    showNotification(state.t ? state.t('notif_autobattle_started', { rounds: ticketsToUse * 10 }) : `Auto-battle started (${ticketsToUse * 10} rounds)`, "success");
    startBattleFn();
};