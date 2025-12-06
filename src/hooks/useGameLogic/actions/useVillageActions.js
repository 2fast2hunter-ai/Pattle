import { updateUser, updatePetInDB, trackQuestProgress } from '../../../utils/db';
import { RESOURCES, ALLOWED_TYPES, RARITY_MULTIPLIERS, UPGRADE_COSTS, RESOURCE_ITEMS, TRADE_RECIPES, MILESTONES } from '../../../data/gameData';

export function useVillageActions(state, showNotification) {
    const { user, myPets } = state;

    const calculateProductionRate = (resourceId, buildingLevel, assignedPetIds) => {
        let cycleTime = 10 - ((buildingLevel - 1) * 0.05);
        if (cycleTime < 1) cycleTime = 1; 
        let totalMultiplier = 0;
        assignedPetIds.forEach(petId => {
            if (!petId) return;
            const pet = myPets.find(p => p.id === petId);
            if (pet) totalMultiplier += (RARITY_MULTIPLIERS[pet.rarity] || 1.0);
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

        if (user.team.includes(petId)) {
            showNotification(`${pet.name} ist im Kampfteam und kann nicht arbeiten!`, 'error');
            return;
        }

        for (const [resKey, slots] of Object.entries(user.village.workers)) {
            if (slots.includes(petId)) { showNotification(`${pet.name} arbeitet bereits!`, 'error'); return; }
        }

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

    // --- NEU: IDLE TIME AUFLADEN ---
    const addIdleTime = async () => {
        if (!user) return;
        if ((user.adTickets || 0) < 1) {
            showNotification("Keine Tickets (Werbung ansehen)!", "error");
            return;
        }

        const now = Date.now();
        // Wenn Zeit abgelaufen war: Start bei 'now'. Wenn noch aktiv: Addieren auf 'expiresAt'
        const currentExpire = user.village.idleTimeExpiresAt || 0;
        const newExpire = Math.max(now, currentExpire) + (10 * 60 * 1000); // +10 Minuten

        await updateUser(user.id, {
            adTickets: user.adTickets - 1,
            "village.idleTimeExpiresAt": newExpire
        });

        showNotification("Idle Zeit um 10 Minuten verlängert!", "success");
    };

    // --- UPDATED: COLLECT LOGIC ---
    const collectVillageResources = async () => {
        if (!user) return;
        const now = Date.now();
        const lastCollection = user.village.lastCollectionTime || now;
        const idleExpires = user.village.idleTimeExpiresAt || 0;
        
        // Produktion nur bis Ablauf der Zeit oder bis Jetzt
        const productionEnd = Math.min(now, idleExpires);
        
        // Wenn die Idle-Zeit schon VOR dem letzten Sammeln abgelaufen war, gab es 0 Produktion
        let elapsedSeconds = 0;
        if (productionEnd > lastCollection) {
            elapsedSeconds = (productionEnd - lastCollection) / 1000;
        }

        // Wir updaten lastCollectionTime immer auf 'now', damit wir keine "Lücken" doppelt berechnen
        // (Auch wenn nichts produziert wurde, gilt die Zeit als vergangen)
        const nextCollectionTime = now;

        if (elapsedSeconds <= 0) {
            // Nur Zeit updaten, nichts produziert
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
                if (!isNaN(produced)) {
                    newResourcesBuffer[resKey] = (newResourcesBuffer[resKey] || 0) + produced;
                }
                
                const finishedItems = Math.floor(newResourcesBuffer[resKey]);
                
                if (finishedItems > 0) {
                    somethingProduced = true;
                    newResourcesBuffer[resKey] -= finishedItems;
                    newStats.totalCollected[resKey] = (newStats.totalCollected[resKey] || 0) + finishedItems;

                    workerIds.forEach(petId => {
                        if (petId) { petXpUpdates[petId] = (petXpUpdates[petId] || 0) + finishedItems; }
                    });

                    const dropTable = RESOURCE_ITEMS[resKey] || [];
                    if (dropTable.length > 0) {
                        for (let i = 0; i < finishedItems; i++) {
                            let roll = Math.random() * 100;
                            let dropped = dropTable[0];
                            for (const item of dropTable) {
                                if (roll <= item.chance) { dropped = item; break; }
                                roll -= item.chance;
                            }
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

            Object.entries(petXpUpdates).forEach(([petId, xpAmount]) => {
                const pet = myPets.find(p => p.id === petId);
                if (pet) {
                    let pXp = (pet.xp || 0) + xpAmount;
                    let pLevel = pet.level || 1;
                    let pMaxXp = pet.maxXp || 100;
                    while (pXp >= pMaxXp) {
                        pLevel++; pXp -= pMaxXp; pMaxXp = Math.floor(pMaxXp * 1.2);
                    }
                    updatePetInDB(petId, { xp: pXp, level: pLevel, maxXp: pMaxXp });
                }
            });

            updates["village.level"] = currentLvl;
            updates["village.xp"] = currentXp;
            updates["village.xpToNext"] = xpToNext;
            updates["village.lastCollectionTime"] = nextCollectionTime; // UPDATE auf JETZT
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

        let currentStats = 0;
        if (milestone.type === 'TIME') {
            currentStats = user.village.stats?.totalIdleTime || 0;
        } else {
            currentStats = user.village.stats?.totalItemsCollected?.[milestone.itemId] || 0;
        }

        if (currentStats < requiredTotal) {
            showNotification("Ziel für die nächste Stufe noch nicht erreicht!", "error");
            return;
        }

        let updates = { [`village.milestones.${milestoneId}`]: currentLevel + 1 };
        
        if (milestone.reward.type === 'COINS') {
            updates['coins'] = (user.coins || 0) + milestone.reward.amount;
        } else if (milestone.reward.type === 'GEMS') {
            updates['gems'] = (user.gems || 0) + milestone.reward.amount;
        } else if (milestone.reward.type === 'VILLAGE_XP') {
            let currentLvl = user.village.level;
            let currentXp = user.village.xp + milestone.reward.amount;
            let xpToNext = user.village.xpToNext;
            while (currentXp >= xpToNext && currentLvl < 20) {
                currentLvl++;
                currentXp -= xpToNext;
                xpToNext = Math.floor(xpToNext * 1.5); 
                showNotification(`Dorf Level Up! Level ${currentLvl}`, 'success');
            }
            updates['village.level'] = currentLvl;
            updates['village.xp'] = currentXp;
            updates['village.xpToNext'] = xpToNext;
        }

        await updateUser(user.id, updates);
        showNotification("Meilenstein Belohnung erhalten!", "success");
    };

    return { assignWorker, removeWorker, collectVillageResources, upgradeBuilding, calculateProductionRate, tradeResources, claimMilestone, addIdleTime };
}