import { RARITIES, TYPES, ABILITIES, ZODIAC_ANIMALS, SPECIES_BY_TYPE, FUSION_RECIPES } from '../../data/gameData';

// --- NEUE LOGIK: FIXE WERTE ---

// Berechnet die Zuwächse für ein einzelnes Level-Up basierend auf Seltenheit
export const getLevelUpStats = (rarityKey) => {
    let min = 1;
    let max = 2;

    switch (rarityKey) {
        case 'COMMON':       min = 1; max = 2; break;
        case 'UNCOMMON':     min = 2; max = 3; break;
        case 'RARE':         min = 3; max = 4; break;
        case 'EPIC':         min = 4; max = 5; break;
        case 'LEGENDARY':    min = 5; max = 6; break;
        case 'MYTHIC':       min = 6; max = 7; break;
        case 'DIVINE':       min = 7; max = 8; break;
        case 'ANCIENT':      min = 8; max = 9; break;
        case 'COSMIC':       min = 9; max = 10; break;
        case 'TRANSCENDENT': min = 10; max = 11; break;
        default:             min = 1; max = 2;
    }

    const roll = () => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
        // HP bekommt Multiplikator 5, damit die Werte verhältnismäßig passen
        hp: roll() * 5, 
        atk: roll(),
        def: roll(),
        ap: roll(),
        res: roll(),
        speed: roll()
    };
};

// Formel für Max XP: Start 100, dann exponentiell
export const calculateMaxXp = (level) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
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
  
  // Ability wählen
  let abilityKey;
  if (source === 'BREEDING' && !speciesKeyOverride) {
      const abilityKeys = Object.keys(ABILITIES);
      abilityKey = abilityKeys[Math.floor(Math.random() * abilityKeys.length)];
  } else {
      const matchingAbilities = Object.keys(ABILITIES).filter(key => ABILITIES[key].element === type);
      abilityKey = matchingAbilities.length > 0 ? matchingAbilities[Math.floor(Math.random() * matchingAbilities.length)] : Object.keys(ABILITIES)[0];
  }

  // Spezies wählen
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

  // Basis Stats (Level 1)
  let hp, atk, ap, def, res, speed;

  if (inheritedStats) {
      hp = inheritedStats.hp; atk = inheritedStats.atk; ap = inheritedStats.ap; def = inheritedStats.def; res = inheritedStats.res; speed = inheritedStats.speed;
  } else {
      // Basiswerte für Level 1 (leicht variiert durch Seltenheit)
      const baseMult = RARITIES[rarity].multi; 
      hp = Math.floor(100 * baseMult);
      atk = Math.floor(10 * baseMult);
      ap = Math.floor(10 * baseMult);
      def = Math.floor(5 * baseMult);
      res = Math.floor(5 * baseMult);
      speed = Math.floor(5 * baseMult);
  }

  // Initiales Pet Objekt
  const newPet = {
    id: Date.now() + Math.random().toString(),
    name: baseName,
    type: type,
    secondaryType: null,
    species: speciesKey,
    rarity: rarity,
    level: 1, // Startet intern bei 1
    xp: 0,
    maxXp: calculateMaxXp(1),
    abilityId: abilityKey,
    
    maxHp: hp, hp: hp,
    atk: atk, ap: ap,
    def: def, res: res,
    speed: speed,
    
    critRate: 5 + Math.floor(Math.random() * 10),
    critDmg: 150,
    currentCd: 0,
    isEgg: false,
    hatchAt: 0,
    source: source,
    isShiny: false,
    price: 0 
  };

  // Wenn das Pet mit einem höheren Level generiert werden soll (z.B. Gegner),
  // simulieren wir die Level-Ups sofort
  if (level > 1) {
      for (let i = 1; i < level; i++) {
          const growth = getLevelUpStats(rarity);
          newPet.maxHp += growth.hp;
          newPet.hp = newPet.maxHp;
          newPet.atk += growth.atk;
          newPet.ap += growth.ap;
          newPet.def += growth.def;
          newPet.res += growth.res;
          newPet.speed += growth.speed;
      }
      newPet.level = level;
      newPet.maxXp = calculateMaxXp(level);
  }

  return newPet;
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

    // Vererbung der Stats (Durchschnitt der Eltern)
    const mix = (v1, v2) => Math.floor((v1 + v2) / 2);
    const inheritedStats = {
        hp: mix(p1.maxHp, p2.maxHp),
        atk: mix(p1.atk, p2.atk),
        ap: mix(p1.ap, p2.ap),
        def: mix(p1.def, p2.def),
        res: mix(p1.res, p2.res),
        speed: mix(p1.speed, p2.speed)
    };

    const rarityKey = calculateBreedRarity(p1.rarity, p2.rarity);
    const basePet = generatePet(1, newType, rarityKey, inheritedStats, 'BREEDING');
    
    basePet.species = 'CUSTOM'; 
    basePet.customData = {
        label: newLabel,
        icon: newIcon,
        isSecret: isSecretRecipe,
        parents: [p1.name, p2.name]
    };
    basePet.name = newLabel; 

    return basePet;
};