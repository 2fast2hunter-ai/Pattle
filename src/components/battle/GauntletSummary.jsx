import React from 'react';
import { Flame, Star, Coins, XCircle } from 'lucide-react';

export default function GauntletSummary({
    battleState,
    myTeam,
    displayXp,
    displayCoins,
    baseXp,
    onLose,
    t
}) {
    // Derive myTeamIds for the callback
    const myTeamIds = myTeam.map(p => p.id);

    return (
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-8 rounded-[32px] border border-red-500/20 shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(220,38,38,0.4)] border-4 border-red-400/20">
                <Flame className="w-12 h-12 text-white fill-current animate-pulse" />
            </div>

            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">{t ? t('gauntlet_finished') : 'GAUNTLET BEENDET'}</h2>
            <p className="text-red-200 font-bold mb-8 uppercase tracking-widest text-xs opacity-70">{t ? t('gauntlet_over') : 'Keine kampffähigen Pets mehr'}</p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t ? t('gauntlet_stage') : 'Erreichte Stufe'}</span>
                    <span className="text-3xl font-black text-white">{battleState.gauntletRound || 1}</span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t ? t('gauntlet_score') : 'Score'}</span>
                    <span className="text-3xl font-black text-yellow-400">{battleState.gauntletScore || 0}</span>
                </div>
            </div>

            <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-white/5 mb-6 shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase">{t ? t('gauntlet_rewards') : 'Belohnungen'}</span>
                </div>
                <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-green-400">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="text-lg font-black">+{(battleState.accumulatedRewards?.xp || 0) + displayXp}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">XP</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-yellow-400">
                            <Coins className="w-5 h-5 fill-current" />
                            <span className="text-lg font-black">+{(battleState.accumulatedRewards?.coins || 0) + displayCoins}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">{t ? t('reward_coins') : 'Coins'}</span>
                    </div>
                </div>
            </div>



            <button
                onClick={() => onLose({ xp: baseXp }, myTeamIds)}
                className="w-full py-4 rounded-2xl bg-white text-slate-950 font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-auto"
            >
                {t ? t('gauntlet_continue') : 'ZUR ÜBERSICHT'} <XCircle className="w-5 h-5" />
            </button>
        </div>
    );
}
