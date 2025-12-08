import { PET_RARITY_MULTIPLIERS } from '../../data/levelData';
import { RARITIES } from '../../data/rarities'; // Import für Multiplikatoren

// --- STATS & XP FORMELN ---

// Formel für einen einzelnen Stat: Basis + (Level-1) * Wachstum
// Wachstum hängt stark von der Seltenheit ab!
export const calculateStatValue = (base, level, growth) => {
    const effectiveLevel = Math.min(100, level);
    // Basis + (Level Ups * Wachstum)
    const val = Math.round(base + (effectiveLevel - 1) * growth);
    return Math.max(1, val); 
};

// Formel: 20 * Level^2 * RarityMultiplier
export const calculatePetTotalXpForLevel = (level, rarityKey) => {
    const multiplier = PET_RARITY_MULTIPLIERS[rarityKey] || 1.0;
    return Math.floor(20 * Math.pow(level, 2) * multiplier);
};

export const calculatePetLevelFromXp = (currentXp, rarityKey) => {
    const multiplier = PET_RARITY_MULTIPLIERS[rarityKey] || 1.0;
    if (currentXp < 20 * multiplier) return 1;
    const rawLevel = Math.sqrt(currentXp / (20 * multiplier));
    const level = Math.floor(rawLevel);
    return Math.min(100, Math.max(1, level));
};

export const calculateMaxXp = (level, rarityKey = 'COMMON') => {
    if (level >= 100) return Infinity;
    return calculatePetTotalXpForLevel(level + 1, rarityKey);
};

// Durchschnittliches Wachstum pro Level basierend auf Seltenheit
// Orientiert sich an den Ranges aus getLevelUpStats (z.B. Common 1-2 -> 1.5)
export const getAverageGrowth = (rarityKey) => {
    let avg = 1.5;
    const safeKey = rarityKey || 'COMMON';

    switch (safeKey) {
        case 'COMMON':       avg = 1.5; break;  // 1-2
        case 'UNCOMMON':     avg = 2.5; break;  // 2-3
        case 'RARE':         avg = 3.5; break;  // 3-4
        case 'EPIC':         avg = 4.5; break;  // 4-5
        case 'LEGENDARY':    avg = 5.5; break;  // 5-6
        case 'MYTHIC':       avg = 6.5; break;  // 6-7
        case 'DIVINE':       avg = 7.5; break;  // 7-8
        case 'ANCIENT':      avg = 8.5; break;  // 8-9
        case 'COSMIC':       avg = 9.5; break;  // 9-10
        case 'TRANSCENDENT': avg = 10.5; break; // 10-11
        default:             avg = 1.5;
    }
    
    // HP wächst 5x schneller als andere Stats
    return {
        hp: avg * 5,
        atk: avg, def: avg, ap: avg, res: avg, speed: avg
    };
};

export const getLevelUpStats = (rarityKey) => {
    // Zufälliges Wachstum für echtes Level-Up (bleibt für Variation)
    let min = 1, max = 2;
    const safeKey = rarityKey || 'COMMON';

    switch (safeKey) {
        case 'COMMON':       min = 1; max = 2; break;
        case 'UNCOMMON':     min = 2; max = 3; break;
        case 'RARE':         min = 3; max = 4; break;
        case 'EPIC':         min = 4; max = 5; break;
        case 'LEGENDARY':    min = 5; max = 6; break;
        case 'MYTHIC':       min = 6; max = 7; break;
        case 'DIVINE':       min = 7; max = 8; break;
        case 'ANCIENT':      min = 8; max = 9; break;
        case 'COSMIC':       min = 9; max = 10; break;
        case 'TRANSCENDENT': min = 10; max = 11; break;
    }

    const roll = () => Math.floor(Math.random() * (max - min + 1)) + min;
    return { hp: roll() * 5, atk: roll(), def: roll(), ap: roll(), res: roll(), speed: roll() };
};

// Generiert Standard-Basiswerte für ein Pet, falls keine existieren
const generateBaseStats = (rarityKey) => {
    const rarity = RARITIES[rarityKey] || RARITIES.COMMON;
    const multi = rarity.multi || 1.0;
    
    // Basiswerte für Level 1
    const base = (val) => Math.floor(val * multi);
    
    return {
        b_hp: base(8),
        b_atk: base(2),
        b_ap: base(2),
        b_def: base(1),
        b_res: base(1),
        b_speed: base(1)
    };
};

export const recalculatePetStats = (pet, newLevel) => {
    const cappedLevel = Math.min(100, newLevel);
    
    // 1. Basiswerte sicherstellen
    let bases = {
        b_hp: pet.b_hp, b_atk: pet.b_atk, b_def: pet.b_def,
        b_ap: pet.b_ap, b_res: pet.b_res, b_speed: pet.b_speed
    };

    // Wenn Basiswerte fehlen (alte Pets), generieren wir neue faire Werte
    if (!bases.b_hp) {
        bases = generateBaseStats(pet.rarity);
    }

    // 2. Wachstum berechnen
    const growth = getAverageGrowth(pet.rarity);

    // 3. Neue Stats berechnen
    let newMaxHp = calculateStatValue(bases.b_hp, cappedLevel, growth.hp);
    let newAtk = calculateStatValue(bases.b_atk, cappedLevel, growth.atk);
    let newDef = calculateStatValue(bases.b_def, cappedLevel, growth.def);
    let newAp = calculateStatValue(bases.b_ap, cappedLevel, growth.ap);
    let newRes = calculateStatValue(bases.b_res, cappedLevel, growth.res);
    let newSpeed = calculateStatValue(bases.b_speed, cappedLevel, growth.speed);

    // Shiny Bonus (flat)
    if (pet.isShiny) {
        newMaxHp += 10; newAtk += 1; newDef += 1; newAp += 1; newRes += 1; newSpeed += 1;
    }

    const nextMaxXp = calculateMaxXp(cappedLevel, pet.rarity);

    return {
        ...bases, // Speichere die (vielleicht neu generierten) Basiswerte
        level: cappedLevel,
        maxXp: nextMaxXp,
        maxHp: newMaxHp, 
        hp: newMaxHp, // Voll heilen bei Neuberechnung
        atk: newAtk, def: newDef, ap: newAp, res: newRes, speed: newSpeed,
    };
};