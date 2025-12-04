import { RARITIES, TYPES, QUEST_TYPES } from '../../../data/gameData';
import { 
    generatePet, 
    getUnlockedHatcherySlots, 
    determineRarity, 
    calculateBreedRarity, 
    generateHybridPet 
} from '../../../utils/gameMechanics';
import { 
    updateUser, addPetToDB, updatePetInDB, trackQuestProgress 
} from '../../../utils/db';

export function usePetActions(state, showNotification) {
    const { user, myPets, setCurrentView, selectedSlotForTeam, setSelectedSlotForTeam } = state;

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

    const addToTeam = (petId) => {
        if (!user || selectedSlotForTeam === null) return;
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;
        if (pet.isEgg) { showNotification("Eier kämpfen nicht!", 'error'); return; }
        
        const currentTeamIds = user.team || [];
        const newPetType = pet.type;
        
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
        
        let child; 
        const rollMutation = Math.random() * 100; 
        if (rollMutation <= 10) { 
            child = generateHybridPet(p1, p2); 
        } else { 
            const childType = Math.random() > 0.5 ? p1.type : p2.type; 
            child = generatePet(1, childType, calculateBreedRarity(p1.rarity, p2.rarity), null, 'BREEDING'); 
            const mix = (v1, v2) => Math.floor((v1 + v2) / 2); 
            child.b_hp = mix(p1.b_hp || 10, p2.b_hp || 10); 
            child.b_atk = mix(p1.b_atk || 2, p2.b_atk || 2); 
        } 
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

    return { handleReduceCooldown, addToTeam, removeFromTeam, hatchEgg, startIncubation, breedPets };
}