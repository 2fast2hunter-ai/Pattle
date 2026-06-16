// src/data/abilities.js
// effect types: null=pure damage, 'HEAL'=restore hp, 'STUN'=skip enemy turn, 'DOT'=damage over time, 'REVIVE'=revive ally

export const ABILITIES = {
    // ─── STANDARD ────────────────────────────────────────────────────────────
    tackle:       { id: 'tackle',       name: 'Tackle',        type: 'PHYSICAL', element: 'NORMAL',   dmgScale: 1.0, cd: 0, desc: 'A simple attack.' },

    // ─── ELEMENTAL ───────────────────────────────────────────────────────────
    fireball:     { id: 'fireball',     name: 'Fireball',      type: 'SPECIAL',  element: 'FIRE',     dmgScale: 1.5, cd: 3, desc: 'Launches a fireball.' },
    watergun:     { id: 'watergun',     name: 'Water Gun',     type: 'SPECIAL',  element: 'WATER',    dmgScale: 1.4, cd: 3, desc: 'Shoots a water jet.' },
    razorleaf:    { id: 'razorleaf',    name: 'Razor Leaf',    type: 'PHYSICAL', element: 'NATURE',   dmgScale: 1.3, cd: 3, desc: 'Sharp leaves slice the enemy.' },
    gust:         { id: 'gust',         name: 'Gust',          type: 'SPECIAL',  element: 'WIND',     dmgScale: 1.1, cd: 3, desc: 'Creates a whirlwind.' },
    rockthrow:    { id: 'rockthrow',    name: 'Rock Throw',    type: 'PHYSICAL', element: 'ROCK',     dmgScale: 1.2, cd: 3, desc: 'Hurls massive boulders.' },
    thunder:      { id: 'thunder',      name: 'Thunder',       type: 'SPECIAL',  element: 'ELECTRIC', dmgScale: 1.6, cd: 3, desc: 'A mighty lightning bolt.' },
    icebeam:      { id: 'icebeam',      name: 'Ice Beam',      type: 'SPECIAL',  element: 'ICE',      dmgScale: 1.5, cd: 3, desc: 'Freezes the opponent.' },
    earthquake:   { id: 'earthquake',   name: 'Earthquake',    type: 'PHYSICAL', element: 'EARTH',    dmgScale: 1.4, cd: 3, desc: 'Makes the ground tremble.' },

    // ─── MYSTIC & DARK ───────────────────────────────────────────────────────
    confusion:    { id: 'confusion',    name: 'Confusion',     type: 'SPECIAL',  element: 'PSYCHIC',  dmgScale: 1.4, cd: 3, desc: 'Confuses the opponent.' },
    bite:         { id: 'bite',         name: 'Bite',          type: 'PHYSICAL', element: 'DARK',     dmgScale: 1.2, cd: 3, desc: 'A brutal bite.' },
    dragonbreath: { id: 'dragonbreath', name: 'Dragon Breath', type: 'SPECIAL',  element: 'DRAGON',   dmgScale: 1.8, cd: 3, desc: 'Mystical dragon fire.' },
    shadowball:   { id: 'shadowball',   name: 'Shadow Ball',   type: 'SPECIAL',  element: 'GHOST',    dmgScale: 1.5, cd: 3, desc: 'A ball of shadow energy.' },
    moonblast:    { id: 'moonblast',    name: 'Moon Blast',    type: 'SPECIAL',  element: 'FAIRY',    dmgScale: 1.6, cd: 3, desc: 'Power of the moon.' },
    arcaneblast:  { id: 'arcaneblast',  name: 'Arcane Blast',  type: 'SPECIAL',  element: 'MAGIC',    dmgScale: 1.7, cd: 3, desc: 'Pure magical energy.' },

    // ─── PHYSICAL & TECH ─────────────────────────────────────────────────────
    karatechop:   { id: 'karatechop',   name: 'Karate Chop',   type: 'PHYSICAL', element: 'FIGHTING', dmgScale: 1.3, cd: 3, desc: 'A precise martial arts chop.' },
    ironhead:     { id: 'ironhead',     name: 'Iron Head',     type: 'PHYSICAL', element: 'METAL',    dmgScale: 1.4, cd: 3, desc: 'A hard headbutt.' },
    sludgebomb:   { id: 'sludgebomb',   name: 'Sludge Bomb',   type: 'SPECIAL',  element: 'POISON',   dmgScale: 1.2, cd: 3, desc: 'Hurls toxic sludge.' },
    laserbeam:    { id: 'laserbeam',    name: 'Laser Beam',    type: 'SPECIAL',  element: 'TECH',     dmgScale: 1.6, cd: 3, desc: 'A precise laser.' },
    sonicboom:    { id: 'sonicboom',    name: 'Sonic Boom',    type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.3, cd: 3, desc: 'Deafening sonic wave.' },

    // ─── COSMIC & SPECIAL ────────────────────────────────────────────────────
    flash:        { id: 'flash',        name: 'Flash',         type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 1.4, cd: 3, desc: 'Blinding light.' },
    chronoblast:  { id: 'chronoblast',  name: 'Chrono Blast',  type: 'SPECIAL',  element: 'TIME',     dmgScale: 1.7, cd: 3, desc: 'Manipulates time.' },
    wormhole:     { id: 'wormhole',     name: 'Wormhole',      type: 'SPECIAL',  element: 'SPACE',    dmgScale: 1.8, cd: 3, desc: 'Tears the space-time fabric.' },
    blackhole:    { id: 'blackhole',    name: 'Black Hole',    type: 'SPECIAL',  element: 'VOID',     dmgScale: 2.0, cd: 3, desc: 'Devours everything.' },
    disorder:     { id: 'disorder',     name: 'Disorder',      type: 'SPECIAL',  element: 'CHAOS',    dmgScale: 1.9, cd: 3, desc: 'Pure chaos.' },
    judgment:     { id: 'judgment',     name: 'Judgement',     type: 'SPECIAL',  element: 'ORDER',    dmgScale: 1.9, cd: 3, desc: 'Divine order.' },
    divinelight:  { id: 'divinelight',  name: 'Divine Light',  type: 'SPECIAL',  element: 'DIVINE',   dmgScale: 2.1, cd: 4, desc: 'Unearthly energy vanquishes evil.' },

    // ─── SPECIES-UNIQUE ABILITIES ─────────────────────────────────────────────

    // FIRE
    foxFlame:         { id: 'foxFlame',         name: "Fox Flame",          type: 'SPECIAL',  element: 'FIRE',     dmgScale: 1.1, cd: 3, effect: 'DOT',    effectValue: 0.12, effectDuration: 2, desc: 'Ignites the enemy for 2 turns.' },
    salamanderSear:   { id: 'salamanderSear',   name: "Salamander Sear",    type: 'SPECIAL',  element: 'FIRE',     dmgScale: 1.4, cd: 3, desc: 'Intense body heat scorches on contact.' },
    jellyScorch:      { id: 'jellyScorch',      name: "Jelly Scorch",       type: 'SPECIAL',  element: 'FIRE',     dmgScale: 1.2, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'A burning sting that stuns briefly.' },
    tigerRoar:        { id: 'tigerRoar',        name: "Tiger's Roar",       type: 'PHYSICAL', element: 'FIRE',     dmgScale: 1.6, cd: 4, desc: 'A fearsome roar that charges forward.' },
    phoenixRebirth:   { id: 'phoenixRebirth',   name: "Phoenix Rebirth",    type: 'SPECIAL',  element: 'FIRE',     dmgScale: 0.8, cd: 5, effect: 'REVIVE', effectValue: 0.3,  desc: 'Sacrifices flames to revive a fallen ally.' },

    // WATER
    goldfishGlint:    { id: 'goldfishGlint',    name: "Goldfish Glint",     type: 'SPECIAL',  element: 'WATER',    dmgScale: 1.0, cd: 3, effect: 'HEAL',   effectValue: 0.15, desc: 'A lucky shimmer that heals the user.' },
    squidInk:         { id: 'squidInk',         name: "Squid Ink",          type: 'SPECIAL',  element: 'WATER',    dmgScale: 1.1, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Blinds the enemy with ink.' },
    shellCrush:       { id: 'shellCrush',       name: "Shell Crush",        type: 'PHYSICAL', element: 'WATER',    dmgScale: 1.5, cd: 4, desc: 'Turtle slams its reinforced shell.' },
    jaws:             { id: 'jaws',             name: "Jaws",               type: 'PHYSICAL', element: 'WATER',    dmgScale: 1.8, cd: 4, desc: 'Shark tears with massive jaws.' },
    whaleSong:        { id: 'whaleSong',        name: "Whale Song",         type: 'SPECIAL',  element: 'WATER',    dmgScale: 0.6, cd: 4, effect: 'HEAL',   effectValue: 0.30, desc: 'A resonant song that heals the whole team.' },

    // NATURE
    butterflyDust:    { id: 'butterflyDust',    name: "Butterfly Dust",     type: 'SPECIAL',  element: 'NATURE',   dmgScale: 0.8, cd: 3, effect: 'HEAL',   effectValue: 0.20, desc: 'Healing pollen dusts allies.' },
    boarCharge:       { id: 'boarCharge',       name: "Boar Charge",        type: 'PHYSICAL', element: 'NATURE',   dmgScale: 1.7, cd: 4, desc: 'A headlong brutal charge.' },
    slothSlam:        { id: 'slothSlam',        name: "Slow Slam",          type: 'PHYSICAL', element: 'NATURE',   dmgScale: 1.5, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'A slow but stunning blow.' },
    wolfHowl:         { id: 'wolfHowl',         name: "Wolf Howl",          type: 'SPECIAL',  element: 'NATURE',   dmgScale: 1.3, cd: 3, desc: 'A rallying howl that empowers the strike.' },
    bearMaul:         { id: 'bearMaul',         name: "Bear Maul",          type: 'PHYSICAL', element: 'NATURE',   dmgScale: 1.9, cd: 5, effect: 'DOT',    effectValue: 0.10, effectDuration: 2, desc: 'Vicious claws leave bleeding wounds.' },

    // WIND
    beeSting:         { id: 'beeSting',         name: "Bee Sting",          type: 'PHYSICAL', element: 'WIND',     dmgScale: 1.0, cd: 3, effect: 'DOT',    effectValue: 0.08, effectDuration: 3, desc: 'Venom spreads with each heartbeat.' },
    dragonflyDart:    { id: 'dragonflyDart',    name: "Dragonfly Dart",     type: 'PHYSICAL', element: 'WIND',     dmgScale: 1.3, cd: 3, desc: 'A precision strike at high speed.' },
    peacefulGlow:     { id: 'peacefulGlow',     name: "Peaceful Glow",      type: 'SPECIAL',  element: 'WIND',     dmgScale: 0.5, cd: 4, effect: 'HEAL',   effectValue: 0.25, desc: 'Dove radiates calming light that heals.' },
    eagleDive:        { id: 'eagleDive',        name: "Eagle Dive",         type: 'PHYSICAL', element: 'WIND',     dmgScale: 1.6, cd: 4, desc: 'Plunges from altitude at full force.' },
    griffinDive:      { id: 'griffinDive',      name: "Griffin Dive",       type: 'PHYSICAL', element: 'WIND',     dmgScale: 1.8, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'A crushing aerial strike.' },

    // EARTH
    antAcid:          { id: 'antAcid',          name: "Ant Acid",           type: 'SPECIAL',  element: 'EARTH',    dmgScale: 0.9, cd: 3, effect: 'DOT',    effectValue: 0.10, effectDuration: 3, desc: 'Formic acid eats through armor.' },
    moleDig:          { id: 'moleDig',          name: "Mole Dig",           type: 'PHYSICAL', element: 'EARTH',    dmgScale: 1.4, cd: 3, desc: 'Burrows and strikes from below.' },
    bullRush:         { id: 'bullRush',         name: "Bull Rush",          type: 'PHYSICAL', element: 'EARTH',    dmgScale: 1.7, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Unstoppable charge that stuns on impact.' },
    rhinoHorn:        { id: 'rhinoHorn',        name: "Rhino Horn",         type: 'PHYSICAL', element: 'EARTH',    dmgScale: 1.6, cd: 4, desc: 'Pierces defenses with the giant horn.' },
    megaKick:         { id: 'megaKick',         name: "Mega Kick",          type: 'PHYSICAL', element: 'EARTH',    dmgScale: 2.0, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'Elephant stomp that shakes the earth.' },

    // ICE
    penguinSlide:     { id: 'penguinSlide',     name: "Penguin Slide",      type: 'PHYSICAL', element: 'ICE',      dmgScale: 1.0, cd: 3, desc: 'A sliding belly bump.' },
    seagullDive:      { id: 'seagullDive',      name: "Seagull Swoop",      type: 'PHYSICAL', element: 'ICE',      dmgScale: 1.2, cd: 3, desc: 'Quick diving strike.' },
    sealSplash:       { id: 'sealSplash',       name: "Seal Splash",        type: 'SPECIAL',  element: 'ICE',      dmgScale: 1.1, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Icy wave stuns on contact.' },
    glacialSwipe:     { id: 'glacialSwipe',     name: "Glacial Swipe",      type: 'PHYSICAL', element: 'ICE',      dmgScale: 1.5, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Bear swipe that freezes on contact.' },
    blizzardBreath:   { id: 'blizzardBreath',   name: "Blizzard Breath",    type: 'SPECIAL',  element: 'ICE',      dmgScale: 1.7, cd: 4, effect: 'DOT',    effectValue: 0.08, effectDuration: 2, desc: 'Frostbite lingers after the blast.' },

    // ELECTRIC
    zapPaw:           { id: 'zapPaw',           name: "Zap Paw",            type: 'PHYSICAL', element: 'ELECTRIC', dmgScale: 1.2, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Electric shock on contact.' },
    stormCall:        { id: 'stormCall',        name: "Storm Call",         type: 'SPECIAL',  element: 'ELECTRIC', dmgScale: 1.6, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Summons a storm that stuns.' },
    staticField:      { id: 'staticField',      name: "Static Field",       type: 'SPECIAL',  element: 'ELECTRIC', dmgScale: 1.0, cd: 3, effect: 'DOT',    effectValue: 0.10, effectDuration: 3, desc: 'Electrified air deals continuous shock.' },
    voltTackle:       { id: 'voltTackle',       name: "Volt Tackle",        type: 'PHYSICAL', element: 'ELECTRIC', dmgScale: 1.5, cd: 4, desc: 'A high-voltage body slam.' },
    thunderwing:      { id: 'thunderwing',      name: "Thunderwing",        type: 'SPECIAL',  element: 'ELECTRIC', dmgScale: 1.9, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'Wing-strike charged to maximum voltage.' },

    // LIGHT
    snailShimmer:     { id: 'snailShimmer',     name: "Snail Shimmer",      type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 0.7, cd: 3, effect: 'HEAL',   effectValue: 0.12, desc: 'Trail of light heals the user.' },
    wormGlow:         { id: 'wormGlow',         name: "Worm Glow",          type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 0.9, cd: 3, effect: 'HEAL',   effectValue: 0.18, desc: 'Bioluminescent pulse heals.' },
    swanGrace:        { id: 'swanGrace',        name: "Swan Grace",         type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 0.8, cd: 4, effect: 'HEAL',   effectValue: 0.25, desc: 'Elegant light wave heals allies.' },
    holyBreath:       { id: 'holyBreath',       name: "Holy Breath",        type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 0.9, cd: 4, effect: 'HEAL',   effectValue: 0.20, desc: 'Pegasus breathes healing light.' },
    royalBlessing:    { id: 'royalBlessing',    name: "Royal Blessing",     type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 0.5, cd: 5, effect: 'REVIVE', effectValue: 0.40, desc: 'White Dragon revives a fallen ally.' },

    // DARK
    toadPoison:       { id: 'toadPoison',       name: "Toad Poison",        type: 'SPECIAL',  element: 'DARK',     dmgScale: 0.8, cd: 3, effect: 'DOT',    effectValue: 0.15, effectDuration: 3, desc: 'Toxic skin secretion poisons the enemy.' },
    ravenPeck:        { id: 'ravenPeck',        name: "Raven Peck",         type: 'PHYSICAL', element: 'DARK',     dmgScale: 1.3, cd: 3, desc: 'Vicious beak strike.' },
    shadowLeap:       { id: 'shadowLeap',       name: "Shadow Leap",        type: 'PHYSICAL', element: 'DARK',     dmgScale: 1.4, cd: 3, effect: 'DOT',    effectValue: 0.10, effectDuration: 2, desc: 'Cat leaps from shadows, claws leave marks.' },
    pantherPounce:    { id: 'pantherPounce',    name: "Panther Pounce",     type: 'PHYSICAL', element: 'DARK',     dmgScale: 1.7, cd: 4, desc: 'Silent ambush at full force.' },
    voidBreath:       { id: 'voidBreath',       name: "Void Breath",        type: 'SPECIAL',  element: 'DARK',     dmgScale: 1.8, cd: 5, effect: 'DOT',    effectValue: 0.12, effectDuration: 3, desc: 'Dark Dragon corrupts with dark energy.' },

    // GHOST
    soulRip:          { id: 'soulRip',          name: "Soul Rip",           type: 'SPECIAL',  element: 'GHOST',    dmgScale: 1.3, cd: 4, effect: 'REVIVE', effectValue: 0.25, desc: 'Spirit tears life force to revive an ally.' },
    ghostGaze:        { id: 'ghostGaze',        name: "Ghost Gaze",         type: 'SPECIAL',  element: 'GHOST',    dmgScale: 1.0, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Haunting stare that paralyzes.' },
    antelopeSprint:   { id: 'antelopeSprint',   name: "Phantom Sprint",     type: 'PHYSICAL', element: 'GHOST',    dmgScale: 1.5, cd: 3, desc: 'Charges through enemies like a ghost.' },
    haunt:            { id: 'haunt',            name: "Haunt",              type: 'SPECIAL',  element: 'GHOST',    dmgScale: 0.9, cd: 3, effect: 'DOT',    effectValue: 0.12, effectDuration: 3, desc: 'Ghostly curse haunts the enemy.' },
    soulRoar:         { id: 'soulRoar',         name: "Soul Roar",          type: 'SPECIAL',  element: 'GHOST',    dmgScale: 1.6, cd: 4, effect: 'REVIVE', effectValue: 0.35, desc: 'Ghost Lion roars an ally back to life.' },

    // MAGIC
    beetleBash:       { id: 'beetleBash',       name: "Beetle Bash",        type: 'PHYSICAL', element: 'MAGIC',    dmgScale: 1.4, cd: 3, desc: 'Magical horn strike.' },
    peacockDazzle:    { id: 'peacockDazzle',    name: "Peacock Dazzle",     type: 'SPECIAL',  element: 'MAGIC',    dmgScale: 0.8, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Mesmerizing display stuns the enemy.' },
    hatTrick:         { id: 'hatTrick',         name: "Hat Trick",          type: 'SPECIAL',  element: 'MAGIC',    dmgScale: 1.5, cd: 4, desc: 'Conjures a surprise magical blast.' },
    saberSlash:       { id: 'saberSlash',       name: "Saber Slash",        type: 'PHYSICAL', element: 'MAGIC',    dmgScale: 1.7, cd: 4, desc: 'Ancient saber cuts with magical force.' },
    unicornHeal:      { id: 'unicornHeal',      name: "Unicorn Heal",       type: 'SPECIAL',  element: 'MAGIC',    dmgScale: 0.4, cd: 4, effect: 'HEAL',   effectValue: 0.35, desc: 'Unicorn horn channels pure healing magic.' },

    // PSYCHIC
    squirrelScatter:  { id: 'squirrelScatter',  name: "Nut Barrage",        type: 'PHYSICAL', element: 'PSYCHIC',  dmgScale: 1.1, cd: 3, desc: 'Rapid-fire nut projectiles.' },
    toucanBeak:       { id: 'toucanBeak',       name: "Toucan Beak",        type: 'PHYSICAL', element: 'PSYCHIC',  dmgScale: 1.3, cd: 3, desc: 'Psychically-charged beak strike.' },
    flamingoDance:    { id: 'flamingoDance',    name: "Flamingo Dance",     type: 'SPECIAL',  element: 'PSYCHIC',  dmgScale: 0.9, cd: 3, effect: 'HEAL',   effectValue: 0.20, desc: 'Hypnotic dance channels healing energy.' },
    giraffe_sight:    { id: 'giraffe_sight',    name: "Farsight",           type: 'SPECIAL',  element: 'PSYCHIC',  dmgScale: 1.5, cd: 4, desc: 'Psychic blast from high altitude.' },
    hammerheadSense:  { id: 'hammerheadSense',  name: "Electroreception",   type: 'SPECIAL',  element: 'PSYCHIC',  dmgScale: 1.4, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Detects and disrupts nerve signals.' },

    // FIGHTING
    crabClaw:         { id: 'crabClaw',         name: "Crab Claw",          type: 'PHYSICAL', element: 'FIGHTING', dmgScale: 1.3, cd: 3, desc: 'Vice-grip claw attack.' },
    spiderWeb:        { id: 'spiderWeb',        name: "Spider Web",         type: 'SPECIAL',  element: 'FIGHTING', dmgScale: 0.7, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Binds the enemy in sticky web.' },
    dogBite:          { id: 'dogBite',          name: "Dog Bite",           type: 'PHYSICAL', element: 'FIGHTING', dmgScale: 1.4, cd: 3, desc: 'Tenacious jaw clamp.' },
    kangarooKick:     { id: 'kangarooKick',     name: "Kangaroo Kick",      type: 'PHYSICAL', element: 'FIGHTING', dmgScale: 1.7, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Devastating hind-leg kick.' },
    horseStrike:      { id: 'horseStrike',      name: "Horse Strike",       type: 'PHYSICAL', element: 'FIGHTING', dmgScale: 1.6, cd: 4, desc: 'Full-speed hoofed charge.' },

    // METAL
    steelShell:       { id: 'steelShell',       name: "Steel Shell",        type: 'PHYSICAL', element: 'METAL',    dmgScale: 1.2, cd: 3, desc: 'Shell slam with armored body.' },
    scorpionStab:     { id: 'scorpionStab',     name: "Scorpion Stab",      type: 'PHYSICAL', element: 'METAL',    dmgScale: 1.3, cd: 3, effect: 'DOT',    effectValue: 0.10, effectDuration: 2, desc: 'Metal tail injects slow-acting venom.' },
    bisonBash:        { id: 'bisonBash',        name: "Bison Bash",         type: 'PHYSICAL', element: 'METAL',    dmgScale: 1.6, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Iron-horned charge.' },
    gorillaPound:     { id: 'gorillaPound',     name: "Gorilla Pound",      type: 'PHYSICAL', element: 'METAL',    dmgScale: 1.8, cd: 4, desc: 'Metal-fisted ground pound.' },
    dragonForge:      { id: 'dragonForge',      name: "Dragon Forge",       type: 'SPECIAL',  element: 'METAL',    dmgScale: 2.0, cd: 5, desc: 'Forges a molten metal blast.' },

    // ROCK
    stoneBeetleCrush: { id: 'stoneBeetleCrush', name: "Stone Crush",        type: 'PHYSICAL', element: 'ROCK',     dmgScale: 1.3, cd: 3, desc: 'Armored carapace slams down.' },
    rockScorpionSting:{ id: 'rockScorpionSting',name: "Rock Sting",         type: 'PHYSICAL', element: 'ROCK',     dmgScale: 1.2, cd: 3, effect: 'DOT',    effectValue: 0.08, effectDuration: 2, desc: 'Stone-tipped tail injects toxin.' },
    ibexHorn:         { id: 'ibexHorn',         name: "Ibex Horn",          type: 'PHYSICAL', element: 'ROCK',     dmgScale: 1.5, cd: 3, desc: 'Curved horns strike with mountain force.' },
    mammothTusk:      { id: 'mammothTusk',      name: "Mammoth Tusk",       type: 'PHYSICAL', element: 'ROCK',     dmgScale: 1.8, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Ancient tusks shake the earth on impact.' },
    golemSmash:       { id: 'golemSmash',       name: "Golem Smash",        type: 'PHYSICAL', element: 'ROCK',     dmgScale: 2.1, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'A seismic ground smash.' },

    // POISON
    caterpillarSpit:  { id: 'caterpillarSpit',  name: "Caterpillar Spit",   type: 'SPECIAL',  element: 'POISON',   dmgScale: 0.8, cd: 3, effect: 'DOT',    effectValue: 0.10, effectDuration: 3, desc: 'Venomous silk corrodes over time.' },
    ratBite:          { id: 'ratBite',          name: "Rat Bite",           type: 'PHYSICAL', element: 'POISON',   dmgScale: 1.1, cd: 3, effect: 'DOT',    effectValue: 0.08, effectDuration: 2, desc: 'Disease-ridden bite lingers.' },
    stonefishSpines:  { id: 'stonefishSpines',  name: "Stonefish Spines",   type: 'PHYSICAL', element: 'POISON',   dmgScale: 1.3, cd: 3, effect: 'DOT',    effectValue: 0.15, effectDuration: 3, desc: 'Most venomous spines in the sea.' },
    poisonFrogSpit:   { id: 'poisonFrogSpit',   name: "Toxic Spit",         type: 'SPECIAL',  element: 'POISON',   dmgScale: 1.0, cd: 3, effect: 'DOT',    effectValue: 0.12, effectDuration: 3, desc: 'Dart frog toxin on impact.' },
    worldVenom:       { id: 'worldVenom',       name: "World Venom",        type: 'SPECIAL',  element: 'POISON',   dmgScale: 1.4, cd: 4, effect: 'DOT',    effectValue: 0.18, effectDuration: 3, desc: 'Snake venom that spreads through everything.' },

    // DRAGON
    greenDragonClaw:  { id: 'greenDragonClaw',  name: "Forest Claw",        type: 'PHYSICAL', element: 'DRAGON',   dmgScale: 1.5, cd: 4, effect: 'DOT',    effectValue: 0.08, effectDuration: 2, desc: 'Poisoned claws leave lasting wounds.' },
    yellowDragonBeam: { id: 'yellowDragonBeam', name: "Solar Beam",         type: 'SPECIAL',  element: 'DRAGON',   dmgScale: 1.7, cd: 4, desc: 'Charges then releases solar power.' },
    blueDragonWave:   { id: 'blueDragonWave',   name: "Tidal Wave",         type: 'SPECIAL',  element: 'DRAGON',   dmgScale: 1.6, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Massive wave stuns everything in its path.' },
    redDragonFire:    { id: 'redDragonFire',    name: "Inferno",            type: 'SPECIAL',  element: 'DRAGON',   dmgScale: 2.0, cd: 5, effect: 'DOT',    effectValue: 0.10, effectDuration: 2, desc: 'All-consuming flame.' },
    prismaticBlast:   { id: 'prismaticBlast',   name: "Prismatic Blast",    type: 'SPECIAL',  element: 'DRAGON',   dmgScale: 2.2, cd: 5, desc: 'All-element dragon blast.' },

    // FAIRY
    gnomeTrick:       { id: 'gnomeTrick',       name: "Gnome Trick",        type: 'SPECIAL',  element: 'FAIRY',    dmgScale: 1.1, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'A mischievous spell that confuses.' },
    rabbitHop:        { id: 'rabbitHop',        name: "Lucky Hop",          type: 'PHYSICAL', element: 'FAIRY',    dmgScale: 1.0, cd: 3, effect: 'HEAL',   effectValue: 0.12, desc: 'Lucky rabbit delivers a healing strike.' },
    greenHatSpell:    { id: 'greenHatSpell',    name: "Green Magic",        type: 'SPECIAL',  element: 'FAIRY',    dmgScale: 1.3, cd: 3, desc: 'Hat conjures a nature-fairy blast.' },
    pinkCatPurr:      { id: 'pinkCatPurr',      name: "Pink Purr",          type: 'SPECIAL',  element: 'FAIRY',    dmgScale: 0.6, cd: 3, effect: 'HEAL',   effectValue: 0.22, desc: 'Soothing purr restores vitality.' },
    fairyQueenWave:   { id: 'fairyQueenWave',   name: "Queen's Wave",       type: 'SPECIAL',  element: 'FAIRY',    dmgScale: 0.7, cd: 5, effect: 'REVIVE', effectValue: 0.30, desc: 'Royal blessing revives a fallen ally.' },

    // TECH
    cyberMouseZap:    { id: 'cyberMouseZap',    name: "Cyber Zap",          type: 'SPECIAL',  element: 'TECH',     dmgScale: 1.0, cd: 3, desc: 'Electric rodent shock.' },
    cyberChickenPeck: { id: 'cyberChickenPeck', name: "Laser Peck",         type: 'PHYSICAL', element: 'TECH',     dmgScale: 1.2, cd: 3, desc: 'Laser-guided beak strike.' },
    droneMissile:     { id: 'droneMissile',     name: "Drone Missile",      type: 'SPECIAL',  element: 'TECH',     dmgScale: 1.7, cd: 4, desc: 'Precision guided munition.' },
    cyberMooseRam:    { id: 'cyberMooseRam',    name: "Cyber Ram",          type: 'PHYSICAL', element: 'TECH',     dmgScale: 1.6, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Reinforced antlers slam at full speed.' },
    systemCrash:      { id: 'systemCrash',      name: "System Crash",       type: 'SPECIAL',  element: 'TECH',     dmgScale: 1.5, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Overloads enemy systems.' },

    // SOUND
    cricketChirp:     { id: 'cricketChirp',     name: "Sonic Chirp",        type: 'SPECIAL',  element: 'SOUND',    dmgScale: 0.9, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Ultrasonic frequency stuns the enemy.' },
    parrotMimic:      { id: 'parrotMimic',      name: "Parrot Mimic",       type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.2, cd: 3, desc: "Copies and amplifies the enemy's power." },
    batScream:        { id: 'batScream',        name: "Bat Scream",         type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.3, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Echolocation blast disorientation.' },
    owlHowl:          { id: 'owlHowl',          name: "Owl Howl",           type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.1, cd: 3, desc: 'Eerie shriek saps willpower.' },
    orcaSonar:        { id: 'orcaSonar',        name: "Orca Sonar",         type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.8, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'High-power sonar burst.' },

    // TIME
    coralSlow:        { id: 'coralSlow',        name: "Coral Slow",         type: 'SPECIAL',  element: 'TIME',     dmgScale: 0.8, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Ancient coral slows time around the enemy.' },
    lizardRegen:      { id: 'lizardRegen',      name: "Lizard Regen",       type: 'SPECIAL',  element: 'TIME',     dmgScale: 0.6, cd: 3, effect: 'HEAL',   effectValue: 0.20, desc: 'Regenerative ability restores vitality.' },
    camelEndure:      { id: 'camelEndure',      name: "Camel Endure",       type: 'PHYSICAL', element: 'TIME',     dmgScale: 1.3, cd: 4, effect: 'HEAL',   effectValue: 0.15, desc: 'Endurance strike that heals the user.' },
    crocoSnap:        { id: 'crocoSnap',        name: "Croco Snap",         type: 'PHYSICAL', element: 'TIME',     dmgScale: 1.7, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Prehistoric jaw snap.' },
    hippoCharge:      { id: 'hippoCharge',      name: "Hippo Charge",       type: 'PHYSICAL', element: 'TIME',     dmgScale: 1.9, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'Territorial river charge.' },

    // SPACE
    cometStrike:      { id: 'cometStrike',      name: "Comet Strike",       type: 'SPECIAL',  element: 'SPACE',    dmgScale: 1.6, cd: 4, desc: 'Orbital impact at terminal velocity.' },
    starLight:        { id: 'starLight',        name: "Starlight",          type: 'SPECIAL',  element: 'SPACE',    dmgScale: 0.7, cd: 3, effect: 'HEAL',   effectValue: 0.25, desc: 'Star Being radiates healing light.' },
    alienAbduct:      { id: 'alienAbduct',      name: "Alien Abduct",       type: 'SPECIAL',  element: 'SPACE',    dmgScale: 1.4, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Tractor beam momentarily stuns.' },
    planetCrush:      { id: 'planetCrush',      name: "Planet Crush",       type: 'SPECIAL',  element: 'SPACE',    dmgScale: 2.0, cd: 5, desc: 'Gravitational collapse attack.' },
    dimensionRip:     { id: 'dimensionRip',     name: "Dimension Rip",      type: 'SPECIAL',  element: 'SPACE',    dmgScale: 1.5, cd: 4, effect: 'DOT',    effectValue: 0.12, effectDuration: 3, desc: 'Tears reality, causing lasting dimensional damage.' },

    // VOID
    voidWormHole:     { id: 'voidWormHole',     name: "Void Tunnel",        type: 'SPECIAL',  element: 'VOID',     dmgScale: 1.3, cd: 3, effect: 'DOT',    effectValue: 0.10, effectDuration: 2, desc: 'Opens a void tunnel that drains life.' },
    voidSpiderVenom:  { id: 'voidSpiderVenom',  name: "Void Venom",         type: 'PHYSICAL', element: 'VOID',     dmgScale: 1.1, cd: 3, effect: 'DOT',    effectValue: 0.15, effectDuration: 3, desc: 'Void-corrupted venom decays the target.' },
    voidBleating:     { id: 'voidBleating',     name: "Void Bleat",         type: 'SPECIAL',  element: 'VOID',     dmgScale: 0.9, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Eerie bleat resonates in the void.' },
    voidTentacle:     { id: 'voidTentacle',     name: "Void Tentacle",      type: 'PHYSICAL', element: 'VOID',     dmgScale: 1.5, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Reality-bending tentacle strike.' },
    voidDragonBreath: { id: 'voidDragonBreath', name: "Void Breath",        type: 'SPECIAL',  element: 'VOID',     dmgScale: 2.1, cd: 5, effect: 'DOT',    effectValue: 0.14, effectDuration: 3, desc: 'Void Dragon exhales pure entropy.' },

    // CHAOS
    teaPot:           { id: 'teaPot',           name: "Boiling Tea",        type: 'SPECIAL',  element: 'CHAOS',    dmgScale: 1.0, cd: 3, effect: 'DOT',    effectValue: 0.08, effectDuration: 2, desc: 'Scalding tea burns over time.' },
    raccoonRaid:      { id: 'raccoonRaid',      name: "Raccoon Raid",       type: 'PHYSICAL', element: 'CHAOS',    dmgScale: 1.3, cd: 3, desc: 'Chaotic grab-and-strike.' },
    lynxPounce:       { id: 'lynxPounce',       name: "Lynx Pounce",        type: 'PHYSICAL', element: 'CHAOS',    dmgScale: 1.5, cd: 3, desc: 'Agile ambush strike.' },
    monkeyMayhem:     { id: 'monkeyMayhem',     name: "Monkey Mayhem",      type: 'PHYSICAL', element: 'CHAOS',    dmgScale: 1.1, cd: 3, effect: 'STUN',   effectDuration: 1, desc: 'Frantic multi-hit attack.' },
    devilsGrasp:      { id: 'devilsGrasp',      name: "Devil's Grasp",      type: 'SPECIAL',  element: 'CHAOS',    dmgScale: 1.9, cd: 5, effect: 'DOT',    effectValue: 0.14, effectDuration: 3, desc: 'Hellfire grip burns from within.' },

    // ORDER
    yingStrike:       { id: 'yingStrike',       name: "Ying Strike",        type: 'SPECIAL',  element: 'ORDER',    dmgScale: 1.2, cd: 3, effect: 'HEAL',   effectValue: 0.10, desc: 'Balance strike that heals as it damages.' },
    yangStrike:       { id: 'yangStrike',       name: "Yang Strike",        type: 'PHYSICAL', element: 'ORDER',    dmgScale: 1.2, cd: 3, desc: 'Counter-force physical strike.' },
    royalMane:        { id: 'royalMane',        name: "Royal Mane",         type: 'PHYSICAL', element: 'ORDER',    dmgScale: 1.6, cd: 4, desc: 'Majestic lion charge backed by order.' },
    dinoStomp:        { id: 'dinoStomp',        name: "Dino Stomp",         type: 'PHYSICAL', element: 'ORDER',    dmgScale: 1.8, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Primal stomp reverberates with order.' },
    divineRevive:     { id: 'divineRevive',     name: "Divine Revive",      type: 'SPECIAL',  element: 'ORDER',    dmgScale: 0.3, cd: 5, effect: 'REVIVE', effectValue: 0.50, desc: 'Angel calls a fallen ally back with divine grace.' },

    // MYTHIC
    infernoBlast:     { id: 'infernoBlast',     name: "Inferno Blast",      type: 'SPECIAL',  element: 'FIRE',     dmgScale: 2.5, cd: 5, effect: 'DOT',    effectValue: 0.15, effectDuration: 3, desc: 'Inferno Drake unleashes catastrophic fire.' },
    abyssalCrush:     { id: 'abyssalCrush',     name: "Abyssal Crush",      type: 'PHYSICAL', element: 'WATER',    dmgScale: 2.5, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'Abyssal Titan crushes with oceanic pressure.' },
    worldConstrict:   { id: 'worldConstrict',   name: "World Constrict",    type: 'PHYSICAL', element: 'NATURE',   dmgScale: 2.3, cd: 5, effect: 'DOT',    effectValue: 0.18, effectDuration: 3, desc: 'World Serpent coils around all life.' },

    // SECRET
    chimeraStrike:    { id: 'chimeraStrike',    name: "Chimera Strike",     type: 'PHYSICAL', element: 'CHAOS',    dmgScale: 2.2, cd: 5, desc: 'Three-headed attack strikes all at once.' },
    voidWalk:         { id: 'voidWalk',         name: "Void Walk",          type: 'SPECIAL',  element: 'VOID',     dmgScale: 1.8, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Phases through reality to strike.' },
    phoenixLordFlame: { id: 'phoenixLordFlame', name: "Lord Flame",         type: 'SPECIAL',  element: 'FIRE',     dmgScale: 2.3, cd: 5, effect: 'REVIVE', effectValue: 0.40, desc: 'Legendary phoenix flame revives an ally.' },
    krakenTentacles:  { id: 'krakenTentacles',  name: "Kraken Tentacles",   type: 'PHYSICAL', element: 'WATER',    dmgScale: 2.0, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'All tentacles strike at once.' },
    gaiaHeal:         { id: 'gaiaHeal',         name: "Gaia Heal",          type: 'SPECIAL',  element: 'NATURE',   dmgScale: 0.5, cd: 5, effect: 'REVIVE', effectValue: 0.45, desc: "Earth's guardian revives fallen life." },
    stormSurge:       { id: 'stormSurge',       name: "Storm Surge",        type: 'SPECIAL',  element: 'ELECTRIC', dmgScale: 2.2, cd: 5, effect: 'DOT',    effectValue: 0.15, effectDuration: 3, desc: 'Continuous lightning storm.' },
    timeRip:          { id: 'timeRip',          name: "Time Rip",           type: 'SPECIAL',  element: 'TIME',     dmgScale: 2.0, cd: 5, effect: 'STUN',   effectDuration: 1, desc: 'Tears the enemy out of the time stream.' },
    starDevour:       { id: 'starDevour',       name: "Star Devour",        type: 'SPECIAL',  element: 'SPACE',    dmgScale: 2.4, cd: 5, desc: 'Consumes a star and releases the energy.' },
    mechaDragonBeam:  { id: 'mechaDragonBeam',  name: "Mecha Beam",         type: 'SPECIAL',  element: 'METAL',    dmgScale: 2.2, cd: 5, effect: 'DOT',    effectValue: 0.10, effectDuration: 3, desc: 'Sustained beam from full mechanical power.' },
    shadowBlade:      { id: 'shadowBlade',      name: "Shadow Blade",       type: 'PHYSICAL', element: 'DARK',     dmgScale: 2.1, cd: 4, effect: 'DOT',    effectValue: 0.15, effectDuration: 2, desc: "Assassin's blade leaves a cursed wound." },
    crystalHorn:      { id: 'crystalHorn',      name: "Crystal Horn",       type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 0.6, cd: 5, effect: 'REVIVE', effectValue: 0.50, desc: 'Crystal unicorn restores life with pure light.' },
    dutchmansCall:    { id: 'dutchmansCall',    name: "Dutchman's Call",    type: 'SPECIAL',  element: 'GHOST',    dmgScale: 1.6, cd: 5, effect: 'REVIVE', effectValue: 0.35, desc: 'The ghostly ship calls lost souls back.' },
    bassExplosion:    { id: 'bassExplosion',    name: "Bass Explosion",     type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.9, cd: 4, effect: 'STUN',   effectDuration: 1, desc: 'Subwoofer blast stuns everything nearby.' },
    frostGiantSlam:   { id: 'frostGiantSlam',   name: "Frost Giant Slam",   type: 'PHYSICAL', element: 'ICE',      dmgScale: 2.3, cd: 5, effect: 'STUN',   effectDuration: 1, desc: "A titan's ice-fist crushes everything." },
    deathBlossom:     { id: 'deathBlossom',     name: "Death Blossom",      type: 'SPECIAL',  element: 'POISON',   dmgScale: 1.2, cd: 4, effect: 'DOT',    effectValue: 0.20, effectDuration: 3, desc: 'Beautiful petals carry lethal poison.' },
};

// Maps every species key to its unique ability ID
export const SPECIES_ABILITY_MAP = {
    // FIRE
    FIRE_FOX:              'foxFlame',
    FIRE_SALAMANDER:       'salamanderSear',
    FIRE_JELLYFISH:        'jellyScorch',
    FIRE_TIGER:            'tigerRoar',
    FIRE_PHOENIX:          'phoenixRebirth',
    // WATER
    WATER_GOLDFISH:        'goldfishGlint',
    WATER_SQUID:           'squidInk',
    WATER_TURTLE:          'shellCrush',
    WATER_SHARK:           'jaws',
    WATER_WHALE:           'whaleSong',
    // NATURE
    NATURE_BUTTERFLY:      'butterflyDust',
    NATURE_BOAR:           'boarCharge',
    NATURE_SLOTH:          'slothSlam',
    NATURE_WOLF:           'wolfHowl',
    NATURE_BEAR:           'bearMaul',
    // WIND
    WIND_BEE:              'beeSting',
    WIND_DRAGONFLY:        'dragonflyDart',
    WIND_DOVE:             'peacefulGlow',
    WIND_EAGLE:            'eagleDive',
    WIND_GRIFFIN:          'griffinDive',
    // EARTH
    EARTH_ANT:             'antAcid',
    EARTH_MOLE:            'moleDig',
    EARTH_BULL:            'bullRush',
    EARTH_RHINO:           'rhinoHorn',
    EARTH_ELEPHANT:        'megaKick',
    // ICE
    ICE_PENGUIN:           'penguinSlide',
    ICE_SEAGULL:           'seagullDive',
    ICE_SEAL:              'sealSplash',
    ICE_POLARBEAR:         'glacialSwipe',
    ICE_YETI:              'blizzardBreath',
    // ELECTRIC
    ELECTRIC_RAY:          'staticField',
    ELECTRIC_EEL:          'voltTackle',
    ELECTRIC_CATFISH:      'zapPaw',
    ELECTRIC_CAT:          'stormCall',
    ELECTRIC_THUNDERBIRD:  'thunderwing',
    // LIGHT
    LIGHT_SNAIL:           'snailShimmer',
    LIGHT_WORM:            'wormGlow',
    LIGHT_SWAN:            'swanGrace',
    LIGHT_PEGASUS:         'holyBreath',
    LIGHT_DRAGON:          'royalBlessing',
    // DARK
    DARK_TOAD:             'toadPoison',
    DARK_RAVEN:            'ravenPeck',
    DARK_CAT:              'shadowLeap',
    DARK_PANTHER:          'pantherPounce',
    DARK_DRAGON:           'voidBreath',
    // GHOST
    GHOST_SPIRIT:          'soulRip',
    GHOST_DEER:            'ghostGaze',
    GHOST_ANTELOPE:        'antelopeSprint',
    GHOST_JELLYFISH:       'haunt',
    GHOST_LION:            'soulRoar',
    // MAGIC
    MAGIC_BEETLE:          'beetleBash',
    MAGIC_PEACOCK:         'peacockDazzle',
    MAGIC_HAT:             'hatTrick',
    MAGIC_SABERTOOTH:      'saberSlash',
    MAGIC_UNICORN:         'unicornHeal',
    // PSYCHIC
    PSYCHIC_SQUIRREL:      'squirrelScatter',
    PSYCHIC_TOUCAN:        'toucanBeak',
    PSYCHIC_FLAMINGO:      'flamingoDance',
    PSYCHIC_GIRAFFE:       'giraffe_sight',
    PSYCHIC_HAMMERHEAD:    'hammerheadSense',
    // FIGHTING
    FIGHTING_CRAB:         'crabClaw',
    FIGHTING_SPIDER:       'spiderWeb',
    FIGHTING_DOG:          'dogBite',
    FIGHTING_KANGAROO:     'kangarooKick',
    FIGHTING_HORSE:        'horseStrike',
    // METAL
    METAL_TURTLE:          'steelShell',
    METAL_SCORPION:        'scorpionStab',
    METAL_BISON:           'bisonBash',
    METAL_GORILLA:         'gorillaPound',
    METAL_DRAGON:          'dragonForge',
    // ROCK
    ROCK_BEETLE:           'stoneBeetleCrush',
    ROCK_SCORPION:         'rockScorpionSting',
    ROCK_IBEX:             'ibexHorn',
    ROCK_MAMMOTH:          'mammothTusk',
    ROCK_GOLEM:            'golemSmash',
    // POISON
    POISON_CATERPILLAR:    'caterpillarSpit',
    POISON_RAT:            'ratBite',
    POISON_STONEFISH:      'stonefishSpines',
    POISON_FROG:           'poisonFrogSpit',
    POISON_SNAKE:          'worldVenom',
    // DRAGON
    DRAGON_GREEN:          'greenDragonClaw',
    DRAGON_YELLOW:         'yellowDragonBeam',
    DRAGON_BLUE:           'blueDragonWave',
    DRAGON_RED:            'redDragonFire',
    DRAGON_COLOR:          'prismaticBlast',
    // FAIRY
    FAIRY_GNOME:           'gnomeTrick',
    FAIRY_RABBIT:          'rabbitHop',
    FAIRY_HAT:             'greenHatSpell',
    FAIRY_CAT:             'pinkCatPurr',
    FAIRY_QUEEN:           'fairyQueenWave',
    // TECH
    TECH_MOUSE:            'cyberMouseZap',
    TECH_CHICKEN:          'cyberChickenPeck',
    TECH_DRONE:            'droneMissile',
    TECH_MOOSE:            'cyberMooseRam',
    TECH_ROBOT:            'systemCrash',
    // SOUND
    SOUND_CRICKET:         'cricketChirp',
    SOUND_PARROT:          'parrotMimic',
    SOUND_BAT:             'batScream',
    SOUND_OWL:             'owlHowl',
    SOUND_ORCA:            'orcaSonar',
    // TIME
    TIME_CORAL:            'coralSlow',
    TIME_LIZARD:           'lizardRegen',
    TIME_CAMEL:            'camelEndure',
    TIME_CROCODILE:        'crocoSnap',
    TIME_HIPPO:            'hippoCharge',
    // SPACE
    SPACE_COMET:           'cometStrike',
    SPACE_STAR:            'starLight',
    SPACE_ALIEN:           'alienAbduct',
    SPACE_PLANET:          'planetCrush',
    SPACE_RAINBOW:         'dimensionRip',
    // VOID
    VOID_WORM:             'voidWormHole',
    VOID_SPIDER:           'voidSpiderVenom',
    VOID_SHEEP:            'voidBleating',
    VOID_OCTOPUS:          'voidTentacle',
    VOID_DRAGON:           'voidDragonBreath',
    // CHAOS
    CHAOS_TEA:             'teaPot',
    CHAOS_RACCOON:         'raccoonRaid',
    CHAOS_LYNX:            'lynxPounce',
    CHAOS_MONKEY:          'monkeyMayhem',
    CHAOS_DEVIL:           'devilsGrasp',
    // ORDER
    ORDER_YING:            'yingStrike',
    ORDER_YANG:            'yangStrike',
    ORDER_LION:            'royalMane',
    ORDER_DINO:            'dinoStomp',
    ORDER_ANGEL:           'divineRevive',
    // MYTHIC
    MYTHIC_INFERNO_DRAKE:  'infernoBlast',
    MYTHIC_ABYSSAL_TITAN:  'abyssalCrush',
    MYTHIC_WORLD_SERPENT:  'worldConstrict',
    // SECRET
    SECRET_CHIMERA_PRIME:  'chimeraStrike',
    SECRET_VOID_WALKER:    'voidWalk',
    SECRET_PHOENIX_LORD:   'phoenixLordFlame',
    SECRET_KRAKEN_KING:    'krakenTentacles',
    SECRET_GAIA_GUARDIAN:  'gaiaHeal',
    SECRET_STORM_BRINGER:  'stormSurge',
    SECRET_TIME_WEAVER:    'timeRip',
    SECRET_STAR_EATER:     'starDevour',
    SECRET_MECHA_DRAGON:   'mechaDragonBeam',
    SECRET_SHADOW_ASSASSIN:'shadowBlade',
    SECRET_CRYSTAL_UNICORN:'crystalHorn',
    SECRET_GHOST_SHIP:     'dutchmansCall',
    SECRET_SOUND_WAVE:     'bassExplosion',
    SECRET_FROST_GIANT:    'frostGiantSlam',
    SECRET_POISON_IVY:     'deathBlossom',
};
