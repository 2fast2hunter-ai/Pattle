import { updateUser, addPetToDB, trackQuestProgress } from './src/utils/db';
import { generatePet } from './src/utils/gameMechanics';
import { RARITIES } from './src/data/gameData';

// Logik für die Bestimmung der Kind-Seltenheit
const calculateBreedingRarity = (p1, p2) => {
    if (!RARITIES[p1.rarity]) return 'COMMON';

    // Sortiere Seltenheiten nach ID aufsteigend
    const sortedKeys = Object.keys(RARITIES).sort((a, b) => RARITIES[a].id - RARITIES[b].id);

    // Gleiche Seltenheit: 10% Chance auf Upgrade
    const roll = Math.random() * 100;
    if (roll < 10) {
        const idx = sortedKeys.indexOf(p1.rarity);
        // Wenn nicht schon die höchste Stufe
        if (idx !== -1 && idx < sortedKeys.length - 1) {
            return sortedKeys[idx + 1];
        }
    }
    return p1.rarity;
};

export const breedPets = async (state, showNotification, p1Id, p2Id) => {
    const { user, myPets } = state;
    if (!user) return;

    // 1. Validierung der Eltern
    const p1 = myPets.find(p => p.id === p1Id);
    const p2 = myPets.find(p => p.id === p2Id);

    if (!p1 || !p2) {
        showNotification("Fehler: Eltern nicht gefunden.", "error");
        return;
    }

    if (p1.id === p2.id) {
        showNotification("Ein Pet kann sich nicht mit sich selbst paaren!", "error");
        return;
    }

    if (p1.rarity !== p2.rarity) {
        showNotification("Nur Pets gleicher Seltenheit können gepaart werden!", "error");
        return;
    }

    if (p1.incubating || p2.incubating) {
        showNotification("Eier können nicht zur Zucht verwendet werden!", "error");
        return;
    }

    // 2. Ressourcen-Check (Zucht-Ticket)
    const inventory = user.inventory || [];
    const ticketIndex = inventory.findIndex(i => i.variant === 'BREED');

    if (ticketIndex === -1) {
        showNotification("Du benötigst ein Zucht-Ticket!", "error");
        return;
    }

    // 3. Ticket entfernen
    const newInventory = [...inventory];
    newInventory.splice(ticketIndex, 1);
    await updateUser(user.id, { inventory: newInventory });

    // 4. Kind generieren
    // Typ: 50% Chance auf Typ von Elternteil 1 oder 2
    const childType = Math.random() < 0.5 ? p1.type : p2.type;
    
    // Seltenheit: Basierend auf Eltern
    const childRarity = calculateBreedingRarity(p1, p2);

    // Neues Pet generieren (Level 1)
    const newPet = generatePet(1, childType, childRarity);
    
    // Als Ei konfigurieren
    newPet.name = "Zucht-Ei";
    newPet.source = 'BREEDING';
    newPet.isEgg = true;
    newPet.incubating = true;
    newPet.hatchTime = Date.now() + (1000 * 60 * 10); // 10 Minuten Brutzeit
    newPet.ownerId = user.id;
    
    // Eltern speichern (Snapshot für Anzeige)
    newPet.parents = [
        { id: p1.id, name: p1.name, species: p1.species || 'Unknown', type: p1.type },
        { id: p2.id, name: p2.name, species: p2.species || 'Unknown', type: p2.type }
    ];

    // Metadaten für Anzeige (DNA Icon & Tooltip)
    newPet.customData = { 
        isBreeding: true,
        parentsNames: `${p1.name} & ${p2.name}`
    };

    // 5. In DB speichern
    await addPetToDB(newPet, user.id);

    // 6. Quest & Feedback
    trackQuestProgress(user, 'BREED_PETS', 1);
    showNotification("Zucht erfolgreich! Ein neues Ei liegt im Nest.", "success");
};