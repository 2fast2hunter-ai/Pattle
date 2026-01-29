export const cancelAutoBattle = (state, showNotification) => {
    state.setAutoBattleRemaining(0);
    showNotification("Auto-Kampf wird nach diesem Kampf beendet.", "info");
};