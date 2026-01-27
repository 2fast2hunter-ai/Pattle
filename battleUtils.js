import { ABILITIES, RARITIES } from './src/data/gameData';

export const ensureAbility = (pet) => {
    if (pet.abilityId && ABILITIES[pet.abilityId] && pet.abilityId !== 'tackle') {
        return pet.abilityId;
    }
    const matching = Object.keys(ABILITIES).filter(k => ABILITIES[k].element === pet.type);
    if (matching.length > 0) return matching[0];
    return 'tackle';
};

export const getWeightedRarity = () => {
    const roll = Math.random() * 100;
    let total = 0;
    for (const key of Object.keys(RARITIES)) {
        total += RARITIES[key].dropChance;
        if (roll <= total) return key;
    }
    return 'COMMON';
};