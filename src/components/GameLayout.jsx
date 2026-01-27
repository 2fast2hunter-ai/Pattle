import React from 'react';
import { Coins, Gem, Ticket, PlayCircle } from 'lucide-react';
import { getPlayerLevelProgress } from '../utils/mechanics/progression'; 

// --- GLOBAL STYLES & BACKGROUND ---
export const PageBackground = () => {
    // Statische Partikel für Performance
    const particles = React.useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 20 + 10}s`,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.3 + 0.1
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-950">
            <style>{`
                @keyframes particle-float { 0% { transform: translate(0, 0); } 25% { transform: translate(10px, -15px); } 50% { transform: translate(-5px, -25px); } 75% { transform: translate(-15px, -10px); } 100% { transform: translate(0, 0); } }
                @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-particle { animation: particle-float 20s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
            `}</style>
            
            {/* Ambient Blobs - Dynamischer */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-fuchsia-600/20 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse-slow mix-blend-screen" style={{animationDelay: '5s'}}></div>
            
            {/* Particles */}
            {particles.map(p => (
                <div 
                    key={p.id}
                    className="absolute bg-white rounded-full animate-particle blur-[1px]"
                    style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity }}
                />
            ))}
            
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/80"></div>
        </div>
    );
};

export function HeaderHUD({ user }) {
  const { current: levelXp, max: levelMaxXp, percent: xpPercent } = getPlayerLevelProgress(user.xp, user.level);
  const ticketCount = user?.inventory?.filter(i => i.type === 'TICKET').length || 0;
  const idleTicketCount = user.adTickets || 0;

  return (
    <header className="mx-4 mt-4 mb-2 z-30 relative animate-in slide-in-from-top duration-500">
        {/* GLASS CONTAINER */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[32px] p-3 border border-white/10 shadow-2xl shadow-black/20 flex flex-col gap-3 relative overflow-hidden group hover:bg-slate-900/50 transition-colors duration-500">
            
            {/* Glanz-Effekt Hintergrund */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            {/* ZEILE 1: Profil, Name & XP */}
            <div className="flex items-center gap-4 relative z-10">
                
                {/* Großer Avatar */}
                <div className="relative shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white/10 relative overflow-hidden animate-float-gentle">
                        {user.avatar}
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-1.5 -right-1.5 bg-indigo-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg border-2 border-slate-900 shadow-sm z-20 shadow-indigo-500/50">
                        Lvl {user.level}
                    </div>
                </div>

                {/* Name & Große XP Bar */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-end">
                        <span className="font-black italic tracking-wide text-white text-lg leading-none drop-shadow-md truncate text-glow">
                            {user.username}
                        </span>
                        
                        {/* Detaillierte XP Anzeige */}
                        <span className="text-[9px] font-bold text-slate-400 mb-0.5">
                            <span className="text-emerald-400">{levelXp}</span> / {levelMaxXp} XP
                        </span>
                    </div>
                    
                    <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-500 relative overflow-hidden" 
                            style={{width: `${xpPercent}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* ZEILE 2: Ressourcen */}
            <div className="grid grid-cols-4 gap-2 relative z-10">
                
                {/* Zucht Tickets */}
                <div className="bg-slate-950/40 rounded-xl p-1.5 flex flex-col items-center border border-white/5 hover:bg-slate-950/60 transition-colors">
                    <Ticket className="w-4 h-4 text-pink-400 fill-pink-400/20 mb-0.5 drop-shadow-sm" />
                    <span className="font-black text-white text-xs">{ticketCount}</span>
                </div>

                {/* Idle / Ad Tickets */}
                <div className="bg-slate-950/40 rounded-xl p-1.5 flex flex-col items-center border border-white/5 hover:bg-slate-950/60 transition-colors">
                    <PlayCircle className="w-4 h-4 text-cyan-400 fill-cyan-400/20 mb-0.5 drop-shadow-sm" />
                    <span className="font-black text-white text-xs">{idleTicketCount}</span>
                </div>

                {/* Gold */}
                <div className="bg-slate-950/40 rounded-xl p-1.5 flex flex-col items-center border border-white/5 hover:bg-slate-950/60 transition-colors">
                    <Coins className="w-4 h-4 text-amber-400 fill-amber-400/20 mb-0.5 drop-shadow-sm" />
                    <span className="font-black text-white text-xs">{user.coins}</span>
                </div>

                {/* Gems */}
                <div className="bg-slate-950/40 rounded-xl p-1.5 flex flex-col items-center border border-white/5 hover:bg-slate-950/60 transition-colors">
                    <Gem className="w-4 h-4 text-purple-400 fill-purple-400/20 mb-0.5 drop-shadow-sm" />
                    <span className="font-black text-white text-xs">{user.gems}</span>
                </div>

            </div>

        </div>
    </header>
  );
}

export function BottomNav() { return null; }