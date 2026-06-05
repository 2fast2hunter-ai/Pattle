import { GEAR_ITEMS, GEAR_DROP_RARITIES } from '../../data/gearData';
import { RARITIES } from '../../data/rarities';

export function rollGearDrop(dropChance) {
    if (Math.random() > dropChance) return null;

    // Rarity roll using same cumulative approach as lootLogic
    const keys = Object.keys(GEAR_DROP_RARITIES);
    let rand = Math.random() * 100;
    let cumulative = 0;
    let rarity = 'COMMON';
    for (const k of keys) {
        cumulative += GEAR_DROP_RARITIES[k];
        if (rand < cumulative) { rarity = k; break; }
    }

    const gearKeys = Object.keys(GEAR_ITEMS);
    const key = gearKeys[Math.floor(Math.random() * gearKeys.length)];

    return {
        id: `gear_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
        key,
        rarity,
    };
}

export function getGearBonuses(gearInstance) {
    if (!gearInstance) return {};
    const template = GEAR_ITEMS[gearInstance.key];
    if (!template) return {};
    const rarityDef = RARITIES[gearInstance.rarity] || RARITIES.COMMON;
    const result = {};
    for (const [stat, base] of Object.entries(template.base)) {
        result[stat] = Math.round(base * rarityDef.multi);
    }
    return result;
}

// Returns a new pet object with gear stat bonuses applied. Pure — does not mutate.
export function applyGearToPet(pet, gearInventory) {
    if (!pet.gear || !Array.isArray(gearInventory) || gearInventory.length === 0) return pet;
    const delta = { atk: 0, ap: 0, def: 0, res: 0, speed: 0, maxHp: 0 };
    for (const slot of ['weapon', 'armor', 'accessory']) {
        const instanceId = pet.gear[slot];
        if (!instanceId) continue;
        const instance = gearInventory.find(g => g.id === instanceId);
        if (!instance) continue;
        const bonuses = getGearBonuses(instance);
        for (const [k, v] of Object.entries(bonuses)) delta[k] = (delta[k] || 0) + v;
    }
    const hpBonus = delta.maxHp;
    return {
        ...pet,
        atk:   (pet.atk   || 0) + delta.atk,
        ap:    (pet.ap    || 0) + delta.ap,
        def:   (pet.def   || 0) + delta.def,
        res:   (pet.res   || 0) + delta.res,
        speed: (pet.speed || 0) + delta.speed,
        maxHp: (pet.maxHp || 0) + hpBonus,
        hp:    (pet.hp    ?? pet.maxHp ?? 0) + hpBonus,
    };
}
