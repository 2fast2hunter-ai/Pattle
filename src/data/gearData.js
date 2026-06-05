// Gear data: 3 slot types (weapon / armor / accessory), 9 item templates, rarity-scaled bonuses.
// Each pet can equip one item per slot. Instance data is stored on user.gearInventory;
// equipped slot ids are stored on pet.gear.

export const GEAR_SLOTS = ['weapon', 'armor', 'accessory'];

export const GEAR_ITEMS = {
  IRON_SWORD:   { key: 'IRON_SWORD',   slot: 'weapon',    icon: '⚔️',  base: { atk: 3, ap: 1 } },
  STEEL_BLADE:  { key: 'STEEL_BLADE',  slot: 'weapon',    icon: '🗡️',  base: { atk: 5, ap: 2 } },
  DRAGON_FANG:  { key: 'DRAGON_FANG',  slot: 'weapon',    icon: '🦷',  base: { atk: 8, ap: 4 } },
  LEATHER_VEST: { key: 'LEATHER_VEST', slot: 'armor',     icon: '🛡️',  base: { def: 3, maxHp: 10 } },
  PLATE_ARMOR:  { key: 'PLATE_ARMOR',  slot: 'armor',     icon: '⚙️',  base: { def: 5, maxHp: 20 } },
  TITAN_SHELL:  { key: 'TITAN_SHELL',  slot: 'armor',     icon: '🏯',  base: { def: 8, maxHp: 35 } },
  SWIFT_RING:   { key: 'SWIFT_RING',   slot: 'accessory', icon: '💍',  base: { speed: 2, res: 1 } },
  POWER_AMULET: { key: 'POWER_AMULET', slot: 'accessory', icon: '📿',  base: { speed: 4, res: 2 } },
  COSMIC_ORB:   { key: 'COSMIC_ORB',   slot: 'accessory', icon: '🔮',  base: { speed: 6, res: 4 } },
};

export const GEAR_DROP_CHANCE_BATTLE  = 0.15;
export const GEAR_DROP_CHANCE_DUNGEON = 0.25;

// Mirrors the pet rarity drop weights from rarities.js
export const GEAR_DROP_RARITIES = {
  COMMON:       63.49,
  UNCOMMON:     20.0,
  RARE:         10.0,
  EPIC:          4.0,
  LEGENDARY:     1.5,
  MYTHIC:        0.60,
  DIVINE:        0.25,
  ANCIENT:       0.10,
  COSMIC:        0.05,
  TRANSCENDENT:  0.01,
};
