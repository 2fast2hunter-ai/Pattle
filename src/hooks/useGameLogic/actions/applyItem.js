import { updateUser, addPetXp } from '../../../utils/db';
import { CONSUMABLES, COSMETICS } from '../../../data/gameData';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const applyItem = async (state, showNotification, petId, itemId, quantity) => {
    const { user, myPets } = state;

    // Sicherstellen, dass quantity eine Zahl ist
    const qty = parseInt(quantity, 10);

    if (!qty || qty < 1) {
        showNotification(state.t ? state.t('notif_invalid_qty') : 'Invalid quantity.', "error");
        return;
    }

    try {
        // Lade Pet frisch aus DB für Konsistenz
        const petRef = doc(db, "pets", petId);
        const petSnap = await getDoc(petRef);
        const pet = petSnap.exists() ? { id: petId, ...petSnap.data() } : myPets.find(p => p.id === petId);

        const item = user.inventory.find(i => i.id === itemId);

        if (!pet || !item) {
            console.error("Pet oder Item nicht gefunden.", { petId, itemId });
            showNotification(state.t ? state.t('notif_pet_item_not_found') : 'Pet or item not found.', "error");
            return;
        }

        // Only look for the item configuration in CONSUMABLES.
        // If it's not there, it's not an item that can be "applied" in this way.
        const config = CONSUMABLES[item.variant];
        if (!config) {
            console.error("Keine Config für Item gefunden:", item.variant);
            // This error now correctly triggers if you try to use a cosmetic or unknown item.
            showNotification(state.t ? state.t('notif_item_cannot_apply') : 'Item cannot be applied to pet.', "error");
            return;
        }

        // Fix: Prüfe auch auf 'type' und 'value' sowie den Namen, falls 'effect' fehlt
        const effectType = config.effect || config.type || (item.variant.includes('XP') ? 'XP' : undefined);
        const effectAmount = config.amount || config.value || 0;

        if (effectType === 'XP') {
            const xpToAdd = effectAmount * qty;
            
            // Nutze die zentrale Funktion aus db.js
            await addPetXp(pet, xpToAdd);
            
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
            showNotification(state.t ? state.t('notif_item_applied', { qty, item: config.label, name: pet.name, xp: xpToAdd }) : `${qty}x ${config.label} applied to ${pet.name}! (+${xpToAdd} XP)`, "success");
        } else {
            console.warn("Unbekannter Effekt:", config.effect);
            showNotification(state.t ? state.t('notif_item_no_effect') : 'Item has no effect.', "info");
        }
    } catch (error) {
        console.error("Fehler bei der Anwendung des Items:", error);
        showNotification(state.t ? state.t('notif_error_generic') : 'An error occurred.', "error");
    }
};