export const cancelAutoBattle = (state, showNotification) => {
    const { setAutoBattleRemaining } = state;
    setAutoBattleRemaining(0);
    showNotification("Auto-Kampf Sequenz abgebrochen.", "info");
};