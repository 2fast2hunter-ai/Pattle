const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
    admin.initializeApp();
}

// --- KONFIGURATION ---
const LOOTBOX_ODDS = {
    DAILY: { COMMON: 68.18, UNCOMMON: 20.20, RARE: 10.10, EPIC: 1.52 },
    PREMIUM: { COMMON: 72.50, UNCOMMON: 20.00, RARE: 5.00, EPIC: 2.00, LEGENDARY: 0.50 },
    MASTER: { COMMON: 28.49, UNCOMMON: 45.00, RARE: 15.00, EPIC: 8.00, LEGENDARY: 2.50, MYTHIC: 0.60, DIVINE: 0.25, ANCIENT: 0.10, COSMIC: 0.05, TRANSCENDENT: 0.01 },
    TYPE_DAILY: { COMMON: 28.49, UNCOMMON: 45.00, RARE: 15.00, EPIC: 8.00, LEGENDARY: 2.50, MYTHIC: 0.60, DIVINE: 0.25, ANCIENT: 0.10, COSMIC: 0.05, TRANSCENDENT: 0.01 },
    DIVINE: { EPIC: 58.21, LEGENDARY: 20.60, MYTHIC: 10.80, DIVINE: 5.25, ANCIENT: 3.68, COSMIC: 1.22, TRANSCENDENT: 0.24 },
    STARTER: { UNCOMMON: 100 },
    DEFAULT: { COMMON: 50, UNCOMMON: 30, RARE: 15, EPIC: 5 }
};

const TYPES = [
    'FIRE', 'WATER', 'NATURE', 'WIND', 'EARTH', 'ELECTRIC', 'ICE', 'LIGHT', 'DARK',
    'GHOST', 'MAGIC', 'PSYCHIC', 'FIGHTING', 'METAL', 'ROCK', 'POISON', 'DRAGON',
    'FAIRY', 'TECH', 'SOUND', 'TIME', 'SPACE', 'VOID', 'CHAOS', 'ORDER'
];

const SPECIES_KEYS = {
    FIRE: ['FIRE_FOX', 'FIRE_SALAMANDER', 'FIRE_JELLYFISH', 'FIRE_TIGER', 'FIRE_PHOENIX'],
    WATER: ['WATER_GOLDFISH', 'WATER_SQUID', 'WATER_TURTLE', 'WATER_SHARK', 'WATER_WHALE'],
    NATURE: ['NATURE_BUTTERFLY', 'NATURE_BOAR', 'NATURE_SLOTH', 'NATURE_WOLF', 'NATURE_BEAR'],
    WIND: ['WIND_BEE', 'WIND_DRAGONFLY', 'WIND_DOVE', 'WIND_EAGLE', 'WIND_GRIFFIN'],
    EARTH: ['EARTH_ANT', 'EARTH_MOLE', 'EARTH_BULL', 'EARTH_RHINO', 'EARTH_ELEPHANT'],
    ICE: ['ICE_PENGUIN', 'ICE_SEAGULL', 'ICE_SEAL', 'ICE_POLARBEAR', 'ICE_YETI'],
    ELECTRIC: ['ELECTRIC_RAY', 'ELECTRIC_EEL', 'ELECTRIC_CATFISH', 'ELECTRIC_CAT', 'ELECTRIC_THUNDERBIRD'],
    LIGHT: ['LIGHT_SNAIL', 'LIGHT_WORM', 'LIGHT_SWAN', 'LIGHT_PEGASUS', 'LIGHT_DRAGON'],
    DARK: ['DARK_TOAD', 'DARK_RAVEN', 'DARK_CAT', 'DARK_PANTHER', 'DARK_DRAGON'],
    GHOST: ['GHOST_SPIRIT', 'GHOST_DEER', 'GHOST_ANTELOPE', 'GHOST_JELLYFISH', 'GHOST_LION'],
    MAGIC: ['MAGIC_BEETLE', 'MAGIC_PEACOCK', 'MAGIC_HAT', 'MAGIC_SABERTOOTH', 'MAGIC_UNICORN'],
    PSYCHIC: ['PSYCHIC_GIRAFFE', 'PSYCHIC_HAMMERHEAD', 'PSYCHIC_TOUCAN', 'PSYCHIC_SQUIRREL', 'PSYCHIC_FLAMINGO'],
    FIGHTING: ['FIGHTING_HORSE', 'FIGHTING_CRAB', 'FIGHTING_DOG', 'FIGHTING_SPIDER', 'FIGHTING_KANGAROO'],
    METAL: ['METAL_GORILLA', 'METAL_BISON', 'METAL_SCORPION', 'METAL_TURTLE', 'METAL_DRAGON'],
    ROCK: ['ROCK_MAMMOTH', 'ROCK_SCORPION', 'ROCK_IBEX', 'ROCK_BEETLE', 'ROCK_GOLEM'],
    POISON: ['POISON_RAT', 'POISON_SNAKE', 'POISON_CATERPILLAR', 'POISON_STONEFISH', 'POISON_FROG'],
    DRAGON: ['DRAGON_RED', 'DRAGON_BLUE', 'DRAGON_GREEN', 'DRAGON_YELLOW', 'DRAGON_COLOR'],
    FAIRY: ['FAIRY_GNOME', 'FAIRY_RABBIT', 'FAIRY_CAT', 'FAIRY_HAT', 'FAIRY_QUEEN'],
    TECH: ['TECH_DRONE', 'TECH_MOOSE', 'TECH_CHICKEN', 'TECH_MOUSE', 'TECH_ROBOT'],
    SOUND: ['SOUND_ORCA', 'SOUND_BAT', 'SOUND_OWL', 'SOUND_CRICKET', 'SOUND_PARROT'],
    TIME: ['TIME_LIZARD', 'TIME_CAMEL', 'TIME_HIPPO', 'TIME_CROCODILE', 'TIME_CORAL'],
    SPACE: ['SPACE_STAR', 'SPACE_ALIEN', 'SPACE_COMET', 'SPACE_PLANET', 'SPACE_RAINBOW'],
    VOID: ['VOID_OCTOPUS', 'VOID_SPIDER', 'VOID_WORM', 'VOID_SHEEP', 'VOID_DRAGON'],
    CHAOS: ['CHAOS_TEA', 'CHAOS_MONKEY', 'CHAOS_RACCOON', 'CHAOS_LYNX', 'CHAOS_DEVIL'],
    ORDER: ['ORDER_YING', 'ORDER_YANG', 'ORDER_LION', 'ORDER_DINO', 'ORDER_ANGEL']
};

const determineRarity = (boxVariant) => {
    const odds = LOOTBOX_ODDS[boxVariant] || LOOTBOX_ODDS.DEFAULT;
    const rand = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(odds)) {
        cumulative += chance;
        if (rand < cumulative) return rarity;
    }
    return 'COMMON';
};

const generateServerPet = (ownerId, rarity, fixedType) => {
    const type = fixedType || TYPES[Math.floor(Math.random() * TYPES.length)];

    // Spezies wählen
    const possibleSpecies = SPECIES_KEYS[type] || [];
    const species = possibleSpecies.length > 0
        ? possibleSpecies[Math.floor(Math.random() * possibleSpecies.length)]
        : `${type}_UNKNOWN`;

    // Basis-Werte
    const baseStats = {
        COMMON: { hp: 10, atk: 2 },
        UNCOMMON: { hp: 12, atk: 3 },
        RARE: { hp: 15, atk: 4 },
        EPIC: { hp: 20, atk: 6 },
        LEGENDARY: { hp: 30, atk: 8 },
        MYTHIC: { hp: 50, atk: 12 },
        DIVINE: { hp: 70, atk: 15 },
        ANCIENT: { hp: 100, atk: 20 },
        COSMIC: { hp: 150, atk: 30 },
        TRANSCENDENT: { hp: 250, atk: 50 }
    };

    const stats = baseStats[rarity] || baseStats.COMMON;

    return {
        id: admin.firestore().collection('pets').doc().id,
        ownerId: ownerId,
        name: `Wildes ${type}-Pet`,
        type: type,
        species: species,
        rarity: rarity,
        level: 1,
        xp: 0,
        maxXp: 100,
        hp: stats.hp, maxHp: stats.hp,
        atk: stats.atk, def: 1, speed: 1, ap: 1, res: 1,
        isEgg: true,
        hatchAt: 0,
        source: 'LOOTBOX',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
};

exports.openLootbox = onCall({ cors: true }, async (request) => {
    // DEBUG LOGGING
    console.log("=== OPEN LOOTBOX CALLED ===");
    console.log("Auth Context:", request.auth ? `UID: ${request.auth.uid}` : "UNDEFINED");

    // 1. Sicherheit: Ist User eingeloggt?
    if (!request.auth) {
        console.warn("REJECTED: No Auth Context");
        throw new HttpsError('unauthenticated', 'User must be logged in.');
    }

    const userId = request.auth.uid;
    const { boxId, boxVariant } = request.data;

    console.log(`[OpenLootbox] Start for User: ${userId}, BoxID: ${boxId}, Variant: ${boxVariant}`);

    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);

    // 2. Transaktion: Atomarer Prozess
    try {
        return await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new HttpsError('not-found', 'User profile not found');

            const userData = userDoc.data();
            const inventory = userData.inventory || [];

            // 3. Prüfen: Hat der User die Box wirklich?
            const boxIndex = inventory.findIndex(i => String(i.id) === String(boxId));

            if (boxIndex === -1) {
                console.warn(`[OpenLootbox] Box ${boxId} not found in inventory of ${userId}`);
                throw new HttpsError('invalid-argument', 'Box not found in inventory.');
            }

            // 4. Logik: Box entfernen
            const newInventory = [...inventory];
            newInventory.splice(boxIndex, 1);

            // 5. Logik: Belohnung generieren
            const rarity = determineRarity(boxVariant);

            // Optional: Typ aus Box-Variante lesen
            let fixedType = null;
            if (boxVariant && boxVariant.startsWith('ELEMENTAL_')) {
                fixedType = boxVariant.split('_')[1];
            } else if (boxVariant === 'TYPE_DAILY') {
                // Determine Daily Type based on schedule (matches client ShopScreen)
                const dayIndex = new Date().getDay();
                const schedule = {
                    1: { start: 0, count: 3 }, // Mo
                    2: { start: 3, count: 3 }, // Di
                    3: { start: 6, count: 3 }, // Mi
                    4: { start: 9, count: 3 }, // Do
                    5: { start: 12, count: 4 }, // Fr
                    6: { start: 16, count: 4 }, // Sa
                    0: { start: 20, count: 4 }  // So
                };
                const config = schedule[dayIndex] || schedule[1]; // Fallback Mo
                const dailyTypes = TYPES.slice(config.start, config.start + config.count);
                if (dailyTypes.length > 0) {
                    fixedType = dailyTypes[Math.floor(Math.random() * dailyTypes.length)];
                } else {
                    fixedType = 'FIRE'; // Fallback
                }
                console.log(`[OpenLootbox] Resolved TYPE_DAILY to ${fixedType}`);
            }

            const newPet = generateServerPet(userId, rarity, fixedType);

            // 6. Speichern
            transaction.update(userRef, { inventory: newInventory });
            transaction.set(db.collection('pets').doc(newPet.id), newPet);

            console.log(`[OpenLootbox] Success! Created ${newPet.rarity} ${newPet.type} for ${userId}`);
            return { success: true, pet: newPet };
        });
    } catch (error) {
        console.error("[OpenLootbox] Transaction failed:", error);
        throw new HttpsError('internal', error.message || 'Internal Server Error');
    }
});
