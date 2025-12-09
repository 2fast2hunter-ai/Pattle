import { RARITIES } from '../../data/rarities';
import { TYPES } from '../../data/types';
import { ABILITIES } from '../../data/abilities';
import { ZODIAC_ANIMALS, SPECIES_BY_TYPE, FUSION_RECIPES } from '../../data/pets';
import { calculateMaxXp, recalculatePetStats } from './petStats'; 

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
      if (forcedSpecies) type = forcedSpecies.type; 
  } else if (!type) { 
      type = typeKeys[Math.floor(Math.random() * typeKeys.length)]; 
  }
  
  let rarity = rarityKey || 'COMMON';
  
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
          // Chance auf seltene Spezies (letztes in der Liste)
          if (rollSpecies <= 5 && validSpeciesKeys.length >= 2) {
             speciesKey = validSpeciesKeys[validSpeciesKeys.length - 1]; 
          } else { 
             const remainingSpecies = validSpeciesKeys.slice(0, validSpeciesKeys.length - 1); 
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
      const baseMult = RARITIES[rarity].multi; 
      const genBase = (val) => Math.max(1, Math.floor((val * baseMult) + (Math.random() * val * baseMult * 0.2)));
      b_hp = genBase(8); b_atk = genBase(2); b_ap = genBase(2); b_def = genBase(1); b_res = genBase(1); b_speed = genBase(1);
  }

  // 1. Rohes Pet mit Basiswerten (Stats vorerst 0, werden gleich berechnet)
  const rawPet = {
    id: Date.now() + Math.random().toString(),
    name: baseName, 
    type: type, 
    secondaryType: null, 
    species: speciesKey, 
    rarity: rarity, 
    level: level, 
    xp: 0,
    maxXp: calculateMaxXp(level, rarity), 
    abilityId: abilityKey,
    b_hp, b_atk, b_ap, b_def, b_res, b_speed,
    
    // Platzhalter, werden durch recalculatePetStats überschrieben
    maxHp: 0, hp: 0, atk: 0, def: 0, ap: 0, res: 0, speed: 0,

    critRate: 5 + Math.floor(Math.random() * 10), 
    critDmg: 150, 
    currentCd: 0, 
    isEgg: false, 
    hatchAt: 0, 
    source: source, 
    isShiny: false, 
    price: 0 
  };

  // 2. Stats korrekt berechnen
  const finalStats = recalculatePetStats(rawPet, level);

  // 3. Zusammenfügen
  return { ...rawPet, ...finalStats };
};

export const generateHybridPet = (p1, p2) => {
    const types = [p1.type, p2.type].sort(); 
    const recipeKey = `${types[0]}_${types[1]}`; 
    const recipe = FUSION_RECIPES[recipeKey];
    
    let newLabel, newIcon, newType, isSecretRecipe;
    if (recipe) { newLabel = recipe.label; newIcon = recipe.icon; newType = recipe.type; isSecretRecipe = true; } 
    else { isSecretRecipe = false; newType = Math.random() > 0.5 ? p1.type : p2.type; const icon1 = ZODIAC_ANIMALS[p1.species]?.icon || '❓'; const icon2 = ZODIAC_ANIMALS[p2.species]?.icon || '❓'; newIcon = `${icon1}${icon2}`; const label1 = ZODIAC_ANIMALS[p1.species]?.label || p1.name; const label2 = ZODIAC_ANIMALS[p2.species]?.label || p2.name; const part1 = label1.substring(0, Math.ceil(label1.length / 2)); const part2 = label2.substring(Math.ceil(label2.length / 2)); newLabel = part1 + part2; }
    
    const mix = (v1, v2) => Math.floor((v1 + v2) / 2);
    const inheritedStats = { 
        hp: mix(p1.b_hp || p1.maxHp, p2.b_hp || p2.maxHp), 
        atk: mix(p1.b_atk || p1.atk, p2.b_atk || p2.atk), 
        ap: mix(p1.b_ap || p1.ap, p2.b_ap || p2.ap), 
        def: mix(p1.b_def || p1.def, p2.b_def || p2.def), 
        res: mix(p1.b_res || p1.res, p2.b_res || p2.res), 
        speed: mix(p1.b_speed || p1.speed, p2.b_speed || p2.speed) 
    };

    const rarityKey = calculateBreedRarity(p1.rarity, p2.rarity);
    const basePet = generatePet(1, newType, rarityKey, inheritedStats, 'BREEDING');
    basePet.species = 'CUSTOM'; 
    basePet.customData = { label: newLabel, icon: newIcon, isSecret: isSecretRecipe, parents: [p1.name, p2.name] }; 
    basePet.name = newLabel; 
    return basePet;
};