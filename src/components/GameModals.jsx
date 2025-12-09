import React, { useState, useEffect } from 'react';
import { Package, ChevronsUp, Coins, Gem } from 'lucide-react'; // BatteryCharging entfernt
import { RARITIES, ZODIAC_ANIMALS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export function LevelUpModal({ level, onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-400 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(99,102,241,0.5)] max-w-sm w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent animate-pulse"></div>
        <div className="relative z-10">
          <div className="inline-block mb-4 p-4 rounded-full bg-indigo-500 shadow-xl shadow-indigo-500/40">
            <ChevronsUp className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white mb-2">LEVEL UP!</h2>
          <p className="text-indigo-200 font-bold text-lg mb-6">Du bist jetzt Level {level}</p>
          <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10">
            <h3 className="text-xs uppercase font-bold text-slate-400 mb-3">Belohnungen</h3>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <Coins className="w-6 h-6 text-yellow-400 mb-1" />
                <span className="font-bold">+1000</span>
              </div>
              <div className="flex flex-col items-center">
                <Gem className="w-6 h-6 text-pink-500 mb-1" />
                <span className="font-bold">+5</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-white text-indigo-900 font-black py-4 rounded-xl hover:bg-indigo-50 transition-colors active:scale-95 shadow-lg">
            WEITER
          </button>
        </div>
      </div>
    </div>
  );
}

export function LootboxModal({ pet, onClose }) {
  // Phase: 0 = shaking, 1 = explosion, 2 = reveal
  const [phase, setPhase] = useState(0);

  useEffect(() => {
      // 1. Shake Duration
      const timer1 = setTimeout(() => {
          setPhase(1); // Explosion
      }, 2000);

      // 2. Reveal
      const timer2 = setTimeout(() => {
          setPhase(2); // Show Pet
      }, 2200);

      return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const rarity = RARITIES[pet.rarity] || RARITIES.COMMON;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
        
        {/* HINTERGRUND TUNNEL */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(99,102,241,0.15)_0deg,transparent_60deg,rgba(99,102,241,0.15)_120deg,transparent_180deg,rgba(99,102,241,0.15)_240deg,transparent_300deg,rgba(99,102,241,0.15)_360deg)] animate-spin-slow opacity-60"></div>

        {/* PHASE 0: SHAKING */}
        {phase === 0 && (
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] animate-pulse"></div>
                <div className="animate-shake-hard">
                    <Package className="w-48 h-48 text-yellow-400 drop-shadow-[0_0_50px_rgba(234,179,8,0.8)] brightness-125" />
                </div>
                <p className="text-white mt-12 font-black text-2xl tracking-[0.5em] animate-pulse">ÖFFNE...</p>
            </div>
        )}

        {/* PHASE 1: EXPLOSION */}
        {phase === 1 && (
            <div className="absolute inset-0 bg-white z-[110] animate-out fade-out duration-300"></div>
        )}

        {/* PHASE 2: REVEAL */}
        {phase === 2 && (
            <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in zoom-in duration-500">
                
                {/* Rarity BG Glow */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${rarity.bg} blur-[80px] opacity-50 animate-pulse`}></div>
                
                {/* Rotating Rays for Rarity */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-0 opacity-40 animate-spin-slow pointer-events-none">
                     <div className={`w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,${rarity.color.replace('text-', '')}_0deg,transparent_45deg,${rarity.color.replace('text-', '')}_90deg,transparent_135deg,${rarity.color.replace('text-', '')}_180deg,transparent_225deg,${rarity.color.replace('text-', '')}_270deg,transparent_315deg,${rarity.color.replace('text-', '')}_360deg)]`}></div>
                </div>

                <div className="relative z-10 scale-125 mb-8 drop-shadow-2xl">
                    <PetAvatar pet={pet} className="w-48 h-48" />
                </div>

                <div className="text-center relative z-10">
                    <h2 className="text-3xl font-black text-white mb-2 tracking-wide drop-shadow-lg">GEFUNDEN!</h2>
                    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <p className="text-slate-300 text-sm font-medium">
                            Du hast {pet.isEgg ? 'ein Ei' : 'ein Pet'} der Seltenheit <br/>
                            <span className={`text-lg font-black uppercase ${rarity.color} drop-shadow-sm`}>{rarity.label}</span> erhalten!
                        </p>
                        <div className="text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-wider">
                            Herkunft: {pet.source === 'BREEDING' ? '🧬 Zuchtprogramm' : (pet.source === 'STARTER' ? '🎁 Starter Geschenk' : '🛍️ Marktplatz Fund')}
                        </div>
                    </div>
                    <button onClick={onClose} className="mt-6 w-full bg-white hover:bg-slate-200 text-slate-900 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 transition-all">
                        EINSAMMELN
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}

// Hinzufügen des Standard-Exports, um den Import in App.jsx zu beheben
export default { LevelUpModal, LootboxModal };