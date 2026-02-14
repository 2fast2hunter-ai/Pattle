
import { RARITIES } from '../../../data/rarities';

export const handleGauntletWin = (activeBattle, reward, setActiveBattle, showNotification) => {
    // 1. Belohnungen akkumulieren
    const currentRewards = activeBattle.accumulatedRewards || { xp: 0, coins: 0 };
    const newRewards = {
        xp: currentRewards.xp + (reward?.xp || 0),
        coins: currentRewards.coins + (reward?.coins || 0)
    };

    // 2. Nächste Runde vorbereiten
    const nextRound = (activeBattle.gauntletRound || 1) + 1;

    // 3. Gegner Skalierung
    const enemyLevel = nextRound;
    // Jede 10 Stufen +1 Gegner (Stufe 1-9: 1, 10-19: 2, etc.)
    const enemyCount = Math.min(5, 1 + Math.floor(nextRound / 10));

    // Rarity Scaling: Every 100 levels
    const rarityKeys = Object.keys(RARITIES);
    const rarityIndex = Math.floor((nextRound - 1) / 100);
    const enemyRarity = rarityKeys[Math.min(rarityIndex, rarityKeys.length - 1)];

    // 4. Score Calculation
    // Formel: Aktuelle Stufe + Anzahl gegner Pets + Level der Gegner Pets + Anzahl der noch lebenden Pets
    const currentStage = activeBattle.gauntletRound || 1;
    const enemyCountForScore = activeBattle.enemyTeam.length;
    const enemyLevelForScore = activeBattle.enemyTeam[0]?.level || 1;
    const survivorsCount = activeBattle.myTeam.filter(p => p.hp > 0).length;

    const roundScore = currentStage + enemyCountForScore + enemyLevelForScore + survivorsCount;
    const newScore = (activeBattle.gauntletScore || 0) + roundScore;

    // 5. Return values
    return {
        newRewards,
        nextRound,
        enemyLevel,
        enemyCount,
        enemyRarity,
        newScore
    };
};

export const generateGauntletEnemies = async (count, level, rarity = 'COMMON') => {
    const { generatePet } = await import('../../../utils/gameMechanics');
    const { TYPES } = await import('../../../data/gameData');

    const enemyTeam = [];
    const typeKeys = Object.keys(TYPES);
    for (let i = 0; i < count; i++) {
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        const enemy = generatePet(level, randomType, rarity, null, 'GAUNTLET');
        enemy.currentHp = enemy.maxHp;
        enemy.currentCd = 0;
        enemyTeam.push(enemy);
    }
    return enemyTeam;
};
