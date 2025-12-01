import { 
  RARITIES, TYPES, ABILITIES, ZODIAC_ANIMALS, TYPE_ADVANTAGES,
  QUEST_TEMPLATES, COMPOSITE_QUEST_REWARDS, SHOP_ITEMS
} from '../data/gameData'; 

export const ENERGY_REGEN_TIME_MS = 1000 * 60 * 5; 

// Reset-Zeit-Berechnung
const calculateNextResetTime = (category) => {
    let nextTarget = new Date();
    if (category === 'DAILY') {
        nextTarget.setDate(nextTarget.getDate() + 1);
        nextTarget.setHours(0, 0, 0, 0);
    } else if (category === 'WEEKLY') {
        const day = nextTarget.getDay(); 
        let daysUntilMonday = (1 + 7 - day) % 7;
        if (daysUntilMonday === 0) daysUntilMonday = 7;
        nextTarget.setDate(nextTarget.getDate() + daysUntilMonday);
        nextTarget.setHours(0, 0, 0, 0);
    } else if (category === 'MONTHLY') {
        nextTarget.setFullYear(nextTarget.getFullYear(), nextTarget.getMonth() + 1, 1);
        nextTarget.setHours(0, 0, 0, 0);
    }
    return nextTarget.getTime(); 
};

export const calculateBreedRarity = (rarity1Key, rarity2Key) => {
    const rarityKeys = Object.keys(RARITIES);
    const id1 = RARITIES[rarity1Key].id;
    const id2 = RARITIES[rarity2Key].id;
    const minId = Math.min(id1, id2);
    const maxId = Math.max(id1, id2);
    const roll = Math.random() * 100;
    let targetId = minId; 
    
    if (minId === maxId) {
        if (roll <= 5) targetId = Math.min(maxId + 1, rarityKeys.length);
        else targetId = maxId; 
    } else {
        if (roll <= 9) targetId = maxId;
        else targetId = minId;
        if (targetId === maxId && Math.random() * 100 <= 1) targetId = Math.min(maxId + 1, rarityKeys.length);
    }
    const finalId = Math.max(minId, targetId);
    return rarityKeys[finalId - 1]; 
};

export const calculateEloChange = (playerRating, enemyRating, isWin) => {
    const K = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (enemyRating - playerRating) / 400));
    const actualScore = isWin ? 1 : 0;
    return Math.round(K * (actualScore - expectedScore));
};

export const getDamageMultiplier = (atkType, defType) => {
  if (!atkType || !defType) return 1.0;
  const advantages = TYPE_ADVANTAGES[atkType] || { strong: [], super: [] };
  if (advantages.super?.includes(defType)) return 4.0;
  if (advantages.strong?.includes(defType)) return 2.0;
  const defAdvantages = TYPE_ADVANTAGES[defType] || { strong: [], super: [] };
  if (defAdvantages.super?.includes(atkType)) return 0.25;
  if (defAdvantages.strong?.includes(atkType)) return 0.5;
  return 1.0;
};

export const determineRarity = (boxType = 'STANDARD') => {
    // --- HIER IST DIE ÄNDERUNG ---
    if (boxType === 'STARTER') return 'COMMON'; // Jetzt 'RARE' statt 'COMMON'
    // -----------------------------

    const roll = Math.random() * 100;
    let cumulative = 0;
    const sortedRarities = Object.values(RARITIES).sort((a, b) => a.dropChance - b.dropChance);
    for (const rarity of sortedRarities) {
        let chance = rarity.dropChance;
        if (boxType === 'PREMIUM') {
            if (rarity.id === 1) continue; 
            chance = chance * 1.6; 
        }
        cumulative += chance;
        if (roll <= cumulative) return Object.keys(RARITIES).find(key => RARITIES[key].id === rarity.id);
    }
    return boxType === 'PREMIUM' ? 'UNCOMMON' : 'COMMON';
};

// Stat-Berechnung
export const calculateStatValue = (base, level) => {
    const val = Math.floor(base * (1 + (level - 1) * 0.1));
    return Math.max(1, val); 
};

export const generateQuests = (category) => {
  const count = 5; 
  const newQuests = [];
  let multiplier = category === 'DAILY' ? 1 : (category === 'WEEKLY' ? 5 : 20);

  for (let i = 0; i < count; i++) {
      const template = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
      const variance = 0.8 + Math.random() * 0.4;
      const targetAmount = Math.ceil(template.baseAmount * multiplier * variance);
      let rewardAmount = Math.ceil(template.rewardBase * multiplier * variance);
      let rewardType = template.rewardType;

      if (category === 'MONTHLY' && Math.random() > 0.5) {
          rewardType = 'EGG_RARE';
          rewardAmount = 1;
      }

      newQuests.push({
          id: Date.now() + Math.random().toString(),
          type: template.type,
          label: template.label,
          target: targetAmount,
          progress: 0,
          rewardType: rewardType,
          rewardAmount: rewardAmount,
          claimed: false,
          category: category
      });
  }

  return {
      quests: newQuests,
      expiresAt: calculateNextResetTime(category),
      completedCount: 0,
      claimedComposite: false,
      totalQuests: count,
      reward: COMPOSITE_QUEST_REWARDS[category]
  };
};

export const generatePet = (level = 1, fixedType = null, rarityKey = null, inheritedStats = null, source = 'SHOP') => {
  const typeKeys = Object.keys(TYPES);
  const type = fixedType || typeKeys[Math.floor(Math.random() * typeKeys.length)];
  
  let rarity = rarityKey || 'COMMON';
  const mult = RARITIES[rarity].multi;
  
  const genBase = (val) => {
      if (inheritedStats) return inheritedStats; 
      const raw = val * mult; 
      return Math.max(1, Math.floor(raw + (Math.random() * raw * 0.2))); 
  };

  let abilityKey;
  if (source === 'BREEDING') {
      const abilityKeys = Object.keys(ABILITIES);
      abilityKey = abilityKeys[Math.floor(Math.random() * abilityKeys.length)];
  } else {
      const matchingAbilities = Object.keys(ABILITIES).filter(key => ABILITIES[key].element === type);
      abilityKey = matchingAbilities.length > 0 ? matchingAbilities[Math.floor(Math.random() * matchingAbilities.length)] : Object.keys(ABILITIES)[0];
  }

  const prefixes = { FIRE: 'Pyro', WATER: 'Aqua', NATURE: 'Terra', WIND: 'Aero', EARTH: 'Geo', ICE: 'Frost', ELECTRIC: 'Volt', LIGHT: 'Lumen', DARK: 'Umbra', GHOST: 'Phantom', MAGIC: 'Arcan', PSYCHIC: 'Mind', FIGHTING: 'Brawl', METAL: 'Ferrum', ROCK: 'Petra', POISON: 'Venom', DRAGON: 'Draco', FAIRY: 'Pixie', TECH: 'Cyber', SOUND: 'Sonic', TIME: 'Chrono', SPACE: 'Astro', VOID: 'Null', CHAOS: 'Havoc', ORDER: 'Law' };
  const suffixes = ['mon', 'zor', 'tros', 'nix', 'a', 'os', 'king', 'lord', 'god', 'soul'];
  const baseName = (prefixes[type] || 'Mono') + suffixes[Math.floor(Math.random() * suffixes.length)];
  const speciesKeys = Object.keys(ZODIAC_ANIMALS);
  const speciesKey = speciesKeys[Math.floor(Math.random() * speciesKeys.length)];

  let b_hp, b_atk, b_ap, b_def, b_res, b_speed;

  if (inheritedStats) {
      b_hp = inheritedStats.hp; b_atk = inheritedStats.atk; b_ap = inheritedStats.ap; b_def = inheritedStats.def; b_res = inheritedStats.res; b_speed = inheritedStats.speed;
  } else {
      // Basiswerte (wie im letzten Schritt festgelegt)
      b_hp = genBase(8);
      b_atk = genBase(2);
      b_ap = genBase(2);
      b_def = genBase(1);
      b_res = genBase(1);
      b_speed = genBase(1);
  }

  return {
    id: Date.now() + Math.random().toString(),
    name: baseName,
    type: type,
    secondaryType: null,
    species: speciesKey,
    rarity: rarity,
    level: level,
    xp: 0,
    maxXp: 100 * level,
    abilityId: abilityKey,
    
    b_hp, b_atk, b_ap, b_def, b_res, b_speed,

    maxHp: calculateStatValue(b_hp, level),
    hp: calculateStatValue(b_hp, level),
    atk: calculateStatValue(b_atk, level),
    ap: calculateStatValue(b_ap, level),
    def: calculateStatValue(b_def, level),
    res: calculateStatValue(b_res, level),
    speed: calculateStatValue(b_speed, level),

    critRate: 5 + Math.floor(Math.random() * 10),
    critDmg: 150,
    currentCd: 0,
    isEgg: false,
    hatchAt: 0,
    source: source,
    price: 0 
  };
};

export const getUnlockedTeamSlots = (level) => {
    const maxSlots = 10;
    let slots = 1;
    if (level >= 3) {
        slots = 2; 
        slots += Math.floor((level - 3) / 5);
    }
    return Math.min(maxSlots, slots);
};

export const getUnlockedHatcherySlots = (level) => {
  if (level < 15) return 1;
  return Math.min(10, 2 + Math.floor((level - 15) / 10));
};

export const getMaxEnergy = (level) => {
  return 10 + ((level - 1) * 2);
};