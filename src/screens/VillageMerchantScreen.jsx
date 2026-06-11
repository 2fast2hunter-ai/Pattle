import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { MERCHANT_OFFERS } from '../data/villageEvents';

const ITEM_LABELS = {
    stone_iron: 'Eisen / Iron',
    wood_beech: 'Buche / Beech',
    stardust_crystal: 'Kristall / Crystal',
    seafood_pearl: 'Perlen / Pearls',
    stone_diamond: 'Diamant / Diamond',
};

export default function VillageMerchantScreen({ user, onBack, onBuy, t, lang }) {
    const storage = user?.village?.storage || {};
    const isDE = lang !== 'en';

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 bg-slate-950">
            {/* Header */}
            <div className="relative flex items-center justify-center py-4 px-4 shrink-0 border-b border-white/5">
                <button onClick={onBack} className="absolute left-4 p-2 rounded-xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <div className="text-[10px] font-bold uppercase text-yellow-500 tracking-widest">🧙</div>
                    <h1 className="text-lg font-black text-white uppercase tracking-widest">
                        {isDE ? 'Händler' : 'Merchant'}
                    </h1>
                </div>
            </div>

            {/* Info */}
            <div className="px-4 pt-3 pb-1 shrink-0">
                <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500/30 p-3 text-xs text-yellow-200 font-medium">
                    {isDE
                        ? 'Ein seltener Händler ist in deinem Dorf! Nutze diese Gelegenheit für exklusive Items.'
                        : 'A rare merchant has arrived in your village! Use this opportunity for exclusive items.'}
                </div>
            </div>

            {/* Offers */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {MERCHANT_OFFERS.map(offer => {
                    const available = storage[offer.costItem] || 0;
                    const canAfford = available >= offer.costAmount;
                    const label = isDE ? offer.label : offer.labelEn;
                    const costLabel = ITEM_LABELS[offer.costItem] || offer.costItem;

                    return (
                        <div
                            key={offer.id}
                            className={`rounded-2xl p-4 border flex items-center justify-between gap-3 ${canAfford ? 'bg-slate-800 border-white/10' : 'bg-slate-900/50 border-slate-800 opacity-60'}`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-yellow-700 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-yellow-200" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-black text-white">{label}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                        {isDE ? 'Kosten' : 'Cost'}: {offer.costAmount}× {costLabel}
                                    </div>
                                    <div className={`text-[10px] font-bold mt-0.5 ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isDE ? 'Verfügbar' : 'Available'}: {available}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => canAfford && onBuy(offer.id)}
                                disabled={!canAfford}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 ${canAfford ? 'bg-yellow-600 text-white hover:bg-yellow-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                            >
                                {isDE ? 'Kaufen' : 'Buy'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
