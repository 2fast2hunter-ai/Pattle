export const QUEST_TYPES = {
  WIN_PVP: 'WIN_PVP',
  HATCH_EGG: 'HATCH_EGG',
  BREED_PET: 'BREED_PET',
  SPEND_COINS: 'SPEND_COINS',
  EARN_XP: 'EARN_XP',
  LEVEL_UP_PET: 'LEVEL_UP_PET',
  COMPLETE_DAILY_SET: 'COMPLETE_DAILY_SET',
  // Season 1 additions
  WIN_DIVINE: 'WIN_DIVINE',
  COLLECT_RESOURCE: 'COLLECT_RESOURCE',
  UPGRADE_BUILDING: 'UPGRADE_BUILDING',
  CHALLENGE_FRIEND: 'CHALLENGE_FRIEND',
};

// --- ALL 100 QUEST TEMPLATES (XP REWARDS ONLY) ---
export const QUEST_TEMPLATES = [
  // --- PVP (WIN_PVP) ---
  { type: 'WIN_PVP', label: "Win Battles",        baseAmount: 3,   rewardType: 'XP', rewardBase: 150 },
  { type: 'WIN_PVP', label: "Arena Novice",        baseAmount: 5,   rewardType: 'XP', rewardBase: 250 },
  { type: 'WIN_PVP', label: "The Challenger",      baseAmount: 8,   rewardType: 'XP', rewardBase: 400 },
  { type: 'WIN_PVP', label: "Winning Streak",      baseAmount: 6,   rewardType: 'XP', rewardBase: 300 },
  { type: 'WIN_PVP', label: "Dominance",           baseAmount: 10,  rewardType: 'XP', rewardBase: 500 },
  { type: 'WIN_PVP', label: "Unbeatable?",         baseAmount: 12,  rewardType: 'XP', rewardBase: 600 },
  { type: 'WIN_PVP', label: "Gladiator",           baseAmount: 15,  rewardType: 'XP', rewardBase: 750 },
  { type: 'WIN_PVP', label: "Arena Champion",      baseAmount: 20,  rewardType: 'XP', rewardBase: 1000 },
  { type: 'WIN_PVP', label: "Battle Hopper",       baseAmount: 4,   rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_PVP', label: "Warlord",             baseAmount: 25,  rewardType: 'XP', rewardBase: 1250 },
  { type: 'WIN_PVP', label: "Arena Legend",        baseAmount: 30,  rewardType: 'XP', rewardBase: 1500 },
  { type: 'WIN_PVP', label: "Blood and Sand",      baseAmount: 50,  rewardType: 'XP', rewardBase: 2500 },
  { type: 'WIN_PVP', label: "Honor the Victor",    baseAmount: 2,   rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP', label: "Tactician",           baseAmount: 7,   rewardType: 'XP', rewardBase: 350 },
  { type: 'WIN_PVP', label: "Strategist",          baseAmount: 9,   rewardType: 'XP', rewardBase: 450 },
  { type: 'WIN_PVP', label: "Berserker",           baseAmount: 18,  rewardType: 'XP', rewardBase: 900 },
  { type: 'WIN_PVP', label: "Eternal Glory",       baseAmount: 40,  rewardType: 'XP', rewardBase: 2000 },
  { type: 'WIN_PVP', label: "Titan Slayer",        baseAmount: 100, rewardType: 'XP', rewardBase: 5000 },

  // --- ELEMENTAL PVP (25) ---
  { type: 'WIN_FIRE',     label: "Fire Victory",      baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_WATER',    label: "Water Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_NATURE',   label: "Nature Victory",    baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_WIND',     label: "Wind Victory",      baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_EARTH',    label: "Earth Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ICE',      label: "Ice Victory",       baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ELECTRIC', label: "Electric Victory",  baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_LIGHT',    label: "Light Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_DARK',     label: "Dark Victory",      baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_GHOST',    label: "Ghost Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_MAGIC',    label: "Magic Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_PSYCHIC',  label: "Psychic Victory",   baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_FIGHTING', label: "Fighting Victory",  baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_METAL',    label: "Metal Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ROCK',     label: "Rock Victory",      baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_POISON',   label: "Poison Victory",    baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_DRAGON',   label: "Dragon Victory",    baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_FAIRY',    label: "Fairy Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_TECH',     label: "Tech Victory",      baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_SOUND',    label: "Sound Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_TIME',     label: "Time Victory",      baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_SPACE',    label: "Space Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_VOID',     label: "Void Victory",      baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_CHAOS',    label: "Chaos Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ORDER',    label: "Order Victory",     baseAmount: 2, rewardType: 'XP', rewardBase: 200 },

  // --- HATCH & BREED (30) ---
  { type: 'HATCH_EGG',  label: "New Life",            baseAmount: 1,  rewardType: 'XP', rewardBase: 100 },
  { type: 'HATCH_EGG',  label: "Twin Hatching",       baseAmount: 2,  rewardType: 'XP', rewardBase: 200 },
  { type: 'HATCH_EGG',  label: "Mini Zoo",            baseAmount: 3,  rewardType: 'XP', rewardBase: 300 },
  { type: 'HATCH_EGG',  label: "Incubator Test",      baseAmount: 5,  rewardType: 'XP', rewardBase: 500 },
  { type: 'HATCH_EGG',  label: "New Generation",      baseAmount: 10, rewardType: 'XP', rewardBase: 1000 },
  { type: 'BREED_PET',  label: "First Date",          baseAmount: 1,  rewardType: 'XP', rewardBase: 200 },
  { type: 'BREED_PET',  label: "Cupid",               baseAmount: 2,  rewardType: 'XP', rewardBase: 400 },
  { type: 'BREED_PET',  label: "Geneticist",          baseAmount: 3,  rewardType: 'XP', rewardBase: 600 },
  { type: 'BREED_PET',  label: "Breeding Program",    baseAmount: 5,  rewardType: 'XP', rewardBase: 1000 },
  { type: 'BREED_PET',  label: "Mendel's Legacy",     baseAmount: 10, rewardType: 'XP', rewardBase: 2000 },
  // Element Breeding
  { type: 'BREED_FIRE',   label: "Fire Breeding",     baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_WATER',  label: "Water Breeding",    baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_NATURE', label: "Nature Breeding",   baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_DRAGON', label: "Dragon Breeding",   baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_VOID',   label: "Void Breeding",     baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  // Rarity Hatch
  { type: 'HATCH_COMMON',    label: "Hatch Common",    baseAmount: 3, rewardType: 'XP', rewardBase: 150 },
  { type: 'HATCH_UNCOMMON',  label: "Hatch Uncommon",  baseAmount: 2, rewardType: 'XP', rewardBase: 250 },
  { type: 'HATCH_RARE',      label: "Hatch Rare",      baseAmount: 1, rewardType: 'XP', rewardBase: 400 },
  { type: 'HATCH_EPIC',      label: "Hatch Epic",      baseAmount: 1, rewardType: 'XP', rewardBase: 800 },
  { type: 'HATCH_LEGENDARY', label: "Hatch Legendary", baseAmount: 1, rewardType: 'XP', rewardBase: 2000 },

  // --- ECONOMY & LEVEL (27) ---
  { type: 'SPEND_COINS',  label: "Pocket Change",       baseAmount: 500,   rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS',  label: "Shopping Trip",       baseAmount: 1000,  rewardType: 'XP', rewardBase: 100 },
  { type: 'SPEND_COINS',  label: "Investor",            baseAmount: 2500,  rewardType: 'XP', rewardBase: 250 },
  { type: 'SPEND_COINS',  label: "Market Economy",      baseAmount: 5000,  rewardType: 'XP', rewardBase: 500 },
  { type: 'SPEND_COINS',  label: "Big Spender",         baseAmount: 10000, rewardType: 'XP', rewardBase: 1000 },
  { type: 'SPEND_COINS',  label: "Shopping Spree",      baseAmount: 20000, rewardType: 'XP', rewardBase: 2000 },
  { type: 'EARN_XP',      label: "Learning",            baseAmount: 100,   rewardType: 'XP', rewardBase: 20 },
  { type: 'EARN_XP',      label: "Training",            baseAmount: 500,   rewardType: 'XP', rewardBase: 100 },
  { type: 'EARN_XP',      label: "Progress",            baseAmount: 1000,  rewardType: 'XP', rewardBase: 200 },
  { type: 'EARN_XP',      label: "Knowledge is Power",  baseAmount: 5000,  rewardType: 'XP', rewardBase: 1000 },
  { type: 'LEVEL_UP_PET', label: "Level Up",            baseAmount: 1,     rewardType: 'XP', rewardBase: 100 },
  { type: 'LEVEL_UP_PET', label: "Power Leveling",      baseAmount: 3,     rewardType: 'XP', rewardBase: 300 },
  { type: 'LEVEL_UP_PET', label: "Trainer",             baseAmount: 5,     rewardType: 'XP', rewardBase: 500 },
  { type: 'LEVEL_UP_PET', label: "Master",              baseAmount: 10,    rewardType: 'XP', rewardBase: 1000 },

  // Fillers to reach 100
  { type: 'WIN_PVP',       label: "Quick Victory",       baseAmount: 1,   rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS',   label: "Coin Collector",      baseAmount: 100, rewardType: 'XP', rewardBase: 10 },
  { type: 'EARN_XP',       label: "Experience",          baseAmount: 50,  rewardType: 'XP', rewardBase: 10 },
  { type: 'HATCH_EGG',     label: "Egg Timer",           baseAmount: 1,   rewardType: 'XP', rewardBase: 50 },
  { type: 'BREED_PET',     label: "Breeding Attempt",    baseAmount: 1,   rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP',       label: "Arena Fight",         baseAmount: 1,   rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS',   label: "Expenses",            baseAmount: 250, rewardType: 'XP', rewardBase: 25 },
  { type: 'EARN_XP',       label: "Study",               baseAmount: 200, rewardType: 'XP', rewardBase: 40 },
  { type: 'LEVEL_UP_PET',  label: "Ascent",              baseAmount: 1,   rewardType: 'XP', rewardBase: 50 },
  { type: 'HATCH_EGG',     label: "Hatching",            baseAmount: 1,   rewardType: 'XP', rewardBase: 50 },
  { type: 'BREED_PET',     label: "Pairing",             baseAmount: 1,   rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP',       label: "Duel",                baseAmount: 1,   rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS',   label: "Investment",          baseAmount: 300, rewardType: 'XP', rewardBase: 30 },
  { type: 'COMPLETE_DAILY_SET', label: "Diligent",       baseAmount: 1,   rewardType: 'GEMS', rewardBase: 5 },

  // --- SEASON 1: BATTLE-FOCUSED (5) ---
  { type: 'WIN_TECH',   label: "Tech Hunter",        baseAmount: 3, rewardType: 'XP', rewardBase: 250 },
  { type: 'WIN_VOID',   label: "Conquer the Void",   baseAmount: 2, rewardType: 'XP', rewardBase: 300 },
  { type: 'WIN_CHAOS',  label: "Defeat Chaos",       baseAmount: 2, rewardType: 'XP', rewardBase: 300 },
  { type: 'WIN_TIME',   label: "Overcome Time",      baseAmount: 3, rewardType: 'XP', rewardBase: 250 },
  { type: 'WIN_DIVINE', label: "Divine Trial",       baseAmount: 1, rewardType: 'XP', rewardBase: 500 },

  // --- SEASON 1: BREEDING-FOCUSED (5) ---
  { type: 'HATCH_EGG',  label: "Twin Hatch",         baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'BREED_PET',  label: "Rare Pairing",       baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'HATCH_RARE', label: "Hatch a Rarity",     baseAmount: 1, rewardType: 'XP', rewardBase: 600 },
  { type: 'BREED_TECH', label: "Cyborg Breeding",    baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_VOID', label: "Void Breeder",       baseAmount: 1, rewardType: 'XP', rewardBase: 350 },

  // --- SEASON 1: VILLAGE-FOCUSED (7) ---
  { type: 'COLLECT_RESOURCE', label: "Resource Collector",  baseAmount: 5,    rewardType: 'XP', rewardBase: 100 },
  { type: 'COLLECT_RESOURCE', label: "Busy Hands",          baseAmount: 10,   rewardType: 'XP', rewardBase: 200 },
  { type: 'COLLECT_RESOURCE', label: "Village Harvest",     baseAmount: 20,   rewardType: 'XP', rewardBase: 350 },
  { type: 'UPGRADE_BUILDING', label: "Builder",             baseAmount: 1,    rewardType: 'XP', rewardBase: 400 },
  { type: 'UPGRADE_BUILDING', label: "Village Development", baseAmount: 2,    rewardType: 'XP', rewardBase: 700 },
  { type: 'SPEND_COINS',      label: "Market Investment",   baseAmount: 2000, rewardType: 'XP', rewardBase: 200 },
  { type: 'EARN_XP',          label: "Extended Training",   baseAmount: 2000, rewardType: 'XP', rewardBase: 400 },

  // --- SEASON 1: SOCIAL (3) ---
  { type: 'CHALLENGE_FRIEND', label: "Friendly Duel",      baseAmount: 1, rewardType: 'XP', rewardBase: 200 },
  { type: 'CHALLENGE_FRIEND', label: "Friend Challenge",   baseAmount: 3, rewardType: 'XP', rewardBase: 450 },
  { type: 'WIN_PVP',          label: "Rival Slayer",       baseAmount: 3, rewardType: 'XP', rewardBase: 250 },
];

export const COMPOSITE_QUEST_REWARDS = {
    DAILY:   { rewardType: 'GEMS',    rewardAmount: 10, label: "Daily Bonus" },
    WEEKLY:  { rewardType: 'COINS',   rewardAmount: 7500, label: "Weekly Bonus" },
    MONTHLY: { rewardType: 'LOOTBOX', rewardAmount: 1, variant: 'TYPE_DAILY', label: "Monthly Chest" }
};
