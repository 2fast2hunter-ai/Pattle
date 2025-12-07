import { TYPE_ADVANTAGES, TYPES } from '../../data/types';
import { generatePet } from './petGeneration';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const calculateEloChange = (playerRating, enemyRating, isWin) => {
    if (isWin) return 15;
    return -10;
};

export const calculateDamage = (attacker, defender, ability) => {
    const atk = attacker.atk || 10;
    const def = defender.def || 10;
    const power = ability.dmgScale || 1.0;
    const level = attacker.level || 1;
    let damage = Math.floor(((2 * level / 5 + 2) * power * atk / def) / 50 + 2);
    const speedDiff = (attacker.speed || 10) - (defender.speed || 10);
    const critChance = Math.max(5, Math.min(25, 5 + speedDiff / 2));
    const isCrit = Math.random() * 100 < critChance;
    if (isCrit) damage = Math.floor(damage * 1.5);
    let effectiveness = 1.0;
    const atkType = ability.element || attacker.type; 
    const defType = defender.type;
    const advantages = TYPE_ADVANTAGES[atkType];
    if (advantages) { if (advantages.super && advantages.super.includes(defType)) effectiveness = 2.0; else if (advantages.strong && advantages.strong.includes(defType)) effectiveness = 1.5; }
    damage = Math.floor(damage * effectiveness);
    const variance = (Math.random() * 0.3) + 0.85; 
    damage = Math.floor(damage * variance);
    if (damage < 1) damage = 1;
    return { damage, isCrit, effectiveness };
};

export const executeTurn = (attacker, defender, ability) => {
    const { damage, isCrit, effectiveness } = calculateDamage(attacker, defender, ability);
    const newHp = Math.max(0, (defender.currentHp || defender.maxHp) - damage);
    let logMessage = `${attacker.name} nutzt ${ability.name}!`;
    if (isCrit) logMessage += " Kritischer Treffer!";
    if (effectiveness > 1) logMessage += " Sehr effektiv!";
    logMessage += ` (${damage} Schaden)`;
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
        pet.name = `Wildes ${pet.name}`;
        pet.currentHp = pet.maxHp;
        pet.energy = 0;
        team.push(pet);
    }
    return team;
};