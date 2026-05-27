import { ACHIEVEMENTS, ACHIEVEMENT_TRIGGERS } from '../data/achievements';
import { checkAchievements } from './checkAchievements';

// Reactive check for state_change achievements (called from useGameLogic on user/pets change).
// Event-driven achievements (battle_win, egg_hatch, etc.) are handled in checkAchievements.js.
export const checkNewAchievements = (user, pets) => {
    if (!user) return [];
    const unlocked = user.achievements || {};
    const stateAchievements = Object.values(ACHIEVEMENTS).filter(
        a => a.trigger === ACHIEVEMENT_TRIGGERS.STATE_CHANGE && !unlocked[a.id]
    );

    const firstPass = stateAchievements.filter(a => {
        try { return a.check(user, {}, pets); } catch { return false; }
    });

    return firstPass;
};

export const unlockAchievementsInDB = checkAchievements;
