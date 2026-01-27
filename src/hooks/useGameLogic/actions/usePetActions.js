import { releasePet } from '../../../../releasePet';
import { handleReduceCooldown } from '../../../../handleReduceCooldown';
import { addToTeam } from '../../../../addToTeam';
import { removeFromTeam } from '../../../../removeFromTeam';
import { breedPets } from '../../../../breedPets';
import { renamePet } from '../../../../renamePet';
import { applyItem } from '../../../../applyItem';
import { updatePetInDB, trackQuestProgress, updateUser } from '../../../utils/db';
import { RARITIES } from '../../../data/gameData';
import { getUnlockedHatcherySlots } from '../../../utils/mechanics/progression';

export function usePetActions(state, showNotification) {
    const startIncubation = async (petId) => {
        const { user, myPets } = state;
        if (!user) return;

        const pet = myPets.find(p => p.id === petId);
        if (!pet) {
            showNotification("Ei nicht gefunden!", "error");
            return;
        }

        const unlockedSlots = getUnlockedHatcherySlots(user.level);
        const incubatingCount = myPets.filter(p => p.isEgg && p.hatchAt > 0).length;
        
        if (incubatingCount >= unlockedSlots) {
            showNotification(`Brutstätte voll! (${incubatingCount}/${unlockedSlots})`, "error");
            return;
        }

        const rarityConfig = RARITIES[pet.rarity] || RARITIES.COMMON;
        const duration = rarityConfig.hatchDuration || 60000;
        const hatchAt = Date.now() + duration;

        await updatePetInDB(pet.id, { hatchAt });
        showNotification("Inkubation gestartet!", "success");
    };

    const hatchEgg = async (petId, customName) => {
        const { user, myPets } = state;
        if (!user) return;

        const pet = myPets.find(p => p.id === petId);
        if (!pet) {
            showNotification("Ei nicht gefunden!", "error");
            return;
        }

        try {
            const updates = {
                isEgg: false,
                hatchAt: 0,
                name: customName || pet.name
            };
            
            await updatePetInDB(pet.id, updates);
            
            // Update User Stats (Hatched Count)
            const currentHatched = user.stats?.hatched || 0;
            await updateUser(user.id, { "stats.hatched": currentHatched + 1 });

            // Quest Progress
            const subTypes = [`HATCH_${pet.rarity}`, `HATCH_${pet.type}`];
            await trackQuestProgress(user, 'HATCH_EGG', 1, subTypes);

            showNotification(`${updates.name} ist geschlüpft!`, "success");
        } catch (error) {
            console.error("Hatch Error:", error);
            showNotification("Fehler beim Schlüpfen.", "error");
        }
    };

    return { 
        handleReduceCooldown: (petId, type) => handleReduceCooldown(state, showNotification, petId, type),
        addToTeam: (petId) => addToTeam(state, showNotification, petId),
        removeFromTeam: (index) => removeFromTeam(state, showNotification, index),
        hatchEgg,
        startIncubation,
        breedPets: (p1, p2) => breedPets(state, showNotification, p1, p2),
        renamePet: (petId, newName) => renamePet(state, showNotification, petId, newName),
        applyXpItem: (petId, itemId, quantity) => applyItem(state, showNotification, petId, itemId, quantity), 
        releasePet: (petId) => releasePet(state, showNotification, petId),
        applyItem: (petId, itemId, quantity) => applyItem(state, showNotification, petId, itemId, quantity)
    };
}