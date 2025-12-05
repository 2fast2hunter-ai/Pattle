import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Lock, Hourglass, Edit3, Egg, ThermometerSun, Check, X, Sparkles, Ticket, FastForward, Plus, Backpack } from 'lucide-react';
import { RARITIES, TYPES } from '../data/gameData';
import { getUnlockedHatcherySlots } from '../utils/gameMechanics';
import PetAvatar from '../components/PetAvatar';

// --- HELPER: EIER AUSWAHL MODAL ---
function EggSelectionModal({ eggs, onSelect, onClose }) {
    // 1. Eier stapeln und sortieren
    const eggStacks = useMemo(() => {
        const stacks = {};
        
        eggs.forEach(egg => {
            // Wir gruppieren nach Seltenheit (und Quelle, falls gewünscht, hier simpel nach Rarity)
            const key = egg.rarity; 
            if (!stacks[key]) {
                stacks[key] = { 
                    rarity: egg.rarity, 
                    count: 0, 
                    egg: egg, // Ein Referenz-Ei für die Anzeige
                    ids: []   // Alle IDs in diesem Stack
                };
            }
            stacks[key].count++;
            stacks[key].ids.push(egg.id);
        });

        // In Array umwandeln und sortieren (Höchste Seltenheit zuerst)
        return Object.values(stacks).sort((a, b) => {
            const rA = RARITIES[a.rarity]?.id || 0;
            const rB = RARITIES[b.rarity]?.id || 0;
            return rB - rA; 
        });
    }, [eggs]);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl flex flex-col shadow-2xl relative overflow-hidden max-h-[80vh]">
                
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
                            <Backpack className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg leading-none">Ei auswählen</h3>
                            <p className="text-xs text-slate-400 font-bold mt-1">{eggs.length} verfügbar</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Liste */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-3">
                    {eggStacks.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                            <Egg className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-bold">Keine Eier im Rucksack</p>
                            <p className="text-xs mt-1">Besuche den Shop oder züchte Pets!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {eggStacks.map((stack) => {
                                const rarity = RARITIES[stack.rarity];
                                return (
                                    <button 
                                        key={stack.rarity}
                                        onClick={() => onSelect(stack.ids[0])} // Nimm das erste Ei vom Stapel
                                        className="relative group bg-slate-800 border border-white/5 hover:border-white/20 rounded-2xl p-3 transition-all active:scale-95 flex flex-col items-center text-center overflow-hidden"
                                    >
                                        <div className={`absolute inset-0 ${rarity.bg} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                        
                                        {/* Counter Badge */}
                                        <div className="absolute top-2 right-2 bg-white text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                                            x{stack.count}
                                        </div>

                                        <div className="mb-2 relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                                            <Egg className={`w-12 h-12 ${rarity.color} drop-shadow-md`} />
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className={`text-xs font-black ${rarity.color} uppercase mb-0.5`}>{rarity.label}</div>
                                            <div className="text-[9px] text-slate-500 font-bold">Bereit zum Ausbrüten</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


// --- MAIN SCREEN ---
export default function HatcheryScreen({ pets, user, onBack, onHatchEgg, onReduceCooldown, onStartIncubation }) {
  const unlockedSlots = getUnlockedHatcherySlots(user.level);
  const maxSlots = 10;
  
  // States
  const [hatchingPet, setHatchingPet] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [showSelector, setShowSelector] = useState(false); // Zeigt das Auswahl-Modal

  const ticketCount = user?.inventory?.filter(i => i.type === 'TICKET').length || 0;

  // Timer force update
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Eier filtern
  const incubatingEggs = pets.filter(p => p.isEgg && p.hatchAt > 0);
  const inventoryEggs = pets.filter(p => p.isEgg && (p.hatchAt === 0 || !p.hatchAt));

  // Slots belegen Logik (Arrays für das Grid bauen)
  // Wir mappen über die Indizes 0..9
  // Wenn index < incubatingEggs.length -> Zeige Ei
  // Wenn index >= incubatingEggs.length UND index < unlockedSlots -> Zeige "Leer" (Klickbar)
  // Sonst -> "Gesperrt"

  const handleSlotClick = (index) => {
      // Prüfen ob Slot leer und freigeschaltet ist
      if (index >= incubatingEggs.length && index < unlockedSlots) {
          setShowSelector(true);
      }
  };

  const handleSelectEgg = (eggId) => {
      onStartIncubation(eggId);
      setShowSelector(false);
  };

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

  const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
      <div className="h-full flex flex-col animate-in fade-in relative">
        
        {/* MODAL: EI AUSWAHL */}
        {showSelector && (
            <EggSelectionModal 
                eggs={inventoryEggs} 
                onSelect={handleSelectEgg} 
                onClose={() => setShowSelector(false)} 
            />
        )}

        {/* MODAL: SCHLÜPFEN */}
        {hatchingPet && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-6 animate-in zoom-in-50 duration-300">
                <div className={`bg-slate-900 border-2 ${RARITIES[hatchingPet.rarity].border} w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden group`}>
                    
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] ${RARITIES[hatchingPet.rarity].bg} opacity-20 blur-[80px] animate-spin-slow`}></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white mb-1 uppercase drop-shadow-sm">
                            ES LEBT!
                        </h2>
                        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${RARITIES[hatchingPet.rarity].color} mb-8`}>
                            Neuer Begleiter
                        </p>
                        
                        <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-8">
                            <div className={`absolute inset-0 border-4 border-dashed ${RARITIES[hatchingPet.rarity].border} rounded-full opacity-30 animate-spin-slow`}></div>
                            <div className={`absolute inset-6 border-2 ${RARITIES[hatchingPet.rarity].border} rounded-full opacity-50 animate-ping-slow`}></div>
                            
                            <div className="relative z-10 transition-transform hover:scale-105 duration-500">
                                <PetAvatar 
                                    pet={{ ...hatchingPet, isEgg: false }} 
                                    className="w-56 h-56 drop-shadow-[0_15px_35px_rgba(0,0,0,0.4)]" 
                                />
                            </div>

                            <Sparkles className="absolute top-0 right-0 text-yellow-300 w-10 h-10 animate-bounce delay-100 z-20" />
                            <Sparkles className="absolute bottom-0 left-0 text-white w-8 h-8 animate-bounce delay-300 z-20" />
                        </div>
                        
                        <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 mb-6 border border-white/5">
                            <p className="text-slate-300 text-sm">
                                Ein <span className={`${RARITIES[hatchingPet.rarity].color} font-bold`}>{RARITIES[hatchingPet.rarity].label}</span>es <br/>
                                <span className="font-bold text-white">{TYPES[hatchingPet.type].label}-Monster</span> ist geschlüpft!
                            </p>
                        </div>
                        
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
                
                {/* Tickets Info (zum Beschleunigen) */}
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5">
                    <Ticket className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-xs font-bold text-white">{ticketCount}</span>
                </div>
            </div>
        </div>

        {/* --- SLOTS GRID --- */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: maxSlots }).map((_, index) => {
              const isUnlocked = index < unlockedSlots;
              // Das "i-te" Ei aus der Inkubations-Liste
              const egg = index < incubatingEggs.length ? incubatingEggs[index] : null;
              
              // GESPERRT
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

              // BELEGT MIT EI
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
                                <div className="flex gap-1">
                                    <div className="bg-black/30 rounded-xl py-2 px-2 flex-1 flex items-center justify-center gap-1 border border-white/5">
                                        <Hourglass className="w-3 h-3 text-amber-400 animate-spin-slow" />
                                        <span className="font-mono text-xs text-white font-bold">
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                    
                                    {ticketCount > 0 && (
                                        <button 
                                            onClick={() => onReduceCooldown(egg.id, 'HATCHING')}
                                            className="bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                                            title="-5 Min"
                                        >
                                            <FastForward className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                  );
              }

              // FREIER SLOT (JETZT KLICKBAR)
              return (
                <button 
                    key={index} 
                    onClick={() => handleSlotClick(index)}
                    className="aspect-square bg-slate-800/30 border-2 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50 rounded-3xl flex flex-col items-center justify-center gap-2 group transition-all active:scale-95 cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                        <Plus className="w-6 h-6 text-slate-500 group-hover:text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-emerald-400">Belegen</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
}