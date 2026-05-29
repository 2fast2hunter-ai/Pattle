import React, { useState, useEffect } from 'react';
import { Package, ChevronsUp, Coins, Gem, Sparkles } from 'lucide-react'; // BatteryCharging entfernt
import { RARITIES, ZODIAC_ANIMALS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export function LevelUpModal({ level, onClose, t }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-400 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(99,102,241,0.5)] max-w-sm w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent animate-pulse"></div>
        <div className="relative z-10">
          <div className="inline-block mb-4 p-4 rounded-full bg-indigo-500 shadow-xl shadow-indigo-500/40">
            <ChevronsUp className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white mb-2">LEVEL UP!</h2>
          <p className="text-indigo-200 font-bold text-lg mb-6">{t ? t('modal_level_up_msg', { level }) : `You are now Level ${level}`}</p>
          <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10">
            <h3 className="text-xs uppercase font-bold text-slate-400 mb-3">{t ? t('label_rewards') : 'Rewards'}</h3>
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
            {t ? t('modal_continue') : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LootboxModal({ pet, onClose, t }) {
  // Phase: 0 = shaking, 1 = cycling, 2 = reveal
  const [phase, setPhase] = useState(0);
  const [cycleRarity, setCycleRarity] = useState(RARITIES.COMMON);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
      // 1. Shake Duration
      const timer1 = setTimeout(() => {
          setPhase(1); // Start Cycling
      }, 2000);

      return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
      if (phase === 1) {
          // Sortiere Rarities nach ID (Aufsteigend: Common -> Transcendent)
          const sortedRarities = Object.values(RARITIES).sort((a, b) => a.id - b.id);
          const targetRarity = RARITIES[pet.rarity] || RARITIES.COMMON;
          
          let currentIndex = 0;
          let delay = 50;
          let timeoutId;

          const loop = () => {
              const currentRarity = sortedRarities[currentIndex];
              setCycleRarity(currentRarity);

              // Wenn langsam genug UND wir sind bei der Ziel-Seltenheit angekommen -> Stoppen
              if (delay >= 400 && currentRarity.id === targetRarity.id) {
                  setPhase(2); // Reveal
              } else {
                  currentIndex = (currentIndex + 1) % sortedRarities.length;
                  delay = Math.floor(delay * 1.15); // Langsamer werden
                  timeoutId = setTimeout(loop, delay);
              }
          };

          loop();
          return () => clearTimeout(timeoutId);
      }
  }, [phase, pet.rarity]);

  useEffect(() => {
      if (phase === 2) {
          const timer = setTimeout(() => setShowButton(true), 1000); // 1 Sekunde warten
          return () => clearTimeout(timer);
      }
  }, [phase]);

  const finalRarity = RARITIES[pet.rarity] || RARITIES.COMMON;
  const displayRarity = phase === 2 ? finalRarity : cycleRarity;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
        
        {/* HINTERGRUND TUNNEL */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(99,102,241,0.15)_0deg,transparent_60deg,rgba(99,102,241,0.15)_120deg,transparent_180deg,rgba(99,102,241,0.15)_240deg,transparent_300deg,rgba(99,102,241,0.15)_360deg)] animate-spin-slow opacity-60 pointer-events-none"></div>

        {/* PHASE 0: SHAKING */}
        {phase === 0 && (
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] animate-pulse"></div>
                <div className="animate-shake-hard">
                    <Package className="w-48 h-48 text-yellow-400 drop-shadow-[0_0_50px_rgba(234,179,8,0.8)] brightness-125" />
                </div>
                <p className="text-white mt-12 font-black text-2xl tracking-[0.5em] animate-pulse">
                    {t ? t('inv_status_opening') : 'ÖFFNEN'}
                </p>
            </div>
        )}

        {/* PHASE 1 & 2: CYCLING & REVEAL (Unified Look) */}
        {(phase === 1 || phase === 2) && (
            <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in duration-200">
                 {/* Background Flash based on current cycle rarity */}
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${displayRarity.bg} blur-[100px] opacity-80 transition-colors duration-75 pointer-events-none`}></div>
                 
                 <div className="scale-150 mb-8">
                    <Sparkles className={`w-32 h-32 ${displayRarity.color} ${phase === 1 ? 'animate-spin-slow' : 'animate-pulse'}`} />
                 </div>

                 <div className="text-center">
                     <h2 className={`text-4xl font-black uppercase tracking-widest ${displayRarity.color} drop-shadow-lg transition-colors duration-75`}>
                         {displayRarity.label}
                     </h2>
                     <p className="text-white/50 text-sm font-bold uppercase tracking-[0.5em] mt-2">
                        {phase === 1 ? (t ? t('lootbox_cycling') : 'Determining rarity...') : (t ? t('lootbox_found') : 'FOUND!')}
                     </p>
                 </div>

                 {/* Button only in Phase 2 */}
                 {phase === 2 && showButton && (
                    <div className="mt-12 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-20">
                        <button onClick={onClose} className="w-full bg-white hover:bg-slate-200 text-slate-900 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 transition-all">
                            {t ? t('label_collect') : 'COLLECT'}
                        </button>
                    </div>
                 )}
            </div>
        )}
    </div>
  );
}

// Hinzufügen des Standard-Exports, um den Import in App.jsx zu beheben
export default { LevelUpModal, LootboxModal };