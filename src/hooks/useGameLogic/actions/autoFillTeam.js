import { updateUser } from '../../../utils/db';
import { getUnlockedTeamSlots } from '../../../utils/gameMechanics';

const RARITY_SCORE = { COMMON: 0, UNCOMMON: 1, RARE: 2, EPIC: 3, LEGENDARY: 4, MYTHIC: 5, DIVINE: 6, ANCIENT: 7, COSMIC: 8, TRANSCENDENT: 9 };

export const autoFillTeam = async (state, showNotification) => {
    const { user, myPets } = state;
    if (!user) return;

    const unlockedSlots = getUnlockedTeamSlots(user.level);
    const currentTeam = [...(user.team || [])];

    while (currentTeam.length < unlockedSlots) currentTeam.push(null);

    const teamSet = new Set(currentTeam.filter(Boolean));

    const available = (myPets || [])
        .filter(p => !p.isEgg && !teamSet.has(p.id))
        .sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            return (RARITY_SCORE[b.rarity] || 0) - (RARITY_SCORE[a.rarity] || 0);
        });

    let filled = 0;
    for (let i = 0; i < unlockedSlots; i++) {
        if (!currentTeam[i] && available.length > 0) {
            currentTeam[i] = available.shift().id;
            filled++;
        }
    }

    if (filled === 0) {
        showNotification(state.t ? state.t('notif_team_full') : 'Team is already full!', 'info');
        return;
    }

    await updateUser(user.id, { team: currentTeam });
    showNotification(
        state.t ? state.t('notif_team_autofilled', { count: filled }) : `${filled} slot${filled !== 1 ? 's' : ''} filled!`,
        'success'
    );
};
