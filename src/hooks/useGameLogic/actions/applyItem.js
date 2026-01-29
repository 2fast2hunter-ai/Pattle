import { updatePetInDB, updateUser } from '../../../utils/db';
import { CONSUMABLES, COSMETICS } from '../../../data/gameData';
import { calculateMaxXp, recalculatePetStats } from '../../../utils/gameMechanics';

export const applyItem = async (state, showNotification, petId, itemId, quantity) => {
    const { user, myPets } = state;

    // Sicherstellen, dass quantity eine Zahl ist
    const qty = parseInt(quantity, 10);

    if (!qty || qty < 1) {
        showNotification("Ungültige Menge.", "error");
        return;
    }

    try {
        const pet = myPets.find(p => p.id === petId);
        const item = user.inventory.find(i => i.id === itemId);

        if (!pet || !item) {
            console.error("Pet oder Item nicht gefunden.", { petId, itemId });
            showNotification("Pet oder Item nicht gefunden.", "error");
            return;
        }

        // Only look for the item configuration in CONSUMABLES.
        // If it's not there, it's not an item that can be "applied" in this way.
        const config = CONSUMABLES[item.variant];
        if (!config) {
            console.error("Keine Config für Item gefunden:", item.variant);
            // This error now correctly triggers if you try to use a cosmetic or unknown item.
            showNotification("Dieses Item kann nicht auf ein Pet angewendet werden.", "error");
            return;
        }

        // Fix: Prüfe auch auf 'type' und 'value' sowie den Namen, falls 'effect' fehlt
        const effectType = config.effect || config.type || (item.variant.includes('XP') ? 'XP' : undefined);
        const effectAmount = config.amount || config.value || 0;

        if (effectType === 'XP') {
            let xpToAdd = effectAmount * qty;
            let currentXp = Number(pet.xp) || 0;
            let newXp = currentXp + xpToAdd;
            let newLevel = Number(pet.level) || 1;
            const rarity = pet.rarity || 'COMMON';
            let maxXp = pet.maxXp || calculateMaxXp(newLevel, rarity);

            if (!maxXp || maxXp <= 0) maxXp = 100; // Sicherheits-Fallback

            while (newXp >= maxXp) {
                newXp -= maxXp;
                newLevel++;
                maxXp = calculateMaxXp(newLevel, rarity);
                if (!maxXp || maxXp <= 0) maxXp = 100 * newLevel; // Safety in loop
            }

            const newStats = recalculatePetStats(pet, newLevel);
            const petUpdate = {
                ...newStats,
                level: newLevel,
                xp: newXp,
                maxXp: maxXp
            };
            
            console.log("Applying XP Item:", { petId, oldLevel: pet.level, newLevel, newXp, maxXp });
            await updatePetInDB(petId, petUpdate);
            
            // Corrected Item removal logic for stacks
            let remainingToRemove = qty;
            const finalInventory = user.inventory.filter(invItem => {
                if (invItem.variant === item.variant && remainingToRemove > 0) {
                    remainingToRemove--;
                    return false;
                }
                return true;
            });

            await updateUser(user.id, { inventory: finalInventory });
            showNotification(`${qty}x ${config.label} auf ${pet.name} angewendet! (+${xpToAdd} XP)`, "success");
        } else {
            console.warn("Unbekannter Effekt:", config.effect);
            showNotification("Dieses Item hat keinen bekannten Effekt.", "info");
        }
    } catch (error) {
        console.error("Fehler bei der Anwendung des Items:", error);
        showNotification("Ein Fehler ist aufgetreten.", "error");
    }
};