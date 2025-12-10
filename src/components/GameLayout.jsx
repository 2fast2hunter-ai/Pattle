import React from 'react';
import { Coins, Gem, Ticket } from 'lucide-react';
import { getPlayerLevelProgress } from '../utils/mechanics/progression'; 

export function HeaderHUD({ user }) {
  // Berechnung für relativen Fortschritt (Level-basiert)
  const { current: levelXp, max: levelMaxXp, percent: xpPercent } = getPlayerLevelProgress(user.xp, user.level);
  
  const ticketCount = user?.inventory?.filter(i => i.type === 'TICKET').length || 0;

  return (
    <header className="mx-4 mt-6 mb-2 z-30 relative animate-in slide-in-from-top duration-500">
        
        {/* GLASS CONTAINER */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-[28px] p-4 border border-white/10 shadow-2xl shadow-black/40 flex flex-col gap-4 relative overflow-hidden">
            
            {/* Glanz-Effekt Hintergrund */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            {/* ZEILE 1: Profil, Name & XP */}
            <div className="flex items-center gap-4 relative z-10">
                
                {/* Großer Avatar */}
                <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/10 relative overflow-hidden">
                        {user.avatar}
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white text-xs font-black px-2 py-0.5 rounded-lg border-2 border-slate-900 shadow-sm z-20">
                        Lvl {user.level}
                    </div>
                </div>

                {/* Name & Große XP Bar */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-end">
                        <span className="font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-white text-2xl leading-none drop-shadow-sm">
                            {user.username}
                        </span>
                        
                        {/* Detaillierte XP Anzeige */}
                        <span className="text-[10px] font-bold text-slate-400 mb-0.5">
                            <span className="text-emerald-400">{levelXp}</span> / {levelMaxXp} XP
                        </span>
                    </div>
                    
                    <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-500" 
                            style={{width: `${xpPercent}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* ZEILE 2: Ressourcen */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
                
                {/* Tickets */}
                <div className="bg-slate-800/60 rounded-xl p-2 flex flex-col items-center border border-white/5">
                    <Ticket className="w-5 h-5 text-pink-400 fill-pink-400/20 mb-1" />
                    <span className="font-black text-white text-sm">{ticketCount}</span>
                </div>

                {/* Gold */}
                <div className="bg-slate-800/60 rounded-xl p-2 flex flex-col items-center border border-white/5">
                    <Coins className="w-5 h-5 text-amber-400 fill-amber-400/20 mb-1" />
                    <span className="font-black text-white text-sm">{user.coins}</span>
                </div>

                {/* Gems */}
                <div className="bg-slate-800/60 rounded-xl p-2 flex flex-col items-center border border-white/5">
                    <Gem className="w-5 h-5 text-purple-400 fill-purple-400/20 mb-1" />
                    <span className="font-black text-white text-sm">{user.gems}</span>
                </div>

            </div>

        </div>
    </header>
  );
}

export function BottomNav() { return null; }