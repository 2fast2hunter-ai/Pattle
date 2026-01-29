import React from 'react';
import { ArrowLeft, Scissors, Lock, CheckCircle2, Ticket, Sparkles, Zap, Dna, Smile } from 'lucide-react';
import { COSMETICS, RESOURCE_ITEMS, SPECIAL_OFFERS, PROFILE_ICONS } from '../data/gameData';

const getItemLabel = (id) => {
    for (const list of Object.values(RESOURCE_ITEMS)) {
        const found = list.find(i => i.id === id);
        if (found) return found.label;
    }
    return id;
};

// Helper für das Icon des Spezial-Angebots
const getSpecialIcon = (rewardType, variant) => {
    if (rewardType === 'AD_TICKET') return <Ticket className="w-8 h-8 text-yellow-400" />;
    if (variant === 'BREED') return <Dna className="w-8 h-8 text-pink-400" />;
    if (variant === 'SHINY_POTION') return <Sparkles className="w-8 h-8 text-cyan-300" />;
    if (variant?.includes('XP')) return <Zap className="w-8 h-8 text-yellow-500" />;
    return <Sparkles className="w-8 h-8 text-white" />;
};

export default function VillageCosmeticsScreen({ user, onBack, onBuy, onBuySpecial }) { // onBuySpecial prop
    const storage = user.village.storage || {};

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            
            <div className="relative flex items-center justify-center mb-4 pt-2 px-4 shrink-0 z-10">
                <h2 className="text-2xl font-black italic tracking-wide text-white">SCHNEIDER</h2>
                <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"><ArrowLeft className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">
                
                {/* 1. PROFILBILDER (NEU) */}
                <div>
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3 mb-3">
                        <Smile className="w-5 h-5 text-yellow-400" />
                        <p className="text-slate-400 text-xs font-bold uppercase">Profilbilder</p>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Object.values(PROFILE_ICONS).filter(icon => icon.costAmount > 0).map(icon => {
                            const canAfford = (storage[icon.costItem] || 0) >= icon.costAmount;
                            return (
                                <div key={icon.id} className="bg-slate-800 rounded-2xl border border-white/5 p-3 flex flex-col items-center gap-2 group">
                                    <div className="text-4xl drop-shadow-md transform group-hover:scale-110 transition-transform">{icon.icon}</div>
                                    <div className="text-center w-full">
                                        <div className="text-[10px] font-bold text-white truncate">{icon.label}</div>
                                        <div className="text-[9px] text-slate-400 flex justify-center items-center gap-1 mb-2">
                                            <span className={canAfford ? 'text-green-400' : 'text-red-400'}>{icon.costAmount}x {getItemLabel(icon.costItem)}</span>
                                        </div>
                                        <button 
                                            onClick={() => onBuy(icon.id)} 
                                            disabled={!canAfford} 
                                            className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase transition-all active:scale-95 ${canAfford ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                        >
                                            Kaufen
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. HINTERGRÜNDE */}
                <div>
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3 mb-3">
                        <Scissors className="w-5 h-5 text-pink-400" />
                        <p className="text-slate-400 text-xs font-bold uppercase">Exklusive Hintergründe</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Object.values(COSMETICS).map(cosmetic => {
                            const canAfford = (storage[cosmetic.costItem] || 0) >= cosmetic.costAmount;
                            return (
                                <div key={cosmetic.id} className="bg-slate-800 rounded-2xl border border-white/5 overflow-hidden flex flex-col group">
                                    <div className={`h-20 w-full ${cosmetic.colorClass} flex items-center justify-center relative`}>
                                        <div className="w-12 h-12 bg-black/20 rounded-full backdrop-blur-sm border border-white/10"></div>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold text-white mb-1 truncate">{cosmetic.label.replace('Hintergrund: ', '')}</h3>
                                            <div className="text-[9px] text-slate-400 flex items-center gap-1 mb-2">
                                                <span>Kosten:</span>
                                                <span className={canAfford ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{cosmetic.costAmount}x {getItemLabel(cosmetic.costItem)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => onBuy(cosmetic.id)} disabled={!canAfford} className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase transition-all active:scale-95 ${canAfford ? 'bg-pink-600 text-white hover:bg-pink-500 shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>Kaufen</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. NEU: SPEZIALITÄTEN */}
                <div>
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3 mb-3">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <p className="text-slate-400 text-xs font-bold uppercase">Seltene Waren</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SPECIAL_OFFERS.map(offer => {
                            const canAfford = (storage[offer.costItem] || 0) >= offer.costAmount;
                            const variant = offer.reward.variant || offer.reward.itemVariant;

                            return (
                                <div key={offer.id} className="bg-slate-800 rounded-2xl border border-white/5 p-3 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5 shadow-inner shrink-0">
                                        {getSpecialIcon(offer.reward.type, variant)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-white">{offer.label}</h3>
                                        <p className="text-[10px] text-slate-500 mb-1.5">{offer.description}</p>
                                        <div className="text-[10px] font-mono font-bold flex items-center gap-1">
                                            <span className="text-slate-400">Preis:</span>
                                            <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                                                {offer.costAmount}x {getItemLabel(offer.costItem)}
                                            </span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => onBuySpecial(offer.id)}
                                        disabled={!canAfford}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 shrink-0 ${canAfford ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                    >
                                        Tauschen
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}