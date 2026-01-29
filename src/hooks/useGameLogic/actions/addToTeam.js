import { updateUser } from '../../../utils/db';
import { getUnlockedTeamSlots } from '../../../utils/gameMechanics';

export const addToTeam = async (state, showNotification, petId) => {
    const { user, selectedSlotForTeam, setCurrentView } = state;
    if (!user || selectedSlotForTeam === null) return;

    const unlockedSlots = getUnlockedTeamSlots(user.level);
    if (selectedSlotForTeam >= unlockedSlots) {
        showNotification("Slot noch gesperrt!", "error");
        return;
    }

    const newTeam = [...(user.team || [])];
    newTeam[selectedSlotForTeam] = petId;
    await updateUser(user.id, { team: newTeam });
    setCurrentView('team-edit');
};