// src/utils/adManager.js

export const showRewardedAd = ({ onReward, onError, onOpenDevModal }) => {
    
    // 1. DEV-MODUS (Localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log("[AdManager] Dev-Mode: Starte Simulation...");
        if (onOpenDevModal) onOpenDevModal();
        return;
    }

    // 2. LIVE-MODUS (Monetag Direct Link Integration)
    console.log("[AdManager] Live-Mode: Öffne Werbung...");

    // Trage hier deinen "Direct Link" von Monetag ein:
    const AD_URL = "https://otieu.com/4/10277319"; 

    if (!AD_URL || AD_URL.includes("DEIN_MONETAG")) {
        console.error("Bitte trage den echten Monetag Link in src/utils/adManager.js ein!");
        if (onError) onError();
        return;
    }

    try {
        // Öffne die Werbung in einem neuen Tab (Standard für Web-Ads)
        const adWindow = window.open(AD_URL, '_blank');

        // Prüfen, ob der Popup-Blocker das Fenster verhindert hat
        if (!adWindow) {
            alert("Bitte erlaube Popups für die Belohnung!");
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
        console.error("[AdManager] Fehler beim Öffnen:", e);
        if (onError) onError();
    }
};