import React, { useState, useEffect } from 'react';

import { 

  Play, Settings, User, LogOut, 

  Volume2, VolumeX, Coins, Gem, 

  Trophy, Star, Shield, Zap, 

  Swords, Heart, Dna, Egg, ArrowLeft, Skull, Info, XCircle,

  Flame, Droplets, Leaf, Activity, Target, Sparkles, Timer,

  Wind, Mountain, Sun, Moon, Ghost, Snowflake, Hexagon, 

  Box, Clock, Orbit, CloudFog, Gavel, Cpu, TestTube, Cross,

  AlertTriangle, Eye, Anchor, Music, Aperture, ChevronsUp, Gift,

  Users, Lock, Plus, Trash2, AlertCircle, CheckCircle2, Hourglass,

  LayoutGrid, ThermometerSun, RefreshCw, Edit3, Backpack, X, BatteryCharging,

  ShoppingBag, Package, BoxSelect, Store, Tag, DollarSign, Filter, SlidersHorizontal,

  TrendingUp, TrendingDown, BarChart3, Percent, Copy, UserPlus, UserCheck

} from 'lucide-react';



// ==========================================

// 1. KONFIGURATION & DATEN

// ==========================================



const DUMMY_USERS = [

    { id: 'ash_ketchum', username: 'AshKetchum', rating: 2800, level: 25, avatar: '🧢', stats: { pvpWins: 150, pvpTotal: 200, hatched: 50, bred: 10, marketSpent: 5000, marketEarned: 2000 } },

    { id: 'gary_oak', username: 'GaryOak', rating: 2750, level: 24, avatar: '😼', stats: { pvpWins: 140, pvpTotal: 190, hatched: 45, bred: 8, marketSpent: 4000, marketEarned: 5000 } },

    { id: 'misty_water', username: 'Misty', rating: 1400, level: 15, avatar: '🌊', stats: { pvpWins: 40, pvpTotal: 80, hatched: 20, bred: 5, marketSpent: 500, marketEarned: 1200 } },

    { id: 'brock_rock', username: 'Brock', rating: 1350, level: 18, avatar: '🪨', stats: { pvpWins: 35, pvpTotal: 70, hatched: 15, bred: 2, marketSpent: 200, marketEarned: 500 } },

];



const DUMMY_LEADERBOARD = [

    ...DUMMY_USERS,

    { id: 'p4', username: 'TeamRocket', rating: 1500, avatar: '🚀' },

    { id: 'p5', username: 'YoungsterJoey', rating: 900, avatar: '🐀' },

    { id: 'p6', username: 'BugCatcher', rating: 850, avatar: '🐛' },

    { id: 'p7', username: 'ProGamer2024', rating: 1200, avatar: '🎮' },

    { id: 'p8', username: 'NoobMaster69', rating: 1050, avatar: '🍄' },

];



const RARITIES = {

  COMMON:       { id: 1, label: 'Gewöhnlich',   color: 'text-slate-400',   bg: 'bg-slate-500',   border: 'border-slate-400',   multi: 1.0, hatchDuration: 10, dropChance: 40.0 },

  UNCOMMON:     { id: 2, label: 'Ungewöhnlich', color: 'text-green-400',   bg: 'bg-green-600',   border: 'border-green-500',   multi: 1.2, hatchDuration: 30, dropChance: 25.0 },

  RARE:         { id: 3, label: 'Selten',       color: 'text-blue-400',    bg: 'bg-blue-600',    border: 'border-blue-500',    multi: 1.5, hatchDuration: 60, dropChance: 15.0 },

  EPIC:         { id: 4, label: 'Episch',       color: 'text-purple-400',  bg: 'bg-purple-600',  border: 'border-purple-500',  multi: 1.8, hatchDuration: 120, dropChance: 10.0 },

  LEGENDARY:    { id: 5, label: 'Legendär',     color: 'text-amber-400',   bg: 'bg-amber-600',   border: 'border-amber-500',   multi: 2.2, hatchDuration: 300, dropChance: 6.0 },

  MYTHIC:       { id: 6, label: 'Mythisch',     color: 'text-red-500',     bg: 'bg-red-700',     border: 'border-red-600',     multi: 2.8, hatchDuration: 600, dropChance: 3.0 },

  DIVINE:       { id: 7, label: 'Göttlich',     color: 'text-cyan-300',    bg: 'bg-cyan-600',    border: 'border-cyan-400',    multi: 3.5, hatchDuration: 1200, dropChance: 0.7 },

  ANCIENT:      { id: 8, label: 'Uralt',        color: 'text-stone-400',   bg: 'bg-stone-600',   border: 'border-stone-400',   multi: 4.5, hatchDuration: 3600, dropChance: 0.24 },

  COSMIC:       { id: 9, label: 'Kosmisch',     color: 'text-fuchsia-400', bg: 'bg-fuchsia-800', border: 'border-fuchsia-500', multi: 6.0, hatchDuration: 7200, dropChance: 0.05 },

  TRANSCENDENT: { id: 10,label: 'Transzendent', color: 'text-rose-300',    bg: 'bg-rose-900',    border: 'border-rose-400',    multi: 10.0, hatchDuration: 14400, dropChance: 0.01 },

};



const TYPES = {

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



const ZODIAC_ANIMALS = {

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



const TYPE_ADVANTAGES = {

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



const ABILITIES = {

  fireball:  { name: 'Feuerball',      element: 'FIRE',     dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Schießt einen mächtigen Feuerball (150% AP)' },

  heal:      { name: 'Erholung',       element: 'NATURE',   dmgScale: 0,   type: 'HEAL',     cd: 4, desc: 'Heilt sich selbst um 120% AP' },

  smash:     { name: 'Erdschlag',      element: 'EARTH',    dmgScale: 1.2, type: 'PHYSICAL', cd: 2, desc: 'Ein schwerer Schlag (120% AD)' },

  aqua:      { name: 'Wasserstrahl',   element: 'WATER',    dmgScale: 1.3, type: 'MAGIC',    cd: 3, desc: 'Magischer Wasserstrahl (130% AP)' },

  bite:      { name: 'Knirscher',      element: 'DARK',     dmgScale: 1.4, type: 'PHYSICAL', cd: 3, desc: 'Starker Biss (140% AD)' },

  voidblast: { name: 'Leereblick',     element: 'VOID',     dmgScale: 2.0, type: 'MAGIC',    cd: 5, desc: 'Schaden aus der Leere (200% AP)' },

  timewarp:  { name: 'Zeitsprung',     element: 'TIME',     dmgScale: 1.6, type: 'MAGIC',    cd: 4, desc: 'Verwirrt durch Zeit (160% AP)' },

  laser:     { name: 'Laserstrahl',    element: 'TECH',     dmgScale: 1.5, type: 'MAGIC',    cd: 3, desc: 'Cybernetischer Laser (150% AP)' },

  thundershock:{ name: 'Donnerschock', element: 'ELECTRIC', dmgScale: 1.4, type: 'MAGIC',    cd: 3, desc: 'Elektrischer Schlag (140% AP)' },

  gust:      { name: 'Windstoß',       element: 'WIND',     dmgScale: 1.3, type: 'MAGIC',    cd: 2, desc: 'Schneller Windangriff (130% AP)' },

  punch:     { name: 'Karatehieb',     element: 'FIGHTING', dmgScale: 1.5, type: 'PHYSICAL', cd: 2, desc: 'Gezielter Schlag (150% AD)' },

};



// ==========================================

// 2. HELPER FUNKTIONEN

// ==========================================



const calculateEloChange = (playerRating, enemyRating, isWin) => {

    const K = 32;

    const expectedScore = 1 / (1 + Math.pow(10, (enemyRating - playerRating) / 400));

    const actualScore = isWin ? 1 : 0;

    return Math.round(K * (actualScore - expectedScore));

};



const getDamageMultiplier = (atkType, defType) => {

  if (!atkType || !defType) return 1.0;

  const advantages = TYPE_ADVANTAGES[atkType] || { strong: [], super: [] };

  if (advantages.super?.includes(defType)) return 4.0;

  if (advantages.strong?.includes(defType)) return 2.0;

  const defAdvantages = TYPE_ADVANTAGES[defType] || { strong: [], super: [] };

  if (defAdvantages.super?.includes(atkType)) return 0.25;

  if (defAdvantages.strong?.includes(atkType)) return 0.5;

  return 1.0;

};



const determineRarity = (boxType = 'STANDARD') => {

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



const calculateStatValue = (base, level) => {

    const val = Math.floor(base * (1 + (level - 1) * 0.1));

    return Math.max(1, val); 

};



const generatePet = (level = 1, fixedType = null, rarityKey = null, inheritedStats = null, source = 'SHOP') => {

  const typeKeys = Object.keys(TYPES);

  const type = fixedType || typeKeys[Math.floor(Math.random() * typeKeys.length)];

  

  let rarity = rarityKey;

  if (!rarity) {

     rarity = 'COMMON';

  }

  

  const mult = RARITIES[rarity].multi;

  

  const genBase = (val) => {

      if (inheritedStats) return inheritedStats; 

      const raw = val * mult; 

      return Math.max(1, Math.floor(raw + (Math.random() * raw * 0.2))); 

  };



  const abilityKeys = Object.keys(ABILITIES);

  const abilityKey = abilityKeys[Math.floor(Math.random() * abilityKeys.length)];



  const prefixes = { 

    FIRE: 'Pyro', WATER: 'Aqua', NATURE: 'Terra', WIND: 'Aero', EARTH: 'Geo',

    ICE: 'Frost', ELECTRIC: 'Volt', LIGHT: 'Lumen', DARK: 'Umbra', GHOST: 'Phantom',

    MAGIC: 'Arcan', PSYCHIC: 'Mind', FIGHTING: 'Brawl', METAL: 'Ferrum', ROCK: 'Petra',

    POISON: 'Venom', DRAGON: 'Draco', FAIRY: 'Pixie', TECH: 'Cyber', SOUND: 'Sonic',

    TIME: 'Chrono', SPACE: 'Astro', VOID: 'Null', CHAOS: 'Havoc', ORDER: 'Law'

  };

  const suffixes = ['mon', 'zor', 'tros', 'nix', 'a', 'os', 'king', 'lord', 'god', 'soul'];

  const baseName = (prefixes[type] || 'Mono') + suffixes[Math.floor(Math.random() * suffixes.length)];



  // Species Logic (Zodiac)

  const speciesKeys = Object.keys(ZODIAC_ANIMALS);

  const speciesKey = speciesKeys[Math.floor(Math.random() * speciesKeys.length)];



  let b_hp, b_atk, b_ap, b_def, b_res, b_speed;



  if (inheritedStats) {

      b_hp = inheritedStats.hp;

      b_atk = inheritedStats.atk;

      b_ap = inheritedStats.ap;

      b_def = inheritedStats.def;

      b_res = inheritedStats.res;

      b_speed = inheritedStats.speed;

  } else {

      b_hp = genBase(5);

      b_atk = genBase(1.5);

      b_ap = genBase(1.5);

      b_def = genBase(1.0);

      b_res = genBase(1.0);

      b_speed = genBase(1.0);

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



const getUnlockedTeamSlots = (level) => Math.min(10, 1 + Math.floor(level / 10));



const getUnlockedHatcherySlots = (level) => {

  if (level < 15) return 1;

  return Math.min(10, 2 + Math.floor((level - 15) / 10));

};



const getMaxEnergy = (level) => {

  return 10 + ((level - 1) * 2);

};



// ==========================================

// 3. UI SUB-KOMPONENTEN

// ==========================================



function HeaderHUD({ user }) {

  const xpPercent = Math.min(100, (user.xp / user.xpToNextLevel) * 100);

  const maxEnergy = getMaxEnergy(user.level);

  

  const msPerEnergy = 1000 * 60 * 60; 

  const timeSinceUpdate = Date.now() - user.lastEnergyUpdate;

  const nextEnergyIn = Math.max(0, msPerEnergy - timeSinceUpdate);

  const minutesLeft = Math.ceil(nextEnergyIn / 1000 / 60);



  const [, setTick] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => setTick(t => t + 1), 60000); 

    return () => clearInterval(interval);

  }, []);



  return (

    <header className="bg-slate-800/90 backdrop-blur-md p-3 border-b border-white/5 z-20">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-2">

            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-lg border border-white/10 relative overflow-hidden flex-shrink-0">

            {user.avatar}

            <div className="absolute bottom-0 left-0 h-1 bg-green-400" style={{width: `${xpPercent}%`}}></div>

            </div>

            <div className="hidden sm:block">

            <div className="text-xs text-slate-400 font-bold uppercase">Lvl {user.level}</div>

            <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-0.5 overflow-hidden">

                <div className="h-full bg-green-400" style={{width: `${xpPercent}%`}}></div>

            </div>

            </div>

        </div>

        <div className="flex gap-2 flex-wrap justify-end">

            <div className="relative flex flex-col items-center justify-center group">

                <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-white/10">

                    <Zap className={`w-3.5 h-3.5 ${user.energy > 0 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />

                    <span className="font-bold text-xs">{user.energy}/{maxEnergy}</span>

                </div>

                {user.energy < maxEnergy && (

                    <span className="absolute -bottom-2.5 text-[8px] text-slate-400 font-mono bg-slate-900/80 px-1 rounded whitespace-nowrap z-10">

                        {minutesLeft}m

                    </span>

                )}

            </div>

            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-white/10">

                <Coins className="w-3.5 h-3.5 text-yellow-400 fill-current" />

                <span className="font-bold text-xs">{user.coins}</span>

            </div>

            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-white/10">

                <Gem className="w-3.5 h-3.5 text-pink-500 fill-current" />

                <span className="font-bold text-xs">{user.gems}</span>

            </div>

        </div>

      </div>

    </header>

  );

}



function BottomNav({ currentView, setCurrentView }) {

  if (currentView === 'battle' || currentView === 'auth') return null;

  return (

    <nav className="bg-slate-800 border-t border-white/10 px-6 py-4 pb-8"><ul className="flex justify-around items-center"><li><button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center gap-1 ${currentView === 'profile' ? 'text-indigo-400' : 'text-slate-500'}`}><User className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Profil</span></button></li><li className="-mt-8"><button onClick={() => setCurrentView('menu')} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${['menu', 'arena-hub', 'pet-hub', 'shop', 'marketplace', 'leaderboard'].includes(currentView) ? 'bg-indigo-600 text-white ring-4 ring-slate-900 shadow-indigo-500/40' : 'bg-slate-700 text-slate-400 ring-4 ring-slate-900'}`}><LayoutGrid className="w-8 h-8 ml-1" /></button></li><li><button onClick={() => setCurrentView('settings')} className={`flex flex-col items-center gap-1 ${currentView === 'settings' ? 'text-indigo-400' : 'text-slate-500'}`}><Settings className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Optionen</span></button></li></ul></nav>

  );

}



function MenuCard({ icon: Icon, title, color, onClick }) {

  return (

    <button onClick={onClick} className="bg-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-750 border border-white/5 active:scale-95 transition-all">

      <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white shadow-lg`}><Icon className="w-5 h-5 fill-current" /></div>

      <span className="font-bold text-xs text-slate-300">{title}</span>

    </button>

  );

}



function SettingRow({ icon: Icon, label, active, onToggle }) {

  return (

    <div className="flex items-center justify-between p-4 border-b border-white/5 cursor-pointer hover:bg-white/5" onClick={onToggle}>

      <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-slate-400" /><span className="font-medium">{label}</span></div>

      <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${active ? 'bg-indigo-500' : 'bg-slate-700'}`}><div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} /></div>

    </div>

  );

}



const TeamDots = ({ team, currentIndex, isEnemy }) => (

  <div className={`flex gap-1 mb-2 ${isEnemy ? 'justify-end' : 'justify-start'}`}>

    {team.map((p, i) => (

      <div key={i} className={`w-2 h-2 rounded-full ${i < currentIndex ? 'bg-slate-700' : i === currentIndex ? (isEnemy ? 'bg-red-500' : 'bg-indigo-500') : 'bg-slate-500'}`} />

    ))}

  </div>

);



function BattleUnit({ pet, isEnemy, isActive, animating }) {

  const typeInfo = TYPES[pet.type];

  const secTypeInfo = pet.secondaryType ? TYPES[pet.secondaryType] : null;

  const hpPercent = (pet.hp / pet.maxHp) * 100;

  return (

    <div className={`flex flex-col ${isEnemy ? 'items-end' : 'items-start'}`}>

      <div className={`w-24 h-24 ${typeInfo.bg} rounded-2xl flex items-center justify-center text-4xl shadow-2xl relative z-10 border-4 ${isActive ? 'border-white scale-110' : 'border-transparent'} transition-all duration-300 ${animating && isActive ? (isEnemy ? '-translate-x-8' : 'translate-x-8') : ''}`}>

        {ZODIAC_ANIMALS[pet.species].icon}

        {secTypeInfo && (

            <div className={`absolute top-0 right-0 w-8 h-8 ${secTypeInfo.bg} rounded-full border-2 border-slate-900 flex items-center justify-center text-xs shadow-md -mr-2 -mt-2`}>

                {secTypeInfo.icon}

            </div>

        )}

        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-1"><Zap className={`w-3 h-3 ${pet.currentCd > 0 ? 'text-slate-500' : 'text-yellow-400'}`} />{pet.currentCd > 0 ? pet.currentCd : 'RDY'}</div>

      </div>

      <div className={`bg-slate-800 p-2 rounded-lg border border-white/10 w-48 mt-2 shadow-lg transition-all ${isActive ? 'scale-105' : 'opacity-80'}`}>

          <div className="flex justify-between items-center mb-1">

              <span className={`font-bold text-xs ${isEnemy ? 'text-red-300' : 'text-indigo-300'}`}>{pet.name}</span>

              <div className="flex gap-1">

                  <span className="text-[8px] font-bold text-slate-400 mr-1">{ZODIAC_ANIMALS[pet.species].label}</span>

                  <div className={`text-[8px] font-bold ${TYPES[pet.type].color}`}>{TYPES[pet.type].label}</div>

                  {pet.secondaryType && <div className={`text-[8px] font-bold ${TYPES[pet.secondaryType].color}`}>/{TYPES[pet.secondaryType].label}</div>}

              </div>

          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1"><div className={`h-full transition-all duration-300 ${hpPercent < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${hpPercent}%` }}></div></div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono"><span>{pet.hp}/{pet.maxHp} HP</span><span>ATK {pet.atk}</span></div>

      </div>

    </div>

  );

}



function LevelUpModal({ level, onClose }) {

  return (

    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">

      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-400 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(99,102,241,0.5)] max-w-sm w-full relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent animate-pulse"></div>

        <div className="relative z-10"><div className="inline-block mb-4 p-4 rounded-full bg-indigo-500 shadow-xl shadow-indigo-500/40"><ChevronsUp className="w-12 h-12 text-white" /></div><h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white mb-2">LEVEL UP!</h2><p className="text-indigo-200 font-bold text-lg mb-6">Du bist jetzt Level {level}</p><div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10"><h3 className="text-xs uppercase font-bold text-slate-400 mb-3">Belohnungen</h3><div className="flex justify-center gap-4"><div className="flex flex-col items-center"><Coins className="w-6 h-6 text-yellow-400 mb-1" /><span className="font-bold">+1000</span></div><div className="flex flex-col items-center"><Gem className="w-6 h-6 text-pink-500 mb-1" /><span className="font-bold">+5</span></div><div className="flex flex-col items-center"><BatteryCharging className="w-6 h-6 text-yellow-400 mb-1" /><span className="font-bold">Energie+</span></div></div></div><button onClick={onClose} className="w-full bg-white text-indigo-900 font-black py-4 rounded-xl hover:bg-indigo-50 transition-colors active:scale-95 shadow-lg">WEITER</button></div>

      </div>

    </div>

  );

}



function LootboxModal({ pet, onClose }) {

  const [isOpening, setIsOpening] = useState(true);

  const [flash, setFlash] = useState(false);

  

  useEffect(() => {

      const timer1 = setTimeout(() => setFlash(true), 2000);

      const timer2 = setTimeout(() => setIsOpening(false), 2500);

      return () => { clearTimeout(timer1); clearTimeout(timer2); };

  }, []);



  if (isOpening) {

      return (

        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">

            <div className="relative flex flex-col items-center justify-center">

                {flash && <div className="absolute inset-0 bg-white animate-ping duration-500 rounded-full opacity-50 scale-150"></div>}

                <div className={`w-48 h-48 bg-slate-800 rounded-3xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)] flex items-center justify-center animate-bounce`}>

                    <Package className="w-24 h-24 text-yellow-500" />

                </div>

                <p className="text-white mt-8 font-black text-xl tracking-widest animate-pulse">ÖFFNE...</p>

            </div>

        </div>

      )

  }



  const rarity = RARITIES[pet.rarity];



  return (

    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in duration-500">

        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-white/20 w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">

             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${rarity.bg} blur-[100px] opacity-50 animate-spin-slow`}></div>

             <div className="relative z-10">

                <h2 className="text-3xl font-black text-white mb-2 tracking-wide">GEFUNDEN!</h2>

                <div className="my-8 relative">

                    <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-4 border-white/20 shadow-2xl">

                        {ZODIAC_ANIMALS[pet.species].icon}

                    </div>

                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase ${rarity.bg} text-white shadow-lg`}>{rarity.label}</div>

                </div>

                <div className="bg-black/40 rounded-xl p-4 mb-6">

                    <p className="text-slate-300 text-sm">Du hast ein Ei der Seltenheit <span className={rarity.color}>{rarity.label}</span> erhalten!</p>

                    <div className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-wider">

                        Herkunft: {pet.source === 'BREEDING' ? '🧬 Zuchtprogramm' : '🛍️ Marktplatz Fund'}

                    </div>

                </div>

                <button onClick={onClose} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:scale-105 transition-transform shadow-lg">EINSAMMELN</button>

             </div>

        </div>

    </div>

  );

}



// ==========================================

// 4. SCREEN KOMPONENTEN

// ==========================================



function AuthScreen({ onLogin }) {

  const [username, setUsername] = useState('');

  return (

    <div className="flex flex-col h-screen bg-slate-900 text-white p-8 justify-center items-center text-center">

      <div className="w-32 h-32 bg-indigo-600 rounded-3xl mb-8 flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3"><Egg className="w-16 h-16 text-white" /></div>

      <h1 className="text-4xl font-black mb-2">MONSTER<br/>EVOLUTION</h1>

      <p className="text-slate-400 mb-8">RPG Edition</p>

      <input type="text" placeholder="Dein Spielername" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 text-center font-bold focus:border-indigo-500 outline-none" />

      <button onClick={() => onLogin(username)} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-4 rounded-xl mb-4 shadow-lg transition-all active:scale-95">STARTEN</button>

      <button onClick={() => onLogin('Gast', true)} className="text-slate-500 text-sm font-bold">Als Gast spielen</button>

    </div>

  );

}



function MainMenu({ user, onArena, onPetHub, onShop, onMarketplace, onLeaderboard }) {

  return (

    <div className="space-y-8 pt-8 text-center h-full flex flex-col">

      <div>

          <h2 className="text-3xl font-black">Willkommen,</h2>

          <h3 className="text-2xl font-black text-indigo-400">{user.username}</h3>

      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 px-4">

          <button onClick={onArena} className="group relative bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-3xl shadow-xl shadow-red-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-red-400/50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">ARENA HUB</h3><p className="text-red-100 text-xs font-bold">Kämpfe & Team</p></div><Swords className="w-12 h-12 text-white fill-white/20" /></div>

          </button>

          <button onClick={onPetHub} className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-3xl shadow-xl shadow-emerald-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-emerald-400/50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">PET HUB</h3><p className="text-emerald-100 text-xs font-bold">Sammlung & Zucht</p></div><Egg className="w-12 h-12 text-white fill-white/20" /></div>

          </button>

          <button onClick={onMarketplace} className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-3xl shadow-xl shadow-cyan-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-cyan-400/50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">MARKTPLATZ</h3><p className="text-cyan-100 text-xs font-bold">Kaufen & Verkaufen</p></div><Store className="w-12 h-12 text-white fill-white/20" /></div>

          </button>

          <button onClick={onShop} className="group relative bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-3xl shadow-xl shadow-amber-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-amber-400/50">

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">SHOP</h3><p className="text-amber-100 text-xs font-bold">Lootboxen & Mehr</p></div><ShoppingBag className="w-12 h-12 text-white fill-white/20" /></div>

          </button>

      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pb-4"><MenuCard icon={Star} title="Daily Reward" color="bg-amber-500" /><MenuCard icon={Trophy} title="Bestenliste" color="bg-indigo-500" onClick={onLeaderboard} /></div>

    </div>

  );

}



function LeaderboardScreen({ user, onBack }) {

    const allPlayers = [

        ...DUMMY_LEADERBOARD,

        { id: user.id, username: user.username, rating: user.rating, avatar: '😎', isMe: true }

    ].sort((a, b) => b.rating - a.rating);



    return (

        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">

            <div className="flex items-center gap-2 mb-2">

                <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>

                <h2 className="text-2xl font-black italic text-yellow-400">BESTENLISTE</h2>

            </div>



            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-2 text-center">

                <div className="text-xs text-slate-400 uppercase font-bold">Dein Rang</div>

                <div className="text-3xl font-black text-white">#{allPlayers.findIndex(p => p.isMe) + 1}</div>

                <div className="text-sm text-indigo-400 font-bold">{user.rating} Elo</div>

            </div>



            <div className="flex-1 overflow-y-auto pb-20 space-y-2">

                {allPlayers.map((player, index) => (

                    <div 

                        key={player.id} 

                        className={`flex items-center justify-between p-3 rounded-xl border ${player.isMe ? 'bg-indigo-900/40 border-indigo-500' : 'bg-slate-800 border-white/5'}`}

                    >

                        <div className="flex items-center gap-4">

                            <div className={`w-8 h-8 flex items-center justify-center font-black ${index < 3 ? 'text-yellow-400 text-xl' : 'text-slate-500'}`}>

                                {index + 1}

                            </div>

                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">

                                {player.avatar}

                            </div>

                            <div>

                                <div className={`font-bold ${player.isMe ? 'text-indigo-300' : 'text-white'}`}>

                                    {player.username} {player.isMe && '(Du)'}

                                </div>

                                <div className="text-xs text-slate-400">Spieler</div>

                            </div>

                        </div>

                        <div className="flex items-center gap-1 font-mono font-bold text-yellow-500">

                            <Trophy className="w-4 h-4" />

                            {player.rating}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}



function MarketplaceScreen({ user, listings, onBack, onBuy, onSell, myPets }) {

    const [activeTab, setActiveTab] = useState('buy'); 

    const [sellPrice, setSellPrice] = useState('');

    const [selectedForSale, setSelectedForSale] = useState(null);

    const [filterRarity, setFilterRarity] = useState('ALL');

    const [filterType, setFilterType] = useState('ALL');

    const [minPrice, setMinPrice] = useState('');

    const [maxPrice, setMaxPrice] = useState('');

    const [showFilters, setShowFilters] = useState(false);



    const handleSellSubmit = () => {

        if (!selectedForSale || !sellPrice || isNaN(sellPrice) || sellPrice <= 0) return;

        onSell(selectedForSale.id, parseInt(sellPrice));

        setSelectedForSale(null);

        setSellPrice('');

    }



    const sellablePets = myPets.filter(p => !user.team.includes(p.id) && p.hatchAt === 0);



    const filteredListings = listings.filter(listing => {

        if (filterRarity !== 'ALL' && listing.pet.rarity !== filterRarity) return false;

        if (filterType !== 'ALL' && listing.pet.type !== filterType) return false;

        if (minPrice !== '' && listing.price < parseInt(minPrice)) return false;

        if (maxPrice !== '' && listing.price > parseInt(maxPrice)) return false;

        return true;

    });



    const resetFilters = () => {

        setFilterRarity('ALL'); 

        setFilterType('ALL'); 

        setMinPrice(''); 

        setMaxPrice('');

    }



    return (

        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">

            <div className="flex items-center gap-2 mb-2">

                <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>

                <h2 className="text-2xl font-black italic text-cyan-400">MARKTPLATZ</h2>

            </div>



            <div className="flex justify-between items-center">

                <div className="flex p-1 bg-slate-800 rounded-xl flex-1 mr-2">

                    <button onClick={() => setActiveTab('buy')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'buy' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>KAUFEN</button>

                    <button onClick={() => setActiveTab('sell')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'sell' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>VERKAUFEN</button>

                </div>

                {activeTab === 'buy' && (

                    <button 

                        onClick={() => setShowFilters(!showFilters)} 

                        className={`p-3 rounded-xl border transition-colors ${showFilters ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400'}`}

                    >

                        <Filter className="w-5 h-5" />

                    </button>

                )}

            </div>



            {activeTab === 'buy' && showFilters && (

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3 animate-in slide-in-from-top-2">

                    <div className="grid grid-cols-2 gap-3">

                        <div className="space-y-1">

                            <label className="text-[10px] font-bold text-slate-500 uppercase">Seltenheit</label>

                            <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500">

                                <option value="ALL">Alle</option>

                                {Object.keys(RARITIES).map(key => (<option key={key} value={key}>{RARITIES[key].label}</option>))}

                            </select>

                        </div>

                        <div className="space-y-1">

                            <label className="text-[10px] font-bold text-slate-500 uppercase">Typ</label>

                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500">

                                <option value="ALL">Alle</option>

                                {Object.keys(TYPES).map(key => (<option key={key} value={key}>{TYPES[key].label}</option>))}

                            </select>

                        </div>

                    </div>

                    <div className="space-y-1">

                        <label className="text-[10px] font-bold text-slate-500 uppercase">Preis</label>

                        <div className="flex gap-2 items-center">

                            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500" />

                            <span className="text-slate-500">-</span>

                            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500" />

                        </div>

                    </div>

                    <button onClick={resetFilters} className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">

                        <X className="w-3 h-3" /> Filter zurücksetzen

                    </button>

                </div>

            )}



            <div className="flex-1 overflow-y-auto pb-20">

                {activeTab === 'buy' ? (

                    <div className="grid grid-cols-1 gap-3">

                        {filteredListings.length === 0 ? (

                            <div className="text-center text-slate-500 py-20">

                                <Store className="w-12 h-12 mx-auto mb-2 opacity-30" />

                                <p>Keine Angebote gefunden.</p>

                            </div>

                        ) : (

                            filteredListings.map(listing => {

                                const rarity = RARITIES[listing.pet.rarity];

                                return (

                                    <div key={listing.id} className="bg-slate-800 p-3 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden">

                                        <div className={`w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-3xl shadow-inner ${TYPES[listing.pet.type].bgLight}`}>

                                            {listing.pet.isEgg ? <Egg className={rarity.color} /> : ZODIAC_ANIMALS[listing.pet.species].icon}

                                        </div>

                                        <div className="flex-1">

                                            <div className="flex justify-between items-start">

                                                <div>

                                                    <h3 className="font-bold">{listing.pet.name}</h3>

                                                    <span className={`text-[10px] ${rarity.color} font-bold uppercase`}>{rarity.label} {listing.pet.isEgg ? 'Ei' : 'Pet'}</span>

                                                </div>

                                                <div className="text-right">

                                                    <div className="text-xs text-slate-400">Verkäufer</div>

                                                    <div className="text-xs font-bold">{listing.sellerName}</div>

                                                </div>

                                            </div>

                                            <button onClick={() => onBuy(listing.id)} className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg flex items-center justify-center gap-2 text-xs active:scale-95 transition-transform">

                                                <Coins className="w-3 h-3" /> {listing.price} Kaufen

                                            </button>

                                        </div>

                                    </div>

                                );

                            })

                        )}

                    </div>

                ) : (

                    <div className="space-y-4">

                        {selectedForSale && (

                            <div className="bg-slate-800 border border-green-500/30 p-4 rounded-2xl mb-4 animate-in fade-in">

                                <h3 className="font-bold mb-2 text-green-400">Verkaufen: {selectedForSale.name}</h3>

                                <div className="flex gap-2">

                                    <div className="relative flex-1">

                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Coins className="w-4 h-4 text-yellow-500" /></div>

                                        <input type="number" placeholder="Preis" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-green-500" />

                                    </div>

                                    <button onClick={handleSellSubmit} className="bg-green-600 text-white font-bold px-4 rounded-xl">OK</button>

                                    <button onClick={() => setSelectedForSale(null)} className="bg-slate-700 text-white px-4 rounded-xl"><X className="w-5 h-5" /></button>

                                </div>

                            </div>

                        )}

                        <div className="grid grid-cols-1 gap-3">

                            {sellablePets.length === 0 ? (

                                <div className="text-center text-slate-500 py-20"><Tag className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>Keine verkaufbaren Items.</p><p className="text-xs">Lootboxen können nicht verkauft werden.</p></div>

                            ) : (

                                sellablePets.map(pet => {

                                    const rarity = RARITIES[pet.rarity];

                                    return (

                                        <div key={pet.id} onClick={() => setSelectedForSale(pet)} className={`bg-slate-800 p-3 rounded-2xl border-l-4 ${rarity.border} flex items-center gap-4 cursor-pointer transition-all active:scale-95 hover:bg-slate-750 ${selectedForSale?.id === pet.id ? 'ring-2 ring-green-500' : ''}`}>

                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner bg-slate-900`}>{pet.isEgg ? <Egg className={rarity.color} /> : ZODIAC_ANIMALS[pet.species].icon}</div>

                                            <div className="flex-1">

                                                <div className="flex justify-between items-center"><h3 className="font-bold text-sm">{pet.name}</h3><span className={`text-[10px] ${rarity.color} font-bold`}>{rarity.label}</span></div>

                                                <div className="text-xs text-slate-400 mt-1">{pet.isEgg ? 'Ei' : `Lvl ${pet.level}`} • {pet.isEgg ? 'Schlüpft bald' : `ATK ${pet.atk}`}</div>

                                            </div>

                                            <DollarSign className="text-slate-600" />

                                        </div>

                                    );

                                })

                            )}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}



function ShopScreen({ onBack, onBuyBox }) {

    return (

        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300">

            <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic text-yellow-400">ITEM SHOP</h2></div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-4"><p className="text-sm text-slate-300 text-center">Kaufe Lootboxen für seltene Eier!</p></div>

            <div className="grid grid-cols-1 gap-4">

                <div className="bg-slate-800 border-2 border-slate-600 rounded-3xl p-6 relative overflow-hidden group">

                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-5 -mt-5"></div>

                    <div className="flex justify-between items-center relative z-10">

                        <div><h3 className="text-xl font-bold text-white">Standard Box</h3><p className="text-xs text-slate-400 mt-1">Chance auf Gewöhnlich bis Legendär</p><button onClick={() => onBuyBox('STANDARD', 500, 'COINS')} className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2 active:scale-95 transition-transform"><Coins className="w-4 h-4" /> 500</button></div>

                        <Package className="w-20 h-20 text-slate-400" />

                    </div>

                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-indigo-500 rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-indigo-500/20">

                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl -mr-5 -mt-5 animate-pulse"></div>

                    <div className="flex justify-between items-center relative z-10">

                        <div><h3 className="text-xl font-bold text-white flex items-center gap-2">Premium Box <Star className="w-4 h-4 text-yellow-400 fill-current"/></h3><p className="text-xs text-indigo-200 mt-1">Höhere Chance auf Selten & Episch!</p><button onClick={() => onBuyBox('PREMIUM', 50, 'GEMS')} className="mt-4 bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 active:scale-95 transition-transform shadow-lg"><Gem className="w-4 h-4" /> 50</button></div>

                        <Package className="w-20 h-20 text-indigo-300 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />

                    </div>

                </div>

            </div>

            <div className="mt-8 p-4 bg-black/20 rounded-xl text-[10px] text-slate-500 text-center"><p>Drop Rates:</p><p>Common 40% • Rare 15% • Mythic 3% • Transcendent 0.01%</p></div>

        </div>

    );

}



function ArenaHub({ onBack, onBattle, onTeam }) {

  return (

    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300">

      <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic text-red-400">ARENA HUB</h2></div>

      <div onClick={onBattle} className="relative h-48 bg-gradient-to-br from-red-600 to-pink-700 rounded-3xl p-6 flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-900/20 group overflow-hidden border border-red-400/30">

        <div className="z-10"><h3 className="text-4xl font-black italic">PVP KAMPF</h3><p className="text-red-100 font-bold mt-1">Finde einen Gegner</p><div className="mt-2 flex items-center gap-1 text-xs bg-black/30 w-fit px-2 py-1 rounded text-yellow-300"><Zap className="w-3 h-3 fill-current" /> Kostet 1 Energie</div></div>

        <div className="self-end bg-white text-red-600 px-6 py-2 rounded-full font-black shadow-lg z-10">FIGHT!</div>

        <Swords className="w-40 h-40 text-white/10 absolute -right-6 -bottom-6 rotate-12 group-hover:rotate-45 transition-transform duration-500" />

      </div>

      <button onClick={onTeam} className="w-full bg-slate-800 border border-slate-700 p-6 rounded-3xl flex items-center justify-between hover:bg-slate-750 active:scale-95 transition-all group">

         <div className="flex items-center gap-4"><div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors"><Users className="w-8 h-8" /></div><div className="text-left"><div className="font-bold text-xl">Team Management</div><div className="text-sm text-slate-400">Stelle deine Crew zusammen</div></div></div>

         <ChevronsUp className="text-slate-500" />

      </button>

    </div>

  );

}



function PetHub({ onBack, onInventory, onBreed, onHatchery, onItemInventory }) {

  return (

    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-right duration-300">

      <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic text-emerald-400">PET HUB</h2></div>

      <button onClick={onInventory} className="w-full bg-slate-800 border border-slate-700 p-5 rounded-3xl flex items-center justify-between hover:bg-slate-750 active:scale-95 transition-all group"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors"><LayoutGrid className="w-6 h-6" /></div><div className="text-left"><div className="font-bold text-lg">Pet Sammlung</div><div className="text-xs text-slate-400">Alle deine Monster</div></div></div></button>

      <button onClick={onItemInventory} className="w-full bg-slate-800 border border-slate-700 p-5 rounded-3xl flex items-center justify-between hover:bg-slate-750 active:scale-95 transition-all group"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors"><Backpack className="w-6 h-6" /></div><div className="text-left"><div className="font-bold text-lg">Item Inventar</div><div className="text-xs text-slate-400">Eier & Items</div></div></div></button>

      <button onClick={onHatchery} className="w-full bg-slate-800 border border-slate-700 p-5 rounded-3xl flex items-center justify-between hover:bg-slate-750 active:scale-95 transition-all group"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors"><ThermometerSun className="w-6 h-6" /></div><div className="text-left"><div className="font-bold text-lg">Brutstätte</div><div className="text-xs text-slate-400">Eier ausbrüten</div></div></div></button>

      <button onClick={onBreed} className="w-full bg-slate-800 border border-slate-700 p-5 rounded-3xl flex items-center justify-between hover:bg-slate-750 active:scale-95 transition-all group"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors"><Heart className="w-6 h-6 fill-current" /></div><div className="text-left"><div className="font-bold text-lg">Zucht Labor</div><div className="text-xs text-slate-400">Neue Arten erschaffen</div></div></div></button>

    </div>

  );

}



function ItemInventoryScreen({ pets, onBack, onStartIncubation, user }) {

  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedBox, setSelectedBox] = useState(null);



  const stacks = {};

  pets.forEach(pet => {

      if (pet.isEgg && pet.hatchAt === 0) {

          const key = `${pet.rarity}-${pet.source || 'SHOP'}`;

          

          if (!stacks[key]) {

              stacks[key] = {

                  base: pet,

                  count: 0,

                  ids: [],

                  rarity: pet.rarity,

                  source: pet.source || 'SHOP'

              };

          }

          stacks[key].count++;

          stacks[key].ids.push(pet.id);

      }

  });



  const inventoryItems = Object.values(stacks);



  const boxStacks = {};

  if (user && user.inventory) {

      user.inventory.forEach(item => {

          if (item.type === 'LOOTBOX') {

              if (!boxStacks[item.variant]) boxStacks[item.variant] = { ...item, count: 0, ids: [] };

              boxStacks[item.variant].count++;

              boxStacks[item.variant].ids.push(item.id);

          }

      });

  }

  const boxItems = Object.values(boxStacks);



  return (

    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-right duration-300 relative h-full">

      

      {selectedItem && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in zoom-in-50">

             <div className="bg-slate-800 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative">

                 <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-slate-700 rounded-full hover:bg-slate-600"><X className="w-5 h-5" /></button>

                 

                 <h2 className="text-2xl font-black text-white mb-4">

                     {RARITIES[selectedItem.base.rarity].label} {selectedItem.source === 'BREEDING' ? 'Zucht-Ei' : 'Ei'}

                 </h2>

                 <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-6 relative shadow-inner">

                     <Egg className={`w-16 h-16 ${RARITIES[selectedItem.base.rarity].color}`} />

                     {selectedItem.source === 'BREEDING' && (

                         <div className="absolute top-0 right-0 bg-pink-500 p-2 rounded-full border-2 border-slate-800">

                             <Dna className="w-5 h-5 text-white" />

                         </div>

                     )}

                     <div className="absolute -bottom-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">

                         x{selectedItem.count}

                     </div>

                 </div>

                 

                 <p className="text-slate-300 text-sm mb-6">

                     Ein {selectedItem.source === 'BREEDING' ? 'durch Zucht entstandenes' : 'mysteriöses'} Ei der Seltenheitsstufe <span className={`${RARITIES[selectedItem.rarity].color} font-bold`}>{RARITIES[selectedItem.rarity].label}</span>. 

                     Lege es in die Brutstätte, um zu sehen was schlüpft!

                 </p>

                 

                 <button 

                     onClick={() => {

                         onStartIncubation(selectedItem.ids[0]);

                         setSelectedItem(null);

                     }}

                     className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"

                 >

                     <ThermometerSun className="w-5 h-5" />

                     IN DEN INKUBATOR

                 </button>

             </div>

          </div>

      )}



      {selectedBox && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in zoom-in-50">

             <div className="bg-slate-800 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative">

                 <button onClick={() => setSelectedBox(null)} className="absolute top-4 right-4 p-2 bg-slate-700 rounded-full hover:bg-slate-600"><X className="w-5 h-5" /></button>

                 <h2 className="text-2xl font-black text-white mb-4">{selectedBox.variant} Box</h2>

                 <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-6 relative shadow-inner"><Package className="w-16 h-16 text-yellow-500" /><div className="absolute -bottom-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">x{selectedBox.count}</div></div>

                 <p className="text-slate-300 text-sm mb-6">Eine verschlossene Kiste. Enthält ein zufälliges Ei!</p>

                 <button onClick={() => { onStartIncubation(selectedBox.ids[0], 'BOX'); setSelectedBox(null); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"><BoxSelect className="w-5 h-5" /> ÖFFNEN</button>

             </div>

          </div>

      )}



      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold">Item Inventar</h2></div>

      

      {boxItems.length > 0 && (

          <div className="mb-6">

              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Lootboxen</h3>

              <div className="grid grid-cols-3 gap-3">

                  {boxItems.map((box, idx) => (

                      <div key={idx} onClick={() => setSelectedBox(box)} className="bg-slate-800 aspect-square rounded-2xl border-2 border-yellow-600/50 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors shadow-lg">

                          <span className="absolute top-2 right-2 bg-slate-900 text-xs font-bold text-white px-2 py-0.5 rounded-full border border-white/10">{box.count}</span>

                          <Package className="w-10 h-10 text-yellow-500 drop-shadow-md" />

                          <span className="text-[10px] font-bold mt-2 text-yellow-200 uppercase tracking-wider">{box.variant}</span>

                      </div>

                  ))}

              </div>

          </div>

      )}



      <div>

          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Eier</h3>

          {inventoryItems.length === 0 && boxItems.length === 0 ? (<div className="text-center text-slate-500 py-20 flex flex-col items-center"><Backpack className="w-16 h-16 mb-4 opacity-30" /><p className="text-lg font-bold text-slate-400">Dein Rucksack ist leer.</p><p className="text-sm mt-2">Züchte Pets oder kaufe Boxen!</p></div>) : (

              <div className="grid grid-cols-3 gap-3 pb-20">

                  {inventoryItems.map((item, idx) => { 

                      const rarity = RARITIES[item.base.rarity]; 

                      return (

                        <div key={idx} onClick={() => setSelectedItem(item)} className={`bg-slate-800 aspect-square rounded-2xl border-2 ${rarity.border} flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors shadow-lg ${item.source === 'BREEDING' ? 'ring-2 ring-pink-500' : ''}`}>

                            <span className="absolute top-2 right-2 bg-slate-900 text-xs font-bold text-white px-2 py-0.5 rounded-full border border-white/10">{item.count}</span>

                            <div className="relative">

                                <Egg className={`w-10 h-10 ${rarity.color} drop-shadow-md`} />

                                {item.source === 'BREEDING' && (

                                    <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-0.5 border border-slate-800">

                                        <Dna className="w-3 h-3 text-white" />

                                    </div>

                                )}

                                {item.source === 'SHOP' && (

                                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-slate-800">

                                        <ShoppingBag className="w-3 h-3 text-black" />

                                    </div>

                                )}

                            </div>

                            <span className={`text-[10px] font-bold mt-2 ${rarity.color} uppercase tracking-wider`}>{rarity.label}</span>

                        </div>

                      ); 

                  })}

              </div>

          )}

      </div>

    </div>

  );

}



function HatcheryScreen({ pets, user, onBack, onHatchEgg }) {

  const unlockedSlots = getUnlockedHatcherySlots(user.level);

  const maxSlots = 10;

  const [hatchingPet, setHatchingPet] = useState(null);

  const [nameInput, setNameInput] = useState('');

  

  const [, setTick] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => setTick(t => t + 1), 1000);

    return () => clearInterval(interval);

  }, []);



  const incubatingEggs = pets.filter(p => p.isEgg && p.hatchAt > 0);



  const startHatchingProcess = (pet) => {

      setHatchingPet(pet);

      setNameInput(pet.name);

  }



  const confirmHatch = () => {

      if (hatchingPet) {

          onHatchEgg(hatchingPet.id, nameInput);

          setHatchingPet(null);

      }

  }



  return (

      <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-300 relative">

        {hatchingPet && (

            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in zoom-in-50 rounded-xl">

                <div className="bg-slate-800 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl">

                    <h2 className="text-2xl font-black text-white mb-2">Es schlüpft!</h2>

                    <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto flex items-center justify-center text-5xl mb-4 animate-bounce">{TYPES[hatchingPet.type].icon}</div>

                    <p className="text-slate-300 text-sm mb-4">Ein <span className={RARITIES[hatchingPet.rarity].color}>{RARITIES[hatchingPet.rarity].label}</span> {TYPES[hatchingPet.type].label}-Pet.</p>

                    <div className="text-left mb-6"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Gib ihm einen Namen</label><div className="flex items-center bg-slate-900 rounded-xl mt-1 border border-white/10 focus-within:border-indigo-500 transition-colors"><input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="bg-transparent w-full p-3 outline-none text-white font-bold" autoFocus /><Edit3 className="w-4 h-4 text-slate-500 mr-3" /></div></div>

                    <button onClick={confirmHatch} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">WILLKOMMEN!</button>

                </div>

            </div>

        )}

        <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic">BRUTSTÄTTE</h2></div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center mb-4"><p className="text-sm text-slate-300">Aktive Inkubatoren: <span className="text-amber-400 font-bold">{incubatingEggs.length} / {unlockedSlots}</span></p></div>

        <div className="grid grid-cols-2 gap-3 pb-20">

          {Array.from({ length: maxSlots }).map((_, index) => {

            const isUnlocked = index < unlockedSlots;

            const egg = index < incubatingEggs.length ? incubatingEggs[index] : null;

            if (!isUnlocked) return (<div key={index} className="aspect-square bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-40"><Lock className="w-6 h-6 text-slate-500" /><span className="text-[10px] text-slate-600 font-bold">Lvl {index === 0 ? 1 : (index === 1 ? 15 : 15 + ((index-1)*10))}</span></div>);

            if (egg) {

                const timeLeft = Math.max(0, Math.ceil((egg.hatchAt - Date.now()) / 1000));

                const isReady = timeLeft <= 0;

                const rarity = RARITIES[egg.rarity];

                return (

                  <div key={egg.id} className="aspect-square bg-slate-800 border border-slate-700 rounded-2xl p-2 flex flex-col items-center justify-between relative overflow-hidden group">

                      <div className={`absolute top-0 left-0 w-full h-1 ${rarity.bg}`}></div>

                      <div className="mt-2 animate-pulse"><Egg className={`w-10 h-10 ${rarity.color}`} /></div>

                      <div className="text-center w-full">

                          <div className={`text-[10px] font-bold ${rarity.color} mb-1`}>{rarity.label}</div>

                          {isReady ? (<button onClick={() => startHatchingProcess(egg)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-bold py-2 rounded-lg animate-bounce">SCHLÜPFEN</button>) : (<div className="bg-slate-900 rounded-lg py-1 px-2 flex items-center justify-center gap-1 text-[10px] text-slate-400"><Hourglass className="w-3 h-3" /><span className="font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></div>)}

                      </div>

                  </div>

                );

            }

            return (<div key={index} className="aspect-square bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center"><div className="text-xs text-slate-600 font-bold uppercase">Leer</div></div>);

          })}

        </div>

      </div>

    );

}



function InventoryScreen({ pets, onSelectPet, onBack, title, highlightMode, filterEggs }) {

  const displayPets = filterEggs ? pets.filter(p => !p.isEgg) : pets;

  return (

    <div className="space-y-4 pt-4">

      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold">{title || 'Pet Sammlung'}</h2></div>

      <div className="grid grid-cols-1 gap-3 pb-20">

        {displayPets.length === 0 ? (

          <div className="text-center text-slate-500 py-10"><Info className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>Keine Pets in der Sammlung.</p></div>

        ) : (

          displayPets.map(pet => {

            const rarity = RARITIES[pet.rarity];

            const type = TYPES[pet.type];

            return (

              <div key={pet.id} onClick={() => onSelectPet(pet.id)} className={`bg-slate-800 p-3 rounded-2xl border-l-4 ${rarity.border} flex items-center gap-4 cursor-pointer transition-all active:scale-95 group relative overflow-hidden hover:bg-slate-750`}>

                <div className={`w-14 h-14 ${type.bgLight} rounded-xl flex items-center justify-center text-2xl shadow-inner relative z-10 border border-white/5`}>{type.icon}</div>

                <div className="flex-1 relative z-10">

                  <div className="flex justify-between items-center mb-1"><h3 className="font-bold text-sm">{pet.name}</h3><span className={`text-[10px] font-bold ${rarity.color}`}>{rarity.label}</span></div>

                  <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-400"><div className="flex items-center gap-1"><Swords className="w-3 h-3"/> {pet.atk}</div><div className="flex items-center gap-1"><Heart className="w-3 h-3"/> {pet.hp}</div></div>

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>

  );

}



function TeamEditScreen({ user, pets, onBack, onAddPet, onRemovePet }) {

  const unlockedSlots = Math.min(10, 1 + Math.floor(user.level / 10)); 

  const maxSlots = 10;

  return (

    <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-300">

      <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic">TEAM VERWALTEN</h2></div>

      <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center mb-4"><p className="text-sm text-slate-300">Slots: <span className="text-indigo-400 font-bold">{unlockedSlots} / {maxSlots}</span></p></div>

      <div className="space-y-3">

        {Array.from({ length: maxSlots }).map((_, index) => {

          const isUnlocked = index < unlockedSlots;

          const petId = user.team[index];

          const pet = petId ? pets.find(p => p.id === petId) : null;

          if (!isUnlocked) return (<div key={index} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-50"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center"><Lock className="w-6 h-6 text-slate-600" /></div><div><div className="font-bold text-slate-500">Slot {index + 1}</div><div className="text-xs text-slate-600">Gesperrt (Lvl {index * 10})</div></div></div></div>);

          return (

            <div key={index} className="bg-slate-800 border border-white/10 rounded-2xl p-3 flex items-center justify-between transition-all hover:bg-slate-750">

               {pet ? (<><div className="flex items-center gap-4"><div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-inner ${TYPES[pet.type].bgLight}`}>{TYPES[pet.type].icon}</div><div><div className="font-bold">{pet.name}</div><div className="text-xs text-slate-400">Lvl {pet.level} • {TYPES[pet.type].label}</div></div></div><button onClick={() => onRemovePet(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"><Trash2 className="w-5 h-5" /></button></>) : (<div onClick={() => onAddPet(index)} className="w-full flex items-center gap-4 cursor-pointer"><div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-600 hover:border-indigo-500 transition-colors"><Plus className="w-6 h-6 text-slate-500" /></div><div className="text-slate-500 font-bold">Slot {index + 1} belegen</div></div>)}

            </div>

          );

        })}

      </div>

    </div>

  );

}



function BattleScreen({ battleState, setBattleState, onWin, onLose }) {

  const [animating, setAnimating] = useState(false);

  const { myTeam, enemyTeam, myIndex, enemyIndex, turn, log, isOver, round } = battleState;

  const myPet = myTeam[myIndex];

  const enemyPet = enemyTeam[enemyIndex];



  useEffect(() => {

    if (isOver) return;

    const timer = setTimeout(() => {

      if (animating) return;

      if (turn === 'PLAYER') executeTurn(myPet, enemyPet, 'PLAYER');

      else executeTurn(enemyPet, myPet, 'ENEMY');

    }, 1000);

    return () => clearTimeout(timer);

  }, [turn, isOver, animating, myPet, enemyPet]);



  const executeTurn = (attacker, defender, who) => {

    setAnimating(true);

    let newLog = [...log];

    let damage = 0;

    let isAbility = false;

    let isCrit = false;



    const ability = ABILITIES[attacker.abilityId];

    let attackElementType = attacker.type; 

    if (attacker.currentCd <= 0) {

       isAbility = true;

       if (ability.type !== 'HEAL') attackElementType = ability.element;

    }



    const effectiveness = getDamageMultiplier(attackElementType, defender.type, defender.secondaryType);

    let effText = "";

    if (effectiveness >= 4.0) effText = " (x4!)";

    else if (effectiveness >= 2.0) effText = " (x2)";

    else if (effectiveness <= 0.25) effText = " (x0.25)";

    else if (effectiveness <= 0.5) effText = " (x0.5)";



    if (isAbility) {

      const rawDmg = ability.type === 'PHYSICAL' ? attacker.atk : attacker.ap;

      const defense = ability.type === 'PHYSICAL' ? defender.def : defender.res;

      const mitigation = 100 / (100 + defense);

      damage = Math.floor(rawDmg * ability.dmgScale * mitigation * effectiveness);

      newLog.push(`Runde ${round}: ${attacker.name} wirkt ${ability.name}!`);

    } else {

      const mitigation = 100 / (100 + defender.def);

      damage = Math.floor(attacker.atk * mitigation * effectiveness);

      newLog.push(`Runde ${round}: ${attacker.name} greift an.`);

    }



    const roll = Math.random() * 100;

    if (roll < attacker.critRate) {

      isCrit = true;

      damage = Math.floor(damage * (attacker.critDmg / 100));

    }



    damage = Math.max(1, damage);

    const newHp = Math.max(0, defender.hp - damage);

    newLog.push(`> ${damage} Schaden${isCrit ? ' (KRIT!)' : ''}${effText}`);



    const updatedAttacker = { ...attacker, currentCd: isAbility ? ability.cd : Math.max(0, attacker.currentCd - 1) };

    const updatedDefender = { ...defender, hp: newHp };



    let nextMyIndex = myIndex;

    let nextEnemyIndex = enemyIndex;

    let gameOver = false;

    let nextTurn = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';

    let nextRound = who === 'ENEMY' ? round + 1 : round;



    if (newHp === 0) {

        newLog.push(`${updatedDefender.name} wurde besiegt!`);

        if (who === 'PLAYER') {

            if (enemyIndex + 1 < enemyTeam.length) { nextEnemyIndex++; newLog.push(`Gegner schickt ${enemyTeam[nextEnemyIndex].name} in den Kampf!`); } 

            else { gameOver = true; }

        } else {

            if (myIndex + 1 < myTeam.length) { nextMyIndex++; newLog.push(`Du schickst ${myTeam[nextMyIndex].name} in den Kampf!`); } 

            else { gameOver = true; }

        }

    }



    const newMyTeam = [...myTeam];

    const newEnemyTeam = [...enemyTeam];

    if (who === 'PLAYER') { newMyTeam[myIndex] = updatedAttacker; newEnemyTeam[enemyIndex] = updatedDefender; } 

    else { newEnemyTeam[enemyIndex] = updatedAttacker; newMyTeam[myIndex] = updatedDefender; }



    setBattleState(prev => ({ ...prev, myTeam: newMyTeam, enemyTeam: newEnemyTeam, myIndex: nextMyIndex, enemyIndex: nextEnemyIndex, log: newLog, turn: nextTurn, round: nextRound, isOver: gameOver }));

    setTimeout(() => setAnimating(false), 500);

  };



  if (isOver) {

    const won = enemyTeam[enemyTeam.length - 1].hp === 0;

    const myTeamIds = myTeam.map(p => p.id);



    return (

        <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in">

          <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${won ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>{won ? <Trophy className="w-16 h-16" /> : <Skull className="w-16 h-16" />}</div>

          <h2 className="text-4xl font-black uppercase mb-2">{won ? 'SIEG!' : 'NIEDERLAGE'}</h2>

          <div className="bg-slate-800 p-4 rounded-xl mb-8 w-64 border border-white/5"><div className="flex justify-between mb-2 pb-2 border-b border-white/5"><span className="text-slate-400">Spieler XP</span><span className="text-green-400 font-bold">{won ? '+50 XP' : '+5 XP'}</span></div><div className="flex justify-between mb-2"><span className="text-slate-400">Münzen</span><span className="text-yellow-400 font-bold">{won ? '+50' : '+0'}</span></div><p className="text-xs text-slate-500 mt-2">Team XP verteilt!</p></div>

          <button onClick={() => won ? onWin({coins: 50, xp: 50}, myTeamIds) : onLose()} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-white/10">Zurück zur Basis</button>

        </div>

      );

  }



  return (

    <div className="h-full flex flex-col pt-4 relative">

      <div className="absolute top-2 left-0 w-full text-center z-10 opacity-50 text-[10px] font-bold uppercase tracking-widest">Runde {round}</div>

      <div className="flex flex-col items-end pr-4 pt-4"><TeamDots team={enemyTeam} currentIndex={enemyIndex} isEnemy={true} /><BattleUnit pet={enemyPet} isEnemy={true} isActive={turn === 'ENEMY'} animating={animating} /></div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"><span className="bg-black/80 backdrop-blur px-3 py-1 rounded-full font-black italic text-2xl border border-white/20 shadow-2xl">VS</span></div>

      <div className="flex flex-col items-start pl-4 mt-auto mb-4"><BattleUnit pet={myPet} isEnemy={false} isActive={turn === 'PLAYER'} animating={animating} /><TeamDots team={myTeam} currentIndex={myIndex} isEnemy={false} /></div>

      <div className="bg-slate-900 border-t border-white/10 h-1/3 flex flex-col relative"><div className="absolute top-0 left-0 w-full h-0.5 bg-slate-800"><div className={`h-full ${turn === 'PLAYER' ? 'bg-indigo-500' : 'bg-red-500'} transition-all duration-[1000ms] ease-linear w-full origin-left animate-pulse`}></div></div><div className="flex-1 overflow-y-auto text-xs text-slate-300 space-y-1 font-mono p-4 flex flex-col-reverse">{[...log].reverse().map((entry, i) => (<div key={i} className={`py-1 border-b border-white/5 last:border-0 ${i === 0 ? 'text-white font-bold' : 'opacity-60'}`}>{entry}</div>))}</div></div>

    </div>

  );

}



function PetDetailScreen({ pet, onBack }) {

    const typeInfo = TYPES[pet.type];

    const rarityInfo = RARITIES[pet.rarity];

    const ability = ABILITIES[pet.abilityId];

    const abilityTypeInfo = TYPES[ability.element] || { color: 'text-slate-400', label: 'Neutral' };

    return (

      <div className="pt-2 pb-10 space-y-6 animate-in slide-in-from-right duration-300">

        <div className="flex items-center gap-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-xl font-bold">Pet Details</h2></div>

        <div className={`rounded-3xl p-0.5 bg-gradient-to-br ${rarityInfo.bg} to-slate-800`}><div className="bg-slate-900 rounded-[22px] p-5 relative overflow-hidden"><div className="flex justify-between items-start mb-6 relative z-10"><div><div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${rarityInfo.border} ${rarityInfo.color} mb-1 bg-slate-800/80`}><Sparkles className="w-3 h-3" /> {rarityInfo.label}</div><h3 className="text-3xl font-black">{pet.name}</h3><div className={`text-sm font-bold ${typeInfo.color} flex items-center gap-1`}><div className="w-4 h-4">{typeInfo.icon}</div> {typeInfo.label}-Typ</div></div><div className={`w-20 h-20 ${typeInfo.bg} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>{typeInfo.icon}</div></div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-4 relative z-10"><div className="flex justify-between items-center mb-4"><h4 className="text-xs text-slate-500 font-bold uppercase">Stats (Lvl {pet.level})</h4><div className="text-[10px] text-slate-400">Wachstum: <span className="text-green-400">+{Math.round((0.05 * rarityInfo.multi)*100)}%</span> / Lvl</div></div><div className="grid grid-cols-2 gap-x-8 gap-y-2"><div className="flex justify-between items-center text-sm border-b border-white/5 pb-1"><span className="text-slate-400 flex items-center gap-2"><Swords className="w-4 h-4 text-red-400"/> Angriff</span><span className="font-bold">{pet.atk}</span></div><div className="flex justify-between items-center text-sm border-b border-white/5 pb-1"><span className="text-slate-400 flex items-center gap-2"><Shield className="w-4 h-4 text-slate-300"/> Rüstung</span><span className="font-bold">{pet.def}</span></div><div className="flex justify-between items-center text-sm border-b border-white/5 pb-1"><span className="text-slate-400 flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400"/> Fähigkeit</span><span className="font-bold">{pet.ap}</span></div><div className="flex justify-between items-center text-sm border-b border-white/5 pb-1"><span className="text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-300"/> Resistenz</span><span className="font-bold">{pet.res}</span></div><div className="flex justify-between items-center text-sm pt-1"><span className="text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4 text-yellow-400"/> Speed</span><span className="font-bold">{pet.speed}</span></div><div className="flex justify-between items-center text-sm pt-1"><span className="text-slate-400 flex items-center gap-2"><Heart className="w-4 h-4 text-green-400"/> HP</span><span className="font-bold">{pet.hp}/{pet.maxHp}</span></div></div></div>

        <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 mb-4 relative z-10"><div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400"><span>XP Fortschritt</span><span>{pet.xp} / {pet.maxXp}</span></div><div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{width: `${(pet.xp / pet.maxXp) * 100}%`}}></div></div></div>

        <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl relative z-10"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center text-white"><Zap className="w-5 h-5 fill-current" /></div><div><div className="font-bold text-sm text-indigo-300">{ability.name}</div><div className="text-[10px] text-indigo-400/70 uppercase">Aktive Fähigkeit</div></div></div><div className="bg-slate-900 text-[10px] px-2 py-1 rounded border border-white/10 flex items-center gap-1 text-slate-400"><Timer className="w-3 h-3" /> {ability.cd} Runden</div></div><p className="text-xs text-slate-300 leading-relaxed mb-2">{ability.desc}</p><div className="flex items-center gap-1 text-[10px] font-bold uppercase">Element: <span className={`${abilityTypeInfo.color}`}>{abilityTypeInfo.label}</span></div></div>

        <div className={`absolute -top-10 -right-10 w-64 h-64 ${typeInfo.bg} opacity-10 blur-3xl rounded-full pointer-events-none`}></div></div></div></div>

    );

}



function BreedingScreen({ pets, onBreed, onBack, coins }) {

  const [selected, setSelected] = useState([]);

  

  const breedablePets = pets.filter(p => !p.isEgg);



  const toggleSelect = (id) => {

    if (selected.includes(id)) setSelected(selected.filter(pid => pid !== id));

    else if (selected.length < 2) setSelected([...selected, id]);

  };



  return (

    <div className="space-y-4 pt-4 h-full flex flex-col">

      <div className="flex items-center gap-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold">Zucht Labor</h2></div>

      <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30 text-center text-sm"><p className="text-indigo-200">Kombiniere 2 Pets. Attribute werden gemischt.</p><div className="flex justify-center items-center gap-2 mt-1 font-bold text-yellow-400"><Coins className="w-4 h-4" /> Kosten: 200</div></div>

      

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pb-20">

        {breedablePets.length === 0 ? (

          <div className="col-span-2 text-center text-slate-500 py-10 flex flex-col items-center">

            <Info className="w-10 h-10 mb-2 opacity-50" />

            <p>Keine erwachsenen Pets verfügbar.</p>

            <p className="text-xs mt-1">Brüte Eier in der Brutstätte aus!</p>

          </div>

        ) : (

          breedablePets.map(pet => (

            <div key={pet.id} onClick={() => toggleSelect(pet.id)} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${selected.includes(pet.id) ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}>

              <div className={`w-10 h-10 rounded-full ${TYPES[pet.type].bg} flex items-center justify-center`}>{TYPES[pet.type].icon}</div>

              <div className="font-bold text-xs truncate w-full text-center">{pet.name}</div>

              <div className={`text-[10px] ${RARITIES[pet.rarity].color}`}>{RARITIES[pet.rarity].label}</div>

            </div>

          ))

        )}

      </div>

      <div className="absolute bottom-6 left-0 w-full px-6"><button disabled={selected.length !== 2} onClick={() => { onBreed(selected[0], selected[1]); setSelected([]); }} className="w-full bg-pink-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center gap-2"><Heart className="w-5 h-5 fill-current" /> {selected.length === 2 ? 'JETZT ZÜCHTEN' : 'Wähle 2 Pets'}</button></div>

    </div>

  );

}



function SettingsScreen({ settings, setSettings, onLogout }) {

    const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

    return (

      <div className="pt-4 space-y-6"><h2 className="text-2xl font-bold">Einstellungen</h2><div className="bg-slate-800 rounded-2xl overflow-hidden border border-white/5"><SettingRow icon={settings.music ? Volume2 : VolumeX} label="Musik" active={settings.music} onToggle={() => toggle('music')} /><SettingRow icon={settings.sfx ? Zap : VolumeX} label="Soundeffekte" active={settings.sfx} onToggle={() => toggle('sfx')} /></div><button onClick={onLogout} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl flex items-center justify-center gap-2 font-bold"><LogOut className="w-5 h-5" /> Abmelden</button></div>

    );

}



function FriendProfileScreen({ friend, onBack }) {

    const winRate = friend.stats?.pvpTotal > 0 

        ? Math.round((friend.stats.pvpWins / friend.stats.pvpTotal) * 100) 

        : 0;



    const marketBalance = (friend.stats?.marketEarned || 0) - (friend.stats?.marketSpent || 0);



    const stats = [

        { label: 'Gezüchtet', value: friend.stats?.bred || 0, icon: Dna, color: 'text-pink-400', bg: 'bg-pink-500/20' },

        { label: 'Gebrütet', value: friend.stats?.hatched || 0, icon: ThermometerSun, color: 'text-amber-400', bg: 'bg-amber-500/20' },

        { label: 'Siegesrate', value: `${winRate}%`, icon: Percent, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },

        { label: 'Kämpfe', value: friend.stats?.pvpTotal || 0, icon: Swords, color: 'text-red-400', bg: 'bg-red-500/20' },

        { 

            label: 'Markt Bilanz', 

            value: marketBalance > 0 ? `+${marketBalance}` : `${marketBalance}`, 

            icon: ShoppingBag, 

            color: marketBalance >= 0 ? 'text-green-400' : 'text-red-400', 

            bg: marketBalance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20' 

        },

    ];



    return (

        <div className="pt-8 space-y-8 h-full overflow-y-auto pb-24 animate-in fade-in slide-in-from-right duration-300">

            <div className="flex items-center gap-2 mb-2 px-4">

                <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>

                <h2 className="text-2xl font-bold text-white">Freund Profil</h2>

            </div>



            <div className="text-center relative">

                <div className="w-32 h-32 bg-indigo-600 mx-auto rounded-3xl flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10">

                    {friend.avatar}

                    <div className="absolute -bottom-3 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full border-2 border-slate-800">

                        LVL {friend.level}

                    </div>

                </div>

                <div className="mt-4">

                    <h2 className="text-3xl font-black text-white">{friend.username}</h2>

                    <p className="text-indigo-400 font-bold flex items-center justify-center gap-1">

                        <Trophy className="w-4 h-4" /> {friend.rating} Elo

                    </p>

                </div>

            </div>



            <div className="grid grid-cols-2 gap-3 px-4">

                {stats.map((stat, i) => (

                    <div key={i} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-24">

                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>

                            <stat.icon className="w-5 h-5" />

                        </div>

                        <div>

                            <div className={`text-2xl font-black ${stat.label === 'Markt Bilanz' ? stat.color : 'text-white'}`}>{stat.value}</div>

                            <div className="text-xs font-bold text-slate-400 uppercase">{stat.label}</div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}



function ProfileScreen({ user, petCount, onViewFriend, onAddFriend }) {

    const [activeTab, setActiveTab] = useState('stats');

    const [friendIdInput, setFriendIdInput] = useState('');



    const winRate = user.stats?.pvpTotal > 0 

        ? Math.round((user.stats.pvpWins / user.stats.pvpTotal) * 100) 

        : 0;



    const marketBalance = (user.stats?.marketEarned || 0) - (user.stats?.marketSpent || 0);



    const stats = [

        { label: 'Pets', value: petCount, icon: LayoutGrid, color: 'text-blue-400', bg: 'bg-blue-500/20' },

        { label: 'Gezüchtet', value: user.stats?.bred || 0, icon: Dna, color: 'text-pink-400', bg: 'bg-pink-500/20' },

        { label: 'Gebrütet', value: user.stats?.hatched || 0, icon: ThermometerSun, color: 'text-amber-400', bg: 'bg-amber-500/20' },

        { label: 'Siegesrate', value: `${winRate}%`, icon: Percent, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },

        { label: 'Kämpfe', value: user.stats?.pvpTotal || 0, icon: Swords, color: 'text-red-400', bg: 'bg-red-500/20' },

        { 

            label: 'Markt Bilanz', 

            value: marketBalance > 0 ? `+${marketBalance}` : `${marketBalance}`, 

            icon: ShoppingBag, 

            color: marketBalance >= 0 ? 'text-green-400' : 'text-red-400', 

            bg: marketBalance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20' 

        },

    ];



    const copyId = () => {

        // Simulate clipboard copy

        alert(`ID kopiert: ${user.id}`);

    };



    return (

        <div className="pt-8 space-y-6 h-full overflow-y-auto pb-24 animate-in fade-in slide-in-from-bottom duration-500">

            

            <div className="text-center relative px-4">

                <div className="w-32 h-32 bg-indigo-600 mx-auto rounded-3xl flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10">

                    {user.avatar}

                    <div className="absolute -bottom-3 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full border-2 border-slate-800">

                        LVL {user.level}

                    </div>

                </div>

                <div className="mt-4">

                    <h2 className="text-3xl font-black text-white">{user.username}</h2>

                    <p className="text-indigo-400 font-bold flex items-center justify-center gap-1 mb-2">

                        <Trophy className="w-4 h-4" /> {user.rating} Elo

                    </p>

                    <button onClick={copyId} className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-400 hover:bg-slate-700 transition-colors">

                        ID: {user.id} <Copy className="w-3 h-3" />

                    </button>

                </div>

            </div>



            <div className="flex p-1 bg-slate-800 rounded-xl mx-4">

                <button onClick={() => setActiveTab('stats')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Statistiken</button>

                <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Freunde</button>

            </div>



            {activeTab === 'stats' ? (

                <div className="grid grid-cols-2 gap-3 px-4">

                    {stats.map((stat, i) => (

                        <div key={i} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-24">

                            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>

                                <stat.icon className="w-5 h-5" />

                            </div>

                            <div>

                                <div className={`text-2xl font-black ${stat.label === 'Markt Bilanz' ? stat.color : 'text-white'}`}>{stat.value}</div>

                                <div className="text-xs font-bold text-slate-400 uppercase">{stat.label}</div>

                            </div>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="px-4 space-y-4">

                    <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">

                        <h3 className="text-sm font-bold text-white mb-2">Freund hinzufügen</h3>

                        <div className="flex gap-2">

                            <input 

                                type="text" 

                                placeholder="Spieler-ID eingeben..." 

                                value={friendIdInput}

                                onChange={(e) => setFriendIdInput(e.target.value)}

                                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 text-sm text-white outline-none focus:border-indigo-500"

                            />

                            <button 

                                onClick={() => { onAddFriend(friendIdInput); setFriendIdInput(''); }}

                                className="bg-indigo-600 text-white p-2 rounded-xl"

                            >

                                <UserPlus className="w-5 h-5" />

                            </button>

                        </div>

                    </div>



                    <div className="space-y-2">

                        {!user.friends || user.friends.length === 0 ? (

                            <div className="text-center text-slate-500 py-8">

                                <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />

                                <p>Noch keine Freunde.</p>

                            </div>

                        ) : (

                            user.friends.map((friend, idx) => (

                                <div key={idx} onClick={() => onViewFriend(friend)} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">

                                            {friend.avatar}

                                        </div>

                                        <div>

                                            <div className="font-bold text-white">{friend.username}</div>

                                            <div className="text-xs text-indigo-400">Lvl {friend.level} • {friend.rating} Elo</div>

                                        </div>

                                    </div>

                                    <UserCheck className="text-green-500 w-5 h-5" />

                                </div>

                            ))

                        )}

                    </div>

                </div>

            )}



            <div className="text-center text-slate-600 text-xs font-mono px-4">

                <p>Member since 2024</p>

            </div>

        </div>

    );

}



// ==========================================

// 5. HAUPT-APP (AM ENDE DER DATEI)

// ==========================================



export default function GameApp() {

  const [user, setUser] = useState(null); 

  const [currentView, setCurrentView] = useState('auth'); 

  const [myPets, setMyPets] = useState([]);

  const [activeBattle, setActiveBattle] = useState(null);

  const [selectedPetDetail, setSelectedPetDetail] = useState(null);

  const [settings, setSettings] = useState({ music: true, sfx: true, notifications: false });

  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const [selectedSlotForTeam, setSelectedSlotForTeam] = useState(null);

  const [notification, setNotification] = useState(null);

  const [lootResult, setLootResult] = useState(null); 

  const [marketListings, setMarketListings] = useState([]);

  const [selectedFriend, setSelectedFriend] = useState(null);



  // --- DUMMY MARKET DATA ---

  useEffect(() => {

      if (marketListings.length === 0) {

          const dummy1 = generatePet(10, 'FIRE', 'RARE');

          dummy1.id = 'market_dummy_1';

          const dummy2 = generatePet(5, 'WATER', 'UNCOMMON');

          dummy2.id = 'market_dummy_2';

          

          setMarketListings([

              { id: 'l1', sellerName: 'BotPlayer_X', price: 1200, pet: dummy1 },

              { id: 'l2', sellerName: 'TraderJoe', price: 450, pet: dummy2 }

          ]);

      }

  }, []);



  class ErrorBoundary extends React.Component {

    constructor(props) {

      super(props);

      this.state = { hasError: false, error: null };

    }

    static getDerivedStateFromError(error) { return { hasError: true, error }; }

    componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }

    render() {

      if (this.state.hasError) {

        return (

          <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6 text-center">

            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />

            <h1 className="text-2xl font-bold mb-2">Ups, ein Fehler ist aufgetreten!</h1>

            <p className="text-slate-400 mb-6 text-sm">{this.state.error?.toString()}</p>

            <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"><RefreshCw className="w-5 h-5"/> Spiel neu laden</button>

          </div>

        );

      }

      return this.props.children; 

    }

  }



  // Wrap the content logic in a sub-component to use ErrorBoundary correctly

  const GameContent = () => {

      // Helper for notifications within the game content

      const showNotification = (msg, type = 'error') => {

        setNotification({ message: msg, type });

        setTimeout(() => setNotification(null), 3000);

      };



      const handleLogin = (username, isGuest = false) => {

        const starter1 = generatePet(1, null, 'COMMON');

        const starter2 = generatePet(1, null, 'UNCOMMON');

        setUser({ 

            id: isGuest ? 'guest_123' : 'user_555', 

            username: username || 'Gast Spieler', 

            level: 1, 

            xp: 0, 

            xpToNextLevel: 100, 

            coins: isGuest ? 500 : 500, 

            gems: isGuest ? 10 : 10, 

            avatar: '🛡️', 

            rating: 1000, 

            team: [starter1.id], 

            energy: 10, 

            lastEnergyUpdate: Date.now(),

            inventory: [],

            friends: [],

            // STATS INITIALIZATION

            stats: {

                pvpWins: 0,

                pvpTotal: 0,

                hatched: 0,

                bred: 0,

                marketSpent: 0,

                marketEarned: 0

            }

        });

        setMyPets([starter1, starter2]);

        setCurrentView('menu');

      };



      const handleLogout = () => { setUser(null); setCurrentView('auth'); setMyPets([]); };



      // ENERGY REGENERATION HOOK

      useEffect(() => {

        if (!user) return;

        const interval = setInterval(() => {

            const now = Date.now();

            const msPerEnergy = 1000 * 60 * 60; // 1 Hour

            const timeDiff = now - user.lastEnergyUpdate;

            

            if (timeDiff >= msPerEnergy) {

                const energyToGain = Math.floor(timeDiff / msPerEnergy);

                const maxEn = getMaxEnergy(user.level);

                

                if (user.energy < maxEn) {

                     setUser(u => {

                        const newEnergy = Math.min(maxEn, u.energy + energyToGain);

                        const newLastUpdate = u.lastEnergyUpdate + (energyToGain * msPerEnergy);

                        

                        return {

                            ...u, 

                            energy: newEnergy,

                            lastEnergyUpdate: newLastUpdate

                        };

                     });

                } else {

                    setUser(u => ({ ...u, lastEnergyUpdate: now })); 

                }

            }

        }, 10000); // Check every 10s

        return () => clearInterval(interval);

      }, [user]);



      // MARKET BOT SIMULATION

      useEffect(() => {

        if (!user) return;

        const interval = setInterval(() => {

            // 10% chance to sell a listing every 5 seconds

            if (Math.random() > 0.9) {

                setMarketListings(prevListings => {

                    const myListings = prevListings.filter(l => l.sellerName === user.username);

                    if (myListings.length === 0) return prevListings;



                    const soldItemIndex = Math.floor(Math.random() * myListings.length);

                    const soldItem = myListings[soldItemIndex];



                    // Process Sale

                    setUser(u => ({

                        ...u,

                        coins: u.coins + soldItem.price,

                        stats: {

                            ...u.stats,

                            marketEarned: u.stats.marketEarned + soldItem.price

                        }

                    }));

                    

                    showNotification(`Dein Angebot für ${soldItem.pet.name} wurde verkauft! (+${soldItem.price})`, 'success');



                    // Remove from market

                    return prevListings.filter(l => l.id !== soldItem.id);

                });

            }

        }, 5000);

        return () => clearInterval(interval);

      }, [user, marketListings]);



      const handleAddFriend = (friendId) => {

          if (!friendId) return;

          if (friendId === user.id) { showNotification("Du kannst dich nicht selbst hinzufügen.", 'error'); return; }

          if (user.friends.find(f => f.id === friendId)) { showNotification("Bereits befreundet.", 'error'); return; }

          

          const foundUser = DUMMY_USERS.find(u => u.id === friendId);

          

          if (foundUser) {

              setUser(prev => ({

                  ...prev,

                  friends: [...prev.friends, foundUser]

              }));

              showNotification(`${foundUser.username} wurde hinzugefügt!`, 'success');

          } else {

              showNotification("Spieler nicht gefunden.", 'error');

          }

      };



      const handleBuyMarket = (listingId) => {

          const listing = marketListings.find(l => l.id === listingId);

          if (!listing) return;



          if (user.coins < listing.price) {

              showNotification("Nicht genug Münzen!", 'error');

              return;

          }



          // Process Transaction & Stats

          setUser(prev => ({ 

              ...prev, 

              coins: prev.coins - listing.price,

              stats: { ...prev.stats, marketSpent: prev.stats.marketSpent + listing.price } 

          }));

          

          // Add Pet/Egg to Inventory

          const newItem = { ...listing.pet, id: Date.now() + Math.random().toString() }; // New ID to avoid conflicts

          setMyPets(prev => [...prev, newItem]);



          // Remove from Market

          setMarketListings(prev => prev.filter(l => l.id !== listingId));



          showNotification(`Erfolgreich gekauft: ${newItem.name}`, 'success');

      };



      const handleSellMarket = (petId, price) => {

          const petIndex = myPets.findIndex(p => p.id === petId);

          if (petIndex === -1) return;

          

          const petToSell = myPets[petIndex];

          

          // Remove from MyPets

          const newMyPets = [...myPets];

          newMyPets.splice(petIndex, 1);

          setMyPets(newMyPets);



          // Add to Market

          const newListing = {

              id: Date.now().toString(),

              sellerName: user.username,

              price: price,

              pet: petToSell

          };

          setMarketListings(prev => [newListing, ...prev]);

          

          showNotification("Angebot erstellt!", 'success');

      };



      const addToTeam = (petId) => {

        if (selectedSlotForTeam === null) return;

        const pet = myPets.find(p => p.id === petId);

        if (pet && pet.isEgg) { showNotification("Eier können nicht kämpfen! Warte bis es schlüpft.", 'error'); return; }

        const newTeam = [...user.team];

        while(newTeam.length <= selectedSlotForTeam) { newTeam.push(null); }

        const existingIndex = newTeam.indexOf(petId);

        if (existingIndex !== -1) { newTeam[existingIndex] = null; }

        newTeam[selectedSlotForTeam] = petId;

        setUser({...user, team: newTeam});

        setCurrentView('team-edit');

        setSelectedSlotForTeam(null);

      };



      const removeFromTeam = (index) => {

        const newTeam = [...user.team];

        newTeam[index] = null;

        setUser({...user, team: newTeam});

      };



      const hatchEgg = (petId, customName) => {

        const pet = myPets.find(p => p.id === petId);

        if (!pet || !pet.isEgg) return;

        if (Date.now() < pet.hatchAt) { showNotification("Das Ei ist noch nicht bereit!", 'error'); return; }

        setMyPets(pets => pets.map(p => { if (p.id === petId) { return { ...p, isEgg: false, name: customName || p.name }; } return p; }));

        

        // STATS UPDATE

        setUser(prev => ({ ...prev, stats: { ...prev.stats, hatched: prev.stats.hatched + 1 } }));



        showNotification(`Ei ist geschlüpft! Es ist ein ${customName || pet.name}!`, 'success');

      };



      const startIncubation = (id, type) => {

        if (type === 'BOX') {

            // LOOTBOX ÖFFNEN LOGIK

            const box = user.inventory.find(i => i.id === id);

            if (!box) return;



            // 1. Remove Box from Inventory

            const newInv = user.inventory.filter(i => i.id !== id);

            setUser(prev => ({ ...prev, inventory: newInv }));



            // 2. Determine Rarity & Create Egg

            const rarityKey = determineRarity(box.variant);

            const newEgg = generatePet(1, null, rarityKey, null, 'SHOP');

            newEgg.isEgg = true;

            newEgg.hatchAt = 0; // Direct to Egg Inventory



            // 3. Add Egg to Pets

            setMyPets(currentPets => [...currentPets, newEgg]);

            

            // 4. Show Modal

            setLootResult(newEgg);

        } else {

            // EI IN INKUBATOR LEGEN LOGIK

            const incubatingEggs = myPets.filter(p => p.isEgg && p.hatchAt > 0).length;

            const maxSlots = getUnlockedHatcherySlots(user.level);

            if (incubatingEggs >= maxSlots) { showNotification("Brutstätte ist voll!", 'error'); return; }

            const pet = myPets.find(p => p.id === id);

            const duration = RARITIES[pet.rarity].hatchDuration * 1000;

            setMyPets(pets => pets.map(p => { if (p.id === id) { return { ...p, hatchAt: Date.now() + duration }; } return p; }));

            showNotification("Ei wurde in den Inkubator gelegt!", 'success');

            setCurrentView('hatchery');

        }

      }



      const breedPets = (parent1Id, parent2Id) => {

        if (user.coins < 200) { showNotification("Nicht genug Münzen! Zucht kostet 200.", 'error'); return; }

        const p1 = myPets.find(p => p.id === parent1Id);

        const p2 = myPets.find(p => p.id === parent2Id);

        if (p1.isEgg || p2.isEgg) { showNotification("Du kannst keine Eier züchten!", 'error'); return; }

        

        // --- DUAL TYPE LOGIC START ---

        const parentTypes = [p1.type];

        if (p1.secondaryType) parentTypes.push(p1.secondaryType);

        if (!parentTypes.includes(p2.type)) parentTypes.push(p2.type);

        if (p2.secondaryType && !parentTypes.includes(p2.secondaryType)) parentTypes.push(p2.secondaryType);

        

        let childType = p1.type;

        let childSecType = null;

        

        // 5% Chance for dual type if more than 1 unique type available

        if (parentTypes.length > 1 && Math.random() <= 0.05) {

            // Pick 2 distinct types

            const t1Index = Math.floor(Math.random() * parentTypes.length);

            childType = parentTypes[t1Index];

            let t2Index = Math.floor(Math.random() * parentTypes.length);

            while(t2Index === t1Index) {

                 t2Index = Math.floor(Math.random() * parentTypes.length);

            }

            childSecType = parentTypes[t2Index];

        } else {

            // Pick 1 type

            childType = parentTypes[Math.floor(Math.random() * parentTypes.length)];

        }

        // --- DUAL TYPE LOGIC END ---



        // --- ABILITY LOGIC (50/50) ---

        const childAbilityId = Math.random() > 0.5 ? p1.abilityId : p2.abilityId;



        const rarityKeys = Object.keys(RARITIES);

        const p1Idx = RARITIES[p1.rarity].id - 1;

        const p2Idx = RARITIES[p2.rarity].id - 1;

        let newRarityIdx = Math.floor((p1Idx + p2Idx) / 2);

        if (Math.random() > 0.85 && newRarityIdx < 9) newRarityIdx++;

        const babyRarityKey = rarityKeys[newRarityIdx];



        // Override with inheritance logic (Base Stats!)

        const mixStat = (s1, s2) => Math.floor((s1 + s2) / 2 * (0.9 + Math.random() * 0.3)); // -10% to +20%

        const inherited = {

             hp: mixStat(p1.b_hp, p2.b_hp),

             atk: mixStat(p1.b_atk, p2.b_atk),

             ap: mixStat(p1.b_ap, p2.b_ap),

             def: mixStat(p1.b_def, p2.b_def),

             res: mixStat(p1.b_res, p2.b_res),

             speed: mixStat(p1.b_speed, p2.b_speed),

        };



        // Re-Generate with inherited base stats AND SOURCE 'BREEDING'

        const finalPet = generatePet(1, childType, babyRarityKey, inherited, 'BREEDING');



        finalPet.secondaryType = childSecType; 

        finalPet.abilityId = childAbilityId; 

        finalPet.name = "Zucht " + finalPet.name; 

        finalPet.isEgg = true; 

        finalPet.hatchAt = 0; 

        

        setMyPets([...myPets, finalPet]);

        

        // STATS UPDATE

        setUser({ 

            ...user, 

            coins: user.coins - 200,

            stats: { ...user.stats, bred: user.stats.bred + 1 }

        });

        showNotification(`Erfolg! Ein ${RARITIES[finalPet.rarity].label}-Ei liegt im Item Inventar!`, 'success');

        setCurrentView('item-inventory'); 

      };

      

      const buyLootbox = (boxType, cost, currency) => {

          if (currency === 'COINS') {

              if (user.coins < cost) { showNotification("Nicht genug Münzen!", 'error'); return; }

              setUser(prev => ({ 

                  ...prev, 

                  coins: prev.coins - cost,

                  inventory: [...prev.inventory, { id: Date.now(), type: 'LOOTBOX', variant: boxType }],

                  // marketSpent wird NICHT erhöht (nur bei Marktplatz-Käufen)

              }));

          } else {

              if (user.gems < cost) { showNotification("Nicht genug Edelsteine!", 'error'); return; }

              setUser(prev => ({ 

                  ...prev, 

                  gems: prev.gems - cost,

                  inventory: [...prev.inventory, { id: Date.now(), type: 'LOOTBOX', variant: boxType }] 

              }));

          }

          showNotification(`${boxType} Box gekauft! Schau im Inventar.`, 'success');

      };



      const startBattle = () => {

        const validTeamIds = user.team.filter(id => id && myPets.find(p => p.id === id));

        if (validTeamIds.length === 0) { showNotification("Füge zuerst Pets zu deinem Team hinzu!", 'error'); return; }

        

        if (user.energy < 1) {

            showNotification("Nicht genug Energie! Warte bis sie sich regeneriert.", 'error');

            return;

        }



        // Energie abziehen

        setUser(prev => ({ ...prev, energy: prev.energy - 1 }));



        const myBattleTeam = validTeamIds.map(id => { const p = myPets.find(pet => pet.id === id); return { ...p, currentCd: 0, hp: p.maxHp }; });

        const enemyBattleTeam = [];

        const avgLevel = Math.floor(myBattleTeam.reduce((acc, p) => acc + p.level, 0) / myBattleTeam.length);

        for (let i = 0; i < myBattleTeam.length; i++) { const enemyLevel = Math.max(1, avgLevel + Math.floor(Math.random() * 3) - 1); const enemyPet = generatePet(enemyLevel); enemyPet.id = `enemy_${i}`; enemyPet.name = 'Feindl. ' + enemyPet.name; enemyBattleTeam.push({ ...enemyPet, currentCd: 0 }); }

        const p1 = myBattleTeam[0]; const e1 = enemyBattleTeam[0]; const playerFirst = p1.speed >= e1.speed;

        setActiveBattle({ myTeam: myBattleTeam, enemyTeam: enemyBattleTeam, myIndex: 0, enemyIndex: 0, log: [`Kampf gestartet! Teamgröße: ${myBattleTeam.length} vs ${enemyBattleTeam.length}`], turn: playerFirst ? 'PLAYER' : 'ENEMY', isOver: false, round: 1 });

        setCurrentView('battle');

      };



      const handleWin = (reward, winningTeamIds, enemyRating = 1200) => {

        setUser(currentUser => {

            const newUser = { ...currentUser };

            let leveledUp = false;

            

            // Elo Calculation

            const eloChange = calculateEloChange(newUser.rating, enemyRating, true);

            

            newUser.coins += reward.coins;

            newUser.rating += eloChange;

            newUser.xp += reward.xp;

            

            // STATS UPDATE

            newUser.stats.pvpWins += 1;

            newUser.stats.pvpTotal += 1;



            if (newUser.xp >= newUser.xpToNextLevel) {

                newUser.level += 1;

                newUser.xp -= newUser.xpToNextLevel;

                newUser.xpToNextLevel = Math.floor(newUser.xpToNextLevel * 1.5);

                newUser.coins += 1000;

                newUser.gems += 5;

                const newMax = getMaxEnergy(newUser.level);

                newUser.energy = Math.min(newMax, newUser.energy + 2);

                leveledUp = true;

            }

            

            if (leveledUp) setTimeout(() => setShowLevelUpModal(true), 500); 

            return newUser;

        });

        

        const idsToLevel = winningTeamIds || (activeBattle ? activeBattle.myTeam.map(p => p.id) : []);



        setMyPets(currentPets => currentPets.map(p => {

            if (!idsToLevel.includes(p.id)) return p;

            

            const newPet = { ...p }; 

            newPet.xp += 50;

            newPet.justLeveledUp = false;



            if (newPet.xp >= newPet.maxXp) {

                newPet.level++;

                newPet.xp -= newPet.maxXp;

                newPet.justLeveledUp = true;

                

                const rarityMulti = RARITIES[newPet.rarity].multi;

                const growthFactor = 1 + (0.05 * rarityMulti);



                newPet.maxHp = Math.floor(newPet.maxHp * growthFactor);

                newPet.hp = newPet.maxHp; 

                newPet.atk = Math.floor(newPet.atk * growthFactor);

                newPet.ap = Math.floor(newPet.ap * growthFactor);

                newPet.def = Math.floor(newPet.def * growthFactor);

                newPet.res = Math.floor(newPet.res * growthFactor);

                newPet.speed = Math.floor(newPet.speed * growthFactor);

                newPet.maxXp = Math.floor(newPet.maxXp * 1.2);

            }

            return newPet;

        }));



        setCurrentView('arena-hub');

      };



      const handleLose = (enemyRating = 1200) => {

          setUser(currentUser => {

              const newUser = { ...currentUser };

              const eloChange = calculateEloChange(newUser.rating, enemyRating, false);

              newUser.rating = Math.max(0, newUser.rating + eloChange); // eloChange ist negativ bei Niederlage

              // STATS UPDATE

              newUser.stats.pvpTotal += 1;

              return newUser;

          });

          setCurrentView('arena-hub');

      };



      if (!user) return <AuthScreen onLogin={handleLogin} />;



      return (

        <div className="flex flex-col h-screen bg-slate-900 font-sans text-white max-w-md mx-auto shadow-2xl overflow-hidden border-x border-slate-800 relative">

          {notification && (

            <div className={`absolute top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${notification.type === 'error' ? 'bg-red-500/90 border border-red-400 text-white' : 'bg-green-500/90 border border-green-400 text-white'}`}>

              {notification.type === 'error' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}

              <span className="font-bold text-sm shadow-black drop-shadow-md">{notification.message}</span>

            </div>

          )}

          {lootResult && <LootboxModal pet={lootResult} onClose={() => setLootResult(null)} />}

          {showLevelUpModal && (<LevelUpModal level={user.level} onClose={() => setShowLevelUpModal(false)} />)}

          <HeaderHUD user={user} />

          <main className="flex-1 relative overflow-hidden bg-slate-900">

            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>

            <div className="h-full overflow-y-auto p-4 scrollbar-hide">

              {currentView === 'menu' && (<MainMenu user={user} onArena={() => setCurrentView('arena-hub')} onPetHub={() => setCurrentView('pet-hub')} onShop={() => setCurrentView('shop')} onMarketplace={() => setCurrentView('marketplace')} onLeaderboard={() => setCurrentView('leaderboard')} />)}

              {currentView === 'shop' && <ShopScreen onBack={() => setCurrentView('menu')} onBuyBox={buyLootbox} />}

              {currentView === 'marketplace' && <MarketplaceScreen user={user} listings={marketListings} onBack={() => setCurrentView('menu')} onBuy={handleBuyMarket} onSell={handleSellMarket} myPets={myPets} />}

              {currentView === 'leaderboard' && <LeaderboardScreen user={user} onBack={() => setCurrentView('menu')} />}

              {currentView === 'arena-hub' && (<ArenaHub onBack={() => setCurrentView('menu')} onBattle={startBattle} onTeam={() => setCurrentView('team-edit')}/>)}

              {currentView === 'pet-hub' && (<PetHub onBack={() => setCurrentView('menu')} onInventory={() => setCurrentView('inventory')} onItemInventory={() => setCurrentView('item-inventory')} onBreed={() => setCurrentView('breeding')} onHatchery={() => setCurrentView('hatchery')}/>)}

              {currentView === 'hatchery' && (<HatcheryScreen pets={myPets} user={user} onBack={() => setCurrentView('pet-hub')} onHatchEgg={hatchEgg}/>)}

              {currentView === 'item-inventory' && (<ItemInventoryScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onStartIncubation={startIncubation} user={user} />)}

              {currentView === 'team-edit' && (<TeamEditScreen user={user} pets={myPets} onBack={() => setCurrentView('arena-hub')} onAddPet={(slotIndex) => { setSelectedSlotForTeam(slotIndex); setCurrentView('team-select-pet'); }} onRemovePet={removeFromTeam}/>)}

              {currentView === 'team-select-pet' && (<InventoryScreen pets={myPets} title="Wähle Pet für Team" onBack={() => setCurrentView('team-edit')} onSelectPet={(id) => addToTeam(id)} highlightMode={true} filterEggs={true} />)}

              {currentView === 'inventory' && (<InventoryScreen pets={myPets} title="Deine Sammlung" onBack={() => setCurrentView('pet-hub')} onSelectPet={(id) => { const p = myPets.find(p => p.id === id); if (p.isEgg) return; setSelectedPetDetail(p); setCurrentView('pet-detail'); }} filterEggs={true} />)}

              {currentView === 'pet-detail' && selectedPetDetail && (<PetDetailScreen pet={selectedPetDetail} onBack={() => setCurrentView('inventory')}/>)}

              {currentView === 'breeding' && (<BreedingScreen pets={myPets} onBack={() => setCurrentView('pet-hub')} onBreed={breedPets} coins={user.coins}/>)}

              {currentView === 'battle' && activeBattle && (<BattleScreen battleState={activeBattle} setBattleState={setActiveBattle} onWin={handleWin} onLose={handleLose}/>)}

              {currentView === 'profile' && <ProfileScreen user={user} petCount={myPets.length} onViewFriend={(friend) => { setSelectedFriend(friend); setCurrentView('friend-profile'); }} onAddFriend={(id) => { if(id === user.id) { showNotification("Du kannst dich nicht selbst hinzufügen", 'error'); return;} const f = DUMMY_USERS.find(u => u.id === id); if(f) { setUser(prev => ({...prev, friends: [...prev.friends, f]})); showNotification("Freund hinzugefügt", 'success'); } else { showNotification("Spieler nicht gefunden", 'error'); } }} />}

              {currentView === 'friend-profile' && selectedFriend && <FriendProfileScreen friend={selectedFriend} onBack={() => setCurrentView('profile')} />}

              {currentView === 'settings' && (<SettingsScreen settings={settings} setSettings={setSettings} onLogout={handleLogout} />)}

            </div>

          </main>

          <BottomNav currentView={currentView} setCurrentView={setCurrentView} />

        </div>

      );

  }



  return (

    <ErrorBoundary>

        <GameContent />

    </ErrorBoundary>

  );

}