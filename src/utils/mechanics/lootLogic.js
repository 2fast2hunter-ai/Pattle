import { RARITIES, LOOTBOXES } from '../../data/gameData';

export const determineRarity = (boxType = 'DAILY') => {
    // Fallback für Starter/Legacy - JETZT COMMON
    if (boxType === 'STARTER') return 'COMMON'; 
    if (boxType === 'STANDARD') boxType = 'DAILY'; 

    const boxData = LOOTBOXES[boxType];
    if (!boxData || !boxData.drops) return 'COMMON';

    const drops = boxData.drops;
    let totalWeight = 0;
    const weightedPool = [];

    for (const [rarityKey, chance] of Object.entries(drops)) {
        if (RARITIES[rarityKey]) {
            totalWeight += chance;
            weightedPool.push({ id: RARITIES[rarityKey].id, key: rarityKey, weight: chance });
        }
    }

    weightedPool.sort((a, b) => a.id - b.id);

    let randomValue = Math.random() * totalWeight;

    for (const item of weightedPool) {
        randomValue -= item.weight;
        if (randomValue <= 0) {
             return item.key;
        }
    }
    return weightedPool[weightedPool.length - 1].key;
};