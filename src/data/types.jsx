import React from 'react';
import {
  Flame, Droplets, Leaf, Wind, Mountain, Snowflake, Zap, Sun, Moon, Ghost,
  Sparkles, Eye, Swords, Hexagon, Box, TestTube, Trophy, Heart, Cpu, Music,
  Clock, Orbit, Aperture, AlertTriangle, Gavel, Star
} from 'lucide-react';

export const TYPES = {
  FIRE:      { label: 'Fire',        color: 'text-orange-500', bg: 'bg-orange-500', bgLight: 'bg-orange-500/20', icon: <Flame /> },
  WATER:     { label: 'Water',       color: 'text-blue-500',   bg: 'bg-blue-500',   bgLight: 'bg-blue-500/20',   icon: <Droplets /> },
  NATURE:    { label: 'Nature',      color: 'text-green-500',  bg: 'bg-green-500',  bgLight: 'bg-green-500/20',  icon: <Leaf /> },
  WIND:      { label: 'Wind',        color: 'text-sky-300',    bg: 'bg-sky-400',    bgLight: 'bg-sky-400/20',    icon: <Wind /> },
  EARTH:     { label: 'Earth',       color: 'text-amber-700',  bg: 'bg-amber-700',  bgLight: 'bg-amber-700/20',  icon: <Mountain /> },
  ICE:       { label: 'Ice',         color: 'text-cyan-200',   bg: 'bg-cyan-400',   bgLight: 'bg-cyan-400/20',   icon: <Snowflake /> },
  ELECTRIC:  { label: 'Electric',    color: 'text-yellow-400', bg: 'bg-yellow-500', bgLight: 'bg-yellow-500/20', icon: <Zap /> },
  LIGHT:     { label: 'Light',       color: 'text-yellow-100', bg: 'bg-yellow-200', bgLight: 'bg-yellow-200/20', icon: <Sun /> },
  DARK:      { label: 'Dark',        color: 'text-gray-800',   bg: 'bg-gray-800',   bgLight: 'bg-gray-800/20',   icon: <Moon /> },
  GHOST:     { label: 'Ghost',       color: 'text-purple-300', bg: 'bg-purple-800', bgLight: 'bg-purple-800/20', icon: <Ghost /> },
  MAGIC:     { label: 'Magic',       color: 'text-pink-500',   bg: 'bg-pink-600',   bgLight: 'bg-pink-600/20',   icon: <Sparkles /> },
  PSYCHIC:   { label: 'Psychic',     color: 'text-fuchsia-400',bg: 'bg-fuchsia-500',bgLight: 'bg-fuchsia-500/20',icon: <Eye /> },
  FIGHTING:  { label: 'Fighting',    color: 'text-red-600',    bg: 'bg-red-600',    bgLight: 'bg-red-600/20',    icon: <Swords /> },
  METAL:     { label: 'Metal',       color: 'text-slate-400',  bg: 'bg-slate-500',  bgLight: 'bg-slate-500/20',  icon: <Hexagon /> },
  ROCK:      { label: 'Rock',        color: 'text-stone-600',  bg: 'bg-stone-600',  bgLight: 'bg-stone-600/20',  icon: <Box /> },
  POISON:    { label: 'Poison',      color: 'text-lime-500',   bg: 'bg-lime-600',   bgLight: 'bg-lime-600/20',   icon: <TestTube /> },
  DRAGON:    { label: 'Dragon',      color: 'text-indigo-500', bg: 'bg-indigo-600', bgLight: 'bg-indigo-600/20', icon: <Trophy /> },
  FAIRY:     { label: 'Fairy',       color: 'text-pink-300',   bg: 'bg-pink-400',   bgLight: 'bg-pink-400/20',   icon: <Heart /> },
  TECH:      { label: 'Tech',        color: 'text-blue-300',   bg: 'bg-blue-800',   bgLight: 'bg-blue-800/20',   icon: <Cpu /> },
  SOUND:     { label: 'Sound',       color: 'text-teal-400',   bg: 'bg-teal-500',   bgLight: 'bg-teal-500/20',   icon: <Music /> },
  TIME:      { label: 'Time',        color: 'text-amber-200',  bg: 'bg-amber-800',  bgLight: 'bg-amber-800/20',  icon: <Clock /> },
  SPACE:     { label: 'Space',       color: 'text-violet-400', bg: 'bg-violet-900', bgLight: 'bg-violet-900/20', icon: <Orbit /> },
  VOID:      { label: 'Void',        color: 'text-black',      bg: 'bg-black',      bgLight: 'bg-gray-900',      icon: <Aperture /> },
  CHAOS:     { label: 'Chaos',       color: 'text-red-400',    bg: 'bg-red-900',    bgLight: 'bg-red-900/20',    icon: <AlertTriangle /> },
  ORDER:     { label: 'Order',       color: 'text-white',      bg: 'bg-slate-400',  bgLight: 'bg-slate-400/20',  icon: <Gavel /> },
  DIVINE:    { label: 'Divine',      color: 'text-yellow-200', bg: 'bg-yellow-400', bgLight: 'bg-yellow-400/20', icon: <Star /> },
};

// Generiere die Effektivitäts-Tabelle basierend auf dem Kreislauf-Muster:
// Stark (2x) gegen die 4 VORHERIGEN Typen.
// Schwach (0.5x) gegen die 4 NÄCHSTEN Typen.
const typeKeys = Object.keys(TYPES);
const ADVANTAGES = {};

typeKeys.forEach((type, index) => {
    const superEffective = [];
    const weakAgainst = [];

    // 4 Vorherige Typen (Wrap-around)
    for (let i = 1; i <= 4; i++) {
        let targetIndex = index - i;
        if (targetIndex < 0) targetIndex += typeKeys.length;
        superEffective.push(typeKeys[targetIndex]);
    }

    // 4 Nächste Typen (Wrap-around)
    for (let i = 1; i <= 4; i++) {
        let targetIndex = (index + i) % typeKeys.length;
        weakAgainst.push(typeKeys[targetIndex]);
    }

    ADVANTAGES[type] = { super: superEffective, weak: weakAgainst };
});

export const TYPE_ADVANTAGES = ADVANTAGES;