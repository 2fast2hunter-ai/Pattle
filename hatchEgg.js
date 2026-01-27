import { updatePetInDB, trackQuestProgress } from './src/utils/db';
import { generatePet } from './src/utils/gameMechanics';

export const hatchEgg = async (state, showNotification, petId, customName) => {
    const { user, myPets } = state;
    const pet = myPets.find(p => p.id === petId);
    if (!pet || !pet.incubating) return;

    if (Date.now() < pet.hatchTime) {
        showNotification("Noch nicht bereit!", "error");
        return;
    }

    const newPet = generatePet(1, pet.type, pet.rarity);
    
    await updatePetInDB(petId, {
        ...newPet,
        name: customName || newPet.name,
        incubating: false,
        hatchTime: null
    });

    trackQuestProgress(user, 'HATCH_EGG', 1);
    showNotification(`${newPet.name} ist geschlüpft!`, "success");
};