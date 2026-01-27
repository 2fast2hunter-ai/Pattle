import { removePetFromDB, updateUser } from './src/utils/db';

export const releasePet = async (state, showNotification, petId) => {
    const { user, myPets } = state;
    if (!user) return;
    
    const pet = myPets.find(p => p.id === petId);
    if (!pet) return;

    if (user.team.includes(petId)) {
        showNotification("Kann kein Team-Mitglied freilassen!", "error");
        return;
    }

    await removePetFromDB(petId);
    
    const refund = 50;
    await updateUser(user.id, { coins: (user.coins || 0) + refund });
    showNotification(`${pet.name} freigelassen! (+${refund} Münzen)`, "success");
};