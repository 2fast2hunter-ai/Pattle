import React, { useState } from 'react';
import { ArrowLeft, Coins, Info, Heart } from 'lucide-react';
import { TYPES, RARITIES } from '../data/gameData';

export default function BreedingScreen({ pets, onBreed, onBack, coins }) {
  const [selected, setSelected] = useState([]);
  const breedablePets = pets.filter(p => !p.isEgg);

  const toggleSelect = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(pid => pid !== id));
    else if (selected.length < 2) setSelected([...selected, id]);
  };

  return (
    <div className="space-y-4 pt-4 h-full flex flex-col">
      <div className="flex items-center gap-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold">Zucht Labor</h2></div>
      <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30 text-center text-sm"><p className="text-indigo-200">Kombiniere 2 Pets. Attribute werden gemischt.</p><div className="flex justify-center items-center gap-2 mt-1 font-bold text-yellow-400"><Coins className="w-4 h-4" /> Kosten: 200</div></div>
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pb-20">
        {breedablePets.length === 0 ? (
          <div className="col-span-2 text-center text-slate-500 py-10 flex flex-col items-center">
            <Info className="w-10 h-10 mb-2 opacity-50" /><p>Keine erwachsenen Pets verfügbar.</p><p className="text-xs mt-1">Brüte Eier in der Brutstätte aus!</p>
          </div>
        ) : (
          breedablePets.map(pet => (
            <div key={pet.id} onClick={() => toggleSelect(pet.id)} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${selected.includes(pet.id) ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}>
              <div className={`w-10 h-10 rounded-full ${TYPES[pet.type].bg} flex items-center justify-center`}>{TYPES[pet.type].icon}</div>
              <div className="font-bold text-xs truncate w-full text-center">{pet.name}</div>
              <div className={`text-[10px] ${RARITIES[pet.rarity].color}`}>{RARITIES[pet.rarity].label}</div>
            </div>
          ))
        )}
      </div>
      <div className="absolute bottom-6 left-0 w-full px-6"><button disabled={selected.length !== 2} onClick={() => { onBreed(selected[0], selected[1]); setSelected([]); }} className="w-full bg-pink-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center gap-2"><Heart className="w-5 h-5 fill-current" /> {selected.length === 2 ? 'JETZT ZÜCHTEN' : 'Wähle 2 Pets'}</button></div>
    </div>
  );
}