// src/hooks/useGameLogic/actions/useVillageActions.js

import { updateUser, trackQuestProgress } from '../../../utils/db';
import {
    RESOURCES,
    ALLOWED_TYPES,
    RARITY_MULTIPLIERS,
    UPGRADE_COSTS,
    RESOURCE_ITEMS,
    TRADE_RECIPES,
    MILESTONES,
    COSMETICS,
    SPECIAL_OFFERS,
    PROFILE_ICONS
} from '../../../data/gameData';
import { playSound } from '../../../utils/soundManager';
import { TRANSLATIONS } from '../../../data/translations';
import { collectResources, calculateProductionRate as calcRateHelper } from './collectResources';

export function useVillageActions(state, showNotification) {
    const { user, myPets, settings } = state;

    // Lokaler Übersetzungs-Helper
    const t = (key, params = {}) => {
        const lang = settings?.language || 'de';
        let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['de'][key] || key;
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, v);
        });
        return text;
    };

    // --- PRODUKTIONSRATE BERECHNEN ---
    const calculateProductionRate = (resourceId, buildingLevel, assignedPetIds) => {
        return calcRateHelper(resourceId, buildingLevel, assignedPetIds, myPets, RARITY_MULTIPLIERS);
    };

    // --- ARBEITER ZUWEISEN ---
    const assignWorker = async (resourceId, slotIndex, petId) => {
        if (!user) return;

        // Erst einsammeln, damit nichts verloren geht
        await collectVillageResources();

        if (slotIndex >= user.village.level) {
            showNotification(t('notif_needs_village_lvl') + ` ${slotIndex + 1}`, 'error');
            return;
        }

        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;

        // Prüfen ob Pet schon woanders arbeitet
        for (const [, slots] of Object.entries(user.village.workers)) {
            if (slots.includes(petId)) {
                showNotification(t('notif_worker_busy', { name: pet.name }), 'error');
                return;
            }
        }

        // Prüfen ob im Team
        if (user.team.includes(petId)) {
            showNotification(t('notif_worker_in_team', { name: pet.name }), 'error');
            return;
        }

        // Typ Check
        const allowedTypes = ALLOWED_TYPES[resourceId];
        if (!allowedTypes.includes(pet.type)) {
            showNotification(t('notif_wrong_type'), 'error');
            return;
        }

        // Duplikate Check (optional: kein Typ doppelt pro Gebäude)
        const currentWorkers = user.village.workers[resourceId] || [];
        for (const workerId of currentWorkers) {
            if (workerId && workerId !== petId) {
                const worker = myPets.find(p => p.id === workerId);
                if (worker && worker.type === pet.type) {
                    showNotification(t('notif_duplicate_type', { type: pet.type }), 'error');
                    return;
                }
            }
        }

        const newWorkers = { ...user.village.workers };

        if (!newWorkers[resourceId]) {
            newWorkers[resourceId] = [null, null, null, null, null];
        } else {
            newWorkers[resourceId] = [...newWorkers[resourceId]];
        }

        newWorkers[resourceId][slotIndex] = petId;

        await updateUser(user.id, { "village.workers": newWorkers });
        showNotification(t('notif_worker_assigned', { name: pet.name }), 'success');
        playSound('assign');
    };

    // --- ARBEITER ENTFERNEN ---
    const removeWorker = async (resourceId, slotIndex) => {
        if (!user) return;
        await collectVillageResources();

        const newWorkers = { ...user.village.workers };
        newWorkers[resourceId][slotIndex] = null;

        await updateUser(user.id, { "village.workers": newWorkers });
        showNotification(t('notif_worker_removed'), 'info');
    };

    // --- IDLE ZEIT VERLÄNGERN (Ticket) ---
    const addIdleTime = async () => {
        if (!user) return;
        if ((user.adTickets || 0) < 1) {
            showNotification(t('notif_no_tickets'), "error");
            return;
        }

        const now = Date.now();
        const currentExpire = user.village.idleTimeExpiresAt || 0;
        const newExpire = Math.max(now, currentExpire) + (20 * 60 * 1000);

        await updateUser(user.id, {
            adTickets: user.adTickets - 1,
            "village.idleTimeExpiresAt": newExpire
        });

        showNotification(t('notif_idle_extended'), "success");
    };

    // --- IDLE ZEIT VERLÄNGERN (Werbung) — +1 Stunde, kein Ticket nötig ---
    const addIdleTimeByAd = async () => {
        if (!user) return;

        const now = Date.now();
        const currentExpire = user.village.idleTimeExpiresAt || 0;
        const newExpire = Math.max(now, currentExpire) + (60 * 60 * 1000);

        await updateUser(user.id, { "village.idleTimeExpiresAt": newExpire });
        showNotification('Produktion um 1 Stunde verlängert! 🎉', 'success');
    };

    // --- RESSOURCEN SAMMELN ---
    const collectVillageResources = async (specificResourceId = null) => {
        return await collectResources({
            user, myPets, RARITY_MULTIPLIERS, specificResourceId, showNotification, t
        });
    };

    // --- GEBÄUDE UPGRADE ---
    const upgradeBuilding = async (resourceId) => {
        if (!user) return;
        const currentLvl = user.village.buildings[resourceId] || 1;

        const nextLvlData = UPGRADE_COSTS.find(u => u.level === currentLvl + 1);
        if (!nextLvlData) {
            showNotification(t('notif_max_level'), 'error');
            return;
        }

        const baseCost = nextLvlData.baseCost;
        const specialCost = nextLvlData.specialCost;

        let baseItem, rareItem;

        if (resourceId === 'training') {
            baseItem = { id: 'wood_oak', label: 'Eiche' };
            rareItem = { id: 'stone_rock', label: 'Stein' };
        } else {
            const categoryItems = RESOURCE_ITEMS[resourceId];
            if (!categoryItems) { showNotification("Fehler: Ressource nicht gefunden.", 'error'); return; }

            const sortedItems = [...categoryItems].sort((a, b) => b.chance - a.chance);
            baseItem = sortedItems[0];
            rareItem = sortedItems[sortedItems.length - 1];
        }

        const currentStorage = user.village.storage || {};
        const availableBase = currentStorage[baseItem.id] || 0;
        const availableRare = currentStorage[rareItem.id] || 0;

        if (availableBase < baseCost) {
            showNotification(t('notif_not_enough', { item: t('item_' + baseItem.id) }), 'error');
            return;
        }

        if (specialCost > 0 && availableRare < specialCost) {
            showNotification(t('notif_not_enough', { item: t('item_' + rareItem.id) }), 'error');
            return;
        }

        const newStorage = { ...currentStorage };
        newStorage[baseItem.id] -= baseCost;
        if (specialCost > 0) {
            newStorage[rareItem.id] -= specialCost;
        }

        await updateUser(user.id, {
            [`village.buildings.${resourceId}`]: currentLvl + 1,
            "village.storage": newStorage
        });

        showNotification(t('notif_building_upgraded', { building: t('res_' + resourceId) }), 'success');
        playSound('build');
        trackQuestProgress(user, 'UPGRADE_BUILDING', 1, ['UPGRADE_BUILDING']);
    };

    // --- HANDEL ---
    const tradeResources = async (offerItemId, wantItemId, amountOfTrades) => {
        if (!user) return;
        const storage = user.village.storage || {};

        const recipe = TRADE_RECIPES.find(r => r.offerId === offerItemId && r.wantId === wantItemId);
        if (!recipe) {
            showNotification(t('notif_trade_impossible'), "error");
            return;
        }

        const totalCost = recipe.cost * amountOfTrades;
        const totalReceive = recipe.receive * amountOfTrades;

        if (!storage[offerItemId] || storage[offerItemId] < totalCost) {
            showNotification(t('notif_not_enough', { item: t('item_' + offerItemId) }), "error");
            return;
        }

        const newStorage = { ...storage };
        newStorage[offerItemId] -= totalCost;
        newStorage[wantItemId] = (newStorage[wantItemId] || 0) + totalReceive;

        await updateUser(user.id, { "village.storage": newStorage });
        showNotification(t('notif_trade_success', { amount: totalReceive }), "success");
        playSound('kaching');
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
            showNotification(t('notif_milestone_not_ready'), "error");
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
                showNotification(t('notif_village_levelup', { level: currentLvl }), 'success');
            }
            updates['village.level'] = currentLvl;
            updates['village.xp'] = currentXp;
            updates['village.xpToNext'] = xpToNext;
        } else if (milestone.reward.type === 'CONSUMABLE') {
            const newItems = [];
            for (let i = 0; i < milestone.reward.amount; i++) {
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
        showNotification(t('notif_milestone_reached', { level: currentLevel + 1 }), "success");
        playSound('success');
    };

    // --- KOSMETIK KAUFEN ---
    const buyCosmetic = async (cosmeticId) => {
        if (!user) return;
        const cosmetic = COSMETICS[cosmeticId] || PROFILE_ICONS[cosmeticId];
        if (!cosmetic) return;

        const storage = user.village.storage || {};
        const costItem = cosmetic.costItem;
        const costAmount = cosmetic.costAmount;

        if (!storage[costItem] || storage[costItem] < costAmount) {
            showNotification(t('notif_not_enough', { item: t('item_' + costItem) }), "error");
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

        showNotification(t('notif_item_bought', { item: cosmetic.label }), "success");
        playSound('kaching');
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
            showNotification(t('notif_not_enough', { item: t('item_' + costItem) }), "error");
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
        showNotification(t('notif_item_bought', { item: offer.label }), "success");
        playSound('kaching');
    };

    return {
        assignWorker, removeWorker, collectVillageResources, upgradeBuilding, calculateProductionRate,
        tradeResources, claimMilestone, addIdleTime, addIdleTimeByAd, buyCosmetic, buySpecialOffer
    };
}
