import React from 'react';
import { Package, Box, Lock, Star, Crown, Zap, Coins } from 'lucide-react';
import { LOOTBOXES, TYPES } from '../../data/gameData';

export default function ShopLootboxSection({
    t,
    setViewingBox,
    isDailyAvailable,
    dailyTypes,
    TYPE_BOX_COST
}) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3 text-yellow-500 px-1"><Package className="w-4 h-4" /><h3 className="text-xs font-black uppercase tracking-widest">{t ? t('shop_lootboxes') : 'Lootboxen'}</h3></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* DAILY BOX */}
                <div onClick={() => setViewingBox('DAILY')} className={`col-span-2 sm:col-span-1 bg-slate-800 border-2 ${isDailyAvailable() ? 'border-sky-500 shadow-sky-900/20 animate-pulse-slow' : 'border-slate-700 opacity-80'} rounded-[24px] p-4 relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-lg animate-in fade-in slide-in-from-bottom-4 delay-0 fill-mode-backwards`}>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10 ${isDailyAvailable() ? 'shadow-lg shadow-sky-500/20' : ''}`}>{isDailyAvailable() ? <Box className="w-8 h-8 text-sky-400 animate-float-gentle" /> : <Lock className="w-6 h-6 text-slate-600" />}</div>
                        <div className="flex-1"><h4 className="font-black text-white text-lg italic uppercase">{LOOTBOXES.DAILY.label}</h4><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{t ? t('shop_daily_gift') : 'Daily gift'}</p><span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${isDailyAvailable() ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-500'}`}>{isDailyAvailable() ? (t ? t('shop_free') : 'FREE') : (t ? t('shop_claimed') : 'Claimed')}</span></div>
                    </div>
                </div>
                {/* PREMIUM & MASTER */}
                <div onClick={() => setViewingBox('PREMIUM')} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/50 rounded-[24px] p-4 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer hover:border-purple-400 transition-all shadow-lg active:scale-95 animate-in fade-in slide-in-from-bottom-4 delay-100 fill-mode-backwards hover:shadow-purple-500/20">
                    <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div><Star className="w-10 h-10 text-purple-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform animate-float-gentle" /><h4 className="font-black text-white text-sm uppercase mb-1">{LOOTBOXES.PREMIUM.label}</h4><div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5"><Coins className="w-3 h-3 text-amber-400" /><span className="text-xs font-black text-white">{LOOTBOXES.PREMIUM.cost}</span></div>
                </div>
                <div onClick={() => setViewingBox('MASTER')} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/50 rounded-[24px] p-4 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer hover:border-amber-400 transition-all shadow-lg active:scale-95 animate-in fade-in slide-in-from-bottom-4 delay-200 fill-mode-backwards hover:shadow-amber-500/20">
                    <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div><Crown className="w-10 h-10 text-amber-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform animate-float-gentle" /><h4 className="font-black text-white text-sm uppercase mb-1">{LOOTBOXES.MASTER.label}</h4><div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5"><Coins className="w-3 h-3 text-amber-400" /><span className="text-xs font-black text-white">{LOOTBOXES.MASTER.cost}</span></div>
                </div>

                {/* SINGLE TYPE SPECIFIC BOX */}
                <div onClick={() => setViewingBox('TYPE_DAILY')} className="col-span-2 sm:col-span-1 bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-indigo-500/50 rounded-[24px] p-4 relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-lg animate-in fade-in slide-in-from-bottom-4 delay-300 fill-mode-backwards hover:shadow-indigo-500/20">
                    <div className="absolute inset-0 bg-indigo-600/5 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                            <Zap className="w-8 h-8 text-indigo-400 scale-110 animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-lg italic uppercase text-indigo-300">{t ? t('shop_elemental_chest') : 'Elementar-Truhe'}</h4>
                            <div className="flex gap-1 mb-2 mt-1">
                                {dailyTypes.map(tKey => (
                                    <div key={tKey} className={`w-5 h-5 rounded bg-slate-950 flex items-center justify-center border border-white/10 ${TYPES[tKey].color}`} title={TYPES[tKey].label}>
                                        {React.cloneElement(TYPES[tKey].icon, { size: 12 })}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5 w-fit"><Coins className="w-3 h-3 text-amber-400" /><span className="text-xs font-black text-white">{TYPE_BOX_COST.toLocaleString()}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
