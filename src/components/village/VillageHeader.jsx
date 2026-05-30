import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

export default function VillageHeader({ user, t, onBack, onCollect }) {
    return (
        <div className="relative flex items-center justify-between mb-4 pt-2 px-4 shrink-0 z-10">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-black italic tracking-wide text-white">{t ? t('village_title') : 'VILLAGE'}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <span className="text-indigo-400">Level {user.village.level}</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span>{Math.floor(user.village.xp)} / {user.village.xpToNext} {t ? t('common_xp') : 'XP'}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onCollect(false)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-green-900/20 active:scale-95 transition-all flex items-center gap-2"
            >
                <Clock className="w-4 h-4" /> {t ? t('village_collect') : 'COLLECT'}
            </button>
        </div>
    );
}
