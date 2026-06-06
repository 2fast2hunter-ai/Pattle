import { TYPES } from './types'; // Importiert TYPES aus der neuen types.jsx

// --- 1. BASIS SPEZIES ---
export const BASE_ANIMALS = {
  FIRE_LION: { id: 'FIRE_LION', label: 'Fire Lion', icon: '🦁', type: 'FIRE' },
  FIRE_DRAGON: { id: 'FIRE_DRAGON', label: 'Ember Drake', icon: '🐲', type: 'FIRE' },
  FIRE_FOX: { id: 'FIRE_FOX', label: 'Devil Fox', icon: '🦊', type: 'FIRE' },
  FIRE_PHOENIX: { id: 'FIRE_PHOENIX', label: 'Phoenix', icon: '🦅', type: 'FIRE' },
  FIRE_SALAMANDER: { id: 'FIRE_SALAMANDER', label: 'Salamander', icon: '🦎', type: 'FIRE' },

  WATER_SHARK: { id: 'WATER_SHARK', label: 'Deep Sea Shark', icon: '🦈', type: 'WATER' },
  WATER_WHALE: { id: 'WATER_WHALE', label: 'Blue Whale', icon: '🐋', type: 'WATER' },
  WATER_OCTOPUS: { id: 'WATER_OCTOPUS', label: 'Giant Kraken', icon: '🐙', type: 'WATER' },
  WATER_TURTLE: { id: 'WATER_TURTLE', label: 'Water Tortoise', icon: '🐢', type: 'WATER' },
  WATER_CRAB: { id: 'WATER_CRAB', label: 'King Crab', icon: '🦀', type: 'WATER' },

  NATURE_BEAR: { id: 'NATURE_BEAR', label: 'Forest Bear', icon: '🐻', type: 'NATURE' },
  NATURE_WOLF: { id: 'NATURE_WOLF', label: 'Grey Wolf', icon: '🐺', type: 'NATURE' },
  NATURE_DEER: { id: 'NATURE_DEER', label: 'Stag', icon: '🦌', type: 'NATURE' },
  NATURE_BOAR: { id: 'NATURE_BOAR', label: 'Wild Boar', icon: '🐗', type: 'NATURE' },
  NATURE_SLOTH: { id: 'NATURE_SLOTH', label: 'Giant Sloth', icon: '🦥', type: 'NATURE' },

  WIND_EAGLE: { id: 'WIND_EAGLE', label: 'Storm Eagle', icon: '🦅', type: 'WIND' },
  WIND_BAT: { id: 'WIND_BAT', label: 'Wind Bat', icon: '🦇', type: 'WIND' },
  WIND_BEE: { id: 'WIND_BEE', label: 'Killer Bee', icon: '🐝', type: 'WIND' },
  WIND_GRIFFIN: { id: 'WIND_GRIFFIN', label: 'Griffin', icon: '🕊️', type: 'WIND' },
  WIND_DRAGONFLY: { id: 'WIND_DRAGONFLY', label: 'Giant Dragonfly', icon: '🦟', type: 'WIND' },

  EARTH_ELEPHANT: { id: 'EARTH_ELEPHANT', label: 'War Elephant', icon: '🐘', type: 'EARTH' },
  EARTH_RHINO: { id: 'EARTH_RHINO', label: 'Armored Rhino', icon: '🦏', type: 'EARTH' },
  EARTH_BULL: { id: 'EARTH_BULL', label: 'Iron Bull', icon: '🐂', type: 'EARTH' },
  EARTH_MOLE: { id: 'EARTH_MOLE', label: 'Mole', icon: '🦫', type: 'EARTH' },
  EARTH_HORSE: { id: 'EARTH_HORSE', label: 'Plow Horse', icon: '🐎', type: 'EARTH' },

  ICE_POLARBEAR: { id: 'ICE_POLARBEAR', label: 'Polar Bear', icon: '🐻‍❄️', type: 'ICE' },
  ICE_PENGUIN: { id: 'ICE_PENGUIN', label: 'Emperor Penguin', icon: '🐧', type: 'ICE' },
  ICE_SEAL: { id: 'ICE_SEAL', label: 'Seal', icon: '🦭', type: 'ICE' },
  ICE_WOLF: { id: 'ICE_WOLF', label: 'Snow Wolf', icon: '🐺', type: 'ICE' },
  ICE_YETI: { id: 'ICE_YETI', label: 'Yeti', icon: '🦍', type: 'ICE' },

  ELECTRIC_MOUSE: { id: 'ELECTRIC_MOUSE', label: 'Volt Mouse', icon: '🐭', type: 'ELECTRIC' },
  ELECTRIC_CAT: { id: 'ELECTRIC_CAT', label: 'Thunder Cat', icon: '🐱', type: 'ELECTRIC' },
  ELECTRIC_EEL: { id: 'ELECTRIC_EEL', label: 'Shock Eel', icon: '🐍', type: 'ELECTRIC' },
  ELECTRIC_BIRD: { id: 'ELECTRIC_BIRD', label: 'Thunderbird', icon: '🐦', type: 'ELECTRIC' },
  ELECTRIC_LION: { id: 'ELECTRIC_LION', label: 'Storm Lion', icon: '🦁', type: 'ELECTRIC' },

  LIGHT_UNICORN: { id: 'LIGHT_UNICORN', label: 'Unicorn', icon: '🦄', type: 'LIGHT' },
  LIGHT_PEGASUS: { id: 'LIGHT_PEGASUS', label: 'Pegasus', icon: '🐎', type: 'LIGHT' },
  LIGHT_SWAN: { id: 'LIGHT_SWAN', label: 'Radiant Swan', icon: '🦢', type: 'LIGHT' },
  LIGHT_LION: { id: 'LIGHT_LION', label: 'Sun Lion', icon: '🦁', type: 'LIGHT' },
  LIGHT_BUTTERFLY: { id: 'LIGHT_BUTTERFLY', label: 'Light Moth', icon: '🦋', type: 'LIGHT' },

  DARK_PANTHER: { id: 'DARK_PANTHER', label: 'Shadow Panther', icon: '🐆', type: 'DARK' },
  DARK_CROW: { id: 'DARK_CROW', label: 'Night Raven', icon: '🐦‍⬛', type: 'DARK' },
  DARK_SNAKE: { id: 'DARK_SNAKE', label: 'Dark Adder', icon: '🐍', type: 'DARK' },
  DARK_BAT: { id: 'DARK_BAT', label: 'Vampire', icon: '🦇', type: 'DARK' },
  DARK_WOLF: { id: 'DARK_WOLF', label: 'Werewolf', icon: '🐺', type: 'DARK' },

  GHOST_CAT: { id: 'GHOST_CAT', label: 'Ghost Cat', icon: '🐈‍⬛', type: 'GHOST' },
  GHOST_DOG: { id: 'GHOST_DOG', label: 'Hellhound', icon: '🐕', type: 'GHOST' },
  GHOST_OWL: { id: 'GHOST_OWL', label: 'Barn Owl', icon: '🦉', type: 'GHOST' },
  GHOST_SPIDER: { id: 'GHOST_SPIDER', label: 'Phantom Spider', icon: '🕷️', type: 'GHOST' },
  GHOST_WHALE: { id: 'GHOST_WHALE', label: 'Ghost Whale', icon: '🐋', type: 'GHOST' },

  MAGIC_OWL: { id: 'MAGIC_OWL', label: 'Arcane Owl', icon: '🦉', type: 'MAGIC' },
  MAGIC_CAT: { id: 'MAGIC_CAT', label: 'Witch Cat', icon: '🐱', type: 'MAGIC' },
  MAGIC_FROG: { id: 'MAGIC_FROG', label: 'Magic Toad', icon: '🐸', type: 'MAGIC' },
  MAGIC_RABBIT: { id: 'MAGIC_RABBIT', label: 'Arcane Hare', icon: '🐇', type: 'MAGIC' },
  MAGIC_DRAGON: { id: 'MAGIC_DRAGON', label: 'Fae Drake', icon: '🐉', type: 'MAGIC' },

  PSYCHIC_FOX: { id: 'PSYCHIC_FOX', label: 'Kitsune', icon: '🦊', type: 'PSYCHIC' },
  PSYCHIC_CAT: { id: 'PSYCHIC_CAT', label: 'Psi Cat', icon: '🐈', type: 'PSYCHIC' },
  PSYCHIC_MONKEY: { id: 'PSYCHIC_MONKEY', label: 'Sage Ape', icon: '🐒', type: 'PSYCHIC' },
  PSYCHIC_SNAKE: { id: 'PSYCHIC_SNAKE', label: 'Hypno Serpent', icon: '🐍', type: 'PSYCHIC' },
  PSYCHIC_OCTOPUS: { id: 'PSYCHIC_OCTOPUS', label: 'Mind Kraken', icon: '🐙', type: 'PSYCHIC' },

  FIGHTING_KANGAROO: { id: 'FIGHTING_KANGAROO', label: 'Boxing Roo', icon: '🦘', type: 'FIGHTING' },
  FIGHTING_GORILLA: { id: 'FIGHTING_GORILLA', label: 'Kong', icon: '🦍', type: 'FIGHTING' },
  FIGHTING_ROOSTER: { id: 'FIGHTING_ROOSTER', label: 'Battle Rooster', icon: '🐓', type: 'FIGHTING' },
  FIGHTING_DOG: { id: 'FIGHTING_DOG', label: 'Bulldog', icon: '🐕', type: 'FIGHTING' },
  FIGHTING_PANDA: { id: 'FIGHTING_PANDA', label: 'Kung Fu Panda', icon: '🐼', type: 'FIGHTING' },

  METAL_ANT: { id: 'METAL_ANT', label: 'Iron Ant', icon: '🐜', type: 'METAL' },
  METAL_RHINO: { id: 'METAL_RHINO', label: 'Mecha Rhino', icon: '🦏', type: 'METAL' },
  METAL_TURTLE: { id: 'METAL_TURTLE', label: 'Armored Turtle', icon: '🐢', type: 'METAL' },
  METAL_SCORPION: { id: 'METAL_SCORPION', label: 'Robo Scorpion', icon: '🦂', type: 'METAL' },
  METAL_BIRD: { id: 'METAL_BIRD', label: 'Steel Eagle', icon: '🦅', type: 'METAL' },

  ROCK_GOLEM: { id: 'ROCK_GOLEM', label: 'Rock Golem', icon: '🦧', type: 'ROCK' },
  ROCK_SNAKE: { id: 'ROCK_SNAKE', label: 'Stone Serpent', icon: '🪨', type: 'ROCK' },
  ROCK_BEETLE: { id: 'ROCK_BEETLE', label: 'Stone Beetle', icon: '🪲', type: 'ROCK' },
  ROCK_TURTLE: { id: 'ROCK_TURTLE', label: 'Mountain Turtle', icon: '🐢', type: 'ROCK' },
  ROCK_RAM: { id: 'ROCK_RAM', label: 'Stone Ram', icon: '🐐', type: 'ROCK' },

  POISON_SNAKE: { id: 'POISON_SNAKE', label: 'Cobra', icon: '🐍', type: 'POISON' },
  POISON_SPIDER: { id: 'POISON_SPIDER', label: 'Venom Spider', icon: '🕷️', type: 'POISON' },
  POISON_FROG: { id: 'POISON_FROG', label: 'Dart Frog', icon: '🐸', type: 'POISON' },
  POISON_RAT: { id: 'POISON_RAT', label: 'Plague Rat', icon: '🐀', type: 'POISON' },
  POISON_SCORPION: { id: 'POISON_SCORPION', label: 'Death Scorpion', icon: '🦂', type: 'POISON' },

  DRAGON_RED: { id: 'DRAGON_RED', label: 'Fire Dragon', icon: '🐉', type: 'DRAGON' },
  DRAGON_BLUE: { id: 'DRAGON_BLUE', label: 'Sea Dragon', icon: '🦕', type: 'DRAGON' },
  DRAGON_GREEN: { id: 'DRAGON_GREEN', label: 'Ancient Drake', icon: '🦖', type: 'DRAGON' },
  DRAGON_GOLD: { id: 'DRAGON_GOLD', label: 'Gold Dragon', icon: '🐲', type: 'DRAGON' },
  DRAGON_BLACK: { id: 'DRAGON_BLACK', label: 'Nightshade', icon: '🦎', type: 'DRAGON' },

  FAIRY_BUTTERFLY: { id: 'FAIRY_BUTTERFLY', label: 'Monarch Butterfly', icon: '🦋', type: 'FAIRY' },
  FAIRY_UNICORN: { id: 'FAIRY_UNICORN', label: 'Minicorn', icon: '🦄', type: 'FAIRY' },
  FAIRY_CAT: { id: 'FAIRY_CAT', label: 'Fairy Cat', icon: '🐱', type: 'FAIRY' },
  FAIRY_RABBIT: { id: 'FAIRY_RABBIT', label: 'Moon Hare', icon: '🐇', type: 'FAIRY' },
  FAIRY_DEER: { id: 'FAIRY_DEER', label: 'Enchanted Stag', icon: '🦌', type: 'FAIRY' },

  TECH_ROBOT: { id: 'TECH_ROBOT', label: 'Android', icon: '🤖', type: 'TECH' },
  TECH_DRONE: { id: 'TECH_DRONE', label: 'Drone', icon: '🚁', type: 'TECH' },
  TECH_DOG: { id: 'TECH_DOG', label: 'Robo Dog', icon: '🐕', type: 'TECH' },
  TECH_MOUSE: { id: 'TECH_MOUSE', label: 'Cyber Mouse', icon: '🖱️', type: 'TECH' },
  TECH_ANT: { id: 'TECH_ANT', label: 'Nano Bot', icon: '🐜', type: 'TECH' },
  TECH_CYBORG: { id: 'TECH_CYBORG', label: 'Cyborg Warrior', icon: '🦾', type: 'TECH' },
  TECH_MECH: { id: 'TECH_MECH', label: 'Mecha Titan', icon: '⚙️', type: 'TECH' },

  SOUND_BAT: { id: 'SOUND_BAT', label: 'Sonic Bat', icon: '🦇', type: 'SOUND' },
  SOUND_PARROT: { id: 'SOUND_PARROT', label: 'Loudspeaker Macaw', icon: '🦜', type: 'SOUND' },
  SOUND_WHALE: { id: 'SOUND_WHALE', label: 'Song Whale', icon: '🐋', type: 'SOUND' },
  SOUND_CRICKET: { id: 'SOUND_CRICKET', label: 'Noise Cricket', icon: '🦗', type: 'SOUND' },
  SOUND_WOLF: { id: 'SOUND_WOLF', label: 'Howler', icon: '🐺', type: 'SOUND' },

  TIME_TURTLE: { id: 'TIME_TURTLE', label: 'Eternity Turtle', icon: '🐢', type: 'TIME' },
  TIME_OWL: { id: 'TIME_OWL', label: 'Warden of Time', icon: '🦉', type: 'TIME' },
  TIME_RABBIT: { id: 'TIME_RABBIT', label: 'White Rabbit', icon: '🐇', type: 'TIME' },
  TIME_LIZARD: { id: 'TIME_LIZARD', label: 'Chronos Lizard', icon: '🦎', type: 'TIME' },
  TIME_CAT: { id: 'TIME_CAT', label: "Schrödinger's Cat", icon: '🐈', type: 'TIME' },
  TIME_CLOCKWORK: { id: 'TIME_CLOCKWORK', label: 'Clockwork Titan', icon: '⏰', type: 'TIME' },
  TIME_PARADOX: { id: 'TIME_PARADOX', label: 'Time Paradox', icon: '🌀', type: 'TIME' },

  SPACE_ALIEN: { id: 'SPACE_ALIEN', label: 'Martian', icon: '👽', type: 'SPACE' },
  SPACE_STARFISH: { id: 'SPACE_STARFISH', label: 'Star Being', icon: '⭐', type: 'SPACE' },
  SPACE_WHALE: { id: 'SPACE_WHALE', label: 'Space Whale', icon: '🐋', type: 'SPACE' },
  SPACE_OCTOPUS: { id: 'SPACE_OCTOPUS', label: 'Void Squid', icon: '🐙', type: 'SPACE' },
  SPACE_CAT: { id: 'SPACE_CAT', label: 'Astro Cat', icon: '🐱', type: 'SPACE' },

  VOID_GHOST: { id: 'VOID_GHOST', label: 'The Void', icon: '👻', type: 'VOID' },
  VOID_EYE: { id: 'VOID_EYE', label: 'The Eye', icon: '👁️', type: 'VOID' },
  VOID_SHADOW: { id: 'VOID_SHADOW', label: 'Shade Wraith', icon: '👤', type: 'VOID' },
  VOID_SPIDER: { id: 'VOID_SPIDER', label: 'Void Weaver', icon: '🕷️', type: 'VOID' },
  VOID_SNAKE: { id: 'VOID_SNAKE', label: 'Abyss Serpent', icon: '🐍', type: 'VOID' },
  VOID_WRAITH: { id: 'VOID_WRAITH', label: 'Shadow Walker', icon: '🌑', type: 'VOID' },
  VOID_LEVIATHAN: { id: 'VOID_LEVIATHAN', label: 'Void Leviathan', icon: '🐉', type: 'VOID' },

  CHAOS_HYENA: { id: 'CHAOS_HYENA', label: 'Laughing Hyena', icon: '🐕', type: 'CHAOS' },
  CHAOS_MONKEY: { id: 'CHAOS_MONKEY', label: 'Mad Ape', icon: '🐒', type: 'CHAOS' },
  CHAOS_SNAKE: { id: 'CHAOS_SNAKE', label: 'Hydra', icon: '🐍', type: 'CHAOS' },
  CHAOS_DRAGON: { id: 'CHAOS_DRAGON', label: 'Chaos Drake', icon: '🐉', type: 'CHAOS' },
  CHAOS_JOKER: { id: 'CHAOS_JOKER', label: 'Joker', icon: '🤡', type: 'CHAOS' },
  CHAOS_BEAST: { id: 'CHAOS_BEAST', label: 'Dread Lord', icon: '🦬', type: 'CHAOS' },
  CHAOS_JESTER: { id: 'CHAOS_JESTER', label: 'Mad Jester', icon: '🎭', type: 'CHAOS' },

  ORDER_LION: { id: 'ORDER_LION', label: 'King Lion', icon: '🦁', type: 'ORDER' },
  ORDER_EAGLE: { id: 'ORDER_EAGLE', label: 'Imperial Eagle', icon: '🦅', type: 'ORDER' },
  ORDER_HORSE: { id: 'ORDER_HORSE', label: "Knight's Steed", icon: '🐎', type: 'ORDER' },
  ORDER_DOG: { id: 'ORDER_DOG', label: 'Guard Dog', icon: '🐕', type: 'ORDER' },
  ORDER_OWL: { id: 'ORDER_OWL', label: 'The Judge', icon: '🦉', type: 'ORDER' },

  DIVINE_ANGEL: { id: 'DIVINE_ANGEL', label: 'Archangel', icon: '👼', type: 'DIVINE' },
  DIVINE_SERAPH: { id: 'DIVINE_SERAPH', label: 'Seraphim', icon: '✨', type: 'DIVINE' },

  // MYTHIC — apex species, one per top element, only reachable at Mythic rarity
  MYTHIC_INFERNO_DRAKE: { id: 'MYTHIC_INFERNO_DRAKE', label: 'Inferno Drake', icon: '🐲', type: 'FIRE' },
  MYTHIC_ABYSSAL_TITAN: { id: 'MYTHIC_ABYSSAL_TITAN', label: 'Abyssal Titan', icon: '🌊', type: 'WATER' },
  MYTHIC_WORLD_SERPENT: { id: 'MYTHIC_WORLD_SERPENT', label: 'World Serpent', icon: '🐍', type: 'NATURE' },
};

// --- 2. GEHEIME ZUCHT-HYBRIDEN ---
export const SECRET_ANIMALS = {
    SECRET_CHIMERA_PRIME: { id: 'SECRET_CHIMERA_PRIME', label: 'Chimera Prime', icon: '🦁🐍🐐', type: 'CHAOS' },
    SECRET_VOID_WALKER: { id: 'SECRET_VOID_WALKER', label: 'Void Walker', icon: '🕴️', type: 'VOID' },
    SECRET_PHOENIX_LORD: { id: 'SECRET_PHOENIX_LORD', label: 'Phoenix Lord', icon: '👑🦅', type: 'FIRE' },
    SECRET_KRAKEN_KING: { id: 'SECRET_KRAKEN_KING', label: 'Kraken King', icon: '👑🐙', type: 'WATER' },
    SECRET_GAIA_GUARDIAN: { id: 'SECRET_GAIA_GUARDIAN', label: 'Gaia Guardian', icon: '🌍', type: 'NATURE' },
    SECRET_STORM_BRINGER: { id: 'SECRET_STORM_BRINGER', label: 'Storm Herald', icon: '⛈️', type: 'ELECTRIC' },
    SECRET_TIME_WEAVER: { id: 'SECRET_TIME_WEAVER', label: 'Time Weaver', icon: '⏳🕷️', type: 'TIME' },
    SECRET_STAR_EATER: { id: 'SECRET_STAR_EATER', label: 'Star Eater', icon: '🌌', type: 'SPACE' },
    SECRET_MECHA_DRAGON: { id: 'SECRET_MECHA_DRAGON', label: 'Mecha Drake', icon: '🤖🐉', type: 'METAL' },
    SECRET_SHADOW_ASSASSIN: { id: 'SECRET_SHADOW_ASSASSIN', label: 'Shadow Blade', icon: '🥷', type: 'DARK' },
    SECRET_CRYSTAL_UNICORN: { id: 'SECRET_CRYSTAL_UNICORN', label: 'Crystal Horn', icon: '💎🦄', type: 'LIGHT' },
    SECRET_GHOST_SHIP: { id: 'SECRET_GHOST_SHIP', label: 'Flying Dutchman', icon: '🚢👻', type: 'GHOST' },
    SECRET_SOUND_WAVE: { id: 'SECRET_SOUND_WAVE', label: 'Bass Drop', icon: '🔊', type: 'SOUND' },
    SECRET_FROST_GIANT: { id: 'SECRET_FROST_GIANT', label: 'Frost Giant', icon: '🥶', type: 'ICE' },
    SECRET_POISON_IVY: { id: 'SECRET_POISON_IVY', label: 'Death Bloom', icon: '🌺☠️', type: 'POISON' },
};

export const ZODIAC_ANIMALS = { ...BASE_ANIMALS, ...SECRET_ANIMALS };

export const SPECIES_BY_TYPE = {};
Object.keys(TYPES).forEach(typeKey => {
    SPECIES_BY_TYPE[typeKey] = Object.keys(BASE_ANIMALS).filter(key => BASE_ANIMALS[key].type === typeKey);
});

// Canonical list of Mythic-only species for the Dex
export const MYTHIC_SPECIES = ['MYTHIC_INFERNO_DRAKE', 'MYTHIC_ABYSSAL_TITAN', 'MYTHIC_WORLD_SERPENT'];

export const FUSION_RECIPES = {
    'FIRE_WATER': { label: 'Steam Wraith', icon: '♨️', type: 'WIND' },
    'FIRE_ICE': { label: 'Obsidian Golem', icon: '🗿', type: 'ROCK' },
    'FIRE_NATURE': { label: 'Ash Ent', icon: '🍂', type: 'DARK' },
    'FIRE_ELECTRIC': { label: 'Plasma Entity', icon: '⚛️', type: 'TECH' },
    'WATER_ELECTRIC': { label: 'Storm Eel', icon: '⛈️', type: 'ELECTRIC' },
    'WATER_EARTH': { label: 'Swamp Beast', icon: '🧟', type: 'POISON' },
    'WATER_ICE': { label: 'Iceberg Titan', icon: '🏔️', type: 'ICE' },
    'NATURE_LIGHT': { label: 'World Tree', icon: '🌳', type: 'NATURE' },
    'NATURE_DEATH': { label: 'Fungal Zombie', icon: '🍄', type: 'POISON' },
    'LIGHT_DARK': { label: 'Twilight Drake', icon: '🌗', type: 'DRAGON' },
    'TIME_SPACE': { label: 'Dimensional Wanderer', icon: '🌀', type: 'VOID' },
    'METAL_ELECTRIC': { label: 'Robo Overlord', icon: '🤖', type: 'TECH' },
    'WIND_EARTH': { label: 'Sandstorm Djinn', icon: '🌪️', type: 'WIND' },
    'GHOST_TECH': { label: 'Virus Phantom', icon: '👾', type: 'TECH' },
    'CHAOS_ORDER': { label: 'Balance Warden', icon: '⚖️', type: 'DIVINE' },
};
