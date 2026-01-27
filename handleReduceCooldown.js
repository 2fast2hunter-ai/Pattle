import { updatePetInDB } from './src/utils/db';

export const handleReduceCooldown = async (state, showNotification, petId, type) => {
    const { myPets } = state;
    const pet = myPets.find(p => p.id === petId);
    if (!pet) return;

    if (pet.incubating) {
        const newHatchTime = Date.now(); 
        await updatePetInDB(petId, { hatchTime: newHatchTime });
        showNotification("Brutzeit verkürzt!", "success");
    }
};