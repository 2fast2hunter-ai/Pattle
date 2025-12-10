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
    let level = 1; 
    for (let i = 0; i < PLAYER_XP_TABLE.length; i++) {
        if (currentXp >= PLAYER_XP_TABLE[i]) {
            level = i + 2; 
        } else {
            break;
        }
    }
    return Math.min(100, level);
};

export const getXpToNextPlayerLevel = (level) => {
    const index = level - 1;
    if (level >= 100 || index >= PLAYER_XP_TABLE.length) {
        return Infinity; 
    }
    return PLAYER_XP_TABLE[index]; 
};

// --- NEU: HELPER FÜR SPIELER-XP-BALKEN (RELATIV) ---
export const getPlayerLevelProgress = (totalXp, currentLevel) => {
    // Level 1: Start bei 0
    let startXp = 0;
    
    // Ab Level 2: Start ist der Schwellenwert des vorherigen Levels
    // Beispiel: Level 2 Start = PLAYER_XP_TABLE[0] (800)
    if (currentLevel > 1) {
        startXp = PLAYER_XP_TABLE[currentLevel - 2] || 0;
    }

    // Ziel für dieses Level (kumulativ)
    // Beispiel: Level 1 Ziel = PLAYER_XP_TABLE[0] (800)
    // Level 2 Ziel = PLAYER_XP_TABLE[1] (3200)
    let endXp = PLAYER_XP_TABLE[currentLevel - 1];
    
    if (!endXp) return { current: 100, max: 100, percent: 100 }; // Max Level Fallback

    const xpInThisLevel = Math.max(0, totalXp - startXp);
    const xpNeededForThisLevel = Math.max(1, endXp - startXp);

    return {
        current: xpInThisLevel,
        max: xpNeededForThisLevel,
        percent: Math.min(100, Math.max(0, (xpInThisLevel / xpNeededForThisLevel) * 100))
    };
};