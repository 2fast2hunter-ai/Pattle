import React, { useState } from 'react';
import { ZODIAC_ANIMALS, TYPES, RARITIES } from '../data/gameData';
import { Egg } from 'lucide-react';

export default function PetAvatar({ pet, className = "w-16 h-16" }) {
  const [imgError, setImgError] = useState(false);

  if (!pet) return <div className={className} />;

  // --- FALL 1: ES IST EIN EI ---
  if (pet.isEgg) {
    const rarity = RARITIES[pet.rarity];
    // Du kannst später Bilder speichern unter: /public/eggs/common.png, etc.
    // Bis dahin nutzen wir ein schönes Icon-Fallback
    return (
      <div className={`${className} flex items-center justify-center rounded-2xl border-4 ${rarity.border} ${rarity.bg} shadow-inner relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <Egg className={`w-2/3 h-2/3 text-white drop-shadow-md animate-bounce`} />
      </div>
    );
  }

  // --- FALL 2: ES IST EIN PET ---
  
  // Konstruiere den Dateinamen: z.B. "rat_fire.png"
  const fileName = `${pet.species.toLowerCase()}_${pet.type.toLowerCase()}.png`;
  const imagePath = `/pets/${fileName}`; 

  const typeInfo = TYPES[pet.type];
  const animalInfo = ZODIAC_ANIMALS[pet.species];

  // Wenn das Bild nicht geladen werden kann (weil es noch fehlt), zeigen wir das Emoji
  if (imgError) {
    return (
      <div className={`${className} ${typeInfo.bg} rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-white/20 relative overflow-hidden`}>
         {/* Leichter Glanz-Effekt */}
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none"></div>
         <span className="drop-shadow-lg filter">{animalInfo.icon}</span>
      </div>
    );
  }

  // Wenn alles klappt: Das Bild anzeigen!
  return (
    <div className={`${className} relative flex items-center justify-center`}>
        {/* Optional: Ein leuchtender Hintergrund basierend auf dem Typ */}
        <div className={`absolute inset-2 ${typeInfo.bg} opacity-20 blur-md rounded-full`}></div>
        <img 
            src={imagePath} 
            alt={pet.name} 
            className="w-full h-full object-contain drop-shadow-xl z-10 hover:scale-110 transition-transform duration-300"
            onError={() => setImgError(true)} // Schaltet auf Emoji um, wenn Bild fehlt
        />
    </div>
  );
}