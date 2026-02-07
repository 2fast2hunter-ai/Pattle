import { updatePetInDB, updateUser } from '../../../utils/db';

export const renamePet = async (state, showNotification, petId, newName) => {
    const { user } = state;
    const cost = 100;
    if (user.coins < cost) {
        showNotification("Nicht genug Gold!", "error");
        return false;
    }

    // VALIDIERUNG
    const trimmedName = newName.trim();
    if (trimmedName.length < 3) {
        showNotification("Name zu kurz (min. 3 Zeichen)!", "error");
        return false;
    }
    if (trimmedName.length > 12) {
        showNotification("Name zu lang (max. 12 Zeichen)!", "error");
        return false;
    }
    // Einfacher Schimpfwort-Filter (Beispiel) oder Sonderzeichen-Check
    if (/[^a-zA-Z0-9 äöüÄÖÜß]/.test(trimmedName)) {
        showNotification("Nur Buchstaben und Zahlen erlaubt!", "error");
        return false;
    }

    await updatePetInDB(petId, { name: trimmedName });
    await updateUser(user.id, { coins: user.coins - cost });
    showNotification("Name geändert!", "success");
    return true;
};