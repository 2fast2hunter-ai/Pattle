import React from 'react';
import { ArrowLeft, Lock, Trash2, Plus, Shield, Users } from 'lucide-react';
import { TYPES } from '../data/gameData';
import { getUnlockedTeamSlots } from '../utils/gameMechanics';
import PetAvatar from '../components/PetAvatar';

// Hilfsfunktion zur Berechnung des benötigten Levels für einen Slot (Index 0-9)
const getRequiredLevel = (index) => {
    if (index === 0) return 1; // Slot 1
    if (index === 1) return 3; // Slot 2
    return 3 + (index - 1) * 5;
};

export default function TeamEditScreen({ user, pets, onBack, onAddPet, onRemovePet }) {
  const unlockedSlots = getUnlockedTeamSlots(user.level);
  const maxSlots = 10;
  const teamCount = user.team.filter(Boolean).length;
  
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative overflow-hidden bg-slate-950">
      
      {/* Background FX */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* --- HEADER --- */}
      <div className="relative flex items-center justify-between mb-6 pt-2 px-4 shrink-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 drop-shadow-sm">
                TEAM
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-400">Verwaltung</span>
             </div>
          </div>
          
          <button 
            onClick={onBack} 
            className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"
          >
              <ArrowLeft className="w-5 h-5" />
          </button>
      </div>
      
      {/* --- INFO BANNER --- */}
      <div className="px-4 mb-6 z-10">
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
             <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                     <Users className="w-5 h-5" />
                 </div>
                 <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belegt</div>
                     <div className="text-xl font-black text-white">{teamCount} <span className="text-slate-600 text-sm">/ {unlockedSlots}</span></div>
                 </div>
             </div>
             <div className="text-right">
                 <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Nächster Slot</div>
                 <div className="text-xs font-bold text-indigo-300">Lvl {getRequiredLevel(unlockedSlots)}</div>
             </div>
        </div>
      </div>
      
      {/* --- SLOTS LIST --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-3 z-10">
        {Array.from({ length: maxSlots }).map((_, index) => {
          const isUnlocked = index < unlockedSlots;
          const petId = user.team[index];
          const pet = petId ? pets.find(p => p.id === petId) : null;
          const requiredLevel = getRequiredLevel(index);
          
          if (!isUnlocked) return (
            <div key={index} className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 opacity-60 grayscale relative overflow-hidden">
               {/* Stripes Pattern Overlay */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
               
               <div className="w-16 h-16 bg-slate-950 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                   <Lock className="w-6 h-6 text-slate-700" />
               </div>
               <div>
                  <div className="font-black text-slate-500 text-lg">Slot {index + 1}</div>
                  <div className="text-xs font-bold text-slate-600 uppercase bg-black/20 px-2 py-0.5 rounded w-fit">Benötigt Level {requiredLevel}</div>
               </div>
            </div>
          );
          
          // EMPTY SLOT
          if (!pet) return (
            <button 
                key={index} 
                onClick={() => onAddPet(index)}
                className="w-full bg-slate-800/30 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-3 flex items-center gap-4 cursor-pointer group transition-all active:scale-98"
            >
                <div className="w-16 h-16 bg-slate-900/50 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                    <Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-left">
                    <div className="font-bold text-slate-400 group-hover:text-indigo-300 transition-colors">Leerer Slot {index + 1}</div>
                    <div className="text-xs text-slate-600 font-bold uppercase">Tippen zum Belegen</div>
                </div>
            </button>
          );

          // FILLED SLOT
          const typeInfo = TYPES[pet.type] || TYPES.FIRE;
          return (
            <div key={index} className="bg-slate-800/80 border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-lg relative overflow-hidden group">
               {/* Background Glow based on Type */}
               <div className={`absolute -right-10 -top-10 w-40 h-40 ${typeInfo.bg} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
               
               <div className="flex items-center gap-4 relative z-10">
                   <div className="relative">
                        <PetAvatar pet={pet} className="w-16 h-16 drop-shadow-md" />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${typeInfo.bg} border-2 border-slate-800 flex items-center justify-center text-[10px] text-white shadow-sm`}>
                            {typeInfo.icon}
                        </div>
                   </div>
                   
                   <div>
                       <div className="font-black text-white text-lg leading-none mb-1">{pet.name}</div>
                       <div className="flex items-center gap-2">
                           <span className="text-xs font-bold text-slate-400 bg-slate-950/50 px-1.5 py-0.5 rounded border border-white/5">Lvl {pet.level}</span>
                           <span className={`text-[10px] font-bold uppercase ${typeInfo.color}`}>{typeInfo.label}</span>
                       </div>
                   </div>
               </div>

               <button 
                   onClick={() => onRemovePet(index)} 
                   className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95 border border-red-500/20 relative z-10"
               >
                   <Trash2 className="w-5 h-5" />
               </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}