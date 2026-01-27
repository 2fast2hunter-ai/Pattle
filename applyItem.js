import { updateUser, updatePetInDB } from './src/utils/db';
import { recalculatePetStats, calculateMaxXp } from './src/utils/gameMechanics';

export const applyItem = async (state, showNotification, petId, itemId, quantity = 1) => {
    const qty = parseInt(quantity) || 1;
    const { user, myPets } = state;
    const pet = myPets.find(p => p.id === petId);
    if (!pet || !user) return;

    const inventory = user.inventory || [];
    
    // 1. Das Ziel-Item identifizieren (um die Variante zu bekommen)
    const targetItemIndex = inventory.findIndex(i => i.id === itemId || (i.variant === itemId));
    
    if (targetItemIndex === -1) {
        showNotification("Item nicht gefunden!", "error");
        return;
    }

    const targetItem = inventory[targetItemIndex];
    const targetVariant = targetItem.variant;

    // 2. Alle passenden Items im Inventar finden (basierend auf Variante)
    // Wir sammeln die Indizes aller Items, die wir entfernen wollen
    let indicesToRemove = [];
    for (let i = 0; i < inventory.length; i++) {
        if (indicesToRemove.length >= qty) break;
        if (inventory[i].variant === targetVariant) {
            indicesToRemove.push(i);
        }
    }

    if (indicesToRemove.length < qty) {
        showNotification(`Nicht genügend Items! (${indicesToRemove.length}/${qty})`, "error");
        return;
    }

    // 3. Items entfernen (Rückwärts sortieren, damit splice die Indizes nicht verschiebt)
    const newInventory = [...inventory];
    indicesToRemove.sort((a, b) => b - a).forEach(index => {
        newInventory.splice(index, 1);
    });
    
    await updateUser(user.id, { inventory: newInventory });

    // Apply XP Logic (Generic implementation)
    const isXpItem = (targetVariant && targetVariant.includes('XP')) || (typeof itemId === 'string' && itemId.includes('XP'));
    if (isXpItem) {
        let baseXp = 50;
        const checkString = targetVariant || (typeof itemId === 'string' ? itemId : '');
        
        if (checkString.includes('MEDIUM')) baseXp = 100;
        else if (checkString.includes('LARGE')) baseXp = 500;

        const xpAmount = baseXp * qty; // XP basierend auf Menge berechnen
        
        let pXp = (pet.xp || 0) + xpAmount;
        let pLevel = pet.level || 1;
        let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel, pet.rarity);
        
        while (pXp >= currentMaxXp) {
            pLevel++;
            currentMaxXp = calculateMaxXp(pLevel, pet.rarity);
        }
        
        const newStats = recalculatePetStats({ ...pet, level: pLevel }, pLevel);
        await updatePetInDB(petId, { ...newStats, xp: pXp, hp: newStats.maxHp });
        showNotification(`XP Item angewendet! (+${xpAmount} XP)`, "success");
    } else {
        // Other items
        showNotification(`${qty}x Item angewendet!`, "success");
    }
};