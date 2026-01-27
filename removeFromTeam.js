import { updateUser } from './src/utils/db';

export const removeFromTeam = async (state, showNotification, index) => {
    const { user } = state;
    if (!user) return;

    const newTeam = [...(user.team || [null, null, null, null, null])];
    newTeam[index] = null;

    await updateUser(user.id, { team: newTeam });
    showNotification("Aus dem Team entfernt!", "info");
};