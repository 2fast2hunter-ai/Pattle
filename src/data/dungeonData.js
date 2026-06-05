export const DUNGEON_CONFIG = {
    dailyKeys: 3,
    totalFloors: 5,
};

const FLOOR_DEFS = [
    { floor: 1, enemyCount: 1, levelOffset: -1, rarity: 'COMMON',   lootChance: 0,    isBoss: false, rewardCoins: 40,  rewardXp: 20  },
    { floor: 2, enemyCount: 1, levelOffset: 1,  rarity: 'COMMON',   lootChance: 0.25, isBoss: false, rewardCoins: 65,  rewardXp: 35  },
    { floor: 3, enemyCount: 2, levelOffset: 3,  rarity: 'UNCOMMON', lootChance: 0.20, isBoss: false, rewardCoins: 100, rewardXp: 55  },
    { floor: 4, enemyCount: 2, levelOffset: 5,  rarity: 'RARE',     lootChance: 0.15, isBoss: false, rewardCoins: 150, rewardXp: 80  },
    { floor: 5, enemyCount: 1, levelOffset: 8,  rarity: 'EPIC',     lootChance: 0,    isBoss: true,  rewardCoins: 400, rewardXp: 200, rewardGems: 5 },
];

export function generateDungeonRooms(playerLevel) {
    return FLOOR_DEFS.map(def => {
        const isLoot = !def.isBoss && def.lootChance > 0 && Math.random() < def.lootChance;
        return {
            floor: def.floor,
            type: def.isBoss ? 'BOSS' : (isLoot ? 'LOOT' : 'BATTLE'),
            enemyCount: def.enemyCount,
            enemyLevel: Math.max(1, Math.min(100, playerLevel + def.levelOffset)),
            enemyRarity: def.rarity,
            isBoss: def.isBoss,
            reward: {
                coins: def.rewardCoins,
                xp: def.rewardXp,
                gems: def.rewardGems || 0,
            },
        };
    });
}

export function getDungeonKeysRemaining(user) {
    const today = new Date().toISOString().split('T')[0];
    const keysData = user?.dungeonKeys || {};
    if (keysData.date !== today) return DUNGEON_CONFIG.dailyKeys;
    return Math.max(0, DUNGEON_CONFIG.dailyKeys - (keysData.used || 0));
}
