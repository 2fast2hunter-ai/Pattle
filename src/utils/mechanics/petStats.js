import { RARITIES } from '../../data/rarities';

// --- STATS & XP FORMELN ---

// Formel für einen einzelnen Stat: Basis * (1 + 10% pro Level)
export const calculateStatValue = (base, level) => {
    const val = Math.round(base * (1 + (level - 1) * 0.1));
    return Math.max(1, val); 
};

// Formel für Max XP
export const calculateMaxXp = (level) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Fixe Stats pro Level (basierend auf Seltenheit)
export const getLevelUpStats = (rarityKey) => {
    let min = 1;
    let max = 2;
    // Fallback falls rarityKey undefined ist
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

// Zentrale Funktion zum Neuberechnen
export const recalculatePetStats = (pet, newLevel) => {
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

    // Neue Stats berechnen
    let newMaxHp = calculateStatValue(b_hp, newLevel);
    let newAtk = calculateStatValue(b_atk, newLevel);
    let newDef = calculateStatValue(b_def, newLevel);
    let newAp = calculateStatValue(b_ap, newLevel);
    let newRes = calculateStatValue(b_res, newLevel);
    let newSpeed = calculateStatValue(b_speed, newLevel);

    // Shiny Bonus
    if (pet.isShiny) {
        newMaxHp += 10; newAtk += 1; newDef += 1; newAp += 1; newRes += 1; newSpeed += 1;
    }

    return {
        level: newLevel,
        maxXp: calculateMaxXp(newLevel),
        maxHp: newMaxHp, hp: newMaxHp,
        atk: newAtk, def: newDef, ap: newAp, res: newRes, speed: newSpeed,
        b_hp, b_atk, b_def, b_ap, b_res, b_speed
    };
};