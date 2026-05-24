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

// --- ALLE 100 QUEST TEMPLATES (NUR XP BELOHNUNGEN) ---
export const QUEST_TEMPLATES = [
  // --- PVP (WIN_PVP) ---
  { type: 'WIN_PVP', label: "Gewinne Kämpfe", baseAmount: 3, rewardType: 'XP', rewardBase: 150 },
  { type: 'WIN_PVP', label: "Arena Novize", baseAmount: 5, rewardType: 'XP', rewardBase: 250 },
  { type: 'WIN_PVP', label: "Der Herausforderer", baseAmount: 8, rewardType: 'XP', rewardBase: 400 },
  { type: 'WIN_PVP', label: "Siegeszug", baseAmount: 6, rewardType: 'XP', rewardBase: 300 },
  { type: 'WIN_PVP', label: "Dominanz", baseAmount: 10, rewardType: 'XP', rewardBase: 500 },
  { type: 'WIN_PVP', label: "Unbesiegbar?", baseAmount: 12, rewardType: 'XP', rewardBase: 600 },
  { type: 'WIN_PVP', label: "Gladiator", baseAmount: 15, rewardType: 'XP', rewardBase: 750 },
  { type: 'WIN_PVP', label: "Arena Champion", baseAmount: 20, rewardType: 'XP', rewardBase: 1000 },
  { type: 'WIN_PVP', label: "Schlachtenbummler", baseAmount: 4, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_PVP', label: "Kriegsfürst", baseAmount: 25, rewardType: 'XP', rewardBase: 1250 },
  { type: 'WIN_PVP', label: "Legende der Arena", baseAmount: 30, rewardType: 'XP', rewardBase: 1500 },
  { type: 'WIN_PVP', label: "Blut und Sand", baseAmount: 50, rewardType: 'XP', rewardBase: 2500 },
  { type: 'WIN_PVP', label: "Ehre dem Sieger", baseAmount: 2, rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP', label: "Taktiker", baseAmount: 7, rewardType: 'XP', rewardBase: 350 },
  { type: 'WIN_PVP', label: "Stratege", baseAmount: 9, rewardType: 'XP', rewardBase: 450 },
  { type: 'WIN_PVP', label: "Berserker", baseAmount: 18, rewardType: 'XP', rewardBase: 900 },
  { type: 'WIN_PVP', label: "Ewiger Ruhm", baseAmount: 40, rewardType: 'XP', rewardBase: 2000 },
  { type: 'WIN_PVP', label: "Titanen-Bezwinger", baseAmount: 100, rewardType: 'XP', rewardBase: 5000 },

  // --- ELEMENTAR-PVP (25) ---
  { type: 'WIN_FIRE', label: "Feuer-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_WATER', label: "Wasser-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_NATURE', label: "Natur-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_WIND', label: "Wind-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_EARTH', label: "Erd-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ICE', label: "Eis-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ELECTRIC', label: "Elektro-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_LIGHT', label: "Licht-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_DARK', label: "Dunkel-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_GHOST', label: "Geister-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_MAGIC', label: "Magie-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_PSYCHIC', label: "Psycho-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_FIGHTING', label: "Kampf-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_METAL', label: "Metall-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ROCK', label: "Gestein-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_POISON', label: "Gift-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_DRAGON', label: "Drachen-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_FAIRY', label: "Feen-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_TECH', label: "Tech-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_SOUND', label: "Schall-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_TIME', label: "Zeit-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_SPACE', label: "Raum-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_VOID', label: "Leere-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_CHAOS', label: "Chaos-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ORDER', label: "Ordnung-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },

  // --- HATCH & BREED (30) ---
  { type: 'HATCH_EGG', label: "Neues Leben", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'HATCH_EGG', label: "Zwillings-Schlüpfen", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'HATCH_EGG', label: "Kleiner Zoo", baseAmount: 3, rewardType: 'XP', rewardBase: 300 },
  { type: 'HATCH_EGG', label: "Inkubator-Test", baseAmount: 5, rewardType: 'XP', rewardBase: 500 },
  { type: 'HATCH_EGG', label: "Nachwuchs", baseAmount: 10, rewardType: 'XP', rewardBase: 1000 },
  { type: 'BREED_PET', label: "Erstes Date", baseAmount: 1, rewardType: 'XP', rewardBase: 200 },
  { type: 'BREED_PET', label: "Liebesbote", baseAmount: 2, rewardType: 'XP', rewardBase: 400 },
  { type: 'BREED_PET', label: "Genetiker", baseAmount: 3, rewardType: 'XP', rewardBase: 600 },
  { type: 'BREED_PET', label: "Zuchtprogramm", baseAmount: 5, rewardType: 'XP', rewardBase: 1000 },
  { type: 'BREED_PET', label: "Mendels Erbe", baseAmount: 10, rewardType: 'XP', rewardBase: 2000 },
  // Element-Zucht
  { type: 'BREED_FIRE', label: "Feuer-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_WATER', label: "Wasser-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_NATURE', label: "Natur-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_DRAGON', label: "Drachen-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_VOID', label: "Leere-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  // Rarity-Hatch
  { type: 'HATCH_COMMON', label: "Hatch Common", baseAmount: 3, rewardType: 'XP', rewardBase: 150 },
  { type: 'HATCH_UNCOMMON', label: "Hatch Uncommon", baseAmount: 2, rewardType: 'XP', rewardBase: 250 },
  { type: 'HATCH_RARE', label: "Hatch Rare", baseAmount: 1, rewardType: 'XP', rewardBase: 400 },
  { type: 'HATCH_EPIC', label: "Hatch Epic", baseAmount: 1, rewardType: 'XP', rewardBase: 800 },
  { type: 'HATCH_LEGENDARY', label: "Hatch Legendary", baseAmount: 1, rewardType: 'XP', rewardBase: 2000 },

  // --- ECONOMY & LEVEL (27) ---
  { type: 'SPEND_COINS', label: "Kleingeld", baseAmount: 500, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Shopping Trip", baseAmount: 1000, rewardType: 'XP', rewardBase: 100 },
  { type: 'SPEND_COINS', label: "Investor", baseAmount: 2500, rewardType: 'XP', rewardBase: 250 },
  { type: 'SPEND_COINS', label: "Marktwirtschaft", baseAmount: 5000, rewardType: 'XP', rewardBase: 500 },
  { type: 'SPEND_COINS', label: "Big Spender", baseAmount: 10000, rewardType: 'XP', rewardBase: 1000 },
  { type: 'SPEND_COINS', label: "Kaufrausch", baseAmount: 20000, rewardType: 'XP', rewardBase: 2000 },
  { type: 'EARN_XP', label: "Lernen", baseAmount: 100, rewardType: 'XP', rewardBase: 20 }, // Bonus
  { type: 'EARN_XP', label: "Training", baseAmount: 500, rewardType: 'XP', rewardBase: 100 },
  { type: 'EARN_XP', label: "Fortschritt", baseAmount: 1000, rewardType: 'XP', rewardBase: 200 },
  { type: 'EARN_XP', label: "Wissen ist Macht", baseAmount: 5000, rewardType: 'XP', rewardBase: 1000 },
  { type: 'LEVEL_UP_PET', label: "Level Up", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'LEVEL_UP_PET', label: "Power Leveling", baseAmount: 3, rewardType: 'XP', rewardBase: 300 },
  { type: 'LEVEL_UP_PET', label: "Trainer", baseAmount: 5, rewardType: 'XP', rewardBase: 500 },
  { type: 'LEVEL_UP_PET', label: "Meister", baseAmount: 10, rewardType: 'XP', rewardBase: 1000 },
  
  // Fillers to reach 100 (Beispiele)
  { type: 'WIN_PVP', label: "Schneller Sieg", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Münzsammler", baseAmount: 100, rewardType: 'XP', rewardBase: 10 },
  { type: 'EARN_XP', label: "Erfahrung", baseAmount: 50, rewardType: 'XP', rewardBase: 10 },
  { type: 'HATCH_EGG', label: "Eieruhr", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'BREED_PET', label: "Zucht-Versuch", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP', label: "Arena-Kampf", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Ausgaben", baseAmount: 250, rewardType: 'XP', rewardBase: 25 },
  { type: 'EARN_XP', label: "Studium", baseAmount: 200, rewardType: 'XP', rewardBase: 40 },
  { type: 'LEVEL_UP_PET', label: "Aufstieg", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'HATCH_EGG', label: "Schlüpfen", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'BREED_PET', label: "Paarung", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP', label: "Duell", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Investition", baseAmount: 300, rewardType: 'XP', rewardBase: 30 },
  { type: 'COMPLETE_DAILY_SET', label: "Pflichtbewusst", baseAmount: 1, rewardType: 'GEMS', rewardBase: 5 },

  // --- SEASON 1: BATTLE-FOCUSED (5) ---
  { type: 'WIN_TECH',   label: "Tech-Jäger",        baseAmount: 3, rewardType: 'XP', rewardBase: 250 },
  { type: 'WIN_VOID',   label: "Leere bezwingen",    baseAmount: 2, rewardType: 'XP', rewardBase: 300 },
  { type: 'WIN_CHAOS',  label: "Chaos besiegen",     baseAmount: 2, rewardType: 'XP', rewardBase: 300 },
  { type: 'WIN_TIME',   label: "Zeit überwinden",    baseAmount: 3, rewardType: 'XP', rewardBase: 250 },
  { type: 'WIN_DIVINE', label: "Göttliche Prüfung",  baseAmount: 1, rewardType: 'XP', rewardBase: 500 },

  // --- SEASON 1: BREEDING-FOCUSED (5) ---
  { type: 'HATCH_EGG',  label: "Zwillingsschlüpfen", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'BREED_PET',  label: "Seltene Paarung",    baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'HATCH_RARE', label: "Seltenheit schlüpfen",baseAmount: 1, rewardType: 'XP', rewardBase: 600 },
  { type: 'BREED_TECH', label: "Cyborg-Zucht",        baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_VOID', label: "Leere-Züchter",       baseAmount: 1, rewardType: 'XP', rewardBase: 350 },

  // --- SEASON 1: VILLAGE-FOCUSED (7) ---
  { type: 'COLLECT_RESOURCE', label: "Rohstoff-Sammler",  baseAmount: 5,  rewardType: 'XP', rewardBase: 100 },
  { type: 'COLLECT_RESOURCE', label: "Fleißige Hände",    baseAmount: 10, rewardType: 'XP', rewardBase: 200 },
  { type: 'COLLECT_RESOURCE', label: "Dorf-Ernte",        baseAmount: 20, rewardType: 'XP', rewardBase: 350 },
  { type: 'UPGRADE_BUILDING', label: "Baumeister",        baseAmount: 1,  rewardType: 'XP', rewardBase: 400 },
  { type: 'UPGRADE_BUILDING', label: "Dorfentwicklung",   baseAmount: 2,  rewardType: 'XP', rewardBase: 700 },
  { type: 'SPEND_COINS',      label: "Markt-Investition", baseAmount: 2000, rewardType: 'XP', rewardBase: 200 },
  { type: 'EARN_XP',          label: "Mehrstunden-Training", baseAmount: 2000, rewardType: 'XP', rewardBase: 400 },

  // --- SEASON 1: SOCIAL (3) ---
  { type: 'CHALLENGE_FRIEND', label: "Freundschafts-Duell",       baseAmount: 1, rewardType: 'XP', rewardBase: 200 },
  { type: 'CHALLENGE_FRIEND', label: "Freundes-Herausforderung",  baseAmount: 3, rewardType: 'XP', rewardBase: 450 },
  { type: 'WIN_PVP',          label: "Rivalen-Bezwinger",         baseAmount: 3, rewardType: 'XP', rewardBase: 250 },
];

export const COMPOSITE_QUEST_REWARDS = {
    DAILY: { rewardType: 'GEMS', rewardAmount: 10, label: "Tages-Bonus" },
    WEEKLY: { rewardType: 'COINS', rewardAmount: 7500, label: "Wochen-Bonus" },
    MONTHLY: { rewardType: 'LOOTBOX', rewardAmount: 1, variant: 'TYPE_DAILY', label: "Monats-Truhe" }
};