// src/hooks/useGameLogic/actions/collectResources.js

import { RESOURCES, RESOURCE_ITEMS } from '../../../data/gameData';
import { TRANSLATIONS } from '../../../data/translations';
import { updateUser, trackQuestProgress, batchUpdatePetsXp } from '../../../utils/db';
import { playSound } from '../../../utils/soundManager';
import { VILLAGE_EVENT_TYPES, getActiveVillageEvents } from '../../../data/villageEvents';

const calculateProductionRate = (resourceId, buildingLevel, assignedPetIds, myPets, RARITY_MULTIPLIERS, researchMultiplier = 1) => {
    const FIXED_CYCLE_TIME = 10;

    let originalCycleTime = 10 - ((buildingLevel - 1) * 0.05);
    if (originalCycleTime < 1) originalCycleTime = 1;

    const yieldMultiplier = 10 / originalCycleTime;

    if (resourceId === 'training' || resourceId === 'barracks') {
        const hasWorkers = assignedPetIds.some(id => id);
        if (!hasWorkers) return 0;
        return (1 * yieldMultiplier * researchMultiplier) / FIXED_CYCLE_TIME;
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

    return (totalMultiplier * yieldMultiplier * researchMultiplier) / FIXED_CYCLE_TIME;
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

    // Compute research production multiplier
    const research = user.village.research || {};
    let prodMultiplier = 1.0;
    if (research.research_prod_1) prodMultiplier *= 1.05;
    if (research.research_prod_2) prodMultiplier *= 1.10;

    // Apply global village event multipliers (STORM, FESTIVAL)
    const activeEvents = getActiveVillageEvents(user);
    for (const event of activeEvents) {
        const eventType = VILLAGE_EVENT_TYPES[event.type];
        if (eventType?.effect?.type === 'GLOBAL_PROD') {
            prodMultiplier *= eventType.effect.value;
        }
    }

    // Compute research XP multiplier
    let xpMultiplier = 1.0;
    if (research.research_xp_1) xpMultiplier *= 1.10;
    if (research.research_xp_2) xpMultiplier *= 1.20;

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

        // Per-resource event bonus (e.g. HARVEST_BONUS for alchemy_lab + stardust)
        let resourceEventMultiplier = 1.0;
        for (const event of activeEvents) {
            const eventType = VILLAGE_EVENT_TYPES[event.type];
            if (eventType?.effect?.type === 'RESOURCE_BONUS' && eventType.effect.resources.includes(resKey)) {
                resourceEventMultiplier *= eventType.effect.value;
            }
        }

        const ratePerSecond = calculateProductionRate(resKey, buildingLvl, workerIds, myPets, RARITY_MULTIPLIERS, prodMultiplier * resourceEventMultiplier);

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
                        if (resKey === 'training') {
                            const xpAmount = Math.round(finishedItems * 10 * xpMultiplier);
                            petXpUpdates[petId] = (petXpUpdates[petId] || 0) + xpAmount;
                        } else if (resKey === 'barracks') {
                            // Barracks: 25 XP per cycle (higher intensity than Training Ground)
                            const xpAmount = Math.round(finishedItems * 25 * xpMultiplier);
                            petXpUpdates[petId] = (petXpUpdates[petId] || 0) + xpAmount;
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

                        totalXpGained += Math.round(10 * xpMultiplier);
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

        if (itemsLog.length > 0) {
            trackQuestProgress(user, 'COLLECT_RESOURCE', itemsLog.length, ['COLLECT_RESOURCE']);
        }

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
