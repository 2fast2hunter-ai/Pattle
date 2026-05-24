// src/utils/mechanics/petLogic.js
import { recalculatePetStats } from './petStats';
import { RARITIES, TYPES, ABILITIES, ZODIAC_ANIMALS, SPECIES_BY_TYPE, FUSION_RECIPES } from '../../data/gameData';

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

  // Initiales Pet Objekt
  let newPet = {
    id: Date.now() + Math.random().toString(),
    name: baseName,
    type: type,
    secondaryType: null,
    species: speciesKey,
    rarity: rarity,
    level: 1, 
    xp: 0,
    maxXp: 100, // Wird in recalculatePetStats korrigiert
    abilityId: abilityKey,
    
    maxHp: 0, hp: 0,
    atk: 0, ap: 0,
    def: 0, res: 0,
    speed: 0,
    
    critRate: 5 + Math.floor(Math.random() * 5),
    critDmg: 150,
    currentCd: 0,
    isEgg: false,
    hatchAt: 0,
    source: source,
    isShiny: Math.random() < 0.05, 
    price: 0 
  };

  // Stats berechnen
  newPet = recalculatePetStats(newPet, level);

  return newPet;
};

export const generateHybridPet = (p1, p2) => {
    const types = [p1.type, p2.type].sort();
    const recipeKey = `${types[0]}_${types[1]}`;
    const recipe = FUSION_RECIPES[recipeKey];

    let newLabel, newIcon, newType, isSecretRecipe, speciesKey;

    if (recipe) {
        newLabel = recipe.label;
        newIcon = recipe.icon;
        newType = recipe.type;
        isSecretRecipe = true;
        speciesKey = Object.keys(ZODIAC_ANIMALS).find(k => ZODIAC_ANIMALS[k].label === recipe.label) || 'SECRET_CHIMERA_PRIME';
    } else {
        isSecretRecipe = false;
        newType = Math.random() > 0.5 ? p1.type : p2.type;
        const icon1 = ZODIAC_ANIMALS[p1.species]?.icon || '❓';
        const icon2 = ZODIAC_ANIMALS[p2.species]?.icon || '❓';
        newIcon = `${icon1}${icon2}`;
        newLabel = "Hybrid"; 
        speciesKey = Math.random() > 0.5 ? p1.species : p2.species; // Hybriden erben eine Basis-Spezies für Stats
    }

    const rarityKey = calculateBreedRarity(p1.rarity, p2.rarity);
    const basePet = generatePet(1, newType, rarityKey, null, 'BREEDING', speciesKey);
    
    if (!isSecretRecipe) {
        basePet.name = newLabel;
        basePet.species = 'CUSTOM'; // Marker für UI, aber Stats kommen von der geerbten Species
        basePet.customData = {
            label: newLabel,
            icon: newIcon,
            isSecret: false,
            parents: [p1.name, p2.name]
        };
    }

    return basePet;
};