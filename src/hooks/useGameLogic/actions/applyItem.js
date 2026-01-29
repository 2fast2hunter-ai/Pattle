import { updatePetInDB, updateUser } from '../../../utils/db';
import { CONSUMABLES } from '../../../data/gameData';
import { calculateMaxXp, recalculatePetStats } from '../../../utils/gameMechanics';

export const applyItem = async (state, showNotification, petId, itemId, quantity) => {
    const { user, myPets } = state;
    const pet = myPets.find(p => p.id === petId);
    const item = user.inventory.find(i => i.id === itemId);

    if (!pet || !item) return;

    const config = CONSUMABLES[item.variant];
    if (!config) return;

    if (config.effect === 'XP') {
        let xpToAdd = config.amount * quantity;
        let newXp = (pet.xp || 0) + xpToAdd;
        let newLevel = pet.level;
        let maxXp = pet.maxXp || calculateMaxXp(newLevel, pet.rarity);

        while (newXp >= maxXp) {
            newXp -= maxXp;
            newLevel++;
            maxXp = calculateMaxXp(newLevel, pet.rarity);
        }

        const newStats = recalculatePetStats(pet, newLevel);
        await updatePetInDB(petId, { ...newStats, xp: newXp });
        
        // Item entfernen
        const newInventory = user.inventory.filter(i => i.id !== itemId);
        await updateUser(user.id, { inventory: newInventory });
        showNotification(`${quantity}x ${config.label} angewendet!`, "success");
    }
};