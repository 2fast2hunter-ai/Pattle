// src/data/towerData.js

export const TOWER_STAGES = Array.from({ length: 100 }, (_, i) => {
    const stage = i + 1;
    
    // Gegner Konfiguration
    let enemyCount = 1;
    if (stage > 10) enemyCount = 2;
    if (stage > 30) enemyCount = 3;
    if (stage > 60) enemyCount = 4;
    if (stage > 90) enemyCount = 5;

    const enemyLevel = stage; // Level entspricht der Stufe (1-100)
    
    // Seltenheit steigt mit der Stufe
    let enemyRarity = 'COMMON';
    if (stage > 20) enemyRarity = 'UNCOMMON';
    if (stage > 40) enemyRarity = 'RARE';
    if (stage > 60) enemyRarity = 'EPIC';
    if (stage > 80) enemyRarity = 'LEGENDARY';
    if (stage > 95) enemyRarity = 'MYTHIC';

    // Belohnungen
    let reward = { type: 'COINS', amount: stage * 100 }; // Basis: Gold (Erhöht)
    
    // Besondere Belohnungen alle 5/10 Stufen
    if (stage % 10 === 0) {
        reward = { type: 'GEMS', amount: stage }; // Mehr Gems
    } else if (stage % 5 === 0) {
        reward = { type: 'CONSUMABLE', variant: 'XP_POTION_SMALL', amount: Math.ceil(stage / 10) };
    }
    
    // Meilensteine
    if (stage === 50) reward = { type: 'LOOTBOX', variant: 'PREMIUM', amount: 1 };
    if (stage === 100) reward = { type: 'LOOTBOX', variant: 'MASTER', amount: 1 };

    return { id: stage, label: `Stufe ${stage}`, enemyCount, enemyLevel, enemyRarity, reward };
});