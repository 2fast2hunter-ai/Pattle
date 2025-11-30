import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Hourglass, Edit3, Egg } from 'lucide-react';
import { RARITIES, TYPES } from '../data/gameData';
import { getUnlockedHatcherySlots } from '../utils/gameMechanics';

export default function HatcheryScreen({ pets, user, onBack, onHatchEgg }) {
  const unlockedSlots = getUnlockedHatcherySlots(user.level);
  const maxSlots = 10;
  const [hatchingPet, setHatchingPet] = useState(null);
  const [nameInput, setNameInput] = useState('');
  
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const incubatingEggs = pets.filter(p => p.isEgg && p.hatchAt > 0);

  const startHatchingProcess = (pet) => {
      setHatchingPet(pet);
      setNameInput(pet.name);
  }

  const confirmHatch = () => {
      if (hatchingPet) {
          onHatchEgg(hatchingPet.id, nameInput);
          setHatchingPet(null);
      }
  }

  return (
      <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-300 relative">
        {hatchingPet && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in zoom-in-50 rounded-xl">
                <div className="bg-slate-800 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-2">Es schlüpft!</h2>
                    <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto flex items-center justify-center text-5xl mb-4 animate-bounce">{TYPES[hatchingPet.type].icon}</div>
                    <p className="text-slate-300 text-sm mb-4">Ein <span className={RARITIES[hatchingPet.rarity].color}>{RARITIES[hatchingPet.rarity].label}</span> {TYPES[hatchingPet.type].label}-Pet.</p>
                    <div className="text-left mb-6"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Gib ihm einen Namen</label><div className="flex items-center bg-slate-900 rounded-xl mt-1 border border-white/10 focus-within:border-indigo-500 transition-colors"><input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="bg-transparent w-full p-3 outline-none text-white font-bold" autoFocus /><Edit3 className="w-4 h-4 text-slate-500 mr-3" /></div></div>
                    <button onClick={confirmHatch} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">WILLKOMMEN!</button>
                </div>
            </div>
        )}
        <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic">BRUTSTÄTTE</h2></div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center mb-4"><p className="text-sm text-slate-300">Aktive Inkubatoren: <span className="text-amber-400 font-bold">{incubatingEggs.length} / {unlockedSlots}</span></p></div>
        <div className="grid grid-cols-2 gap-3 pb-20">
          {Array.from({ length: maxSlots }).map((_, index) => {
            const isUnlocked = index < unlockedSlots;
            const egg = index < incubatingEggs.length ? incubatingEggs[index] : null;
            if (!isUnlocked) return (<div key={index} className="aspect-square bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-40"><Lock className="w-6 h-6 text-slate-500" /><span className="text-[10px] text-slate-600 font-bold">Lvl {index === 0 ? 1 : (index === 1 ? 15 : 15 + ((index-1)*10))}</span></div>);
            if (egg) {
                const timeLeft = Math.max(0, Math.ceil((egg.hatchAt - Date.now()) / 1000));
                const isReady = timeLeft <= 0;
                const rarity = RARITIES[egg.rarity];
                return (
                  <div key={egg.id} className="aspect-square bg-slate-800 border border-slate-700 rounded-2xl p-2 flex flex-col items-center justify-between relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-full h-1 ${rarity.bg}`}></div>
                      <div className="mt-2 animate-pulse"><Egg className={`w-10 h-10 ${rarity.color}`} /></div>
                      <div className="text-center w-full">
                          <div className={`text-[10px] font-bold ${rarity.color} mb-1`}>{rarity.label}</div>
                          {isReady ? (<button onClick={() => startHatchingProcess(egg)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-bold py-2 rounded-lg animate-bounce">SCHLÜPFEN</button>) : (<div className="bg-slate-900 rounded-lg py-1 px-2 flex items-center justify-center gap-1 text-[10px] text-slate-400"><Hourglass className="w-3 h-3" /><span className="font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></div>)}
                      </div>
                  </div>
                );
            }
            return (<div key={index} className="aspect-square bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center"><div className="text-xs text-slate-600 font-bold uppercase">Leer</div></div>);
          })}
        </div>
      </div>
    );
}