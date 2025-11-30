import React, { useState } from 'react';
import { ArrowLeft, X, Egg, Dna, ShoppingBag, ThermometerSun, BoxSelect, Package, Backpack } from 'lucide-react';
import { RARITIES } from '../data/gameData';

export default function ItemInventoryScreen({ pets, onBack, onStartIncubation, user }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);

  const stacks = {};
  pets.forEach(pet => {
      if (pet.isEgg && pet.hatchAt === 0) {
          const key = `${pet.rarity}-${pet.source || 'SHOP'}`;
          if (!stacks[key]) {
              stacks[key] = { base: pet, count: 0, ids: [], rarity: pet.rarity, source: pet.source || 'SHOP' };
          }
          stacks[key].count++;
          stacks[key].ids.push(pet.id);
      }
  });
  const inventoryItems = Object.values(stacks);

  const boxStacks = {};
  if (user && user.inventory) {
      user.inventory.forEach(item => {
          if (item.type === 'LOOTBOX') {
              if (!boxStacks[item.variant]) boxStacks[item.variant] = { ...item, count: 0, ids: [] };
              boxStacks[item.variant].count++;
              boxStacks[item.variant].ids.push(item.id);
          }
      });
  }
  const boxItems = Object.values(boxStacks);

  return (
    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-right duration-300 relative h-full">
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in zoom-in-50">
             <div className="bg-slate-800 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative">
                 <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-slate-700 rounded-full hover:bg-slate-600"><X className="w-5 h-5" /></button>
                 <h2 className="text-2xl font-black text-white mb-4">{RARITIES[selectedItem.base.rarity].label} {selectedItem.source === 'BREEDING' ? 'Zucht-Ei' : 'Ei'}</h2>
                 <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-6 relative shadow-inner">
                     <Egg className={`w-16 h-16 ${RARITIES[selectedItem.base.rarity].color}`} />
                     {selectedItem.source === 'BREEDING' && (<div className="absolute top-0 right-0 bg-pink-500 p-2 rounded-full border-2 border-slate-800"><Dna className="w-5 h-5 text-white" /></div>)}
                     <div className="absolute -bottom-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">x{selectedItem.count}</div>
                 </div>
                 <p className="text-slate-300 text-sm mb-6">Ein {selectedItem.source === 'BREEDING' ? 'durch Zucht entstandenes' : 'mysteriöses'} Ei der Seltenheitsstufe <span className={`${RARITIES[selectedItem.rarity].color} font-bold`}>{RARITIES[selectedItem.rarity].label}</span>. Lege es in die Brutstätte, um zu sehen was schlüpft!</p>
                 <button onClick={() => { onStartIncubation(selectedItem.ids[0]); setSelectedItem(null); }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"><ThermometerSun className="w-5 h-5" /> IN DEN INKUBATOR</button>
             </div>
          </div>
      )}
      {selectedBox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in zoom-in-50">
             <div className="bg-slate-800 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative">
                 <button onClick={() => setSelectedBox(null)} className="absolute top-4 right-4 p-2 bg-slate-700 rounded-full hover:bg-slate-600"><X className="w-5 h-5" /></button>
                 <h2 className="text-2xl font-black text-white mb-4">{selectedBox.variant} Box</h2>
                 <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-6 relative shadow-inner"><Package className="w-16 h-16 text-yellow-500" /><div className="absolute -bottom-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">x{selectedBox.count}</div></div>
                 <p className="text-slate-300 text-sm mb-6">Eine verschlossene Kiste. Enthält ein zufälliges Ei!</p>
                 <button onClick={() => { onStartIncubation(selectedBox.ids[0], 'BOX'); setSelectedBox(null); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"><BoxSelect className="w-5 h-5" /> ÖFFNEN</button>
             </div>
          </div>
      )}
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold">Item Inventar</h2></div>
      {boxItems.length > 0 && (
          <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Lootboxen</h3>
              <div className="grid grid-cols-3 gap-3">
                  {boxItems.map((box, idx) => (
                      <div key={idx} onClick={() => setSelectedBox(box)} className="bg-slate-800 aspect-square rounded-2xl border-2 border-yellow-600/50 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors shadow-lg">
                          <span className="absolute top-2 right-2 bg-slate-900 text-xs font-bold text-white px-2 py-0.5 rounded-full border border-white/10">{box.count}</span>
                          <Package className="w-10 h-10 text-yellow-500 drop-shadow-md" />
                          <span className="text-[10px] font-bold mt-2 text-yellow-200 uppercase tracking-wider">{box.variant}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}
      <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Eier</h3>
          {inventoryItems.length === 0 && boxItems.length === 0 ? (<div className="text-center text-slate-500 py-20 flex flex-col items-center"><Backpack className="w-16 h-16 mb-4 opacity-30" /><p className="text-lg font-bold text-slate-400">Dein Rucksack ist leer.</p><p className="text-sm mt-2">Züchte Pets oder kaufe Boxen!</p></div>) : (
              <div className="grid grid-cols-3 gap-3 pb-20">
                  {inventoryItems.map((item, idx) => { 
                      const rarity = RARITIES[item.base.rarity]; 
                      return (
                        <div key={idx} onClick={() => setSelectedItem(item)} className={`bg-slate-800 aspect-square rounded-2xl border-2 ${rarity.border} flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors shadow-lg ${item.source === 'BREEDING' ? 'ring-2 ring-pink-500' : ''}`}>
                            <span className="absolute top-2 right-2 bg-slate-900 text-xs font-bold text-white px-2 py-0.5 rounded-full border border-white/10">{item.count}</span>
                            <div className="relative">
                                <Egg className={`w-10 h-10 ${rarity.color} drop-shadow-md`} />
                                {item.source === 'BREEDING' && (<div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-0.5 border border-slate-800"><Dna className="w-3 h-3 text-white" /></div>)}
                                {item.source === 'SHOP' && (<div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-slate-800"><ShoppingBag className="w-3 h-3 text-black" /></div>)}
                            </div>
                            <span className={`text-[10px] font-bold mt-2 ${rarity.color} uppercase tracking-wider`}>{rarity.label}</span>
                        </div>
                      ); 
                  })}
              </div>
          )}
      </div>
    </div>
  );
}