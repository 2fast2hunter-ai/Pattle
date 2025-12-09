import { LOOTBOXES } from '../../data/shopData';

export const determineRarity = (boxType) => {
    // Hole die Konfiguration für die Box (z.B. 'DIVINE')
    const box = LOOTBOXES[boxType];
    
    // Sicherheits-Fallback, falls Box-Typ unbekannt
    if (!box || !box.drops) return 'COMMON';

    let rand = Math.random() * 100;
    let cumulativeChance = 0;

    // Wir gehen alle definierten Drops durch (z.B. { MYTHIC: 10, LEGENDARY: 20 ... })
    // und summieren die Wahrscheinlichkeiten auf.
    for (const [rarity, chance] of Object.entries(box.drops)) {
        cumulativeChance += chance;
        if (rand < cumulativeChance) {
            return rarity;
        }
    }

    // FALLBACK:
    // Falls die Summe der Wahrscheinlichkeiten nicht 100% ergibt (z.B. Tippfehler in shopData)
    // oder rand sehr nah an 100 war, nehmen wir einfach die Rarity mit der HÖCHSTEN Wahrscheinlichkeit.
    // Das verhindert, dass eine Divine-Box versehentlich 'COMMON' droppt, nur weil 0.1% fehlen.
    
    const entries = Object.entries(box.drops);
    if (entries.length > 0) {
        // Sortiere absteigend nach Chance und nimm das erste (häufigste) Element
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0][0];
    }

    return 'COMMON';
};