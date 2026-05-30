import { TYPES } from './types'; // Importiert TYPES aus der neuen types.jsx

// --- 1. BASIS SPEZIES ---
export const BASE_ANIMALS = {
  // FEUER
  FIRE_FOX: { id: 'FIRE_FOX', label: 'Fox', icon: '🦊', type: 'FIRE' },
  FIRE_SALAMANDER: { id: 'FIRE_SALAMANDER', label: 'Salamander', icon: '🦎', type: 'FIRE' },
  FIRE_JELLYFISH: { id: 'FIRE_JELLYFISH', label: 'Fire Jellyfish', icon: '🪼', type: 'FIRE' },
  FIRE_TIGER: { id: 'FIRE_TIGER', label: 'Tiger', icon: '🐅', type: 'FIRE' },
  FIRE_PHOENIX: { id: 'FIRE_PHOENIX', label: 'Phoenix', icon: '🦅', type: 'FIRE' },

  // WASSER
  WATER_GOLDFISH: { id: 'WATER_GOLDFISH', label: 'Goldfish', icon: '🐠', type: 'WATER' },
  WATER_SQUID: { id: 'WATER_SQUID', label: 'Squid', icon: '🦑', type: 'WATER' },
  WATER_TURTLE: { id: 'WATER_TURTLE', label: 'Turtle', icon: '🐢', type: 'WATER' },
  WATER_SHARK: { id: 'WATER_SHARK', label: 'Shark', icon: '🦈', type: 'WATER' },
  WATER_WHALE: { id: 'WATER_WHALE', label: 'Whale', icon: '🐋', type: 'WATER' },

  // NATUR
  NATURE_BUTTERFLY: { id: 'NATURE_BUTTERFLY', label: 'Butterfly', icon: '🦋', type: 'NATURE' },
  NATURE_BOAR: { id: 'NATURE_BOAR', label: 'Wild Boar', icon: '🐗', type: 'NATURE' },
  NATURE_SLOTH: { id: 'NATURE_SLOTH', label: 'Giant Sloth', icon: '🦥', type: 'NATURE' },
  NATURE_WOLF: { id: 'NATURE_WOLF', label: 'Wolf', icon: '🐺', type: 'NATURE' },
  NATURE_BEAR: { id: 'NATURE_BEAR', label: 'Bear', icon: '🐻', type: 'NATURE' },

  // WIND
  WIND_BEE: { id: 'WIND_BEE', label: 'Bee', icon: '🐝', type: 'WIND' },
  WIND_DRAGONFLY: { id: 'WIND_DRAGONFLY', label: 'Dragonfly', icon: '🦟', type: 'WIND' },
  WIND_DOVE: { id: 'WIND_DOVE', label: 'Dove', icon: '🕊️', type: 'WIND' },
  WIND_EAGLE: { id: 'WIND_EAGLE', label: 'Eagle', icon: '🦅', type: 'WIND' },
  WIND_GRIFFIN: { id: 'WIND_GRIFFIN', label: 'Griffin', icon: '🦁🦅', type: 'WIND' },

  // ERDE
  EARTH_ANT: { id: 'EARTH_ANT', label: 'Ant', icon: '🐜', type: 'EARTH' },
  EARTH_MOLE: { id: 'EARTH_MOLE', label: 'Mole', icon: '🦫', type: 'EARTH' },
  EARTH_BULL: { id: 'EARTH_BULL', label: 'Bull', icon: '🐂', type: 'EARTH' },
  EARTH_RHINO: { id: 'EARTH_RHINO', label: 'Rhino', icon: '🦏', type: 'EARTH' },
  EARTH_ELEPHANT: { id: 'EARTH_ELEPHANT', label: 'Elephant', icon: '🐘', type: 'EARTH' },

  // EIS
  ICE_PENGUIN: { id: 'ICE_PENGUIN', label: 'Penguin', icon: '🐧', type: 'ICE' },
  ICE_SEAGULL: { id: 'ICE_SEAGULL', label: 'Seagull', icon: '🐦', type: 'ICE' },
  ICE_SEAL: { id: 'ICE_SEAL', label: 'Seal', icon: '🦭', type: 'ICE' },
  ICE_POLARBEAR: { id: 'ICE_POLARBEAR', label: 'Polar Bear', icon: '🐻‍❄️', type: 'ICE' },
  ICE_YETI: { id: 'ICE_YETI', label: 'Yeti', icon: '🦍', type: 'ICE' },

  // ELEKTRO
  ELECTRIC_RAY: { id: 'ELECTRIC_RAY', label: 'Electric Ray', icon: '⚡🐟', type: 'ELECTRIC' },
  ELECTRIC_EEL: { id: 'ELECTRIC_EEL', label: 'Electric Eel', icon: '🐍', type: 'ELECTRIC' },
  ELECTRIC_CATFISH: { id: 'ELECTRIC_CATFISH', label: 'Catfish', icon: '🐟', type: 'ELECTRIC' },
  ELECTRIC_CAT: { id: 'ELECTRIC_CAT', label: 'Electro-Cat', icon: '🐱⚡', type: 'ELECTRIC' },
  ELECTRIC_THUNDERBIRD: { id: 'ELECTRIC_THUNDERBIRD', label: 'Thunderbird', icon: '🦅⚡', type: 'ELECTRIC' },

  // LICHT
  LIGHT_SNAIL: { id: 'LIGHT_SNAIL', label: 'Snail', icon: '🐌', type: 'LIGHT' },
  LIGHT_WORM: { id: 'LIGHT_WORM', label: 'Worm', icon: '🪱', type: 'LIGHT' },
  LIGHT_SWAN: { id: 'LIGHT_SWAN', label: 'Swan', icon: '🦢', type: 'LIGHT' },
  LIGHT_PEGASUS: { id: 'LIGHT_PEGASUS', label: 'Pegasus', icon: '🐎🪽', type: 'LIGHT' },
  LIGHT_DRAGON: { id: 'LIGHT_DRAGON', label: 'White Dragon', icon: '🐉', type: 'LIGHT' },

  // DUNKEL
  DARK_TOAD: { id: 'DARK_TOAD', label: 'Toad', icon: '🐸', type: 'DARK' },
  DARK_RAVEN: { id: 'DARK_RAVEN', label: 'Raven', icon: '🐦‍⬛', type: 'DARK' },
  DARK_CAT: { id: 'DARK_CAT', label: 'Black Cat', icon: '🐈‍⬛', type: 'DARK' },
  DARK_PANTHER: { id: 'DARK_PANTHER', label: 'Panther', icon: '🐆', type: 'DARK' },
  DARK_DRAGON: { id: 'DARK_DRAGON', label: 'Black Dragon', icon: '🐉', type: 'DARK' },

  // GEIST
  GHOST_SPIRIT: { id: 'GHOST_SPIRIT', label: 'Spirit', icon: '👻', type: 'GHOST' },
  GHOST_DEER: { id: 'GHOST_DEER', label: 'Ghost Deer', icon: '🦌', type: 'GHOST' },
  GHOST_ANTELOPE: { id: 'GHOST_ANTELOPE', label: 'Ghost Antelope', icon: '🦌', type: 'GHOST' },
  GHOST_JELLYFISH: { id: 'GHOST_JELLYFISH', label: 'Ghost Jellyfish', icon: '🪼', type: 'GHOST' },
  GHOST_LION: { id: 'GHOST_LION', label: 'Ghost Lion', icon: '🦁', type: 'GHOST' },

  // MAGIE
  MAGIC_BEETLE: { id: 'MAGIC_BEETLE', label: 'Stag Beetle', icon: '🪲', type: 'MAGIC' },
  MAGIC_PEACOCK: { id: 'MAGIC_PEACOCK', label: 'Peacock', icon: '🦚', type: 'MAGIC' },
  MAGIC_HAT: { id: 'MAGIC_HAT', label: 'Sorcerer\'s Hat', icon: '🎩👀', type: 'MAGIC' },
  MAGIC_SABERTOOTH: { id: 'MAGIC_SABERTOOTH', label: 'Sabertooth Tiger', icon: '🐅', type: 'MAGIC' },
  MAGIC_UNICORN: { id: 'MAGIC_UNICORN', label: 'Unicorn', icon: '🦄', type: 'MAGIC' },

  // PSYCHO
  PSYCHIC_SQUIRREL: { id: 'PSYCHIC_SQUIRREL', label: 'Squirrel', icon: '🐿️', type: 'PSYCHIC' },
  PSYCHIC_TOUCAN: { id: 'PSYCHIC_TOUCAN', label: 'Toucan', icon: '🦜', type: 'PSYCHIC' },
  PSYCHIC_FLAMINGO: { id: 'PSYCHIC_FLAMINGO', label: 'Flamingo', icon: '🦩', type: 'PSYCHIC' },
  PSYCHIC_GIRAFFE: { id: 'PSYCHIC_GIRAFFE', label: 'Giraffe', icon: '🦒', type: 'PSYCHIC' },
  PSYCHIC_HAMMERHEAD: { id: 'PSYCHIC_HAMMERHEAD', label: 'Hammerhead Shark', icon: '🦈', type: 'PSYCHIC' },

  // KAMPF
  FIGHTING_CRAB: { id: 'FIGHTING_CRAB', label: 'Crab', icon: '🦀', type: 'FIGHTING' },
  FIGHTING_SPIDER: { id: 'FIGHTING_SPIDER', label: 'Spider', icon: '🕷️', type: 'FIGHTING' },
  FIGHTING_DOG: { id: 'FIGHTING_DOG', label: 'Dog', icon: '🐕', type: 'FIGHTING' },
  FIGHTING_KANGAROO: { id: 'FIGHTING_KANGAROO', label: 'Kangaroo', icon: '🦘', type: 'FIGHTING' },
  FIGHTING_HORSE: { id: 'FIGHTING_HORSE', label: 'Horse', icon: '🐎', type: 'FIGHTING' },

  // METALL
  METAL_TURTLE: { id: 'METAL_TURTLE', label: 'Grey Turtle', icon: '🐢', type: 'METAL' },
  METAL_SCORPION: { id: 'METAL_SCORPION', label: 'Grey Scorpion', icon: '🦂', type: 'METAL' },
  METAL_BISON: { id: 'METAL_BISON', label: 'Bison', icon: '🦬', type: 'METAL' },
  METAL_GORILLA: { id: 'METAL_GORILLA', label: 'Gorilla', icon: '🦍', type: 'METAL' },
  METAL_DRAGON: { id: 'METAL_DRAGON', label: 'Grey Dragon', icon: '🐉', type: 'METAL' },

  // GESTEIN
  ROCK_BEETLE: { id: 'ROCK_BEETLE', label: 'Stone Beetle', icon: '🪲', type: 'ROCK' },
  ROCK_SCORPION: { id: 'ROCK_SCORPION', label: 'Scorpion', icon: '🦂', type: 'ROCK' },
  ROCK_IBEX: { id: 'ROCK_IBEX', label: 'Ibex', icon: '🐐', type: 'ROCK' },
  ROCK_MAMMOTH: { id: 'ROCK_MAMMOTH', label: 'Mammoth', icon: '🦣', type: 'ROCK' },
  ROCK_GOLEM: { id: 'ROCK_GOLEM', label: 'Golem', icon: '🗿', type: 'ROCK' },

  // GIFT
  POISON_CATERPILLAR: { id: 'POISON_CATERPILLAR', label: 'Caterpillar', icon: '🐛', type: 'POISON' },
  POISON_RAT: { id: 'POISON_RAT', label: 'Rat', icon: '🐀', type: 'POISON' },
  POISON_STONEFISH: { id: 'POISON_STONEFISH', label: 'Stonefish', icon: '🐟', type: 'POISON' },
  POISON_FROG: { id: 'POISON_FROG', label: 'Blue Frog', icon: '🐸', type: 'POISON' },
  POISON_SNAKE: { id: 'POISON_SNAKE', label: 'Snake', icon: '🐍', type: 'POISON' },

  // DRACHE
  DRAGON_GREEN: { id: 'DRAGON_GREEN', label: 'Green Dragon', icon: '🐉', type: 'DRAGON' },
  DRAGON_YELLOW: { id: 'DRAGON_YELLOW', label: 'Yellow Dragon', icon: '🐉', type: 'DRAGON' },
  DRAGON_BLUE: { id: 'DRAGON_BLUE', label: 'Blue Dragon', icon: '🐉', type: 'DRAGON' },
  DRAGON_RED: { id: 'DRAGON_RED', label: 'Red Dragon', icon: '🐉', type: 'DRAGON' },
  DRAGON_COLOR: { id: 'DRAGON_COLOR', label: 'Prismatic Dragon', icon: '🐉', type: 'DRAGON' },

  // FEE
  FAIRY_GNOME: { id: 'FAIRY_GNOME', label: 'Gnome', icon: '🧙‍♂️', type: 'FAIRY' },
  FAIRY_RABBIT: { id: 'FAIRY_RABBIT', label: 'Rabbit', icon: '🐇', type: 'FAIRY' },
  FAIRY_HAT: { id: 'FAIRY_HAT', label: 'Green Hat', icon: '🎩🟢', type: 'FAIRY' },
  FAIRY_CAT: { id: 'FAIRY_CAT', label: 'Pink Cat', icon: '🐱', type: 'FAIRY' },
  FAIRY_QUEEN: { id: 'FAIRY_QUEEN', label: 'Fairy Queen', icon: '🧚‍♀️', type: 'FAIRY' },

  // CYBER (TECH)
  TECH_MOUSE: { id: 'TECH_MOUSE', label: 'Cyber Mouse', icon: '🖱️', type: 'TECH' },
  TECH_CHICKEN: { id: 'TECH_CHICKEN', label: 'Cyber Chicken', icon: '🐔', type: 'TECH' },
  TECH_DRONE: { id: 'TECH_DRONE', label: 'Drone', icon: '🚁', type: 'TECH' },
  TECH_MOOSE: { id: 'TECH_MOOSE', label: 'Cyber Moose', icon: '🫎', type: 'TECH' },
  TECH_ROBOT: { id: 'TECH_ROBOT', label: 'Robot', icon: '🤖', type: 'TECH' },

  // SCHALL
  SOUND_CRICKET: { id: 'SOUND_CRICKET', label: 'Racket Cricket', icon: '🦗', type: 'SOUND' },
  SOUND_PARROT: { id: 'SOUND_PARROT', label: 'Parrot', icon: '🦜', type: 'SOUND' },
  SOUND_BAT: { id: 'SOUND_BAT', label: 'Bat', icon: '🦇', type: 'SOUND' },
  SOUND_OWL: { id: 'SOUND_OWL', label: 'Owl', icon: '🦉', type: 'SOUND' },
  SOUND_ORCA: { id: 'SOUND_ORCA', label: 'Orca', icon: '🐋', type: 'SOUND' },

  // ZEIT
  TIME_CORAL: { id: 'TIME_CORAL', label: 'Coral', icon: '🪸', type: 'TIME' },
  TIME_LIZARD: { id: 'TIME_LIZARD', label: 'Lizard', icon: '🦎', type: 'TIME' },
  TIME_CAMEL: { id: 'TIME_CAMEL', label: 'Camel', icon: '🐪', type: 'TIME' },
  TIME_CROCODILE: { id: 'TIME_CROCODILE', label: 'Crocodile', icon: '🐊', type: 'TIME' },
  TIME_HIPPO: { id: 'TIME_HIPPO', label: 'Hippo', icon: '🦛', type: 'TIME' },

  // RAUM
  SPACE_COMET: { id: 'SPACE_COMET', label: 'Comet', icon: '☄️', type: 'SPACE' },
  SPACE_STAR: { id: 'SPACE_STAR', label: 'Star Being', icon: '⭐', type: 'SPACE' },
  SPACE_ALIEN: { id: 'SPACE_ALIEN', label: 'Alien', icon: '👽', type: 'SPACE' },
  SPACE_PLANET: { id: 'SPACE_PLANET', label: 'Planet', icon: '🪐', type: 'SPACE' },
  SPACE_RAINBOW: { id: 'SPACE_RAINBOW', label: 'Rainbow Star', icon: '🌟', type: 'SPACE' },

  // LEERE
  VOID_WORM: { id: 'VOID_WORM', label: 'Void Worm', icon: '🪱', type: 'VOID' },
  VOID_SPIDER: { id: 'VOID_SPIDER', label: 'Void Spider', icon: '🕷️', type: 'VOID' },
  VOID_SHEEP: { id: 'VOID_SHEEP', label: 'Void Sheep', icon: '🐑', type: 'VOID' },
  VOID_OCTOPUS: { id: 'VOID_OCTOPUS', label: 'Void Octopus', icon: '🐙', type: 'VOID' },
  VOID_DRAGON: { id: 'VOID_DRAGON', label: 'Void Dragon', icon: '🐉', type: 'VOID' },

  // CHAOS
  CHAOS_TEA: { id: 'CHAOS_TEA', label: 'Tea Set', icon: '🫖', type: 'CHAOS' },
  CHAOS_RACCOON: { id: 'CHAOS_RACCOON', label: 'Raccoon', icon: '🦝', type: 'CHAOS' },
  CHAOS_LYNX: { id: 'CHAOS_LYNX', label: 'Lynx', icon: '🐈', type: 'CHAOS' },
  CHAOS_MONKEY: { id: 'CHAOS_MONKEY', label: 'Monkey', icon: '🐒', type: 'CHAOS' },
  CHAOS_DEVIL: { id: 'CHAOS_DEVIL', label: 'Devil', icon: '😈', type: 'CHAOS' },

  // ORDNUNG
  ORDER_YING: { id: 'ORDER_YING', label: 'Ying', icon: '⚪', type: 'ORDER' },
  ORDER_YANG: { id: 'ORDER_YANG', label: 'Yang', icon: '⚫', type: 'ORDER' },
  ORDER_LION: { id: 'ORDER_LION', label: 'Lion', icon: '🦁', type: 'ORDER' },
  ORDER_DINO: { id: 'ORDER_DINO', label: 'Dinosaur', icon: '🦖', type: 'ORDER' },
  ORDER_ANGEL: { id: 'ORDER_ANGEL', label: 'Angel', icon: '👼', type: 'ORDER' },
};

// --- 2. GEHEIME ZUCHT-HYBRIDEN ---
export const SECRET_ANIMALS = {
    SECRET_CHIMERA_PRIME: { id: 'SECRET_CHIMERA_PRIME', label: 'Chimera Prime', icon: '🦁🐍🐐', type: 'CHAOS' },
    SECRET_VOID_WALKER: { id: 'SECRET_VOID_WALKER', label: 'Void Walker', icon: '🕴️', type: 'VOID' },
    SECRET_PHOENIX_LORD: { id: 'SECRET_PHOENIX_LORD', label: 'Phoenix Lord', icon: '👑🦅', type: 'FIRE' },
    SECRET_KRAKEN_KING: { id: 'SECRET_KRAKEN_KING', label: 'Kraken King', icon: '👑🐙', type: 'WATER' },
    SECRET_GAIA_GUARDIAN: { id: 'SECRET_GAIA_GUARDIAN', label: 'Gaia\'s Guardian', icon: '🌍', type: 'NATURE' },
    SECRET_STORM_BRINGER: { id: 'SECRET_STORM_BRINGER', label: 'Storm Bringer', icon: '⛈️', type: 'ELECTRIC' },
    SECRET_TIME_WEAVER: { id: 'SECRET_TIME_WEAVER', label: 'Time Weaver', icon: '⏳🕷️', type: 'TIME' },
    SECRET_STAR_EATER: { id: 'SECRET_STAR_EATER', label: 'Star Eater', icon: '🌌', type: 'SPACE' },
    SECRET_MECHA_DRAGON: { id: 'SECRET_MECHA_DRAGON', label: 'Mecha Dragon', icon: '🤖🐉', type: 'METAL' },
    SECRET_SHADOW_ASSASSIN: { id: 'SECRET_SHADOW_ASSASSIN', label: 'Shadow Blade', icon: '🥷', type: 'DARK' },
    SECRET_CRYSTAL_UNICORN: { id: 'SECRET_CRYSTAL_UNICORN', label: 'Crystal Horn', icon: '💎🦄', type: 'LIGHT' },
    SECRET_GHOST_SHIP: { id: 'SECRET_GHOST_SHIP', label: 'Flying Dutchman', icon: '🚢👻', type: 'GHOST' },
    SECRET_SOUND_WAVE: { id: 'SECRET_SOUND_WAVE', label: 'Bass Drop', icon: '🔊', type: 'SOUND' },
    SECRET_FROST_GIANT: { id: 'SECRET_FROST_GIANT', label: 'Frost Giant', icon: '🥶', type: 'ICE' },
    SECRET_POISON_IVY: { id: 'SECRET_POISON_IVY', label: 'Death Blossom', icon: '🌺☠️', type: 'POISON' },
};

export const ZODIAC_ANIMALS = { ...BASE_ANIMALS, ...SECRET_ANIMALS };

export const SPECIES_BY_TYPE = {};
Object.keys(TYPES).forEach(typeKey => {
    SPECIES_BY_TYPE[typeKey] = Object.keys(BASE_ANIMALS).filter(key => BASE_ANIMALS[key].type === typeKey);
});

export const FUSION_RECIPES = {
    'FIRE_WATER': { label: 'Steam Wraith', icon: '♨️', type: 'WIND' },
    'FIRE_ICE': { label: 'Obsidian Golem', icon: '🗿', type: 'ROCK' },
    'FIRE_NATURE': { label: 'Ash Ent', icon: '🍂', type: 'DARK' },
    'FIRE_ELECTRIC': { label: 'Plasma Being', icon: '⚛️', type: 'TECH' },
    'WATER_ELECTRIC': { label: 'Storm Eel', icon: '⛈️', type: 'ELECTRIC' },
    'WATER_EARTH': { label: 'Swamp Monster', icon: '🧟', type: 'POISON' },
    'WATER_ICE': { label: 'Iceberg Titan', icon: '🏔️', type: 'ICE' },
    'NATURE_LIGHT': { label: 'Tree of Life', icon: '🌳', type: 'NATURE' },
    'NATURE_DEATH': { label: 'Mushroom Zombie', icon: '🍄', type: 'POISON' },
    'LIGHT_DARK': { label: 'Twilight Dragon', icon: '🌗', type: 'DRAGON' },
    'TIME_SPACE': { label: 'Dimension Wanderer', icon: '🌀', type: 'VOID' },
    'METAL_ELECTRIC': { label: 'Robo-Overlord', icon: '🤖', type: 'TECH' },
    'WIND_EARTH': { label: 'Sandstorm Djinn', icon: '🌪️', type: 'WIND' },
    'GHOST_TECH': { label: 'Virus Phantom', icon: '👾', type: 'TECH' },
    'CHAOS_ORDER': { label: 'Balance Keeper', icon: '⚖️', type: 'DIVINE' },
};