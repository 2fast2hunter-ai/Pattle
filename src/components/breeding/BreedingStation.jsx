import React from 'react';
import { Heart, Loader2, Dna, Trash2 } from 'lucide-react';
import { RARITIES, TYPES } from '../../data/gameData';
import PetAvatar from '../PetAvatar';

export default function BreedingStation({
    selected, pets, toggleSelect, canBreed, isBreeding,
    handleBreedClick, rarityProbabilities, t
}) {
    const p1 = selected.length > 0 ? pets.find(p => p.id === selected[0]) : null;
    const p2 = selected.length > 1 ? pets.find(p => p.id === selected[1]) : null;

    return (
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
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-full">{p1 ? p1.name : (t ? t('breeding_parent_1') : 'Elternteil 1')}</span>
                    </div>

                    {/* Parent 2 */}
                    <div className="flex flex-col items-center gap-2 w-24">
                        <div onClick={() => p2 && toggleSelect(p2.id)} className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all cursor-pointer relative overflow-hidden ${p2 ? `${RARITIES[p2.rarity].border} bg-slate-800` : 'border-dashed border-slate-600 bg-slate-900/50'}`}>
                            {p2 ? <PetAvatar pet={p2} className="w-16 h-16" /> : <Dna className="w-8 h-8 text-slate-600" />}
                            {p2 && <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100"><Trash2 className="text-white w-6 h-6" /></div>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-full">{p2 ? p2.name : (t ? t('breeding_parent_2') : 'Elternteil 2')}</span>
                    </div>
                </div>

                {/* VORSCHAU DER MÖGLICHEN KINDER */}
                {canBreed && (
                    <div className="mt-4 bg-slate-900/60 rounded-2xl p-3 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Dna className="w-3 h-3 text-pink-400" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t ? t('breeding_preview') : 'Genetik Vorschau'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* TYPES */}
                            <div className="bg-black/20 rounded-xl p-2 flex flex-col items-center justify-center">
                                <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">{t ? t('breeding_element') : 'Element'}</span>
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
                                <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">{t ? t('breeding_rarity') : 'Seltenheit'}</span>
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
                    onClick={handleBreedClick}
                    disabled={!canBreed || isBreeding}
                    className={`w-full mt-4 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${canBreed ? 'bg-pink-600 text-white hover:scale-[1.02] active:scale-95 shadow-pink-900/30' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                >
                    {isBreeding ? <Loader2 className="w-4 h-4 animate-spin" /> : (canBreed ? (t ? t('breeding_start_btn') : 'JETZT ZÜCHTEN') : (t ? t('breeding_select_2') : 'WÄHLE 2 PETS'))}
                </button>
            </div>
        </div>
    );
}
