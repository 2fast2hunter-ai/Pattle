import { releasePet } from '../../../../releasePet';
import { handleReduceCooldown } from '../../../../handleReduceCooldown';
import { addToTeam } from '../../../../addToTeam';
import { removeFromTeam } from '../../../../removeFromTeam';
import { hatchEgg } from '../../../../hatchEgg';
import { startIncubation } from '../../../../startIncubation';
import { breedPets } from '../../../../breedPets';
import { renamePet } from '../../../../renamePet';
import { applyItem } from '../../../../applyItem';

export function usePetActions(state, showNotification) {
    return { 
        handleReduceCooldown: (petId, type) => handleReduceCooldown(state, showNotification, petId, type),
        addToTeam: (petId) => addToTeam(state, showNotification, petId),
        removeFromTeam: (index) => removeFromTeam(state, showNotification, index),
        hatchEgg: (petId, customName) => hatchEgg(state, showNotification, petId, customName),
        startIncubation: (id, type) => startIncubation(state, showNotification, id, type),
        breedPets: (p1, p2) => breedPets(state, showNotification, p1, p2),
        renamePet: (petId, newName) => renamePet(state, showNotification, petId, newName),
        applyXpItem: (petId, itemId, quantity) => applyItem(state, showNotification, petId, itemId, quantity), 
        releasePet: (petId) => releasePet(state, showNotification, petId),
        applyItem: (petId, itemId, quantity) => applyItem(state, showNotification, petId, itemId, quantity)
    };
}