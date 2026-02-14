import React from 'react';
import { Filter, X, Search } from 'lucide-react';
import { TYPES } from '../../data/gameData';

export default function BreedingFilterSidebar({
    isOpen, onClose, searchTerm, setSearchTerm,
    activeTypeFilter, setActiveTypeFilter,
    sortBy, setSortBy, resetFilters, t
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-4/5 max-w-xs bg-slate-900 h-full shadow-2xl p-5 flex flex-col gap-6 border-r border-white/10">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <Filter className="w-5 h-5 text-pink-400" />
                        {t ? t('breeding_filter_title') : 'FILTER'}
                    </h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{t ? t('breeding_search') : 'Suche'}</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-pink-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{t ? t('breeding_sort') : 'Sortieren'}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['RARITY', 'LEVEL', 'ATK', 'HP'].map(opt => (
                                <button key={opt} onClick={() => setSortBy(opt)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${sortBy === opt ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{t ? t('breeding_element') : 'Element'}</label>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => setActiveTypeFilter('ALL')} className={`aspect-square rounded-xl border flex items-center justify-center font-bold text-[10px] ${activeTypeFilter === 'ALL' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>ALL</button>
                            {Object.keys(TYPES).map(k => (
                                <button key={k} onClick={() => setActiveTypeFilter(k)} className={`aspect-square rounded-xl border flex items-center justify-center ${activeTypeFilter === k ? `${TYPES[k].bg} text-white border-transparent` : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{TYPES[k].icon}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                    <button onClick={resetFilters} className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm mb-3">{t ? t('breeding_reset') : 'Reset'}</button>
                    <button onClick={onClose} className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm">{t ? t('breeding_done') : 'Fertig'}</button>
                </div>
            </div>
        </div>
    );
}
