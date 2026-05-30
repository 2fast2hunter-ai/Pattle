export const CONSUMABLES = {
    XP_POTION_SMALL: { 
        id: 'XP_POTION_SMALL', 
        label: 'XP Potion (Small)',
        value: 50,
        rarity: 'COMMON',
        desc: 'Gives a pet 50 experience.',
        color: 'text-blue-400',
        bg: 'bg-blue-500'
    },
    XP_POTION_MEDIUM: { 
        id: 'XP_POTION_MEDIUM', 
        label: 'XP Potion (Medium)',
        value: 100,
        rarity: 'RARE',
        desc: 'Gives a pet 100 experience.',
        color: 'text-purple-400',
        bg: 'bg-purple-500'
    },
    XP_POTION_LARGE: { 
        id: 'XP_POTION_LARGE', 
        label: 'XP Potion (Large)',
        value: 150,
        rarity: 'LEGENDARY',
        desc: 'Gives a pet 150 experience.',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500'
    },
    // SHINY FLASCHE (Bleibt unverändert)
    SHINY_POTION: {
        id: 'SHINY_POTION',
        label: 'Shiny Potion',
        value: 0, 
        rarity: 'MYTHIC',
        desc: 'Macht ein Pet SHINY! Alle Stats +1, HP +10.',
        color: 'text-cyan-300',
        bg: 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500' 
    }
};