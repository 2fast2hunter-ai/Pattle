import { updateUser } from './src/utils/db';

export const handleAutoBattle = async (state, showNotification, startBattleFn, ticketsToUse = 1) => {
    const { user, myPets, setAutoBattleRemaining } = state;

    if (!user) return;
    if ((user.adTickets || 0) < ticketsToUse) { showNotification("Nicht genügend Tickets!", "error"); return; }
    const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));
    if (validTeamIds.length === 0) { showNotification("Team ist leer!", "error"); return; }
    await updateUser(user.id, { adTickets: user.adTickets - ticketsToUse });
    const totalBattles = ticketsToUse * 10;
    setAutoBattleRemaining(totalBattles);
    showNotification(`Starte ${totalBattles} Auto-Kämpfe...`, "success");
    startBattleFn();
};