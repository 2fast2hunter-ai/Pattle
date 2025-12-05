import { db } from '../firebase';
import { 
  doc, getDoc, setDoc, updateDoc, collection, addDoc, 
  onSnapshot, query, where, deleteDoc, orderBy, limit, getDocs,
  runTransaction, increment 
} from 'firebase/firestore';
import { generatePet, generateQuests } from './gameMechanics'; 

// --- USER MANAGEMENT ---
export const initializeUser = async (firebaseUser, username) => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() }; 
  } else {
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
      team: [], 
      inventory: [{ id: Date.now(), type: 'LOOTBOX', variant: 'STARTER' }], 
      friends: [],
      stats: { pvpWins: 0, pvpTotal: 0, hatched: 0, bred: 0, marketSpent: 0, marketEarned: 0 },
      quests: { 
          daily: generateQuests('DAILY'),
          weekly: generateQuests('WEEKLY'),
          monthly: generateQuests('MONTHLY')
      },
      redeemedTickets: 0, 
      adTickets: 0, 
      buffs: { coinBoostMatches: 0, xpBoostMatches: 0 }
    };
    await setDoc(userRef, newUserData);
    return newUserData;
  }
};

// --- LISTENERS MIT ERROR HANDLING ---

export const listenToUser = (userId, callback) => {
  console.log("[DB] Starte User-Listener für:", userId);
  return onSnapshot(doc(db, "users", userId), 
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        console.warn("[DB] User Dokument existiert (noch) nicht!");
      }
    }, 
    (error) => {
      console.error("[DB] FEHLER im User-Listener:", error);
    }
  );
};

export const listenToPets = (userId, callback) => {
  const q = query(collection(db, "pets"), where("ownerId", "==", userId));
  return onSnapshot(q, 
    (snapshot) => {
      const pets = [];
      snapshot.forEach((doc) => pets.push({ id: doc.id, ...doc.data() }));
      callback(pets);
    },
    (error) => {
      console.error("[DB] FEHLER im Pets-Listener:", error);
    }
  );
};

export const listenToMarket = (callback) => {
  return onSnapshot(collection(db, "market"), 
    (snapshot) => {
      const listings = [];
      snapshot.forEach((doc) => listings.push({ id: doc.id, ...doc.data() }));
      callback(listings);
    },
    (error) => {
      console.error("[DB] FEHLER im Market-Listener:", error);
    }
  );
};

// --- GENERAL ACTIONS ---
export const updateUser = async (userId, data) => {
  if (!userId) return;
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

// --- MARKTPLATZ TRANSAKTION ---
export const buyMarketItem = async (user, listingId) => {
    const listingRef = doc(db, "market", listingId);
    const buyerRef = doc(db, "users", user.id);

    try {
        await runTransaction(db, async (transaction) => {
            const listingSnap = await transaction.get(listingRef);
            if (!listingSnap.exists()) throw new Error("Angebot nicht mehr verfügbar.");

            const listing = listingSnap.data();
            const price = listing.price;
            const sellerId = listing.sellerId;
            
            if (sellerId === user.id) throw new Error("Du kannst dein eigenes Angebot nicht kaufen.");

            const buyerSnap = await transaction.get(buyerRef);
            if (!buyerSnap.exists()) throw new Error("Käufer Profilfehler.");
            
            const currentCoins = buyerSnap.data().coins || 0;
            if (currentCoins < price) throw new Error("Nicht genug Münzen!");

            const fee = Math.floor(price * 0.05);
            const payout = price - fee;
            const sellerRef = doc(db, "users", sellerId);

            transaction.update(buyerRef, {
                coins: increment(-price),
                "stats.marketSpent": increment(price)
            });

            transaction.update(sellerRef, {
                coins: increment(payout),
                "stats.marketEarned": increment(payout)
            });

            if (listing.pets && Array.isArray(listing.pets)) {
                listing.pets.forEach((p, index) => {
                    const newId = `${Date.now()}_${index}_${Math.floor(Math.random()*1000)}`;
                    const newPet = { ...p, id: newId, ownerId: user.id };
                    const newPetRef = doc(db, "pets", newId);
                    transaction.set(newPetRef, newPet);
                });
            } else {
                const newId = `${Date.now()}_${Math.floor(Math.random()*1000)}`;
                const newPet = { ...listing.pet, id: newId, ownerId: user.id };
                transaction.set(doc(db, "pets", newId), newPet);
            }

            transaction.delete(listingRef);
        });

        return { success: true, message: `Kauf erfolgreich!` };

    } catch (e) {
        console.error("Marktplatz Fehler:", e);
        return { success: false, message: e.message };
    }
};

// --- RESTLICHE FUNKTIONEN ---
export const getLeaderboard = async () => {
  const q = query(collection(db, "users"), orderBy("rating", "desc"), limit(101));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const findUserPublic = async (targetId) => {
    try {
        const docRef = doc(db, "users", targetId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
        return null;
    } catch (e) { return null; }
}

export const checkAndResetQuests = async (user) => {
    if (!user || !user.id) return;
    const now = Date.now();
    let updates = {};
    let hasUpdates = false;
    const checkCategory = (catKey, catName) => {
        const current = user.quests?.[catKey];
        if (!current || !current.expiresAt || now > current.expiresAt) { 
            const newData = generateQuests(catName);
            updates[`quests.${catKey}`] = newData;
            hasUpdates = true;
        }
    };
    checkCategory('daily', 'DAILY');
    checkCategory('weekly', 'WEEKLY');
    checkCategory('monthly', 'MONTHLY');
    if (hasUpdates) await updateDoc(doc(db, "users", user.id), updates);
};

export const trackQuestProgress = async (user, actionType, amount = 1, subTypes = []) => {
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
                if (!categoryData || !categoryData.quests) return;
                let categoryChanged = false;
                const updatedList = categoryData.quests.map(quest => {
                    const isMatch = (quest.type === actionType) || (subTypes && subTypes.includes(quest.type));
                    if (isMatch && !quest.claimed && quest.progress < quest.target) {
                        const newProgress = Math.min(quest.target, quest.progress + amount);
                        if (newProgress !== quest.progress) {
                            categoryChanged = true;
                            return { ...quest, progress: newProgress };
                        }
                    }
                    return quest;
                });
                if (categoryChanged) { updates[`quests.${catKey}.quests`] = updatedList; hasUpdates = true; }
            });
            if (hasUpdates) { transaction.update(userRef, updates); }
        });
    } catch (e) { console.error("Fehler beim Quest-Tracking:", e); }
};

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
      if (quest.rewardType === 'COINS') { newCoins += quest.rewardAmount; rewardMessage = `+${quest.rewardAmount} Münzen`; } 
      else if (quest.rewardType === 'GEMS') { newGems += quest.rewardAmount; rewardMessage = `+${quest.rewardAmount} Edelsteine`; } 
      else if (quest.rewardType === 'XP') { xpGain = quest.rewardAmount; rewardMessage = `+${quest.rewardAmount} XP`; } 
      else if (quest.rewardType.startsWith('EGG')) {
        const rarity = quest.rewardType.split('_')[1];
        const newEgg = generatePet(1, null, rarity, null, 'QUEST');
        newEgg.isEgg = true; newEgg.hatchAt = 0;
        transaction.set(doc(db, "pets", newEgg.id), { ...newEgg, ownerId: userData.id });
        rewardMessage = `Ei (${rarity}) erhalten!`;
      }
      let newLevel = userData.level; let newXp = (userData.xp || 0) + xpGain; let newXpToNext = userData.xpToNextLevel;
      
      while (newXp >= newXpToNext) { 
          newLevel++; 
          newXp -= newXpToNext; 
          newXpToNext = Math.floor(newXpToNext * 1.5); 
          newCoins += 1000; 
          newGems += 5; 
      }
      
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
      const reward = categoryData.reward;
      let updates = { [`quests.${catKey}.claimedComposite`]: true };
      let xpGain = 0; let newCoins = userData.coins; let newGems = userData.gems;
      rewardMessage = `Bonus: ${reward.label}. `;
      if (reward.rewardType === 'COINS') { newCoins += reward.rewardAmount; rewardMessage += `+${reward.rewardAmount} Münzen`; } 
      else if (reward.rewardType === 'GEMS') { newGems += reward.rewardAmount; rewardMessage += `+${reward.rewardAmount} Edelsteine`; } 
      else if (reward.rewardType.startsWith('EGG')) {
        const rarity = reward.rewardType.split('_')[1];
        const newEgg = generatePet(1, null, rarity, null, 'QUEST_COMPOSITE');
        newEgg.isEgg = true; newEgg.hatchAt = 0;
        transaction.set(doc(db, "pets", newEgg.id), { ...newEgg, ownerId: userData.id });
        rewardMessage += `Ei (${rarity}) erhalten!`;
      } else if (reward.rewardType === 'XP') { xpGain = reward.rewardAmount; rewardMessage += `+${reward.rewardAmount} XP`; }
      let newLevel = userData.level; let newXp = (userData.xp || 0) + xpGain; let newXpToNext = userData.xpToNextLevel;

      while (newXp >= newXpToNext) { 
          newLevel++; 
          newXp -= newXpToNext; 
          newXpToNext = Math.floor(newXpToNext * 1.5); 
          newCoins += 1000; 
          newGems += 5; 
      }
      
      updates['level'] = newLevel; updates['xp'] = newXp; updates['xpToNextLevel'] = newXpToNext; updates['coins'] = newCoins; updates['gems'] = newGems;
      transaction.update(userRef, updates);
    });
    return { message: rewardMessage };
  } catch (e) { console.error("Fehler beim Abholen der Gesamt-Belohnung:", e); return { message: null }; }
};

export const adminResetQuests = async (userId) => {
    if (!userId) return;
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            quests: {
                daily: generateQuests('DAILY'),
                weekly: generateQuests('WEEKLY'),
                monthly: generateQuests('MONTHLY')
            }
        });
        console.log("Quests wurden zurückgesetzt!");
        return true;
    } catch (e) {
        console.error("Fehler beim Quest-Reset:", e);
        return false;
    }
};

export const clearMarketplace = async () => {
    try {
        const q = query(collection(db, "market"));
        const snapshot = await getDocs(q);
        const deletePromises = [];
        snapshot.forEach((doc) => { deletePromises.push(deleteDoc(doc.ref)); });
        await Promise.all(deletePromises);
        return true;
    } catch (e) { return false; }
};