import { removePetFromDB, updateUser } from '../../../utils/db';

export const releasePet = async (state, showNotification, petId) => {
    const { user, myPets } = state;
    if (!user) return false;

    const pet = myPets.find(p => p.id === petId);
    if (!pet) return false;

    if (user.team.includes(petId)) {
        showNotification("Kann kein Team-Mitglied freilassen!", "error");
        return false;
    }

    await removePetFromDB(petId);
    // Optional: Belohnung für Freilassen?
    showNotification(`${pet.name} wurde freigelassen.`, "success");
    return true;
};