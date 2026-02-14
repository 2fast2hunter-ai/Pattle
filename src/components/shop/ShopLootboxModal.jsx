import React, { useRef } from 'react';
import { X, Clock, Percent, Minus, Plus, Coins, Box, Star, Crown, Zap, PlayCircle } from 'lucide-react';
import { LOOTBOXES, RARITIES, TYPES } from '../../data/gameData';

export default function ShopLootboxModal({
    viewingBox,
    onClose,
    onBuy,
    buyAmount,
    setBuyAmount,
    isBuying,
    isDailyAvailable,
    t,
    schedule,
    dailyTypes,
    TYPE_BOX_COST
}) {
    const boxConfig = {
        'DAILY': { color: 'text-sky-300', bg: 'bg-sky-600', icon: Box, border: 'border-sky-400', glow: 'shadow-sky-500/20' },
        'PREMIUM': { color: 'text-purple-300', bg: 'bg-purple-600', icon: Star, border: 'border-purple-400', glow: 'shadow-purple-500/20' },
        'MASTER': { color: 'text-amber-300', bg: 'bg-amber-600', icon: Crown, border: 'border-amber-400', glow: 'shadow-amber-500/20' },
        'TYPE_DAILY': { color: 'text-indigo-300', bg: 'bg-indigo-600', icon: Zap, border: 'border-indigo-400', glow: 'shadow-indigo-500/20', label: 'Elementar-Truhe' },
    };

    const currentConfig = boxConfig[viewingBox] || boxConfig['DAILY'];

    const getDropList = (boxKey) => {
        if (boxKey === 'TYPE_DAILY') {
            const masterDrops = LOOTBOXES.MASTER?.drops || {};
            return Object.entries(masterDrops).map(([rarityKey, chance]) => ({ ...RARITIES[rarityKey], chance })).sort((a, b) => b.id - a.id);
        }
        const box = LOOTBOXES[boxKey];
        if (!box) return [];
        return Object.entries(box.drops).map(([rarityKey, chance]) => ({ ...RARITIES[rarityKey], chance })).sort((a, b) => b.id - a.id);
    };

    const increment = () => setBuyAmount(prev => Math.min(prev + 1, 50));
    const decrement = () => setBuyAmount(prev => Math.max(prev - 1, 1));

    const typeKeys = Object.keys(TYPES);
    const dayIndex = new Date().getDay();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in-50">
            <div className={`bg-slate-900 border-2 ${currentConfig.border} w-full max-w-md rounded-[32px] p-0 relative overflow-hidden flex flex-col max-h-[85vh] shadow-2xl`}>
                <div className="relative h-40 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                    <div className={`absolute inset-0 ${currentConfig.bg} opacity-20 blur-[60px] animate-pulse`}></div>
                    {React.createElement(currentConfig.icon, { className: `w-24 h-24 ${currentConfig.color} drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10` })}
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors z-20 backdrop-blur-md border border-white/10"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
                    <h2 className={`text-2xl font-black ${currentConfig.color} mb-1 uppercase text-center tracking-wide`}>{viewingBox === 'TYPE_DAILY' ? (t ? t('shop_elemental_chest') : 'Elementar-Truhe') : LOOTBOXES[viewingBox]?.label}</h2>

                    {/* WOCHENPLAN FÜR ELEMENTAR-TRUHE */}
                    {viewingBox === 'TYPE_DAILY' && (
                        <div className="mb-6 mt-4 bg-slate-950/40 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Clock className="w-3 h-3 text-indigo-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t ? t('shop_weekly_schedule') : 'Wochenplan'}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1.5">
                                {[1, 2, 3, 4, 5, 6, 0].map(dIndex => {
                                    const dayName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][dIndex];
                                    const { start, count } = schedule[dIndex];
                                    const typesForDay = typeKeys.slice(start, start + count);
                                    const isToday = dIndex === dayIndex;
                                    return (
                                        <div key={dIndex} className={`flex items-center gap-3 p-1.5 rounded-lg ${isToday ? 'bg-indigo-500/10 border border-indigo-500/30' : ''}`}>
                                            <span className={`text-[10px] font-black w-6 text-center ${isToday ? 'text-indigo-300' : 'text-slate-500'}`}>{dayName}</span>
                                            <div className="flex gap-1.5 flex-1 flex-wrap">
                                                {typesForDay.map(tKey => (
                                                    <div key={tKey} className={`w-5 h-5 rounded-md flex items-center justify-center ${TYPES[tKey].bg} shadow-sm`} title={TYPES[tKey].label}>
                                                        {React.cloneElement(TYPES[tKey].icon, { size: 12, className: "text-white" })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mb-6"><div className="bg-slate-950/50 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2"><Percent className="w-3 h-3 text-slate-400" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t ? t('shop_probabilities') : 'Wahrscheinlichkeiten'}</span></div></div>
                    <div className="space-y-1.5">{getDropList(viewingBox).map((rate) => (<div key={rate.id} className="flex justify-between items-center px-3 py-2 bg-slate-800/50 rounded-xl border border-white/5"><span className={`text-xs font-black ${rate.color} uppercase tracking-wider`}>{rate.label}</span><span className="text-xs font-mono font-bold text-white">{rate.chance.toFixed(2)}%</span></div>))}</div>
                </div>
                <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0 space-y-4">
                    {viewingBox !== 'DAILY' && (
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={decrement} className="p-3 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 active:scale-95 transition-all"><Minus className="w-4 h-4 text-white" /></button>
                            <div className="text-center w-12"><span className="block text-xs text-slate-400 font-bold uppercase">{t ? t('shop_amount') : 'Menge'}</span><span className="block text-xl font-black text-white">{buyAmount}</span></div>
                            <button onClick={increment} className="p-3 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 active:scale-95 transition-all"><Plus className="w-4 h-4 text-white" /></button>
                        </div>
                    )}
                    <button onClick={() => onBuy(viewingBox)} disabled={(viewingBox === 'DAILY' && !isDailyAvailable) || isBuying} className={`w-full py-4 rounded-2xl font-black text-sm flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg ${viewingBox === 'DAILY' ? (isDailyAvailable ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed') : (isBuying ? 'bg-slate-500 text-slate-300 cursor-wait' : 'bg-white text-slate-900 hover:bg-slate-200')}`}>{viewingBox === 'DAILY' ? (isDailyAvailable ? (t ? t('shop_claim_free') : 'GRATIS ABHOLEN') : (t ? t('shop_already_claimed') : 'SCHON ABGEHOLT')) : (<><Coins className="w-4 h-4 text-amber-500 fill-amber-500" /> {((viewingBox === 'TYPE_DAILY' ? TYPE_BOX_COST : LOOTBOXES[viewingBox].cost) * buyAmount).toLocaleString()} {t ? t('shop_buy') : 'KAUFEN'}</>)}</button>
                </div>
            </div>
        </div>
    );
}
