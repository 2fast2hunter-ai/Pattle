import { updateUser, addPetToDB, updatePetInDB, trackQuestProgress } from '../../../utils/db';
import { generatePet } from '../../../utils/gameMechanics';
import { RARITIES } from '../../../data/gameData';

export const breedPets = async (state, showNotification, parent1, parent2) => {
    const { user } = state;
    if (!user) return;

    // Kosten Check (Beispiel: 100 Gold)
    const cost = 100;
    if (user.coins < cost) {
        showNotification("Nicht genug Gold!", "error");
        return;
    }

    // Cooldown Check
    const now = Date.now();
    if (parent1.breedingCooldown > now || parent2.breedingCooldown > now) {
        showNotification("Eltern sind noch nicht bereit!", "error");
        return;
    }

    // Neues Pet generieren (Mix aus Eltern)
    // Vereinfacht: Zufälliger Typ von einem Elternteil, Level 1
    const type = Math.random() > 0.5 ? parent1.type : parent2.type;
    const rarity = parent1.rarity; // Vereinfacht
    const baby = generatePet(1, type, rarity, null, 'BREEDING');
    
    baby.isEgg = true;
    baby.hatchAt = now + (RARITIES[rarity].hatchDuration || 60000);
    baby.parents = [parent1.id, parent2.id];

    await addPetToDB(baby, user.id);
    
    // Cooldowns setzen
    const cooldownTime = 2 * 60 * 60 * 1000; // 2 Stunden
    await updatePetInDB(parent1.id, { breedingCooldown: now + cooldownTime });
    await updatePetInDB(parent2.id, { breedingCooldown: now + cooldownTime });
    
    await updateUser(user.id, { coins: user.coins - cost, "stats.bred": (user.stats?.bred || 0) + 1 });
    trackQuestProgress(user, 'BREED_PETS', 1);
    showNotification("Zucht erfolgreich! Ein Ei wurde gelegt.", "success");
};