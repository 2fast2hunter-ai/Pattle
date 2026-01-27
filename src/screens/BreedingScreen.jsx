import React, { useState } from 'react';
import { ArrowLeft, Filter, X, Search, Heart, Dna, Ticket, Timer, Ghost, Swords, Shield, Zap, ArrowDownWideNarrow, Trash2, Clock, FastForward, Lock } from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export default function BreedingScreen({ pets, onBreed, onBack, user, onReduceCooldown }) {
  // --- STATES ---
  const [selected, setSelected] = useState([]); 
  
  // Filter & Sort States
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL');
  const [activeRarityFilter, setActiveRarityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('RARITY');

  // UPDATE: Zählt Tickets direkt aus dem Inventar
  const ticketCount = user?.inventory?.filter(i => i.type === 'TICKET').length || 0;

  // --- HELPER: Cooldown Berechnung ---
  const getCooldownStatus = (pet) => {
    if (!pet || !pet.bredAt) return null;
    const cooldownDuration = RARITIES[pet.rarity]?.breedCooldown || 0; 
    const cooldownEnd = pet.bredAt + cooldownDuration;
    const timeLeft = cooldownEnd - Date.now();

    if (timeLeft <= 0) return null;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m`;
  }

  const getLevelReq = (pet) => {
      return RARITIES[pet.rarity]?.minBreedLevel || 0;
  };

  // --- LOGIK: Selektion ---
  const toggleSelect = (id) => {
      const pet = pets.find(p => p.id === id);
      if (getCooldownStatus(pet)) return; 
      if (pet.level < getLevelReq(pet)) return; // Check Level

      // NEU: Check Rarity Match
      if (selected.length === 1) {
          const first = pets.find(p => p.id === selected[0]);
          if (first && first.rarity !== pet.rarity && !selected.includes(id)) {
              return; // Blockiere Auswahl unterschiedlicher Seltenheit
          }
      }

      if (selected.includes(id)) {
          setSelected(selected.filter(pid => pid !== id));
      } else {
          if (selected.length < 2) setSelected([...selected, id]);
          else {
              const first = pets.find(p => p.id === selected[0]);
              if (first && first.rarity !== pet.rarity) return; // Sicherheitscheck
              const newSel = [selected[0], id]; // Ersetze das zweite Pet
              setSelected(newSel);
          }
      }
  };

  // --- FILTER LOGIK ---
  let filteredPets = pets.filter(p => !p.isEgg); 

  if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filteredPets = filteredPets.filter(p => p.name.toLowerCase().includes(lower) || RARITIES[p.rarity].label.toLowerCase().includes(lower));
  }
  if (activeTypeFilter !== 'ALL') filteredPets = filteredPets.filter(p => p.type === activeTypeFilter);
  if (activeRarityFilter !== 'ALL') filteredPets = filteredPets.filter(p => p.rarity === activeRarityFilter);

  // --- SORTIERUNG ---
  filteredPets.sort((a, b) => {
      const cdA = getCooldownStatus(a) !== null; 
      const cdB = getCooldownStatus(b) !== null;

      // 1. Primär: Verfügbarkeit (Cooldown nach unten)
      if (cdA && !cdB) return 1;  
      if (!cdA && cdB) return -1; 

      // 2. Sekundär: Gewählte Sortierung
      switch (sortBy) {
          case 'ATK': return b.atk - a.atk;
          case 'HP': return b.hp - a.hp;
          case 'LEVEL': return b.level - a.level;
          case 'RARITY': default:
              const rA = RARITIES[a.rarity]?.id || 0;
              const rB = RARITIES[b.rarity]?.id || 0;
              return rB === rA ? b.level - a.level : rB - rA;
      }
  });

  const resetFilters = () => { setSearchTerm(''); setActiveTypeFilter('ALL'); setActiveRarityFilter('ALL'); setSortBy('RARITY'); };
  const activeFilterCount = (activeTypeFilter !== 'ALL' ? 1 : 0) + (activeRarityFilter !== 'ALL' ? 1 : 0) + (searchTerm ? 1 : 0);

  // --- BREEDING STATUS ---
  const p1 = selected.length > 0 ? pets.find(p => p.id === selected[0]) : null;
  const p2 = selected.length > 1 ? pets.find(p => p.id === selected[1]) : null;
  // UPDATE: Ticket Zwang entfernt, nur Pets nötig
  const canBreed = p1 && p2;

  // --- NEU: Wahrscheinlichkeits-Berechnung für Vorschau ---
  let rarityProbabilities = [];
  if (canBreed) {
      const r1 = RARITIES[p1.rarity];
      const r2 = RARITIES[p2.rarity];
      
      if (r1 && r2) {
          const sortedKeys = Object.keys(RARITIES).sort((a, b) => RARITIES[a].id - RARITIES[b].id);
          
          // Gleiche Seltenheit: 10% Chance auf Upgrade
          const idx = sortedKeys.indexOf(p1.rarity);
          const nextRarityKey = (idx !== -1 && idx < sortedKeys.length - 1) ? sortedKeys[idx + 1] : null;
          
          if (nextRarityKey) {
              rarityProbabilities = [
                  { key: nextRarityKey, chance: 10 },
                  { key: p1.rarity, chance: 90 }
              ];
          } else {
              rarityProbabilities = [{ key: p1.rarity, chance: 100 }];
          }
          // Filtern und Sortieren (Höchste Seltenheit oben)
          rarityProbabilities = rarityProbabilities.filter(p => p.chance > 0).sort((a, b) => RARITIES[b.key].id - RARITIES[a.key].id);
      }
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in relative">
      
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative w-4/5 max-w-xs bg-slate-900 h-full shadow-2xl p-5 flex flex-col gap-6 border-r border-white/10">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h2 className="text-xl font-black text-white flex items-center gap-2"><Filter className="w-5 h-5 text-pink-400" /> FILTER</h2>
                    <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Suche</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input type="text" placeholder="Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-pink-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Sortieren</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['RARITY', 'LEVEL', 'ATK', 'HP'].map(opt => (
                                <button key={opt} onClick={() => setSortBy(opt)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${sortBy === opt ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Element</label>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => setActiveTypeFilter('ALL')} className={`aspect-square rounded-xl border flex items-center justify-center font-bold text-[10px] ${activeTypeFilter === 'ALL' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>ALL</button>
                            {Object.keys(TYPES).map(k => (
                                <button key={k} onClick={() => setActiveTypeFilter(k)} className={`aspect-square rounded-xl border flex items-center justify-center ${activeTypeFilter === k ? `${TYPES[k].bg} text-white border-transparent` : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{TYPES[k].icon}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                    <button onClick={resetFilters} className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm mb-3">Reset</button>
                    <button onClick={() => setSidebarOpen(false)} className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm">Fertig</button>
                </div>
            </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="relative flex items-center justify-between mb-4 pt-2 px-4">
          <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-xl border transition-all relative ${activeFilterCount > 0 ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400'}`}>
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-pink-600 rounded-full flex items-center justify-center text-[9px] font-bold">{activeFilterCount}</div>}
          </button>
          <h1 className="text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-white">ZUCHT LABOR</h1>
          <button onClick={onBack} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
      </div>

      {/* --- BREEDING STATION --- */}
      <div className="px-4 mb-4">
        <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-slate-700 z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-2 rounded-full border border-white/10 z-10 shadow-xl">
                <Heart className={`w-5 h-5 ${canBreed ? 'text-pink-500 fill-pink-500 animate-pulse' : 'text-slate-600'}`} />
            </div>

            <div className="flex justify-between relative z-10">
                {/* Parent 1 */}
                <div className="flex flex-col items-center gap-2 w-24">
                    <div onClick={() => p1 && toggleSelect(p1.id)} className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all cursor-pointer relative overflow-hidden ${p1 ? `${RARITIES[p1.rarity].border} bg-slate-800` : 'border-dashed border-slate-600 bg-slate-900/50'}`}>
                        {p1 ? <PetAvatar pet={p1} className="w-16 h-16" /> : <Dna className="w-8 h-8 text-slate-600" />}
                        {p1 && <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100"><Trash2 className="text-white w-6 h-6" /></div>}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-full">{p1 ? p1.name : 'Elternteil 1'}</span>
                </div>

                {/* Parent 2 */}
                <div className="flex flex-col items-center gap-2 w-24">
                     <div onClick={() => p2 && toggleSelect(p2.id)} className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all cursor-pointer relative overflow-hidden ${p2 ? `${RARITIES[p2.rarity].border} bg-slate-800` : 'border-dashed border-slate-600 bg-slate-900/50'}`}>
                        {p2 ? <PetAvatar pet={p2} className="w-16 h-16" /> : <Dna className="w-8 h-8 text-slate-600" />}
                        {p2 && <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100"><Trash2 className="text-white w-6 h-6" /></div>}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-full">{p2 ? p2.name : 'Elternteil 2'}</span>
                </div>
            </div>
            
            {/* VORSCHAU DER MÖGLICHEN KINDER */}
            {canBreed && (
                <div className="mt-4 bg-slate-900/60 rounded-2xl p-3 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Dna className="w-3 h-3 text-pink-400" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Genetik Vorschau</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {/* TYPES */}
                        <div className="bg-black/20 rounded-xl p-2 flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">Element</span>
                            <div className="flex items-center justify-center gap-2 w-full">
                                {p1.type === p2.type ? (
                                    <div className={`flex items-center gap-1 ${TYPES[p1.type].color}`}>
                                        {TYPES[p1.type].icon} <span className="font-bold text-xs">100%</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`flex items-center gap-1 ${TYPES[p1.type].color}`}>
                                            {TYPES[p1.type].icon} <span className="font-bold text-xs">50%</span>
                                        </div>
                                        <div className="w-px h-3 bg-white/10"></div>
                                        <div className={`flex items-center gap-1 ${TYPES[p2.type].color}`}>
                                            {TYPES[p2.type].icon} <span className="font-bold text-xs">50%</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RARITY */}
                        <div className="bg-black/20 rounded-xl p-2 flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">Seltenheit</span>
                            <div className="flex flex-col w-full px-1 gap-0.5">
                                {rarityProbabilities.map(prob => {
                                    const r = RARITIES[prob.key];
                                    return (
                                    <div key={prob.key} className="flex justify-between items-center w-full">
                                        <span className={`text-[9px] font-bold ${r.color}`}>{r.label}</span>
                                        <span className="text-[9px] font-mono text-slate-400">{prob.chance}%</span>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button 
                onClick={() => canBreed && onBreed(p1.id, p2.id)}
                disabled={!canBreed}
                className={`w-full mt-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${canBreed ? 'bg-pink-600 text-white hover:scale-[1.02] active:scale-95 shadow-pink-900/30' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
            >
                {canBreed ? 'JETZT ZÜCHTEN' : 'WÄHLE 2 PETS'}
            </button>
        </div>
      </div>

      {/* --- INFO ÜBER TICKETS --- */}
      <div className="px-4 mb-2 flex justify-end">
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/5">
              <Ticket className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs font-bold text-white">{ticketCount} Tickets</span>
          </div>
      </div>

      {/* --- LISTE --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
          {filteredPets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500 opacity-50"><Ghost className="w-12 h-12 mb-2"/><p className="text-xs font-bold">Keine passenden Pets.</p></div>
          ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredPets.map(pet => {
                      const rarity = RARITIES[pet.rarity];
                      const type = TYPES[pet.type];
                      const isSelected = selected.includes(pet.id);
                      const cooldown = getCooldownStatus(pet);
                      const minLevel = getLevelReq(pet);
                      const isLevelLow = pet.level < minLevel;
                      
                      // NEU: Prüfen ob Seltenheit passt (wenn schon eins gewählt ist)
                      const firstSelected = selected.length > 0 ? pets.find(p => p.id === selected[0]) : null;
                      const isRarityMismatch = firstSelected && !isSelected && firstSelected.rarity !== pet.rarity;

                      return (
                        <div 
                            key={pet.id} 
                            onClick={() => !cooldown && !isLevelLow && !isRarityMismatch && toggleSelect(pet.id)} 
                            className={`
                                relative overflow-hidden rounded-2xl p-2 transition-all
                                bg-slate-800 border-2 
                                ${isSelected ? 'border-pink-500 ring-2 ring-pink-500/30 scale-[0.98]' : (cooldown || isLevelLow || isRarityMismatch ? 'border-slate-700 opacity-50 cursor-not-allowed' : `${rarity.border} cursor-pointer active:scale-95`)}
                            `}
                        >
                            {isSelected && <div className="absolute top-2 right-2 w-4 h-4 bg-pink-500 rounded-full border-2 border-white z-20 shadow-lg"></div>}
                            
                            {/* Level Low Overlay */}
                            {isLevelLow && (
                                <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-[2px] p-2 text-center animate-in fade-in">
                                    <Lock className="w-5 h-5 text-slate-400 mb-1" />
                                    <span className="text-xs font-black text-slate-200 mb-1">Lvl {minLevel}</span>
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">Benötigt</span>
                                </div>
                            )}

                            {/* Rarity Mismatch Overlay */}
                            {isRarityMismatch && (
                                <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center backdrop-blur-[1px] p-2 text-center animate-in fade-in">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">Falsche Seltenheit</span>
                                </div>
                            )}

                            {/* Cooldown Overlay */}
                            {!isLevelLow && !isRarityMismatch && cooldown && (
                                <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-[2px] p-2 text-center animate-in fade-in">
                                    <Clock className="w-5 h-5 text-red-400 mb-1" />
                                    <span className="text-xs font-black text-red-200 mb-2">{cooldown}</span>
                                    
                                    {ticketCount > 0 ? (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Verhindert Selektion
                                                onReduceCooldown(pet.id, 'BREEDING');
                                            }}
                                            className="bg-pink-600 hover:bg-pink-500 text-white text-[9px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-lg"
                                        >
                                            <Ticket className="w-3 h-3" /> -5m
                                        </button>
                                    ) : (
                                        <span className="text-[9px] text-slate-500 font-bold">Warten...</span>
                                    )}
                                </div>
                            )}

                            <div className={`absolute -right-8 -top-8 w-24 h-24 ${type.bg} opacity-20 blur-2xl rounded-full`}></div>
                            
                            <div className="flex justify-center mb-1 relative z-10">
                                <PetAvatar pet={pet} className="w-14 h-14 drop-shadow-md" />
                            </div>

                            <div className="relative z-10 text-center">
                                <h3 className={`font-bold text-xs truncate mb-1 ${rarity.color}`}>{pet.name}</h3>
                                <div className="flex justify-center gap-2 text-[9px] font-bold text-slate-400 bg-black/20 p-1 rounded-lg">
                                    <span className={`${type.color}`}>{type.label}</span>
                                    <span>Lvl {pet.level}</span>
                                </div>
                            </div>
                        </div>
                      );
                  })}
              </div>
          )}
      </div>
    </div>
  );
}