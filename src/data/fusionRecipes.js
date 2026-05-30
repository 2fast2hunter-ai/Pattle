// Fusion recipes: element combos that produce specific hybrid species.
// Key format: "TYPE_A+TYPE_B" (always sorted alphabetically so order doesn't matter).
// Secret recipes have isSecret: true — revealed only after the hybrid is hatched.

const makeKey = (a, b) => [a, b].sort().join('+');

export const FUSION_RECIPES = {
    // --- Standard Hybrids ---
    [makeKey('FIRE', 'WATER')]:    { resultType: 'STEAM',    species: 'STEAM_SERPENT',   label: 'Steam Serpent',   rarity: 'EPIC',      isSecret: false },
    [makeKey('FIRE', 'NATURE')]:   { resultType: 'FIRE',     species: 'FIRE_TREANT',     label: 'Fire Treant',     rarity: 'RARE',      isSecret: false },
    [makeKey('FIRE', 'ICE')]:      { resultType: 'FIRE',     species: 'BLAZE_YETI',      label: 'Ember Yeti',      rarity: 'EPIC',      isSecret: false },
    [makeKey('FIRE', 'DRAGON')]:   { resultType: 'DRAGON',   species: 'DRAGON_RED',      label: 'Inferno Drake',   rarity: 'LEGENDARY', isSecret: false },
    [makeKey('WATER', 'ELECTRIC')]:{ resultType: 'ELECTRIC', species: 'ELECTRIC_EEL',    label: 'Storm Eel',       rarity: 'RARE',      isSecret: false },
    [makeKey('WATER', 'ICE')]:     { resultType: 'ICE',      species: 'ICE_SEAL',        label: 'Frost Seal',      rarity: 'UNCOMMON',  isSecret: false },
    [makeKey('WATER', 'POISON')]:  { resultType: 'POISON',   species: 'POISON_STONEFISH',label: 'Poison Puffer',   rarity: 'RARE',      isSecret: false },
    [makeKey('NATURE', 'EARTH')]:  { resultType: 'NATURE',   species: 'NATURE_BEAR',     label: 'Moss Bear',       rarity: 'UNCOMMON',  isSecret: false },
    [makeKey('NATURE', 'POISON')]: { resultType: 'POISON',   species: 'POISON_FROG',     label: 'Poison Toad',     rarity: 'RARE',      isSecret: false },
    [makeKey('NATURE', 'FAIRY')]:  { resultType: 'FAIRY',    species: 'FAIRY_GNOME',     label: 'Forest Gnome',    rarity: 'RARE',      isSecret: false },
    [makeKey('LIGHT', 'DARK')]:    { resultType: 'MAGIC',    species: 'MAGIC_UNICORN',   label: 'Shadow Horn',     rarity: 'LEGENDARY', isSecret: false },
    [makeKey('ELECTRIC', 'WIND')]: { resultType: 'ELECTRIC', species: 'ELECTRIC_THUNDERBIRD', label: 'Thunderbird', rarity: 'EPIC',   isSecret: false },
    [makeKey('EARTH', 'ROCK')]:    { resultType: 'ROCK',     species: 'ROCK_GOLEM',      label: 'Stone Golem',     rarity: 'RARE',      isSecret: false },
    [makeKey('GHOST', 'DARK')]:    { resultType: 'GHOST',    species: 'GHOST_LION',      label: 'Shadow Lion',     rarity: 'EPIC',      isSecret: false },
    [makeKey('PSYCHIC', 'MAGIC')]: { resultType: 'PSYCHIC',  species: 'PSYCHIC_FLAMINGO',label: 'Phantom Flamingo',rarity: 'RARE',      isSecret: false },
    [makeKey('FIGHTING', 'METAL')]:{ resultType: 'METAL',    species: 'METAL_SCORPION',  label: 'Steel Scorpion',  rarity: 'RARE',      isSecret: false },
    [makeKey('DRAGON', 'METAL')]:  { resultType: 'DRAGON',   species: 'METAL_DRAGON',    label: 'Iron Drake',      rarity: 'LEGENDARY', isSecret: false },
    [makeKey('DRAGON', 'LIGHT')]:  { resultType: 'DRAGON',   species: 'LIGHT_DRAGON',    label: 'Light Dragon',    rarity: 'LEGENDARY', isSecret: false },
    [makeKey('DRAGON', 'DARK')]:   { resultType: 'DRAGON',   species: 'DARK_DRAGON',     label: 'Dark Dragon',     rarity: 'LEGENDARY', isSecret: false },
    [makeKey('TIME', 'SPACE')]:    { resultType: 'SPACE',    species: 'SPACE_PLANET',    label: 'Chrono Planet',   rarity: 'MYTHIC',    isSecret: false },
    [makeKey('VOID', 'CHAOS')]:    { resultType: 'CHAOS',    species: 'CHAOS_DEVIL',     label: 'Void Chaos',      rarity: 'MYTHIC',    isSecret: false },
    [makeKey('ORDER', 'LIGHT')]:   { resultType: 'ORDER',    species: 'ORDER_ANGEL',     label: 'Pure Order',      rarity: 'MYTHIC',    isSecret: false },
    [makeKey('TECH', 'ELECTRIC')]: { resultType: 'TECH',     species: 'TECH_ROBOT',      label: 'Volt Robot',      rarity: 'EPIC',      isSecret: false },
    [makeKey('TECH', 'METAL')]:    { resultType: 'TECH',     species: 'TECH_MOUSE',      label: 'Nano Mouse',      rarity: 'RARE',      isSecret: false },
    [makeKey('SOUND', 'WIND')]:    { resultType: 'SOUND',    species: 'SOUND_OWL',       label: 'Sonic Owl',       rarity: 'RARE',      isSecret: false },
    [makeKey('FAIRY', 'MAGIC')]:   { resultType: 'FAIRY',    species: 'FAIRY_QUEEN',     label: 'Fairy Queen',     rarity: 'EPIC',      isSecret: false },
    [makeKey('ICE', 'WIND')]:      { resultType: 'ICE',      species: 'ICE_YETI',        label: 'Storm Yeti',      rarity: 'RARE',      isSecret: false },
    [makeKey('POISON', 'DARK')]:   { resultType: 'POISON',   species: 'POISON_SNAKE',    label: 'Shadow Viper',    rarity: 'RARE',      isSecret: false },

    // --- Secret Hybrids (easter eggs) ---
    [makeKey('FIRE', 'ELECTRIC')]: { resultType: 'CHAOS',    species: 'CHAOS_DEVIL',     label: '???',             rarity: 'MYTHIC',    isSecret: true },
    [makeKey('WATER', 'EARTH')]:   { resultType: 'NATURE',   species: 'NATURE_SLOTH',    label: '???',             rarity: 'MYTHIC',    isSecret: true },
    [makeKey('LIGHT', 'VOID')]:    { resultType: 'ORDER',    species: 'ORDER_YING',      label: '???',             rarity: 'ANCIENT',   isSecret: true },
    [makeKey('DARK', 'VOID')]:     { resultType: 'VOID',     species: 'VOID_DRAGON',     label: '???',             rarity: 'ANCIENT',   isSecret: true },
    [makeKey('TIME', 'VOID')]:     { resultType: 'SPACE',    species: 'SPACE_RAINBOW',   label: '???',             rarity: 'COSMIC',    isSecret: true },
    [makeKey('CHAOS', 'ORDER')]:   { resultType: 'SPACE',    species: 'SPACE_ALIEN',     label: '???',             rarity: 'TRANSCENDENT', isSecret: true },
    [makeKey('DRAGON', 'VOID')]:   { resultType: 'VOID',     species: 'VOID_DRAGON',     label: '???',             rarity: 'COSMIC',    isSecret: true },
    [makeKey('FIRE', 'SPACE')]:    { resultType: 'SPACE',    species: 'SPACE_COMET',     label: '???',             rarity: 'ANCIENT',   isSecret: true },
    [makeKey('MAGIC', 'TIME')]:    { resultType: 'TIME',     species: 'TIME_CORAL',      label: '???',             rarity: 'MYTHIC',    isSecret: true },
};

export function getFusionRecipe(typeA, typeB) {
    return FUSION_RECIPES[makeKey(typeA, typeB)] || null;
}

export function isFusionPair(typeA, typeB) {
    return !!getFusionRecipe(typeA, typeB);
}
