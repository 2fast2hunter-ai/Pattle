// src/data/villageData.js

export const RESOURCES = {
    WOOD: { id: 'wood', label: 'Wood', buildingLabel: 'Sawmill', desc: 'Processes wood from the surrounding forests.', slots: 5, unlockLevel: 5, color: 'text-amber-700', bg: 'bg-amber-700' },
    STONE: { id: 'stone', label: 'Stone', buildingLabel: 'Quarry', desc: 'Mines valuable minerals and stone.', slots: 5, unlockLevel: 5, color: 'text-stone-500', bg: 'bg-stone-500' },
    HERB_GARDEN: { id: 'herb_garden', label: 'Herbs', buildingLabel: 'Kräutergarten', desc: 'Grows rare herbs used in the Alchemy Lab.', slots: 5, unlockLevel: 5, color: 'text-green-500', bg: 'bg-green-600' },
    MARKET_STALL: { id: 'market_stall', label: 'Market Stall', buildingLabel: 'Marktstand', desc: 'Generates tradeable goods for the marketplace daily.', slots: 5, unlockLevel: 6, color: 'text-yellow-400', bg: 'bg-yellow-600' },
    SEAFOOD: { id: 'seafood', label: 'Seafood', buildingLabel: 'Fishery', desc: 'Catches fresh fish and collects shells.', slots: 5, unlockLevel: 20, color: 'text-blue-400', bg: 'bg-blue-500' },
    TAVERN: { id: 'tavern', label: 'Tavern', buildingLabel: 'Taverne', desc: 'Brews drinks and generates daily buff items for your pets.', slots: 5, unlockLevel: 8, color: 'text-amber-400', bg: 'bg-amber-600' },
    BARRACKS: { id: 'barracks', label: 'Barracks', buildingLabel: 'Kaserne', desc: 'Intensive training for up to 2 pets — earns bonus XP per cycle.', slots: 2, unlockLevel: 10, color: 'text-orange-400', bg: 'bg-orange-700' },
    STARDUST: { id: 'stardust', label: 'Stardust', buildingLabel: 'Observatory', desc: 'Collects cosmic energy from the stars.', slots: 5, unlockLevel: 15, color: 'text-purple-400', bg: 'bg-purple-600' },
    COMPUTER_PARTS: { id: 'computer_parts', label: 'Computer Parts', buildingLabel: 'Tech Factory', desc: 'Produces highly complex components.', slots: 5, unlockLevel: 10, color: 'text-cyan-400', bg: 'bg-cyan-700' },
    ALCHEMY_LAB: { id: 'alchemy_lab', label: 'Alchemy Lab', buildingLabel: 'Alchimistenlabor', desc: 'Converts raw materials into powerful consumables.', slots: 5, unlockLevel: 12, color: 'text-green-400', bg: 'bg-green-700' },
    SPECIAL: { id: 'special', label: 'Special', buildingLabel: 'Alchemy Lab', desc: 'Experiments with rare matter.', slots: 5, unlockLevel: 30, color: 'text-pink-500', bg: 'bg-pink-600' },
    CRYSTAL_FIELD: { id: 'crystal_field', label: 'Magic Crystals', buildingLabel: 'Kristallfeld', desc: 'Harvests magic crystals used for research upgrades.', slots: 5, unlockLevel: 15, color: 'text-violet-400', bg: 'bg-violet-600' },
    LIBRARY: { id: 'library', label: 'Library', buildingLabel: 'Bibliothek', desc: 'Unlocks permanent research upgrades for your village.', slots: 5, unlockLevel: 15, color: 'text-indigo-400', bg: 'bg-indigo-700' },
    TRAINING: { id: 'training', label: 'Training', buildingLabel: 'Training Ground', desc: 'Your pets train intensively here for experience points.', slots: 5, unlockLevel: 30, color: 'text-red-500', bg: 'bg-red-600' }
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
    ],
    tavern: ['FAIRY', 'WATER', 'FIRE', 'NATURE', 'EARTH', 'LIGHT', 'WIND', 'ICE'],
    alchemy_lab: ['PSYCHIC', 'MAGIC', 'GHOST', 'POISON', 'TECH', 'WATER', 'VOID', 'CHAOS'],
    barracks: ['FIGHTING', 'FIRE', 'METAL', 'DRAGON', 'DARK', 'ROCK', 'ORDER', 'EARTH', 'NATURE', 'WIND'],
    library: ['PSYCHIC', 'LIGHT', 'MAGIC', 'TIME', 'SPACE', 'WIND', 'VOID', 'ORDER'],
    market_stall: ['WIND', 'WATER', 'EARTH', 'NATURE', 'FAIRY', 'LIGHT', 'FIRE', 'METAL', 'ELECTRIC', 'TECH'],
    herb_garden: ['NATURE', 'WIND', 'FAIRY', 'WATER', 'EARTH', 'LIGHT', 'POISON'],
    crystal_field: ['MAGIC', 'PSYCHIC', 'SPACE', 'VOID', 'LIGHT', 'TIME', 'ORDER'],
};

export const RARITY_MULTIPLIERS = {
    COMMON: 1.0, UNCOMMON: 1.1, RARE: 1.2, EPIC: 1.3, LEGENDARY: 1.4,
    MYTHIC: 1.5, DIVINE: 1.6, ANCIENT: 1.8, COSMIC: 2.0, TRANSCENDENT: 2.5
};

export const RESOURCE_ITEMS = {
    wood: [
        { id: 'wood_oak', label: 'Oak', rarity: 'COMMON', chance: 75.0, color: 'text-amber-800' },
        { id: 'wood_beech', label: 'Beech', rarity: 'RARE', chance: 24.85, color: 'text-green-600' },
        { id: 'wood_mahogany', label: 'Mahogany', rarity: 'ANCIENT', chance: 0.15, color: 'text-red-900' }
    ],
    stone: [
        { id: 'stone_rock', label: 'Rock', rarity: 'COMMON', chance: 52.0, color: 'text-stone-400' },
        { id: 'stone_coal', label: 'Coal', rarity: 'UNCOMMON', chance: 40.0, color: 'text-slate-800' },
        { id: 'stone_iron', label: 'Iron', rarity: 'EPIC', chance: 7.5, color: 'text-slate-500' },
        { id: 'stone_diamond', label: 'Diamond', rarity: 'MYTHIC', chance: 0.4, color: 'text-cyan-400' },
        { id: 'stone_emerald', label: 'Emerald', rarity: 'COSMIC', chance: 0.1, color: 'text-emerald-500' }
    ],
    seafood: [
        { id: 'seafood_shells', label: 'Shells', rarity: 'COMMON', chance: 82.5, color: 'text-orange-200' },
        { id: 'seafood_shrimp', label: 'Shrimp', rarity: 'EPIC', chance: 15.0, color: 'text-red-400' },
        { id: 'seafood_pearl', label: 'Pearls', rarity: 'LEGENDARY', chance: 2.5, color: 'text-white' }
    ],
    stardust: [
        { id: 'stardust_hydrogen', label: 'Hydrogen', rarity: 'UNCOMMON', chance: 60.0, color: 'text-blue-200' },
        { id: 'stardust_crystal', label: 'Crystal', rarity: 'RARE', chance: 39.925, color: 'text-purple-300' },
        { id: 'stardust_star', label: 'Star', rarity: 'TRANSCENDENT', chance: 0.075, color: 'text-yellow-100' }
    ],
    computer_parts: [
        { id: 'comp_cable', label: 'Cable', rarity: 'COMMON', chance: 98.0, color: 'text-gray-400' },
        { id: 'comp_ram', label: 'RAM Module', rarity: 'LEGENDARY', chance: 1.8, color: 'text-green-400' },
        { id: 'comp_gpu', label: 'Graphics Card', rarity: 'DIVINE', chance: 0.2, color: 'text-red-500' }
    ],
    special: [
        { id: 'special_watch', label: 'Watch', rarity: 'UNCOMMON', chance: 55.0, color: 'text-amber-200' },
        { id: 'special_area', label: 'Plot m²', rarity: 'RARE', chance: 43.75, color: 'text-green-300' },
        { id: 'special_plutonium', label: 'Plutonium', rarity: 'MYTHIC', chance: 1.0, color: 'text-green-500' },
        { id: 'special_antimatter', label: 'Antimatter', rarity: 'COSMIC', chance: 0.25, color: 'text-purple-600' }
    ],
    tavern: [
        { id: 'tavern_ale', label: 'Ale', rarity: 'COMMON', chance: 70.0, color: 'text-amber-400' },
        { id: 'tavern_wine', label: 'Wine', rarity: 'RARE', chance: 28.0, color: 'text-red-400' },
        { id: 'tavern_mead', label: 'Mead', rarity: 'EPIC', chance: 2.0, color: 'text-yellow-300' }
    ],
    alchemy_lab: [
        { id: 'alchemy_herb', label: 'Herb', rarity: 'COMMON', chance: 65.0, color: 'text-green-400' },
        { id: 'alchemy_essence', label: 'Essence', rarity: 'RARE', chance: 33.0, color: 'text-emerald-300' },
        { id: 'alchemy_catalyst', label: 'Catalyst', rarity: 'EPIC', chance: 2.0, color: 'text-teal-300' }
    ],
    library: [
        { id: 'library_scroll', label: 'Scroll', rarity: 'COMMON', chance: 70.0, color: 'text-indigo-300' },
        { id: 'library_tome', label: 'Tome', rarity: 'RARE', chance: 28.0, color: 'text-purple-400' },
        { id: 'library_codex', label: 'Codex', rarity: 'EPIC', chance: 2.0, color: 'text-violet-300' }
    ],
    market_stall: [
        { id: 'market_goods', label: 'Goods', rarity: 'COMMON', chance: 75.0, color: 'text-yellow-400' },
        { id: 'market_luxury', label: 'Luxury Item', rarity: 'RARE', chance: 23.0, color: 'text-amber-300' },
        { id: 'market_artifact', label: 'Artifact', rarity: 'EPIC', chance: 2.0, color: 'text-orange-300' }
    ],
    herb_garden: [
        { id: 'herb_chamomile', label: 'Chamomile', rarity: 'COMMON', chance: 65.0, color: 'text-yellow-200' },
        { id: 'herb_mandrake', label: 'Mandrake', rarity: 'RARE', chance: 30.0, color: 'text-green-400' },
        { id: 'herb_moonbloom', label: 'Moonbloom', rarity: 'EPIC', chance: 5.0, color: 'text-blue-300' }
    ],
    crystal_field: [
        { id: 'crystal_shard', label: 'Crystal Shard', rarity: 'COMMON', chance: 70.0, color: 'text-sky-300' },
        { id: 'crystal_prism', label: 'Crystal Prism', rarity: 'RARE', chance: 28.0, color: 'text-violet-300' },
        { id: 'crystal_nexus', label: 'Crystal Nexus', rarity: 'COSMIC', chance: 2.0, color: 'text-fuchsia-400' }
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

// Storage cap per resource at level 1; multiplied by building level
export const STORAGE_BASE_CAPS = {
    wood: 200, stone: 200, seafood: 150, stardust: 150,
    computer_parts: 100, special: 100, tavern: 150, alchemy_lab: 150,
    barracks: 0, library: 150, market_stall: 150,
    herb_garden: 200, crystal_field: 150
};

export const getStorageCapacity = (resourceId, buildingLevel) => {
    const base = STORAGE_BASE_CAPS[resourceId] || 150;
    return base * Math.max(1, buildingLevel);
};

export const getStorageTotalForResource = (storage, resourceId) => {
    const items = RESOURCE_ITEMS[resourceId] || [];
    return items.reduce((sum, item) => sum + (storage[item.id] || 0), 0);
};

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
            milestones.push({ id: `ms_${item.id}`, resourceId: resKey, itemId: item.id, target: target, reward: reward, label: `Collect ${target}x ${item.label}` });
        });
    });
    milestones.push({ id: 'ms_time_3h', type: 'TIME', target: 10800, reward: { type: 'VILLAGE_XP', amount: 15000 }, label: 'Spend 3 hours in the village' });
    return milestones;
};

export const MILESTONES = generateMilestones();

export const SPECIAL_OFFERS = [
    {
        id: 'OFFER_AD_TICKET',
        label: 'Ad Ticket',
        description: 'Fills up idle time',
        costItem: 'special_watch',
        costAmount: 100,
        reward: { type: 'AD_TICKET', amount: 1 }
    },
    {
        id: 'OFFER_BREED_TICKET',
        label: 'Breed Ticket',
        description: 'Allows one breeding',
        costItem: 'special_area',
        costAmount: 100,
        reward: { type: 'ITEM', itemType: 'TICKET', itemVariant: 'BREED', amount: 1 }
    },
    {
        id: 'OFFER_XP_LARGE',
        label: 'Large XP Potion',
        description: '5000 XP for a pet',
        costItem: 'special_plutonium',
        costAmount: 50,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_LARGE', amount: 1 }
    },
    {
        id: 'OFFER_SHINY',
        label: 'Shiny Potion',
        description: 'Makes a pet Shiny',
        costItem: 'special_antimatter',
        costAmount: 1,
        reward: { type: 'CONSUMABLE', variant: 'SHINY_POTION', amount: 1 }
    },
    // Taverne Offers
    {
        id: 'OFFER_TAVERN_ALE',
        label: 'Buff Food',
        description: 'Grants a small XP potion',
        costItem: 'tavern_ale',
        costAmount: 50,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_SMALL', amount: 1 }
    },
    {
        id: 'OFFER_TAVERN_WINE',
        label: 'Fine Wine',
        description: 'Grants a medium XP potion',
        costItem: 'tavern_wine',
        costAmount: 10,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_MEDIUM', amount: 1 }
    },
    {
        id: 'OFFER_TAVERN_MEAD',
        label: 'Golden Mead',
        description: 'Grants a large XP potion',
        costItem: 'tavern_mead',
        costAmount: 1,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_LARGE', amount: 1 }
    },
    // Alchemy Lab Offers
    {
        id: 'OFFER_ALCHEMY_HERB',
        label: 'Herbal Potion',
        description: 'Grants a small XP potion',
        costItem: 'alchemy_herb',
        costAmount: 30,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_SMALL', amount: 1 }
    },
    {
        id: 'OFFER_ALCHEMY_ESSENCE',
        label: 'Brew Elixir',
        description: 'Grants a Breed Ticket',
        costItem: 'alchemy_essence',
        costAmount: 15,
        reward: { type: 'ITEM', itemType: 'TICKET', itemVariant: 'BREED', amount: 1 }
    },
    {
        id: 'OFFER_ALCHEMY_CATALYST',
        label: 'Shiny Catalyst',
        description: 'Makes a pet Shiny',
        costItem: 'alchemy_catalyst',
        costAmount: 5,
        reward: { type: 'CONSUMABLE', variant: 'SHINY_POTION', amount: 1 }
    },
    // Herb Garden Offers
    {
        id: 'OFFER_HERB_CHAMOMILE',
        label: 'Herbal Remedy',
        description: 'Grants a small XP potion',
        costItem: 'herb_chamomile',
        costAmount: 40,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_SMALL', amount: 1 }
    },
    {
        id: 'OFFER_HERB_MANDRAKE',
        label: 'Mandrake Brew',
        description: 'Grants a medium XP potion',
        costItem: 'herb_mandrake',
        costAmount: 12,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_MEDIUM', amount: 1 }
    },
    {
        id: 'OFFER_HERB_MOONBLOOM',
        label: 'Moonbloom Elixir',
        description: 'Makes a pet Shiny',
        costItem: 'herb_moonbloom',
        costAmount: 3,
        reward: { type: 'CONSUMABLE', variant: 'SHINY_POTION', amount: 1 }
    },
    // Market Stall Offers
    {
        id: 'OFFER_MARKET_LUXURY',
        label: 'Luxury Exchange',
        description: 'Trade for a large XP potion',
        costItem: 'market_luxury',
        costAmount: 10,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_LARGE', amount: 1 }
    },
    {
        id: 'OFFER_MARKET_ARTIFACT',
        label: 'Rare Artifact',
        description: 'Trade for a Shiny Potion',
        costItem: 'market_artifact',
        costAmount: 2,
        reward: { type: 'CONSUMABLE', variant: 'SHINY_POTION', amount: 1 }
    }
];

export const RESEARCH_UPGRADES = [
    {
        id: 'research_prod_1',
        label: '+5% Production Speed',
        desc: 'All buildings produce 5% faster.',
        effect: 'PROD_SPEED',
        value: 0.05,
        costItem: 'library_scroll',
        costAmount: 100,
        requiresLibraryLevel: 3
    },
    {
        id: 'research_xp_1',
        label: '+10% Village XP Gain',
        desc: 'Earn 10% more XP from village production.',
        effect: 'XP_GAIN',
        value: 0.10,
        costItem: 'library_scroll',
        costAmount: 100,
        requiresLibraryLevel: 3
    },
    {
        id: 'research_prod_2',
        label: '+10% Production Speed',
        desc: 'All buildings produce 10% faster (stacks with Tier 1).',
        effect: 'PROD_SPEED',
        value: 0.10,
        costItem: 'library_tome',
        costAmount: 50,
        requiresLibraryLevel: 7,
        requiresResearch: 'research_prod_1'
    },
    {
        id: 'research_xp_2',
        label: '+20% Village XP Gain',
        desc: 'Earn 20% more XP from village production (stacks with Tier 1).',
        effect: 'XP_GAIN',
        value: 0.20,
        costItem: 'library_tome',
        costAmount: 50,
        requiresLibraryLevel: 7,
        requiresResearch: 'research_xp_1'
    },
    {
        id: 'research_market_1',
        label: '+15% Market Earnings',
        desc: 'Earn 15% more coins from marketplace sales.',
        effect: 'MARKET_EARN',
        value: 0.15,
        costItem: 'library_codex',
        costAmount: 10,
        requiresLibraryLevel: 10
    },
    {
        id: 'research_storage_1',
        label: '+25% Storage Capacity',
        desc: 'All buildings can store 25% more items before production stops.',
        effect: 'STORAGE_CAP',
        value: 0.25,
        costItem: 'crystal_shard',
        costAmount: 200,
        requiresLibraryLevel: 5
    },
    {
        id: 'research_crystal_prod',
        label: '+10% Herb & Crystal Yield',
        desc: 'Herb Garden and Crystal Field produce 10% more items.',
        effect: 'HERB_CRYSTAL_PROD',
        value: 0.10,
        costItem: 'crystal_prism',
        costAmount: 30,
        requiresLibraryLevel: 8,
        requiresResearch: 'research_storage_1'
    }
];