import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

export default function ItemActionModal({ title, icon: MainIcon, count, description, actionLabel, actionIcon: ActionIcon, onAction, onClose, colorClass, bgClass, borderClass, specialBadge, showQuantitySelector }) {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity(q => Math.min(q + 1, count));
    const decrement = () => setQuantity(q => Math.max(q - 1, 1));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in zoom-in-50 duration-300">
            <div className={`bg-slate-900/90 border border-white/10 w-full max-w-sm rounded-[32px] p-0 relative overflow-hidden flex flex-col shadow-2xl shadow-black/50`}>
                
                <div className="relative h-44 flex items-center justify-center overflow-hidden shrink-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${bgClass} blur-[60px] opacity-30 animate-pulse`}></div>
                    
                    <div className="relative z-10 scale-150 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                        <MainIcon className={`w-28 h-28 ${colorClass}`} />
                        {specialBadge}
                    </div>
                    
                    <div className="absolute bottom-4 bg-slate-950/80 text-white text-sm font-black px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg z-20 flex items-center gap-1">
                        <span className="text-slate-400">Besitz:</span> x{Math.floor(count)}
                    </div>

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-white/20 transition-colors z-20 backdrop-blur-md border border-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <h2 className={`text-2xl font-black ${colorClass} mb-3 uppercase tracking-wide drop-shadow-sm`}>{title}</h2>
                    <div className="text-sm text-slate-300 leading-relaxed mb-6">{description}</div>
                    
                    {/* MENGENAUSWAHL */}
                    {showQuantitySelector && count > 1 && (
                        <div className="flex justify-center items-center gap-4 mb-6 bg-slate-800/50 p-2 rounded-2xl border border-white/5 w-fit mx-auto">
                            <button onClick={decrement} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-white/10"><Minus className="w-4 h-4 text-white" /></button>
                            <div className="text-center w-12">
                                <span className="block text-[10px] text-slate-400 font-bold uppercase">Menge</span>
                                <span className="block text-xl font-black text-white">{quantity}</span>
                            </div>
                            <button onClick={increment} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-white/10"><Plus className="w-4 h-4 text-white" /></button>
                            <button onClick={() => setQuantity(count)} className="text-[10px] font-bold text-indigo-400 uppercase ml-2 hover:text-white transition-colors">Max</button>
                        </div>
                    )}

                    {onAction && (
                        <button 
                            onClick={() => onAction(quantity)} 
                            className={`w-full py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all font-black text-white
                            bg-gradient-to-r ${borderClass === 'pink' ? 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-500/30' : (borderClass === 'yellow' ? 'from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 shadow-yellow-500/30' : 'from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/30')}`}
                        >
                            <ActionIcon className="w-5 h-5" /> {actionLabel} {showQuantitySelector && quantity > 1 ? `(${quantity}x)` : ''}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}