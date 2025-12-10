// src/utils/mechanics/petStats.js
import { RARITIES } from '../../data/rarities';
import { getSpeciesBaseStats, getClassScaling } from '../../data/petStatsData';
import { PET_RARITY_MULTIPLIERS } from '../../data/levelData';

// Hilfsfunktion: Rarity Key zu Index (0-9) konvertieren
const getRarityIndex = (rarityKey) => {
    const r = RARITIES[rarityKey];
    return r ? Math.max(0, Math.min(9, r.id - 1)) : 0;
};

// Formel: Value = Base + (Level - 1) * Growth
// Growth = (Base - 1) + ScalingFactor
const calculateStat = (baseValue, scalingFactor, level) => {
    const growth = (baseValue - 1) + scalingFactor;
    const val = baseValue + (level - 1) * growth;
    return Math.round(val * 10) / 10;
};

export const recalculatePetStats = (pet, newLevel) => {
    const cappedLevel = Math.min(100, Math.max(1, newLevel));
    const rarityIndex = getRarityIndex(pet.rarity);
    
    // Daten laden
    const speciesData = getSpeciesBaseStats(pet.species);
    const scalingData = getClassScaling(pet.type);

    // Basiswerte und Scaling für Rarity holen
    const b_hp = speciesData.hp[rarityIndex];
    const b_atk = speciesData.atk[rarityIndex];
    const b_def = speciesData.def[rarityIndex];
    const b_ap = speciesData.ap[rarityIndex];
    const b_res = speciesData.res[rarityIndex];
    const b_speed = speciesData.speed[rarityIndex];

    const s_hp = scalingData.hp[rarityIndex];
    const s_atk = scalingData.atk[rarityIndex];
    const s_def = scalingData.def[rarityIndex];
    const s_ap = scalingData.ap[rarityIndex];
    const s_res = scalingData.res[rarityIndex];
    const s_speed = scalingData.speed[rarityIndex];

    // Berechnung
    let newMaxHp = calculateStat(b_hp, s_hp, cappedLevel);
    let newAtk = calculateStat(b_atk, s_atk, cappedLevel);
    let newDef = calculateStat(b_def, s_def, cappedLevel);
    let newAp = calculateStat(b_ap, s_ap, cappedLevel);
    let newRes = calculateStat(b_res, s_res, cappedLevel);
    let newSpeed = calculateStat(b_speed, s_speed, cappedLevel);

    // Shiny Bonus (10% Bonus)
    if (pet.isShiny) {
        newMaxHp *= 1.1; 
        newAtk *= 1.1;
        newDef *= 1.1;
        newAp *= 1.1;
        newRes *= 1.1;
        newSpeed *= 1.1;
    }

    const nextMaxXp = calculatePetTotalXpForLevel(cappedLevel + 1, pet.rarity);

    return {
        ...pet,
        level: cappedLevel,
        maxXp: nextMaxXp,
        maxHp: Math.round(newMaxHp),
        hp: Math.round(newMaxHp),
        atk: Math.round(newAtk),
        def: Math.round(newDef),
        ap: Math.round(newAp),
        res: Math.round(newRes),
        speed: Math.round(newSpeed)
    };
};

export const calculatePetTotalXpForLevel = (level, rarityKey) => {
    const multiplier = PET_RARITY_MULTIPLIERS[rarityKey] || 1.0;
    return Math.floor(20 * Math.pow(level, 2) * multiplier);
};

export const calculatePetLevelFromXp = (currentXp, rarityKey) => {
    const multiplier = PET_RARITY_MULTIPLIERS[rarityKey] || 1.0;
    if (currentXp < 20 * multiplier) return 1;
    const level = Math.floor(Math.sqrt(currentXp / (20 * multiplier)));
    return Math.min(100, Math.max(1, level));
};

export const calculateMaxXp = (level, rarityKey) => {
    if (level >= 100) return Infinity;
    return calculatePetTotalXpForLevel(level + 1, rarityKey);
};