import { PET_RARITY_MULTIPLIERS } from '../../data/levelData';

// --- STATS & XP FORMELN ---

export const calculateStatValue = (base, level) => {
    // Sicherheitshalber auch hier cappen, falls 'level' roh übergeben wird
    const effectiveLevel = Math.min(100, level);
    const val = Math.round(base * (1 + (effectiveLevel - 1) * 0.1));
    return Math.max(1, val); 
};

// Formel: 20 * Level^2 * RarityMultiplier
export const calculatePetTotalXpForLevel = (level, rarityKey) => {
    const multiplier = PET_RARITY_MULTIPLIERS[rarityKey] || 1.0;
    return Math.floor(20 * Math.pow(level, 2) * multiplier);
};

// Berechnet das Level basierend auf XP (Umkehrfunktion)
export const calculatePetLevelFromXp = (currentXp, rarityKey) => {
    const multiplier = PET_RARITY_MULTIPLIERS[rarityKey] || 1.0;
    
    if (currentXp < 20 * multiplier) return 1;
    
    const rawLevel = Math.sqrt(currentXp / (20 * multiplier));
    const level = Math.floor(rawLevel);
    
    // WICHTIG: Cap bei 100
    return Math.min(100, Math.max(1, level));
};

export const calculateMaxXp = (level, rarityKey = 'COMMON') => {
    // Wenn Level 100 erreicht ist, gibt es kein nächstes Ziel mehr -> Infinity
    if (level >= 100) return Infinity;
    return calculatePetTotalXpForLevel(level + 1, rarityKey);
};

export const getLevelUpStats = (rarityKey) => {
    let min = 1;
    let max = 2;
    const rarityKeySafe = rarityKey || 'COMMON';

    switch (rarityKeySafe) {
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
        default:             min = 1; max = 2;
    }

    const roll = () => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
        hp: roll() * 5, 
        atk: roll(), def: roll(), ap: roll(), res: roll(), speed: roll()
    };
};

export const recalculatePetStats = (pet, newLevel) => {
    // Cap das neue Level auf 100
    const cappedLevel = Math.min(100, newLevel);

    const currentLvlMult = 1 + (pet.level - 1) * 0.1;
    
    const getBase = (currentVal, bonusIfShiny) => {
        const rawVal = currentVal - (pet.isShiny ? bonusIfShiny : 0);
        return Math.max(1, Math.round(rawVal / currentLvlMult));
    };

    const b_hp = pet.b_hp || getBase(pet.maxHp, 10);
    const b_atk = pet.b_atk || getBase(pet.atk, 1);
    const b_def = pet.b_def || getBase(pet.def, 1);
    const b_ap = pet.b_ap || getBase(pet.ap, 1);
    const b_res = pet.b_res || getBase(pet.res, 1);
    const b_speed = pet.b_speed || getBase(pet.speed, 1);

    // Neue Stats berechnen (mit cappedLevel)
    let newMaxHp = calculateStatValue(b_hp, cappedLevel);
    let newAtk = calculateStatValue(b_atk, cappedLevel);
    let newDef = calculateStatValue(b_def, cappedLevel);
    let newAp = calculateStatValue(b_ap, cappedLevel);
    let newRes = calculateStatValue(b_res, cappedLevel);
    let newSpeed = calculateStatValue(b_speed, cappedLevel);

    if (pet.isShiny) {
        newMaxHp += 10; newAtk += 1; newDef += 1; newAp += 1; newRes += 1; newSpeed += 1;
    }

    const nextMaxXp = calculateMaxXp(cappedLevel, pet.rarity);

    return {
        level: cappedLevel,
        maxXp: nextMaxXp,
        maxHp: newMaxHp, hp: newMaxHp,
        atk: newAtk, def: newDef, ap: newAp, res: newRes, speed: newSpeed,
        b_hp, b_atk, b_def, b_ap, b_res, b_speed
    };
};