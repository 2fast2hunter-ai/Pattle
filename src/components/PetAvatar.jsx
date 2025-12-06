import React, { useState } from 'react';
import { ZODIAC_ANIMALS, TYPES, RARITIES } from '../data/gameData';
import { Egg, HelpCircle, Dna, Sparkles } from 'lucide-react';

export default function PetAvatar({ pet, className = "w-16 h-16" }) {
  const [imgError, setImgError] = useState(false);

  if (!pet) return <div className={className} />;

  // 1. EI ANSICHT
  if (pet.isEgg) {
    const rarity = RARITIES[pet.rarity] || RARITIES.COMMON; 
    return (
      <div className={`${className} flex items-center justify-center rounded-2xl border-4 ${rarity.border} ${rarity.bg} shadow-inner relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
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
  const bgClass = pet.customBackground || typeInfo.bg;
  
  // WICHTIG: Prüfen ob Shiny
  const isShiny = pet.isShiny;

  // Custom Data (Mutanten)
  if (pet.customData) {
      return (
        <div className={`${className} ${bgClass} rounded-2xl flex items-center justify-center shadow-md border-2 border-white/20 relative overflow-hidden`}>
             {/* Holo Effekt Layer */}
             {isShiny && <div className="absolute inset-0 holo-effect z-20 pointer-events-none"></div>}

             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none"></div>
             <span className="drop-shadow-lg filter text-3xl leading-none select-none relative z-10">
                 {pet.customData.icon}
             </span>
             <div className="absolute bottom-1 right-1 bg-black/40 p-0.5 rounded text-[8px] z-10">🧬</div>
             
             {/* Sparkles */}
             {isShiny && <div className="absolute top-1 left-1 text-[8px] animate-pulse z-20">✨</div>}
        </div>
      );
  }

  // 3. NORMALES PET
  const speciesKey = pet.species || 'UNKNOWN';
  let animalInfo = ZODIAC_ANIMALS[speciesKey];
  
  if (!animalInfo) {
      animalInfo = { id: 'UNKNOWN', label: 'Unbekannt', icon: <HelpCircle className="w-1/2 h-1/2 text-white/80" /> };
  }

  const safeSpecies = (pet.species || 'unknown').toLowerCase();
  const safeType = (pet.type || 'fire').toLowerCase();
  
  const fileName = `${safeSpecies}_${safeType}.png`;
  const imagePath = `/pets/${fileName}`; 

  const Content = () => {
      if (imgError || !animalInfo.icon || typeof animalInfo.icon !== 'string') {
        const displayIcon = (typeof animalInfo.icon === 'string') ? animalInfo.icon : <HelpCircle className="w-1/2 h-1/2 text-white/80" />;
        return (
             <span className="drop-shadow-lg filter text-3xl leading-none select-none flex items-center justify-center w-full h-full">
                 {displayIcon}
             </span>
        );
      }
      return (
        <img 
            src={imagePath} 
            alt={pet.name || 'Pet'} 
            className="w-full h-full object-contain drop-shadow-xl z-10 hover:scale-110 transition-transform duration-300"
            onError={() => setImgError(true)} 
        />
      );
  };

  return (
    <div className={`${className} ${bgClass} rounded-2xl flex items-center justify-center shadow-md border-2 border-white/20 relative overflow-hidden`}>
        
        {/* WICHTIG: Der Holo Effekt muss HIER sein */}
        {isShiny && <div className="absolute inset-0 holo-effect z-20 pointer-events-none"></div>}
        
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 w-full h-full p-1 flex items-center justify-center">
            <Content />
        </div>

        {isShiny && (
            <div className="absolute top-1 right-1 z-30">
                <Sparkles className="w-3 h-3 text-yellow-200 animate-ping" />
            </div>
        )}
    </div>
  );
}