import { updateUser, updatePetInDB, trackQuestProgress } from '../../../utils/db';
import { 
    RESOURCES, 
    ALLOWED_TYPES, 
    RARITY_MULTIPLIERS, 
    UPGRADE_COSTS, 
    RESOURCE_ITEMS, 
    TRADE_RECIPES, 
    MILESTONES, 
    COSMETICS, 
    SPECIAL_OFFERS 
} from '../../../data/gameData';
import { 
    recalculatePetStats, 
    calculateMaxXp, 
    getLevelUpStats 
} from '../../../utils/gameMechanics'; 

export function useVillageActions(state, showNotification) {
    const { user, myPets } = state;

    // --- PRODUKTIONSRATE BERECHNEN ---
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

    // --- ARBEITER ZUWEISEN ---
    const assignWorker = async (resourceId, slotIndex, petId) => {
        if (!user) return;
        
        // Erst einsammeln, damit nichts verloren geht
        await collectVillageResources(); 
        
        if (slotIndex >= user.village.level) {
            showNotification(`Dorf Level ${slotIndex + 1} benötigt!`, 'error');
            return;
        }
        
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;

        // Prüfen ob Pet schon woanders arbeitet
        for (const [resKey, slots] of Object.entries(user.village.workers)) {
            if (slots.includes(petId)) {
                showNotification(`${pet.name} arbeitet bereits!`, 'error');
                return;
            }
        }

        // Prüfen ob im Team
        if (user.team.includes(petId)) {
            showNotification(`${pet.name} ist im Kampfteam!`, 'error');
            return;
        }

        // Typ Check
        const allowedTypes = ALLOWED_TYPES[resourceId];
        if (!allowedTypes.includes(pet.type)) {
            showNotification(`Falscher Typ!`, 'error');
            return;
        }

        // Duplikate Check (optional: kein Typ doppelt pro Gebäude)
        const currentWorkers = user.village.workers[resourceId];
        for (const workerId of currentWorkers) {
            if (workerId && workerId !== petId) { 
                const worker = myPets.find(p => p.id === workerId);
                if (worker && worker.type === pet.type) {
                    showNotification(`Ein ${pet.type}-Pet arbeitet hier schon!`, 'error');
                    return;
                }
            }
        }

        const newWorkers = { ...user.village.workers };
        newWorkers[resourceId][slotIndex] = petId;

        await updateUser(user.id, { "village.workers": newWorkers });
        showNotification(`${pet.name} zugewiesen!`, 'success');
    };

    // --- ARBEITER ENTFERNEN ---
    const removeWorker = async (resourceId, slotIndex) => {
        if (!user) return;
        await collectVillageResources();
        
        const newWorkers = { ...user.village.workers };
        newWorkers[resourceId][slotIndex] = null;
        
        await updateUser(user.id, { "village.workers": newWorkers });
        showNotification("Arbeiter entfernt.", 'info');
    };

    // --- IDLE ZEIT VERLÄNGERN (WERBUNG / TICKET) ---
    const addIdleTime = async () => {
        if (!user) return;
        if ((user.adTickets || 0) < 1) {
            showNotification("Keine Tickets!", "error");
            return;
        }

        const now = Date.now();
        const currentExpire = user.village.idleTimeExpiresAt || 0;
        
        // HIER GEÄNDERT: Von 10 auf 20 Minuten erhöht
        const newExpire = Math.max(now, currentExpire) + (20 * 60 * 1000); 

        await updateUser(user.id, {
            adTickets: user.adTickets - 1,
            "village.idleTimeExpiresAt": newExpire
        });

        showNotification("Idle Zeit um 20 Min verlängert!", "success");
    };

    // --- RESSOURCEN SAMMELN (HAUPTSCHLEIFE) ---
    const collectVillageResources = async () => {
        if (!user) return;

        const now = Date.now();
        const lastCollection = user.village.lastCollectionTime || now;
        const idleExpires = user.village.idleTimeExpiresAt || 0;
        
        // Produktion nur bis zum Ablauf der Idle-Zeit
        const productionEnd = Math.min(now, idleExpires);
        
        let elapsedSeconds = 0;
        if (productionEnd > lastCollection) {
            elapsedSeconds = (productionEnd - lastCollection) / 1000;
        }

        const nextCollectionTime = now;

        // Wenn keine Zeit vergangen ist (oder Idle abgelaufen war), nur Zeit updaten
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

        // Für jedes Gebäude berechnen
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

                    // XP für Arbeiter merken
                    workerIds.forEach(petId => {
                        if (petId) {
                            petXpUpdates[petId] = (petXpUpdates[petId] || 0) + finishedItems;
                        }
                    });

                    // Items droppen (Zufall)
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
                            
                            totalXpGained += 10; // XP für den Spieler

                            if (itemsLog.length < 5) itemsLog.push(dropped.label);
                        }
                        if (finishedItems > 5 && !itemsLog.includes('...')) itemsLog.push(`...`);
                    }
                }
            }
        }

        if (somethingProduced || totalXpGained > 0) {
            // Dorf Level Up Logik
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
            // Hier werden die gesammelten XP auf die Pets angewendet
            Object.entries(petXpUpdates).forEach(([petId, xpAmount]) => {
                const pet = myPets.find(p => p.id === petId);
                if (pet) {
                    let pXp = (pet.xp || 0) + xpAmount;
                    let pLevel = pet.level || 1;
                    const startLevel = pLevel;
                    let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel);

                    let leveledUp = false;
                    
                    // Level Up Loop
                    while (pXp >= currentMaxXp) {
                        pXp -= currentMaxXp;
                        pLevel++;
                        currentMaxXp = calculateMaxXp(pLevel);
                        leveledUp = true;
                    }

                    if (leveledUp) {
                        // Stats komplett neu berechnen für Ziel-Level
                        const newStats = recalculatePetStats(pet, pLevel);
                        updatePetInDB(petId, { ...newStats, xp: pXp });
                        
                        // Quest Fortschritt (Anzahl der Level)
                        trackQuestProgress(user, 'LEVEL_UP_PET', pLevel - startLevel);
                    } else {
                        // Nur XP updaten
                        updatePetInDB(petId, { xp: pXp });
                    }
                }
            });
            // -------------------------------------

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

    // --- GEBÄUDE UPGRADE ---
    const upgradeBuilding = async (resourceId) => {
        if (!user) return;
        const currentLvl = user.village.buildings[resourceId] || 1;
        
        // 1. Nächstes Level Daten holen
        const nextLvlData = UPGRADE_COSTS.find(u => u.level === currentLvl + 1);
        if (!nextLvlData) { 
            showNotification("Maximales Level!", 'error'); 
            return; 
        }
        
        const baseCost = nextLvlData.baseCost; 
        const specialCost = nextLvlData.specialCost;

        // 2. Benötigte Items identifizieren (Basis & Seltenste)
        const categoryItems = RESOURCE_ITEMS[resourceId];
        if (!categoryItems) { showNotification("Fehler: Ressource nicht gefunden.", 'error'); return; }
        
        // Sortieren nach Chance (Höchste zuerst)
        const sortedItems = [...categoryItems].sort((a, b) => b.chance - a.chance);
        const baseItem = sortedItems[0]; // Häufigste
        const rareItem = sortedItems[sortedItems.length - 1]; // Seltenste

        // 3. Verfügbarkeit im Lager prüfen
        const currentStorage = user.village.storage || {};
        const availableBase = currentStorage[baseItem.id] || 0;
        const availableRare = currentStorage[rareItem.id] || 0;

        if (availableBase < baseCost) {
            showNotification(`Zu wenig ${baseItem.label}! (Benötigt: ${baseCost.toLocaleString()})`, 'error');
            return;
        }

        if (specialCost > 0 && availableRare < specialCost) {
            showNotification(`Zu wenig ${rareItem.label}! (Benötigt: ${specialCost.toLocaleString()})`, 'error');
            return;
        }

        // 4. Kosten abziehen
        const newStorage = { ...currentStorage };
        newStorage[baseItem.id] -= baseCost;
        if (specialCost > 0) {
            newStorage[rareItem.id] -= specialCost;
        }

        // 5. Update durchführen
        await updateUser(user.id, { 
            [`village.buildings.${resourceId}`]: currentLvl + 1,
            "village.storage": newStorage
        });

        showNotification(`${RESOURCES[resourceId.toUpperCase()].label} verbessert!`, 'success');
    };

    // --- HANDEL ---
    const tradeResources = async (offerItemId, wantItemId, amountOfTrades) => {
        if (!user) return;
        const storage = user.village.storage || {};
        
        const recipe = TRADE_RECIPES.find(r => r.offerId === offerItemId && r.wantId === wantItemId);
        if (!recipe) {
            showNotification("Dieser Tausch ist nicht möglich!", "error");
            return;
        }

        const totalCost = recipe.cost * amountOfTrades;
        const totalReceive = recipe.receive * amountOfTrades;

        if (!storage[offerItemId] || storage[offerItemId] < totalCost) {
            showNotification("Nicht genügend Material!", "error");
            return;
        }

        const newStorage = { ...storage };
        newStorage[offerItemId] -= totalCost;
        newStorage[wantItemId] = (newStorage[wantItemId] || 0) + totalReceive;

        await updateUser(user.id, { "village.storage": newStorage });
        showNotification(`Tausch erfolgreich: +${totalReceive} Items`, "success");
    };

    // --- MEILENSTEINE ---
    const claimMilestone = async (milestoneId) => {
        if (!user) return;
        const milestone = MILESTONES.find(m => m.id === milestoneId);
        if (!milestone) return;

        const claimed = user.village.milestones || {};
        const currentLevel = claimed[milestoneId] || 0;
        const requiredTotal = milestone.target * (currentLevel + 1);
        
        let current = 0;
        if (milestone.type === 'TIME') {
            current = user.village.stats?.totalIdleTime || 0;
        } else {
            current = user.village.stats?.totalItemsCollected?.[milestone.itemId] || 0;
        }

        if (current < requiredTotal) {
            showNotification("Ziel noch nicht erreicht!", "error");
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
        } else if (milestone.reward.type === 'CONSUMABLE') {
            const newItems = [];
            for(let i=0; i < milestone.reward.amount; i++) {
                newItems.push({ 
                    id: Date.now() + Math.random(), 
                    type: 'CONSUMABLE', 
                    variant: milestone.reward.variant 
                });
            }
            const currentInventory = user.inventory || [];
            updates['inventory'] = [...currentInventory, ...newItems];
        }

        await updateUser(user.id, updates);
        showNotification(`Meilenstein (Stufe ${currentLevel + 1}) erreicht!`, "success");
    };

    // --- KOSMETIK KAUFEN ---
    const buyCosmetic = async (cosmeticId) => {
        if (!user) return;
        const cosmetic = COSMETICS[cosmeticId];
        if (!cosmetic) return;

        const storage = user.village.storage || {};
        const costItem = cosmetic.costItem;
        const costAmount = cosmetic.costAmount;

        if (!storage[costItem] || storage[costItem] < costAmount) {
            showNotification("Nicht genügend Materialien!", "error");
            return;
        }

        const newStorage = { ...storage };
        newStorage[costItem] -= costAmount;

        const newItem = {
            id: Date.now() + Math.random(),
            type: 'CONSUMABLE', 
            variant: cosmeticId
        };
        const newInventory = [...(user.inventory || []), newItem];

        await updateUser(user.id, { 
            "village.storage": newStorage,
            "inventory": newInventory 
        });
        
        showNotification(`${cosmetic.label} gekauft!`, "success");
    };

    // --- SPEZIAL ANGEBOT KAUFEN ---
    const buySpecialOffer = async (offerId) => {
        if (!user) return;
        const offer = SPECIAL_OFFERS.find(o => o.id === offerId);
        if (!offer) return;

        const storage = user.village.storage || {};
        const costItem = offer.costItem;
        const costAmount = offer.costAmount;

        if (!storage[costItem] || storage[costItem] < costAmount) {
            showNotification("Nicht genügend Materialien!", "error");
            return;
        }

        // 1. Bezahlen
        const newStorage = { ...storage };
        newStorage[costItem] -= costAmount;
        let updates = { "village.storage": newStorage };

        // 2. Belohnung
        if (offer.reward.type === 'AD_TICKET') {
            updates['adTickets'] = (user.adTickets || 0) + offer.reward.amount;
        } 
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

    return { 
        assignWorker, removeWorker, collectVillageResources, upgradeBuilding, calculateProductionRate, 
        tradeResources, claimMilestone, addIdleTime, buyCosmetic, buySpecialOffer 
    };
}