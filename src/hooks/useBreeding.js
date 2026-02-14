import { useState } from 'react';
import { RARITIES, TYPES } from '../data/gameData';

export function useBreeding(pets, user, onBreed) {
    const [selected, setSelected] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTypeFilter, setActiveTypeFilter] = useState('ALL');
    const [activeRarityFilter, setActiveRarityFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('RARITY');
    const [breedingResult, setBreedingResult] = useState(null);
    const [isBreeding, setIsBreeding] = useState(false);

    // Helpers
    const getCooldownStatus = (pet) => {
        if (!pet || !pet.breedingCooldown) return null;
        const timeLeft = pet.breedingCooldown - Date.now();
        if (timeLeft <= 0) return null;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    const getLevelReq = (pet) => RARITIES[pet.rarity]?.minBreedLevel || 0;

    const toggleSelect = (id) => {
        const pet = pets.find(p => p.id === id);
        if (getCooldownStatus(pet) || pet.level < getLevelReq(pet)) return;

        // NEU: Check Rarity Match
        if (selected.length === 1) {
            const first = pets.find(p => p.id === selected[0]);
            if (first && first.rarity !== pet.rarity && !selected.includes(id)) {
                return; // Blockiere Auswahl unterschiedlicher Seltenheit
            }
        }

        if (selected.includes(id)) {
            setSelected(selected.filter(pid => pid !== id));
        } else {
            if (selected.length < 2) setSelected([...selected, id]);
            else {
                // Ersetze das zweite Pet wenn schon 2 gewählt sind
                const first = pets.find(p => p.id === selected[0]);
                if (first && first.rarity !== pet.rarity) return; // Sicherheitscheck
                setSelected([selected[0], id]);
            }
        }
    };

    let filteredPets = pets.filter(p => !p.isEgg);

    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        filteredPets = filteredPets.filter(p => p.name.toLowerCase().includes(lower) || RARITIES[p.rarity].label.toLowerCase().includes(lower));
    }
    if (activeTypeFilter !== 'ALL') filteredPets = filteredPets.filter(p => p.type === activeTypeFilter);
    if (activeRarityFilter !== 'ALL') filteredPets = filteredPets.filter(p => p.rarity === activeRarityFilter);

    filteredPets.sort((a, b) => {
        const cdA = getCooldownStatus(a) !== null;
        const cdB = getCooldownStatus(b) !== null;

        // 1. Primär: Verfügbarkeit (Cooldown nach unten)
        if (cdA && !cdB) return 1;
        if (!cdA && cdB) return -1;

        // 2. Sekundär: Gewählte Sortierung
        switch (sortBy) {
            case 'ATK': return b.atk - a.atk;
            case 'HP': return b.hp - a.hp;
            case 'LEVEL': return b.level - a.level;
            case 'RARITY': default:
                const rA = RARITIES[a.rarity]?.id || 0;
                const rB = RARITIES[b.rarity]?.id || 0;
                return rB === rA ? b.level - a.level : rB - rA;
        }
    });

    const resetFilters = () => { setSearchTerm(''); setActiveTypeFilter('ALL'); setActiveRarityFilter('ALL'); setSortBy('RARITY'); };
    const activeFilterCount = (activeTypeFilter !== 'ALL' ? 1 : 0) + (activeRarityFilter !== 'ALL' ? 1 : 0) + (searchTerm ? 1 : 0);

    const p1 = selected.length > 0 ? pets.find(p => p.id === selected[0]) : null;
    const p2 = selected.length > 1 ? pets.find(p => p.id === selected[1]) : null;
    const canBreed = p1 && p2;

    let rarityProbabilities = [];
    if (canBreed) {
        const r1 = RARITIES[p1.rarity];
        const r2 = RARITIES[p2.rarity];

        if (r1 && r2) {
            const sortedKeys = Object.keys(RARITIES).sort((a, b) => RARITIES[a].id - RARITIES[b].id);
            const idx = sortedKeys.indexOf(p1.rarity);
            const nextRarityKey = (idx !== -1 && idx < sortedKeys.length - 1) ? sortedKeys[idx + 1] : null;

            if (nextRarityKey) {
                const upgradeChance = Math.max(1, 10 - idx);
                rarityProbabilities = [
                    { key: nextRarityKey, chance: upgradeChance },
                    { key: p1.rarity, chance: 100 - upgradeChance }
                ];
            } else {
                rarityProbabilities = [{ key: p1.rarity, chance: 100 }];
            }
            rarityProbabilities = rarityProbabilities.filter(p => p.chance > 0).sort((a, b) => RARITIES[b.key].id - RARITIES[a.key].id);
        }
    }

    const handleBreedClick = async () => {
        if (!canBreed || isBreeding) return;
        setIsBreeding(true);
        try {
            const result = await onBreed(p1.id, p2.id);
            if (result) {
                setBreedingResult({ egg: result, parent1: p1, parent2: p2 });
                setSelected([]);
            }
        } catch (e) {
            console.error("Breeding error:", e);
        } finally {
            setIsBreeding(false);
        }
    };

    return {
        selected, setSelected,
        isSidebarOpen, setSidebarOpen,
        searchTerm, setSearchTerm,
        activeTypeFilter, setActiveTypeFilter,
        activeRarityFilter, setActiveRarityFilter,
        sortBy, setSortBy,
        breedingResult, setBreedingResult,
        isBreeding,
        filteredPets,
        resetFilters,
        activeFilterCount,
        canBreed,
        rarityProbabilities,
        toggleSelect,
        handleBreedClick,
        getCooldownStatus,
        getLevelReq
    };
}
