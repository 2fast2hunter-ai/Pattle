import React, { useState } from 'react';
import { ZODIAC_ANIMALS, TYPES, RARITIES } from '../data/gameData';
import { Egg, HelpCircle, Dna } from 'lucide-react';

export default function PetAvatar({ pet, className = "w-16 h-16" }) {
  const [imgError, setImgError] = useState(false);

  if (!pet) return <div className={className} />;

  // 1. EI ANSICHT
  if (pet.isEgg) {
    const rarity = RARITIES[pet.rarity] || RARITIES.COMMON; 
    return (
      <div className={`${className} flex items-center justify-center rounded-2xl border-4 ${rarity.border} ${rarity.bg} shadow-inner relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Mutation Indikator */}
        {pet.customData && (
            <div className="absolute top-1 right-1 bg-pink-500 p-1 rounded-full z-10 border border-white/20">
                <Dna className="w-3 h-3 text-white" />
            </div>
        )}
        <Egg className={`w-2/3 h-2/3 text-white drop-shadow-md animate-bounce`} />
      </div>
    );
  }

  // 2. PET ANSICHT
  const typeInfo = TYPES[pet.type] || TYPES.FIRE;
  
  // Custom Data (Mutanten)
  if (pet.customData) {
      return (
        <div className={`${className} ${typeInfo.bg} rounded-2xl flex items-center justify-center shadow-md border-2 border-white/20 relative overflow-hidden`}>
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none"></div>
             <span className="drop-shadow-lg filter text-3xl leading-none select-none">
                 {pet.customData.icon}
             </span>
             <div className="absolute bottom-1 right-1 bg-black/40 p-0.5 rounded text-[8px]">🧬</div>
        </div>
      );
  }

  // 3. NORMALES PET (mit sicherem Fallback für alte/kaputte Daten)
  
  // Sicherer Zugriff auf Species Key
  const speciesKey = pet.species || 'UNKNOWN';
  let animalInfo = ZODIAC_ANIMALS[speciesKey];
  
  // Fallback, falls Spezies nicht in der Liste ist
  if (!animalInfo) {
      animalInfo = { id: 'UNKNOWN', label: 'Unbekannt', icon: <HelpCircle className="w-1/2 h-1/2 text-white/80" /> };
  }

  // Sicherer Zugriff auf Strings für Dateinamen (verhindert den Crash)
  const safeSpecies = (pet.species || 'unknown').toLowerCase();
  const safeType = (pet.type || 'fire').toLowerCase();
  
  const fileName = `${safeSpecies}_${safeType}.png`;
  const imagePath = `/pets/${fileName}`; 

  // Fallback: Emoji/Icon anzeigen, wenn Bildfehler oder kein String-Icon
  if (imgError || !animalInfo.icon || typeof animalInfo.icon !== 'string') {
    // Falls das Icon eine Komponente ist (HelpCircle) oder Bildfehler
    const displayIcon = (typeof animalInfo.icon === 'string') ? animalInfo.icon : <HelpCircle className="w-1/2 h-1/2 text-white/80" />;

    return (
      <div className={`${className} ${typeInfo.bg} rounded-2xl flex items-center justify-center shadow-md border-2 border-white/20 relative overflow-hidden`}>
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none"></div>
         <span className="drop-shadow-lg filter text-3xl leading-none select-none flex items-center justify-center w-full h-full">
             {displayIcon}
         </span>
      </div>
    );
  }

  // Bild laden
  return (
    <div className={`${className} relative flex items-center justify-center`}>
        <div className={`absolute inset-2 ${typeInfo.bg} opacity-20 blur-md rounded-full`}></div>
        <img 
            src={imagePath} 
            alt={pet.name || 'Pet'} 
            className="w-full h-full object-contain drop-shadow-xl z-10 hover:scale-110 transition-transform duration-300"
            onError={() => setImgError(true)} 
        />
    </div>
  );
}