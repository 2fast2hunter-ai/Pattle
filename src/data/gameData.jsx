import React from 'react';
import { 
  Flame, Droplets, Leaf, Wind, Mountain, Snowflake, Zap, Sun, Moon, Ghost, 
  Sparkles, Eye, Swords, Hexagon, Box, TestTube, Trophy, Heart, Cpu, Music, 
  Clock, Orbit, Aperture, AlertTriangle, Gavel
} from 'lucide-react';

// Helper für Millisekunden-Berechnung
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

export const RARITIES = {
  COMMON:       { id: 1, label: 'Gewöhnlich',   color: 'text-slate-400',   bg: 'bg-slate-500',   border: 'border-slate-400',   multi: 1.0, dropChance: 63.49,  breedCooldown: 10 * SECONDS, hatchDuration: 10 * SECONDS, minBreedLevel: 10, breedXp: 10, hatchXp: 5 },
  UNCOMMON:     { id: 2, label: 'Ungewöhnlich', color: 'text-green-400',   bg: 'bg-green-600',   border: 'border-green-500',   multi: 1.2, dropChance: 20.0,   breedCooldown: 5 * MINUTES,  hatchDuration: 5 * MINUTES,  minBreedLevel: 20, breedXp: 20, hatchXp: 10 },
  RARE:         { id: 3, label: 'Selten',       color: 'text-blue-400',    bg: 'bg-blue-600',    border: 'border-blue-500',    multi: 1.5, dropChance: 10.0,   breedCooldown: 30 * MINUTES, hatchDuration: 30 * MINUTES, minBreedLevel: 30, breedXp: 30, hatchXp: 15 },
  EPIC:         { id: 4, label: 'Episch',       color: 'text-purple-400',  bg: 'bg-purple-600',  border: 'border-purple-500',  multi: 1.8, dropChance: 4.0,    breedCooldown: 1 * HOURS,    hatchDuration: 1 * HOURS,    minBreedLevel: 40, breedXp: 40, hatchXp: 20 },
  LEGENDARY:    { id: 5, label: 'Legendär',     color: 'text-amber-400',   bg: 'bg-amber-600',   border: 'border-amber-500',   multi: 2.2, dropChance: 1.5,    breedCooldown: 2 * HOURS,    hatchDuration: 2 * HOURS,    minBreedLevel: 50, breedXp: 50, hatchXp: 25 },
  MYTHIC:       { id: 6, label: 'Mythisch',     color: 'text-red-500',     bg: 'bg-red-700',     border: 'border-red-600',     multi: 2.8, dropChance: 0.60,   breedCooldown: 4 * HOURS,    hatchDuration: 4 * HOURS,    minBreedLevel: 60, breedXp: 60, hatchXp: 30 },
  DIVINE:       { id: 7, label: 'Göttlich',     color: 'text-cyan-300',    bg: 'bg-cyan-600',    border: 'border-cyan-400',    multi: 3.5, dropChance: 0.25,   breedCooldown: 8 * HOURS,    hatchDuration: 8 * HOURS,    minBreedLevel: 70, breedXp: 70, hatchXp: 35 },
  ANCIENT:      { id: 8, label: 'Uralt',        color: 'text-stone-400',   bg: 'bg-stone-600',   border: 'border-stone-400',   multi: 4.5, dropChance: 0.10,   breedCooldown: 12 * HOURS,   hatchDuration: 12 * HOURS,   minBreedLevel: 80, breedXp: 80, hatchXp: 40 },
  COSMIC:       { id: 9, label: 'Kosmisch',     color: 'text-fuchsia-400', bg: 'bg-fuchsia-800', border: 'border-fuchsia-500', multi: 6.0, dropChance: 0.05,   breedCooldown: 18 * HOURS,   hatchDuration: 18 * HOURS,   minBreedLevel: 90, breedXp: 90, hatchXp: 45 },
  TRANSCENDENT: { id: 10,label: 'Transzendent', color: 'text-rose-300',    bg: 'bg-rose-900',    border: 'border-rose-400',    multi: 10.0, dropChance: 0.01,   breedCooldown: 1 * DAYS,     hatchDuration: 1 * DAYS,     minBreedLevel: 100, breedXp: 100, hatchXp: 50 },
};



export const TYPES = {
  FIRE:      { label: 'Feuer',      color: 'text-orange-500', bg: 'bg-orange-500', bgLight: 'bg-orange-500/20', icon: <Flame /> },
  WATER:     { label: 'Wasser',     color: 'text-blue-500',   bg: 'bg-blue-500',   bgLight: 'bg-blue-500/20',   icon: <Droplets /> },
  NATURE:    { label: 'Natur',      color: 'text-green-500',  bg: 'bg-green-500',  bgLight: 'bg-green-500/20',  icon: <Leaf /> },
  WIND:      { label: 'Wind',       color: 'text-sky-300',    bg: 'bg-sky-400',    bgLight: 'bg-sky-400/20',    icon: <Wind /> },
  EARTH:     { label: 'Erde',       color: 'text-amber-700',  bg: 'bg-amber-700',  bgLight: 'bg-amber-700/20',  icon: <Mountain /> },
  ICE:       { label: 'Eis',        color: 'text-cyan-200',   bg: 'bg-cyan-400',   bgLight: 'bg-cyan-400/20',   icon: <Snowflake /> },
  ELECTRIC:  { label: 'Elektro',    color: 'text-yellow-400', bg: 'bg-yellow-500', bgLight: 'bg-yellow-500/20', icon: <Zap /> },
  LIGHT:     { label: 'Licht',      color: 'text-yellow-100', bg: 'bg-yellow-200', bgLight: 'bg-yellow-200/20', icon: <Sun /> },
  DARK:      { label: 'Dunkel',     color: 'text-gray-800',   bg: 'bg-gray-800',   bgLight: 'bg-gray-800/20',   icon: <Moon /> },
  GHOST:     { label: 'Geist',      color: 'text-purple-300', bg: 'bg-purple-800', bgLight: 'bg-purple-800/20', icon: <Ghost /> },
  MAGIC:     { label: 'Magie',      color: 'text-pink-500',   bg: 'bg-pink-600',   bgLight: 'bg-pink-600/20',   icon: <Sparkles /> },
  PSYCHIC:   { label: 'Psycho',     color: 'text-fuchsia-400',bg: 'bg-fuchsia-500',bgLight: 'bg-fuchsia-500/20',icon: <Eye /> },
  FIGHTING:  { label: 'Kampf',      color: 'text-red-600',    bg: 'bg-red-600',    bgLight: 'bg-red-600/20',    icon: <Swords /> },
  METAL:     { label: 'Metall',     color: 'text-slate-400',  bg: 'bg-slate-500',  bgLight: 'bg-slate-500/20',  icon: <Hexagon /> },
  ROCK:      { label: 'Gestein',    color: 'text-stone-600',  bg: 'bg-stone-600',  bgLight: 'bg-stone-600/20',  icon: <Box /> },
  POISON:    { label: 'Gift',       color: 'text-lime-500',   bg: 'bg-lime-600',   bgLight: 'bg-lime-600/20',   icon: <TestTube /> },
  DRAGON:    { label: 'Drache',     color: 'text-indigo-500', bg: 'bg-indigo-600', bgLight: 'bg-indigo-600/20', icon: <Trophy /> },
  FAIRY:     { label: 'Fee',        color: 'text-pink-300',   bg: 'bg-pink-400',   bgLight: 'bg-pink-400/20',   icon: <Heart /> },
  TECH:      { label: 'Cyber',      color: 'text-blue-300',   bg: 'bg-blue-800',   bgLight: 'bg-blue-800/20',   icon: <Cpu /> },
  SOUND:     { label: 'Schall',     color: 'text-teal-400',   bg: 'bg-teal-500',   bgLight: 'bg-teal-500/20',   icon: <Music /> },
  TIME:      { label: 'Zeit',       color: 'text-amber-200',  bg: 'bg-amber-800',  bgLight: 'bg-amber-800/20',  icon: <Clock /> },
  SPACE:     { label: 'Raum',       color: 'text-violet-400', bg: 'bg-violet-900', bgLight: 'bg-violet-900/20', icon: <Orbit /> },
  VOID:      { label: 'Leere',      color: 'text-black',      bg: 'bg-black',      bgLight: 'bg-gray-900',      icon: <Aperture /> },
  CHAOS:     { label: 'Chaos',      color: 'text-red-400',    bg: 'bg-red-900',    bgLight: 'bg-red-900/20',    icon: <AlertTriangle /> },
  ORDER:     { label: 'Ordnung',    color: 'text-white',      bg: 'bg-slate-400',  bgLight: 'bg-slate-400/20',  icon: <Gavel /> },
};

// --- BASIS SPEZIES (125) ---
const BASE_ANIMALS = {
  FIRE_LION: { id: 'FIRE_LION', label: 'Feuerlöwe', icon: '🦁', type: 'FIRE' },
  FIRE_DRAGON: { id: 'FIRE_DRAGON', label: 'Glutdrache', icon: '🐲', type: 'FIRE' },
  FIRE_FOX: { id: 'FIRE_FOX', label: 'Fuchsteufel', icon: '🦊', type: 'FIRE' },
  FIRE_PHOENIX: { id: 'FIRE_PHOENIX', label: 'Phönix', icon: '🦅', type: 'FIRE' },
  FIRE_SALAMANDER: { id: 'FIRE_SALAMANDER', label: 'Salamander', icon: '🦎', type: 'FIRE' },

  WATER_SHARK: { id: 'WATER_SHARK', label: 'Tiefseehai', icon: '🦈', type: 'WATER' },
  WATER_WHALE: { id: 'WATER_WHALE', label: 'Blauwal', icon: '🐋', type: 'WATER' },
  WATER_OCTOPUS: { id: 'WATER_OCTOPUS', label: 'Riesenkrake', icon: '🐙', type: 'WATER' },
  WATER_TURTLE: { id: 'WATER_TURTLE', label: 'Wasserschildkröte', icon: '🐢', type: 'WATER' },
  WATER_CRAB: { id: 'WATER_CRAB', label: 'Königskrabbe', icon: '🦀', type: 'WATER' },

  NATURE_BEAR: { id: 'NATURE_BEAR', label: 'Waldbär', icon: '🐻', type: 'NATURE' },
  NATURE_WOLF: { id: 'NATURE_WOLF', label: 'Grauwolf', icon: '🐺', type: 'NATURE' },
  NATURE_DEER: { id: 'NATURE_DEER', label: 'Hirsch', icon: '🦌', type: 'NATURE' },
  NATURE_BOAR: { id: 'NATURE_BOAR', label: 'Wildschwein', icon: '🐗', type: 'NATURE' },
  NATURE_SLOTH: { id: 'NATURE_SLOTH', label: 'Riesenfaultier', icon: '🦥', type: 'NATURE' },

  WIND_EAGLE: { id: 'WIND_EAGLE', label: 'Sturmadler', icon: '🦅', type: 'WIND' },
  WIND_BAT: { id: 'WIND_BAT', label: 'Windfledermaus', icon: '🦇', type: 'WIND' },
  WIND_BEE: { id: 'WIND_BEE', label: 'Killerbiene', icon: '🐝', type: 'WIND' },
  WIND_GRIFFIN: { id: 'WIND_GRIFFIN', label: 'Greif', icon: '🕊️', type: 'WIND' },
  WIND_DRAGONFLY: { id: 'WIND_DRAGONFLY', label: 'Riesenlibelle', icon: '🦟', type: 'WIND' },

  EARTH_ELEPHANT: { id: 'EARTH_ELEPHANT', label: 'Kriegselefant', icon: '🐘', type: 'EARTH' },
  EARTH_RHINO: { id: 'EARTH_RHINO', label: 'Panzernashorn', icon: '🦏', type: 'EARTH' },
  EARTH_BULL: { id: 'EARTH_BULL', label: 'Stier', icon: '🐂', type: 'EARTH' },
  EARTH_MOLE: { id: 'EARTH_MOLE', label: 'Maulwurf', icon: '🦫', type: 'EARTH' },
  EARTH_HORSE: { id: 'EARTH_HORSE', label: 'Ackergaul', icon: '🐎', type: 'EARTH' },

  ICE_POLARBEAR: { id: 'ICE_POLARBEAR', label: 'Eisbär', icon: '🐻‍❄️', type: 'ICE' },
  ICE_PENGUIN: { id: 'ICE_PENGUIN', label: 'Kaiserpinguin', icon: '🐧', type: 'ICE' },
  ICE_SEAL: { id: 'ICE_SEAL', label: 'Robbe', icon: '🦭', type: 'ICE' },
  ICE_WOLF: { id: 'ICE_WOLF', label: 'Schneewolf', icon: '🐺', type: 'ICE' },
  ICE_YETI: { id: 'ICE_YETI', label: 'Yeti', icon: '🦍', type: 'ICE' },

  ELECTRIC_MOUSE: { id: 'ELECTRIC_MOUSE', label: 'Elektromaus', icon: '🐭', type: 'ELECTRIC' },
  ELECTRIC_CAT: { id: 'ELECTRIC_CAT', label: 'Blitzkatze', icon: '🐱', type: 'ELECTRIC' },
  ELECTRIC_EEL: { id: 'ELECTRIC_EEL', label: 'Zitteraal', icon: '🐍', type: 'ELECTRIC' },
  ELECTRIC_BIRD: { id: 'ELECTRIC_BIRD', label: 'Donnervogel', icon: '🐦', type: 'ELECTRIC' },
  ELECTRIC_LION: { id: 'ELECTRIC_LION', label: 'Stromlöwe', icon: '🦁', type: 'ELECTRIC' },

  LIGHT_UNICORN: { id: 'LIGHT_UNICORN', label: 'Einhorn', icon: '🦄', type: 'LIGHT' },
  LIGHT_PEGASUS: { id: 'LIGHT_PEGASUS', label: 'Pegasus', icon: '🐎', type: 'LIGHT' },
  LIGHT_SWAN: { id: 'LIGHT_SWAN', label: 'Lichtschwan', icon: '🦢', type: 'LIGHT' },
  LIGHT_LION: { id: 'LIGHT_LION', label: 'Sonnenlöwe', icon: '🦁', type: 'LIGHT' },
  LIGHT_BUTTERFLY: { id: 'LIGHT_BUTTERFLY', label: 'Lichtfalter', icon: '🦋', type: 'LIGHT' },

  DARK_PANTHER: { id: 'DARK_PANTHER', label: 'Schattenpanther', icon: '🐆', type: 'DARK' },
  DARK_CROW: { id: 'DARK_CROW', label: 'Nachtrabe', icon: '🐦‍⬛', type: 'DARK' },
  DARK_SNAKE: { id: 'DARK_SNAKE', label: 'Dunkelnatter', icon: '🐍', type: 'DARK' },
  DARK_BAT: { id: 'DARK_BAT', label: 'Vampir', icon: '🦇', type: 'DARK' },
  DARK_WOLF: { id: 'DARK_WOLF', label: 'Werwolf', icon: '🐺', type: 'DARK' },

  GHOST_CAT: { id: 'GHOST_CAT', label: 'Geisterkatze', icon: '🐈‍⬛', type: 'GHOST' },
  GHOST_DOG: { id: 'GHOST_DOG', label: 'Höllenhund', icon: '🐕', type: 'GHOST' },
  GHOST_OWL: { id: 'GHOST_OWL', label: 'Schleiereule', icon: '🦉', type: 'GHOST' },
  GHOST_SPIDER: { id: 'GHOST_SPIDER', label: 'Phantomspinne', icon: '🕷️', type: 'GHOST' },
  GHOST_WHALE: { id: 'GHOST_WHALE', label: 'Geisterwal', icon: '🐋', type: 'GHOST' },

  MAGIC_OWL: { id: 'MAGIC_OWL', label: 'Zaubereule', icon: '🦉', type: 'MAGIC' },
  MAGIC_CAT: { id: 'MAGIC_CAT', label: 'Hexenkatze', icon: '🐱', type: 'MAGIC' },
  MAGIC_FROG: { id: 'MAGIC_FROG', label: 'Magiektröte', icon: '🐸', type: 'MAGIC' },
  MAGIC_RABBIT: { id: 'MAGIC_RABBIT', label: 'Zauberhase', icon: '🐇', type: 'MAGIC' },
  MAGIC_DRAGON: { id: 'MAGIC_DRAGON', label: 'Feendrache', icon: '🐉', type: 'MAGIC' },

  PSYCHIC_FOX: { id: 'PSYCHIC_FOX', label: 'Kitsune', icon: '🦊', type: 'PSYCHIC' },
  PSYCHIC_CAT: { id: 'PSYCHIC_CAT', label: 'Psi-Katze', icon: '🐈', type: 'PSYCHIC' },
  PSYCHIC_MONKEY: { id: 'PSYCHIC_MONKEY', label: 'Guru-Affe', icon: '🐒', type: 'PSYCHIC' },
  PSYCHIC_SNAKE: { id: 'PSYCHIC_SNAKE', label: 'Hypnoschlange', icon: '🐍', type: 'PSYCHIC' },
  PSYCHIC_OCTOPUS: { id: 'PSYCHIC_OCTOPUS', label: 'Hirn-Krake', icon: '🐙', type: 'PSYCHIC' },

  FIGHTING_KANGAROO: { id: 'FIGHTING_KANGAROO', label: 'Box-Känguru', icon: '🦘', type: 'FIGHTING' },
  FIGHTING_GORILLA: { id: 'FIGHTING_GORILLA', label: 'Kong', icon: '🦍', type: 'FIGHTING' },
  FIGHTING_ROOSTER: { id: 'FIGHTING_ROOSTER', label: 'Kampfhahn', icon: '🐓', type: 'FIGHTING' },
  FIGHTING_DOG: { id: 'FIGHTING_DOG', label: 'Bulldogge', icon: '🐕', type: 'FIGHTING' },
  FIGHTING_PANDA: { id: 'FIGHTING_PANDA', label: 'Kung Fu Panda', icon: '🐼', type: 'FIGHTING' },

  METAL_ANT: { id: 'METAL_ANT', label: 'Eisenameise', icon: '🐜', type: 'METAL' },
  METAL_RHINO: { id: 'METAL_RHINO', label: 'Mecha-Rhino', icon: '🦏', type: 'METAL' },
  METAL_TURTLE: { id: 'METAL_TURTLE', label: 'Panzerkröte', icon: '🐢', type: 'METAL' },
  METAL_SCORPION: { id: 'METAL_SCORPION', label: 'Robo-Skorpion', icon: '🦂', type: 'METAL' },
  METAL_BIRD: { id: 'METAL_BIRD', label: 'Stahlvogel', icon: '🦅', type: 'METAL' },

  ROCK_GOLEM: { id: 'ROCK_GOLEM', label: 'Felsgolem', icon: '🦧', type: 'ROCK' },
  ROCK_SNAKE: { id: 'ROCK_SNAKE', label: 'Steinschlange', icon: '🪨', type: 'ROCK' },
  ROCK_BEETLE: { id: 'ROCK_BEETLE', label: 'Steinkäfer', icon: '🪲', type: 'ROCK' },
  ROCK_TURTLE: { id: 'ROCK_TURTLE', label: 'Bergkröte', icon: '🐢', type: 'ROCK' },
  ROCK_RAM: { id: 'ROCK_RAM', label: 'Steinbock', icon: '🐐', type: 'ROCK' },

  POISON_SNAKE: { id: 'POISON_SNAKE', label: 'Kobra', icon: '🐍', type: 'POISON' },
  POISON_SPIDER: { id: 'POISON_SPIDER', label: 'Giftspinne', icon: '🕷️', type: 'POISON' },
  POISON_FROG: { id: 'POISON_FROG', label: 'Pfeilgiftfrosch', icon: '🐸', type: 'POISON' },
  POISON_RAT: { id: 'POISON_RAT', label: 'Seuchenratte', icon: '🐀', type: 'POISON' },
  POISON_SCORPION: { id: 'POISON_SCORPION', label: 'Todesskorpion', icon: '🦂', type: 'POISON' },

  DRAGON_RED: { id: 'DRAGON_RED', label: 'Feuerdrache', icon: '🐉', type: 'DRAGON' },
  DRAGON_BLUE: { id: 'DRAGON_BLUE', label: 'Seedrache', icon: '🦕', type: 'DRAGON' },
  DRAGON_GREEN: { id: 'DRAGON_GREEN', label: 'Urzeitdrache', icon: '🦖', type: 'DRAGON' },
  DRAGON_GOLD: { id: 'DRAGON_GOLD', label: 'Golddrache', icon: '🐲', type: 'DRAGON' },
  DRAGON_BLACK: { id: 'DRAGON_BLACK', label: 'Nachtschatten', icon: '🦎', type: 'DRAGON' },

  FAIRY_BUTTERFLY: { id: 'FAIRY_BUTTERFLY', label: 'Monarchfalter', icon: '🦋', type: 'FAIRY' },
  FAIRY_UNICORN: { id: 'FAIRY_UNICORN', label: 'Minicorn', icon: '🦄', type: 'FAIRY' },
  FAIRY_CAT: { id: 'FAIRY_CAT', label: 'Feenkatze', icon: '🐱', type: 'FAIRY' },
  FAIRY_RABBIT: { id: 'FAIRY_RABBIT', label: 'Mondhase', icon: '🐇', type: 'FAIRY' },
  FAIRY_DEER: { id: 'FAIRY_DEER', label: 'Zauberhirsch', icon: '🦌', type: 'FAIRY' },

  TECH_ROBOT: { id: 'TECH_ROBOT', label: 'Androide', icon: '🤖', type: 'TECH' },
  TECH_DRONE: { id: 'TECH_DRONE', label: 'Drohne', icon: '🚁', type: 'TECH' },
  TECH_DOG: { id: 'TECH_DOG', label: 'Robo-Dog', icon: '🐕', type: 'TECH' },
  TECH_MOUSE: { id: 'TECH_MOUSE', label: 'Cyber-Maus', icon: '🖱️', type: 'TECH' },
  TECH_ANT: { id: 'TECH_ANT', label: 'Nano-Bot', icon: '🐜', type: 'TECH' },

  SOUND_BAT: { id: 'SOUND_BAT', label: 'Schall-Bat', icon: '🦇', type: 'SOUND' },
  SOUND_PARROT: { id: 'SOUND_PARROT', label: 'Lautsprecher-Ara', icon: '🦜', type: 'SOUND' },
  SOUND_WHALE: { id: 'SOUND_WHALE', label: 'Singwal', icon: '🐋', type: 'SOUND' },
  SOUND_CRICKET: { id: 'SOUND_CRICKET', label: 'Lärmgrille', icon: '🦗', type: 'SOUND' },
  SOUND_WOLF: { id: 'SOUND_WOLF', label: 'Heuler', icon: '🐺', type: 'SOUND' },

  TIME_TURTLE: { id: 'TIME_TURTLE', label: 'Ewigkeitskröte', icon: '🐢', type: 'TIME' },
  TIME_OWL: { id: 'TIME_OWL', label: 'Wächter der Zeit', icon: '🦉', type: 'TIME' },
  TIME_RABBIT: { id: 'TIME_RABBIT', label: 'Weißes Kaninchen', icon: '🐇', type: 'TIME' },
  TIME_LIZARD: { id: 'TIME_LIZARD', label: 'Chronos-Echse', icon: '🦎', type: 'TIME' },
  TIME_CAT: { id: 'TIME_CAT', label: 'Schrödingers Katze', icon: '🐈', type: 'TIME' },

  SPACE_ALIEN: { id: 'SPACE_ALIEN', label: 'Marsianer', icon: '👽', type: 'SPACE' },
  SPACE_STARFISH: { id: 'SPACE_STARFISH', label: 'Sternenwesen', icon: '⭐', type: 'SPACE' },
  SPACE_WHALE: { id: 'SPACE_WHALE', label: 'Weltraumwal', icon: '🐋', type: 'SPACE' },
  SPACE_OCTOPUS: { id: 'SPACE_OCTOPUS', label: 'Void-Squid', icon: '🐙', type: 'SPACE' },
  SPACE_CAT: { id: 'SPACE_CAT', label: 'Astro-Cat', icon: '🐱', type: 'SPACE' },

  VOID_GHOST: { id: 'VOID_GHOST', label: 'Nichts', icon: '👻', type: 'VOID' },
  VOID_EYE: { id: 'VOID_EYE', label: 'Das Auge', icon: '👁️', type: 'VOID' },
  VOID_SHADOW: { id: 'VOID_SHADOW', label: 'Schattenriss', icon: '👤', type: 'VOID' },
  VOID_SPIDER: { id: 'VOID_SPIDER', label: 'Leerenweber', icon: '🕷️', type: 'VOID' },
  VOID_SNAKE: { id: 'VOID_SNAKE', label: 'Abgrundschlange', icon: '🐍', type: 'VOID' },

  CHAOS_HYENA: { id: 'CHAOS_HYENA', label: 'Lachende Hyäne', icon: '🐕', type: 'CHAOS' },
  CHAOS_MONKEY: { id: 'CHAOS_MONKEY', label: 'Wahnsinnsaffe', icon: '🐒', type: 'CHAOS' },
  CHAOS_SNAKE: { id: 'CHAOS_SNAKE', label: 'Hydra', icon: '🐍', type: 'CHAOS' },
  CHAOS_DRAGON: { id: 'CHAOS_DRAGON', label: 'Chaosdrache', icon: '🐉', type: 'CHAOS' },
  CHAOS_JOKER: { id: 'CHAOS_JOKER', label: 'Joker', icon: '🤡', type: 'CHAOS' },

  ORDER_LION: { id: 'ORDER_LION', label: 'Königslöwe', icon: '🦁', type: 'ORDER' },
  ORDER_EAGLE: { id: 'ORDER_EAGLE', label: 'Reichsadler', icon: '🦅', type: 'ORDER' },
  ORDER_HORSE: { id: 'ORDER_HORSE', label: 'Ritterross', icon: '🐎', type: 'ORDER' },
  ORDER_DOG: { id: 'ORDER_DOG', label: 'Wachhund', icon: '🐕', type: 'ORDER' },
  ORDER_OWL: { id: 'ORDER_OWL', label: 'Richter', icon: '🦉', type: 'ORDER' },
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

export const TYPE_ADVANTAGES = {
  FIRE:      { strong: ['NATURE', 'ICE', 'METAL', 'BUG'], super: ['WOOD'] },
  WATER:     { strong: ['FIRE', 'ROCK', 'EARTH'], super: ['MAGMA'] },
  NATURE:    { strong: ['WATER', 'EARTH', 'ROCK'], super: ['LIGHT'] },
  ELECTRIC:  { strong: ['WATER', 'WIND', 'TECH'], super: ['METAL'] },
  ICE:       { strong: ['NATURE', 'DRAGON', 'WIND'], super: ['EARTH'] },
  WIND:      { strong: ['NATURE', 'FIGHTING'], super: ['EARTH'] },
  EARTH:     { strong: ['FIRE', 'ELECTRIC', 'POISON'], super: ['TECH'] },
  LIGHT:     { strong: ['DARK', 'GHOST', 'VOID'], super: ['CHAOS'] },
  DARK:      { strong: ['PSYCHIC', 'GHOST'], super: ['ORDER'] },
  GHOST:     { strong: ['PSYCHIC', 'GHOST'], super: [] },
  MAGIC:     { strong: ['FIGHTING', 'POISON'], super: ['PHYSICAL'] },
  PSYCHIC:   { strong: ['FIGHTING', 'POISON'], super: [] },
  FIGHTING:  { strong: ['METAL', 'ROCK', 'ICE', 'DARK'], super: [] },
  METAL:     { strong: ['FAIRY', 'ICE', 'ROCK'], super: ['POISON'] },
  ROCK:      { strong: ['FIRE', 'ICE', 'WIND', 'BUG'], super: ['ELECTRIC'] },
  POISON:    { strong: ['NATURE', 'FAIRY'], super: [] },
  DRAGON:    { strong: ['DRAGON'], super: [] },
  FAIRY:     { strong: ['FIGHTING', 'DARK', 'DRAGON'], super: ['VOID'] },
  TECH:      { strong: ['FAIRY', 'MAGIC', 'NATURE'], super: ['WATER'] },
  SOUND:     { strong: ['METAL', 'ICE', 'GLASS'], super: [] },
  TIME:      { strong: ['SPACE', 'ORDER'], super: ['ROCK'] },
  SPACE:     { strong: ['TIME', 'VOID'], super: [] },
  VOID:      { strong: ['LIGHT', 'MAGIC', 'SPACE', 'TIME'], super: ['REALITY'] },
  CHAOS:     { strong: ['ORDER', 'TECH', 'TIME'], super: [] },
  ORDER:     { strong: ['CHAOS', 'MAGIC'], super: [] },
};

export const ABILITIES = {
  fireball:     { name: 'Feuerball',      element: 'FIRE',     dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Schießt einen mächtigen Feuerball (150% AP)' },
  aqua:         { name: 'Wasserstrahl',   element: 'WATER',    dmgScale: 1.3, type: 'MAGIC',    cd: 3, desc: 'Magischer Wasserstrahl (130% AP)' },
  thorns:       { name: 'Dornenranke',    element: 'NATURE',   dmgScale: 1.4, type: 'MAGIC',    cd: 3, desc: 'Schlingpflanzen greifen an (140% AP)' },
  gust:         { name: 'Windstoß',       element: 'WIND',     dmgScale: 1.3, type: 'MAGIC',    cd: 2, desc: 'Schneller Windangriff (130% AP)' },
  smash:        { name: 'Erdschlag',      element: 'EARTH',    dmgScale: 1.2, type: 'PHYSICAL', cd: 2, desc: 'Ein schwerer Schlag (120% AD)' },
  icicle:       { name: 'Eissplitter',    element: 'ICE',      dmgScale: 1.4, type: 'MAGIC',    cd: 3, desc: 'Scharfe Eiskristalle (140% AP)' },
  thundershock: { name: 'Donnerschock',   element: 'ELECTRIC', dmgScale: 1.4, type: 'MAGIC',    cd: 3, desc: 'Elektrischer Schlag (140% AP)' },
  solarbeam:    { name: 'Solarstrahl',    element: 'LIGHT',    dmgScale: 1.8, type: 'MAGIC',    cd: 4, desc: 'Gebündeltes Licht (180% AP)' },
  bite:         { name: 'Knirscher',      element: 'DARK',     dmgScale: 1.4, type: 'PHYSICAL', cd: 3, desc: 'Starker Biss aus dem Schatten (140% AD)' },
  shadowball:   { name: 'Spukball',       element: 'GHOST',    dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Geisterhafte Energie (150% AP)' },
  arcanepulse:  { name: 'Arkaner Puls',   element: 'MAGIC',    dmgScale: 1.6, type: 'MAGIC',    cd: 4, desc: 'Reine Magie-Energie (160% AP)' },
  psybeam:      { name: 'Psi-Welle',      element: 'PSYCHIC',  dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Mentale Attacke (150% AP)' },
  punch:        { name: 'Karatehieb',     element: 'FIGHTING', dmgScale: 1.5, type: 'PHYSICAL', cd: 2, desc: 'Gezielter Kampfsport-Hieb (150% AD)' },
  ironhead:     { name: 'Eisenschädel',   element: 'METAL',    dmgScale: 1.3, type: 'PHYSICAL', cd: 3, desc: 'Harter Kopfstoß (130% AD)' },
  rockslide:    { name: 'Steinhagel',     element: 'ROCK',     dmgScale: 1.4, type: 'PHYSICAL', cd: 3, desc: 'Felsbrocken fallen herab (140% AD)' },
  sludge:       { name: 'Matschbombe',    element: 'POISON',   dmgScale: 1.3, type: 'MAGIC',    cd: 3, desc: 'Giftiger Schlamm (130% AP)' },
  dragonbreath: { name: 'Drachenodem',    element: 'DRAGON',   dmgScale: 1.7, type: 'MAGIC',    cd: 4, desc: 'Mystisches Drachenfeuer (170% AP)' },
  moonblast:    { name: 'Mondgewalt',     element: 'FAIRY',    dmgScale: 1.6, type: 'MAGIC',    cd: 3, desc: 'Kraft des Mondes (160% AP)' },
  laser:        { name: 'Laserstrahl',    element: 'TECH',     dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Cybernetischer Laser (150% AP)' },
  sonicboom:    { name: 'Schallmauer',    element: 'SOUND',    dmgScale: 1.3, type: 'MAGIC',    cd: 2, desc: 'Durchbricht die Schallmauer (130% AP)' },
  timewarp:     { name: 'Zeitsprung',     element: 'TIME',     dmgScale: 1.6, type: 'MAGIC',    cd: 4, desc: 'Verwirrt durch Zeitrisse (160% AP)' },
  meteorshower: { name: 'Meteorfall',     element: 'SPACE',    dmgScale: 1.8, type: 'MAGIC',    cd: 5, desc: 'Objekte aus dem All (180% AP)' },
  voidblast:    { name: 'Leereblick',     element: 'VOID',     dmgScale: 2.0, type: 'MAGIC',    cd: 5, desc: 'Schaden aus der Leere (200% AP)' },
  chaosstrike:  { name: 'Chaosklinge',    element: 'CHAOS',    dmgScale: 1.7, type: 'PHYSICAL', cd: 4, desc: 'Unberechenbarer Angriff (170% AD)' },
  judgement:    { name: 'Urteilsspruch',  element: 'ORDER',    dmgScale: 1.7, type: 'MAGIC',    cd: 4, desc: 'Göttliche Ordnung (170% AP)' },
};

export const QUEST_TYPES = {
  WIN_PVP: 'WIN_PVP',
  HATCH_EGG: 'HATCH_EGG',
  BREED_PET: 'BREED_PET',
  SPEND_COINS: 'SPEND_COINS',
  EARN_XP: 'EARN_XP',
  LEVEL_UP_PET: 'LEVEL_UP_PET',
};

// --- ALLE 100 QUEST TEMPLATES (NUR XP BELOHNUNGEN) ---
export const QUEST_TEMPLATES = [
  // --- PVP (WIN_PVP) ---
  { type: 'WIN_PVP', label: "Gewinne Kämpfe", baseAmount: 3, rewardType: 'XP', rewardBase: 150 },
  { type: 'WIN_PVP', label: "Arena Novize", baseAmount: 5, rewardType: 'XP', rewardBase: 250 },
  { type: 'WIN_PVP', label: "Der Herausforderer", baseAmount: 8, rewardType: 'XP', rewardBase: 400 },
  { type: 'WIN_PVP', label: "Siegeszug", baseAmount: 6, rewardType: 'XP', rewardBase: 300 },
  { type: 'WIN_PVP', label: "Dominanz", baseAmount: 10, rewardType: 'XP', rewardBase: 500 },
  { type: 'WIN_PVP', label: "Unbesiegbar?", baseAmount: 12, rewardType: 'XP', rewardBase: 600 },
  { type: 'WIN_PVP', label: "Gladiator", baseAmount: 15, rewardType: 'XP', rewardBase: 750 },
  { type: 'WIN_PVP', label: "Arena Champion", baseAmount: 20, rewardType: 'XP', rewardBase: 1000 },
  { type: 'WIN_PVP', label: "Schlachtenbummler", baseAmount: 4, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_PVP', label: "Kriegsfürst", baseAmount: 25, rewardType: 'XP', rewardBase: 1250 },
  { type: 'WIN_PVP', label: "Legende der Arena", baseAmount: 30, rewardType: 'XP', rewardBase: 1500 },
  { type: 'WIN_PVP', label: "Blut und Sand", baseAmount: 50, rewardType: 'XP', rewardBase: 2500 },
  { type: 'WIN_PVP', label: "Ehre dem Sieger", baseAmount: 2, rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP', label: "Taktiker", baseAmount: 7, rewardType: 'XP', rewardBase: 350 },
  { type: 'WIN_PVP', label: "Stratege", baseAmount: 9, rewardType: 'XP', rewardBase: 450 },
  { type: 'WIN_PVP', label: "Berserker", baseAmount: 18, rewardType: 'XP', rewardBase: 900 },
  { type: 'WIN_PVP', label: "Ewiger Ruhm", baseAmount: 40, rewardType: 'XP', rewardBase: 2000 },
  { type: 'WIN_PVP', label: "Titanen-Bezwinger", baseAmount: 100, rewardType: 'XP', rewardBase: 5000 },

  // --- ELEMENTAR-PVP (25) ---
  { type: 'WIN_FIRE', label: "Feuer-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_WATER', label: "Wasser-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_NATURE', label: "Natur-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_WIND', label: "Wind-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_EARTH', label: "Erd-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ICE', label: "Eis-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ELECTRIC', label: "Elektro-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_LIGHT', label: "Licht-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_DARK', label: "Dunkel-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_GHOST', label: "Geister-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_MAGIC', label: "Magie-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_PSYCHIC', label: "Psycho-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_FIGHTING', label: "Kampf-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_METAL', label: "Metall-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ROCK', label: "Gestein-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_POISON', label: "Gift-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_DRAGON', label: "Drachen-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_FAIRY', label: "Feen-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_TECH', label: "Tech-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_SOUND', label: "Schall-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_TIME', label: "Zeit-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_SPACE', label: "Raum-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_VOID', label: "Leere-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_CHAOS', label: "Chaos-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'WIN_ORDER', label: "Ordnung-Sieg", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },

  // --- HATCH & BREED (30) ---
  { type: 'HATCH_EGG', label: "Neues Leben", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'HATCH_EGG', label: "Zwillings-Schlüpfen", baseAmount: 2, rewardType: 'XP', rewardBase: 200 },
  { type: 'HATCH_EGG', label: "Kleiner Zoo", baseAmount: 3, rewardType: 'XP', rewardBase: 300 },
  { type: 'HATCH_EGG', label: "Inkubator-Test", baseAmount: 5, rewardType: 'XP', rewardBase: 500 },
  { type: 'HATCH_EGG', label: "Nachwuchs", baseAmount: 10, rewardType: 'XP', rewardBase: 1000 },
  { type: 'BREED_PET', label: "Erstes Date", baseAmount: 1, rewardType: 'XP', rewardBase: 200 },
  { type: 'BREED_PET', label: "Liebesbote", baseAmount: 2, rewardType: 'XP', rewardBase: 400 },
  { type: 'BREED_PET', label: "Genetiker", baseAmount: 3, rewardType: 'XP', rewardBase: 600 },
  { type: 'BREED_PET', label: "Zuchtprogramm", baseAmount: 5, rewardType: 'XP', rewardBase: 1000 },
  { type: 'BREED_PET', label: "Mendels Erbe", baseAmount: 10, rewardType: 'XP', rewardBase: 2000 },
  // Element-Zucht
  { type: 'BREED_FIRE', label: "Feuer-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_WATER', label: "Wasser-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_NATURE', label: "Natur-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_DRAGON', label: "Drachen-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  { type: 'BREED_VOID', label: "Leere-Zucht", baseAmount: 1, rewardType: 'XP', rewardBase: 300 },
  // Rarity-Hatch
  { type: 'HATCH_COMMON', label: "Hatch Common", baseAmount: 3, rewardType: 'XP', rewardBase: 150 },
  { type: 'HATCH_UNCOMMON', label: "Hatch Uncommon", baseAmount: 2, rewardType: 'XP', rewardBase: 250 },
  { type: 'HATCH_RARE', label: "Hatch Rare", baseAmount: 1, rewardType: 'XP', rewardBase: 400 },
  { type: 'HATCH_EPIC', label: "Hatch Epic", baseAmount: 1, rewardType: 'XP', rewardBase: 800 },
  { type: 'HATCH_LEGENDARY', label: "Hatch Legendary", baseAmount: 1, rewardType: 'XP', rewardBase: 2000 },

  // --- ECONOMY & LEVEL (27) ---
  { type: 'SPEND_COINS', label: "Kleingeld", baseAmount: 500, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Shopping Trip", baseAmount: 1000, rewardType: 'XP', rewardBase: 100 },
  { type: 'SPEND_COINS', label: "Investor", baseAmount: 2500, rewardType: 'XP', rewardBase: 250 },
  { type: 'SPEND_COINS', label: "Marktwirtschaft", baseAmount: 5000, rewardType: 'XP', rewardBase: 500 },
  { type: 'SPEND_COINS', label: "Big Spender", baseAmount: 10000, rewardType: 'XP', rewardBase: 1000 },
  { type: 'SPEND_COINS', label: "Kaufrausch", baseAmount: 20000, rewardType: 'XP', rewardBase: 2000 },
  { type: 'EARN_XP', label: "Lernen", baseAmount: 100, rewardType: 'XP', rewardBase: 20 }, // Bonus
  { type: 'EARN_XP', label: "Training", baseAmount: 500, rewardType: 'XP', rewardBase: 100 },
  { type: 'EARN_XP', label: "Fortschritt", baseAmount: 1000, rewardType: 'XP', rewardBase: 200 },
  { type: 'EARN_XP', label: "Wissen ist Macht", baseAmount: 5000, rewardType: 'XP', rewardBase: 1000 },
  { type: 'LEVEL_UP_PET', label: "Level Up", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'LEVEL_UP_PET', label: "Power Leveling", baseAmount: 3, rewardType: 'XP', rewardBase: 300 },
  { type: 'LEVEL_UP_PET', label: "Trainer", baseAmount: 5, rewardType: 'XP', rewardBase: 500 },
  { type: 'LEVEL_UP_PET', label: "Meister", baseAmount: 10, rewardType: 'XP', rewardBase: 1000 },
  
  // Fillers to reach 100 (Beispiele)
  { type: 'WIN_PVP', label: "Schneller Sieg", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Münzsammler", baseAmount: 100, rewardType: 'XP', rewardBase: 10 },
  { type: 'EARN_XP', label: "Erfahrung", baseAmount: 50, rewardType: 'XP', rewardBase: 10 },
  { type: 'HATCH_EGG', label: "Eieruhr", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'BREED_PET', label: "Zucht-Versuch", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP', label: "Arena-Kampf", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Ausgaben", baseAmount: 250, rewardType: 'XP', rewardBase: 25 },
  { type: 'EARN_XP', label: "Studium", baseAmount: 200, rewardType: 'XP', rewardBase: 40 },
  { type: 'LEVEL_UP_PET', label: "Aufstieg", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'HATCH_EGG', label: "Schlüpfen", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'BREED_PET', label: "Paarung", baseAmount: 1, rewardType: 'XP', rewardBase: 100 },
  { type: 'WIN_PVP', label: "Duell", baseAmount: 1, rewardType: 'XP', rewardBase: 50 },
  { type: 'SPEND_COINS', label: "Investition", baseAmount: 300, rewardType: 'XP', rewardBase: 30 },
];

export const COMPOSITE_QUEST_REWARDS = {
    DAILY: { rewardType: 'GEMS', rewardAmount: 5, label: "Tages-Bonus" },
    WEEKLY: { rewardType: 'EGG_EPIC', rewardAmount: 1, label: "Wochen-Truhe" },
    MONTHLY: { rewardType: 'COINS', rewardAmount: 10000, label: "Monats-Schatz" }
};

// --- LOOTBOX DEFINITIONEN ---
export const LOOTBOXES = {
    DAILY: {
        id: 'DAILY',
        label: 'Daily Box',
        cost: 0,
        currency: 'COINS',
        drops: {
            EPIC: 1.52,
            RARE: 10.10,
            UNCOMMON: 20.20,
            COMMON: 68.16
        }
    },
    PREMIUM: {
        id: 'PREMIUM',
        label: 'Premium Box',
        cost: 7500,
        currency: 'COINS',
        drops: {
            LEGENDARY: 1.23,
            EPIC: 6.27,
            RARE: 18.17,
            UNCOMMON: 50.34,
            COMMON: 24.00
        }
    },
    MASTER: {
        id: 'MASTER',
        label: 'Meister Box',
        cost: 15000,
        currency: 'COINS',
        drops: {
            TRANSCENDENT: 0.01,
            COSMIC: 0.05,
            ANCIENT: 0.10,
            DIVINE: 0.25,
            MYTHIC: 0.60,
            LEGENDARY: 2.50,
            EPIC: 8.00,
            RARE: 15.00,
            UNCOMMON: 40.00,
            COMMON: 23.49
        }
    },
    DIVINE: {
        id: 'DIVINE',
        label: 'Göttliche Box',
        cost: 50000,
        currency: 'COINS',
        drops: {
            TRANSCENDENT: 0.24,
            COSMIC: 1.22,
            ANCIENT: 3.68,
            DIVINE: 5.25,
            MYTHIC: 10.80,
            LEGENDARY: 20.60,
            EPIC: 58.66
        }
    }
};

export const SHOP_ITEMS = {
    TICKET_BUNDLE_COINS: { costCurrency: 'COINS', costAmount: 500, tickets: 1, label: "1 Zucht-Ticket" },
    TICKET_BUNDLE_GEMS: { costCurrency: 'GEMS', costAmount: 10, tickets: 5, label: "5 Zucht-Tickets" },
    //AD_REWARD_ENERGY: { rewardType: 'ENERGY', rewardAmount: 3, label: "3 Energie" }
};