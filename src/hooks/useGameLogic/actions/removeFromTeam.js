import { updateUser } from '../../../utils/db';

export const removeFromTeam = async (state, showNotification, index) => {
    const { user } = state;
    if (!user) return;

    const newTeam = [...user.team];
    newTeam[index] = null;
    await updateUser(user.id, { team: newTeam });
};