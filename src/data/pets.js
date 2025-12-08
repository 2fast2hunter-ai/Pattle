import { TYPES } from './types'; // Importiert TYPES aus der neuen types.jsx

// --- 1. BASIS SPEZIES ---
export const BASE_ANIMALS = {
  // FEUER
  FIRE_FOX: { id: 'FIRE_FOX', label: 'Fuchs', icon: '🦊', type: 'FIRE' },
  FIRE_SALAMANDER: { id: 'FIRE_SALAMANDER', label: 'Salamander', icon: '🦎', type: 'FIRE' },
  FIRE_JELLYFISH: { id: 'FIRE_JELLYFISH', label: 'Feuerqualle', icon: '🪼', type: 'FIRE' },
  FIRE_TIGER: { id: 'FIRE_TIGER', label: 'Tiger', icon: '🐅', type: 'FIRE' },
  FIRE_PHOENIX: { id: 'FIRE_PHOENIX', label: 'Phönix', icon: '🦅', type: 'FIRE' },

  // WASSER
  WATER_GOLDFISH: { id: 'WATER_GOLDFISH', label: 'Goldfisch', icon: '🐠', type: 'WATER' },
  WATER_SQUID: { id: 'WATER_SQUID', label: 'Tintenfisch', icon: '🦑', type: 'WATER' },
  WATER_TURTLE: { id: 'WATER_TURTLE', label: 'Schildkröte', icon: '🐢', type: 'WATER' },
  WATER_SHARK: { id: 'WATER_SHARK', label: 'Hai', icon: '🦈', type: 'WATER' },
  WATER_WHALE: { id: 'WATER_WHALE', label: 'Wal', icon: '🐋', type: 'WATER' },

  // NATUR
  NATURE_BUTTERFLY: { id: 'NATURE_BUTTERFLY', label: 'Schmetterling', icon: '🦋', type: 'NATURE' },
  NATURE_BOAR: { id: 'NATURE_BOAR', label: 'Wildschwein', icon: '🐗', type: 'NATURE' },
  NATURE_SLOTH: { id: 'NATURE_SLOTH', label: 'Riesenfaultier', icon: '🦥', type: 'NATURE' },
  NATURE_WOLF: { id: 'NATURE_WOLF', label: 'Wolf', icon: '🐺', type: 'NATURE' },
  NATURE_BEAR: { id: 'NATURE_BEAR', label: 'Bär', icon: '🐻', type: 'NATURE' },

  // WIND
  WIND_BEE: { id: 'WIND_BEE', label: 'Biene', icon: '🐝', type: 'WIND' },
  WIND_DRAGONFLY: { id: 'WIND_DRAGONFLY', label: 'Libelle', icon: '🦟', type: 'WIND' },
  WIND_DOVE: { id: 'WIND_DOVE', label: 'Taube', icon: '🕊️', type: 'WIND' },
  WIND_EAGLE: { id: 'WIND_EAGLE', label: 'Adler', icon: '🦅', type: 'WIND' },
  WIND_GRIFFIN: { id: 'WIND_GRIFFIN', label: 'Greif', icon: '🦁🦅', type: 'WIND' },

  // ERDE
  EARTH_ANT: { id: 'EARTH_ANT', label: 'Ameise', icon: '🐜', type: 'EARTH' },
  EARTH_MOLE: { id: 'EARTH_MOLE', label: 'Maulwurf', icon: '🦫', type: 'EARTH' },
  EARTH_BULL: { id: 'EARTH_BULL', label: 'Bulle', icon: '🐂', type: 'EARTH' },
  EARTH_RHINO: { id: 'EARTH_RHINO', label: 'Nashorn', icon: '🦏', type: 'EARTH' },
  EARTH_ELEPHANT: { id: 'EARTH_ELEPHANT', label: 'Elefant', icon: '🐘', type: 'EARTH' },

  // EIS
  ICE_PENGUIN: { id: 'ICE_PENGUIN', label: 'Pinguin', icon: '🐧', type: 'ICE' },
  ICE_SEAGULL: { id: 'ICE_SEAGULL', label: 'Möwe', icon: '🐦', type: 'ICE' },
  ICE_SEAL: { id: 'ICE_SEAL', label: 'Robbe', icon: '🦭', type: 'ICE' },
  ICE_POLARBEAR: { id: 'ICE_POLARBEAR', label: 'Eisbär', icon: '🐻‍❄️', type: 'ICE' },
  ICE_YETI: { id: 'ICE_YETI', label: 'Yeti', icon: '🦍', type: 'ICE' },

  // ELEKTRO
  ELECTRIC_RAY: { id: 'ELECTRIC_RAY', label: 'Zitterrochen', icon: '⚡🐟', type: 'ELECTRIC' },
  ELECTRIC_EEL: { id: 'ELECTRIC_EEL', label: 'Zitteraal', icon: '🐍', type: 'ELECTRIC' },
  ELECTRIC_CATFISH: { id: 'ELECTRIC_CATFISH', label: 'Wels', icon: '🐟', type: 'ELECTRIC' },
  ELECTRIC_CAT: { id: 'ELECTRIC_CAT', label: 'Elektro-Katze', icon: '🐱⚡', type: 'ELECTRIC' },
  ELECTRIC_THUNDERBIRD: { id: 'ELECTRIC_THUNDERBIRD', label: 'Donnervogel', icon: '🦅⚡', type: 'ELECTRIC' },

  // LICHT
  LIGHT_SNAIL: { id: 'LIGHT_SNAIL', label: 'Schnecke', icon: '🐌', type: 'LIGHT' },
  LIGHT_WORM: { id: 'LIGHT_WORM', label: 'Wurm', icon: '🪱', type: 'LIGHT' },
  LIGHT_SWAN: { id: 'LIGHT_SWAN', label: 'Schwan', icon: '🦢', type: 'LIGHT' },
  LIGHT_PEGASUS: { id: 'LIGHT_PEGASUS', label: 'Pegasus', icon: '🐎🪽', type: 'LIGHT' },
  LIGHT_DRAGON: { id: 'LIGHT_DRAGON', label: 'Weißer Drache', icon: '🐉', type: 'LIGHT' },

  // DUNKEL
  DARK_TOAD: { id: 'DARK_TOAD', label: 'Kröte', icon: '🐸', type: 'DARK' },
  DARK_RAVEN: { id: 'DARK_RAVEN', label: 'Rabe', icon: '🐦‍⬛', type: 'DARK' },
  DARK_CAT: { id: 'DARK_CAT', label: 'Schwarze Katze', icon: '🐈‍⬛', type: 'DARK' },
  DARK_PANTHER: { id: 'DARK_PANTHER', label: 'Panther', icon: '🐆', type: 'DARK' },
  DARK_DRAGON: { id: 'DARK_DRAGON', label: 'Schwarzer Drache', icon: '🐉', type: 'DARK' },

  // GEIST
  GHOST_SPIRIT: { id: 'GHOST_SPIRIT', label: 'Geist', icon: '👻', type: 'GHOST' },
  GHOST_DEER: { id: 'GHOST_DEER', label: 'Geister-Reh', icon: '🦌', type: 'GHOST' },
  GHOST_ANTELOPE: { id: 'GHOST_ANTELOPE', label: 'Geister-Antilope', icon: '🦌', type: 'GHOST' },
  GHOST_JELLYFISH: { id: 'GHOST_JELLYFISH', label: 'Geister-Qualle', icon: '🪼', type: 'GHOST' },
  GHOST_LION: { id: 'GHOST_LION', label: 'Geister-Löwe', icon: '🦁', type: 'GHOST' },

  // MAGIE
  MAGIC_BEETLE: { id: 'MAGIC_BEETLE', label: 'Hirschkäfer', icon: '🪲', type: 'MAGIC' },
  MAGIC_PEACOCK: { id: 'MAGIC_PEACOCK', label: 'Pfau', icon: '🦚', type: 'MAGIC' },
  MAGIC_HAT: { id: 'MAGIC_HAT', label: 'Zauberhut', icon: '🎩👀', type: 'MAGIC' },
  MAGIC_SABERTOOTH: { id: 'MAGIC_SABERTOOTH', label: 'Säbelzahntiger', icon: '🐅', type: 'MAGIC' },
  MAGIC_UNICORN: { id: 'MAGIC_UNICORN', label: 'Einhorn', icon: '🦄', type: 'MAGIC' },

  // PSYCHO
  PSYCHIC_SQUIRREL: { id: 'PSYCHIC_SQUIRREL', label: 'Eichhörnchen', icon: '🐿️', type: 'PSYCHIC' },
  PSYCHIC_TOUCAN: { id: 'PSYCHIC_TOUCAN', label: 'Tukan', icon: '🦜', type: 'PSYCHIC' },
  PSYCHIC_FLAMINGO: { id: 'PSYCHIC_FLAMINGO', label: 'Flamingo', icon: '🦩', type: 'PSYCHIC' },
  PSYCHIC_GIRAFFE: { id: 'PSYCHIC_GIRAFFE', label: 'Giraffe', icon: '🦒', type: 'PSYCHIC' },
  PSYCHIC_HAMMERHEAD: { id: 'PSYCHIC_HAMMERHEAD', label: 'Hammerhai', icon: '🦈', type: 'PSYCHIC' },

  // KAMPF
  FIGHTING_CRAB: { id: 'FIGHTING_CRAB', label: 'Krabbe', icon: '🦀', type: 'FIGHTING' },
  FIGHTING_SPIDER: { id: 'FIGHTING_SPIDER', label: 'Spinne', icon: '🕷️', type: 'FIGHTING' },
  FIGHTING_DOG: { id: 'FIGHTING_DOG', label: 'Hund', icon: '🐕', type: 'FIGHTING' },
  FIGHTING_KANGAROO: { id: 'FIGHTING_KANGAROO', label: 'Känguru', icon: '🦘', type: 'FIGHTING' },
  FIGHTING_HORSE: { id: 'FIGHTING_HORSE', label: 'Pferd', icon: '🐎', type: 'FIGHTING' },

  // METALL
  METAL_TURTLE: { id: 'METAL_TURTLE', label: 'Graue Schildkröte', icon: '🐢', type: 'METAL' },
  METAL_SCORPION: { id: 'METAL_SCORPION', label: 'Grauer Skorpion', icon: '🦂', type: 'METAL' },
  METAL_BISON: { id: 'METAL_BISON', label: 'Bison', icon: '🦬', type: 'METAL' },
  METAL_GORILLA: { id: 'METAL_GORILLA', label: 'Gorilla', icon: '🦍', type: 'METAL' },
  METAL_DRAGON: { id: 'METAL_DRAGON', label: 'Grauer Drache', icon: '🐉', type: 'METAL' },

  // GESTEIN
  ROCK_BEETLE: { id: 'ROCK_BEETLE', label: 'Steinkäfer', icon: '🪲', type: 'ROCK' },
  ROCK_SCORPION: { id: 'ROCK_SCORPION', label: 'Skorpion', icon: '🦂', type: 'ROCK' },
  ROCK_IBEX: { id: 'ROCK_IBEX', label: 'Steinbock', icon: '🐐', type: 'ROCK' },
  ROCK_MAMMOTH: { id: 'ROCK_MAMMOTH', label: 'Mammut', icon: '🦣', type: 'ROCK' },
  ROCK_GOLEM: { id: 'ROCK_GOLEM', label: 'Golem', icon: '🗿', type: 'ROCK' },

  // GIFT
  POISON_CATERPILLAR: { id: 'POISON_CATERPILLAR', label: 'Raupe', icon: '🐛', type: 'POISON' },
  POISON_RAT: { id: 'POISON_RAT', label: 'Ratte', icon: '🐀', type: 'POISON' },
  POISON_STONEFISH: { id: 'POISON_STONEFISH', label: 'Steinfisch', icon: '🐟', type: 'POISON' },
  POISON_FROG: { id: 'POISON_FROG', label: 'Blauer Frosch', icon: '🐸', type: 'POISON' },
  POISON_SNAKE: { id: 'POISON_SNAKE', label: 'Schlange', icon: '🐍', type: 'POISON' },

  // DRACHE
  DRAGON_GREEN: { id: 'DRAGON_GREEN', label: 'Grüner Drache', icon: '🐉', type: 'DRAGON' },
  DRAGON_YELLOW: { id: 'DRAGON_YELLOW', label: 'Gelber Drache', icon: '🐉', type: 'DRAGON' },
  DRAGON_BLUE: { id: 'DRAGON_BLUE', label: 'Blauer Drache', icon: '🐉', type: 'DRAGON' },
  DRAGON_RED: { id: 'DRAGON_RED', label: 'Roter Drache', icon: '🐉', type: 'DRAGON' },
  DRAGON_COLOR: { id: 'DRAGON_COLOR', label: 'Bunter Drache', icon: '🐉', type: 'DRAGON' },

  // FEE
  FAIRY_GNOME: { id: 'FAIRY_GNOME', label: 'Gnom', icon: '🧙‍♂️', type: 'FAIRY' },
  FAIRY_RABBIT: { id: 'FAIRY_RABBIT', label: 'Hase', icon: '🐇', type: 'FAIRY' },
  FAIRY_HAT: { id: 'FAIRY_HAT', label: 'Grüner Hut', icon: '🎩🟢', type: 'FAIRY' },
  FAIRY_CAT: { id: 'FAIRY_CAT', label: 'Rosa Katze', icon: '🐱', type: 'FAIRY' },
  FAIRY_QUEEN: { id: 'FAIRY_QUEEN', label: 'Fee (Königin)', icon: '🧚‍♀️', type: 'FAIRY' },

  // CYBER (TECH)
  TECH_MOUSE: { id: 'TECH_MOUSE', label: 'Cyber-Maus', icon: '🖱️', type: 'TECH' },
  TECH_CHICKEN: { id: 'TECH_CHICKEN', label: 'Cyber-Huhn', icon: '🐔', type: 'TECH' },
  TECH_DRONE: { id: 'TECH_DRONE', label: 'Drohne', icon: '🚁', type: 'TECH' },
  TECH_MOOSE: { id: 'TECH_MOOSE', label: 'Cyber-Elch', icon: '🫎', type: 'TECH' },
  TECH_ROBOT: { id: 'TECH_ROBOT', label: 'Roboter', icon: '🤖', type: 'TECH' },

  // SCHALL
  SOUND_CRICKET: { id: 'SOUND_CRICKET', label: 'Lärmgrille', icon: '🦗', type: 'SOUND' },
  SOUND_PARROT: { id: 'SOUND_PARROT', label: 'Papagei', icon: '🦜', type: 'SOUND' },
  SOUND_BAT: { id: 'SOUND_BAT', label: 'Fledermaus', icon: '🦇', type: 'SOUND' },
  SOUND_OWL: { id: 'SOUND_OWL', label: 'Eule', icon: '🦉', type: 'SOUND' },
  SOUND_ORCA: { id: 'SOUND_ORCA', label: 'Orca', icon: '🐋', type: 'SOUND' },

  // ZEIT
  TIME_CORAL: { id: 'TIME_CORAL', label: 'Koralle', icon: '🪸', type: 'TIME' },
  TIME_LIZARD: { id: 'TIME_LIZARD', label: 'Echse', icon: '🦎', type: 'TIME' },
  TIME_CAMEL: { id: 'TIME_CAMEL', label: 'Kamel', icon: '🐪', type: 'TIME' },
  TIME_CROCODILE: { id: 'TIME_CROCODILE', label: 'Krokodil', icon: '🐊', type: 'TIME' },
  TIME_HIPPO: { id: 'TIME_HIPPO', label: 'Nilpferd', icon: '🦛', type: 'TIME' },

  // RAUM
  SPACE_COMET: { id: 'SPACE_COMET', label: 'Komet', icon: '☄️', type: 'SPACE' },
  SPACE_STAR: { id: 'SPACE_STAR', label: 'Sternenwesen', icon: '⭐', type: 'SPACE' },
  SPACE_ALIEN: { id: 'SPACE_ALIEN', label: 'Alien', icon: '👽', type: 'SPACE' },
  SPACE_PLANET: { id: 'SPACE_PLANET', label: 'Planet', icon: '🪐', type: 'SPACE' },
  SPACE_RAINBOW: { id: 'SPACE_RAINBOW', label: 'Regenbogenstern', icon: '🌟', type: 'SPACE' },

  // LEERE
  VOID_WORM: { id: 'VOID_WORM', label: 'Lila Wurm', icon: '🪱', type: 'VOID' },
  VOID_SPIDER: { id: 'VOID_SPIDER', label: 'Lila Spinne', icon: '🕷️', type: 'VOID' },
  VOID_SHEEP: { id: 'VOID_SHEEP', label: 'Lila Schaf', icon: '🐑', type: 'VOID' },
  VOID_OCTOPUS: { id: 'VOID_OCTOPUS', label: 'Lila Krake', icon: '🐙', type: 'VOID' },
  VOID_DRAGON: { id: 'VOID_DRAGON', label: 'Lila Drache', icon: '🐉', type: 'VOID' },

  // CHAOS
  CHAOS_TEA: { id: 'CHAOS_TEA', label: 'Teeservice', icon: '🫖', type: 'CHAOS' },
  CHAOS_RACCOON: { id: 'CHAOS_RACCOON', label: 'Waschbär', icon: '🦝', type: 'CHAOS' },
  CHAOS_LYNX: { id: 'CHAOS_LYNX', label: 'Luchs', icon: '🐈', type: 'CHAOS' },
  CHAOS_MONKEY: { id: 'CHAOS_MONKEY', label: 'Affe', icon: '🐒', type: 'CHAOS' },
  CHAOS_DEVIL: { id: 'CHAOS_DEVIL', label: 'Teufel', icon: '😈', type: 'CHAOS' },

  // ORDNUNG
  ORDER_YING: { id: 'ORDER_YING', label: 'Ying', icon: '⚪', type: 'ORDER' },
  ORDER_YANG: { id: 'ORDER_YANG', label: 'Yang', icon: '⚫', type: 'ORDER' },
  ORDER_LION: { id: 'ORDER_LION', label: 'Löwe', icon: '🦁', type: 'ORDER' },
  ORDER_DINO: { id: 'ORDER_DINO', label: 'Dinosaurier', icon: '🦖', type: 'ORDER' },
  ORDER_ANGEL: { id: 'ORDER_ANGEL', label: 'Engel', icon: '👼', type: 'ORDER' },
};

// --- 2. GEHEIME ZUCHT-HYBRIDEN ---
export const SECRET_ANIMALS = {
    SECRET_CHIMERA_PRIME: { id: 'SECRET_CHIMERA_PRIME', label: 'Chimära Prime', icon: '🦁🐍🐐', type: 'CHAOS' },
    SECRET_VOID_WALKER: { id: 'SECRET_VOID_WALKER', label: 'Void Walker', icon: '🕴️', type: 'VOID' },
    SECRET_PHOENIX_LORD: { id: 'SECRET_PHOENIX_LORD', label: 'Phönix Lord', icon: '👑🦅', type: 'FIRE' },
    SECRET_KRAKEN_KING: { id: 'SECRET_KRAKEN_KING', label: 'Krakenkönig', icon: '👑🐙', type: 'WATER' },
    SECRET_GAIA_GUARDIAN: { id: 'SECRET_GAIA_GUARDIAN', label: 'Wächter Gaiais', icon: '🌍', type: 'NATURE' },
    SECRET_STORM_BRINGER: { id: 'SECRET_STORM_BRINGER', label: 'Sturmbote', icon: '⛈️', type: 'ELECTRIC' },
    SECRET_TIME_WEAVER: { id: 'SECRET_TIME_WEAVER', label: 'Zeitweber', icon: '⏳🕷️', type: 'TIME' },
    SECRET_STAR_EATER: { id: 'SECRET_STAR_EATER', label: 'Sternenfresser', icon: '🌌', type: 'SPACE' },
    SECRET_MECHA_DRAGON: { id: 'SECRET_MECHA_DRAGON', label: 'Mecha-Drache', icon: '🤖🐉', type: 'METAL' },
    SECRET_SHADOW_ASSASSIN: { id: 'SECRET_SHADOW_ASSASSIN', label: 'Schattenklinge', icon: '🥷', type: 'DARK' },
    SECRET_CRYSTAL_UNICORN: { id: 'SECRET_CRYSTAL_UNICORN', label: 'Kristallhorn', icon: '💎🦄', type: 'LIGHT' },
    SECRET_GHOST_SHIP: { id: 'SECRET_GHOST_SHIP', label: 'Fliegender Holländer', icon: '🚢👻', type: 'GHOST' },
    SECRET_SOUND_WAVE: { id: 'SECRET_SOUND_WAVE', label: 'Bass-Drop', icon: '🔊', type: 'SOUND' },
    SECRET_FROST_GIANT: { id: 'SECRET_FROST_GIANT', label: 'Frostriese', icon: '🥶', type: 'ICE' },
    SECRET_POISON_IVY: { id: 'SECRET_POISON_IVY', label: 'Todesblüte', icon: '🌺☠️', type: 'POISON' },
};

export const ZODIAC_ANIMALS = { ...BASE_ANIMALS, ...SECRET_ANIMALS };

export const SPECIES_BY_TYPE = {};
Object.keys(TYPES).forEach(typeKey => {
    SPECIES_BY_TYPE[typeKey] = Object.keys(BASE_ANIMALS).filter(key => BASE_ANIMALS[key].type === typeKey);
});

export const FUSION_RECIPES = {
    'FIRE_WATER': { label: 'Dampf-Geist', icon: '♨️', type: 'WIND' },
    'FIRE_ICE': { label: 'Obsidian-Golem', icon: '🗿', type: 'ROCK' },
    'FIRE_NATURE': { label: 'Asche-Ent', icon: '🍂', type: 'DARK' },
    'FIRE_ELECTRIC': { label: 'Plasma-Wesen', icon: '⚛️', type: 'TECH' },
    'WATER_ELECTRIC': { label: 'Sturm-Aal', icon: '⛈️', type: 'ELECTRIC' },
    'WATER_EARTH': { label: 'Sumpf-Monster', icon: '🧟', type: 'POISON' },
    'WATER_ICE': { label: 'Eisberg-Titan', icon: '🏔️', type: 'ICE' },
    'NATURE_LIGHT': { label: 'Lebensbaum', icon: '🌳', type: 'NATURE' },
    'NATURE_DEATH': { label: 'Pilz-Zombie', icon: '🍄', type: 'POISON' },
    'LIGHT_DARK': { label: 'Zwielicht-Drache', icon: '🌗', type: 'DRAGON' },
    'TIME_SPACE': { label: 'Dimensions-Wanderer', icon: '🌀', type: 'VOID' },
    'METAL_ELECTRIC': { label: 'Robo-Overlord', icon: '🤖', type: 'TECH' },
    'WIND_EARTH': { label: 'Sandsturm-Dschinn', icon: '🌪️', type: 'WIND' },
    'GHOST_TECH': { label: 'Virus-Phantom', icon: '👾', type: 'TECH' },
    'CHAOS_ORDER': { label: 'Balance-Wächter', icon: '⚖️', type: 'DIVINE' },
};