// ... (Imports bleiben gleich) ...
import { db } from '../firebase';
import {
    doc, getDoc, setDoc, updateDoc, collection, addDoc,
    onSnapshot, query, where, deleteDoc, orderBy, limit, getDocs,
    runTransaction, increment, getCountFromServer, deleteField, writeBatch
} from 'firebase/firestore';
import { generateQuests } from './gameMechanics';
import { calculatePlayerLevel, getXpToNextPlayerLevel } from './mechanics/progression';
import { recalculatePetStats, calculateMaxXp } from './mechanics/petStats';

// --- HELPER: MIGRATIONEN ---

const checkAndMigrateLevel = async (userData) => {
    if (!userData) return;
    const currentXp = userData.xp || 0;
    const correctLevel = calculatePlayerLevel(currentXp);
    const correctXpToNext = getXpToNextPlayerLevel(correctLevel);

    if (userData.level !== correctLevel || userData.xpToNextLevel !== correctXpToNext) {
        console.log(`[DB] Migriere User Level: ${userData.level} -> ${correctLevel}`);
        try {
            await updateDoc(doc(db, "users", userData.id), {
                level: correctLevel,
                xpToNextLevel: correctXpToNext
            });
        } catch (e) { console.error("[DB] Fehler bei Level-Migration:", e); }
    }
};

// Pet-Stats Migration (FIXED)
const _checkAndMigratePet = async (pet) => {
    if (pet.isEgg) return;

    // 1. Level Check (Vertraue dem gespeicherten Level, da XP relativ ist)
    const currentLevel = pet.level || 1;
    const correctMaxXp = calculateMaxXp(currentLevel, pet.rarity);

    // 2. Stats Check (Idealwerte)
    const idealStats = recalculatePetStats(pet, currentLevel);

    // Prüfen auf Fehler: Falsches Level, fehlende Basiswerte oder NaN-Stats
    const needsUpdate =
        pet.maxXp !== correctMaxXp ||
        !pet.b_hp ||
        isNaN(pet.maxHp) || // WICHTIG: NaN Check
        isNaN(pet.atk) ||
        Math.abs(pet.maxHp - idealStats.maxHp) > 5;

    if (needsUpdate) {
        console.log(`[DB] Repariere Pet ${pet.name} (Lvl ${currentLevel}, Stats/MaxXP fixed)`);
        try {
            await updateDoc(doc(db, "pets", pet.id), {
                ...idealStats,
                maxXp: correctMaxXp,
                level: currentLevel
            });
        } catch (e) { console.error("Fehler bei Pet Migration:", e); }
    }
};

// --- HELPER: QUEST PATCHING (Für UI Anzeige) ---
const getFixedQuestReward = (category) => {
    if (category === 'DAILY') return { xp: 500, composite: { rewardType: 'GEMS', rewardAmount: 10, label: '10 Edelsteine' } };
    if (category === 'WEEKLY') return { xp: 1000, composite: { rewardType: 'COINS', rewardAmount: 7500, label: '7.500 Münzen' } };
    if (category === 'MONTHLY') return { xp: 5000, composite: { rewardType: 'LOOTBOX', variant: 'ELEMENTAL_RANDOM', label: 'Elementar-Truhe' } };
    return { xp: 0, composite: null };
};

const generatePatchedQuests = (catName) => {
    const data = generateQuests(catName);
    if (!data) return data;
    const config = getFixedQuestReward(catName);

    // --- NEU: Werbe-Quest für Daily ---
    if (catName === 'DAILY' && data.quests) {
        const adQuest = {
            id: `daily_ad_${Date.now()}`,
            type: 'WATCH_AD',
            target: 10,
            progress: 0,
            label: 'Werbe-Marathon',
            claimed: false
        };
        data.quests.unshift(adQuest);
    }

    if (data.quests) {
        data.quests = data.quests.map(q => ({ ...q, rewardType: 'XP', rewardAmount: config.xp }));
        data.totalQuests = data.quests.length; // Gesamtanzahl aktualisieren
    }
    if (config.composite) {
        data.reward = config.composite;
    }
    return data;
};

const checkAndMigrateQuests = async (userData) => {
    if (!userData || !userData.quests) return;
    let updates = {};
    let hasUpdates = false;

    ['daily', 'weekly', 'monthly'].forEach(catKey => {
        const catName = catKey.toUpperCase();
        const config = getFixedQuestReward(catName);
        const categoryData = userData.quests[catKey];

        if (categoryData && categoryData.quests) {
            const firstQuest = categoryData.quests[0];
            // Prüfen ob Anzeige-Update nötig ist (wenn XP nicht stimmt oder Belohnung falsch)
            const needsUpdate = firstQuest && (firstQuest.rewardType !== 'XP' || firstQuest.rewardAmount !== config.xp);

            if (needsUpdate) {
                const newQuests = categoryData.quests.map(q => ({ ...q, rewardType: 'XP', rewardAmount: config.xp }));
                updates[`quests.${catKey}.quests`] = newQuests;
                updates[`quests.${catKey}.reward`] = config.composite;
                hasUpdates = true;
            }
        }
    });

    if (hasUpdates) {
        console.log("[DB] Migriere Quest-Anzeige auf neue Werte...");
        try { await updateDoc(doc(db, "users", userData.id), updates); } catch (e) { console.error(e); }
    }
};

// --- HELPER: TOWER RESET ---
const checkAndResetTower = async (userData) => {
    if (!userData) return;
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`; // z.B. "2025-0" für Januar

    if (userData.towerResetDate !== currentMonthKey) {
        console.log("[DB] Neuer Monat! Resette Battle Tower.");
        try { await updateDoc(doc(db, "users", userData.id), { towerProgress: 1, towerResetDate: currentMonthKey }); } catch (e) { console.error(e); }
    }
};

// --- HELPER: LEADERBOARD RESET & REWARDS ---
const getLeaderboardRewards = (rank, total) => {
    const percent = total > 0 ? (rank / total) * 100 : 100;

    // Belohnungen definieren
    if (rank === 1) return { coins: 50000, gems: 500, breedTickets: 10, adTickets: 20, label: 'Platz 1' };
    if (rank === 2) return { coins: 30000, gems: 300, breedTickets: 7, adTickets: 15, label: 'Platz 2' };
    if (rank === 3) return { coins: 20000, gems: 200, breedTickets: 5, adTickets: 10, label: 'Platz 3' };

    if (percent <= 5) return { coins: 15000, gems: 150, breedTickets: 4, adTickets: 8, label: 'Top 5%' };
    if (percent <= 10) return { coins: 10000, gems: 100, breedTickets: 3, adTickets: 6, label: 'Top 10%' };
    if (percent <= 20) return { coins: 8000, gems: 80, breedTickets: 2, adTickets: 5, label: 'Top 20%' };
    if (percent <= 30) return { coins: 7000, gems: 70, breedTickets: 2, adTickets: 4, label: 'Top 30%' };
    if (percent <= 40) return { coins: 6000, gems: 60, breedTickets: 1, adTickets: 4, label: 'Top 40%' };
    if (percent <= 50) return { coins: 5000, gems: 50, breedTickets: 1, adTickets: 3, label: 'Top 50%' };
    if (percent <= 60) return { coins: 4000, gems: 40, breedTickets: 1, adTickets: 3, label: 'Top 60%' };
    if (percent <= 70) return { coins: 3000, gems: 30, breedTickets: 1, adTickets: 2, label: 'Top 70%' };
    if (percent <= 80) return { coins: 2000, gems: 20, breedTickets: 0, adTickets: 2, label: 'Top 80%' };
    if (percent <= 90) return { coins: 1000, gems: 10, breedTickets: 0, adTickets: 1, label: 'Top 90%' };

    return null; // Keine Belohnung für die unteren 10%
};

const checkAndResetLeaderboard = async (userData) => {
    if (!userData) return;
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

    if (userData.leaderboardResetDate !== currentMonthKey) {
        console.log("[DB] Neuer Monat! Prüfe Rangliste...");

        // Standard-Updates für den Reset VORBEREITEN (Rating auf 1000)
        let updates = {
            leaderboardResetDate: currentMonthKey,
            rating: 1000, // Reset Elo
            startEloToday: 1000,
            lastEloDate: now.toISOString().split('T')[0]
        };

        try {
            // 1. Rang ermitteln (Anzahl User mit höherem Rating + 1)
            const usersRef = collection(db, "users");
            const qHigher = query(usersRef, where("rating", ">", userData.rating || 1000));

            const snapshotHigher = await getCountFromServer(qHigher);
            const rank = snapshotHigher.data().count + 1;

            const snapshotTotal = await getCountFromServer(usersRef);
            const total = snapshotTotal.data().count;

            // 2. Belohnung berechnen
            const reward = getLeaderboardRewards(rank, total);

            if (reward) {
                updates.coins = (userData.coins || 0) + reward.coins;
                updates.gems = (userData.gems || 0) + reward.gems;
                updates.adTickets = (userData.adTickets || 0) + reward.adTickets;

                if (reward.breedTickets > 0) {
                    const ticketItems = Array.from({ length: reward.breedTickets }, () => ({
                        id: Date.now() + Math.random(), type: 'TICKET'
                    }));
                    updates.inventory = [...(userData.inventory || []), ...ticketItems];
                }

                updates.seasonRewardMessage = `Saison Ende! Rang ${rank} (${reward.label}). Belohnung: ${reward.coins} Münzen, ${reward.gems} Edelsteine, ${reward.breedTickets} Zuchttickets, ${reward.adTickets} Werbetickets.`;
            } else {
                updates.seasonRewardMessage = `Saison Ende! Rang ${rank}. Viel Glück im nächsten Monat!`;
            }

        } catch (e) {
            console.error("[DB] Fehler beim Leaderboard Reset (Reward):", e);
            // Fallback: Trotz Fehler beim Rang-Berechnen das Rating zurücksetzen!
            updates.seasonRewardMessage = "Saison Ende! Elo wurde zurückgesetzt.";
        }

        // 3. Update durchführen (Reset + ggf. Belohnung)
        try {
            await updateDoc(doc(db, "users", userData.id), updates);
        } catch (e) {
            console.error("[DB] Kritischer Fehler beim Speichern des Resets:", e);
        }
    }
};

const checkAndResetGauntletLeaderboard = async (userData) => {
    if (!userData) return;
    const now = new Date();
    // 1 Woche Offset: Wir ziehen 7 Tage ab. Wenn dann ein neuer Monat ist, ist Reset Zeit.
    // Beispiel: Heute 5. Feb. -7 Tage = 29. Jan. -> Gleicher Monat wie Jan -> Kein Reset (wenn letzter Reset Jan war)
    // Beispiel: Heute 8. Feb. -7 Tage = 1. Feb. -> Neuer Monat (Feb) -> Reset!
    // Der "virtuelle" Monat für Gauntlet beginnt also am 8. des Kalendermonats.

    const offsetDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentGauntletMonthKey = `${offsetDate.getFullYear()}-${offsetDate.getMonth()}`;

    if (userData.gauntletResetDate !== currentGauntletMonthKey) {
        console.log("[DB] Neue Gauntlet Saison! Prüfe Rangliste...");

        let updates = {
            gauntletResetDate: currentGauntletMonthKey,
            "stats.gauntletHighscore": 0, // Reset Highscore
            lastGauntletDate: now.toISOString().split('T')[0]
        };

        try {
            const usersRef = collection(db, "users");
            const qHigher = query(usersRef, where("stats.gauntletHighscore", ">", userData.stats?.gauntletHighscore || 0));

            const snapshotHigher = await getCountFromServer(qHigher);
            const rank = snapshotHigher.data().count + 1;

            const snapshotTotal = await getCountFromServer(usersRef);
            const total = snapshotTotal.data().count;

            const reward = getLeaderboardRewards(rank, total); // Gleiche Belohnungen wie Elo

            if (reward) {
                updates.coins = (userData.coins || 0) + reward.coins;
                updates.gems = (userData.gems || 0) + reward.gems;
                updates.adTickets = (userData.adTickets || 0) + reward.adTickets;

                if (reward.breedTickets > 0) {
                    const ticketItems = Array.from({ length: reward.breedTickets }, () => ({
                        id: Date.now() + Math.random(), type: 'TICKET'
                    }));
                    updates.inventory = [...(userData.inventory || []), ...ticketItems];
                }

                updates.seasonRewardMessage = `Gauntlet Saison Ende! Rang ${rank} (${reward.label}). Belohnung: ${reward.coins} Münzen, ${reward.gems} Edelsteine.`;
            } else {
                updates.seasonRewardMessage = `Gauntlet Saison Ende! Rang ${rank}. Viel Glück!`;
            }

        } catch (e) {
            console.error("[DB] Fehler beim Gauntlet Reset:", e);
            updates.seasonRewardMessage = "Gauntlet Saison Ende! Score wurde zurückgesetzt.";
        }

        try {
            await updateDoc(doc(db, "users", userData.id), updates);
        } catch (e) {
            console.error("[DB] Kritischer Fehler beim Speichern des Gauntlet Resets:", e);
        }
    }
};

// ... (Restlicher Code identisch - initializeUser, listenToUser etc. nutzen die Helfer oben) ...
export const initializeUser = async (firebaseUser, username) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = { id: userSnap.id, ...userSnap.data() };
        checkAndMigrateLevel(userData);
        checkAndResetTower(userData);
        checkAndResetLeaderboard(userData);
        checkAndResetGauntletLeaderboard(userData);
        return userData;
    } else {
        const today = new Date().toISOString().split('T')[0];
        const newUserData = {
            id: firebaseUser.uid,
            username: username,
            level: 1,
            xp: 0,
            xpToNextLevel: getXpToNextPlayerLevel(1),
            coins: 500,
            gems: 10,
            avatar: '🛡️',
            rating: 1000,
            startEloToday: 1000,
            lastEloDate: today,
            lastLoginDate: '',
            loginStreak: 0,
            team: [],
            inventory: [{ id: Date.now(), type: 'LOOTBOX', variant: 'STARTER' }],
            friends: [],
            stats: { pvpWins: 0, pvpTotal: 0, hatched: 0, bred: 0, marketSpent: 0, marketEarned: 0 },
            tutorialStep: 0, // 0=Start, 10=Fertig
            quests: {
                daily: generatePatchedQuests('DAILY'),
                weekly: generatePatchedQuests('WEEKLY'),
                monthly: generatePatchedQuests('MONTHLY')
            },
            redeemedTickets: 0,
            adTickets: 0,
            buffs: { coinBoostMatches: 0, xpBoostMatches: 0 },
            towerProgress: 1,
            towerResetDate: `${new Date().getFullYear()}-${new Date().getMonth()}`,
            leaderboardResetDate: `${new Date().getFullYear()}-${new Date().getMonth()}`,
            gauntletResetDate: `${new Date(Date.now() - 7 * 86400000).getFullYear()}-${new Date(Date.now() - 7 * 86400000).getMonth()}`,
            village: {
                level: 1,
                xp: 0,
                xpToNext: 16000,
                lastCollectionTime: Date.now(),
                idleTimeExpiresAt: Date.now(),
                resources: { wood: 0, stone: 0, seafood: 0, stardust: 0, computer_parts: 0, special: 0 },
                storage: {},
                buildings: { wood: 1, stone: 1, seafood: 1, stardust: 1, computer_parts: 1, special: 1 },
                workers: {
                    wood: [null, null, null, null, null],
                    stone: [null, null, null, null, null],
                    seafood: [null, null, null, null, null],
                    stardust: [null, null, null, null, null],
                    computer_parts: [null, null, null, null, null],
                    special: [null, null, null, null, null]
                },
                milestones: {},
                stats: {
                    totalCollected: { wood: 0, stone: 0, seafood: 0, stardust: 0, computer_parts: 0, special: 0 },
                    totalItemsCollected: {},
                    totalIdleTime: 0
                }
            }
        };
        await setDoc(userRef, newUserData);
        return newUserData;
    }
};

export const listenToUser = (userId, callback) => {
    return onSnapshot(doc(db, "users", userId), (docSnap) => {
        if (docSnap.exists()) {
            const userData = { id: docSnap.id, ...docSnap.data() };
            checkAndMigrateLevel(userData);
            checkAndMigrateQuests(userData); // Automatische Korrektur der Quest-Anzeige
            checkAndResetTower(userData);
            checkAndResetLeaderboard(userData);
            checkAndResetGauntletLeaderboard(userData);
            callback(userData);
        }
    });
};

export const listenToPets = (userId, callback) => {
    const q = query(collection(db, "pets"), where("ownerId", "==", userId));
    return onSnapshot(q, (snapshot) => {
        const pets = [];
        snapshot.forEach((doc) => {
            const petData = { id: doc.id, ...doc.data() };
            // checkAndMigratePet(petData); // DEAKTIVIERT: Verhinder Endlos-Loop
            pets.push(petData);
        });
        callback(pets);
    });
};

export const listenToMarket = (callback) => { return onSnapshot(collection(db, "market"), (snapshot) => { const listings = []; snapshot.forEach((doc) => listings.push({ id: doc.id, ...doc.data() })); callback(listings); }); };
export const updateUser = async (userId, data) => {
    if (!userId) return;
    const userRef = doc(db, "users", userId);
    try {
        await updateDoc(userRef, data);
    } catch (e) {
        // Firebase offline: pending write will be retried automatically when online
        console.error("[DB] updateUser failed:", e.code, e.message);
    }
};
export const addPetToDB = async (pet, ownerId) => { await setDoc(doc(db, "pets", pet.id), { ...pet, ownerId }); };
export const updatePetInDB = async (petId, data) => { await updateDoc(doc(db, "pets", petId), data); };

/**
 * Batch Update für Pet XP (Village Optimierung)
 * @param {Array} updatesList - Array von Objekten { pet: Object, xpAmount: number }
 */
export const batchUpdatePetsXp = async (updatesList) => {
    if (!updatesList || updatesList.length === 0) return { success: true, results: [] };

    const batch = writeBatch(db);
    const results = [];

    updatesList.forEach(({ pet, xpAmount }) => {
        if (!pet || !pet.id) return;

        let currentXp = Number(pet.xp) || 0;
        let newXp = currentXp + xpAmount;
        let currentLevel = Number(pet.level) || 1;
        const rarity = pet.rarity || 'COMMON';

        let maxXp = pet.maxXp || calculateMaxXp(currentLevel, rarity);
        if (!maxXp || maxXp <= 0) maxXp = 100;

        let levelUp = false;
        let initialLevel = currentLevel;

        while (newXp >= maxXp) {
            newXp -= maxXp;
            currentLevel++;
            levelUp = true;
            maxXp = calculateMaxXp(currentLevel, rarity);
            if (!maxXp || maxXp <= 0) maxXp = 100 * currentLevel;
        }

        const updateData = { xp: newXp, level: currentLevel, maxXp: maxXp };

        if (levelUp) {
            const newStats = recalculatePetStats(pet, currentLevel);
            updateData.maxHp = newStats.maxHp;
            updateData.hp = newStats.maxHp;
            updateData.atk = newStats.atk;
            updateData.def = newStats.def;
            updateData.ap = newStats.ap;
            updateData.res = newStats.res;
            updateData.speed = newStats.speed;
            updateData.maxXp = newStats.maxXp;
        }

        const petRef = doc(db, "pets", pet.id);
        batch.update(petRef, updateData);

        if (levelUp) {
            console.log(`[DB] Batch Level Up: ${pet.name} -> ${currentLevel}`);
        }

        results.push({ petId: pet.id, levelUp, newLevel: currentLevel, levelsGained: currentLevel - initialLevel });
    });

    try {
        await batch.commit();
        return { success: true, results };
    } catch (e) {
        console.error("[DB] Fehler bei Batch XP Update:", e);
        return { success: false, error: e };
    }
};

/**
 * Fügt einem Pet XP hinzu, berechnet Level-Ups und Stats neu und speichert alles in der DB.
 * @param {Object} pet - Das Pet-Objekt
 * @param {number} xpAmount - Menge der hinzuzufügenden XP
 */
export const addPetXp = async (pet, xpAmount) => {
    if (!pet || !pet.id) return { success: false, error: "Invalid Pet" };

    let currentXp = Number(pet.xp) || 0;
    let newXp = currentXp + xpAmount;
    let currentLevel = Number(pet.level) || 1;
    const rarity = pet.rarity || 'COMMON';

    // MaxXP holen (Fallback falls nicht im Pet-Objekt)
    let maxXp = pet.maxXp || calculateMaxXp(currentLevel, rarity);
    if (!maxXp || maxXp <= 0) maxXp = 100;

    let levelUp = false;

    // Level-Up Schleife (falls XP für mehrere Level reichen)
    while (newXp >= maxXp) {
        newXp -= maxXp;
        currentLevel++;
        levelUp = true;
        maxXp = calculateMaxXp(currentLevel, rarity);
        if (!maxXp || maxXp <= 0) maxXp = 100 * currentLevel;
    }

    const updates = { xp: newXp, level: currentLevel, maxXp: maxXp };

    if (levelUp) {
        const newStats = recalculatePetStats(pet, currentLevel);
        // Nur die Stats übernehmen, nicht das ganze Pet-Objekt
        updates.maxHp = newStats.maxHp;
        updates.hp = newStats.maxHp; // Heilung beim Level-Up
        updates.atk = newStats.atk;
        updates.def = newStats.def;
        updates.ap = newStats.ap;
        updates.res = newStats.res;
        updates.speed = newStats.speed;
        updates.maxXp = newStats.maxXp;
    }

    try {
        // Direktes Update via Firestore Referenz für Sicherheit
        const petRef = doc(db, "pets", pet.id);
        await updateDoc(petRef, updates);

        console.log(`[DB] addPetXp: ${pet.name} +${xpAmount} XP -> Lvl ${currentLevel}`);
        return { success: true, levelUp, newLevel: currentLevel };
    } catch (e) {
        console.error("[DB] Fehler beim Speichern der Pet-XP:", e);
        return { success: false, error: e };
    }
};

export const removePetFromDB = async (petId) => { await deleteDoc(doc(db, "pets", petId)); };
export const createMarketListing = async (listing) => { const docRef = await addDoc(collection(db, "market"), listing); return docRef.id; };
export const createResourceListing = async (user, itemId, amount, price) => { if (!user || !user.id) throw new Error("User nicht gefunden."); const userRef = doc(db, "users", user.id); const LISTING_FEE = 100; try { await runTransaction(db, async (transaction) => { const userDoc = await transaction.get(userRef); if (!userDoc.exists()) throw new Error("User existiert nicht."); const userData = userDoc.data(); if (userData.coins < LISTING_FEE) throw new Error("Nicht genügend Gold für die Gebühr (100)."); const storage = userData.village?.storage || {}; if ((storage[itemId] || 0) < amount) throw new Error("Nicht genügend Ressourcen im Lager."); const newStorage = { ...storage }; newStorage[itemId] -= amount; if (newStorage[itemId] <= 0) delete newStorage[itemId]; transaction.update(userRef, { coins: userData.coins - LISTING_FEE, "village.storage": newStorage }); const newListingRef = doc(collection(db, "market")); const listingData = { type: 'RESOURCE', itemId: itemId, amount: amount, price: price, sellerId: user.id, sellerName: user.username, createdAt: Date.now() }; transaction.set(newListingRef, listingData); }); return { success: true }; } catch (e) { console.error("Fehler beim Erstellen des Ressourcen-Angebots:", e); return { success: false, message: e.message }; } };
export const deleteMarketListing = async (listingId) => { await deleteDoc(doc(db, "market", listingId)); };
export const buyMarketItem = async (user, listingId) => { const listingRef = doc(db, "market", listingId); const buyerRef = doc(db, "users", user.id); try { await runTransaction(db, async (transaction) => { const listingSnap = await transaction.get(listingRef); if (!listingSnap.exists()) throw new Error("Angebot nicht mehr verfügbar."); const listing = listingSnap.data(); const price = listing.price; const sellerId = listing.sellerId; if (sellerId === user.id) throw new Error("Du kannst dein eigenes Angebot nicht kaufen."); const buyerSnap = await transaction.get(buyerRef); if (!buyerSnap.exists()) throw new Error("Käufer Profilfehler."); const currentCoins = buyerSnap.data().coins || 0; if (currentCoins < price) throw new Error("Nicht genug Münzen!"); const fee = Math.floor(price * 0.05); const payout = price - fee; const sellerRef = doc(db, "users", sellerId); transaction.update(buyerRef, { coins: increment(-price), "stats.marketSpent": increment(price) }); transaction.update(sellerRef, { coins: increment(payout), "stats.marketEarned": increment(payout) }); if (listing.type === 'RESOURCE') { transaction.update(buyerRef, { [`village.storage.${listing.itemId}`]: increment(listing.amount) }); } else { if (listing.pets && Array.isArray(listing.pets)) { listing.pets.forEach((p, index) => { const newId = `${Date.now()}_${index}_${Math.floor(Math.random() * 1000)}`; const newPet = { ...p, id: newId, ownerId: user.id }; const newPetRef = doc(db, "pets", newId); transaction.set(newPetRef, newPet); }); } else { const newId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`; const newPet = { ...listing.pet, id: newId, ownerId: user.id }; transaction.set(doc(db, "pets", newId), newPet); } } transaction.delete(listingRef); }); return { success: true, message: `Kauf erfolgreich!` }; } catch (e) { console.error("Marktplatz Fehler:", e); return { success: false, message: e.message }; } };
export const cancelMarketListing = async (user, listingId) => { const listingRef = doc(db, "market", listingId); try { await runTransaction(db, async (transaction) => { const listingSnap = await transaction.get(listingRef); if (!listingSnap.exists()) throw new Error("Angebot existiert nicht mehr."); const listing = listingSnap.data(); if (listing.sellerId !== user.id) throw new Error("Das ist nicht dein Angebot!"); if (listing.type === 'RESOURCE') { const userRef = doc(db, "users", user.id); transaction.update(userRef, { [`village.storage.${listing.itemId}`]: increment(listing.amount) }); } else { if (listing.pets && Array.isArray(listing.pets)) { listing.pets.forEach((p) => { const petRef = doc(db, "pets", p.id); transaction.set(petRef, { ...p, ownerId: user.id }); }); } else if (listing.pet) { const petRef = doc(db, "pets", listing.pet.id); transaction.set(petRef, { ...listing.pet, ownerId: user.id }); } } transaction.delete(listingRef); }); return { success: true, message: "Angebot entfernt. Items sind zurück!" }; } catch (e) { console.error("Cancel Listing Fehler:", e); return { success: false, message: e.message }; } };
export const checkAndInitVillage = async (user) => { if (!user || !user.id) return; const needsUpdate = !user.village || !user.village.storage || !user.village.stats || !user.village.idleTimeExpiresAt; if (needsUpdate) { const oldVillage = user.village || {}; const oldStats = oldVillage.stats || {}; const oldWorkers = oldVillage.workers || {}; const fillSlots = (arr) => { const newArr = arr ? [...arr] : []; while (newArr.length < 5) newArr.push(null); return newArr; }; const villageData = { level: oldVillage.level || 1, xp: oldVillage.xp || 0, xpToNext: oldVillage.xpToNext || 16000, lastCollectionTime: oldVillage.lastCollectionTime || Date.now(), idleTimeExpiresAt: oldVillage.idleTimeExpiresAt || Date.now(), resources: oldVillage.resources || { wood: 0, stone: 0, seafood: 0, stardust: 0, computer_parts: 0, special: 0 }, storage: oldVillage.storage || {}, buildings: oldVillage.buildings || { wood: 1, stone: 1, seafood: 1, stardust: 1, computer_parts: 1, special: 1 }, workers: { wood: fillSlots(oldWorkers.wood), stone: fillSlots(oldWorkers.stone), seafood: fillSlots(oldWorkers.seafood), stardust: fillSlots(oldWorkers.stardust), computer_parts: fillSlots(oldWorkers.computer_parts), special: fillSlots(oldWorkers.special) }, milestones: oldVillage.milestones || {}, stats: { totalCollected: oldStats.totalCollected || { wood: 0, stone: 0, seafood: 0, stardust: 0, computer_parts: 0, special: 0 }, totalItemsCollected: oldStats.totalItemsCollected || {}, totalIdleTime: oldStats.totalIdleTime || 0 } }; const userRef = doc(db, "users", user.id); await updateDoc(userRef, { village: villageData }); } };
export const getLeaderboard = async (type = 'elo') => {
    const orderByField = type === 'gauntlet' ? 'stats.gauntletHighscore' : 'rating';
    const q = query(collection(db, "users"), orderBy(orderByField, "desc"), limit(101));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const findUserPublic = async (targetId) => { try { const docRef = doc(db, "users", targetId); const docSnap = await getDoc(docRef); if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() }; return null; } catch (e) { return null; } }
export const checkAndResetQuests = async (user) => { if (!user || !user.id) return; const now = Date.now(); let updates = {}; let hasUpdates = false; const checkCategory = (catKey, catName) => { const current = user.quests?.[catKey]; if (!current || !current.expiresAt || now > current.expiresAt) { const newData = generatePatchedQuests(catName); updates[`quests.${catKey}`] = newData; hasUpdates = true; } }; checkCategory('daily', 'DAILY'); checkCategory('weekly', 'WEEKLY'); checkCategory('monthly', 'MONTHLY'); if (hasUpdates) await updateDoc(doc(db, "users", user.id), updates); };
export const trackQuestProgress = async (user, actionType, amount = 1, subTypes = []) => { if (!user || !user.id || amount === 0) return; const userRef = doc(db, "users", user.id); try { await runTransaction(db, async (transaction) => { const userDoc = await transaction.get(userRef); if (!userDoc.exists()) return; const userData = userDoc.data(); if (!userData.quests) return; let updates = {}; let hasUpdates = false;['daily', 'weekly', 'monthly'].forEach(catKey => { const categoryData = userData.quests[catKey]; if (!categoryData || !categoryData.quests) return; let categoryChanged = false; const updatedList = categoryData.quests.map(quest => { const isMatch = (quest.type === actionType) || (subTypes && subTypes.includes(quest.type)); if (isMatch && !quest.claimed && quest.progress < quest.target) { const newProgress = Math.min(quest.target, quest.progress + amount); if (newProgress !== quest.progress) { categoryChanged = true; return { ...quest, progress: newProgress }; } } return quest; }); if (categoryChanged) { updates[`quests.${catKey}.quests`] = updatedList; hasUpdates = true; } }); if (hasUpdates) { transaction.update(userRef, updates); } }); } catch (e) { console.error("Fehler beim Quest-Tracking:", e); } };
export const claimQuestReward = async (user, catKey, questId) => {
    const userRef = doc(db, "users", user.id);
    let rewardMessage = null;
    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) throw new Error("User document does not exist.");
            const userData = userDoc.data();
            const categoryData = userData.quests[catKey];
            const questIndex = categoryData.quests.findIndex(q => q.id === questId);
            const quest = categoryData.quests[questIndex];
            if (!quest || quest.claimed || quest.progress < quest.target) return;
            const updatedList = [...categoryData.quests];
            updatedList[questIndex] = { ...quest, claimed: true };
            const newCompletedCount = (categoryData.completedCount || 0) + 1;
            let updates = { [`quests.${catKey}.quests`]: updatedList, [`quests.${catKey}.completedCount`]: newCompletedCount };
            let xpGain = 0; let newCoins = userData.coins; let newGems = userData.gems;

            // --- NEUE LOGIK: Fixe XP basierend auf Kategorie ---
            if (catKey === 'daily') xpGain = 500;
            else if (catKey === 'weekly') xpGain = 1000;
            else if (catKey === 'monthly') xpGain = 5000;

            rewardMessage = `+${xpGain} XP`;
            // ---------------------------------------------------

            let newXp = (userData.xp || 0) + xpGain;
            let newLevel = calculatePlayerLevel(newXp);
            let newXpToNext = getXpToNextPlayerLevel(newLevel);
            if (newLevel > userData.level) { newCoins += 1000; newGems += 5; }
            updates['level'] = newLevel; updates['xp'] = newXp; updates['xpToNextLevel'] = newXpToNext; updates['coins'] = newCoins; updates['gems'] = newGems;
            transaction.update(userRef, updates);
        });
        return { message: rewardMessage };
    } catch (e) { console.error("Fehler beim Abholen der Quest-Belohnung:", e); return { message: null }; }
};
export const claimCompositeReward = async (user, catKey) => {
    const userRef = doc(db, "users", user.id);
    let rewardMessage = null;
    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) throw new Error("User document does not exist.");
            const userData = userDoc.data();
            const categoryData = userData.quests[catKey];
            if (!categoryData || categoryData.completedCount < categoryData.totalQuests || categoryData.claimedComposite) return;

            let updates = { [`quests.${catKey}.claimedComposite`]: true };
            let xpGain = 0; let newCoins = userData.coins; let newGems = userData.gems;
            let newInventory = userData.inventory || [];

            // --- NEUE LOGIK: Spezifische Belohnungen ---
            if (catKey === 'daily') {
                newGems += 10;
                rewardMessage = "Bonus: 10 Edelsteine";
            } else if (catKey === 'weekly') {
                newCoins += 7500;
                rewardMessage = "Bonus: 7.500 Münzen";
            } else if (catKey === 'monthly') {
                // Zufällige Elementar-Truhe
                const elements = ['FIRE', 'WATER', 'EARTH', 'WIND'];
                const randomElement = elements[Math.floor(Math.random() * elements.length)];
                const newBox = { id: Date.now(), type: 'LOOTBOX', variant: `ELEMENTAL_${randomElement}`, obtainedAt: new Date().toISOString() };
                newInventory = [...newInventory, newBox];
                updates['inventory'] = newInventory;
                rewardMessage = `Bonus: Elementar-Truhe (${randomElement})`;
            }
            // -------------------------------------------

            let newXp = (userData.xp || 0) + xpGain;
            let newLevel = calculatePlayerLevel(newXp);
            let newXpToNext = getXpToNextPlayerLevel(newLevel);
            if (newLevel > userData.level) { newCoins += 1000; newGems += 5; }
            updates['level'] = newLevel; updates['xp'] = newXp; updates['xpToNextLevel'] = newXpToNext; updates['coins'] = newCoins; updates['gems'] = newGems;
            transaction.update(userRef, updates);
        });
        return { message: rewardMessage };
    } catch (e) { console.error("Fehler beim Abholen der Gesamt-Belohnung:", e); return { message: null }; }
};
export const adminResetQuests = async (userId) => { if (!userId) return; try { const userRef = doc(db, "users", userId); await updateDoc(userRef, { quests: { daily: generatePatchedQuests('DAILY'), weekly: generatePatchedQuests('WEEKLY'), monthly: generatePatchedQuests('MONTHLY') } }); console.log("Quests wurden zurückgesetzt!"); return true; } catch (e) { console.error("Fehler beim Quest-Reset:", e); return false; } };
export const clearMarketplace = async () => { try { const q = query(collection(db, "market")); const snapshot = await getDocs(q); const deletePromises = []; snapshot.forEach((doc) => { deletePromises.push(deleteDoc(doc.ref)); }); await Promise.all(deletePromises); return true; } catch (e) { return false; } };
export const setBattleActive = async (userId, isActive) => { if (!userId) return; try { const userRef = doc(db, "users", userId); await setDoc(userRef, { isInBattle: isActive }, { merge: true }); } catch (e) { console.error("[DB] Fehler beim Setzen des Kampf-Status:", e); } };
export const checkAndResolveInterruptedBattle = async (userId) => { if (!userId) return null; const userRef = doc(db, "users", userId); try { return await runTransaction(db, async (transaction) => { const userDoc = await transaction.get(userRef); if (!userDoc.exists()) return null; const userData = userDoc.data(); if (userData.isInBattle === true) { const newStats = { ...(userData.stats || {}) }; newStats.pvpTotal = (newStats.pvpTotal || 0) + 1; const newRating = Math.max(0, (userData.rating || 1000) - 25); transaction.update(userRef, { isInBattle: false, stats: newStats, rating: newRating }); return { resolved: true, ratingLoss: 25 }; } return { resolved: false }; }); } catch (e) { if (e.code === 'failed-precondition') { console.warn("[DB] Transaction precondition failed - Kampfstatus hat sich geändert (OK)."); } else { console.error("[DB] Fehler beim Check:", e); } return null; } };
export const calculateEloChange = (ratingA, ratingB, isWin) => {
    const K = 32;
    const expected = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const actual = isWin ? 1 : 0;
    return Math.round(K * (actual - expected));
};

// --- DAILY LOGIN LOGIC ---
export const claimDailyLoginReward = async (user) => {
    const userRef = doc(db, "users", user.id);
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check ob schon abgeholt
    if (user.lastLoginDate === today) return null;

    // Check Streak (Gestern oder Heute erlaubt, sonst Reset)
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = user.loginStreak || 0;
    if (user.lastLoginDate !== yesterdayStr && user.lastLoginDate !== today && user.lastLoginDate) {
        currentStreak = 0; // Reset wenn Tag verpasst
    }

    const nextStreak = currentStreak + 1;
    const dayIndex = (currentStreak) % 7; // 0-6 Index für 7 Tage Zyklus

    const rewardSets = [
        [{ type: 'COINS', amount: 50 }],
        [{ type: 'COINS', amount: 100 }, { type: 'GEMS', amount: 1 }],
        [{ type: 'COINS', amount: 150 }, { type: 'GEMS', amount: 2 }],
        [{ type: 'COINS', amount: 200 }, { type: 'GEMS', amount: 3 }],
        [{ type: 'COINS', amount: 250 }, { type: 'GEMS', amount: 5 }, { type: 'LOOTBOX', variant: 'MYSTERY_EGG', amount: 1 }],
        [{ type: 'COINS', amount: 300 }, { type: 'GEMS', amount: 7 }],
        [{ type: 'COINS', amount: 500 }, { type: 'GEMS', amount: 10 }, { type: 'LOOTBOX', variant: 'MYSTERY_EGG', amount: 2 }],
    ];

    const dayRewards = rewardSets[dayIndex];

    let updates = {
        lastLoginDate: today,
        loginStreak: nextStreak
    };

    let newCoins = user.coins || 0;
    let newGems = user.gems || 0;
    let newInventory = [...(user.inventory || [])];

    for (const reward of dayRewards) {
        if (reward.type === 'COINS') newCoins += reward.amount;
        if (reward.type === 'GEMS') newGems += reward.amount;
        if (reward.type === 'LOOTBOX') {
            const newItems = Array.from({ length: reward.amount }, (_, i) => ({
                id: Date.now() + i, type: 'LOOTBOX', variant: reward.variant
            }));
            newInventory = [...newInventory, ...newItems];
        }
    }

    updates.coins = newCoins;
    updates.gems = newGems;
    updates.inventory = newInventory;

    await updateDoc(userRef, updates);
    return { rewards: dayRewards, streak: nextStreak };
};

export { deleteField };

export const getUserRankAndPercent = async (user, type = 'elo') => {
    if (!user) return null;
    try {
        const usersRef = collection(db, "users");

        const compareField = type === 'gauntlet' ? 'stats.gauntletHighscore' : 'rating';
        const userValue = type === 'gauntlet' ? (user.stats?.gauntletHighscore || 0) : (user.rating || 1000);

        // Anzahl User mit höherem Rating zählen
        const qHigher = query(usersRef, where(compareField, ">", userValue));
        const snapshotHigher = await getCountFromServer(qHigher);
        const rank = snapshotHigher.data().count + 1;

        const snapshotTotal = await getCountFromServer(usersRef);
        const total = snapshotTotal.data().count;

        const percent = total > 0 ? (rank / total) * 100 : 100;
        return { rank, percent, total };
    } catch (e) {
        console.error("Fehler beim Abrufen des Rangs:", e);
        return null;
    }
};