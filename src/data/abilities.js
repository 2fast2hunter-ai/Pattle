// src/data/abilities.js

export const ABILITIES = {
    // STANDARD
    tackle:       { id: 'tackle',       name: 'Tackle',        type: 'PHYSICAL', element: 'NORMAL',   dmgScale: 1.0, cd: 0, desc: 'Ein einfacher Angriff.' },

    // ELEMENTAR
    fireball:     { id: 'fireball',     name: 'Feuerball',     type: 'SPECIAL',  element: 'FIRE',     dmgScale: 1.5, cd: 3, desc: 'Wirft einen Feuerball.' },
    watergun:     { id: 'watergun',     name: 'Aquaknarre',    type: 'SPECIAL',  element: 'WATER',    dmgScale: 1.4, cd: 3, desc: 'Spritzt Wasser.' },
    razorleaf:    { id: 'razorleaf',    name: 'Rasierblatt',   type: 'PHYSICAL', element: 'NATURE',   dmgScale: 1.3, cd: 3, desc: 'Scharfe Blätter.' },
    gust:         { id: 'gust',         name: 'Windstoß',      type: 'SPECIAL',  element: 'WIND',     dmgScale: 1.1, cd: 3, desc: 'Erzeugt einen Wirbelwind.' },
    rockthrow:    { id: 'rockthrow',    name: 'Steinwurf',     type: 'PHYSICAL', element: 'ROCK',     dmgScale: 1.2, cd: 3, desc: 'Wirft massive Felsen.' },
    thunder:      { id: 'thunder',      name: 'Donner',        type: 'SPECIAL',  element: 'ELECTRIC', dmgScale: 1.6, cd: 3, desc: 'Ein mächtiger Blitz.' },
    icebeam:      { id: 'icebeam',      name: 'Eisstrahl',     type: 'SPECIAL',  element: 'ICE',      dmgScale: 1.5, cd: 3, desc: 'Friert den Gegner ein.' },
    earthquake:   { id: 'earthquake',   name: 'Erdbeben',      type: 'PHYSICAL', element: 'EARTH',    dmgScale: 1.4, cd: 3, desc: 'Lässt den Boden beben.' },
    
    // MYSTISCH & DUNKEL
    confusion:    { id: 'confusion',    name: 'Konfusion',     type: 'SPECIAL',  element: 'PSYCHIC',  dmgScale: 1.4, cd: 3, desc: 'Verwirrt den Gegner.' },
    bite:         { id: 'bite',         name: 'Knirscher',     type: 'PHYSICAL', element: 'DARK',     dmgScale: 1.2, cd: 3, desc: 'Ein brutaler Biss.' },
    dragonbreath: { id: 'dragonbreath', name: 'Drachenatem',   type: 'SPECIAL',  element: 'DRAGON',   dmgScale: 1.8, cd: 3, desc: 'Mystisches Drachenfeuer.' },
    shadowball:   { id: 'shadowball',   name: 'Spukball',      type: 'SPECIAL',  element: 'GHOST',    dmgScale: 1.5, cd: 3, desc: 'Ein Ball aus Schatten.' },
    moonblast:    { id: 'moonblast',    name: 'Mondgewalt',    type: 'SPECIAL',  element: 'FAIRY',    dmgScale: 1.6, cd: 3, desc: 'Die Kraft des Mondes.' },
    arcaneblast:  { id: 'arcaneblast',  name: 'Arkaner Schlag',type: 'SPECIAL',  element: 'MAGIC',    dmgScale: 1.7, cd: 3, desc: 'Pure magische Energie.' },
    
    // PHYSISCH & TECHNIK
    karatechop:   { id: 'karatechop',   name: 'Karateschlag',  type: 'PHYSICAL', element: 'FIGHTING', dmgScale: 1.3, cd: 3, desc: 'Ein gezielter Handkantenschlag.' },
    ironhead:     { id: 'ironhead',     name: 'Eisenschädel',  type: 'PHYSICAL', element: 'METAL',    dmgScale: 1.4, cd: 3, desc: 'Ein harter Kopfstoß.' },
    sludgebomb:   { id: 'sludgebomb',   name: 'Matschbombe',   type: 'SPECIAL',  element: 'POISON',   dmgScale: 1.2, cd: 3, desc: 'Wirft giftigen Schlamm.' },
    laserbeam:    { id: 'laserbeam',    name: 'Laserstrahl',   type: 'SPECIAL',  element: 'TECH',     dmgScale: 1.6, cd: 3, desc: 'Ein präziser Laser.' },
    sonicboom:    { id: 'sonicboom',    name: 'Schallwelle',   type: 'SPECIAL',  element: 'SOUND',    dmgScale: 1.3, cd: 3, desc: 'Ohrenbetäubender Lärm.' },
    
    // KOSMISCH & SPEZIAL
    flash:        { id: 'flash',        name: 'Lichtblitz',    type: 'SPECIAL',  element: 'LIGHT',    dmgScale: 1.4, cd: 3, desc: 'Blendendes Licht.' },
    chronoblast:  { id: 'chronoblast',  name: 'Zeitsprung',    type: 'SPECIAL',  element: 'TIME',     dmgScale: 1.7, cd: 3, desc: 'Manipuliert die Zeit.' },
    wormhole:     { id: 'wormhole',     name: 'Wurmloch',      type: 'SPECIAL',  element: 'SPACE',    dmgScale: 1.8, cd: 3, desc: 'Riss im Raum-Zeit-Gefüge.' },
    blackhole:    { id: 'blackhole',    name: 'Schwarzes Loch',type: 'SPECIAL',  element: 'VOID',     dmgScale: 2.0, cd: 3, desc: 'Verschlingt alles.' },
    disorder:     { id: 'disorder',     name: 'Entropie',      type: 'SPECIAL',  element: 'CHAOS',    dmgScale: 1.9, cd: 3, desc: 'Pures Chaos.' },
    judgment:     { id: 'judgment',     name: 'Urteil',        type: 'SPECIAL',  element: 'ORDER',    dmgScale: 1.9, cd: 3, desc: 'Göttliche Ordnung.' },
};