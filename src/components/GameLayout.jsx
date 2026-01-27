import React from 'react';
import { Coins, Gem, Ticket } from 'lucide-react';
import { getPlayerLevelProgress } from '../utils/mechanics/progression'; 

// --- GLOBAL STYLES & BACKGROUND ---
export const PageBackground = () => {
    // Statische Partikel für Performance
    const particles = React.useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 10 + 10}s`,
        size: Math.random() * 3 + 2
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-950">
            <style>{`
                @keyframes particle-rise { 0% { transform: translateY(110vh) translateX(0); opacity: 0; } 20% { opacity: 0.3; } 80% { opacity: 0.3; } 100% { transform: translateY(-10vh) translateX(20px); opacity: 0; } }
                @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-particle { animation: particle-rise linear infinite; }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
            `}</style>
            
            {/* Ambient Blobs */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Particles */}
            {particles.map(p => (
                <div 
                    key={p.id}
                    className="absolute bg-white/10 rounded-full animate-particle"
                    style={{ left: p.left, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration, bottom: '-20px' }}
                />
            ))}
            
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
    );
};

export function HeaderHUD({ user }) {
  const { current: levelXp, max: levelMaxXp, percent: xpPercent } = getPlayerLevelProgress(user.xp, user.level);
  const ticketCount = user?.inventory?.filter(i => i.type === 'TICKET').length || 0;

  return (
    <header className="mx-4 mt-4 mb-2 z-30 relative animate-in slide-in-from-top duration-500">
        {/* GLASS CONTAINER */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[32px] p-3 border border-white/10 shadow-2xl shadow-black/20 flex flex-col gap-3 relative overflow-hidden">
            
            {/* Glanz-Effekt Hintergrund */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            {/* ZEILE 1: Profil, Name & XP */}
            <div className="flex items-center gap-4 relative z-10">
                
                {/* Großer Avatar */}
                <div className="relative shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white/10 relative overflow-hidden">
                        {user.avatar}
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-1.5 -right-1.5 bg-indigo-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg border-2 border-slate-900 shadow-sm z-20">
                        Lvl {user.level}
                    </div>
                </div>

                {/* Name & Große XP Bar */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-end">
                        <span className="font-black italic tracking-wide text-white text-lg leading-none drop-shadow-sm truncate">
                            {user.username}
                        </span>
                        
                        {/* Detaillierte XP Anzeige */}
                        <span className="text-[9px] font-bold text-slate-400 mb-0.5">
                            <span className="text-emerald-400">{levelXp}</span> / {levelMaxXp} XP
                        </span>
                    </div>
                    
                    <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10 shadow-inner">
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
                <div className="bg-slate-950/50 rounded-xl p-1.5 flex flex-col items-center border border-white/5">
                    <Ticket className="w-4 h-4 text-pink-400 fill-pink-400/20 mb-0.5" />
                    <span className="font-black text-white text-xs">{ticketCount}</span>
                </div>

                {/* Gold */}
                <div className="bg-slate-950/50 rounded-xl p-1.5 flex flex-col items-center border border-white/5">
                    <Coins className="w-4 h-4 text-amber-400 fill-amber-400/20 mb-0.5" />
                    <span className="font-black text-white text-xs">{user.coins}</span>
                </div>

                {/* Gems */}
                <div className="bg-slate-950/50 rounded-xl p-1.5 flex flex-col items-center border border-white/5">
                    <Gem className="w-4 h-4 text-purple-400 fill-purple-400/20 mb-0.5" />
                    <span className="font-black text-white text-xs">{user.gems}</span>
                </div>

            </div>

        </div>
    </header>
  );
}

export function BottomNav() { return null; }