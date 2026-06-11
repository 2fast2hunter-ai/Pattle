import React from 'react';
import { ArrowLeft, Clock, Star, Zap } from 'lucide-react';

export default function VillageHeader({ user, t, onBack, onCollect, isActive }) {
    const xpPct = Math.min(100, (user.village.xp / user.village.xpToNext) * 100);

    return (
        <div className="relative shrink-0 z-10 px-4 pt-2 pb-3">
            {/* Top row: back + title + collect */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-wide text-white">
                            {t ? t('village_title') : 'VILLAGE'}
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            {isActive
                                ? <span className="flex items-center gap-1 text-emerald-400"><Zap className="w-3 h-3" /> Aktiv</span>
                                : <span className="text-slate-500">Pausiert</span>
                            }
                        </div>
                    </div>
                </div>

                {/* Village Level badge — prominent */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center bg-gradient-to-b from-indigo-700 to-indigo-900 border border-indigo-500/40 rounded-xl px-3 py-1.5 shadow-lg shadow-indigo-900/40">
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                            <span className="text-base font-black text-white leading-none">
                                {user.village.level}
                            </span>
                        </div>
                        <span className="text-[8px] text-indigo-300 font-bold uppercase tracking-wider">Dorf Lvl</span>
                    </div>

                    <button
                        onClick={() => onCollect(false)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-green-900/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Clock className="w-4 h-4" /> {t ? t('village_collect') : 'COLLECT'}
                    </button>
                </div>
            </div>

            {/* XP progress bar */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-700"
                        style={{ width: `${xpPct}%` }}
                    />
                </div>
                <span className="text-[9px] text-slate-500 font-bold whitespace-nowrap">
                    {Math.floor(user.village.xp)}/{user.village.xpToNext} XP
                </span>
            </div>
        </div>
    );
}
