import React, { useState, useEffect } from 'react';
import { Package, ChevronsUp, Coins, Gem, BatteryCharging } from 'lucide-react';
import { RARITIES, ZODIAC_ANIMALS } from '../data/gameData';

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
              <div className="flex flex-col items-center">
                <BatteryCharging className="w-6 h-6 text-yellow-400 mb-1" />
                <span className="font-bold">Energie+</span>
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
  const [isOpening, setIsOpening] = useState(true);
  const [flash, setFlash] = useState(false);
  
  useEffect(() => {
      const timer1 = setTimeout(() => setFlash(true), 2000);
      const timer2 = setTimeout(() => setIsOpening(false), 2500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  if (isOpening) {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <div className="relative flex flex-col items-center justify-center">
                {flash && <div className="absolute inset-0 bg-white animate-ping duration-500 rounded-full opacity-50 scale-150"></div>}
                <div className={`w-48 h-48 bg-slate-800 rounded-3xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)] flex items-center justify-center animate-bounce`}>
                    <Package className="w-24 h-24 text-yellow-500" />
                </div>
                <p className="text-white mt-8 font-black text-xl tracking-widest animate-pulse">ÖFFNE...</p>
            </div>
        </div>
      )
  }

  const rarity = RARITIES[pet.rarity];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in duration-500">
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-white/20 w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${rarity.bg} blur-[100px] opacity-50 animate-spin-slow`}></div>
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-2 tracking-wide">GEFUNDEN!</h2>
                <div className="my-8 relative">
                    <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-4 border-white/20 shadow-2xl">
                        {ZODIAC_ANIMALS[pet.species].icon}
                    </div>
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase ${rarity.bg} text-white shadow-lg`}>{rarity.label}</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 mb-6">
                    <p className="text-slate-300 text-sm">
                        Du hast {pet.isEgg ? 'ein Ei' : 'ein Pet'} der Seltenheit <span className={rarity.color}>{rarity.label}</span> erhalten!
                    </p>
                    <div className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-wider">
                        Herkunft: {pet.source === 'BREEDING' ? '🧬 Zuchtprogramm' : (pet.source === 'STARTER' ? '🎁 Starter Geschenk' : '🛍️ Marktplatz Fund')}
                    </div>
                </div>
                <button onClick={onClose} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl hover:scale-105 transition-transform shadow-lg">EINSAMMELN</button>
             </div>
        </div>
    </div>
  );
}

// Hinzufügen des Standard-Exports, um den Import in App.jsx zu beheben
export default { LevelUpModal, LootboxModal };