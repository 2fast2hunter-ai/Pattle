const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// --- KONFIGURATION (Vereinfacht für Server) ---
const LOOTBOX_ODDS = {
    DAILY: { COMMON: 68, UNCOMMON: 20, RARE: 10, EPIC: 2 },
    PREMIUM: { COMMON: 72, UNCOMMON: 20, RARE: 5, EPIC: 2, LEGENDARY: 1 },
    MASTER: { COMMON: 28, UNCOMMON: 45, RARE: 15, EPIC: 8, LEGENDARY: 3, MYTHIC: 1 },
    // Fallback für Elementar-Truhen etc.
    DEFAULT: { COMMON: 50, UNCOMMON: 30, RARE: 15, EPIC: 5 }
};

const TYPES = ['FIRE', 'WATER', 'NATURE', 'WIND', 'EARTH', 'ELECTRIC', 'ICE', 'LIGHT', 'DARK'];

// Helper: Zufällige Rarity basierend auf Wahrscheinlichkeiten
const determineRarity = (boxVariant) => {
    const odds = LOOTBOX_ODDS[boxVariant] || LOOTBOXES.DEFAULT;
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rarity, chance] of Object.entries(odds)) {
        cumulative += chance;
        if (rand < cumulative) return rarity;
    }
    return 'COMMON';
};

// Helper: Zufälliges Pet generieren (Server-Side)
const generateServerPet = (ownerId, rarity, fixedType) => {
    const type = fixedType || TYPES[Math.floor(Math.random() * TYPES.length)];
    
    // Basis-Werte (Vereinfacht, Client kann Details anzeigen)
    const baseStats = {
        COMMON: { hp: 10, atk: 2 },
        UNCOMMON: { hp: 12, atk: 3 },
        RARE: { hp: 15, atk: 4 },
        EPIC: { hp: 20, atk: 6 },
        LEGENDARY: { hp: 30, atk: 8 },
        MYTHIC: { hp: 50, atk: 12 }
    };
    
    const stats = baseStats[rarity] || baseStats.COMMON;

    return {
        id: admin.firestore().collection('pets').doc().id,
        ownerId: ownerId,
        name: `Wildes ${type}-Pet`, // Client kann umbenennen
        type: type,
        rarity: rarity,
        level: 1,
        xp: 0,
        maxXp: 100,
        hp: stats.hp, maxHp: stats.hp,
        atk: stats.atk, def: 1, speed: 1,
        isEgg: true, // Lootbox Pets sind oft Eier oder direkt Pets
        hatchAt: 0, // Sofort verfügbar oder Inkubationszeit hier setzen
        source: 'LOOTBOX',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
};

// --- CLOUD FUNCTION: OPEN LOOTBOX ---
exports.openLootbox = functions.https.onCall(async (data, context) => {
    // 1. Sicherheit: Ist User eingeloggt?
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const userId = context.auth.uid;
    const { boxId, boxVariant } = data;
    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);

    // 2. Transaktion: Atomarer Prozess (Lesen -> Prüfen -> Schreiben)
    return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) throw new functions.https.HttpsError('not-found', 'User profile not found');

        const userData = userDoc.data();
        const inventory = userData.inventory || [];

        // 3. Prüfen: Hat der User die Box wirklich?
        const boxIndex = inventory.findIndex(i => i.id === boxId);
        if (boxIndex === -1) {
            throw new functions.https.HttpsError('invalid-argument', 'Box not found in inventory.');
        }

        // 4. Logik: Box entfernen
        const newInventory = [...inventory];
        newInventory.splice(boxIndex, 1);

        // 5. Logik: Belohnung generieren (Server entscheidet!)
        const rarity = determineRarity(boxVariant);
        
        // Optional: Typ aus Box-Variante lesen (z.B. ELEMENTAL_FIRE)
        let fixedType = null;
        if (boxVariant && boxVariant.startsWith('ELEMENTAL_')) {
            fixedType = boxVariant.split('_')[1];
        }

        const newPet = generateServerPet(userId, rarity, fixedType);

        // 6. Speichern
        transaction.update(userRef, { inventory: newInventory });
        transaction.set(db.collection('pets').doc(newPet.id), newPet);

        return { success: true, pet: newPet };
    });
});