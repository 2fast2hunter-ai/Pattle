// src/hooks/useGameLogic/actions/distributeXP.js
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../../../firebase';
import { calculateMaxXp, recalculatePetStats, calculatePetTotalXpForLevel } from '../../../utils/mechanics/petStats';

export const distributeXP = async (winningTeamIds, xpGain, trackQuestProgress, user) => {
    if (xpGain <= 0 || winningTeamIds.length === 0) return 0;

    const xpPerPet = Math.max(1, Math.floor(xpGain / Math.max(1, winningTeamIds.length)));
    let levelUpCount = 0;

    console.log(`[DistributeXP] Verteile ${xpPerPet} XP an ${winningTeamIds.length} Pets.`);

    for (const petId of winningTeamIds) {
        if (!petId) continue;
        try {
            const leveledUp = await runTransaction(db, async (transaction) => {
                const petRef = doc(db, "pets", petId);
                const petDoc = await transaction.get(petRef);

                if (!petDoc.exists()) {
                    console.warn(`[DistributeXP] Pet ${petId} nicht in DB gefunden.`);
                    return false;
                }

                const data = petDoc.data();
                let currentLvl = Number(data.level);
                if (!Number.isFinite(currentLvl) || currentLvl < 1) currentLvl = 1;

                let currentXp = Number(data.xp);
                if (!Number.isFinite(currentXp) || currentXp < 0) currentXp = 0;

                const rarity = data.rarity || 'COMMON';

                // AUTO-FIX: XP correction
                const minXpForLevel = calculatePetTotalXpForLevel(currentLvl, rarity);
                if (currentXp < minXpForLevel && currentLvl > 1) {
                    currentXp += minXpForLevel;
                }

                let maxXp = Number(data.maxXp);
                if (!Number.isFinite(maxXp) || maxXp <= 0) {
                    maxXp = calculateMaxXp(currentLvl, rarity);
                }

                let newXp = currentXp + xpPerPet;
                let newLevel = currentLvl;
                let didLevelUp = false;

                while (newXp >= maxXp && newLevel < 100) {
                    newLevel++;
                    didLevelUp = true;
                    maxXp = calculateMaxXp(newLevel, rarity);
                }

                if (newLevel < currentLvl) newLevel = currentLvl;
                if (newLevel >= 100) {
                    newLevel = 100;
                    newXp = 0;
                    maxXp = 2000000000;
                }

                const updates = {
                    xp: Math.floor(newXp),
                    level: newLevel,
                    maxXp: Math.floor(maxXp)
                };

                if (didLevelUp) {
                    const updatedPetBase = { ...data, level: newLevel };
                    const newStats = recalculatePetStats(updatedPetBase, newLevel);
                    updates.maxHp = Number(newStats.maxHp) || 10;
                    updates.hp = Number(newStats.maxHp) || 10;
                    updates.atk = Number(newStats.atk) || 1;
                    updates.def = Number(newStats.def) || 1;
                    updates.ap = Number(newStats.ap) || 1;
                    updates.res = Number(newStats.res) || 1;
                    updates.speed = Number(newStats.speed) || 1;
                }

                transaction.update(petRef, updates);
                return didLevelUp;
            });

            if (leveledUp) levelUpCount++;

        } catch (err) {
            console.error(`[DistributeXP] Fehler bei Pet ${petId}:`, err);
        }
    }

    // Track Quest
    if (levelUpCount > 0 && user && trackQuestProgress) {
        await trackQuestProgress(user, 'LEVEL_UP_PET', levelUpCount);
    }

    return levelUpCount;
};
