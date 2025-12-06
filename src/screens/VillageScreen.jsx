import React from 'react';
import { ArrowLeft, Clock, Info, TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Lock, Loader2, Trophy, RefreshCw } from 'lucide-react';
import { RESOURCES } from '../data/gameData';

const RESOURCE_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles
};

export default function VillageScreen({ user, onBack, onCollect, onSelectResource, productionRates, onOpenMilestones, onOpenTrading }) { // Neue Props
    
    if (!user || !user.village) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-slate-900 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initialisiere Dorf...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            
            {/* HEADER */}
            <div className="relative flex items-center justify-between mb-4 pt-2 px-4 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-wide text-white">DORF</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                            <span className="text-indigo-400">Level {user.village.level}</span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <span>{Math.floor(user.village.xp)} / {user.village.xpToNext} XP</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onCollect}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-green-900/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Clock className="w-4 h-4" /> EINSAMMELN
                </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-4">
                
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 mb-2">
                    <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" style={{width: `${Math.min(100, (user.village.xp / user.village.xpToNext) * 100)}%`}}></div>
                </div>

                {/* RESSOURCEN */}
                <div className="grid grid-cols-2 gap-4">
                    {Object.keys(RESOURCES).map(key => {
                        const res = RESOURCES[key];
                        const level = user.village.buildings[res.id] || 1;
                        const workers = user.village.workers[res.id] || [];
                        const isUnlocked = user.level >= res.unlockLevel;
                        const rate = productionRates ? Math.floor(productionRates(res.id, level, workers) * 3600) : 0;

                        // Total Items (neue Logik muss von aussen oder hier calculated werden, aber wir zeigen nur Rate für Overview)
                        // Für Lagerbestand-Anzeige im Overview bräuchten wir Zugriff auf storage.
                        // Einfachheitshalber zeigen wir nur Produktion und Level.

                        return (
                            <button 
                                key={res.id}
                                onClick={() => isUnlocked && onSelectResource(res.id)}
                                disabled={!isUnlocked}
                                className={`relative p-4 rounded-3xl border text-left h-40 flex flex-col justify-between overflow-hidden group transition-all ${isUnlocked ? 'bg-slate-800 border-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-95' : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}`}
                            >
                                <div className={`absolute -right-4 -top-4 ${res.color} opacity-10 group-hover:opacity-20 transition-opacity`}>{React.createElement(RESOURCE_ICONS[res.id], { className: "w-24 h-24" })}</div>
                                <div className="relative z-10">
                                    <div className={`w-10 h-10 ${isUnlocked ? res.bg : 'bg-slate-700'} rounded-xl flex items-center justify-center shadow-md mb-3`}>{isUnlocked ? React.createElement(RESOURCE_ICONS[res.id], { className: "w-5 h-5 text-white" }) : <Lock className="w-5 h-5 text-slate-500" />}</div>
                                    <h3 className={`font-black text-sm leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{res.buildingLabel}</h3>
                                </div>
                                <div className="relative z-10">
                                    {isUnlocked ? <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">Rate: {rate}/h</span> : <span className="text-[9px] font-bold text-red-400 uppercase bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Lvl {res.unlockLevel}</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* NEU: EXTRA KACHELN (Meilensteine & Handel) */}
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onOpenMilestones} className="bg-slate-800 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        <span className="text-xs font-black text-white uppercase">Meilensteine</span>
                    </button>
                    <button onClick={onOpenTrading} className="bg-slate-800 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                        <RefreshCw className="w-8 h-8 text-blue-400" />
                        <span className="text-xs font-black text-white uppercase">Tauschplatz</span>
                    </button>
                </div>

            </div>
        </div>
    );
}