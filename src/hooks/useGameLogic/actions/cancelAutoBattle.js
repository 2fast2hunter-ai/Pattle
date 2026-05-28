export const cancelAutoBattle = (state, showNotification) => {
    state.setAutoBattleRemaining(0);
    showNotification(state.t ? state.t('notif_autobattle_stopping') : 'Auto-battle stopping.', "info");
};