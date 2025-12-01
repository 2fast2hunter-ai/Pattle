import React from 'react';
import { 
  Flame, Droplets, Leaf, Wind, Mountain, Snowflake, Zap, Sun, Moon, Ghost, 
  Sparkles, Eye, Swords, Hexagon, Box, TestTube, Trophy, Heart, Cpu, Music, 
  Clock, Orbit, Aperture, AlertTriangle, Gavel
} from 'lucide-react';


const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;

export const RARITIES = {
  COMMON:       { id: 1, label: 'Gewöhnlich',   color: 'text-slate-400',   bg: 'bg-slate-500',   border: 'border-slate-400',   multi: 1.0, hatchDuration: 10, dropChance: 80.0,   breedCooldown: 1 * HOURS },    // 1 Stunde
  UNCOMMON:     { id: 2, label: 'Ungewöhnlich', color: 'text-green-400',   bg: 'bg-green-600',   border: 'border-green-500',   multi: 1.2, hatchDuration: 30, dropChance: 15.0,   breedCooldown: 4 * HOURS },    // 4 Stunden
  RARE:         { id: 3, label: 'Selten',       color: 'text-blue-400',    bg: 'bg-blue-600',    border: 'border-blue-500',    multi: 1.5, hatchDuration: 60, dropChance: 4.0,    breedCooldown: 12 * HOURS },   // 12 Stunden
  EPIC:         { id: 4, label: 'Episch',       color: 'text-purple-400',  bg: 'bg-purple-600',  border: 'border-purple-500',  multi: 1.8, hatchDuration: 120, dropChance: 0.8,    breedCooldown: 1 * DAYS },     // 1 Tag
  LEGENDARY:    { id: 5, label: 'Legendär',     color: 'text-amber-400',   bg: 'bg-amber-600',   border: 'border-amber-500',   multi: 2.2, hatchDuration: 300, dropChance: 0.15,   breedCooldown: 3 * DAYS },     // 3 Tage
  MYTHIC:       { id: 6, label: 'Mythisch',     color: 'text-red-500',     bg: 'bg-red-700',     border: 'border-red-600',     multi: 2.8, hatchDuration: 600, dropChance: 0.04,   breedCooldown: 7 * DAYS },     // 7 Tage
  DIVINE:       { id: 7, label: 'Göttlich',     color: 'text-cyan-300',    bg: 'bg-cyan-600',    border: 'border-cyan-400',    multi: 3.5, hatchDuration: 1200, dropChance: 0.008,  breedCooldown: 14 * DAYS },    // 14 Tage
  ANCIENT:      { id: 8, label: 'Uralt',        color: 'text-stone-400',   bg: 'bg-stone-600',   border: 'border-stone-400',   multi: 4.5, hatchDuration: 3600, dropChance: 0.0019, breedCooldown: 21 * DAYS },    // 21 Tage
  COSMIC:       { id: 9, label: 'Kosmisch',     color: 'text-fuchsia-400', bg: 'bg-fuchsia-800', border: 'border-fuchsia-500', multi: 6.0, hatchDuration: 7200, dropChance: 0.0001, breedCooldown: 25 * DAYS },    // 25 Tage
  TRANSCENDENT: { id: 10,label: 'Transzendent', color: 'text-rose-300',    bg: 'bg-rose-900',    border: 'border-rose-400',    multi: 10.0, hatchDuration: 14400, dropChance: 0.0000,breedCooldown: 30 * DAYS },    // 30 Tage
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

export const ZODIAC_ANIMALS = {
  RAT:     { id: 'rat',     label: 'Ratte',    icon: '🐀' },
  OX:      { id: 'ox',      label: 'Büffel',   icon: '🐂' },
  TIGER:   { id: 'tiger',   label: 'Tiger',    icon: '🐅' },
  RABBIT:  { id: 'rabbit',  label: 'Hase',     icon: '🐇' },
  DRAGON:  { id: 'dragon',  label: 'Drache',   icon: '🐉' },
  SNAKE:   { id: 'snake',   label: 'Schlange', icon: '🐍' },
  HORSE:   { id: 'horse',   label: 'Pferd',    icon: '🐎' },
  GOAT:    { id: 'goat',    label: 'Ziege',    icon: '🐐' },
  MONKEY:  { id: 'monkey',  label: 'Affe',     icon: '🐒' },
  ROOSTER: { id: 'rooster', label: 'Hahn',     icon: '🐓' },
  DOG:     { id: 'dog',     label: 'Hund',     icon: '🐕' },
  PIG:     { id: 'pig',     label: 'Schwein',  icon: '🐖' },
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
  // ELEMENT: FIRE
  fireball:     { name: 'Feuerball',      element: 'FIRE',     dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Schießt einen mächtigen Feuerball (150% AP)' },
  
  // ELEMENT: WATER
  aqua:         { name: 'Wasserstrahl',   element: 'WATER',    dmgScale: 1.3, type: 'MAGIC',    cd: 3, desc: 'Magischer Wasserstrahl (130% AP)' },
  
  // ELEMENT: NATURE (Ersetzt Heal durch Schaden, damit der Kampf immer funktioniert)
  thorns:       { name: 'Dornenranke',    element: 'NATURE',   dmgScale: 1.4, type: 'MAGIC',    cd: 3, desc: 'Schlingpflanzen greifen an (140% AP)' },
  
  // ELEMENT: WIND
  gust:         { name: 'Windstoß',       element: 'WIND',     dmgScale: 1.3, type: 'MAGIC',    cd: 2, desc: 'Schneller Windangriff (130% AP)' },
  
  // ELEMENT: EARTH
  smash:        { name: 'Erdschlag',      element: 'EARTH',    dmgScale: 1.2, type: 'PHYSICAL', cd: 2, desc: 'Ein schwerer Schlag (120% AD)' },
  
  // ELEMENT: ICE
  icicle:       { name: 'Eissplitter',    element: 'ICE',      dmgScale: 1.4, type: 'MAGIC',    cd: 3, desc: 'Scharfe Eiskristalle (140% AP)' },
  
  // ELEMENT: ELECTRIC
  thundershock: { name: 'Donnerschock',   element: 'ELECTRIC', dmgScale: 1.4, type: 'MAGIC',    cd: 3, desc: 'Elektrischer Schlag (140% AP)' },
  
  // ELEMENT: LIGHT
  solarbeam:    { name: 'Solarstrahl',    element: 'LIGHT',    dmgScale: 1.8, type: 'MAGIC',    cd: 4, desc: 'Gebündeltes Licht (180% AP)' },
  
  // ELEMENT: DARK
  bite:         { name: 'Knirscher',      element: 'DARK',     dmgScale: 1.4, type: 'PHYSICAL', cd: 3, desc: 'Starker Biss aus dem Schatten (140% AD)' },
  
  // ELEMENT: GHOST
  shadowball:   { name: 'Spukball',       element: 'GHOST',    dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Geisterhafte Energie (150% AP)' },
  
  // ELEMENT: MAGIC
  arcanepulse:  { name: 'Arkaner Puls',   element: 'MAGIC',    dmgScale: 1.6, type: 'MAGIC',    cd: 4, desc: 'Reine Magie-Energie (160% AP)' },
  
  // ELEMENT: PSYCHIC
  psybeam:      { name: 'Psi-Welle',      element: 'PSYCHIC',  dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Mentale Attacke (150% AP)' },
  
  // ELEMENT: FIGHTING
  punch:        { name: 'Karatehieb',     element: 'FIGHTING', dmgScale: 1.5, type: 'PHYSICAL', cd: 2, desc: 'Gezielter Kampfsport-Hieb (150% AD)' },
  
  // ELEMENT: METAL
  ironhead:     { name: 'Eisenschädel',   element: 'METAL',    dmgScale: 1.3, type: 'PHYSICAL', cd: 3, desc: 'Harter Kopfstoß (130% AD)' },
  
  // ELEMENT: ROCK
  rockslide:    { name: 'Steinhagel',     element: 'ROCK',     dmgScale: 1.4, type: 'PHYSICAL', cd: 3, desc: 'Felsbrocken fallen herab (140% AD)' },
  
  // ELEMENT: POISON
  sludge:       { name: 'Matschbombe',    element: 'POISON',   dmgScale: 1.3, type: 'MAGIC',    cd: 3, desc: 'Giftiger Schlamm (130% AP)' },
  
  // ELEMENT: DRAGON
  dragonbreath: { name: 'Drachenodem',    element: 'DRAGON',   dmgScale: 1.7, type: 'MAGIC',    cd: 4, desc: 'Mystisches Drachenfeuer (170% AP)' },
  
  // ELEMENT: FAIRY
  moonblast:    { name: 'Mondgewalt',     element: 'FAIRY',    dmgScale: 1.6, type: 'MAGIC',    cd: 3, desc: 'Kraft des Mondes (160% AP)' },
  
  // ELEMENT: TECH
  laser:        { name: 'Laserstrahl',    element: 'TECH',     dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Cybernetischer Laser (150% AP)' },
  
  // ELEMENT: SOUND
  sonicboom:    { name: 'Schallmauer',    element: 'SOUND',    dmgScale: 1.3, type: 'MAGIC',    cd: 2, desc: 'Durchbricht die Schallmauer (130% AP)' },
  
  // ELEMENT: TIME
  timewarp:     { name: 'Zeitsprung',     element: 'TIME',     dmgScale: 1.6, type: 'MAGIC',    cd: 4, desc: 'Verwirrt durch Zeitrisse (160% AP)' },
  
  // ELEMENT: SPACE
  meteorshower: { name: 'Meteorfall',     element: 'SPACE',    dmgScale: 1.8, type: 'MAGIC',    cd: 5, desc: 'Objekte aus dem All (180% AP)' },
  
  // ELEMENT: VOID
  voidblast:    { name: 'Leereblick',     element: 'VOID',     dmgScale: 2.0, type: 'MAGIC',    cd: 5, desc: 'Schaden aus der Leere (200% AP)' },
  
  // ELEMENT: CHAOS
  chaosstrike:  { name: 'Chaosklinge',    element: 'CHAOS',    dmgScale: 1.7, type: 'PHYSICAL', cd: 4, desc: 'Unberechenbarer Angriff (170% AD)' },
  
  // ELEMENT: ORDER
  judgement:    { name: 'Urteilsspruch',  element: 'ORDER',    dmgScale: 1.7, type: 'MAGIC',    cd: 4, desc: 'Göttliche Ordnung (170% AP)' },
};

// src/data/gameData.jsx (Füge das am Ende hinzu)

// src/data/gameData.jsx (Am Ende der Datei einfügen)

// --- Quest Konstanten (Füge dies am Ende der Datei hinzu oder ersetze die alten Blöcke) ---

export const QUEST_TYPES = {
  WIN_PVP: 'WIN_PVP',
  HATCH_EGG: 'HATCH_EGG',
  BREED_PET: 'BREED_PET',
  SPEND_COINS: 'SPEND_COINS',
  EARN_XP: 'EARN_XP'
};

// Vorlagen für Aufgaben (Einzelbelohnungen bringen jetzt NUR XP)
export const QUEST_TEMPLATES = [
  // HOHER WERT (Kernaktivitäten)
  { type: QUEST_TYPES.WIN_PVP,     label: "Gewinne Kämpfe",           baseAmount: 1,  rewardType: 'XP', rewardBase: 100 },    
  { type: QUEST_TYPES.HATCH_EGG,   label: "Brüte Eier aus",           baseAmount: 1,  rewardType: 'XP',  rewardBase: 150 },   
  { type: QUEST_TYPES.BREED_PET,   label: "Züchte neue Pets",         baseAmount: 1,  rewardType: 'XP', rewardBase: 200 },    
  
  // NIEDRIGER WERT (Einfache Aktivitäten)
  { type: QUEST_TYPES.SPEND_COINS, label: "Gib Münzen aus",           baseAmount: 500,rewardType: 'XP',    rewardBase: 50 },    
  { type: QUEST_TYPES.EARN_XP,     label: "Sammle Erfahrungspunkte",  baseAmount: 100,rewardType: 'XP', rewardBase: 75 },    
];

// Belohnungen für das Abschließen des Gesamtbalkens (Bleiben unverändert)
export const COMPOSITE_QUEST_REWARDS = {
    DAILY: { rewardType: 'GEMS', rewardAmount: 5, label: "Tages-Bonus" },
    WEEKLY: { rewardType: 'EGG_EPIC', rewardAmount: 1, label: "Wochen-Truhe" },
    MONTHLY: { rewardType: 'COINS', rewardAmount: 10000, label: "Monats-Schatz" }
};
// src/data/gameData.jsx (Am Ende hinzufügen)
export const SHOP_ITEMS = {
    TICKET_BUNDLE_COINS: { costCurrency: 'COINS', costAmount: 500, tickets: 1, label: "1 Zucht-Ticket" },
    TICKET_BUNDLE_GEMS: { costCurrency: 'GEMS', costAmount: 10, tickets: 5, label: "5 Zucht-Tickets" },
    AD_REWARD_ENERGY: { rewardType: 'ENERGY', rewardAmount: 3, label: "3 Energie" }
};