// src/utils/adManager.js

export const showRewardedAd = ({ onReward, onError, onOpenDevModal }) => {
    
    // 1. DEV-MODUS (Localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log("[AdManager] Dev-Mode: Starting simulation...");
        if (onOpenDevModal) onOpenDevModal();
        return;
    }

    // 2. LIVE-MODUS (Monetag Direct Link Integration)
    console.log("[AdManager] Live-Mode: Opening ad...");

    // Trage hier deinen "Direct Link" von Monetag ein:
    const AD_URL = "https://otieu.com/4/10277360"; 

    if (!AD_URL || AD_URL.includes("DEIN_MONETAG")) {
        console.error("Please set the real Monetag direct link in src/utils/adManager.js!");
        if (onError) onError();
        return;
    }

    try {
        // Öffne die Werbung in einem neuen Tab (Standard für Web-Ads)
        const adWindow = window.open(AD_URL, '_blank');

        // Prüfen, ob der Popup-Blocker das Fenster verhindert hat
        if (!adWindow) {
            alert("Please allow popups to receive your reward!");
            if (onError) onError();
            return;
        }

        // FOKUS-CHECK: Wir geben die Belohnung, wenn der Nutzer zurückkehrt
        // (Da Web-Ads selten echte "Finished"-Callbacks haben, ist das der Standard-Weg)
        const checkFocus = () => {
            if (document.visibilityState === 'visible') {
                // Nutzer ist zurück im Tab -> Belohnung geben
                document.removeEventListener('visibilitychange', checkFocus);
                
                // Optional: Kleine Verzögerung für besseres Feeling
                setTimeout(() => {
                    onReward();
                }, 500);
            }
        };

        document.addEventListener('visibilitychange', checkFocus);

    } catch (e) {
        console.error("[AdManager] Error opening ad:", e);
        if (onError) onError();
    }
};