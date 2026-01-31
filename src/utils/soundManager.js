// src/utils/soundManager.js

// Mapping von Sound-Namen zu Dateipfaden (im public Ordner)
const SOUNDS = {
    // UI & Allgemein
    'click': '/sounds/click.mp3',
    'notification': '/sounds/notification.mp3',
    'success': '/sounds/success.mp3',
    'error': '/sounds/error.mp3',
    
    // Dorf
    'collect': '/sounds/collect.mp3',
    'build': '/sounds/build.mp3',
    'assign': '/sounds/assign.mp3',
    'levelup': '/sounds/levelup.mp3',
    'pop': '/sounds/pop.mp3', // Für XP im Training
    
    // Shop
    'kaching': '/sounds/kaching.mp3', // Kaufen
    'open_box': '/sounds/open_box.mp3',
    
    // Kampf
    'battle_start': '/sounds/battle_start.mp3',
    'win': '/sounds/win.mp3',
    'lose': '/sounds/lose.mp3',
    'hit': '/sounds/hit.mp3',
};

const MUSIC = {
    'menu': '/sounds/music_menu.mp3',
    'village': '/sounds/music_village.mp3',
    'battle': '/sounds/music_battle.mp3',
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
