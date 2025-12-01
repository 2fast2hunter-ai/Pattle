import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Hourglass, Edit3, Egg, ThermometerSun, Check, X, Sparkles } from 'lucide-react';
import { RARITIES, TYPES } from '../data/gameData';
import { getUnlockedHatcherySlots } from '../utils/gameMechanics';
import PetAvatar from '../components/PetAvatar';

export default function HatcheryScreen({ pets, user, onBack, onHatchEgg }) {
  const unlockedSlots = getUnlockedHatcherySlots(user.level);
  const maxSlots = 10;
  const [hatchingPet, setHatchingPet] = useState(null);
  const [nameInput, setNameInput] = useState('');
  
  // Timer force update
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const incubatingEggs = pets.filter(p => p.isEgg && p.hatchAt > 0);

  const startHatchingProcess = (pet) => {
      setHatchingPet(pet);
      setNameInput(pet.name);
  }

  const confirmHatch = () => {
      if (hatchingPet) {
          onHatchEgg(hatchingPet.id, nameInput);
          setHatchingPet(null);
      }
  }

  return (
      <div className="h-full flex flex-col animate-in fade-in relative">
        
        {/* --- HATCHING MODAL --- */}
        {hatchingPet && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-6 animate-in zoom-in-50 duration-300">
                <div className={`bg-slate-900 border-2 ${RARITIES[hatchingPet.rarity].border} w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden group`}>
                    
                    {/* Hintergrund Licht-Explosion */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] ${RARITIES[hatchingPet.rarity].bg} opacity-20 blur-[80px] animate-spin-slow`}></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-wider drop-shadow-lg">ES LEBT!</h2>
                        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${RARITIES[hatchingPet.rarity].color} mb-8`}>
                            Neuer Begleiter
                        </p>
                        
                        {/* --- VISUALISIERUNG (JETZT VIEL GRÖSSER) --- */}
                        <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-8">
                            {/* Rotierende Ringe */}
                            <div className={`absolute inset-0 border-4 border-dashed ${RARITIES[hatchingPet.rarity].border} rounded-full opacity-30 animate-spin-slow`}></div>
                            <div className={`absolute inset-6 border-2 ${RARITIES[hatchingPet.rarity].border} rounded-full opacity-50 animate-ping-slow`}></div>
                            
                            {/* Das echte Pet Bild (Groß) */}
                            <div className="relative z-10 transition-transform hover:scale-105 duration-500">
                                <PetAvatar 
                                    pet={{ ...hatchingPet, isEgg: false }} 
                                    className="w-56 h-56 drop-shadow-[0_15px_35px_rgba(0,0,0,0.4)]" 
                                />
                            </div>

                            <Sparkles className="absolute top-0 right-0 text-yellow-300 w-10 h-10 animate-bounce delay-100 z-20" />
                            <Sparkles className="absolute bottom-0 left-0 text-white w-8 h-8 animate-bounce delay-300 z-20" />
                        </div>
                        
                        {/* Info Text */}
                        <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 mb-6 border border-white/5">
                            <p className="text-slate-300 text-sm">
                                Ein <span className={`${RARITIES[hatchingPet.rarity].color} font-bold`}>{RARITIES[hatchingPet.rarity].label}</span>es <br/>
                                <span className="font-bold text-white">{TYPES[hatchingPet.type].label}-Monster</span> ist geschlüpft!
                            </p>
                        </div>
                        
                        {/* Namens Input */}
                        <div className="text-left mb-6">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-wider">Gib ihm einen Namen</label>
                            <div className="flex items-center bg-slate-950 rounded-2xl mt-1 border border-white/10 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all overflow-hidden">
                                <input 
                                    type="text" 
                                    value={nameInput} 
                                    onChange={(e) => setNameInput(e.target.value)} 
                                    className="bg-transparent w-full p-4 outline-none text-white font-bold text-lg placeholder-slate-700 text-center" 
                                    autoFocus 
                                    onFocus={(e) => e.target.select()}
                                />
                                <div className="pr-4 text-slate-600">
                                    <Edit3 className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Button */}
                        <button 
                            onClick={confirmHatch} 
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Check className="w-6 h-6" />
                            WILLKOMMEN!
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- HEADER --- */}
        <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
            <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white">
                BRUTSTÄTTE
            </h1>
            <button 
                onClick={onBack} 
                className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* --- INFO BAR --- */}
        <div className="px-4 mb-4">
            <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <ThermometerSun className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Kapazität</div>
                        <div className="text-sm font-black text-white">{incubatingEggs.length} / {unlockedSlots} Eier</div>
                    </div>
                </div>
                <div className="text-xs text-slate-500 font-mono bg-black/30 px-2 py-1 rounded">
                    T {20 + user.level}°C
                </div>
            </div>
        </div>

        {/* --- SLOTS GRID --- */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: maxSlots }).map((_, index) => {
              const isUnlocked = index < unlockedSlots;
              const egg = index < incubatingEggs.length ? incubatingEggs[index] : null;
              
              if (!isUnlocked) {
                  return (
                    <div key={index} className="aspect-square bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-50">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                            <Lock className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                            Lvl {index === 0 ? 1 : (index === 1 ? 15 : 15 + ((index-1)*10))}
                        </span>
                    </div>
                  );
              }

              if (egg) {
                  const timeLeft = Math.max(0, Math.ceil((egg.hatchAt - Date.now()) / 1000));
                  const isReady = timeLeft <= 0;
                  const rarity = RARITIES[egg.rarity];

                  return (
                    <div key={egg.id} className="relative aspect-square bg-slate-800 rounded-3xl p-3 flex flex-col items-center justify-between border border-white/5 shadow-lg group overflow-hidden">
                        <div className={`absolute inset-0 ${rarity.bg} opacity-5 blur-xl group-hover:opacity-10 transition-opacity`}></div>
                        
                        <div className="w-full flex justify-end relative z-10">
                            {isReady ? (
                                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
                            ) : (
                                <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                            )}
                        </div>

                        <div className={`relative z-10 ${isReady ? 'animate-bounce' : 'animate-pulse duration-[3000ms]'}`}>
                            <Egg className={`w-14 h-14 ${rarity.color} drop-shadow-lg`} />
                            <div className={`absolute -inset-2 border-2 ${rarity.border} rounded-full opacity-30 scale-110`}></div>
                        </div>

                        <div className="w-full relative z-10">
                            {isReady ? (
                                <button onClick={() => startHatchingProcess(egg)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1">
                                    SCHLÜPFEN
                                </button>
                            ) : (
                                <div className="bg-black/30 rounded-xl py-2 px-2 flex items-center justify-center gap-2 border border-white/5">
                                    <Hourglass className="w-3 h-3 text-amber-400 animate-spin-slow" />
                                    <span className="font-mono text-xs text-white font-bold">
                                        {timeLeft > 3600 ? `${Math.floor(timeLeft/3600)}h` : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                  );
              }

              return (
                <div key={index} className="aspect-square bg-slate-800/30 border-2 border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:border-slate-600 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Leer</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
}