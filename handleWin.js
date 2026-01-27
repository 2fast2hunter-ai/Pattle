import { XP_GAIN } from './src/data/levelData';
import { calculateEloChange, recalculatePetStats, calculateMaxXp } from './src/utils/gameMechanics';
import { getXpToNextPlayerLevel, calculatePlayerLevel } from './src/utils/mechanics/progression';
import { updateUser, updatePetInDB, trackQuestProgress, setBattleActive } from './src/utils/db';

export const handleWin = async (state, showNotification, startBattleFn, reward, winningTeamIds, enemyRating, damageReport = {}) => {
    const { user, myPets, activeBattle, setCurrentView, autoBattleRemaining, setAutoBattleRemaining } = state;

    if (activeBattle?.isFriendly) { await setBattleActive(user.id, false); setCurrentView('friend-profile'); return; }
    if (!user) return;
    const targetRating = enemyRating || user.rating || 1000;
    const eloChange = calculateEloChange(user.rating || 1000, targetRating, true);
    const today = new Date().toISOString().split('T')[0];

    let xpGain = XP_GAIN.PLAYER_WIN;
    let coinsGain = reward.coins;
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

    let updateData = { coins: newCoins, gems: newGems, rating: (user.rating || 1000) + eloChange, xp: currentXp, level: newLevel, xpToNextLevel: newXpToNext, lastEloDate: today, stats: { ...user.stats, pvpWins: (user.stats?.pvpWins || 0) + 1, pvpTotal: (user.stats?.pvpTotal || 0) + 1 }, buffs: newBuffs, isInBattle: false };
    if (user.lastEloDate !== today) { updateData.startEloToday = user.rating || 1000; }
    await updateUser(user.id, updateData);

    const idsToLevel = winningTeamIds || (activeBattle ? activeBattle.myTeam.map(p => p.id) : []);
    const petBaseXp = XP_GAIN.PET_WIN_BASE;

    idsToLevel.forEach(petId => {
        const pet = myPets.find(p => p.id === petId);
        if(pet) {
            let pXp = (pet.xp || 0) + petBaseXp;
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

    const winningPets = winningTeamIds ? myPets.filter(p => winningTeamIds.includes(p.id)) : (activeBattle ? activeBattle.myTeam : []);
    const uniqueTypes = [...new Set(winningPets.map(p => p.type))];
    uniqueTypes.forEach(type => { if (type) trackQuestProgress(user, `WIN_${type}`, 1); });

    trackQuestProgress(user, 'WIN_PVP', 1);
    trackQuestProgress(user, 'EARN_XP', xpGain);

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