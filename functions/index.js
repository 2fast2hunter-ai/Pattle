const { onCall, HttpsError } = require("firebase-functions/v2/https");
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Webhook auth token for the Paperclip routine trigger (bearer mode)
const PAPERCLIP_WEBHOOK_BEARER = "424b8d1274070325e5d2c5a814004d55389740b2c5ea0c4f";

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

exports.buyMarketItem = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'User must be logged in.');
    }

    const buyerId = request.auth.uid;
    const { listingId } = request.data;

    if (!listingId) {
        throw new HttpsError('invalid-argument', 'listingId is required.');
    }

    const db = admin.firestore();
    const listingRef = db.collection('market').doc(listingId);
    const buyerRef = db.collection('users').doc(buyerId);

    try {
        return await db.runTransaction(async (transaction) => {
            const listingSnap = await transaction.get(listingRef);
            if (!listingSnap.exists) {
                throw new HttpsError('not-found', 'Angebot nicht mehr verfügbar.');
            }

            const listing = listingSnap.data();
            const price = listing.price;
            const sellerId = listing.sellerId;

            if (sellerId === buyerId) {
                throw new HttpsError('invalid-argument', 'Du kannst dein eigenes Angebot nicht kaufen.');
            }

            const buyerSnap = await transaction.get(buyerRef);
            if (!buyerSnap.exists) {
                throw new HttpsError('not-found', 'Käufer Profilfehler.');
            }

            const currentCoins = buyerSnap.data().coins || 0;
            if (currentCoins < price) {
                throw new HttpsError('invalid-argument', 'Nicht genug Münzen!');
            }

            const fee = Math.floor(price * 0.05);
            const payout = price - fee;
            const sellerRef = db.collection('users').doc(sellerId);

            transaction.update(buyerRef, {
                coins: admin.firestore.FieldValue.increment(-price),
                'stats.marketSpent': admin.firestore.FieldValue.increment(price)
            });
            transaction.update(sellerRef, {
                coins: admin.firestore.FieldValue.increment(payout),
                'stats.marketEarned': admin.firestore.FieldValue.increment(payout)
            });

            if (listing.type === 'RESOURCE') {
                transaction.update(buyerRef, {
                    [`village.storage.${listing.itemId}`]: admin.firestore.FieldValue.increment(listing.amount)
                });
            } else if (listing.pets && Array.isArray(listing.pets)) {
                listing.pets.forEach((p, index) => {
                    const newId = `${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`;
                    transaction.set(db.collection('pets').doc(newId), { ...p, id: newId, ownerId: buyerId });
                });
            } else {
                const newId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                transaction.set(db.collection('pets').doc(newId), { ...listing.pet, id: newId, ownerId: buyerId });
            }

            transaction.delete(listingRef);

            return { success: true, message: 'Kauf erfolgreich!' };
        });
    } catch (error) {
        if (error instanceof HttpsError) throw error;
        console.error('[buyMarketItem] Transaction failed:', error);
        throw new HttpsError('internal', error.message || 'Internal Server Error');
    }
});

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

const PAPERCLIP_WEBHOOK_URL =
    "https://paperclip-afsc.srv1732766.hstgr.cloud/api/routine-triggers/public/01839bc18e6ed7db976d2f6a/fire";

const CATEGORY_LABELS = {
    bug: "🐛 Bug Report",
    suggestion: "💡 Suggestion",
    balance: "⚖️ Balance Feedback",
    other: "💬 Other",
};

const CATEGORY_PRIORITIES = {
    bug: "high",
    suggestion: "medium",
    balance: "medium",
    other: "low",
};

exports.createPaperclipIssueFromFeedback = functions.firestore
    .document("feedback/{feedbackId}")
    .onCreate(async (snap, context) => {
        const feedback = snap.data();
        const feedbackId = context.params.feedbackId;

        const categoryLabel = CATEGORY_LABELS[feedback.category] || "💬 Other";
        const priority = CATEGORY_PRIORITIES[feedback.category] || "medium";
        const shortMessage = (feedback.message || "").substring(0, 80).replace(/\n/g, " ");
        const title = `[Player Feedback] ${categoryLabel}: ${shortMessage}`;

        const issueBody = {
            title,
            priority,
            payload: {
                feedbackId,
                category: feedback.category,
                message: feedback.message,
                userId: feedback.userId || "anonymous",
                userName: feedback.userName || "Anonymous",
                submittedAt: feedback.createdAt ? feedback.createdAt.toDate().toISOString() : new Date().toISOString(),
            },
        };

        const MAX_RETRIES = 2;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await fetch(PAPERCLIP_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${PAPERCLIP_WEBHOOK_BEARER}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(issueBody),
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error(`[FeedbackWebhook] Attempt ${attempt}/${MAX_RETRIES} failed: ${response.status} ${text}`);
                    lastError = new Error(`HTTP ${response.status}`);
                    continue;
                }

                console.log(`[FeedbackWebhook] Paperclip issue created for feedback ${feedbackId} (attempt ${attempt})`);
                await snap.ref.update({ paperclipIssueCreated: true, paperclipIssueFiredAt: admin.firestore.FieldValue.serverTimestamp() });
                return;
            } catch (err) {
                console.error(`[FeedbackWebhook] Attempt ${attempt}/${MAX_RETRIES} error:`, err);
                lastError = err;
            }
        }

        console.error(`[FeedbackWebhook] All ${MAX_RETRIES} attempts failed for feedback ${feedbackId}:`, lastError);
    }
);
