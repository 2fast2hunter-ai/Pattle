export const LOOTBOXES = {
    DAILY: {
        id: 'DAILY',
        label: 'Daily Box',
        cost: 0,
        currency: 'COINS',
        drops: {
            EPIC: 1.52,
            RARE: 10.10,
            UNCOMMON: 20.20,
            COMMON: 68.16
        }
    },
    PREMIUM: {
        id: 'PREMIUM',
        label: 'Premium Box',
        cost: 2500,
        currency: 'COINS',
        drops: {
            LEGENDARY: 0.50,
            EPIC: 2.00,
            RARE: 5.00,
            UNCOMMON: 20.00,
            COMMON: 72.50
        }
    },
    MASTER: {
        id: 'MASTER',
        label: 'Meister Box',
        cost: 15000,
        currency: 'COINS',
        drops: {
            TRANSCENDENT: 0.01,
            COSMIC: 0.05,
            ANCIENT: 0.10,
            DIVINE: 0.25,
            MYTHIC: 0.60,
            LEGENDARY: 2.50,
            EPIC: 8.00,
            RARE: 15.00,
            UNCOMMON: 40.00,
            COMMON: 23.49
        }
    },
    DIVINE: {
        id: 'DIVINE',
        label: 'Göttliche Box',
        cost: 50000,
        currency: 'COINS',
        drops: {
            TRANSCENDENT: 0.24,
            COSMIC: 1.22,
            ANCIENT: 3.68,
            DIVINE: 5.25,
            MYTHIC: 10.80,
            LEGENDARY: 20.60,
            EPIC: 58.66
        }
    }
};

export const SHOP_ITEMS = {
    TICKET_BUNDLE_COINS: { costCurrency: 'COINS', costAmount: 500, tickets: 1, label: "1 Zucht-Ticket" },
    TICKET_BUNDLE_GEMS: { costCurrency: 'GEMS', costAmount: 10, tickets: 5, label: "5 Zucht-Tickets" },
   AD_REWARD: { rewardType: 'GEMS', rewardAmount: 5, label: "5 Edelsteine" }
};

// --- NEU: AD REWARDS DEFINITION ---
export const AD_REWARDS = [
    { id: 'GEMS_5', type: 'GEMS', amount: 5, label: '5 Edelsteine', probability: 25 },
    { id: 'COINS_500', type: 'COINS', amount: 500, label: '500 Münzen', probability: 25 },
    { id: 'BUFF_COINS', type: 'BUFF', buffType: 'COIN_BOOST', amount: 10, label: '2x Münzen (10 Kämpfe)', probability: 25 },
    { id: 'BUFF_XP', type: 'BUFF', buffType: 'XP_BOOST', amount: 10, label: '2x XP (10 Kämpfe)', probability: 25 }
];