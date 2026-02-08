import { QUEST_TYPES, LOOTBOXES, SHOP_ITEMS, TIMED_REWARDS, TYPES } from '../../../data/gameData';
import { updateUser, trackQuestProgress, addPetToDB } from '../../../utils/db';
import { determineRarity } from '../../../utils/mechanics/lootLogic';
import { generatePet } from '../../../utils/mechanics/petGeneration';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { auth } from '../../../firebase';

export function useShopActions(state, showNotification) {
    const { user } = state;

    const buyLootbox = (boxType, singleCost, currency, quantity = 1) => {
        if (!user) return; 
        
        if (boxType === 'DAILY') {
            const today = new Date().toDateString();
            if (user.lastDailyBoxClaim === today) {
                showNotification("Du hast die Daily Box heute schon abgeholt!", "error");
                return;
            }
            const newInv = [...(user.inventory || []), { id: `box_${Date.now()}`, type: 'LOOTBOX', variant: boxType }];
            updateUser(user.id, { inventory: newInv, lastDailyBoxClaim: today });
            showNotification(`${LOOTBOXES.DAILY.label} erhalten!`, 'success');
            return;
        }

        const totalCost = singleCost * quantity;

        if (currency === 'COINS') {
            if (user.coins < totalCost) { showNotification("Zu wenig Münzen!", 'error'); return; }
            
            const newItems = [];
            for(let i = 0; i < quantity; i++) {
                newItems.push({ id: `box_${Date.now()}_${i}`, type: 'LOOTBOX', variant: boxType });
            }

            const newInv = [...(user.inventory || []), ...newItems];
            updateUser(user.id, { coins: user.coins - totalCost, inventory: newInv });
            trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, totalCost);

        } else {
            if (user.gems < totalCost) { showNotification("Zu wenig Edelsteine!", 'error'); return; }
            
            const newItems = [];
            for(let i = 0; i < quantity; i++) {
                newItems.push({ id: `box_${Date.now()}_${i}`, type: 'LOOTBOX', variant: boxType });
            }

            const newInv = [...(user.inventory || []), ...newItems];
            updateUser(user.id, { gems: user.gems - totalCost, inventory: newInv });
        }
        
        let boxLabel = boxType;
        if (LOOTBOXES[boxType]) boxLabel = LOOTBOXES[boxType].label;
        else if (boxType === 'TYPE_DAILY') boxLabel = 'Elementar-Truhe';
        
        showNotification(`${quantity}x ${boxLabel} gekauft!`, 'success');
    };

    const buyTickets = (item) => {
        if (!user) return; 
        let cost = item.costAmount;
        let currency = item.costCurrency;
        
        if (currency === 'COINS' && (user.coins || 0) < cost) { showNotification("Zu wenig Münzen!", 'error'); return; }
        if (currency === 'GEMS' && (user.gems || 0) < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; }
        
        const newInventory = [...(user.inventory || [])];
        for (let i = 0; i < item.tickets; i++) { newInventory.push({ id: `ticket_${Date.now()}_${i}`, type: 'TICKET', variant: 'BREED' }); }
        
        const updateData = {};
        if (currency === 'COINS') { updateData.coins = user.coins - cost; trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, cost); } 
        else if (currency === 'GEMS') { updateData.gems = user.gems - cost; }
        
        updateData.inventory = newInventory;
        updateUser(user.id, updateData); 
        showNotification(`${item.tickets} Zucht-Tickets gekauft und im Inventar abgelegt!`, 'success');
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
        showNotification(`${reward.label} + 1 Auto-Kampf Ticket erhalten!`, 'success');
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
            showNotification("Noch nicht bereit!", "error");
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
        showNotification(`${rewardConfig.label} eingesammelt!`, "success");
    };

    const openLootbox = async (boxId, boxVariant) => {
        if (!user) return null;

        // SICHERHEITS-CHECK: Ist der User im Auth-Modul eingeloggt?
        if (!auth.currentUser) {
            console.error("Auth Error: User state ist da, aber Firebase Auth user fehlt.");
            showNotification("Authentifizierungs-Fehler. Bitte neu einloggen.", "error");
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
            
            showNotification("Öffne Box auf dem Server...", "info");
            
            const result = await openLootboxFn({ boxId, boxVariant });
            
            if (result.data.success) {
                return result.data.pet;
            } else {
                throw new Error(result.data.message || "Unbekannter Server Fehler");
            }
        } catch (error) {
            console.error("Lootbox Error (Cloud Function):", error);
            showNotification("Fehler beim Öffnen.", "error");
            return null;
        }
    };

    return { buyLootbox, buyTickets, watchAdForReward, claimTimedReward, openLootbox };
}