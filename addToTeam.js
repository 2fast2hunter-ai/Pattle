import { updateUser } from './src/utils/db';

export const addToTeam = async (state, showNotification, petId) => {
    const { user } = state;
    if (!user) return;

    const currentTeam = user.team || [null, null, null, null, null];
    const firstEmptyIndex = currentTeam.indexOf(null);

    if (firstEmptyIndex === -1) {
        showNotification("Team ist voll!", "error");
        return;
    }

    if (currentTeam.includes(petId)) {
        showNotification("Pet ist bereits im Team!", "error");
        return;
    }

    const newTeam = [...currentTeam];
    newTeam[firstEmptyIndex] = petId;

    await updateUser(user.id, { team: newTeam });
    showNotification("Zum Team hinzugefügt!", "success");
};