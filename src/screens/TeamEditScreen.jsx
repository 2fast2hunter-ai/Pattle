import React from 'react';
import { ArrowLeft, Lock, Trash2, Plus } from 'lucide-react';
import { TYPES } from '../data/gameData';

export default function TeamEditScreen({ user, pets, onBack, onAddPet, onRemovePet }) {
  const unlockedSlots = Math.min(10, 1 + Math.floor(user.level / 10)); 
  const maxSlots = 10;
  return (
    <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic">TEAM VERWALTEN</h2></div>
      <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 text-center mb-4"><p className="text-sm text-slate-300">Slots: <span className="text-indigo-400 font-bold">{unlockedSlots} / {maxSlots}</span></p></div>
      <div className="space-y-3">
        {Array.from({ length: maxSlots }).map((_, index) => {
          const isUnlocked = index < unlockedSlots;
          const petId = user.team[index];
          const pet = petId ? pets.find(p => p.id === petId) : null;
          if (!isUnlocked) return (<div key={index} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-50"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center"><Lock className="w-6 h-6 text-slate-600" /></div><div><div className="font-bold text-slate-500">Slot {index + 1}</div><div className="text-xs text-slate-600">Gesperrt (Lvl {index * 10})</div></div></div></div>);
          return (
            <div key={index} className="bg-slate-800 border border-white/10 rounded-2xl p-3 flex items-center justify-between transition-all hover:bg-slate-750">
               {pet ? (<><div className="flex items-center gap-4"><div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-inner ${TYPES[pet.type].bgLight}`}>{TYPES[pet.type].icon}</div><div><div className="font-bold">{pet.name}</div><div className="text-xs text-slate-400">Lvl {pet.level} • {TYPES[pet.type].label}</div></div></div><button onClick={() => onRemovePet(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"><Trash2 className="w-5 h-5" /></button></>) : (<div onClick={() => onAddPet(index)} className="w-full flex items-center gap-4 cursor-pointer"><div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-600 hover:border-indigo-500 transition-colors"><Plus className="w-6 h-6 text-slate-500" /></div><div className="text-slate-500 font-bold">Slot {index + 1} belegen</div></div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}