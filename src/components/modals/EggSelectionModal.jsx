import React, { useMemo } from 'react';
import { Backpack, X, Dna, Egg } from 'lucide-react';
import { RARITIES } from '../../data/gameData';

export default function EggSelectionModal({ eggs, onSelect, onClose, t }) {
    const eggStacks = useMemo(() => {
        const stacks = {};
        
        eggs.forEach(egg => {
            const isBreeding = !!(egg.customData?.isBreeding || (egg.parents && egg.parents.length > 0));
            const typeKey = isBreeding ? 'BREED' : 'NORMAL';
            const key = `${egg.rarity}_${typeKey}`; 

            if (!stacks[key]) {
                stacks[key] = { 
                    id: key, 
                    rarity: egg.rarity, 
                    isBreeding: isBreeding,
                    count: 0, 
                    egg: egg, 
                    ids: []   
                };
            }
            stacks[key].count++;
            stacks[key].ids.push(egg.id);
        });

        return Object.values(stacks).sort((a, b) => {
            const rA = RARITIES[a.rarity]?.id || 0;
            const rB = RARITIES[b.rarity]?.id || 0;
            if (rA !== rB) return rB - rA;
            return (a.isBreeding === b.isBreeding) ? 0 : (a.isBreeding ? -1 : 1);
        });
    }, [eggs]);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl flex flex-col shadow-2xl relative overflow-hidden max-h-[80vh]">
                
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
                            <Backpack className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg leading-none">{t ? t('egg_modal_title') : 'Select Egg'}</h3>
                            <p className="text-xs text-slate-400 font-bold mt-1">{t ? t('egg_modal_available', { count: eggs.length }) : `${eggs.length} available`}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-3">
                    {eggStacks.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                            <Egg className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-bold">{t ? t('egg_modal_no_eggs') : 'No eggs in backpack'}</p>
                            <p className="text-xs mt-1">{t ? t('egg_modal_no_eggs_hint') : 'Visit the shop or breed pets!'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {eggStacks.map((stack) => {
                                const rarity = RARITIES[stack.rarity];
                                return (
                                    <button 
                                        key={stack.id}
                                        onClick={() => onSelect(stack.ids[0])} 
                                        className="relative group bg-slate-800 border border-white/5 hover:border-white/20 rounded-2xl p-3 transition-all active:scale-95 flex flex-col items-center text-center overflow-hidden"
                                    >
                                        <div className={`absolute inset-0 ${rarity.bg} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                        
                                        <div className="absolute top-2 right-2 bg-white text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                                            x{stack.count}
                                        </div>

                                        {stack.isBreeding && (
                                            <div className="absolute top-2 left-2 bg-pink-500/20 p-1 rounded-full border border-pink-500/50 z-10">
                                                <Dna className="w-3 h-3 text-pink-400" />
                                            </div>
                                        )}

                                        <div className="mb-2 relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                                            <Egg className={`w-12 h-12 ${rarity.color} drop-shadow-md`} />
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className={`text-xs font-black ${rarity.color} uppercase mb-0.5`}>{rarity.label}</div>
                                            <div className="text-[9px] text-slate-500 font-bold">
                                                {stack.isBreeding ? (t ? t('egg_breed_type') : 'Breeding Egg') : (t ? t('egg_ready_type') : 'Ready to hatch')}
                                            </div>
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