// src/utils/mechanics/battleLogic.js

// Elo-Berechnung für Sieg/Niederlage
export const calculateEloChange = (playerRating, enemyRating, isWin) => {
    // Einfache Logik: +15 bei Sieg, -10 bei Niederlage
    if (isWin) return 15;
    return -10;
};

// Falls du später Schadensberechnung auslagern willst:
export const getDamageMultiplier = (atkType, defType) => {
    return 1.0; // Platzhalter
};