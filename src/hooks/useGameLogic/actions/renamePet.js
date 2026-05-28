import { updatePetInDB, updateUser } from '../../../utils/db';

export const renamePet = async (state, showNotification, petId, newName) => {
    const { user } = state;
    const cost = 100;
    if (user.coins < cost) {
        showNotification(state.t ? state.t('notif_not_enough_gold') : 'Not enough gold!', "error");
        return false;
    }

    // VALIDIERUNG
    const trimmedName = newName.trim();
    if (trimmedName.length < 3) {
        showNotification(state.t ? state.t('notif_name_too_short') : 'Name too short!', "error");
        return false;
    }
    if (trimmedName.length > 12) {
        showNotification(state.t ? state.t('notif_name_too_long') : 'Name too long!', "error");
        return false;
    }
    // Einfacher Schimpfwort-Filter (Beispiel) oder Sonderzeichen-Check
    if (/[^a-zA-Z0-9 äöüÄÖÜß]/.test(trimmedName)) {
        showNotification(state.t ? state.t('notif_name_invalid_chars') : 'Only letters and numbers!', "error");
        return false;
    }

    await updatePetInDB(petId, { name: trimmedName });
    await updateUser(user.id, { coins: user.coins - cost });
    showNotification(state.t ? state.t('notif_name_changed') : 'Name changed!', "success");
    return true;
};