// src/hooks/useGameLogic/actions/villageEventActions.js

import { updateUser } from '../../../utils/db';
import { playSound } from '../../../utils/soundManager';
import { VILLAGE_EVENT_TYPES, MERCHANT_OFFERS, EVENT_CHECK_COOLDOWN_MS, getActiveVillageEvents } from '../../../data/villageEvents';
import { showRewardedAd } from '../../../utils/adManager';

export const checkAndTriggerVillageEvent = async (user, showNotification, lang = 'de') => {
    if (!user?.village) return null;

    const now = Date.now();
    const lastCheck = user.village.lastEventCheck || 0;

    if (now - lastCheck < EVENT_CHECK_COOLDOWN_MS) return null;

    const activeEvents = getActiveVillageEvents(user);
    const activeTypes = new Set(activeEvents.map(e => e.type));

    const eligible = Object.values(VILLAGE_EVENT_TYPES).filter(et => !activeTypes.has(et.id));
    if (eligible.length === 0) {
        await updateUser(user.id, { "village.lastEventCheck": now });
        return null;
    }

    // ~25% chance to trigger an event per check
    if (Math.random() > 0.25) {
        await updateUser(user.id, { "village.lastEventCheck": now });
        return null;
    }

    const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;
    let chosen = eligible[eligible.length - 1];
    for (const et of eligible) {
        roll -= et.weight;
        if (roll <= 0) { chosen = et; break; }
    }

    const newEvent = {
        id: `evt_${now}_${Math.floor(Math.random() * 1000)}`,
        type: chosen.id,
        startedAt: now,
        expiresAt: now + chosen.durationMs,
        dismissed: false,
    };

    const updatedEvents = [
        ...activeEvents,
        newEvent,
    ];

    await updateUser(user.id, {
        "village.activeEvents": updatedEvents,
        "village.lastEventCheck": now,
    });

    const label = lang === 'de' ? chosen.label : chosen.labelEn;
    const desc = lang === 'de' ? chosen.description : chosen.descriptionEn;
    showNotification(`${chosen.icon} ${label}: ${desc}`, chosen.negative ? 'error' : 'success');
    if (!chosen.negative) playSound('success');

    return newEvent;
};

export function useVillageEventActions(state, showNotification) {
    const { user, settings } = state;

    const lang = settings?.language || 'de';

    const dismissStormWithAd = async (eventId, onOpenDevModal) => {
        if (!user) return;

        showRewardedAd({
            onReward: async () => {
                const updatedEvents = (user.village.activeEvents || []).map(e =>
                    e.id === eventId ? { ...e, dismissed: true } : e
                );
                await updateUser(user.id, { "village.activeEvents": updatedEvents });
                showNotification(
                    lang === 'de' ? '⛅ Sturm abgewendet! Produktion läuft wieder normal.' : '⛅ Storm averted! Production back to normal.',
                    'success'
                );
                playSound('success');
            },
            onError: () => {},
            onOpenDevModal: onOpenDevModal || (() => {}),
        });
    };

    const buyFromMerchant = async (offerId) => {
        if (!user) return;

        const merchantActive = getActiveVillageEvents(user).some(e => e.type === 'MERCHANT');
        if (!merchantActive) {
            showNotification(lang === 'de' ? 'Kein Händler im Dorf!' : 'No merchant in the village!', 'error');
            return;
        }

        const offer = MERCHANT_OFFERS.find(o => o.id === offerId);
        if (!offer) return;

        const storage = user.village.storage || {};
        if ((storage[offer.costItem] || 0) < offer.costAmount) {
            showNotification(lang === 'de' ? `Zu wenig ${offer.costItem}!` : `Not enough ${offer.costItem}!`, 'error');
            return;
        }

        const newStorage = { ...storage, [offer.costItem]: storage[offer.costItem] - offer.costAmount };
        let updates = { "village.storage": newStorage };

        if (offer.reward.type === 'AD_TICKET') {
            updates['adTickets'] = (user.adTickets || 0) + offer.reward.amount;
        } else if (offer.reward.type === 'CONSUMABLE') {
            const newItem = { id: Date.now() + Math.random(), type: 'CONSUMABLE', variant: offer.reward.variant };
            updates['inventory'] = [...(user.inventory || []), newItem];
        } else if (offer.reward.type === 'ITEM') {
            const newItem = { id: Date.now() + Math.random(), type: offer.reward.itemType, variant: offer.reward.itemVariant };
            updates['inventory'] = [...(user.inventory || []), newItem];
        }

        await updateUser(user.id, updates);
        const label = lang === 'de' ? offer.label : offer.labelEn;
        showNotification(`✅ ${label} ${lang === 'de' ? 'erhalten!' : 'received!'}`, 'success');
        playSound('kaching');
    };

    const checkVillageEvents = async () => {
        if (!user) return;
        await checkAndTriggerVillageEvent(user, showNotification, lang);
    };

    return { dismissStormWithAd, buyFromMerchant, checkVillageEvents };
}
