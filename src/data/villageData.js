// src/data/villageData.js

export const RESOURCES = {
    WOOD: { id: 'wood', label: 'Holz', buildingLabel: 'Sägewerk', desc: 'Verarbeitet Holz aus den umliegenden Wäldern.', slots: 5, unlockLevel: 5, color: 'text-amber-700', bg: 'bg-amber-700' },
    STONE: { id: 'stone', label: 'Stein', buildingLabel: 'Steinbruch', desc: 'Baut wertvolle Mineralien und Gestein ab.', slots: 5, unlockLevel: 5, color: 'text-stone-500', bg: 'bg-stone-500' },
    SEAFOOD: { id: 'seafood', label: 'Meeresfrüchte', buildingLabel: 'Fischerei', desc: 'Fängt frischen Fisch und sammelt Muscheln.', slots: 5, unlockLevel: 20, color: 'text-blue-400', bg: 'bg-blue-500' },
    STARDUST: { id: 'stardust', label: 'Sternenstaub', buildingLabel: 'Sternenwarte', desc: 'Sammelt kosmische Energie aus dem All.', slots: 5, unlockLevel: 15, color: 'text-purple-400', bg: 'bg-purple-600' },
    COMPUTER_PARTS: { id: 'computer_parts', label: 'Computerteile', buildingLabel: 'Tech-Fabrik', desc: 'Produziert hochkomplexe Bauteile.', slots: 5, unlockLevel: 10, color: 'text-cyan-400', bg: 'bg-cyan-700' },
    SPECIAL: { id: 'special', label: 'Spezial', buildingLabel: 'Alchemielabor', desc: 'Experimentiert mit seltenen Materien.', slots: 5, unlockLevel: 30, color: 'text-pink-500', bg: 'bg-pink-600' },
    TRAINING: { id: 'training', label: 'Training', buildingLabel: 'Übungsplatz', desc: 'Deine Pets trainieren hier intensiv für Erfahrungspunkte.', slots: 5, unlockLevel: 30, color: 'text-red-500', bg: 'bg-red-600' }
};

export const ALLOWED_TYPES = {
    wood: ['NATURE', 'EARTH', 'MAGIC', 'FIGHTING', 'TIME', 'LIGHT', 'ORDER', 'DRAGON'],
    stone: ['FIRE', 'EARTH', 'DARK', 'GHOST', 'PSYCHIC', 'METAL', 'ROCK', 'SOUND', 'VOID', 'ORDER'],
    seafood: ['WATER', 'ICE', 'DARK', 'POISON', 'FAIRY'],
    stardust: ['NATURE', 'WIND', 'ICE', 'PSYCHIC', 'ROCK', 'DRAGON', 'SOUND', 'SPACE', 'VOID'],
    computer_parts: ['FIRE', 'WIND', 'ELECTRIC', 'LIGHT', 'MAGIC', 'METAL', 'TECH', 'SPACE'],
    special: ['WATER', 'ELECTRIC', 'GHOST', 'PSYCHIC', 'FIGHTING', 'POISON', 'FAIRY', 'TECH', 'TIME', 'CHAOS', 'ORDER'],
    training: [
        'NATURE', 'EARTH', 'MAGIC', 'FIGHTING', 'TIME', 'LIGHT', 'ORDER', 'DRAGON', 'FIRE', 'DARK', 'GHOST', 'PSYCHIC', 'METAL', 'ROCK', 'SOUND', 'VOID',
        'WATER', 'ICE', 'POISON', 'FAIRY', 'WIND', 'SPACE', 'ELECTRIC', 'TECH', 'CHAOS'
    ]
};

export const RARITY_MULTIPLIERS = {
    COMMON: 1.0, UNCOMMON: 1.1, RARE: 1.2, EPIC: 1.3, LEGENDARY: 1.4,
    MYTHIC: 1.5, DIVINE: 1.6, ANCIENT: 1.8, COSMIC: 2.0, TRANSCENDENT: 2.5
};

export const RESOURCE_ITEMS = {
    wood: [
        { id: 'wood_oak', label: 'Eiche', rarity: 'COMMON', chance: 75.0, color: 'text-amber-800' },
        { id: 'wood_beech', label: 'Buche', rarity: 'RARE', chance: 24.85, color: 'text-green-600' },
        { id: 'wood_mahogany', label: 'Mahagoni', rarity: 'ANCIENT', chance: 0.15, color: 'text-red-900' }
    ],
    stone: [
        { id: 'stone_rock', label: 'Stein', rarity: 'COMMON', chance: 52.0, color: 'text-stone-400' },
        { id: 'stone_coal', label: 'Kohle', rarity: 'UNCOMMON', chance: 40.0, color: 'text-slate-800' },
        { id: 'stone_iron', label: 'Eisen', rarity: 'EPIC', chance: 7.5, color: 'text-slate-500' },
        { id: 'stone_diamond', label: 'Diamant', rarity: 'MYTHIC', chance: 0.4, color: 'text-cyan-400' },
        { id: 'stone_emerald', label: 'Smaragd', rarity: 'COSMIC', chance: 0.1, color: 'text-emerald-500' }
    ],
    seafood: [
        { id: 'seafood_shells', label: 'Muscheln', rarity: 'COMMON', chance: 82.5, color: 'text-orange-200' },
        { id: 'seafood_shrimp', label: 'Garnelen', rarity: 'EPIC', chance: 15.0, color: 'text-red-400' },
        { id: 'seafood_pearl', label: 'Perlen', rarity: 'LEGENDARY', chance: 2.5, color: 'text-white' }
    ],
    stardust: [
        { id: 'stardust_hydrogen', label: 'Wasserstoff', rarity: 'UNCOMMON', chance: 60.0, color: 'text-blue-200' },
        { id: 'stardust_crystal', label: 'Kristall', rarity: 'RARE', chance: 39.925, color: 'text-purple-300' },
        { id: 'stardust_star', label: 'Stern', rarity: 'TRANSCENDENT', chance: 0.075, color: 'text-yellow-100' }
    ],
    computer_parts: [
        { id: 'comp_cable', label: 'Kabel', rarity: 'COMMON', chance: 98.0, color: 'text-gray-400' },
        { id: 'comp_ram', label: 'RAM-Modul', rarity: 'LEGENDARY', chance: 1.8, color: 'text-green-400' },
        { id: 'comp_gpu', label: 'Grafikkarte', rarity: 'DIVINE', chance: 0.2, color: 'text-red-500' }
    ],
    special: [
        { id: 'special_watch', label: 'Uhr', rarity: 'UNCOMMON', chance: 55.0, color: 'text-amber-200' },
        { id: 'special_area', label: 'Fläche m²', rarity: 'RARE', chance: 43.75, color: 'text-green-300' },
        { id: 'special_plutonium', label: 'Plutonium', rarity: 'MYTHIC', chance: 1.0, color: 'text-green-500' },
        { id: 'special_antimatter', label: 'Antimaterie', rarity: 'COSMIC', chance: 0.25, color: 'text-purple-600' }
    ]
};

// --- NEUE KOSTEN-STRUKTUR ---
// Lvl 2: 1000
// Lvl 3: 10.000
// ... x10 pro Level
// Ab Level 11: + Seltenste Ressource (Start 500, +500 pro Level)
export const UPGRADE_COSTS = Array.from({ length: 15 }, (_, i) => {
    const level = i + 1;
    let baseCost = 0;
    let specialCost = 0;
    let time = 10;
    
    if (level === 1) { 
        baseCost = 0; 
        time = 10; 
    } else {
        // Basis-Kosten: 1000 * 10^(level-2)
        baseCost = 1000 * Math.pow(10, level - 2);
        time = Math.max(1, 10 - ((level - 1) * 0.5));
    }

    // Spezial-Kosten ab Level 11
    if (level >= 11) {
        // L11: 500, L12: 1000, ..., L15: 2500
        specialCost = 500 * (level - 10);
    }

    return { level, baseCost, specialCost, time };
});

export const TRADE_RECIPES = [
    { offerId: 'wood_mahogany', wantId: 'wood_oak', cost: 1, receive: 7666 },
    { offerId: 'wood_oak', wantId: 'stone_rock', cost: 2, receive: 1 },
    { offerId: 'wood_oak', wantId: 'seafood_shells', cost: 2, receive: 1 },
    { offerId: 'wood_oak', wantId: 'stardust_hydrogen', cost: 2, receive: 2 }, 
    { offerId: 'wood_oak', wantId: 'comp_cable', cost: 2, receive: 1 },
    { offerId: 'stone_emerald', wantId: 'stone_rock', cost: 1, receive: 11000 },
    { offerId: 'stone_diamond', wantId: 'stone_rock', cost: 1, receive: 3500 },
    { offerId: 'stone_rock', wantId: 'wood_oak', cost: 2, receive: 1 },
    { offerId: 'stone_rock', wantId: 'seafood_shells', cost: 2, receive: 1 },
    { offerId: 'stone_rock', wantId: 'stardust_hydrogen', cost: 2, receive: 1 },
    { offerId: 'stone_rock', wantId: 'comp_cable', cost: 2, receive: 1 },
    { offerId: 'seafood_pearl', wantId: 'seafood_shells', cost: 1, receive: 1400 },
    { offerId: 'seafood_shells', wantId: 'wood_oak', cost: 2, receive: 1 },
    { offerId: 'seafood_shells', wantId: 'stone_rock', cost: 2, receive: 1 },
    { offerId: 'seafood_shells', wantId: 'stardust_hydrogen', cost: 2, receive: 1 },
    { offerId: 'seafood_shells', wantId: 'comp_cable', cost: 2, receive: 1 },
    { offerId: 'stardust_star', wantId: 'stardust_hydrogen', cost: 1, receive: 14300 },
    { offerId: 'stardust_hydrogen', wantId: 'wood_oak', cost: 2, receive: 1 },
    { offerId: 'stardust_hydrogen', wantId: 'stone_rock', cost: 2, receive: 1 },
    { offerId: 'stardust_hydrogen', wantId: 'seafood_shells', cost: 2, receive: 1 },
    { offerId: 'stardust_hydrogen', wantId: 'comp_cable', cost: 2, receive: 1 },
    { offerId: 'comp_gpu', wantId: 'comp_cable', cost: 1, receive: 6000 },
    { offerId: 'comp_cable', wantId: 'wood_oak', cost: 2, receive: 1 },
    { offerId: 'comp_cable', wantId: 'stone_rock', cost: 2, receive: 1 },
    { offerId: 'comp_cable', wantId: 'seafood_shells', cost: 2, receive: 1 },
    { offerId: 'comp_cable', wantId: 'stardust_hydrogen', cost: 2, receive: 1 }
];

const RARITY_POTION_MAP = {
    COMMON: 'XP_POTION_SMALL',
    UNCOMMON: 'XP_POTION_SMALL',
    RARE: 'XP_POTION_MEDIUM',
    EPIC: 'XP_POTION_MEDIUM',
    LEGENDARY: 'XP_POTION_MEDIUM',
    MYTHIC: 'XP_POTION_MEDIUM',
    DIVINE: 'XP_POTION_LARGE',
    ANCIENT: 'XP_POTION_LARGE',
    COSMIC: 'XP_POTION_LARGE',
    TRANSCENDENT: 'XP_POTION_LARGE'
};

const REWARD_OVERRIDES = {
    'wood_beech': { type: 'CONSUMABLE', variant: 'XP_POTION_SMALL', amount: 1 },
    'seafood_shrimp': { type: 'CONSUMABLE', variant: 'XP_POTION_SMALL', amount: 1 },
    'seafood_pearl': { type: 'COINS', amount: 10000 },
    'comp_ram': { type: 'CONSUMABLE', variant: 'XP_POTION_SMALL', amount: 1 },
    'comp_gpu': { type: 'CONSUMABLE', variant: 'XP_POTION_MEDIUM', amount: 1 }
};

const generateMilestones = () => {
    const milestones = [];
    Object.entries(RESOURCE_ITEMS).forEach(([resKey, items]) => {
        const sortedItems = [...items].sort((a, b) => b.chance - a.chance);
        sortedItems.forEach((item, index) => {
            const isHighestChance = index === 0;
            let target = 0;
            let reward = {};
            if (REWARD_OVERRIDES[item.id]) {
                if (isHighestChance) { target = 1000; } else { target = Math.ceil(1000 * (item.chance / 100)); }
                reward = REWARD_OVERRIDES[item.id];
            } else {
                if (isHighestChance) { target = 1000; reward = { type: 'COINS', amount: 50 }; } 
                else { target = Math.ceil(1000 * (item.chance / 100)); const potionVariant = RARITY_POTION_MAP[item.rarity] || 'XP_POTION_SMALL'; reward = { type: 'CONSUMABLE', variant: potionVariant, amount: 1 }; }
            }
            milestones.push({ id: `ms_${item.id}`, resourceId: resKey, itemId: item.id, target: target, reward: reward, label: `Sammle ${target}x ${item.label}` });
        });
    });
    milestones.push({ id: 'ms_time_3h', type: 'TIME', target: 10800, reward: { type: 'VILLAGE_XP', amount: 15000 }, label: 'Verbringe 3 Stunden im Dorf' });
    return milestones;
};

export const MILESTONES = generateMilestones();

export const SPECIAL_OFFERS = [
    {
        id: 'OFFER_AD_TICKET',
        label: 'Werbeticket',
        description: 'Füllt Idle-Zeit auf',
        costItem: 'special_watch',
        costAmount: 100,
        reward: { type: 'AD_TICKET', amount: 1 }
    },
    {
        id: 'OFFER_BREED_TICKET',
        label: 'Zucht-Ticket',
        description: 'Erlaubt eine Zucht',
        costItem: 'special_area',
        costAmount: 100,
        reward: { type: 'ITEM', itemType: 'TICKET', itemVariant: 'BREED', amount: 1 }
    },
    {
        id: 'OFFER_XP_LARGE',
        label: 'Große XP-Flasche',
        description: '5000 XP für ein Pet',
        costItem: 'special_plutonium',
        costAmount: 50,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_LARGE', amount: 1 }
    },
    {
        id: 'OFFER_SHINY',
        label: 'Shiny-Flasche',
        description: 'Macht ein Pet Shiny',
        costItem: 'special_antimatter',
        costAmount: 1,
        reward: { type: 'CONSUMABLE', variant: 'SHINY_POTION', amount: 1 }
    }
];