import React, { useState } from 'react';
import { Swords, Heart, Shield, Zap, X, Ghost, Search, Filter, ArrowDownWideNarrow, Wind, Activity } from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export default function InventoryScreen({ pets, onSelectPet, onBack, title, highlightMode, filterEggs }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL');
  const [activeRarityFilter, setActiveRarityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('RARITY');

  // Filter: Eier ausblenden (außer explizit gewünscht)
  let filteredPets = filterEggs ? pets.filter(p => !p.isEgg) : pets.filter(p => !p.isEgg); 

  if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filteredPets = filteredPets.filter(p => 
          p.name.toLowerCase().includes(lowerTerm) || 
          RARITIES[p.rarity].label.toLowerCase().includes(lowerTerm) ||
          (ZODIAC_ANIMALS[p.species]?.label || '').toLowerCase().includes(lowerTerm)
      );
  }
  if (activeTypeFilter !== 'ALL') filteredPets = filteredPets.filter(p => p.type === activeTypeFilter);
  if (activeRarityFilter !== 'ALL') filteredPets = filteredPets.filter(p => p.rarity === activeRarityFilter);

  filteredPets.sort((a, b) => {
      switch (sortBy) {
          case 'ATK': return b.atk - a.atk;
          case 'DEF': return b.def - a.def;
          case 'SPEED': return b.speed - a.speed;
          case 'HP': return b.hp - a.hp;
          case 'LEVEL': return b.level - a.level;
          case 'RARITY': default:
              const rA = RARITIES[a.rarity]?.id || 0;
              const rB = RARITIES[b.rarity]?.id || 0;
              if (rB === rA) return b.level - a.level;
              return rB - rA;
      }
  });

  const resetFilters = () => { setSearchTerm(''); setActiveTypeFilter('ALL'); setActiveRarityFilter('ALL'); setSortBy('RARITY'); };
  const activeFilterCount = (activeTypeFilter !== 'ALL' ? 1 : 0) + (activeRarityFilter !== 'ALL' ? 1 : 0) + (searchTerm ? 1 : 0) + (sortBy !== 'RARITY' ? 1 : 0);

  return (
    <div className="h-full flex flex-col animate-in fade-in relative">
      {/* Sidebar & Header (unverändert übernommen) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative w-4/5 max-w-xs bg-slate-900 h-full shadow-2xl p-5 flex flex-col gap-6 border-r border-white/10">
                <div className="flex justify-between items-center pb-4 border-b border-white/10"><h2 className="text-xl font-black text-white flex items-center gap-2"><Filter className="w-5 h-5 text-blue-400" /> FILTER</h2><button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
                <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Suche</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" placeholder="Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500" /></div></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Sortieren</label><div className="grid grid-cols-2 gap-2">{[{id:'RARITY',l:'Seltenheit'}, {id:'LEVEL',l:'Level'}, {id:'ATK',l:'Angriff'}, {id:'HP',l:'Leben'}].map(opt => (<button key={opt.id} onClick={() => setSortBy(opt.id)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${sortBy === opt.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{opt.l}</button>))}</div></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Element</label><div className="grid grid-cols-4 gap-2"><button onClick={() => setActiveTypeFilter('ALL')} className={`aspect-square rounded-xl border flex items-center justify-center font-bold text-[10px] ${activeTypeFilter === 'ALL' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>ALL</button>{Object.keys(TYPES).map(k => (<button key={k} onClick={() => setActiveTypeFilter(k)} className={`aspect-square rounded-xl border flex items-center justify-center ${activeTypeFilter === k ? `${TYPES[k].bg} text-white border-transparent` : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{TYPES[k].icon}</button>))}</div></div>
                </div>
                <div className="pt-4 border-t border-white/10"><button onClick={resetFilters} className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm mb-3">Reset</button><button onClick={() => setSidebarOpen(false)} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm">Fertig</button></div>
            </div>
        </div>
      )}
      <div className="relative flex items-center justify-between mb-4 pt-2 px-4">
          <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-xl border transition-all relative ${activeFilterCount > 0 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400'}`}><Filter className="w-5 h-5" />{activeFilterCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold border border-slate-900">{activeFilterCount}</div>}</button>
          <h1 className="text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">{title || 'SAMMLUNG'}</h1>
          <button onClick={onBack} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white"><X className="w-5 h-5" /></button>
      </div>

      {/* --- GRID CONTENT --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
        {filteredPets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 opacity-50"><Ghost className="w-16 h-16 mb-4" /><p className="font-bold">Nichts gefunden.</p></div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredPets.map(pet => {
              const rarity = RARITIES[pet.rarity];
              const type = TYPES[pet.type];
              // Sicherer Zugriff auf Species
              const species = ZODIAC_ANIMALS[pet.species] || { label: 'Unbekannt' };

              return (
                <div 
                    key={pet.id} 
                    onClick={() => onSelectPet(pet.id)} 
                    className={`
                        relative overflow-hidden rounded-2xl p-2 cursor-pointer transition-all active:scale-95
                        bg-slate-800 border-2 group
                        ${highlightMode ? 'hover:ring-2 ring-yellow-400' : ''}
                        ${rarity.border}
                    `}
                >
                    <div className={`absolute -right-8 -top-8 w-24 h-24 ${type.bg} opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity`}></div>

                    <div className="flex justify-between items-center mb-1 relative z-10">
                        <span className="text-[9px] font-black bg-slate-900/80 px-1.5 py-0.5 rounded text-white border border-white/10">LVL {pet.level}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${rarity.bg} text-white shadow-sm`}>{rarity.label}</span>
                    </div>

                    <div className="flex justify-center mb-2 relative z-10">
                        <PetAvatar pet={pet} className="w-14 h-14 drop-shadow-md transition-transform group-hover:scale-110" />
                    </div>

                    <div className="relative z-10">
                        {/* --- LAYOUT UPDATE: 2 ZEILEN FÜR TEXT --- */}
                        <div className="bg-black/40 rounded p-1.5 backdrop-blur-sm border border-white/5 mb-1.5">
                             <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                 <span>{species.label}</span>
                                 <span className={`${type.color}`}>{type.label}</span>
                             </div>
                             <div className={`text-white text-[10px] truncate ${rarity.color} font-black text-center leading-tight`}>
                                 {pet.name}
                             </div>
                        </div>
                        {/* --------------------------------------- */}
                        
                        <div className="grid grid-cols-4 gap-0.5 text-[8px] font-bold text-slate-400 bg-black/20 p-1 rounded">
                            <div className="flex flex-col items-center"><Swords className="w-2.5 h-2.5 text-red-400"/><span className="text-white">{pet.atk}</span></div>
                            <div className="flex flex-col items-center"><Shield className="w-2.5 h-2.5 text-slate-400"/><span className="text-white">{pet.def}</span></div>
                            <div className="flex flex-col items-center"><Zap className="w-2.5 h-2.5 text-purple-400"/><span className="text-white">{pet.ap}</span></div>
                            <div className="flex flex-col items-center"><Heart className="w-2.5 h-2.5 text-green-400"/><span className="text-white">{pet.hp}</span></div>
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