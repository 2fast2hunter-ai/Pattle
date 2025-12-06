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
// HIER WAR DER FEHLER: export hinzugefügt
export const BASE_ANIMALS = {
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