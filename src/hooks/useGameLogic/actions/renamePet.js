import { updatePetInDB, updateUser } from '../../../utils/db';

export const renamePet = async (state, showNotification, petId, newName) => {
    const { user } = state;
    const cost = 100;
    if (user.coins < cost) {
        showNotification("Nicht genug Gold!", "error");
        return false;
    }

    await updatePetInDB(petId, { name: newName });
    await updateUser(user.id, { coins: user.coins - cost });
    showNotification("Name geändert!", "success");
    return true;
};