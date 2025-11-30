import { db } from '../firebase';
import { 
  doc, getDoc, setDoc, updateDoc, collection, addDoc, 
  onSnapshot, query, where, deleteDoc, orderBy, limit, getDocs,
  runTransaction
} from 'firebase/firestore';
// KORREKTUR: initializeUserPets wurde entfernt.
import { generatePet, generateQuests } from './gameMechanics'; 

// --- USER MANAGEMENT ---

// src/utils/db.js
export const initializeUser = async (firebaseUser, username) => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Wenn User existiert, nur die Daten zurückgeben
    return userSnap.data(); 
  } else {
    // Neuer User
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
      team: [], 
      inventory: [{ id: Date.now(), type: 'LOOTBOX', variant: 'STARTER' }], 
      friends: [],
      stats: { pvpWins: 0, pvpTotal: 0, hatched: 0, bred: 0, marketSpent: 0, marketEarned: 0 },
      quests: { 
          daily: generateQuests('DAILY'),
          weekly: generateQuests('WEEKLY'),
          monthly: generateQuests('MONTHLY')
      },
      redeemedTickets: 0, // NEU: Der Zähler für eingelöste Tickets
    };

    await setDoc(userRef, newUserData);
    return newUserData;
  }
};

export const listenToUser = (userId, callback) => {
  return onSnapshot(doc(db, "users", userId), (doc) => {
    if (doc.exists()) callback(doc.data());
  });
};

export const listenToPets = (userId, callback) => {
  const q = query(collection(db, "pets"), where("ownerId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const pets = [];
    snapshot.forEach((doc) => pets.push(doc.data()));
    callback(pets);
  });
};

export const listenToMarket = (callback) => {
  return onSnapshot(collection(db, "market"), (snapshot) => {
    const listings = [];
    snapshot.forEach((doc) => listings.push({ id: doc.id, ...doc.data() }));
    callback(listings);
  });
};

// --- GENERAL ACTIONS ---

export const updateUser = async (userId, data) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};


export const addPetToDB = async (pet, ownerId) => {
  await setDoc(doc(db, "pets", pet.id), { ...pet, ownerId });
};

export const updatePetInDB = async (petId, data) => {
  await updateDoc(doc(db, "pets", petId), data);
};

export const removePetFromDB = async (petId) => {
    await deleteDoc(doc(db, "pets", petId));
}

export const createMarketListing = async (listing) => {
  const docRef = await addDoc(collection(db, "market"), listing);
  return docRef.id;
};

export const deleteMarketListing = async (listingId) => {
  await deleteDoc(doc(db, "market", listingId));
};
// --- LEADERBOARD & SOCIAL ---

export const getLeaderboard = async () => {
  // Holt die Top 101 Spieler sortiert nach Rating
  const q = query(
    collection(db, "users"), 
    orderBy("rating", "desc"), 
    limit(101) 
  );
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

export const checkAndResetQuests = async (user) => {
    if (!user) return;
    
    const now = Date.now();
    let updates = {};
    let hasUpdates = false;

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

export const trackQuestProgress = async (user, actionType, amount = 1) => {
    if (!user || !user.id || amount === 0) return;

    const userRef = doc(db, "users", user.id);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) return;

            const userData = userDoc.data();
            if (!userData.quests) return;

            let updates = {};
            let hasUpdates = false;

            ['daily', 'weekly', 'monthly'].forEach(catKey => {
                const categoryData = userData.quests[catKey];
                if (!categoryData) return;

                let categoryChanged = false;
                
                const updatedList = categoryData.quests.map(quest => {
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

            if (hasUpdates) {
                transaction.update(userRef, updates);
            }
        });
    } catch (e) {
        console.error("Fehler beim Quest-Tracking:", e);
    }
};

export const claimQuestReward = async (user, catKey, questId) => {
    const categoryData = user.quests[catKey];
    const questIndex = categoryData.quests.findIndex(q => q.id === questId);
    const quest = categoryData.quests[questIndex];

    if (!quest || quest.claimed || quest.progress < quest.target) return null;

    // 1. Quest als "claimed" markieren
    const updatedList = [...categoryData.quests];
    updatedList[questIndex] = { ...quest, claimed: true };
    
    // 2. Den Zähler für den Gesamtfortschritt erhöhen
    const newCompletedCount = categoryData.completedCount + 1;

    let updates = {
        [`quests.${catKey}.quests`]: updatedList,
        [`quests.${catKey}.completedCount`]: newCompletedCount 
    };

    // Belohnung verteilen (Einzel-Belohnung)
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
        const rarity = quest.rewardType.split('_')[1];
        const newEgg = generatePet(1, null, rarity, null, 'QUEST');
        newEgg.isEgg = true; 
        newEgg.hatchAt = 0;
        await setDoc(doc(db, "pets", newEgg.id), { ...newEgg, ownerId: user.id });
        rewardMessage = `Ei (${rarity}) erhalten!`;
    }

    await updateDoc(doc(db, "users", user.id), updates);
    return rewardMessage;
};

export const claimCompositeReward = async (user, catKey) => {
    const categoryData = user.quests[catKey];
    if (!categoryData || categoryData.completedCount < categoryData.totalQuests || categoryData.claimedComposite) return null;

    const reward = categoryData.reward;

    // Markiere als claimed
    let updates = {
        [`quests.${catKey}.claimedComposite`]: true 
    };

    // Belohnung verteilen
    let rewardMessage = `Gesamt-Belohnung: ${reward.label}. `;
    if (reward.rewardType === 'COINS') {
        updates['coins'] = user.coins + reward.rewardAmount;
        rewardMessage += `+${reward.rewardAmount} Münzen`;
    } else if (reward.rewardType === 'GEMS') {
        updates['gems'] = user.gems + reward.rewardAmount;
        rewardMessage += `+${reward.rewardAmount} Edelsteine`;
    } else if (reward.rewardType.startsWith('EGG')) {
        const rarity = reward.rewardType.split('_')[1];
        const newEgg = generatePet(1, null, rarity, null, 'QUEST_COMPOSITE');
        newEgg.isEgg = true; 
        newEgg.hatchAt = 0;
        await setDoc(doc(db, "pets", newEgg.id), { ...newEgg, ownerId: user.id });
        rewardMessage += `Ei (${rarity}) erhalten!`;
    } else if (reward.rewardType === 'XP') {
        updates['xp'] = user.xp + reward.rewardAmount;
        rewardMessage += `+${reward.rewardAmount} XP`;
    }

    await updateDoc(doc(db, "users", user.id), updates);
    return rewardMessage;
};