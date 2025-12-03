import { 
  RARITIES, TYPES, ABILITIES, ZODIAC_ANIMALS, TYPE_ADVANTAGES, SPECIES_BY_TYPE,
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

export const determineRarity = (boxType = 'STANDARD') => {
    if (boxType === 'STARTER') return 'RARE'; 

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

export const generatePet = (level = 1, fixedType = null, rarityKey = null, inheritedStats = null, source = 'SHOP', speciesKeyOverride = null) => {
  const typeKeys = Object.keys(TYPES);
  
  // Wenn Override da ist, nehmen wir dessen Typ, sonst Random oder fixedType
  let type = fixedType;
  let speciesKey = speciesKeyOverride;

  if (speciesKeyOverride) {
      // Wenn eine geheime Spezies erzwungen wird, holen wir ihren Typ
      const forcedSpecies = ZODIAC_ANIMALS[speciesKeyOverride];
      if (forcedSpecies) {
          type = forcedSpecies.type;
      }
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

  // --- FÄHIGKEIT WÄHLEN ---
  let abilityKey;
  if (source === 'BREEDING' && !speciesKeyOverride) {
      const abilityKeys = Object.keys(ABILITIES);
      abilityKey = abilityKeys[Math.floor(Math.random() * abilityKeys.length)];
  } else {
      const matchingAbilities = Object.keys(ABILITIES).filter(key => ABILITIES[key].element === type);
      abilityKey = matchingAbilities.length > 0 ? matchingAbilities[Math.floor(Math.random() * matchingAbilities.length)] : Object.keys(ABILITIES)[0];
  }

  // --- SPEZIES WÄHLEN ---
  if (!speciesKey) {
      const validSpeciesKeys = SPECIES_BY_TYPE[type] || [];
      if (validSpeciesKeys.length > 0) {
          const rollSpecies = Math.random() * 100;
          // 2% Chance auf "Rare Species" (1. in der Liste)
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

  // Stats generieren
  let b_hp, b_atk, b_ap, b_def, b_res, b_speed;

  if (inheritedStats) {
      b_hp = inheritedStats.hp; b_atk = inheritedStats.atk; b_ap = inheritedStats.ap; b_def = inheritedStats.def; b_res = inheritedStats.res; b_speed = inheritedStats.speed;
  } else {
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

export const generateHybridPet = (p1, p2) => {
    // 1. Sortiere Typen für Rezept-Suche (Alphabetisch)
    const types = [p1.type, p2.type].sort();
    const recipeKey = `${types[0]}_${types[1]}`;
    
    // 2. Prüfe auf festes Rezept
    const recipe = FUSION_RECIPES[recipeKey];

    let newLabel, newIcon, newType, isSecretRecipe;

    if (recipe) {
        // REZEPT GEFUNDEN!
        newLabel = recipe.label;
        newIcon = recipe.icon;
        newType = recipe.type;
        isSecretRecipe = true;
    } else {
        // KEIN REZEPT -> PROZEDURALE MUTATION
        // Wir mischen die Namen und Icons der Eltern
        isSecretRecipe = false;
        newType = Math.random() > 0.5 ? p1.type : p2.type; // Erbt einen Typ zufällig
        
        // Icon Mix: Einfach beide Icons nebeneinander
        const icon1 = ZODIAC_ANIMALS[p1.species]?.icon || '❓';
        const icon2 = ZODIAC_ANIMALS[p2.species]?.icon || '❓';
        newIcon = `${icon1}${icon2}`;

        // Namens-Mix (Erste Hälfte von P1 + Zweite Hälfte von P2)
        // Wir nehmen den Basis-Label aus den Daten, nicht den individuellen Namen
        const label1 = ZODIAC_ANIMALS[p1.species]?.label || p1.name;
        const label2 = ZODIAC_ANIMALS[p2.species]?.label || p2.name;
        
        const part1 = label1.substring(0, Math.ceil(label1.length / 2));
        const part2 = label2.substring(Math.ceil(label2.length / 2));
        newLabel = part1 + part2;
    }

    // Basis-Pet erstellen
    // Wir nutzen 'MUTANT' als Rarity-Platzhalter, wird aber gleich überschrieben
    // inheritedStats = null (wird unten berechnet)
    const basePet = generatePet(1, newType, null, null, 'BREEDING');

    // Rarity berechnen (Mutanten sind oft stark)
    const rarityKey = calculateBreedRarity(p1.rarity, p2.rarity);
    
    // ID und Spezies setzen
    // WICHTIG: Wir nutzen 'CUSTOM' als Spezies-Key, damit das UI weiß, dass es Custom-Daten nutzen soll
    basePet.species = 'CUSTOM'; 
    
    // Custom Daten ins Pet schreiben (für die Anzeige und Speicherung)
    basePet.customData = {
        label: newLabel,
        icon: newIcon,
        isSecret: isSecretRecipe,
        parents: [p1.name, p2.name] // Optional: Für Stammbaum
    };
    
    basePet.name = newLabel; // Startname = Speziesname
    basePet.rarity = rarityKey;

    // Stats Vererbung (Mix + kleiner Mutations-Bonus)
    const mix = (v1, v2) => Math.floor((v1 + v2) / 2 * 1.1); // 10% Bonus für Mutation
    
    basePet.b_hp = mix(p1.b_hp || 10, p2.b_hp || 10);
    basePet.b_atk = mix(p1.b_atk || 2, p2.b_atk || 2);
    basePet.b_ap = mix(p1.b_ap || 2, p2.b_ap || 2);
    basePet.b_def = mix(p1.b_def || 1, p2.b_def || 1);
    basePet.b_res = mix(p1.b_res || 1, p2.b_res || 1);
    basePet.b_speed = mix(p1.b_speed || 1, p2.b_speed || 1);

    // Stats neu berechnen mit den neuen Basiswerten
    basePet.maxHp = calculateStatValue(basePet.b_hp, 1);
    basePet.hp = basePet.maxHp;
    basePet.atk = calculateStatValue(basePet.b_atk, 1);
    basePet.ap = calculateStatValue(basePet.b_ap, 1);
    basePet.def = calculateStatValue(basePet.b_def, 1);
    basePet.res = calculateStatValue(basePet.b_res, 1);
    basePet.speed = calculateStatValue(basePet.b_speed, 1);

    return basePet;
};

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