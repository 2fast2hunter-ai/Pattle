// src/components/PetAvatar.jsx
import React, { useState, useEffect } from 'react';
import { ZODIAC_ANIMALS, TYPES, RARITIES } from '../data/gameData';
import { Egg, HelpCircle, Dna, Sparkles } from 'lucide-react';

export default function PetAvatar({ pet, className = "w-16 h-16" }) {
  // Wir merken uns pro Pet-ID, ob das Bild fehlerhaft war, um Flackern zu vermeiden
  const [imgError, setImgError] = useState(false);

  // Reset Error state wenn sich das Pet ändert (wichtig für Listen/Recycling)
  useEffect(() => {
    setImgError(false);
  }, [pet?.id, pet?.species]);

  if (!pet) return <div className={className} />;

  // --- 1. EI ANSICHT ---
  if (pet.isEgg) {
    const rarity = RARITIES[pet.rarity] || RARITIES.COMMON; 
    const tooltip = pet.customData?.parentsNames ? `Eltern: ${pet.customData.parentsNames}` : 'Ei';
    return (
      <div title={tooltip} className={`${className} flex items-center justify-center rounded-2xl border-4 ${rarity.border} ${rarity.bg} shadow-inner relative overflow-hidden`}>
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

  // --- 2. PET ANSICHT ---
  const typeInfo = TYPES[pet.type] || TYPES.FIRE;
  const bgClass = pet.customBackground || typeInfo.bg;
  const isShiny = pet.isShiny;

  // Spezies Daten laden
  const speciesKey = pet.species || 'UNKNOWN';
  let animalInfo = ZODIAC_ANIMALS[speciesKey];
  
  if (!animalInfo) {
      animalInfo = { id: 'UNKNOWN', label: 'Unbekannt', icon: <HelpCircle className="w-1/2 h-1/2 text-white/80" /> };
  }

  const imageName = speciesKey.toLowerCase();
  const imagePath = `${import.meta.env.BASE_URL}pets/${imageName}.png`;

  // --- INHALT LOGIK (BILD vs EMOJI) ---
  const renderContent = () => {
      // Fall 1: Custom Icon (z.B. Mutation)
      if (pet.customData && pet.customData.icon) {
          return (
             <span className="drop-shadow-lg filter text-3xl leading-none select-none relative z-10">
                 {pet.customData.icon}
             </span>
          );
      }

      // Fall 2: Bild konnte nicht geladen werden -> Zeige Emoji/Icon
      if (imgError) {
        // Prüfen ob Icon ein String (Emoji) oder Komponente ist
        const displayIcon = (typeof animalInfo.icon === 'string') 
            ? animalInfo.icon 
            : (animalInfo.icon || <HelpCircle className="w-1/2 h-1/2 text-white/80" />);
            
        return (
             <span className="drop-shadow-lg filter text-3xl leading-none select-none flex items-center justify-center w-full h-full scale-125">
                 {displayIcon}
             </span>
        );
      }

      // Fall 3: Versuche Bild zu laden
      return (
        <img 
            src={imagePath} 
            alt={pet.name} 
            className="w-full h-full object-contain drop-shadow-xl z-10 hover:scale-110 transition-transform duration-300"
            onError={() => setImgError(true)} 
        />
      );
  };

  return (
    <div className={`${className} ${bgClass} rounded-2xl flex items-center justify-center shadow-md border-2 border-white/20 relative overflow-hidden`}>
        
        {/* Holo Effekt Layer (Shiny) */}
        {isShiny && <div className="absolute inset-0 holo-effect z-20 pointer-events-none"></div>}
        
        {/* Hintergrund Glanz */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none"></div>
        
        {/* Inhalt (Bild oder Emoji) */}
        <div className="relative z-10 w-full h-full p-1 flex items-center justify-center">
            {renderContent()}
        </div>

        {/* Mutation Badge */}
        {pet.customData && (
             <div className="absolute bottom-1 right-1 bg-black/40 p-0.5 rounded text-[8px] z-10">🧬</div>
        )}

        {/* Shiny Sparkles */}
        {isShiny && (
            <div className="absolute top-1 right-1 z-30">
                <Sparkles className="w-3 h-3 text-yellow-200 animate-ping" />
            </div>
        )}
    </div>
  );
}