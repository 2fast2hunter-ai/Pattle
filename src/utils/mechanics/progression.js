import { PLAYER_XP_TABLE } from '../../data/levelData';

export const getUnlockedHatcherySlots = (level) => {
  if (level < 15) return 1;
  return Math.min(10, 2 + Math.floor((level - 15) / 10));
};

export const getUnlockedTeamSlots = (level) => {
    const maxSlots = 10;
    let slots = 1;
    if (level >= 3) { slots = 2; slots += Math.floor((level - 3) / 5); }
    return Math.min(maxSlots, slots);
};

// --- NEUE LEVEL LOGIK (PLAYER) ---

export const getPlayerMaxXpForLevel = (level) => {
    if (level <= 0) return 0;
    // Wenn Level >= 100, geben wir den Max-Wert zurück
    if (level >= 100) return PLAYER_XP_TABLE[99]; 
    return PLAYER_XP_TABLE[level - 1];
};

export const calculatePlayerLevel = (currentXp) => {
    let level = 0;
    for (let i = 0; i < PLAYER_XP_TABLE.length; i++) {
        if (currentXp >= PLAYER_XP_TABLE[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    // WICHTIG: Cap bei Level 100
    return Math.min(100, Math.max(1, level));
};

export const getXpToNextPlayerLevel = (level) => {
    if (level >= 100) return Infinity; // Zeigt an, dass Max-Level erreicht ist
    return PLAYER_XP_TABLE[level]; 
};