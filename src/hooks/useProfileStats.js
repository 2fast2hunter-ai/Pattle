import { useMemo } from 'react';
import { RARITIES, TYPES, ZODIAC_ANIMALS } from '../data/gameData';

export function useProfileStats(user, pets) {
    return useMemo(() => {
        const safePets = pets || [];

        // 1. Battle
        const totalBattles = user.stats?.pvpTotal || 0;
        const wins = user.stats?.pvpWins || 0;
        const losses = totalBattles - wins;
        const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

        // 2. Collection
        const rarityCounts = {};
        let maxLvl = 0;
        const uniqueSpecies = new Set();
        const uniqueTypes = new Set();

        safePets.forEach(p => {
            if (!p.isEgg) {
                const r = p.rarity;
                rarityCounts[r] = (rarityCounts[r] || 0) + 1;
                if (p.level > maxLvl) maxLvl = p.level;
                if (p.species) uniqueSpecies.add(p.species);
                if (p.type) uniqueTypes.add(p.type);
            }
        });

        const rarityStats = Object.values(RARITIES).map(r => ({
            label: r.label,
            count: rarityCounts[Object.keys(RARITIES).find(k => RARITIES[k].id === r.id)] || 0,
            color: r.color,
            bg: r.bg.replace('bg-', 'bg-')
        })).sort((a, b) => b.count - a.count);

        // 3. Breeding Analysis
        const bredPets = safePets.filter(p => p.source === 'BREEDING' && !p.isEgg);
        const bredRarityCounts = {};
        const bredTypeCounts = {};

        bredPets.forEach(p => {
            const r = p.rarity;
            bredRarityCounts[r] = (bredRarityCounts[r] || 0) + 1;
            bredTypeCounts[p.type] = (bredTypeCounts[p.type] || 0) + 1;
        });

        const bredRarityStats = Object.values(RARITIES).map(r => ({
            label: r.label,
            count: bredRarityCounts[Object.keys(RARITIES).find(k => RARITIES[k].id === r.id)] || 0,
            color: r.color,
            bg: r.bg.replace('bg-', 'bg-')
        })).sort((a, b) => b.count - a.count);

        const topTypes = Object.entries(bredTypeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type, count]) => ({ type, count }));

        // 4. Economy
        const earned = user.stats?.marketEarned || 0;
        const spent = user.stats?.marketSpent || 0;

        return {
            battle: { wins, losses, winRate, total: totalBattles, rating: user.rating },
            collection: {
                totalPets: safePets.length,
                highestLevel: maxLvl,
                rarityStats,
                speciesProgress: { count: uniqueSpecies.size, total: Object.keys(ZODIAC_ANIMALS).length, percent: Math.round((uniqueSpecies.size / Object.keys(ZODIAC_ANIMALS).length) * 100) },
                typeProgress: { count: uniqueTypes.size, total: Object.keys(TYPES).length, percent: Math.round((uniqueTypes.size / Object.keys(TYPES).length) * 100) }
            },
            economy: { coins: user.coins, gems: user.gems, marketEarned: earned, marketSpent: spent, marketBalance: earned - spent },
            breeding: {
                bred: user.stats?.bred || 0,
                hatched: user.stats?.hatched || 0,
                inventoryBredCount: bredPets.length,
                rarityStats: bredRarityStats,
                topTypes
            }
        };
    }, [user, pets]);
}
