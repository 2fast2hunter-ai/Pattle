import { updateUser } from '../../../utils/db';

export const handleAutoBattle = async (state, showNotification, startBattleFn, ticketsToUse) => {
    const { user, setAutoBattleRemaining } = state;
    if (!user) return;

    if (user.adTickets < ticketsToUse) {
        showNotification("Nicht genügend Tickets!", "error");
        return;
    }

    await updateUser(user.id, { adTickets: user.adTickets - ticketsToUse });
    setAutoBattleRemaining(ticketsToUse * 10);
    showNotification(`Auto-Kampf gestartet (${ticketsToUse * 10} Runden)`, "success");
    startBattleFn();
};