import { QUEST_TYPES, LOOTBOXES, SHOP_ITEMS, TIMED_REWARDS, TYPES } from '../../../data/gameData';
import { updateUser, trackQuestProgress } from '../../../utils/db';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { auth } from '../../../firebase';

export function useShopActions(state, showNotification) {
    const { user } = state;

    const buyLootbox = async (boxType, singleCost, currency, quantity = 1) => {
        if (!user) return;

        if (boxType === 'DAILY') {
            const today = new Date().toDateString();
            if (user.lastDailyBoxClaim === today) {
                showNotification(state.t ? state.t('notif_daily_already_claimed') : 'Already claimed daily box today!', "error");
                return;
            }
            const newInv = [...(user.inventory || []), { id: `box_${Date.now()}`, type: 'LOOTBOX', variant: boxType }];
            await updateUser(user.id, { inventory: newInv, lastDailyBoxClaim: today });
            showNotification(state.t ? state.t('notif_daily_box_received') : 'Daily box received!', 'success');
            return;
        }

        const totalCost = singleCost * quantity;

        if (currency === 'COINS') {
            if (user.coins < totalCost) { showNotification(state.t ? state.t('notif_not_enough_gold') : 'Not enough coins!', 'error'); return; }

            const newItems = [];
            for (let i = 0; i < quantity; i++) {
                newItems.push({ id: `box_${Date.now()}_${i}`, type: 'LOOTBOX', variant: boxType });
            }

            const newInv = [...(user.inventory || []), ...newItems];
            await updateUser(user.id, { coins: user.coins - totalCost, inventory: newInv });
            // Wait slightly to ensuring DB consistency before tracking quest which might read/write user again
            setTimeout(() => trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, totalCost), 500);

        } else {
            if (user.gems < totalCost) { showNotification(state.t ? state.t('notif_not_enough_gems') : 'Not enough gems!', 'error'); return; }

            const newItems = [];
            for (let i = 0; i < quantity; i++) {
                newItems.push({ id: `box_${Date.now()}_${i}`, type: 'LOOTBOX', variant: boxType });
            }

            const newInv = [...(user.inventory || []), ...newItems];
            await updateUser(user.id, { gems: user.gems - totalCost, inventory: newInv });
        }

        let boxLabel = boxType;
        if (LOOTBOXES[boxType]) boxLabel = LOOTBOXES[boxType].label;
        else if (boxType === 'TYPE_DAILY') boxLabel = state.t ? state.t('label_elemental_chest') : 'Elemental Chest';

        showNotification(state.t ? state.t('notif_lootbox_bought', { count: quantity, name: boxLabel }) : `${quantity}x ${boxLabel} bought!`, 'success');
    };

    const buyTickets = (item) => {
        if (!user) return;
        let cost = item.costAmount;
        let currency = item.costCurrency;

        if (currency === 'COINS' && (user.coins || 0) < cost) { showNotification(state.t ? state.t('notif_not_enough_gold') : 'Not enough coins!', 'error'); return; }
        if (currency === 'GEMS' && (user.gems || 0) < cost) { showNotification(state.t ? state.t('notif_not_enough_gems') : 'Not enough gems!', 'error'); return; }

        const newInventory = [...(user.inventory || [])];
        for (let i = 0; i < item.tickets; i++) { newInventory.push({ id: `ticket_${Date.now()}_${i}`, type: 'TICKET', variant: 'BREED' }); }

        const updateData = {};
        if (currency === 'COINS') { updateData.coins = user.coins - cost; trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, cost); }
        else if (currency === 'GEMS') { updateData.gems = user.gems - cost; }

        updateData.inventory = newInventory;
        updateUser(user.id, updateData);
        showNotification(state.t ? state.t('notif_tickets_bought', { count: item.tickets }) : `${item.tickets} breed tickets bought!`, 'success');
    };

    const watchAdForReward = async (reward) => {
        if (!user || !reward) return;

        const currentClaims = user.adClaims || {};
        let updateData = {
            adClaims: {
                ...currentClaims,
                [reward.id]: Date.now()
            },
            adTickets: (user.adTickets || 0) + 1
        };

        if (reward.type === 'GEMS') {
            updateData.gems = (user.gems || 0) + reward.amount;
        } else if (reward.type === 'COINS') {
            updateData.coins = (user.coins || 0) + reward.amount;
        } else if (reward.type === 'BUFF') {
            const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
            if (reward.buffType === 'COIN_BOOST') {
                updateData.buffs = { ...currentBuffs, coinBoostMatches: (currentBuffs.coinBoostMatches || 0) + reward.amount };
            } else if (reward.buffType === 'XP_BOOST') {
                updateData.buffs = { ...currentBuffs, xpBoostMatches: (currentBuffs.xpBoostMatches || 0) + reward.amount };
            }
        }

        await updateUser(user.id, updateData);
        showNotification(state.t ? state.t('notif_ad_reward_claimed', { label: reward.label }) : `${reward.label} + 1 auto-battle ticket received!`, 'success');
    };

    // --- NEU: GRATIS BELOHNUNG ABHOLEN ---
    const claimTimedReward = async (rewardId) => {
        if (!user) return;

        const rewardConfig = TIMED_REWARDS.find(r => r.id === rewardId);
        if (!rewardConfig) return;

        // Zeit-Check (Sicherheit)
        const lastClaim = user.timedClaims?.[rewardId] || 0;
        const now = Date.now();
        if (now - lastClaim < rewardConfig.cooldown) {
            showNotification(state.t ? state.t('notif_not_ready') : 'Not ready yet!', "error");
            return;
        }

        // Belohnung geben
        let updates = {
            timedClaims: {
                ...(user.timedClaims || {}),
                [rewardId]: now
            }
        };

        if (rewardConfig.reward.type === 'AD_TICKET') {
            updates.adTickets = (user.adTickets || 0) + rewardConfig.reward.amount;
        }
        // Hier könnte man weitere Reward-Typen hinzufügen (Coins etc.)

        await updateUser(user.id, updates);
        showNotification(state.t ? state.t('notif_reward_collected', { item: rewardConfig.label }) : `${rewardConfig.label} collected!`, "success");
    };

    const openLootbox = async (boxId, boxVariant) => {
        if (!user) return null;

        // SICHERHEITS-CHECK: Ist der User im Auth-Modul eingeloggt?
        if (!auth.currentUser) {
            console.error("Auth Error: User state ist da, aber Firebase Auth user fehlt.");
            showNotification(state.t ? state.t('notif_auth_error') : 'Authentication error. Please log in again.', "error");
            return null;
        }

        try {
            // 1. TOKEN REFRESH ERZWINGEN
            // Das behebt "User must be logged in" Fehler, falls das Token 'stale' ist
            await auth.currentUser.getIdToken(true);

            // CLOUD FUNCTION AUFRUF (SICHER)
            // Wir nutzen getApp(), um sicherzustellen, dass die Instanz korrekt ist
            const functions = getFunctions(getApp());
            const openLootboxFn = httpsCallable(functions, 'openLootbox');

            showNotification(state.t ? state.t('notif_opening_box') : 'Opening box...', "info");

            // DATE-MATCHING LOGIC (Client-Side Fix)
            let finalBoxVariant = boxVariant;
            if (boxVariant === 'TYPE_DAILY') {
                const dayIndex = new Date().getDay();
                const schedule = {
                    1: { start: 0, count: 3 }, // Mo (Fire, Water, Wind)
                    2: { start: 3, count: 3 }, // Di (Earth, Lightning, Ice)
                    3: { start: 6, count: 3 }, // Mi (Nature, Poison, Metal)
                    4: { start: 9, count: 3 }, // Do (Light, Dark, Ghost)
                    5: { start: 12, count: 4 }, // Fr (Psychic, Fighting, Flying, Bug)
                    6: { start: 16, count: 4 }, // Sa (Dragon, Fairy, Magic, Tech)
                    0: { start: 20, count: 4 }  // So (Cosmic, Chaos, Void, Crystal)
                };

                // Fallback für ungültige Tage/Daten
                const config = schedule[dayIndex] || schedule[1];

                // Wir nutzen die globalen TYPES aus gameData
                // Da wir hier nur Keys brauchen, ist es wichtig, dass TYPES keys sind oder wir sie extracten
                // TYPES in gameData ist ein Object { FIRE: {...}, ... }
                const typeKeys = Object.keys(TYPES);

                const dailyTypes = typeKeys.slice(config.start, config.start + config.count);

                if (dailyTypes.length > 0) {
                    const randomType = dailyTypes[Math.floor(Math.random() * dailyTypes.length)];
                    finalBoxVariant = `ELEMENTAL_${randomType}`;
                    console.log(`[ShopActions] Resolved TYPE_DAILY to ${finalBoxVariant}`);
                }
            }

            const result = await openLootboxFn({ boxId, boxVariant: finalBoxVariant });

            if (result.data.success) {
                return result.data.pet;
            } else {
                throw new Error(result.data.message || "Unknown server error");
            }
        } catch (error) {
            console.error("Lootbox Error (Cloud Function):", error);
            showNotification(state.t ? state.t('notif_open_error') : 'Error opening box.', "error");
            return null;
        }
    };

    return { buyLootbox, buyTickets, watchAdForReward, claimTimedReward, openLootbox };
}