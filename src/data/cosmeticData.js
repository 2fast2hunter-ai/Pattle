export const COSMETICS = {
    // --- BUCHE (Resource: wood_beech) ---
    BG_BROWN: { id: 'BG_BROWN', label: 'Hintergrund: Braun', colorClass: 'bg-amber-900', costItem: 'wood_beech', costAmount: 100, rarity: 'COMMON' },
    BG_LIGHTGREEN: { id: 'BG_LIGHTGREEN', label: 'Hintergrund: Hellgrün', colorClass: 'bg-green-400', costItem: 'wood_beech', costAmount: 100, rarity: 'COMMON' },
    BG_DARKGREEN: { id: 'BG_DARKGREEN', label: 'Hintergrund: Dunkelgrün', colorClass: 'bg-green-900', costItem: 'wood_beech', costAmount: 100, rarity: 'COMMON' },

    // --- KOHLE (Resource: stone_coal) ---
    BG_BLACK: { id: 'BG_BLACK', label: 'Hintergrund: Schwarz', colorClass: 'bg-slate-950', costItem: 'stone_coal', costAmount: 100, rarity: 'UNCOMMON' },
    BG_GRAY: { id: 'BG_GRAY', label: 'Hintergrund: Grau', colorClass: 'bg-gray-500', costItem: 'stone_coal', costAmount: 100, rarity: 'UNCOMMON' },
    BG_DARKBLUE: { id: 'BG_DARKBLUE', label: 'Hintergrund: Nachtblau', colorClass: 'bg-blue-950', costItem: 'stone_coal', costAmount: 100, rarity: 'UNCOMMON' },

    // --- GARNELEN (Resource: seafood_shrimp) ---
    BG_RED: { id: 'BG_RED', label: 'Hintergrund: Rot', colorClass: 'bg-red-600', costItem: 'seafood_shrimp', costAmount: 100, rarity: 'EPIC' },
    BG_ORANGE: { id: 'BG_ORANGE', label: 'Hintergrund: Orange', colorClass: 'bg-orange-500', costItem: 'seafood_shrimp', costAmount: 100, rarity: 'EPIC' },
    BG_LIGHTBLUE: { id: 'BG_LIGHTBLUE', label: 'Hintergrund: Hellblau', colorClass: 'bg-sky-400', costItem: 'seafood_shrimp', costAmount: 100, rarity: 'EPIC' },

    // --- KRISTALL (Resource: stardust_crystal) ---
    BG_PINK: { id: 'BG_PINK', label: 'Hintergrund: Pink', colorClass: 'bg-pink-400', costItem: 'stardust_crystal', costAmount: 100, rarity: 'RARE' },
    BG_MAGENTA: { id: 'BG_MAGENTA', label: 'Hintergrund: Magenta', colorClass: 'bg-fuchsia-600', costItem: 'stardust_crystal', costAmount: 100, rarity: 'RARE' },
    BG_YELLOW: { id: 'BG_YELLOW', label: 'Hintergrund: Gelb', colorClass: 'bg-yellow-400', costItem: 'stardust_crystal', costAmount: 100, rarity: 'RARE' },

    // --- RAM (Resource: comp_ram) - Der Rest ---
    BG_INDIGO: { id: 'BG_INDIGO', label: 'Hintergrund: Indigo', colorClass: 'bg-indigo-600', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_TEAL: { id: 'BG_TEAL', label: 'Hintergrund: Türkis', colorClass: 'bg-teal-500', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_VIOLET: { id: 'BG_VIOLET', label: 'Hintergrund: Violett', colorClass: 'bg-violet-600', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_LIME: { id: 'BG_LIME', label: 'Hintergrund: Limette', colorClass: 'bg-lime-500', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_STONE: { id: 'BG_STONE', label: 'Hintergrund: Stein', colorClass: 'bg-stone-600', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' },
    BG_WHITE: { id: 'BG_WHITE', label: 'Hintergrund: Weiß', colorClass: 'bg-slate-100', costItem: 'comp_ram', costAmount: 100, rarity: 'LEGENDARY' }
};

export const PROFILE_ICONS = {
    // --- DEFAULTS (Kostenlos) ---
    ICON_DEF_1: { id: 'ICON_DEF_1', label: 'Schild', icon: '🛡️', costItem: null, costAmount: 0, rarity: 'COMMON' },
    ICON_DEF_2: { id: 'ICON_DEF_2', label: 'Schwerter', icon: '⚔️', costItem: null, costAmount: 0, rarity: 'COMMON' },
    ICON_DEF_3: { id: 'ICON_DEF_3', label: 'Bogen', icon: '🏹', costItem: null, costAmount: 0, rarity: 'COMMON' },

    // --- TIERWELT (Holz) ---
    ICON_BEAR: { id: 'ICON_BEAR', label: 'Bär', icon: '🐻', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_WOLF: { id: 'ICON_WOLF', label: 'Wolf', icon: '🐺', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_LION: { id: 'ICON_LION', label: 'Löwe', icon: '🦁', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_TIGER: { id: 'ICON_TIGER', label: 'Tiger', icon: '🐯', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },
    ICON_EAGLE: { id: 'ICON_EAGLE', label: 'Adler', icon: '🦅', costItem: 'wood_oak', costAmount: 50, rarity: 'COMMON' },

    // --- MONSTER & ROBOTER (Stein) ---
    ICON_SKULL: { id: 'ICON_SKULL', label: 'Totenkopf', icon: '💀', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_GHOST: { id: 'ICON_GHOST', label: 'Geist', icon: '👻', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_ROBOT: { id: 'ICON_ROBOT', label: 'Roboter', icon: '🤖', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_ALIEN: { id: 'ICON_ALIEN', label: 'Alien', icon: '👽', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },
    ICON_DEMON: { id: 'ICON_DEMON', label: 'Dämon', icon: '👹', costItem: 'stone_rock', costAmount: 50, rarity: 'COMMON' },

    // --- MEERESBEWOHNER (Muscheln) ---
    ICON_SHARK: { id: 'ICON_SHARK', label: 'Hai', icon: '🦈', costItem: 'seafood_shells', costAmount: 50, rarity: 'COMMON' },
    ICON_OCTOPUS: { id: 'ICON_OCTOPUS', label: 'Krake', icon: '🐙', costItem: 'seafood_shells', costAmount: 50, rarity: 'COMMON' },
    ICON_TURTLE: { id: 'ICON_TURTLE', label: 'Schildkröte', icon: '🐢', costItem: 'seafood_shells', costAmount: 50, rarity: 'COMMON' },

    // --- MAGISCH & SELTEN (Sternenstaub & Seltenes) ---
    ICON_WIZARD: { id: 'ICON_WIZARD', label: 'Magier', icon: '🧙‍♂️', costItem: 'stardust_hydrogen', costAmount: 50, rarity: 'UNCOMMON' },
    ICON_UNICORN: { id: 'ICON_UNICORN', label: 'Einhorn', icon: '🦄', costItem: 'stardust_hydrogen', costAmount: 50, rarity: 'UNCOMMON' },
    ICON_DRAGON: { id: 'ICON_DRAGON', label: 'Drache', icon: '🐉', costItem: 'wood_beech', costAmount: 25, rarity: 'RARE' },
    ICON_CROWN: { id: 'ICON_CROWN', label: 'Krone', icon: '👑', costItem: 'stone_iron', costAmount: 10, rarity: 'EPIC' },
    ICON_DIAMOND: { id: 'ICON_DIAMOND', label: 'Diamant', icon: '💎', costItem: 'comp_ram', costAmount: 5, rarity: 'LEGENDARY' }
};