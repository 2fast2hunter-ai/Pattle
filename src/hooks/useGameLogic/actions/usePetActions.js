import { RARITIES, TYPES, QUEST_TYPES, RESOURCES, CONSUMABLES, COSMETICS } from '../../../data/gameData';
import { 
    generatePet, 
    getUnlockedHatcherySlots, 
    determineRarity, 
    calculateBreedRarity, 
    // generateHybridPet, // <--- NICHT MEHR BENÖTIGT
    getLevelUpStats, 
    calculateMaxXp 
} from '../../../utils/gameMechanics';
import { 
    updateUser, addPetToDB, updatePetInDB, removePetFromDB, trackQuestProgress 
} from '../../../utils/db';

export function usePetActions(state, showNotification) {
    const { user, myPets, setCurrentView, selectedSlotForTeam, setSelectedSlotForTeam } = state;

    // --- PET FREILASSEN (LÖSCHEN) ---
    const releasePet = async (petId) => {
        if (!user) return false;
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return false;

        // 1. Check: Ist es im Team?
        if (user.team.includes(petId)) {
            showNotification("Dieses Pet ist im Kampfteam! Entferne es erst.", "error");
            return false;
        }

        // 2. Check: Arbeitet es im Dorf?
        let isWorking = false;
        if (user.village && user.village.workers) {
            Object.values(user.village.workers).forEach(slotArray => {
                if (Array.isArray(slotArray) && slotArray.includes(petId)) {
                    isWorking = true;
                }
            });
        }
        
        if (isWorking) {
            showNotification("Dieses Pet arbeitet im Dorf! Entferne es erst.", "error");
            return false;
        }

        // 3. Löschen
        try {
            await removePetFromDB(petId);
            showNotification(`${pet.name} wurde in die Freiheit entlassen. Mach's gut! 👋`, "info");
            return true; // Erfolg
        } catch (e) {
            console.error("Fehler beim Freilassen:", e);
            showNotification("Fehler beim Freilassen.", "error");
            return false;
        }
    };

    // --- COOLDOWN REDUZIEREN ---
    const handleReduceCooldown = async (petId, type) => {
        if (!user) return;
        const ticketItem = user.inventory?.find(i => i.type === 'TICKET');
        
        if (!ticketItem) { showNotification("Keine Tickets im Inventar!", "error"); return; }
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;

        const FIVE_MINUTES = 5 * 60 * 1000;
        let updates = {};
        let didReduce = false;

        if (type === 'BREEDING') {
            if (!pet.bredAt || pet.bredAt + RARITIES[pet.rarity].breedCooldown <= Date.now()) { showNotification("Dieses Pet hat keinen aktiven Cooldown.", "error"); return; }
            updates = { bredAt: pet.bredAt - FIVE_MINUTES };
            didReduce = true;
        } else if (type === 'HATCHING') {
            if (!pet.hatchAt || pet.hatchAt <= Date.now()) { showNotification("Dieses Ei ist bereits bereit!", "error"); return; }
            updates = { hatchAt: pet.hatchAt - FIVE_MINUTES };
            didReduce = true;
        }

        if (didReduce) {
            await updatePetInDB(petId, updates);
            const newInventory = user.inventory.filter(i => i.id !== ticketItem.id);
            await updateUser(user.id, { inventory: newInventory });
            showNotification("Zeit um 5 Minuten verkürzt!", "success");
        }
    };

    // --- TEAM MANAGEMENT ---
    const addToTeam = (petId) => {
        if (!user || selectedSlotForTeam === null) return;
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;
        if (pet.isEgg) { showNotification("Eier kämpfen nicht!", 'error'); return; }
        
        // Check ob Arbeiter
        if (user.village && user.village.workers) {
            for (const [resKey, slots] of Object.entries(user.village.workers)) {
                if (slots.includes(petId)) {
                    const resName = RESOURCES[resKey.toUpperCase()]?.label || resKey;
                    showNotification(`${pet.name} arbeitet gerade im ${resName}!`, 'error');
                    return;
                }
            }
        }

        const currentTeamIds = user.team || [];
        const newPetType = pet.type;
        
        // Check ob Typ schon im Team (außer auf dem gewählten Slot)
        for (let i = 0; i < currentTeamIds.length; i++) {
            if (i === selectedSlotForTeam) continue;
            const slotPetId = currentTeamIds[i];
            if (slotPetId) {
                const slotPet = myPets.find(p => p.id === slotPetId);
                if (slotPet && slotPet.type === newPetType) {
                    const typeLabel = TYPES[newPetType] ? TYPES[newPetType].label : newPetType;
                    showNotification(`Ein ${typeLabel}-Pet ist bereits im Team!`, 'error');
                    return;
                }
            }
        }
        
        const newTeam = [...currentTeamIds];
        while(newTeam.length <= selectedSlotForTeam) { newTeam.push(null); }
        
        // Falls Pet schon woanders im Team war, dort entfernen
        const existingIndex = newTeam.indexOf(petId);
        if (existingIndex !== -1) { newTeam[existingIndex] = null; }
        
        newTeam[selectedSlotForTeam] = petId;
        updateUser(user.id, { team: newTeam });
        setCurrentView('team-edit');
        setSelectedSlotForTeam(null);
    };

    const removeFromTeam = (index) => {
        if (!user) return;
        const newTeam = [...user.team];
        newTeam[index] = null;
        updateUser(user.id, { team: newTeam });
    };

    // --- BRUTSTÄTTE ---
    const hatchEgg = async (petId, customName) => { 
        if (!user) return; 
        const pet = myPets.find(p => p.id === petId); 
        if (!pet || !pet.isEgg) return; 
        if (Date.now() < pet.hatchAt) { showNotification("Noch nicht bereit!", 'error'); return; } 
        
        await updatePetInDB(petId, { isEgg: false, name: customName || pet.name }); 
        
        const rarityInfo = RARITIES[pet.rarity] || RARITIES.COMMON;
        const xpGain = rarityInfo.hatchXp || 5;
        
        let newLevel = user.level || 1;
        let newXp = (user.xp || 0) + xpGain;
        let newXpToNext = user.xpToNextLevel || 100;
        let newCoins = user.coins || 0;
        let newGems = user.gems || 0;

        while (newXp >= newXpToNext) { 
            newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; 
        }

        await updateUser(user.id, { level: newLevel, xp: newXp, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, stats: { ...user.stats, hatched: (user.stats?.hatched || 0) + 1 } }); 
        
        const tags = ['HATCH_EGG', `HATCH_${pet.rarity}`, `HATCH_${pet.type}`]; 
        trackQuestProgress(user, 'HATCH_EGG', 1, tags); 
        trackQuestProgress(user, 'EARN_XP', xpGain);
        
        showNotification(`Geschlüpft: ${customName || pet.name} (+${xpGain} XP)!`, 'success'); 
    };

    const startIncubation = async (id, type) => {
        if (!user) return null;
        if (type === 'BOX') {
            const box = user.inventory.find(i => i.id === id);
            if (!box) return null;
            const newInv = user.inventory.filter(i => i.id !== id);
            const newPet = generatePet(1, null, determineRarity(box.variant), null, box.variant === 'STARTER' ? 'STARTER' : 'SHOP');
            newPet.isEgg = box.variant !== 'STARTER';
            newPet.hatchAt = 0;
            await addPetToDB(newPet, user.id);
            await updateUser(user.id, { inventory: newInv });
            return newPet;
        } else {
            const pet = myPets.find(p => p.id === id);
            if (myPets.filter(p => p.isEgg && p.hatchAt > 0).length >= getUnlockedHatcherySlots(user.level)) {
                showNotification("Brutstätte voll!", 'error');
                return null;
            }
            await updatePetInDB(id, { hatchAt: Date.now() + RARITIES[pet.rarity].hatchDuration });
            trackQuestProgress(user, QUEST_TYPES.HATCH_EGG, 1);
            setCurrentView('hatchery');
            showNotification("Inkubation gestartet!", 'success');
            return null;
        }
    };

    // --- ZUCHT (ANGEPASST: KEINE NEUEN ARTEN) ---
    const breedPets = async (parent1Id, parent2Id) => { 
        if (!user) return; 
        if (myPets.filter(p => p.isEgg && p.hatchAt > 0).length >= getUnlockedHatcherySlots(user.level)) { showNotification("Brutstätte ist voll!", 'error'); return; } 
        
        const p1 = myPets.find(p => p.id === parent1Id); 
        const p2 = myPets.find(p => p.id === parent2Id); 
        const cd1 = RARITIES[p1.rarity].breedCooldown; 
        const cd2 = RARITIES[p2.rarity].breedCooldown; 
        
        const minLevel1 = RARITIES[p1.rarity].minBreedLevel || 0;
        const minLevel2 = RARITIES[p2.rarity].minBreedLevel || 0;

        if (p1.level < minLevel1) { showNotification(`${p1.name} muss Level ${minLevel1} sein!`, 'error'); return; }
        if (p2.level < minLevel2) { showNotification(`${p2.name} muss Level ${minLevel2} sein!`, 'error'); return; }

        if ((p1.bredAt || 0) + cd1 > Date.now()) { showNotification(`${p1.name} braucht eine Pause!`, 'error'); return; } 
        if ((p2.bredAt || 0) + cd2 > Date.now()) { showNotification(`${p2.name} braucht eine Pause!`, 'error'); return; } 
        
        await updatePetInDB(p1.id, { bredAt: Date.now() }); 
        await updatePetInDB(p2.id, { bredAt: Date.now() }); 
        
        // ---------------------------------------------------------
        // NEUE LOGIK: WÄHLE EINE DER BEIDEN ELTERN-SPEZIES
        // ---------------------------------------------------------
        
        // 1. Zufällig einen Elternteil auswählen (50/50 Chance)
        const primaryParent = Math.random() > 0.5 ? p1 : p2;

        // 2. Stats Mischen (Basis-Werte vererben)
        const mix = (v1, v2) => Math.floor((v1 + v2) / 2); 
        const getBase = (pet, stat, fallback) => pet[stat] || fallback;

        // Vererbe die Basiswerte (b_stats), damit gute Zuchtlinien stärker werden
        const inheritedStats = {
            hp: mix(getBase(p1, 'b_hp', 10), getBase(p2, 'b_hp', 10)),
            atk: mix(getBase(p1, 'b_atk', 2), getBase(p2, 'b_atk', 2)),
            ap: mix(getBase(p1, 'b_ap', 2), getBase(p2, 'b_ap', 2)),
            def: mix(getBase(p1, 'b_def', 1), getBase(p2, 'b_def', 1)),
            res: mix(getBase(p1, 'b_res', 1), getBase(p2, 'b_res', 1)),
            speed: mix(getBase(p1, 'b_speed', 1), getBase(p2, 'b_speed', 1))
        };

        // 3. Kind generieren mit erzwungener Spezies
        const child = generatePet(
            1, 
            primaryParent.type, // Typ vom gewählten Elternteil
            calculateBreedRarity(p1.rarity, p2.rarity), 
            inheritedStats, 
            'BREEDING', 
            primaryParent.species // WICHTIG: Spezies vom Elternteil übernehmen
        );

        // ---------------------------------------------------------

        child.isEgg = true; 
        child.hatchAt = Date.now() + RARITIES[child.rarity].hatchDuration; 
        await addPetToDB(child, user.id); 
        
        const rarityInfo = RARITIES[child.rarity] || RARITIES.COMMON;
        const xpGain = rarityInfo.breedXp || 10;

        let newLevel = user.level || 1; let newXp = (user.xp || 0) + xpGain; let newXpToNext = user.xpToNextLevel || 100; let newCoins = user.coins || 0; let newGems = user.gems || 0;
        while (newXp >= newXpToNext) { newLevel++; newXp -= newXpToNext; newXpToNext = Math.floor(newXpToNext * 1.5); newCoins += 1000; newGems += 5; }

        await updateUser(user.id, { level: newLevel, xp: newXp, xpToNextLevel: newXpToNext, coins: newCoins, gems: newGems, stats: { ...user.stats, bred: (user.stats?.bred || 0) + 1 } }); 
        
        const tags = ['BREED_PET', `BREED_${child.type}`]; 
        trackQuestProgress(user, 'BREED_PET', 1, tags); 
        trackQuestProgress(user, 'EARN_XP', xpGain);

        setCurrentView('hatchery'); 
        showNotification(`Zucht erfolgreich (+${xpGain} XP)!`, 'success'); 
    };

    const renamePet = async (petId, newName) => {
        if (!user) return false;
        const COST = 100; 
        if (user.gems < COST) { showNotification(`Nicht genügend Edelsteine! (Benötigt: ${COST})`, 'error'); return false; }
        if (!newName || newName.trim().length < 3 || newName.trim().length > 15) { showNotification("Name muss zwischen 3 und 15 Zeichen lang sein.", "error"); return false; }
        try {
            await updateUser(user.id, { gems: user.gems - COST });
            await updatePetInDB(petId, { name: newName.trim() });
            showNotification(`Pet umbenannt in "${newName.trim()}"!`, 'success');
            return true;
        } catch (e) { console.error(e); showNotification("Fehler beim Umbenennen.", "error"); return false; }
    };

    // --- ITEMS ANWENDEN ---
    const applyItem = async (petId, itemId, quantity = 1) => {
        if (!user) return;

        const firstItem = user.inventory.find(i => i.id === itemId);
        if (!firstItem) { showNotification("Item nicht gefunden!", "error"); return; }

        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;

        // 1. SHINY TRANK (Nur 1x, ignoriert quantity)
        if (firstItem.variant === 'SHINY_POTION') {
            if (pet.isEgg) { showNotification("Eier können nicht Shiny werden!", "error"); return; }
            if (pet.isShiny) { showNotification("Dieses Pet ist bereits Shiny!", "error"); return; }

            const updates = {
                isShiny: true,
                atk: (pet.atk || 0) + 1,
                def: (pet.def || 0) + 1,
                ap: (pet.ap || 0) + 1,
                res: (pet.res || 0) + 1,
                speed: (pet.speed || 0) + 1,
                maxHp: (pet.maxHp || 10) + 10,
                hp: (pet.maxHp || 10) + 10
            };

            await updatePetInDB(petId, updates);
            // Nur 1 entfernen
            const newInventory = user.inventory.filter(i => i.id !== itemId);
            await updateUser(user.id, { inventory: newInventory });

            showNotification(`${pet.name} ist jetzt SHINY! ✨`, "success");
            return;
        }

        // 2. XP TRANK (MIT MENGEN-SUPPORT & FIXEN STATS)
        if (CONSUMABLES[firstItem.variant]) {
            if (pet.isEgg) { showNotification("Eier können keine Erfahrung sammeln!", "error"); return; }
            
            // Verfügbare Menge prüfen
            const variant = firstItem.variant;
            const matchingItems = user.inventory.filter(i => i.type === 'CONSUMABLE' && i.variant === variant);
            
            if (matchingItems.length < quantity) {
                showNotification(`Nicht genügend Items! Du hast nur ${matchingItems.length}.`, "error");
                return;
            }

            // Items zum Löschen bestimmen
            const itemsToRemove = matchingItems.slice(0, quantity);
            const idsToRemove = new Set(itemsToRemove.map(i => i.id));

            // XP berechnen
            const consumable = CONSUMABLES[variant];
            const xpPerItem = consumable.value;
            const totalXpToAdd = xpPerItem * quantity;

            let pXp = (pet.xp || 0) + totalXpToAdd;
            let pLevel = pet.level || 1;
            let currentMaxXp = pet.maxXp || calculateMaxXp(pLevel);

            let leveledUpCount = 0;
            
            // Aktuelle Stats für Berechnung kopieren
            let currentStats = { 
                maxHp: pet.maxHp, atk: pet.atk, def: pet.def, 
                ap: pet.ap, res: pet.res, speed: pet.speed 
            };

            // Level Up Loop
            while (pXp >= currentMaxXp) {
                pXp -= currentMaxXp;
                pLevel++;
                currentMaxXp = calculateMaxXp(pLevel);
                leveledUpCount++;

                // Fixe Stats pro Level addieren
                const growth = getLevelUpStats(pet.rarity);
                currentStats.maxHp += growth.hp;
                currentStats.atk += growth.atk;
                currentStats.def += growth.def;
                currentStats.ap += growth.ap;
                currentStats.res += growth.res;
                currentStats.speed += growth.speed;
            }

            let updates = { xp: pXp };
            
            if (leveledUpCount > 0) {
                updates = { 
                    ...updates, 
                    ...currentStats, 
                    level: pLevel, 
                    maxXp: currentMaxXp, 
                    hp: currentStats.maxHp // Heilung bei Level-Up
                };
                trackQuestProgress(user, 'LEVEL_UP_PET', leveledUpCount);
            }

            await updatePetInDB(petId, updates);
            
            // Inventar updaten
            const newInventory = user.inventory.filter(i => !idsToRemove.has(i.id));
            await updateUser(user.id, { inventory: newInventory });

            if (leveledUpCount > 0) showNotification(`${pet.name} ist ${leveledUpCount}x aufgestiegen!`, "success");
            else showNotification(`${pet.name} hat ${totalXpToAdd} XP erhalten.`, "success");
            return;
        }

        // 3. KOSMETIK
        if (COSMETICS[firstItem.variant]) {
            const cosmetic = COSMETICS[firstItem.variant];
            await updatePetInDB(petId, { customBackground: cosmetic.colorClass });
            const newInventory = user.inventory.filter(i => i.id !== itemId);
            await updateUser(user.id, { inventory: newInventory });
            showNotification(`Hintergrund von ${pet.name} geändert!`, "success");
            return;
        }

        showNotification("Unbekanntes Item.", "error");
    };

    return { 
        handleReduceCooldown, addToTeam, removeFromTeam, hatchEgg, startIncubation, breedPets, renamePet, 
        applyXpItem: applyItem, 
        releasePet 
    };
}