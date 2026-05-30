const BASE = import.meta.env.BASE_URL;

const SOUNDS = {
    'click': `${BASE}sounds/click.mp3`,
    'notification': `${BASE}sounds/notification.mp3`,
    'success': `${BASE}sounds/success.mp3`,
    'error': `${BASE}sounds/error.mp3`,
    'collect': `${BASE}sounds/collect.mp3`,
    'build': `${BASE}sounds/build.mp3`,
    'assign': `${BASE}sounds/assign.mp3`,
    'levelup': `${BASE}sounds/levelup.mp3`,
    'pop': `${BASE}sounds/pop.mp3`,
    'kaching': `${BASE}sounds/kaching.mp3`,
    'open_box': `${BASE}sounds/open_box.mp3`,
    'battle_start': `${BASE}sounds/battle_start.mp3`,
    'win': `${BASE}sounds/win.mp3`,
    'lose': `${BASE}sounds/lose.mp3`,
    'hit': `${BASE}sounds/hit.mp3`,
};

const MUSIC = {
    'menu': `${BASE}sounds/music_menu.mp3`,
    'village': `${BASE}sounds/music_village.mp3`,
    'battle': `${BASE}sounds/music_battle.mp3`,
};

let currentBgm = null;
let currentBgmKey = null;
let isMusicEnabled = true;
let isSoundEnabled = true;

export const setMusicEnabled = (enabled) => {
    isMusicEnabled = enabled;
    if (!enabled && currentBgm) {
        currentBgm.pause();
        currentBgm = null;
        currentBgmKey = null;
    }
};

export const setSoundEnabled = (enabled) => {
    isSoundEnabled = enabled;
};

export const playSound = (soundName) => {
    if (!isSoundEnabled) return;
    try {
        const path = SOUNDS[soundName];
        if (!path) return;

        const audio = new Audio(path);
        audio.volume = 0.4; // Lautstärke anpassen (0.0 bis 1.0)
        
        // Promise catch, um Fehler bei fehlenden Dateien oder Autoplay-Blockern abzufangen
        audio.play().catch(e => {
            // console.warn(`Sound '${soundName}' konnte nicht abgespielt werden:`, e);
        });
    } catch (e) {
        // Silent fail
    }
};

export const playBGM = (view) => {
    if (!isMusicEnabled) return;
    let musicKey = 'menu'; // Default

    // Logik zur Auswahl der Musik basierend auf dem View
    if (view === 'battle' || view === 'tower') {
        musicKey = 'battle';
    } else if (view && (view === 'village' || view.startsWith('village-'))) {
        musicKey = 'village';
    } else {
        musicKey = 'menu';
    }

    // Wenn die Musik schon läuft, nichts tun
    if (currentBgmKey === musicKey) return;

    // Alte Musik stoppen
    if (currentBgm) {
        currentBgm.pause();
        currentBgm = null;
    }

    const path = MUSIC[musicKey];
    if (!path) return;

    try {
        currentBgm = new Audio(path);
        currentBgm.loop = true;
        currentBgm.volume = 0.2; // Hintergrundmusik leiser als SFX
        currentBgm.play().catch(e => console.log("BGM Autoplay prevented (User interaction needed):", e));
        currentBgmKey = musicKey;
    } catch (e) {
        console.error("BGM Error:", e);
    }
};
