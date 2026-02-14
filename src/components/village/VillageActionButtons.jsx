import React from 'react';
import { Trophy, RefreshCw, Scissors } from 'lucide-react';

export default function VillageActionButtons({ onOpenMilestones, onOpenTrading, onOpenCosmetics, t }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <button onClick={onOpenMilestones} className="bg-slate-800 border border-white/5 p-3 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-[10px] font-black text-white uppercase">{t ? t('village_milestones') : 'Meilensteine'}</span>
            </button>
            <button onClick={onOpenTrading} className="bg-slate-800 border border-white/5 p-3 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                <RefreshCw className="w-6 h-6 text-blue-400" />
                <span className="text-[10px] font-black text-white uppercase">{t ? t('village_trading') : 'Tauschplatz'}</span>
            </button>
            <button onClick={onOpenCosmetics} className="bg-slate-800 border border-white/5 p-3 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition-all h-24">
                <Scissors className="w-6 h-6 text-pink-400" />
                <span className="text-[10px] font-black text-white uppercase">{t ? t('village_cosmetics') : 'Schneider'}</span>
            </button>
        </div>
    );
}
