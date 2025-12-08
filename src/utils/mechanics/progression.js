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
    if (level >= 100) return PLAYER_XP_TABLE[99]; 
    return PLAYER_XP_TABLE[level - 1];
};

export const calculatePlayerLevel = (currentXp) => {
    let level = 1; // Startet bei Level 1
    
    for (let i = 0; i < PLAYER_XP_TABLE.length; i++) {
        // Beispiel: 800 XP (Index 0). 
        // Wenn ich 800 XP habe, habe ich Level 1 abgeschlossen -> bin Level 2.
        if (currentXp >= PLAYER_XP_TABLE[i]) {
            level = i + 2; // Index 0 = Level 2, Index 1 = Level 3, etc.
        } else {
            break;
        }
    }
    // Cap bei Level 100
    return Math.min(100, level);
};

export const getXpToNextPlayerLevel = (level) => {
    // Wenn ich Level 1 bin, ist mein Ziel der Wert an Index 0 (800).
    // Wenn ich Level 2 bin, ist mein Ziel der Wert an Index 1 (3200).
    const index = level - 1;
    
    if (level >= 100 || index >= PLAYER_XP_TABLE.length) {
        return Infinity; // Max Level erreicht
    }
    
    return PLAYER_XP_TABLE[index]; 
};