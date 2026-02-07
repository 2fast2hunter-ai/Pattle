import { calculateEloChange, setBattleActive } from '../../../utils/db';
import { playSound } from '../../../utils/soundManager';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { calculateMaxXp, recalculatePetStats, calculatePetTotalXpForLevel } from '../../../utils/mechanics/petStats';

export const handleLose = async (state, showNotification, startBattleFn, reward, teamIds, enemyRating) => {
    const { user, myPets, activeBattle, setActiveBattle, autoBattleRemaining, setAutoBattleRemaining, setCurrentView } = state;
    if (!user) return;

    const isAuto = autoBattleRemaining > 0;
    const isFriendly = activeBattle?.isFriendly;
    const isTower = activeBattle?.isTower;

    // 1. XP VERTEILUNG (Auch bei Niederlage)
    const xpGain = reward?.xp || 0;
    
    if (xpGain > 0 && teamIds && teamIds.length > 0) {    
        const xpPerPet = Math.max(1, Math.floor(xpGain / Math.max(1, teamIds.length)));

        if (xpGain > 0) {
            console.log(`[HandleLose] Verteile ${xpPerPet} XP an ${teamIds.length} Pets.`);
            for (const petId of teamIds) {
                if (!petId) continue;
                try {
                    await runTransaction(db, async (transaction) => {
                        const petRef = doc(db, "pets", petId);
                        const petDoc = await transaction.get(petRef);
                        
                        if (!petDoc.exists()) {
                            console.warn(`[HandleLose] Pet ${petId} nicht gefunden.`);
                            return;
                        }
                        
                        const data = petDoc.data();
                        console.log(`[HandleLose] Pet ${petId} (${data.name}) - Aktuell: Lvl ${data.level}, XP ${data.xp}`);
                        
                        // SICHERHEITS-CHECKS
                        let currentLvl = Number(data.level);
                        if (!Number.isFinite(currentLvl) || currentLvl < 1) currentLvl = 1;
                        
                        let currentXp = Number(data.xp);
                        if (!Number.isFinite(currentXp) || currentXp < 0) currentXp = 0;
                        
                        const rarity = data.rarity || 'COMMON';

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

                        if (newLevel < currentLvl) {
                            console.error(`[HandleLose] Level regression für ${petId}. Korrigiere auf ${currentLvl}.`);
                            newLevel = currentLvl;
                        }

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

                        console.log(`[HandleLose] Update für ${petId}:`, updates);
                        transaction.update(petRef, updates);
                    });
                } catch (e) { console.error("Lose XP Error:", e); }
            }
        }
    }

    // 2. ELO & STATS
    let newRating = user.rating;
    if (!isFriendly && !isTower) {
        const eloChange = calculateEloChange(user.rating, enemyRating || 1000, false);
        newRating += eloChange;
    }

    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { 
        rating: newRating, 
        isInBattle: false,
        "stats.pvpTotal": (user.stats?.pvpTotal || 0) + 1 
    });
    

    await setBattleActive(user.id, false);

    if (!isAuto) {
        playSound('lose');
        showNotification(isTower ? "Turm-Kampf verloren!" : "Niederlage!", "error");
        setCurrentView(isTower ? 'tower' : 'arena-hub');
        setActiveBattle(null);
    } else {
        // Auto-Battle Logik wird im BattleScreen gehandhabt oder hier erweitert
        if (autoBattleRemaining <= 1) {
            setAutoBattleRemaining(0);
            showNotification("Auto-Kampf beendet (Niederlage).", "info");
            setCurrentView('arena-hub');
            setActiveBattle(null);
        } else {
             // Weiterkämpfen auch bei Niederlage
             const nextRemaining = autoBattleRemaining - 1;
             setAutoBattleRemaining(nextRemaining);
             showNotification(`Niederlage! Nächster Kampf... (${nextRemaining} übrig)`, "info");
             
             setCurrentView('arena-hub');
             setActiveBattle(null);
             
             setTimeout(() => {
                 startBattleFn();
             }, 1500);
        }
    }
};