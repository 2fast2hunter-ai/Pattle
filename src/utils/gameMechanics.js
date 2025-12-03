import { 
  RARITIES, TYPES, ABILITIES, ZODIAC_ANIMALS, TYPE_ADVANTAGES, SPECIES_BY_TYPE,
  QUEST_TEMPLATES, COMPOSITE_QUEST_REWARDS, SHOP_ITEMS, FUSION_RECIPES
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
    if (isWin) return 15;
    return -10;
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

// --- NEUE BOXEN LOGIK (Standard, Premium, Master, Divine) ---
export const determineRarity = (boxType = 'STANDARD') => {
    if (boxType === 'STARTER') return 'RARE'; 

    let pool = Object.values(RARITIES);

    // CAP: Standard & Premium nur bis Legendär (ID 5)
    if (boxType === 'STANDARD' || boxType === 'PREMIUM') {
        pool = pool.filter(r => r.id <= 5);
    }

    // MIN: Premium ab Ungewöhnlich
    if (boxType === 'PREMIUM') {
        pool = pool.filter(r => r.id > 1);
    }

    // MIN: Divine ab Selten
    if (boxType === 'DIVINE') {
        pool = pool.filter(r => r.id >= 3);
    }

    // Master hat keinen Filter (1-10)

    // GEWICHTUNG
    let weightedPool = pool.map(r => {
        let weight = r.dropChance;
        if (boxType === 'PREMIUM') weight *= 1.6;
        if (boxType === 'MASTER') weight *= 1.2;
        if (boxType === 'DIVINE') {
            if (r.id >= 6) weight *= 5.0; // High Tier Boost
        }
        return { ...r, weight };
    });

    const totalWeight = weightedPool.reduce((sum, r) => sum + r.weight, 0);
    let randomValue = Math.random() * totalWeight;

    // Sortieren wir hier aufsteigend nach ID
    weightedPool.sort((a, b) => a.id - b.id);

    for (const rarity of weightedPool) {
        randomValue -= rarity.weight;
        if (randomValue <= 0) {
             return Object.keys(RARITIES).find(key => RARITIES[key].id === rarity.id);
        }
    }
    // Fallback: Das seltenste aus dem Pool
    return Object.keys(RARITIES).find(key => RARITIES[key].id === weightedPool[weightedPool.length - 1].id);
};

export const calculateStatValue = (base, level) => {
    const val = Math.floor(base * (1 + (level - 1) * 0.1));
    return Math.max(1, val); 
};

export const generateQuests = (category) => {
  let count = 5; // Default (Daily)
  let multiplier = 1;

  if (category === 'DAILY') {
      count = 5;
      multiplier = 1; 
  } else if (category === 'WEEKLY') {
      count = 10; // Mehr Aufgaben
      multiplier = 5; 
  } else if (category === 'MONTHLY') {
      count = 20; // Viele Aufgaben
      multiplier = 20; 
  }

  const newQuests = [];

  // 1. Templates gruppieren nach "Kategorie" (Prefix)
  const groupedTemplates = {};
  QUEST_TEMPLATES.forEach(template => {
      const categoryKey = template.type.split('_')[0]; 
      if (!groupedTemplates[categoryKey]) {
          groupedTemplates[categoryKey] = [];
      }
      groupedTemplates[categoryKey].push(template);
  });

  // 2. Kategorien mischen
  const availableCategories = Object.keys(groupedTemplates);
  // Einfacher Shuffle
  for (let i = availableCategories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableCategories[i], availableCategories[j]] = [availableCategories[j], availableCategories[i]];
  }

  // 3. Auswahl der Kategorien für die Aufgaben
  const selectedCategories = [];
  
  // Schritt A: Jede verfügbare Kategorie mindestens 1x hinzufügen (damit Vielfalt garantiert ist)
  // (Solange wir noch Platz im 'count' haben)
  for (const cat of availableCategories) {
      if (selectedCategories.length < count) {
          selectedCategories.push(cat);
      }
  }

  // Schritt B: Den Rest zufällig auffüllen (hier sind Doppelungen erlaubt und gewollt)
  while (selectedCategories.length < count) {
      const randomCat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      selectedCategories.push(randomCat);
  }

  // 4. Konkrete Quests generieren
  selectedCategories.forEach(catKey => {
      const templatesInCat = groupedTemplates[catKey];
      // Wähle zufälliges Template aus dieser Kategorie
      const template = templatesInCat[Math.floor(Math.random() * templatesInCat.length)];

      const variance = 0.8 + Math.random() * 0.4;
      const targetAmount = Math.ceil(template.baseAmount * multiplier * variance);
      
      let rewardAmount = Math.ceil(template.rewardBase * multiplier * variance);
      let rewardType = template.rewardType;

      // Bonus-Chance bei monatlichen Quests
      if (category === 'MONTHLY' && Math.random() > 0.7) { // Etwas seltener
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
  });

  return {
      quests: newQuests,
      expiresAt: calculateNextResetTime(category),
      completedCount: 0,
      claimedComposite: false,
      totalQuests: count,
      reward: COMPOSITE_QUEST_REWARDS[category]
  };
};

export const generatePet = (level = 1, fixedType = null, rarityKey = null, inheritedStats = null, source = 'SHOP', speciesKeyOverride = null) => {
  const typeKeys = Object.keys(TYPES);
  let type = fixedType;
  let speciesKey = speciesKeyOverride;
  if (speciesKeyOverride) {
      const forcedSpecies = ZODIAC_ANIMALS[speciesKeyOverride];
      if (forcedSpecies) { type = forcedSpecies.type; }
  } else if (!type) {
      type = typeKeys[Math.floor(Math.random() * typeKeys.length)];
  }
  
  let rarity = rarityKey || 'COMMON';
  const mult = RARITIES[rarity].multi;
  
  const genBase = (val) => {
      if (inheritedStats) return inheritedStats; 
      const raw = val * mult; 
      return Math.max(1, Math.floor(raw + (Math.random() * raw * 0.2))); 
  };

  let abilityKey;
  if (source === 'BREEDING' && !speciesKeyOverride) {
      const abilityKeys = Object.keys(ABILITIES);
      abilityKey = abilityKeys[Math.floor(Math.random() * abilityKeys.length)];
  } else {
      const matchingAbilities = Object.keys(ABILITIES).filter(key => ABILITIES[key].element === type);
      abilityKey = matchingAbilities.length > 0 ? matchingAbilities[Math.floor(Math.random() * matchingAbilities.length)] : Object.keys(ABILITIES)[0];
  }

  if (!speciesKey) {
      const validSpeciesKeys = SPECIES_BY_TYPE[type] || [];
      if (validSpeciesKeys.length > 0) {
          const rollSpecies = Math.random() * 100;
          if (rollSpecies <= 2 && validSpeciesKeys.length >= 2) {
              speciesKey = validSpeciesKeys[0]; 
          } else {
              const remainingSpecies = validSpeciesKeys.slice(1);
              speciesKey = remainingSpecies[Math.floor(Math.random() * remainingSpecies.length)];
          }
      } else {
          speciesKey = Object.keys(ZODIAC_ANIMALS)[0]; 
      }
  }

  const speciesData = ZODIAC_ANIMALS[speciesKey];
  const suffixes = ['mon', 'zor', 'tros', 'nix', 'a', 'os', 'king', 'lord', 'god', 'soul', 'heart', 'claw'];
  const baseName = speciesData.label + (Math.random() > 0.5 ? '' : ' ' + suffixes[Math.floor(Math.random() * suffixes.length)]);

  let b_hp, b_atk, b_ap, b_def, b_res, b_speed;

  if (inheritedStats) {
      b_hp = inheritedStats.hp; b_atk = inheritedStats.atk; b_ap = inheritedStats.ap; b_def = inheritedStats.def; b_res = inheritedStats.res; b_speed = inheritedStats.speed;
  } else {
      b_hp = genBase(8); b_atk = genBase(2); b_ap = genBase(2); b_def = genBase(1); b_res = genBase(1); b_speed = genBase(1);
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

export const generateHybridPet = (p1, p2) => {
    const types = [p1.type, p2.type].sort();
    const recipeKey = `${types[0]}_${types[1]}`;
    
    const recipe = FUSION_RECIPES[recipeKey];

    let newLabel, newIcon, newType, isSecretRecipe;

    if (recipe) {
        newLabel = recipe.label;
        newIcon = recipe.icon;
        newType = recipe.type;
        isSecretRecipe = true;
    } else {
        isSecretRecipe = false;
        newType = Math.random() > 0.5 ? p1.type : p2.type;
        
        const icon1 = ZODIAC_ANIMALS[p1.species]?.icon || '❓';
        const icon2 = ZODIAC_ANIMALS[p2.species]?.icon || '❓';
        newIcon = `${icon1}${icon2}`;

        const label1 = ZODIAC_ANIMALS[p1.species]?.label || p1.name;
        const label2 = ZODIAC_ANIMALS[p2.species]?.label || p2.name;
        
        const part1 = label1.substring(0, Math.ceil(label1.length / 2));
        const part2 = label2.substring(Math.ceil(label2.length / 2));
        newLabel = part1 + part2;
    }

    const basePet = generatePet(1, newType, null, null, 'BREEDING');

    const rarityKey = calculateBreedRarity(p1.rarity, p2.rarity);
    
    basePet.species = 'CUSTOM'; 
    
    basePet.customData = {
        label: newLabel,
        icon: newIcon,
        isSecret: isSecretRecipe,
        parents: [p1.name, p2.name]
    };
    
    basePet.name = newLabel; 
    basePet.rarity = rarityKey;

    const mix = (v1, v2) => Math.floor((v1 + v2) / 2 * 1.1); 
    
    basePet.b_hp = mix(p1.b_hp || 10, p2.b_hp || 10);
    basePet.b_atk = mix(p1.b_atk || 2, p2.b_atk || 2);
    basePet.b_ap = mix(p1.b_ap || 2, p2.b_ap || 2);
    basePet.b_def = mix(p1.b_def || 1, p2.b_def || 1);
    basePet.b_res = mix(p1.b_res || 1, p2.b_res || 1);
    basePet.b_speed = mix(p1.b_speed || 1, p2.b_speed || 1);

    basePet.maxHp = calculateStatValue(basePet.b_hp, 1);
    basePet.hp = basePet.maxHp;
    basePet.atk = calculateStatValue(basePet.b_atk, 1);
    basePet.ap = calculateStatValue(basePet.b_ap, 1);
    basePet.def = calculateStatValue(basePet.b_def, 1);
    basePet.res = calculateStatValue(basePet.b_res, 1);
    basePet.speed = calculateStatValue(basePet.b_speed, 1);

    return basePet;
};

export const getUnlockedTeamSlots = (level) => {
    const maxSlots = 10;
    let slots = 1;
    if (level >= 3) { slots = 2; slots += Math.floor((level - 3) / 5); }
    return Math.min(maxSlots, slots);
};
export const getUnlockedHatcherySlots = (level) => {
  if (level < 15) return 1;
  return Math.min(10, 2 + Math.floor((level - 15) / 10));
};
export const getMaxEnergy = (level) => { return 10 + ((level - 1) * 2); };
export const calculateCurrentEnergy = (user) => {
    if (!user) return 0;
    const maxEnergy = getMaxEnergy(user.level);
    const now = Date.now();
    const msPerEnergy = 1000 * 60 * 5; 
    const timeDiff = now - (user.lastEnergyUpdate || now);
    const energyGained = Math.floor(timeDiff / msPerEnergy);
    const totalEnergy = Math.min(maxEnergy, (user.energy || 0) + energyGained);
    return totalEnergy;
};