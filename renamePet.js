import { updatePetInDB } from './src/utils/db';

export const renamePet = async (state, showNotification, petId, newName) => {
    if (!newName || newName.length > 12) {
        showNotification("Ungültiger Name! (Max 12 Zeichen)", "error");
        return;
    }
    await updatePetInDB(petId, { name: newName });
    showNotification("Name geändert!", "success");
};