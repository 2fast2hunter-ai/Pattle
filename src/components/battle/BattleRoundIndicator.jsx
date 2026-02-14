import React from 'react';
import { Flame } from 'lucide-react';

export default function BattleRoundIndicator({ isGauntlet, gauntletRound, round, t }) {
    return (
        <div className="absolute top-4 left-0 w-full flex justify-center z-10 flex-col items-center gap-1">
            {isGauntlet && (
                <div className="bg-red-600/80 backdrop-blur-md px-4 py-1 rounded-full border border-red-400/30 shadow-lg animate-in slide-in-from-top-full">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Flame className="w-3 h-3 fill-current" /> {t ? t('gauntlet_stage') : 'Stage'} {gauntletRound || 1}
                    </span>
                </div>
            )}
            <div className="bg-black/60 backdrop-blur-md px-6 py-1.5 rounded-full border border-white/10 shadow-lg">
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{t ? t('battle_round') : 'Runde'} {round}</span>
            </div>
        </div>
    );
}
