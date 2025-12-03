import React from 'react';
import { ArrowLeft, Swords, Users, ChevronsUp } from 'lucide-react';

export default function ArenaHub({ onBack, onBattle, onTeam }) {
  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
              <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black italic text-red-400">ARENA HUB</h2>
      </div>
      
      {/* Battle Card */}
      <div 
          onClick={onBattle} 
          className="relative h-48 bg-gradient-to-br from-red-600 to-pink-700 rounded-3xl p-6 flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-900/20 group overflow-hidden border border-red-400/30"
      >
        <div className="z-10">
            <h3 className="text-4xl font-black italic">PVP KAMPF</h3>
            <p className="text-red-100 font-bold mt-1">Finde einen Gegner</p>
        </div>
        
        <div className="self-end bg-white text-red-600 px-6 py-2 rounded-full font-black shadow-lg z-10">
            FIGHT!
        </div>
        
        <Swords className="w-40 h-40 text-white/10 absolute -right-6 -bottom-6 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
      </div>
      
      {/* Team Management Button */}
      <button 
          onClick={onTeam} 
          className="w-full bg-slate-800 border border-slate-700 p-6 rounded-3xl flex items-center justify-between hover:bg-slate-750 active:scale-95 transition-all group"
      >
         <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                 <Users className="w-8 h-8" />
             </div>
             <div className="text-left">
                 <div className="font-bold text-xl">Team Management</div>
                 <div className="text-sm text-slate-400">Stelle deine Crew zusammen</div>
             </div>
         </div>
         <ChevronsUp className="text-slate-500" />
      </button>

    </div>
  );
}