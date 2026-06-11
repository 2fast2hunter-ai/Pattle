// src/data/villageEvents.js

export const VILLAGE_EVENT_TYPES = {
    STORM: {
        id: 'STORM',
        label: 'Sturm',
        labelEn: 'Storm',
        description: 'Ein heftiger Sturm trifft das Dorf! Produktion -30% für 2 Stunden.',
        descriptionEn: 'A fierce storm hits the village! Production -30% for 2 hours.',
        icon: '⛈️',
        durationMs: 2 * 60 * 60 * 1000,
        effect: { type: 'GLOBAL_PROD', value: 0.7 },
        canDismissWithAd: true,
        weight: 15,
        negative: true,
        colorBg: 'bg-slate-700/40',
        colorBorder: 'border-slate-500/40',
        colorText: 'text-slate-300',
        colorIcon: 'bg-slate-600',
    },
    MERCHANT: {
        id: 'MERCHANT',
        label: 'Händler-Besuch',
        labelEn: 'Merchant Visit',
        description: 'Ein seltener Händler ist im Dorf! Spezielle Items für 1 Stunde verfügbar.',
        descriptionEn: 'A rare merchant has arrived! Special items available for 1 hour.',
        icon: '🧙',
        durationMs: 1 * 60 * 60 * 1000,
        effect: { type: 'MERCHANT_ACTIVE' },
        canDismissWithAd: false,
        weight: 10,
        negative: false,
        colorBg: 'bg-yellow-900/30',
        colorBorder: 'border-yellow-500/40',
        colorText: 'text-yellow-300',
        colorIcon: 'bg-yellow-700',
    },
    FESTIVAL: {
        id: 'FESTIVAL',
        label: 'Dorffest',
        labelEn: 'Village Festival',
        description: 'Das Dorf feiert! Ressourcenproduktion ×2 für 4 Stunden.',
        descriptionEn: 'The village celebrates! Resource production ×2 for 4 hours.',
        icon: '🎉',
        durationMs: 4 * 60 * 60 * 1000,
        effect: { type: 'GLOBAL_PROD', value: 2.0 },
        canDismissWithAd: false,
        weight: 8,
        negative: false,
        colorBg: 'bg-amber-900/30',
        colorBorder: 'border-amber-500/40',
        colorText: 'text-amber-300',
        colorIcon: 'bg-amber-700',
    },
    HARVEST_BONUS: {
        id: 'HARVEST_BONUS',
        label: 'Ernte-Bonus',
        labelEn: 'Harvest Bonus',
        description: 'Kräuter & Kristalle produzieren +50% für 3 Stunden.',
        descriptionEn: 'Herbs & Crystals production +50% for 3 hours.',
        icon: '🌿',
        durationMs: 3 * 60 * 60 * 1000,
        effect: { type: 'RESOURCE_BONUS', resources: ['herb_garden', 'crystal_field'], value: 1.5 },
        canDismissWithAd: false,
        weight: 12,
        negative: false,
        colorBg: 'bg-emerald-900/30',
        colorBorder: 'border-emerald-500/40',
        colorText: 'text-emerald-300',
        colorIcon: 'bg-emerald-700',
    },
};

export const MERCHANT_OFFERS = [
    {
        id: 'merchant_xp_medium',
        label: 'XP Trank (Mittel)',
        labelEn: 'XP Potion (Medium)',
        costItem: 'stone_iron',
        costAmount: 5,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_MEDIUM', amount: 1 }
    },
    {
        id: 'merchant_ad_ticket',
        label: 'Produktions-Ticket',
        labelEn: 'Production Ticket',
        costItem: 'wood_beech',
        costAmount: 3,
        reward: { type: 'AD_TICKET', amount: 1 }
    },
    {
        id: 'merchant_breed_ticket',
        label: 'Zucht-Ticket',
        labelEn: 'Breed Ticket',
        costItem: 'stardust_crystal',
        costAmount: 10,
        reward: { type: 'ITEM', itemType: 'TICKET', itemVariant: 'BREED', amount: 1 }
    },
    {
        id: 'merchant_xp_large',
        label: 'XP Trank (Groß)',
        labelEn: 'XP Potion (Large)',
        costItem: 'seafood_pearl',
        costAmount: 3,
        reward: { type: 'CONSUMABLE', variant: 'XP_POTION_LARGE', amount: 1 }
    },
    {
        id: 'merchant_shiny_potion',
        label: 'Shiny Trank',
        labelEn: 'Shiny Potion',
        costItem: 'stone_diamond',
        costAmount: 2,
        reward: { type: 'CONSUMABLE', variant: 'SHINY_POTION', amount: 1 }
    },
];

// Minimum time between event trigger checks (30 min)
export const EVENT_CHECK_COOLDOWN_MS = 30 * 60 * 1000;

export const getActiveVillageEvents = (user) => {
    const now = Date.now();
    return (user?.village?.activeEvents || []).filter(e => !e.dismissed && e.expiresAt > now);
};
