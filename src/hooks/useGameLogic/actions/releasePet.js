import { removePetFromDB } from '../../../utils/db';

export const releasePet = async (state, showNotification, petId) => {
    const { user, myPets } = state;
    if (!user) return false;

    const pet = myPets.find(p => p.id === petId);
    if (!pet) return false;

    if ((user.team || []).includes(petId)) {
        showNotification(state.t ? state.t('notif_cant_release_team') : 'Cannot release a team member!', "error");
        return false;
    }

    await removePetFromDB(petId);
    // Optional: Belohnung für Freilassen?
    showNotification(state.t ? state.t('notif_pet_released', { name: pet.name }) : `${pet.name} was released.`, "success");
    return true;
};