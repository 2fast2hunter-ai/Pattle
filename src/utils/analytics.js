// src/utils/analytics.js
// Google Analytics 4 wrapper. Measurement ID is read from VITE_GA4_MEASUREMENT_ID.
// All functions are no-ops when GA_ID is not configured.

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

export function initAnalytics() {
    if (!GA_ID) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { send_page_view: false });
}

export function trackEvent(name, params = {}) {
    if (!window.gtag) return;
    window.gtag('event', name, params);
}

export function trackScreenView(screenName) {
    if (!window.gtag || !GA_ID) return;
    window.gtag('event', 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenName,
    });
}

export function trackBattleStarted(battleType = 'pvp') {
    trackEvent('battle_started', { battle_type: battleType });
}

export function trackBattleWon(battleType = 'pvp', coinsGained = 0, xpGained = 0) {
    trackEvent('battle_won', { battle_type: battleType, coins_gained: coinsGained, xp_gained: xpGained });
}

export function trackBattleLost(battleType = 'pvp') {
    trackEvent('battle_lost', { battle_type: battleType });
}

export function trackPetBred(petType, rarity, isFusion = false) {
    trackEvent('pet_bred', { pet_type: petType, rarity, is_fusion: isFusion });
}

export function trackEggHatched(petType, rarity) {
    trackEvent('egg_hatched', { pet_type: petType, rarity });
}

export function trackAdWatched(context = 'shop') {
    trackEvent('ad_watched', { context });
}

export function trackBuildingUpgraded(resourceId, newLevel) {
    trackEvent('building_upgraded', { resource_id: resourceId, new_level: newLevel });
}

export function trackQuestCompleted(questType = 'daily', questId) {
    trackEvent('daily_quest_completed', { quest_type: questType, quest_id: questId });
}

export function trackSessionDuration(seconds) {
    trackEvent('session_duration', { duration_seconds: seconds });
}
