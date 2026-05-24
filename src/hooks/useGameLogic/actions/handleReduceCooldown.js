import { updatePetInDB, updateUser } from '../../../utils/db';

export const handleReduceCooldownByAd = async (state, showNotification, petId) => {
    const { myPets } = state;
    const pet = myPets.find(p => p.id === petId);
    if (!pet || !pet.hatchAt) return;

    const timeLeft = Math.max(0, pet.hatchAt - Date.now());
    if (timeLeft <= 0) return;

    const reduction = Math.ceil(timeLeft * 0.5);
    const newHatchAt = Math.max(Date.now() + 1000, pet.hatchAt - reduction);

    await updatePetInDB(petId, { hatchAt: newHatchAt });
    showNotification('Brutzeit um 50% verkürzt! 🎉', 'success');
};

export const handleReduceCooldown = async (state, showNotification, petId, type) => {
    const { user, myPets } = state;
    const ticketIndex = user.inventory.findIndex(i => i.type === 'TICKET');
    if (ticketIndex === -1) {
        showNotification("Keine Tickets!", "error");
        return;
    }

    const pet = myPets.find(p => p.id === petId);
    if (!pet) return;

    let updates = {};
    if (type === 'HATCHING') {
        updates.hatchAt = Math.max(Date.now(), pet.hatchAt - (5 * 60 * 1000)); // -5 Min
    } else if (type === 'BREEDING') {
        updates.breedingCooldown = Math.max(Date.now(), pet.breedingCooldown - (30 * 60 * 1000)); // -30 Min
    }

    const newInventory = [...user.inventory];
    newInventory.splice(ticketIndex, 1);

    await updatePetInDB(petId, updates);
    await updateUser(user.id, { inventory: newInventory });
    showNotification("Zeit verkürzt!", "success");
};