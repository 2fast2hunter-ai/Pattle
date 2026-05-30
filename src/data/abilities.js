// src/data/abilities.js

export const ABILITIES = {
    // STANDARD
    tackle:       { id: 'tackle',       name: 'Tackle',        type: 'PHYSICAL', element: 'NORMAL',   dmgScale: 1.0, cd: 0, desc: 'A simple attack.' },

    // ELEMENTAL
    fireball:     { id: 'fireball',     name: 'Fireball',      type: 'SPECIAL',  element: 'FIRE',     dmgScale: 1.5, cd: 3, desc: 'Launches a fireball.' },
    watergun:     { id: 'watergun',     name: 'Water Gun',     type: 'SPECIAL',  element: 'WATER',    dmgScale: 1.4, cd: 3, desc: 'Shoots a water jet.' },
    razorleaf:    { id: 'razorleaf',    name: 'Razor Leaf',    type: 'PHYSICAL', element: 'NATURE',   dmgScale: 1.3, cd: 3, desc: 'Sharp leaves slice the enemy.' },
    gust:         { id: 'gust',         name: 'Gust',          type: 'SPECIAL',  element: 'WIND',     dmgScale: 1.1, cd: 3, desc: 'Creates a whirlwind.' },
    rockthrow:    { id: 'rockthrow',    name: 'Rock Throw',    type: 'PHYSICAL', element: 'ROCK',     dmgScale: 1.2, cd: 3, desc: 'Hurls massive boulders.' },
    thunder:      { id: 'thunder',      name: 'Thunder',       type: 'SPECIAL',  element: 'ELECTRIC', dmgScale: 1.6, cd: 3, desc: 'A mighty lightning bolt.' },
    icebeam:      { id: 'icebeam',      name: 'Ice Beam',      type: 'SPECIAL',  element: 'ICE',      dmgScale: 1.5, cd: 3, desc: 'Freezes the opponent.' },
    earthquake:   { id: 'earthquake',   name: 'Earthquake',    type: 'PHYSICAL', element: 'EARTH',    dmgScale: 1.4, cd: 3, desc: 'Makes the ground tremble.' },

    // MYSTIC & DARK
    confusion:    { id: 'confusion',    name: 'Confusion',     type: 'SPECIAL',  element: 'PSYCHIC',  dmgScale: 1.4, cd: 3, desc: 'Confuses the opponent.' },
    bite:         { id: 'bite',         name: 'Bite',          type: 'PHYSICAL', element: 'DARK',     dmgScale: 1.2, cd: 3, desc: 'A brutal bite.' },
    dragonbreath: { id: 'dragonbreath', name: 'Dragon Breath', type: 'SPECIAL',  element: 'DRAGON',   dmgScale: 1.8, cd: 3, desc: 'Mystical dragon fire.' },
    shadowball:   { id: 'shadowball',   name: 'Shadow Ball',   type: 'SPECIAL',  element: 'GHOST',    dmgScale: 1.5, cd: 3, desc: 'A ball of shadow energy.' },
    moonblast:    { id: 'moonblast',    name: 'Moon Blast',    type: 'SPECIAL',  element: 'FAIRY',    dmgScale: 1.6, cd: 3, desc: 'Power of the moon.' },
    arcaneblast:  { id: 'arcaneblast',  name: 'Arcane Blast',  type: 'SPECIAL',  element: 'MAGIC',    dmgScale: 1.7, cd: 3, desc: 'Pure magical energy.' },

    // PHYSICAL & TECH
    karatechop:   { id: 'karatechop',   name: 'Karate Chop',   type: 'PHYSICAL', element: 'FIGHTING', dmgScale: 1.3, cd: 3, desc: 'A precise martial arts chop.' },
    ironhead:     { id: 'ironhead',     name: 'Iron Head',     type: 'PHYSICAL', element: 'METAL',    dmgScale: 1.4, cd: 3, desc: 'A hard headbutt.' },
    sludgebomb:   { id: 'sludgebomb',   name: 'Sludge Bomb',   type: 'SPECIAL',  element: 'POISON',   dmgScale: 1.2, cd: 3, desc: 'Hurls toxic sludge.' },
    laserbeam:    { id: 'laserbeam',    name: 'Laser Beam',    type: 'SPECIAL',  element: 'TECH',     dmgScale: 1.6, cd: 3, desc: 'A precise laser.' },
    sonicboom:    { id: 'sonicboom',    name: 'Sonic Boom',    type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.3, cd: 3, desc: 'Deafening sonic wave.' },

    // COSMIC & SPECIAL
    flash:        { id: 'flash',        name: 'Flash',         type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 1.4, cd: 3, desc: 'Blinding light.' },
    chronoblast:  { id: 'chronoblast',  name: 'Chrono Blast',  type: 'SPECIAL',  element: 'TIME',     dmgScale: 1.7, cd: 3, desc: 'Manipulates time.' },
    wormhole:     { id: 'wormhole',     name: 'Wormhole',      type: 'SPECIAL',  element: 'SPACE',    dmgScale: 1.8, cd: 3, desc: 'Tears the space-time fabric.' },
    blackhole:    { id: 'blackhole',    name: 'Black Hole',    type: 'SPECIAL',  element: 'VOID',     dmgScale: 2.0, cd: 3, desc: 'Devours everything.' },
    disorder:     { id: 'disorder',     name: 'Disorder',      type: 'SPECIAL',  element: 'CHAOS',    dmgScale: 1.9, cd: 3, desc: 'Pure chaos.' },
    judgment:     { id: 'judgment',     name: 'Judgement',     type: 'SPECIAL',  element: 'ORDER',    dmgScale: 1.9, cd: 3, desc: 'Divine order.' },
    divinelight:  { id: 'divinelight',  name: 'Divine Light',  type: 'SPECIAL',  element: 'DIVINE',   dmgScale: 2.1, cd: 4, desc: 'Unearthly energy vanquishes evil.' },
};