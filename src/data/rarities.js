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