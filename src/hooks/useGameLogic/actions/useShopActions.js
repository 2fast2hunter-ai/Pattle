import { QUEST_TYPES, LOOTBOXES, SHOP_ITEMS } from '../../../data/gameData';
import { updateUser, trackQuestProgress } from '../../../utils/db';

export function useShopActions(state, showNotification) {
    const { user } = state;

    const buyLootbox = (boxType, cost, currency) => {
        if (!user) return; 
        
        // 1. Daily Box Logic
        if (boxType === 'DAILY') {
            const today = new Date().toDateString();
            if (user.lastDailyBoxClaim === today) {
                showNotification("Du hast die Daily Box heute schon abgeholt!", "error");
                return;
            }
            const newInv = [...(user.inventory || []), { id: Date.now(), type: 'LOOTBOX', variant: boxType }];
            updateUser(user.id, { inventory: newInv, lastDailyBoxClaim: today });
            showNotification(`${LOOTBOXES.DAILY.label} erhalten!`, 'success');
            return;
        }

        // 2. Normal Boxes
        if (currency === 'COINS') {
            if (user.coins < cost) { showNotification("Zu wenig Münzen!", 'error'); return; }
            const newInv = [...(user.inventory || []), { id: Date.now(), type: 'LOOTBOX', variant: boxType }];
            updateUser(user.id, { coins: user.coins - cost, inventory: newInv });
            trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, cost);
        } else {
            if (user.gems < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; }
            const newInv = [...(user.inventory || []), { id: Date.now(), type: 'LOOTBOX', variant: boxType }];
            updateUser(user.id, { gems: user.gems - cost, inventory: newInv });
        }
        
        const boxLabel = LOOTBOXES[boxType] ? LOOTBOXES[boxType].label : boxType;
        showNotification(`${boxLabel} gekauft!`, 'success');
    };

    const buyTickets = (item) => {
        if (!user) return; 
        let cost = item.costAmount;
        let currency = item.costCurrency;
        
        if (currency === 'COINS' && (user.coins || 0) < cost) { showNotification("Zu wenig Münzen!", 'error'); return; }
        if (currency === 'GEMS' && (user.gems || 0) < cost) { showNotification("Zu wenig Edelsteine!", 'error'); return; }
        
        const newInventory = [...(user.inventory || [])];
        for (let i = 0; i < item.tickets; i++) { newInventory.push({ id: Date.now() + Math.random() + i, type: 'TICKET', variant: 'BREED' }); }
        
        const updateData = {};
        if (currency === 'COINS') { updateData.coins = user.coins - cost; trackQuestProgress(user, QUEST_TYPES.SPEND_COINS, cost); } 
        else if (currency === 'GEMS') { updateData.gems = user.gems - cost; }
        
        updateData.inventory = newInventory;
        updateUser(user.id, updateData); 
        showNotification(`${item.tickets} Zucht-Tickets gekauft und im Inventar abgelegt!`, 'success');
    };

    // UPDATE: Akzeptiert nun das spezifische Reward-Objekt
    const watchAdForReward = async (reward) => {
        if (!user || !reward) return;
        
        // Speichere den Zeitstempel spezifisch für DIESE Belohnung
        const currentClaims = user.adClaims || {};
        let updateData = {
            adClaims: {
                ...currentClaims,
                [reward.id]: Date.now() // Z.B. { 'GEMS_5': 1715... }
            }
        };
        
        // Belohnung gutschreiben
        if (reward.type === 'GEMS') {
            updateData.gems = (user.gems || 0) + reward.amount;
        } else if (reward.type === 'COINS') {
            updateData.coins = (user.coins || 0) + reward.amount;
        } else if (reward.type === 'BUFF') {
            const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
            if (reward.buffType === 'COIN_BOOST') {
                updateData.buffs = {
                    ...currentBuffs,
                    coinBoostMatches: (currentBuffs.coinBoostMatches || 0) + reward.amount
                };
            } else if (reward.buffType === 'XP_BOOST') {
                updateData.buffs = {
                    ...currentBuffs,
                    xpBoostMatches: (currentBuffs.xpBoostMatches || 0) + reward.amount
                };
            }
        }

        await updateUser(user.id, updateData);
        showNotification(`${reward.label} erhalten!`, 'success');
    };

    return { buyLootbox, buyTickets, watchAdForReward };
}