import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Egg, Dna, ShoppingBag } from 'lucide-react';
import { RARITIES, TYPES } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export default function InventoryScreen({ pets, title = "Inventar", onBack, onSelectPet, highlightMode = false, filterEggs = false }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    
    // Wir nutzen direkt die 'pets' Prop für die Anzeige, filtern sie aber lokal nach Suche/Typ
    // WICHTIG: Keine Kopie in useState(pets), damit Updates von außen (App.jsx Filter) sofort greifen!

    const filteredPets = pets.filter(pet => {
        // 1. Suche
        const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (pet.species && pet.species.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // 2. Typ Filter
        const matchesType = filterType === 'ALL' || pet.type === filterType;

        // 3. Eier Filter (falls prop gesetzt)
        const matchesEgg = filterEggs ? !pet.isEgg : true;

        return matchesSearch && matchesType && matchesEgg;
    });

    // Sortieren: Favoriten/Seltenheit oben
    filteredPets.sort((a, b) => {
        const rA = RARITIES[a.rarity]?.id || 0;
        const rB = RARITIES[b.rarity]?.id || 0;
        return rB - rA;
    });

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 bg-slate-950">
            
            {/* HEADER */}
            <div className="relative flex items-center justify-between mb-4 pt-2 px-4 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-black italic tracking-wide text-white uppercase">{title}</h2>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-white/5">
                    {filteredPets.length} Pets
                </div>
            </div>

            {/* FILTERS */}
            <div className="px-4 mb-4 space-y-3">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Suchen..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Type Filter Pills */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    <button onClick={() => setFilterType('ALL')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${filterType === 'ALL' ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>Alle</button>
                    {Object.keys(TYPES).map(type => (
                        <button 
                            key={type} 
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${filterType === type ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}
                        >
                            {/* Kleiner Farb-Punkt für den Typ */}
                            <span className={`w-2 h-2 rounded-full ${TYPES[type].bg}`}></span>
                            {TYPES[type].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
                {filteredPets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                        <p className="text-sm font-bold">Keine Pets gefunden.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filteredPets.map(pet => {
                            const rarity = RARITIES[pet.rarity] || RARITIES.COMMON;
                            const typeInfo = TYPES[pet.type] || TYPES.FIRE;
                            
                            return (
                                <div 
                                    key={pet.id} 
                                    onClick={() => onSelectPet(pet.id)}
                                    className={`
                                        relative group overflow-hidden rounded-2xl p-3 cursor-pointer transition-all duration-300
                                        bg-slate-900/60 border border-white/5
                                        ${highlightMode ? 'hover:border-indigo-500 hover:bg-indigo-500/10 active:scale-95' : 'hover:border-white/20'}
                                    `}
                                >
                                    {/* Type Background Glow */}
                                    <div className={`absolute -right-8 -top-8 w-24 h-24 ${typeInfo.bg} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>

                                    <div className="flex flex-col items-center relative z-10">
                                        <div className="relative mb-2">
                                            <PetAvatar pet={pet} className="w-16 h-16 drop-shadow-md transition-transform group-hover:scale-110 duration-500" />
                                            {/* Source Badge (optional) */}
                                            {pet.source === 'BREEDING' && (
                                                <div className="absolute -bottom-1 -right-1 bg-pink-500 p-1 rounded-full border-2 border-slate-900 shadow-sm">
                                                    <Dna className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center w-full">
                                            <div className="font-black text-white text-xs truncate w-full mb-1">{pet.name}</div>
                                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                <span className="text-[9px] font-bold text-slate-400 bg-slate-950/50 px-1.5 py-0.5 rounded">Lvl {pet.level}</span>
                                                <span className={`text-[9px] font-bold uppercase ${rarity.color}`}>{rarity.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Auswahl-Indikator bei Highlight-Mode */}
                                    {highlightMode && (
                                        <div className="absolute inset-0 border-2 border-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}