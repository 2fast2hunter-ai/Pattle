import React from 'react';
import { ArrowLeft, Clock, Info, TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Lock, Loader2, Trophy, RefreshCw, Zap, Plus, Timer, Scissors } from 'lucide-react';
import { RESOURCES } from '../data/gameData';

const RESOURCE_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles
};

export default function VillageScreen({ user, onBack, onCollect, onSelectResource, productionRates, onOpenMilestones, onOpenTrading, onAddIdleTime, onOpenCosmetics }) {
    
    // Timer State für Countdown
    const [timeLeftStr, setTimeLeftStr] = React.useState("00:00:00");
    const [isActive, setIsActive] = React.useState(false);

    React.useEffect(() => {
        if (!user?.village) return;

        const updateTimer = () => {
            const now = Date.now();
            const expires = user.village.idleTimeExpiresAt || 0;
            const diff = expires - now;

            if (diff > 0) {
                setIsActive(true);
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeftStr(`${h}h ${m}m ${s}s`);
            } else {
                setIsActive(false);
                setTimeLeftStr("Inaktiv");
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [user?.village?.idleTimeExpiresAt]);

    if (!user || !user.village) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-slate-900 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initialisiere Dorf...</p>
            </div>
        );
    }

    const ticketCount = user.adTickets || 0;

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
                
                {/* IDLE TIME BANNER */}
                <div className={`rounded-2xl p-4 border flex items-center justify-between shadow-lg transition-all relative overflow-hidden ${isActive ? 'bg-indigo-900/40 border-indigo-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                    {isActive && <div className="absolute inset-0 bg-indigo-500/5 animate-pulse-slow pointer-events-none"></div>}
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isActive ? 'bg-indigo-500 text-white' : 'bg-red-500/20 text-red-500'}`}>
                            {isActive ? <Zap className="w-5 h-5 animate-pulse" /> : <Timer className="w-5 h-5" />}
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {isActive ? 'Produktion läuft' : 'Produktion gestoppt'}
                            </div>
                            <div className={`text-lg font-black ${isActive ? 'text-white' : 'text-red-400'}`}>
                                {timeLeftStr}
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onAddIdleTime}
                        disabled={ticketCount < 1}
                        className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border transition-all active:scale-95 ${ticketCount > 0 ? 'bg-slate-800 border-white/10 hover:bg-slate-700' : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}`}
                    >
                        <div className="flex items-center gap-1 text-xs font-bold text-white mb-0.5">
                            {/* HIER GEÄNDERT: Von 10m auf 20m */}
                            <Plus className="w-3 h-3" /> 20m
                        </div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase">
                            {ticketCount} Tickets
                        </div>
                    </button>
                </div>

                {/* XP Bar */}
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 mb-2">
                    <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" style={{width: `${Math.min(100, (user.village.xp / user.village.xpToNext) * 100)}%`}}></div>
                </div>

                {/* RESSOURCEN GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.keys(RESOURCES).map(key => {
                        const res = RESOURCES[key];
                        const level = user.village.buildings[res.id] || 1;
                        const workers = user.village.workers[res.id] || [];
                        const isUnlocked = user.level >= res.unlockLevel;
                        
                        const rate = productionRates ? Math.floor(productionRates(res.id, level, workers) * 3600) : 0;

                        return (
                            <button 
                                key={res.id}
                                onClick={() => isUnlocked && onSelectResource(res.id)}
                                disabled={!isUnlocked}
                                className={`
                                    relative p-4 rounded-3xl border text-left h-40 flex flex-col justify-between overflow-hidden group transition-all
                                    ${isUnlocked ? 'bg-slate-800 border-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-95' : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}
                                `}
                            >
                                <div className={`absolute -right-4 -top-4 ${res.color} opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-700`}>
                                    {React.createElement(RESOURCE_ICONS[res.id], { className: "w-24 h-24" })}
                                </div>
                                
                                <div className="relative z-10">
                                    <div className={`w-10 h-10 ${isUnlocked ? res.bg : 'bg-slate-700'} rounded-xl flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                                        {isUnlocked ? React.createElement(RESOURCE_ICONS[res.id], { className: "w-5 h-5 text-white" }) : <Lock className="w-5 h-5 text-slate-500" />}
                                    </div>
                                    <h3 className={`font-black text-sm leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{res.buildingLabel}</h3>
                                </div>

                                <div className="relative z-10">
                                    {isUnlocked ? (
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">Rate/h</span>
                                                <span className={`text-xs font-bold ${isActive ? 'text-green-400' : 'text-slate-500'}`}>+{rate}</span>
                                            </div>
                                            {!isActive && <div className="text-[8px] text-red-400 font-bold uppercase">Pausiert</div>}
                                        </div>
                                    ) : (
                                        <span className="text-[9px] font-bold text-red-400 uppercase bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Lvl {res.unlockLevel}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* EXTRA KACHELN (3er Grid) */}
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <button onClick={onOpenMilestones} className="bg-slate-800 border border-white/5 p-3 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <span className="text-[10px] font-black text-white uppercase">Meilensteine</span>
                    </button>
                    <button onClick={onOpenTrading} className="bg-slate-800 border border-white/5 p-3 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                        <RefreshCw className="w-6 h-6 text-blue-400" />
                        <span className="text-[10px] font-black text-white uppercase">Tauschplatz</span>
                    </button>
                    <button onClick={onOpenCosmetics} className="bg-slate-800 border border-white/5 p-3 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                        <Scissors className="w-6 h-6 text-pink-400" />
                        <span className="text-[10px] font-black text-white uppercase">Schneider</span>
                    </button>
                </div>

            </div>
        </div>
    );
}