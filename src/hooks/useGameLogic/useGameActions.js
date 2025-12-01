const startIncubation = async (id, type) => { 
        if (!user) return null; 
        
        if (type === 'BOX') { 
            const box = user.inventory.find(i => i.id === id); 
            if (!box) return null; 
            
            const newInv = user.inventory.filter(i => i.id !== id); 
            // Pet generieren
            const newPet = generatePet(1, null, determineRarity(box.variant), null, box.variant === 'STARTER' ? 'STARTER' : 'SHOP'); 
            newPet.isEgg = box.variant !== 'STARTER'; 
            newPet.hatchAt = 0; 
            
            // DB Updates
            await addPetToDB(newPet, user.id); 
            await updateUser(user.id, { inventory: newInv }); 
            
            // WICHTIG: Das Pet MUSS zurückgegeben werden!
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