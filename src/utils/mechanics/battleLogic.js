import { TYPE_ADVANTAGES, TYPES } from '../../data/types';
import { generatePet } from './petGeneration';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const calculateEloChange = (playerRating, enemyRating, isWin) => {
    if (isWin) return 15;
    return -10;
};

export const calculateDamage = (attacker, defender, ability) => {
    // 1. Attribute bestimmen (Physisch vs Spezial)
    const isPhysical = ability.type === 'PHYSICAL';
    
    // WICHTIG: Fallback auf 0 verhindern
    const atkStat = isPhysical ? (attacker.atk || 10) : (attacker.ap || 10);
    const defStat = isPhysical ? (defender.def || 10) : (defender.res || 10);
    
    // 2. Skalierung der Fähigkeit einberechnen
    const power = ability.dmgScale || 1.0;
    const scaledAtk = Math.floor(atkStat * power);

    // 3. NEUE FORMEL: Linearer Abzug
    // Basis: Wenn AD = Rüstung -> Schaden = AD.
    // Mathematisch: (2 * AD) - Rüstung
    // Beispiel: 100 AD vs 100 Rüstung -> 200 - 100 = 100 Schaden.
    // Beispiel: 100 AD vs 105 Rüstung -> 200 - 105 = 95 Schaden (-5).
    let damage = Math.floor((2 * scaledAtk) - defStat);

    // 4. Kritische Treffer
    // Nutzt critRate vom Pet, Fallback auf Speed-Berechnung
    const critChance = attacker.critRate || Math.max(5, Math.min(25, 5 + ((attacker.speed || 10) - (defender.speed || 10)) / 2));
    const isCrit = Math.random() * 100 < critChance;
    
    if (isCrit) damage = Math.floor(damage * 1.5);
    
    // 5. Typen-Effektivität (Elemente)
    let effectiveness = 1.0;
    const atkType = ability.element || attacker.type; 
    const defType = defender.type;
    const advantages = TYPE_ADVANTAGES[atkType];
    
    if (advantages) { 
        if (advantages.super && advantages.super.includes(defType)) {
            effectiveness = 2.0; // Sehr effektiv
        } else if (advantages.weak && advantages.weak.includes(defType)) {
            effectiveness = 0.5; // Nicht effektiv
        }
    }
    
    damage = Math.floor(damage * effectiveness);
    
    // 6. Zufalls-Varianz (0.85 bis 1.15)
    const variance = (Math.random() * 0.3) + 0.85; 
    damage = Math.floor(damage * variance);
    
    // Mindestschaden 1
    if (damage < 1) damage = 1;
    
    return { damage, isCrit, effectiveness };
};

export const executeTurn = (attacker, defender, ability) => {
    const { damage, isCrit, effectiveness } = calculateDamage(attacker, defender, ability);
    const newHp = Math.max(0, (defender.currentHp || defender.maxHp) - damage);
    
    let logMessage = `${attacker.name} uses ${ability.name}!`;
    if (isCrit) logMessage += " Critical hit!";

    if (effectiveness > 1) logMessage += " Super effective!";
    else if (effectiveness < 1) logMessage += " Not very effective...";

    logMessage += ` (${damage} damage)`;
    
    return { damage, newHp, isCrit, effectiveness, log: logMessage };
};

export const generateBattleTeam = (playerLevel) => {
    const teamSize = Math.min(5, Math.floor(playerLevel / 5) + 1);
    const team = [];
    for (let i = 0; i < teamSize; i++) {
        const level = Math.max(1, playerLevel + randomInt(-1, 2));
        const types = Object.keys(TYPES);
        const type = types[randomInt(0, types.length - 1)];
        const rarityRoll = Math.random();
        let rarity = 'COMMON';
        if (rarityRoll > 0.9) rarity = 'RARE';
        else if (rarityRoll > 0.6) rarity = 'UNCOMMON';
        const pet = generatePet(level, type, rarity, null, 'PVE_ENEMY');
        pet.name = `Wild ${pet.name}`;
        pet.currentHp = pet.maxHp;
        pet.energy = 0;
        team.push(pet);
    }
    return team;
};