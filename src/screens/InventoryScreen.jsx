import React from 'react';
import { ArrowLeft, Info, Swords, Heart, Egg } from 'lucide-react';
import { RARITIES, TYPES } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export default function InventoryScreen({ pets, onSelectPet, onBack, title, highlightMode, filterEggs }) {
  const displayPets = filterEggs ? pets.filter(p => !p.isEgg) : pets;
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold">{title || 'Pet Sammlung'}</h2></div>
      <div className="grid grid-cols-1 gap-3 pb-20">
        {displayPets.length === 0 ? (
          <div className="text-center text-slate-500 py-10"><Info className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>Keine Pets in der Sammlung.</p></div>
        ) : (
          displayPets.map(pet => {
            const rarity = RARITIES[pet.rarity];
            const type = TYPES[pet.type];
            return (
              <div key={pet.id} onClick={() => onSelectPet(pet.id)} className={`bg-slate-800 p-3 rounded-2xl border-l-4 ${rarity.border} flex items-center gap-4 cursor-pointer transition-all active:scale-95 group relative overflow-hidden hover:bg-slate-750`}>
                <PetAvatar pet={pet} className="w-16 h-16 bg-slate-900/50 rounded-xl" />
                <div className="flex-1 relative z-10">
                  <div className="flex justify-between items-center mb-1"><h3 className="font-bold text-sm">{pet.name}</h3><span className={`text-[10px] font-bold ${rarity.color}`}>{rarity.label}</span></div>
                  <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-400"><div className="flex items-center gap-1"><Swords className="w-3 h-3"/> {pet.atk}</div><div className="flex items-center gap-1"><Heart className="w-3 h-3"/> {pet.hp}</div></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}