import { useState, useEffect } from 'react';
import { RARITIES, RESOURCE_ITEMS, CONSUMABLES, COSMETICS } from '../data/gameData';

export function useInventory(user, pets, onOpenLootbox) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedPotion, setSelectedPotion] = useState(null);

    // --- ANIMATION STATES ---
    const [animationStage, setAnimationStage] = useState('idle');
    const [processingBoxId, setProcessingBoxId] = useState(null);
    const [resultPet, setResultPet] = useState(null);
    const [cycleRarity, setCycleRarity] = useState(RARITIES.COMMON);
    const [canCollect, setCanCollect] = useState(false);

    // --- RESSOURCEN ---
    const villageStorage = user?.village?.storage || {};
    const materialItems = [];
    Object.keys(RESOURCE_ITEMS).forEach(catKey => {
        const items = RESOURCE_ITEMS[catKey];
        items.forEach(itemDef => {
            const count = villageStorage[itemDef.id] || 0;
            if (count > 0) {
                materialItems.push({ ...itemDef, count, category: catKey });
            }
        });
    });
    const hasResources = materialItems.length > 0;

    // --- STAPEL LOGIK ---
    const stacks = {};
    pets.forEach(pet => {
        if (pet.isEgg && pet.hatchAt === 0) {
            const isBreeding = !!(pet.customData?.isBreeding || (pet.parents && pet.parents.length > 0) || pet.source === 'BREEDING');
            const sourceKey = isBreeding ? 'BREEDING' : (pet.source || 'SHOP');
            const key = `${pet.rarity}-${sourceKey}`;
            if (!stacks[key]) { stacks[key] = { base: pet, count: 0, ids: [], rarity: pet.rarity, source: sourceKey, isBreeding: isBreeding }; }
            stacks[key].count++;
            stacks[key].ids.push(pet.id);
        }
    });

    const inventoryItems = Object.values(stacks).sort((a, b) => {
        const rA = RARITIES[a.base.rarity]?.id || 0;
        const rB = RARITIES[b.base.rarity]?.id || 0;
        if (rA !== rB) return rB - rA;
        return (a.isBreeding === b.isBreeding) ? 0 : (a.isBreeding ? -1 : 1);
    });

    const boxStacks = {};
    const ticketStacks = {};
    const potionStacks = {};

    if (user && user.inventory) {
        user.inventory.forEach(item => {
            if (item.type === 'LOOTBOX') {
                if (!boxStacks[item.variant]) boxStacks[item.variant] = { ...item, count: 0, ids: [] };
                boxStacks[item.variant].count++;
                boxStacks[item.variant].ids.push(item.id);
            } else if (item.type === 'TICKET') {
                if (!ticketStacks[item.type]) ticketStacks[item.type] = { ...item, count: 0, ids: [] };
                ticketStacks[item.type].count++;
                ticketStacks[item.type].ids.push(item.id);
            } else if (item.type === 'CONSUMABLE') {
                const config = CONSUMABLES[item.variant] || COSMETICS[item.variant];
                if (config) {
                    if (!potionStacks[item.variant]) potionStacks[item.variant] = { ...item, config: config, count: 0, ids: [] };
                    potionStacks[item.variant].count++;
                    potionStacks[item.variant].ids.push(item.id);
                }
            }
        });
    }
    const boxItems = Object.values(boxStacks);
    const ticketItems = Object.values(ticketStacks);
    const potionItems = Object.values(potionStacks);

    // --- CYCLING EFFECT ---
    useEffect(() => {
        if (animationStage === 'cycling' && resultPet) {
            const sortedRarities = Object.values(RARITIES).sort((a, b) => a.id - b.id);
            const targetRarity = RARITIES[resultPet.rarity] || RARITIES.COMMON;

            let currentIndex = 0;
            let delay = 50;
            let timeoutId;

            const loop = () => {
                const currentRarity = sortedRarities[currentIndex];
                setCycleRarity(currentRarity);

                if (delay >= 400 && currentRarity.id === targetRarity.id) {
                    setAnimationStage('revealed');
                } else {
                    currentIndex = (currentIndex + 1) % sortedRarities.length;
                    delay = Math.floor(delay * 1.15);
                    timeoutId = setTimeout(loop, delay);
                }
            };
            loop();
            return () => clearTimeout(timeoutId);
        }
    }, [animationStage, resultPet]);

    // Button Delay
    useEffect(() => {
        if (animationStage === 'revealed') {
            setCanCollect(false);
            const timer = setTimeout(() => setCanCollect(true), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanCollect(false);
        }
    }, [animationStage]);

    // --- HANDLERS ---
    const startLootboxSequence = async (boxId, boxType) => {
        setSelectedBox(null);
        setProcessingBoxId(boxId);

        // Sequenz Start
        setAnimationStage('charging');

        // Wartezeit für Charging
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnimationStage('shaking');

        try {
            const [_, newPet] = await Promise.all([
                new Promise(resolve => setTimeout(resolve, 2000)), // Shake Dauer
                onOpenLootbox(boxId, boxType)
            ]);
            if (newPet) {
                setResultPet(newPet);
                setAnimationStage('cycling');
                // Kein fester Timeout mehr hier, useEffect übernimmt den Übergang zu 'revealed'
            } else {
                setAnimationStage('idle');
                setProcessingBoxId(null);
            }
        } catch (e) {
            console.error(e);
            setAnimationStage('idle');
            setProcessingBoxId(null);
        }
    };

    const finishAnimation = () => {
        setAnimationStage('idle');
        setProcessingBoxId(null);
        setResultPet(null);
    };

    return {
        selectedItem, setSelectedItem,
        selectedBox, setSelectedBox,
        selectedPotion, setSelectedPotion,
        animationStage, cycleRarity, resultPet, canCollect,
        materialItems, hasResources,
        inventoryItems,
        boxItems,
        ticketItems,
        potionItems,
        startLootboxSequence,
        finishAnimation
    };
}
