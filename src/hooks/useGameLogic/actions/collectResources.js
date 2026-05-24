// src/hooks/useGameLogic/actions/collectResources.js

import { RESOURCES, RESOURCE_ITEMS } from '../../../data/gameData';
import { TRANSLATIONS } from '../../../data/translations';
import { updateUser, trackQuestProgress, batchUpdatePetsXp } from '../../../utils/db';
import { playSound } from '../../../utils/soundManager';

const calculateProductionRate = (resourceId, buildingLevel, assignedPetIds, myPets, RARITY_MULTIPLIERS) => {
    // FIX: Standardisierte Zykluszeit von 10s für alle Gebäude
    // Statt schneller zu werden, produzieren höhere Level MEHR pro Zyklus.
    const FIXED_CYCLE_TIME = 10;

    // Berechne den alten Speed-Faktor um die Balance zu halten
    // Alter Cycle: 10 - ((Level-1)*0.05)
    // Yield Multiplier = 10 / AlterCycle
    let originalCycleTime = 10 - ((buildingLevel - 1) * 0.05);
    if (originalCycleTime < 1) originalCycleTime = 1;

    const yieldMultiplier = 10 / originalCycleTime;

    if (resourceId === 'training') {
        const hasWorkers = assignedPetIds.some(id => id);
        if (!hasWorkers) return 0;
        // Basis: 1 Item pro 10s * Yield (Level Bonus)
        return (1 * yieldMultiplier) / FIXED_CYCLE_TIME;
    }

    let totalMultiplier = 0;
    assignedPetIds.forEach(petId => {
        if (!petId) return;
        const pet = myPets.find(p => p.id === petId);
        if (pet) {
            totalMultiplier += (RARITY_MULTIPLIERS[pet.rarity] || 1.0);
        }
    });

    if (totalMultiplier === 0) return 0;

    // Rate = (Basis * Yield) / 10s
    return (totalMultiplier * yieldMultiplier) / FIXED_CYCLE_TIME;
};

export const collectResources = async ({
    user, myPets, RARITY_MULTIPLIERS, specificResourceId = null, showNotification, t
}) => {
    if (!user) return null;

    const now = Date.now();
    const idleExpires = user.village.idleTimeExpiresAt || 0;
    const globalLastCollection = user.village.lastCollectionTime || now;

    // Migration & Init collectionTimes
    let collectionTimes = { ...(user.village.collectionTimes || {}) };
    Object.values(RESOURCES).forEach(r => {
        if (!collectionTimes[r.id]) {
            collectionTimes[r.id] = globalLastCollection;
        }
    });

    let totalXpGained = 0;
    let newStorage = { ...(user.village.storage || {}) };
    let newResourcesBuffer = { ...(user.village.resources || {}) };

    let newStats = { ...(user.village.stats || {}) };
    if (!newStats.totalCollected) newStats.totalCollected = {};
    if (!newStats.totalItemsCollected) newStats.totalItemsCollected = {};

    if (!specificResourceId) {
        const productionEnd = Math.min(now, idleExpires);
        if (productionEnd > globalLastCollection) {
            const globalElapsed = (productionEnd - globalLastCollection) / 1000;
            if (globalElapsed > 0) {
                newStats.totalIdleTime = (newStats.totalIdleTime || 0) + globalElapsed;
            }
        }
    }

    let somethingProduced = false;
    let itemsLog = [];
    let petXpUpdates = {};

    for (const resKey of Object.values(RESOURCES).map(r => r.id)) {
        if (specificResourceId && resKey !== specificResourceId) continue;

        const buildingLvl = (user.village.buildings && user.village.buildings[resKey]) || 1;
        const workerIds = user.village.workers[resKey] || [];

        const lastCollection = collectionTimes[resKey];
        const productionEnd = Math.min(now, idleExpires);
        let elapsedSeconds = 0;
        if (productionEnd > lastCollection) {
            elapsedSeconds = (productionEnd - lastCollection) / 1000;
        }

        collectionTimes[resKey] = now;

        const ratePerSecond = calculateProductionRate(resKey, buildingLvl, workerIds, myPets, RARITY_MULTIPLIERS);

        if (ratePerSecond > 0) {
            const produced = ratePerSecond * elapsedSeconds;

            if (!isNaN(produced)) {
                newResourcesBuffer[resKey] = (newResourcesBuffer[resKey] || 0) + produced;
            }

            const finishedItems = Math.floor(newResourcesBuffer[resKey]);

            if (finishedItems > 0) {
                somethingProduced = true;
                newResourcesBuffer[resKey] -= finishedItems;
                newStats.totalCollected[resKey] = (newStats.totalCollected[resKey] || 0) + finishedItems;

                workerIds.forEach(petId => {
                    if (petId) {
                        // FIX: XP nur im Training Ground!
                        if (resKey === 'training') {
                            const xpMult = 10;
                            petXpUpdates[petId] = (petXpUpdates[petId] || 0) + (finishedItems * xpMult);
                        }
                    }
                });

                const dropTable = RESOURCE_ITEMS[resKey] || [];
                if (dropTable.length > 0) {
                    for (let i = 0; i < finishedItems; i++) {
                        let roll = Math.random() * 100;
                        let dropped = dropTable[0];

                        for (const item of dropTable) {
                            if (roll <= item.chance) {
                                dropped = item;
                                break;
                            }
                            roll -= item.chance;
                        }

                        const itemId = dropped.id;
                        newStorage[itemId] = (newStorage[itemId] || 0) + 1;
                        newStats.totalItemsCollected[itemId] = (newStats.totalItemsCollected[itemId] || 0) + 1;

                        totalXpGained += 10;
                        itemsLog.push(dropped.id);
                    }
                }
            }
        }
    }

    if (somethingProduced || totalXpGained > 0) {
        let currentLvl = user.village.level;
        let currentXp = user.village.xp + totalXpGained;
        let xpToNext = user.village.xpToNext || 16000;

        while (currentXp >= xpToNext && currentLvl < 20) {
            currentLvl++;
            currentXp -= xpToNext;
            xpToNext = Math.floor(xpToNext * 1.5);
            showNotification(t('notif_village_levelup', { level: currentLvl }), 'success');
            playSound('levelup');
        }

        // OPTIMIZED: Batch Update for Pet XP
        const updatesList = [];
        Object.entries(petXpUpdates).forEach(([petId, xpAmount]) => {
            const pet = myPets.find(p => p.id === petId);
            if (pet) {
                updatesList.push({ pet, xpAmount });
            }
        });

        const batchRes = await batchUpdatePetsXp(updatesList);

        if (batchRes.success && batchRes.results) {
            batchRes.results.forEach(res => {
                if (res.levelUp) {
                    const pet = myPets.find(p => p.id === res.petId);
                    if (pet) {
                        trackQuestProgress(user, 'LEVEL_UP_PET', res.levelsGained);
                        showNotification(t('notif_pet_levelup', { name: pet.name, level: res.newLevel }), 'success');
                        playSound('levelup');
                    }
                }
            });
        }

        const updates = {
            "village.level": currentLvl,
            "village.xp": currentXp,
            "village.xpToNext": xpToNext,
            "village.lastCollectionTime": now,
            "village.collectionTimes": collectionTimes,
            "village.resources": newResourcesBuffer,
            "village.storage": newStorage,
            "village.stats": newStats
        };

        await updateUser(user.id, updates);

        return { items: itemsLog, xp: totalXpGained };
    } else {
        await updateUser(user.id, {
            "village.lastCollectionTime": now,
            "village.collectionTimes": collectionTimes,
            "village.resources": newResourcesBuffer,
            "village.stats.totalIdleTime": newStats.totalIdleTime
        });
        return null;
    }
};

export { calculateProductionRate };
