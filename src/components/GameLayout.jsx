import React, { useState, useEffect } from 'react';
import { Zap, Coins, Gem, User, LayoutGrid, Settings } from 'lucide-react';
import { getMaxEnergy, ENERGY_REGEN_TIME_MS } from '../utils/gameMechanics';

export function HeaderHUD({ user }) {
  const xpPercent = Math.min(100, (user.xp / user.xpToNextLevel) * 100);
  const maxEnergy = getMaxEnergy(user.level);
  
  // Hier nutzen wir die neue Konstante (5 Minuten)
  const msPerEnergy = ENERGY_REGEN_TIME_MS; 
  
  const timeSinceUpdate = Date.now() - user.lastEnergyUpdate;
  const nextEnergyIn = Math.max(0, msPerEnergy - timeSinceUpdate);
  
  // WICHTIG: Diese Zeile hat wahrscheinlich gefehlt!
  const minutesLeft = Math.ceil(nextEnergyIn / 1000 / 60);

  const [, setTick] = useState(0);
  useEffect(() => {
    // Aktualisiert die Anzeige jede Minute (oder öfter für den Timer)
    const interval = setInterval(() => setTick(t => t + 1), 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-800/90 backdrop-blur-md p-3 border-b border-white/5 z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-lg border border-white/10 relative overflow-hidden flex-shrink-0">
            {user.avatar}
            <div className="absolute bottom-0 left-0 h-1 bg-green-400" style={{width: `${xpPercent}%`}}></div>
            </div>
            <div className="hidden sm:block">
            <div className="text-xs text-slate-400 font-bold uppercase">Lvl {user.level}</div>
            <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-green-400" style={{width: `${xpPercent}%`}}></div>
            </div>
            </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
            <div className="relative flex flex-col items-center justify-center group">
                <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-white/10">
                    <Zap className={`w-3.5 h-3.5 ${user.energy > 0 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                    <span className="font-bold text-xs">{user.energy}/{maxEnergy}</span>
                </div>
                {user.energy < maxEnergy && (
                    <span className="absolute -bottom-2.5 text-[8px] text-slate-400 font-mono bg-slate-900/80 px-1 rounded whitespace-nowrap z-10">
                        {minutesLeft}m
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-white/10">
                <Coins className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="font-bold text-xs">{user.coins}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-white/10">
                <Gem className="w-3.5 h-3.5 text-pink-500 fill-current" />
                <span className="font-bold text-xs">{user.gems}</span>
            </div>
        </div>
      </div>
    </header>
  );
}

export function BottomNav({ currentView, setCurrentView }) {
  if (currentView === 'battle' || currentView === 'auth') return null;
  return (
    <nav className="bg-slate-800 border-t border-white/10 px-6 py-4 pb-8"><ul className="flex justify-around items-center"><li><button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center gap-1 ${currentView === 'profile' ? 'text-indigo-400' : 'text-slate-500'}`}><User className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Profil</span></button></li><li className="-mt-8"><button onClick={() => setCurrentView('menu')} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${['menu', 'arena-hub', 'pet-hub', 'shop', 'marketplace', 'leaderboard'].includes(currentView) ? 'bg-indigo-600 text-white ring-4 ring-slate-900 shadow-indigo-500/40' : 'bg-slate-700 text-slate-400 ring-4 ring-slate-900'}`}><LayoutGrid className="w-8 h-8 ml-1" /></button></li><li><button onClick={() => setCurrentView('settings')} className={`flex flex-col items-center gap-1 ${currentView === 'settings' ? 'text-indigo-400' : 'text-slate-500'}`}><Settings className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Optionen</span></button></li></ul></nav>
  );
}