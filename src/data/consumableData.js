export const CONSUMABLES = {
    XP_POTION_SMALL: { 
        id: 'XP_POTION_SMALL', 
        label: 'Kleine XP-Flasche', 
        value: 50, 
        rarity: 'COMMON', 
        desc: 'Gibt einem Pet 50 Erfahrung.',
        color: 'text-blue-400',
        bg: 'bg-blue-500'
    },
    XP_POTION_MEDIUM: { 
        id: 'XP_POTION_MEDIUM', 
        label: 'Mittlere XP-Flasche', 
        value: 100, 
        rarity: 'RARE', 
        desc: 'Gibt einem Pet 100 Erfahrung.',
        color: 'text-purple-400',
        bg: 'bg-purple-500'
    },
    XP_POTION_LARGE: { 
        id: 'XP_POTION_LARGE', 
        label: 'Große XP-Flasche', 
        value: 150, 
        rarity: 'LEGENDARY', 
        desc: 'Gibt einem Pet 150 Erfahrung.',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500'
    },
    // SHINY FLASCHE (Bleibt unverändert)
    SHINY_POTION: {
        id: 'SHINY_POTION',
        label: 'Shiny-Elixier',
        value: 0, 
        rarity: 'MYTHIC',
        desc: 'Macht ein Pet SHINY! Alle Stats +1, HP +10.',
        color: 'text-cyan-300',
        bg: 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500' 
    }
};