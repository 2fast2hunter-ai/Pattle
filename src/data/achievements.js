// Achievement definitions. id must match the key.
// check(user, projected) - user is current Firestore state, projected overlays pending increments
export const ACHIEVEMENTS = {
  firstBlood: {
    id: 'firstBlood',
    title: 'First Blood',
    titleDe: 'Erster Sieg',
    desc: 'Win your first battle',
    descDe: 'Gewinne deinen ersten Kampf',
    reward: { coins: 50 },
    trigger: 'battle_win',
    check: (_u, proj) => (proj.pvpWins || 0) >= 1,
  },
  battleHardened: {
    id: 'battleHardened',
    title: 'Battle Hardened',
    titleDe: 'Kampferprobt',
    desc: 'Win 50 battles',
    descDe: 'Gewinne 50 Kämpfe',
    reward: { coins: 500 },
    trigger: 'battle_win',
    check: (_u, proj) => (proj.pvpWins || 0) >= 50,
  },
  arenaChampion: {
    id: 'arenaChampion',
    title: 'Arena Champion',
    titleDe: 'Arena-Champion',
    desc: 'Win 200 battles',
    descDe: 'Gewinne 200 Kämpfe',
    reward: { coins: 2000, gems: 5 },
    trigger: 'battle_win',
    check: (_u, proj) => (proj.pvpWins || 0) >= 200,
  },
  towerClimber: {
    id: 'towerClimber',
    title: 'Tower Climber',
    titleDe: 'Turmkletterer',
    desc: 'Reach Tower floor 10',
    descDe: 'Erreiche Stufe 10 im Turm',
    reward: { coins: 300, gems: 2 },
    trigger: 'tower_win',
    check: (_u, proj) => (proj.towerProgress || 0) >= 10,
  },
  towerConqueror: {
    id: 'towerConqueror',
    title: 'Tower Conqueror',
    titleDe: 'Turmerobert',
    desc: 'Reach Tower floor 25',
    descDe: 'Erreiche Stufe 25 im Turm',
    reward: { coins: 1000, gems: 10 },
    trigger: 'tower_win',
    check: (_u, proj) => (proj.towerProgress || 0) >= 25,
  },
  hatchling: {
    id: 'hatchling',
    title: 'Hatchling',
    titleDe: 'Schlüpfling',
    desc: 'Hatch your first egg',
    descDe: 'Schlüpfe dein erstes Ei',
    reward: { coins: 100 },
    trigger: 'egg_hatch',
    check: (_u, proj) => (proj.hatched || 0) >= 1,
  },
  eggCollector: {
    id: 'eggCollector',
    title: 'Egg Collector',
    titleDe: 'Eisammler',
    desc: 'Hatch 25 eggs',
    descDe: 'Schlüpfe 25 Eier',
    reward: { coins: 750 },
    trigger: 'egg_hatch',
    check: (_u, proj) => (proj.hatched || 0) >= 25,
  },
  rareFind: {
    id: 'rareFind',
    title: 'Rare Find',
    titleDe: 'Seltener Fund',
    desc: 'Own a Rare or higher pet',
    descDe: 'Besitze ein Seltenes oder besseres Pet',
    reward: { coins: 200 },
    trigger: 'egg_hatch',
    check: (u) => {
      const RARE_TIER = ['RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'ANCIENT', 'COSMIC', 'TRANSCENDENT'];
      return (u.petRarityHighest && RARE_TIER.includes(u.petRarityHighest));
    },
  },
  epicTamer: {
    id: 'epicTamer',
    title: 'Epic Tamer',
    titleDe: 'Epischer Zähmer',
    desc: 'Own an Epic or higher pet',
    descDe: 'Besitze ein Episches oder besseres Pet',
    reward: { coins: 500, gems: 3 },
    trigger: 'egg_hatch',
    check: (u) => {
      const EPIC_TIER = ['EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'ANCIENT', 'COSMIC', 'TRANSCENDENT'];
      return (u.petRarityHighest && EPIC_TIER.includes(u.petRarityHighest));
    },
  },
  socialSharer: {
    id: 'socialSharer',
    title: 'Social Sharer',
    titleDe: 'Teiler',
    desc: 'Share a pet or victory',
    descDe: 'Teile ein Pet oder einen Sieg',
    reward: { coins: 150 },
    trigger: 'share',
    check: () => true,
  },
};

export const ACHIEVEMENT_TRIGGERS = {
  BATTLE_WIN: 'battle_win',
  TOWER_WIN: 'tower_win',
  EGG_HATCH: 'egg_hatch',
  SHARE: 'share',
};
