// src/utils/db.js (ganz oben)
import { db } from '../firebase';
import { 
  doc, getDoc, setDoc, updateDoc, collection, addDoc, 
  onSnapshot, query, where, deleteDoc, orderBy, limit, getDocs, 
  runTransaction
} from 'firebase/firestore';
// Importiere generateQuests UND generatePet (für Ei-Belohnungen)
import { generatePet, generateQuests } from './gameMechanics';

// --- USER MANAGEMENT ---

// Prüft, ob User existiert. Wenn nicht, wird er mit Starter-Pets erstellt.
// Prüft, ob User existiert. Wenn nicht, wird er erstellt (mit Starter Box).
export const initializeUser = async (firebaseUser, username) => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data(); 
  } else {
    // Neuer User: Wir geben ihm eine STARTER BOX ins Inventar (keine Pets)
    
    const newUserData = {
      id: firebaseUser.uid,
      username: username,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      coins: 500,
      gems: 10,
      avatar: '🛡️',
      rating: 1000,
      energy: 10,
      lastEnergyUpdate: Date.now(),
      team: [], // Noch kein Team!
      inventory: [{ id: Date.now(), type: 'LOOTBOX', variant: 'STARTER' }], // <--- Die Starter Box
      friends: [],
      stats: { pvpWins: 0, pvpTotal: 0, hatched: 0, bred: 0, marketSpent: 0, marketEarned: 0 }
    };

    await setDoc(userRef, newUserData);
    return newUserData;
  }
};

// Echtzeit-Listener für den User (aktualisiert sich automatisch bei Änderungen)
export const listenToUser = (userId, callback) => {
  return onSnapshot(doc(db, "users", userId), (doc) => {
    if (doc.exists()) callback(doc.data());
  });
};

// Echtzeit-Listener für die Pets des Users
export const listenToPets = (userId, callback) => {
  const q = query(collection(db, "pets"), where("ownerId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const pets = [];
    snapshot.forEach((doc) => pets.push(doc.data()));
    callback(pets);
  });
};

// Echtzeit-Listener für den Marktplatz
export const listenToMarket = (callback) => {
  return onSnapshot(collection(db, "market"), (snapshot) => {
    const listings = [];
    snapshot.forEach((doc) => listings.push({ id: doc.id, ...doc.data() }));
    callback(listings);
  });
};

// --- ACTIONS ---

export const updateUser = async (userId, data) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const addPetToDB = async (pet, ownerId) => {
  // Wir nutzen die Pet ID als Dokument ID
  await setDoc(doc(db, "pets", pet.id), { ...pet, ownerId });
};

export const updatePetInDB = async (petId, data) => {
  await updateDoc(doc(db, "pets", petId), data);
};

export const removePetFromDB = async (petId) => {
    await deleteDoc(doc(db, "pets", petId));
}

export const createMarketListing = async (listing) => {
  // Listing erstellen
  const docRef = await addDoc(collection(db, "market"), listing);
  return docRef.id;
};

export const deleteMarketListing = async (listingId) => {
  await deleteDoc(doc(db, "market", listingId));
};

// --- LEADERBOARD & SOCIAL ---

export const getLeaderboard = async () => {
  // Holt die Top 20 Spieler sortiert nach Rating
  const q = query(collection(db, "users"), orderBy("rating", "desc"), limit(20));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export const findUserPublic = async (targetId) => {
    // Sucht einen User anhand der ID (für Freundesliste)
    try {
        const docRef = doc(db, "users", targetId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return docSnap.data();
        return null;
    } catch (e) {
        console.error("User Search Error:", e);
        return null;
    }
}

// --- QUEST SYSTEM ---

// Initialisiert oder resettet Quests, wenn sie abgelaufen sind
export const checkAndResetQuests = async (user) => {
    if (!user) return;
    
    const now = Date.now();
    let updates = {};
    let hasUpdates = false;

    // Helper Funktion um eine Kategorie zu prüfen
    const checkCategory = (catKey, catName) => {
        const current = user.quests?.[catKey];
        if (!current || now > current.expiresAt) {
            const newData = generateQuests(catName);
            updates[`quests.${catKey}`] = newData;
            hasUpdates = true;
        }
    };

    checkCategory('daily', 'DAILY');
    checkCategory('weekly', 'WEEKLY');
    checkCategory('monthly', 'MONTHLY');

    if (hasUpdates) {
        await updateDoc(doc(db, "users", user.id), updates);
    }
};

// Trackt Fortschritt (wird von App.jsx aufgerufen bei Aktionen)
// Trackt Fortschritt (korrigierte Version)
// Trackt Fortschritt (Transaktions-Sicher)
export const trackQuestProgress = async (user, actionType, amount = 1) => {
    if (!user || !user.id || amount === 0) return;

    const userRef = doc(db, "users", user.id);

    try {
        await runTransaction(db, async (transaction) => {
            // 1. Frischen User-Stand aus der DB lesen
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) return;

            const userData = userDoc.data();
            if (!userData.quests) return;

            let updates = {};
            let hasUpdates = false;

            // 2. Alle Kategorien prüfen
            ['daily', 'weekly', 'monthly'].forEach(catKey => {
                const categoryData = userData.quests[catKey];
                if (!categoryData) return;

                let categoryChanged = false;
                
                const updatedList = categoryData.quests.map(quest => {
                    // Wenn Typ passt, nicht claimed ist und noch nicht fertig
                    if (quest.type === actionType && !quest.claimed && quest.progress < quest.target) {
                        const newProgress = Math.min(quest.target, quest.progress + amount);
                        if (newProgress !== quest.progress) {
                            categoryChanged = true;
                            return { ...quest, progress: newProgress };
                        }
                    }
                    return quest;
                });

                if (categoryChanged) {
                    updates[`quests.${catKey}.quests`] = updatedList;
                    hasUpdates = true;
                }
            });

            // 3. Nur schreiben, wenn sich wirklich was geändert hat
            if (hasUpdates) {
                transaction.update(userRef, updates);
            }
        });
    } catch (e) {
        console.error("Fehler beim Quest-Tracking:", e);
    }
};

// Belohnung abholen
export const claimQuestReward = async (user, catKey, questId) => {
    const categoryData = user.quests[catKey];
    const questIndex = categoryData.quests.findIndex(q => q.id === questId);
    const quest = categoryData.quests[questIndex];

    if (!quest || quest.claimed || quest.progress < quest.target) return null;

    // Quest als "claimed" markieren
    const updatedList = [...categoryData.quests];
    updatedList[questIndex] = { ...quest, claimed: true };

    let updates = {
        [`quests.${catKey}.quests`]: updatedList
    };

    // Belohnung verteilen
    let rewardMessage = "";
    if (quest.rewardType === 'COINS') {
        updates['coins'] = user.coins + quest.rewardAmount;
        rewardMessage = `+${quest.rewardAmount} Münzen`;
    } else if (quest.rewardType === 'GEMS') {
        updates['gems'] = user.gems + quest.rewardAmount;
        rewardMessage = `+${quest.rewardAmount} Edelsteine`;
    } else if (quest.rewardType === 'XP') {
        updates['xp'] = user.xp + quest.rewardAmount;
        rewardMessage = `+${quest.rewardAmount} XP`;
    } else if (quest.rewardType.startsWith('EGG')) {
        // Ei generieren
        const rarity = quest.rewardType === 'EGG_RARE' ? 'RARE' : 'COMMON';
        const newEgg = generatePet(1, null, rarity, null, 'QUEST');
        newEgg.isEgg = true; 
        newEgg.hatchAt = 0;
        await setDoc(doc(db, "pets", newEgg.id), { ...newEgg, ownerId: user.id });
        rewardMessage = `Ei (${rarity}) erhalten!`;
    }

    await updateDoc(doc(db, "users", user.id), updates);
    return rewardMessage;
};