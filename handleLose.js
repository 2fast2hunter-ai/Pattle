import { XP_GAIN } from './src/data/levelData';
import { calculateEloChange, recalculatePetStats, calculateMaxXp } from './src/utils/gameMechanics';
import { getXpToNextPlayerLevel, calculatePlayerLevel } from './src/utils/mechanics/progression';
import { updateUser, updatePetInDB, trackQuestProgress, setBattleActive } from './src/utils/db';

export const handleLose = async (state, showNotification, startBattleFn, enemyRating) => {
    const { user, myPets, activeBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    if (activeBattle?.isFriendly) { await setBattleActive(user.id, false); setCurrentView('friend-profile'); return; }
    if (!user) return;
    const targetRating = enemyRating || user.rating || 1000;
    const eloChange = calculateEloChange(user.rating || 1000, targetRating, false);
    const today = new Date().toISOString().split('T')[0];

    let xpGain = XP_GAIN.PLAYER_LOSE;
    let coinsGain = 5;
    const currentBuffs = user.buffs || { coinBoostMatches: 0, xpBoostMatches: 0 };
    let newBuffs = { ...currentBuffs };
    if (currentBuffs.coinBoostMatches > 0) { coinsGain *= 2; newBuffs.coinBoostMatches -= 1; showNotification("Doppelte Münzen aktiviert!", "success"); }
    if (currentBuffs.xpBoostMatches > 0) { xpGain *= 2; newBuffs.xpBoostMatches -= 1; showNotification("Doppelte XP aktiviert!", "success"); }

    let currentXp = (user.xp || 0) + xpGain;
    let newLevel = calculatePlayerLevel(currentXp);
    let newXpToNext = getXpToNextPlayerLevel(newLevel);
    let newCoins = (user.coins || 0) + coinsGain;
    let newGems = user.gems || 0;
    if (newLevel > user.level) { newCoins += 1000; newGems += 5; }

    let updateData = { rating: Math.max(0, (user.rating || 1000) + eloChange), xp: currentXp, level: newLevel, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, stats: { ...user.stats, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, lastEloDate: today, buffs: newBuffs, isInBattle: false };
    if (user.lastEloDate !== today) { updateData.startEloToday = user.rating || 1000; }
    await updateUser(user.id, updateData);

    const idsToLevel = activeBattle ? activeBattle.myTeam.map(p => p.id) : [];
    const petXpGain = 5;
    idsToLevel.forEach(petId => {
        const pet = myPets.find(p => p.id === petId);
        if(pet) {
            let pXp = (pet.xp || 0) + petXpGain;
            let pLevel = pet.level || 1;
            let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel, pet.rarity);
            let leveledUpCount = 0;
            while (pXp >= currentMaxXp) { pLevel++; currentMaxXp = calculateMaxXp(pLevel, pet.rarity); leveledUpCount++; }
            if (leveledUpCount > 0) {
                const newStats = recalculatePetStats({ ...pet, level: pLevel }, pLevel);
                updatePetInDB(petId, { ...newStats, xp: pXp, hp: newStats.maxHp });
                trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount);
            } else { updatePetInDB(petId, { xp: pXp }); }
        }
    });

    if (autoBattleRemaining > 1) {
        setAutoBattleRemaining(prev => prev - 1);
        startBattleFn();
    }
    else {
        if (autoBattleRemaining === 1) {
            setAutoBattleRemaining(0);
            showNotification("Auto-Kampf Sequenz abgeschlossen!", "success");
        }
        setCurrentView('arena-hub');
    }
};