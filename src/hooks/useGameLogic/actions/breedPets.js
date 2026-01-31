import { updateUser, addPetToDB, updatePetInDB, trackQuestProgress } from '../../../utils/db';
import { generatePet } from '../../../utils/gameMechanics';
import { RARITIES } from '../../../data/gameData';

export const breedPets = async (state, showNotification, p1Arg, p2Arg) => {
    const { user, myPets } = state;
    if (!user) return;

    // IDs in Objekte auflösen, falls nur IDs übergeben wurden
    const parent1 = typeof p1Arg === 'string' ? myPets.find(p => p.id === p1Arg) : p1Arg;
    const parent2 = typeof p2Arg === 'string' ? myPets.find(p => p.id === p2Arg) : p2Arg;

    if (!parent1 || !parent2) {
        showNotification("Fehler: Eltern-Pets nicht gefunden.", "error");
        return;
    }

    // Ticket Check
    const inventory = user.inventory || [];
    const ticketIndex = inventory.findIndex(i => i.type === 'TICKET'); 
    
    let cost = 0;
    let newInventory = [...inventory];

    if (ticketIndex !== -1) {
        // Ticket verbrauchen
        newInventory.splice(ticketIndex, 1);
        cost = 0;
    } else {
        // Kosten Check (100 Gold)
        cost = 100;
        if (user.coins < cost) {
            showNotification("Nicht genug Gold! (Benötigt: 100 oder Zucht-Ticket)", "error");
            return;
        }
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
    
    let rarity = parent1.rarity || 'COMMON';
    
    // Wahrscheinlichkeit für höhere Seltenheit berechnen
    const sortedRarities = Object.keys(RARITIES).sort((a, b) => RARITIES[a].id - RARITIES[b].id);
    const currentIndex = sortedRarities.indexOf(rarity);

    if (currentIndex !== -1 && currentIndex < sortedRarities.length - 1) {
        const upgradeChance = Math.max(1, 10 - currentIndex); // 10% bei Common, -1% pro Stufe
        if (Math.random() * 100 < upgradeChance) {
            rarity = sortedRarities[currentIndex + 1];
        }
    }

    const baby = generatePet(1, type, rarity, null, 'BREEDING');
    
    baby.isEgg = true;
    // hatchAt auf 0 setzen, damit es im Inventar landet und nicht direkt brütet
    baby.hatchAt = 0;
    baby.parents = [parent1.id, parent2.id];

    // Sanitize: Entferne undefined Werte für Firestore (z.B. durch JSON-Zyklus)
    const babyData = JSON.parse(JSON.stringify(baby));

    await addPetToDB(babyData, user.id);
    
    // Cooldowns setzen
    const cooldownTime = 2 * 60 * 60 * 1000; // 2 Stunden
    await updatePetInDB(parent1.id, { breedingCooldown: now + cooldownTime });
    await updatePetInDB(parent2.id, { breedingCooldown: now + cooldownTime });
    
    const updates = { 
        "stats.bred": (user.stats?.bred || 0) + 1,
        inventory: newInventory
    };
    if (cost > 0) {
        updates.coins = user.coins - cost;
    }

    await updateUser(user.id, updates);
    trackQuestProgress(user, 'BREED_PET', 1, [`BREED_${type}`]);
    showNotification(ticketIndex !== -1 ? "Zucht erfolgreich! (Ticket verwendet)" : "Zucht erfolgreich! (100 Gold)", "success");
    return baby;
};