export const COSMETICS = {
    // --- BEECH (Resource: wood_beech) ---
    BG_BROWN: { id: 'BG_BROWN', label: 'Brown', colorClass: 'bg-amber-900', costItem: 'wood_beech', costAmount: 100, rarity: 'COMMON' },
    BG_LIGHTGREEN: { id: 'BG_LIGHTGREEN', label: 'Light Green', colorClass: 'bg-green-400', costItem: 'wood_beech', costAmount: 100, rarity: 'COMMON' },
    BG_DARKGREEN: { id: 'BG_DARKGREEN', label: 'Dark Green', colorClass: 'bg-green-900', costItem: 'wood_beech', costAmount: 100, rarity: 'COMMON' },

    // --- COAL (Resource: stone_coal) ---
    BG_BLACK: { id: 'BG_BLACK', label: 'Black', colorClass: 'bg-slate-950', costItem: 'stone_coal', costAmount: 100, rarity: 'UNCOMMON' },
    BG_GRAY: { id: 'BG_GRAY', label: 'Gray', colorClass: 'bg-gray-500', costItem: 'stone_coal', costAmount: 100, rarity: 'UNCOMMON' },
    BG_DARKBLUE: { id: 'BG_DARKBLUE', label: 'Night Blue', colorClass: 'bg-blue-950', costItem: 'stone_coal', costAmount: 100, rarity: 'UNCOMMON' },

    // --- SHRIMP (Resource: seafood_shrimp) ---
    BG_RED: { id: 'BG_RED', label: 'Red', colorClass: 'bg-red-600', costItem: 'seafood_shrimp', costAmount: 100, rarity: 'EPIC' },
    BG_ORANGE: { id: 'BG_ORANGE', label: 'Orange', colorClass: 'bg-orange-500', costItem: 'seafood_shrimp', costAmount: 100, rarity: 'EPIC' },
    BG_LIGHTBLUE: { id: 'BG_LIGHTBLUE', label: 'Light Blue', colorClass: 'bg-sky-400', costItem: 'seafood_shrimp', costAmount: 100, rarity: 'EPIC' },

    // --- CRYSTAL (Resource: stardust_crystal) ---
    BG_PINK: { id: 'BG_PINK', label: 'Pink', colorClass: 'bg-pink-400', costItem: 'stardust_crystal', costAmount: 100, rarity: 'RARE' },
    BG_MAGENTA: { id: 'BG_MAGENTA', label: 'Magenta', colorClass: 'bg-fuchsia-600', costItem: 'stardust_crystal', costAmount: 100, rarity: 'RARE' },
    BG_YELLOW: { id: 'BG_YELLOW', label: 'Yellow', colorClass: 'bg-yellow-400', costItem: 'stardust_crystal', costAmount: 100, rarity: 'RARE' },

    // --- RAM (Resource: comp_ram) ---
    BG_INDIGO: { id: 'BG_INDIGO', label: 'Indigo', colorClass: 'bg-indigo-600', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_TEAL: { id: 'BG_TEAL', label: 'Teal', colorClass: 'bg-teal-500', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_VIOLET: { id: 'BG_VIOLET', label: 'Violet', colorClass: 'bg-violet-600', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_LIME: { id: 'BG_LIME', label: 'Lime', colorClass: 'bg-lime-500', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_STONE: { id: 'BG_STONE', label: 'Stone', colorClass: 'bg-stone-600', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_WHITE: { id: 'BG_WHITE', label: 'White', colorClass: 'bg-slate-100', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' }
};

export const PROFILE_ICONS = {
    // --- DEFAULTS (Free) ---
    ICON_DEF_1: { id: 'ICON_DEF_1', label: 'Shield', icon: '🛡️', costItem: null, costAmount: 0, rarity: 'COMMON' },
    ICON_DEF_2: { id: 'ICON_DEF_2', label: 'Swords', icon: '⚔️', costItem: null, costAmount: 0, rarity: 'COMMON' },
    ICON_DEF_3: { id: 'ICON_DEF_3', label: 'Bow', icon: '🏹', costItem: null, costAmount: 0, rarity: 'COMMON' },

    // --- WILDLIFE (Wood) ---
    ICON_BEAR: { id: 'ICON_BEAR', label: 'Bear', icon: '🐻', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_WOLF: { id: 'ICON_WOLF', label: 'Wolf', icon: '🐺', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_LION: { id: 'ICON_LION', label: 'Lion', icon: '🦁', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_TIGER: { id: 'ICON_TIGER', label: 'Tiger', icon: '🐯', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_EAGLE: { id: 'ICON_EAGLE', label: 'Eagle', icon: '🦅', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },

    // --- MONSTERS & ROBOTS (Stone) ---
    ICON_SKULL: { id: 'ICON_SKULL', label: 'Skull', icon: '💀', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_GHOST: { id: 'ICON_GHOST', label: 'Ghost', icon: '👻', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_ROBOT: { id: 'ICON_ROBOT', label: 'Robot', icon: '🤖', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_ALIEN: { id: 'ICON_ALIEN', label: 'Alien', icon: '👽', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_DEMON: { id: 'ICON_DEMON', label: 'Demon', icon: '👹', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },

    // --- SEA CREATURES (Shells) ---
    ICON_SHARK: { id: 'ICON_SHARK', label: 'Shark', icon: '🦈', costItem: 'seafood_shells', costAmount: 50, rarity: 'COMMON' },
    ICON_OCTOPUS: { id: 'ICON_OCTOPUS', label: 'Kraken', icon: '🐙', costItem: 'seafood_shells', costAmount: 50, rarity: 'COMMON' },
    ICON_TURTLE: { id: 'ICON_TURTLE', label: 'Turtle', icon: '🐢', costItem: 'seafood_shells', costAmount: 50, rarity: 'COMMON' },

    // --- MAGICAL & RARE (Stardust) ---
    ICON_WIZARD: { id: 'ICON_WIZARD', label: 'Wizard', icon: '🧙‍♂️', costItem: 'stardust_hydrogen', costAmount: 50, rarity: 'UNCOMMON' },
    ICON_UNICORN: { id: 'ICON_UNICORN', label: 'Unicorn', icon: '🦄', costItem: 'stardust_hydrogen', costAmount: 50, rarity: 'UNCOMMON' },
    ICON_DRAGON: { id: 'ICON_DRAGON', label: 'Dragon', icon: '🐉', costItem: 'wood_beech', costAmount: 25, rarity: 'RARE' },
    ICON_CROWN: { id: 'ICON_CROWN', label: 'Crown', icon: '👑', costItem: 'stone_iron', costAmount: 10, rarity: 'EPIC' },
    ICON_DIAMOND: { id: 'ICON_DIAMOND', label: 'Diamond', icon: '💎', costItem: 'comp_ram', costAmount: 5, rarity: 'LEGENDARY' }
};
