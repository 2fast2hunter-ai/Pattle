import { updateUser, updatePetInDB, trackQuestProgress } from '../../../utils/db';
import { RESOURCES, ALLOWED_TYPES, RARITY_MULTIPLIERS, UPGRADE_COSTS, RESOURCE_ITEMS, TRADE_RECIPES, MILESTONES, COSMETICS, SPECIAL_OFFERS } from '../../../data/gameData';
import { getLevelUpStats, calculateMaxXp } from '../../../utils/gameMechanics'; // NEU IMPORTIEREN

export function useVillageActions(state, showNotification) {
    const { user, myPets } = state;

    const calculateProductionRate = (resourceId, buildingLevel, assignedPetIds) => {
        let cycleTime = 10 - ((buildingLevel - 1) * 0.05);
        if (cycleTime < 1) cycleTime = 1; 
        let totalMultiplier = 0;
        assignedPetIds.forEach(petId => {
            if (!petId) return;
            const pet = myPets.find(p => p.id === petId);
            if (pet) {
                totalMultiplier += (RARITY_MULTIPLIERS[pet.rarity] || 1.0);
            }
        });
        if (totalMultiplier === 0) return 0;
        return totalMultiplier / cycleTime;
    };

    const assignWorker = async (resourceId, slotIndex, petId) => {
        if (!user) return;
        await collectVillageResources(); 
        if (slotIndex >= user.village.level) { showNotification(`Dorf Level ${slotIndex + 1} benötigt!`, 'error'); return; }
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;
        for (const [resKey, slots] of Object.entries(user.village.workers)) {
            if (slots.includes(petId)) { showNotification(`${pet.name} arbeitet bereits!`, 'error'); return; }
        }
        if (user.team.includes(petId)) { showNotification(`${pet.name} ist im Kampfteam!`, 'error'); return; }
        const allowedTypes = ALLOWED_TYPES[resourceId];
        if (!allowedTypes.includes(pet.type)) { showNotification(`Falscher Typ!`, 'error'); return; }
        const currentWorkers = user.village.workers[resourceId];
        for (const workerId of currentWorkers) {
            if (workerId && workerId !== petId) { 
                const worker = myPets.find(p => p.id === workerId);
                if (worker && worker.type === pet.type) { showNotification(`Ein ${pet.type}-Pet arbeitet hier schon!`, 'error'); return; }
            }
        }
        const newWorkers = { ...user.village.workers };
        newWorkers[resourceId][slotIndex] = petId;
        await updateUser(user.id, { "village.workers": newWorkers });
        showNotification(`${pet.name} zugewiesen!`, 'success');
    };

    const removeWorker = async (resourceId, slotIndex) => {
        if (!user) return;
        await collectVillageResources();
        const newWorkers = { ...user.village.workers };
        newWorkers[resourceId][slotIndex] = null;
        await updateUser(user.id, { "village.workers": newWorkers });
        showNotification("Arbeiter entfernt.", 'info');
    };

    const addIdleTime = async () => {
        if (!user) return;
        if ((user.adTickets || 0) < 1) { showNotification("Keine Tickets!", "error"); return; }
        const now = Date.now();
        const currentExpire = user.village.idleTimeExpiresAt || 0;
        const newExpire = Math.max(now, currentExpire) + (10 * 60 * 1000); 
        await updateUser(user.id, { adTickets: user.adTickets - 1, "village.idleTimeExpiresAt": newExpire });
        showNotification("Idle Zeit verlängert!", "success");
    };

    const collectVillageResources = async () => {
        if (!user) return;
        const now = Date.now();
        const lastCollection = user.village.lastCollectionTime || now;
        const idleExpires = user.village.idleTimeExpiresAt || 0;
        const productionEnd = Math.min(now, idleExpires);
        let elapsedSeconds = 0;
        if (productionEnd > lastCollection) { elapsedSeconds = (productionEnd - lastCollection) / 1000; }
        const nextCollectionTime = now;

        if (elapsedSeconds <= 0) {
            await updateUser(user.id, { "village.lastCollectionTime": nextCollectionTime });
            return null; 
        }

        let totalXpGained = 0;
        let updates = {};
        let newStorage = { ...(user.village.storage || {}) };
        let newResourcesBuffer = { ...(user.village.resources || {}) };
        let newStats = { ...(user.village.stats || {}) };
        if (!newStats.totalCollected) newStats.totalCollected = {};
        if (!newStats.totalItemsCollected) newStats.totalItemsCollected = {};
        newStats.totalIdleTime = (newStats.totalIdleTime || 0) + elapsedSeconds;

        let somethingProduced = false;
        let itemsLog = []; 
        let petXpUpdates = {};

        for (const resKey of Object.keys(newResourcesBuffer)) {
            const buildingLvl = user.village.buildings[resKey] || 1;
            const workerIds = user.village.workers[resKey] || [];
            const ratePerSecond = calculateProductionRate(resKey, buildingLvl, workerIds);
            
            if (ratePerSecond > 0) {
                const produced = ratePerSecond * elapsedSeconds;
                if (!isNaN(produced)) { newResourcesBuffer[resKey] = (newResourcesBuffer[resKey] || 0) + produced; }
                const finishedItems = Math.floor(newResourcesBuffer[resKey]);
                
                if (finishedItems > 0) {
                    somethingProduced = true;
                    newResourcesBuffer[resKey] -= finishedItems;
                    newStats.totalCollected[resKey] = (newStats.totalCollected[resKey] || 0) + finishedItems;
                    workerIds.forEach(petId => { if (petId) petXpUpdates[petId] = (petXpUpdates[petId] || 0) + finishedItems; });
                    const dropTable = RESOURCE_ITEMS[resKey] || [];
                    if (dropTable.length > 0) {
                        for (let i = 0; i < finishedItems; i++) {
                            let roll = Math.random() * 100;
                            let dropped = dropTable[0];
                            for (const item of dropTable) { if (roll <= item.chance) { dropped = item; break; } roll -= item.chance; }
                            const itemId = dropped.id;
                            newStorage[itemId] = (newStorage[itemId] || 0) + 1;
                            newStats.totalItemsCollected[itemId] = (newStats.totalItemsCollected[itemId] || 0) + 1;
                            totalXpGained += 10;
                            if (itemsLog.length < 5) itemsLog.push(dropped.label);
                        }
                        if (finishedItems > 5) itemsLog.push(`...`);
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
                showNotification(`Dorf Level Up! Level ${currentLvl}`, 'success');
            }

            // --- PETS LEVEL UP LOGIC (VILLAGE) ---
            Object.entries(petXpUpdates).forEach(([petId, xpAmount]) => {
                const pet = myPets.find(p => p.id === petId);
                if (pet) {
                    let pXp = (pet.xp || 0) + xpAmount;
                    let pLevel = pet.level || 1;
                    let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel);
                    
                    let leveledUpCount = 0;
                    let currentStats = { 
                        maxHp: pet.maxHp, atk: pet.atk, def: pet.def, 
                        ap: pet.ap, res: pet.res, speed: pet.speed 
                    };

                    while (pXp >= currentMaxXp) {
                        pXp -= currentMaxXp;
                        pLevel++;
                        currentMaxXp = calculateMaxXp(pLevel);
                        leveledUpCount++;

                        // Fixe Stats addieren
                        const growth = getLevelUpStats(pet.rarity);
                        currentStats.maxHp += growth.hp;
                        currentStats.atk += growth.atk;
                        currentStats.def += growth.def;
                        currentStats.ap += growth.ap;
                        currentStats.res += growth.res;
                        currentStats.speed += growth.speed;
                    }

                    if (leveledUpCount > 0) {
                        updatePetInDB(petId, { 
                            ...currentStats, 
                            level: pLevel, 
                            xp: pXp, 
                            maxXp: currentMaxXp,
                            hp: currentStats.maxHp
                        });
                        trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount);
                    } else {
                        updatePetInDB(petId, { xp: pXp });
                    }
                }
            });

            updates["village.level"] = currentLvl;
            updates["village.xp"] = currentXp;
            updates["village.xpToNext"] = xpToNext;
            updates["village.lastCollectionTime"] = nextCollectionTime;
            updates["village.resources"] = newResourcesBuffer;
            updates["village.storage"] = newStorage;
            updates["village.stats"] = newStats;

            await updateUser(user.id, updates);
            return { items: itemsLog, xp: totalXpGained };
        } else {
            await updateUser(user.id, { 
                "village.lastCollectionTime": nextCollectionTime, 
                "village.resources": newResourcesBuffer, 
                "village.stats.totalIdleTime": newStats.totalIdleTime 
            });
            return null;
        }
    };

    const upgradeBuilding = async (resourceId) => {
        if (!user) return;
        const currentLvl = user.village.buildings[resourceId] || 1;
        if (currentLvl >= 14) { showNotification("Maximales Level!", 'error'); return; }
        const nextLvlData = UPGRADE_COSTS.find(u => u.level === currentLvl + 1);
        if (!nextLvlData) return;
        const cost = nextLvlData.cost; 
        if (user.coins < cost) { showNotification("Zu wenig Gold!", 'error'); return; }
        await updateUser(user.id, { coins: user.coins - cost, [`village.buildings.${resourceId}`]: currentLvl + 1 });
        showNotification(`${RESOURCES[resourceId.toUpperCase()].label} verbessert!`, 'success');
    };

    const tradeResources = async (offerItemId, wantItemId, amountOfTrades) => {
        if (!user) return;
        const storage = user.village.storage || {};
        const recipe = TRADE_RECIPES.find(r => r.offerId === offerItemId && r.wantId === wantItemId);
        if (!recipe) { showNotification("Dieser Tausch ist nicht möglich!", "error"); return; }
        const totalCost = recipe.cost * amountOfTrades;
        const totalReceive = recipe.receive * amountOfTrades;
        if (!storage[offerItemId] || storage[offerItemId] < totalCost) { showNotification("Nicht genügend Material!", "error"); return; }
        const newStorage = { ...storage };
        newStorage[offerItemId] -= totalCost;
        newStorage[wantItemId] = (newStorage[wantItemId] || 0) + totalReceive;
        await updateUser(user.id, { "village.storage": newStorage });
        showNotification(`Tausch erfolgreich: +${totalReceive} Items`, "success");
    };

    const claimMilestone = async (milestoneId) => {
        if (!user) return;
        const milestone = MILESTONES.find(m => m.id === milestoneId);
        if (!milestone) return;
        const claimed = user.village.milestones || {};
        const currentLevel = claimed[milestoneId] || 0;
        const requiredTotal = milestone.target * (currentLevel + 1);
        let current = 0;
        if (milestone.type === 'TIME') { current = user.village.stats?.totalIdleTime || 0; } 
        else { current = user.village.stats?.totalItemsCollected?.[milestone.itemId] || 0; }
        if (current < requiredTotal) { showNotification("Ziel noch nicht erreicht!", "error"); return; }
        let updates = { [`village.milestones.${milestoneId}`]: currentLevel + 1 };
        if (milestone.reward.type === 'COINS') { updates['coins'] = (user.coins || 0) + milestone.reward.amount; } 
        else if (milestone.reward.type === 'GEMS') { updates['gems'] = (user.gems || 0) + milestone.reward.amount; } 
        else if (milestone.reward.type === 'VILLAGE_XP') { 
            let currentLvl = user.village.level; let currentXp = user.village.xp + milestone.reward.amount; let xpToNext = user.village.xpToNext; 
            while (currentXp >= xpToNext && currentLvl < 20) { currentLvl++; currentXp -= xpToNext; xpToNext = Math.floor(xpToNext * 1.5); showNotification(`Dorf Level Up! Level ${currentLvl}`, 'success'); } 
            updates['village.level'] = currentLvl; updates['village.xp'] = currentXp; updates['village.xpToNext'] = xpToNext; 
        } else if (milestone.reward.type === 'CONSUMABLE') {
            const newItems = [];
            for(let i=0; i < milestone.reward.amount; i++) {
                newItems.push({ id: Date.now() + Math.random(), type: 'CONSUMABLE', variant: milestone.reward.variant });
            }
            const currentInventory = user.inventory || [];
            updates['inventory'] = [...currentInventory, ...newItems];
        }
        await updateUser(user.id, updates);
        showNotification(`Meilenstein (Stufe ${currentLevel + 1}) erreicht!`, "success");
    };

    const buyCosmetic = async (cosmeticId) => {
        if (!user) return;
        const cosmetic = COSMETICS[cosmeticId];
        if (!cosmetic) return;
        const storage = user.village.storage || {};
        const costItem = cosmetic.costItem;
        const costAmount = cosmetic.costAmount;
        if (!storage[costItem] || storage[costItem] < costAmount) { showNotification("Nicht genügend Materialien!", "error"); return; }
        const newStorage = { ...storage };
        newStorage[costItem] -= costAmount;
        const newItem = { id: Date.now() + Math.random(), type: 'CONSUMABLE', variant: cosmeticId };
        const newInventory = [...(user.inventory || []), newItem];
        await updateUser(user.id, { "village.storage": newStorage, "inventory": newInventory });
        showNotification(`${cosmetic.label} gekauft!`, "success");
    };

    const buySpecialOffer = async (offerId) => {
        if (!user) return;
        const offer = SPECIAL_OFFERS.find(o => o.id === offerId);
        if (!offer) return;
        const storage = user.village.storage || {};
        const costItem = offer.costItem;
        const costAmount = offer.costAmount;
        if (!storage[costItem] || storage[costItem] < costAmount) { showNotification("Nicht genügend Materialien!", "error"); return; }
        const newStorage = { ...storage };
        newStorage[costItem] -= costAmount;
        let updates = { "village.storage": newStorage };
        if (offer.reward.type === 'AD_TICKET') { updates['adTickets'] = (user.adTickets || 0) + offer.reward.amount; } 
        else if (offer.reward.type === 'ITEM' || offer.reward.type === 'CONSUMABLE') {
            const newItem = {
                id: Date.now() + Math.random(),
                type: offer.reward.type === 'ITEM' ? offer.reward.itemType : 'CONSUMABLE',
                variant: offer.reward.variant || offer.reward.itemVariant
            };
            const newInventory = [...(user.inventory || []), newItem];
            updates['inventory'] = newInventory;
        }
        await updateUser(user.id, updates);
        showNotification(`${offer.label} gekauft!`, "success");
    };

    return { assignWorker, removeWorker, collectVillageResources, upgradeBuilding, calculateProductionRate, tradeResources, claimMilestone, addIdleTime, buyCosmetic, buySpecialOffer };
}