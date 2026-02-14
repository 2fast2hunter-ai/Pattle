import React from 'react';
import { Lock, Hourglass, Egg, FastForward, Plus } from 'lucide-react';
import { RARITIES } from '../../data/gameData';

export default function EggSlot({
    index, egg, isUnlocked, unlockedSlots,
    onClick, startHatchingProcess, onReduceCooldown,
    ticketCount, formatTime, t, tutorialHighlight
}) {
    // GESPERRT
    if (!isUnlocked) {
        return (
            <div className="aspect-square bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-50">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    {t ? t('village_lvl') : 'Lvl'} {index === 0 ? 1 : (index === 1 ? 15 : 15 + ((index - 1) * 10))}
                </span>
            </div>
        );
    }

    // BELEGT MIT EI
    if (egg) {
        const timeLeft = Math.max(0, Math.ceil((egg.hatchAt - Date.now()) / 1000));
        const isReady = timeLeft <= 0;
        const rarity = RARITIES[egg.rarity];

        return (
            <div className="relative aspect-square bg-slate-800 rounded-3xl p-3 flex flex-col items-center justify-between border border-white/5 shadow-lg group overflow-hidden">
                <div className={`absolute inset-0 ${rarity.bg} opacity-5 blur-xl group-hover:opacity-10 transition-opacity`}></div>

                <div className="w-full flex justify-end relative z-10">
                    {isReady ? (
                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
                    ) : (
                        <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                    )}
                </div>

                <div className={`relative z-10 ${isReady ? 'animate-bounce' : 'animate-pulse duration-[3000ms]'}`}>
                    <Egg className={`w-14 h-14 ${rarity.color} drop-shadow-lg`} />
                    <div className={`absolute -inset-2 border-2 ${rarity.border} rounded-full opacity-30 scale-110`}></div>
                </div>

                <div className="w-full relative z-10">
                    {isReady ? (
                        <button onClick={() => startHatchingProcess(egg)} className={`w-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1 ${tutorialHighlight === 'hatch-btn' ? 'ring-4 ring-yellow-400 z-50 animate-pulse' : ''}`}>
                            {t ? t('hatchery_hatch_btn') : 'SCHLÜPFEN'}
                        </button>
                    ) : (
                        <div className="flex gap-1">
                            <div className="bg-black/30 rounded-xl py-2 px-2 flex-1 flex items-center justify-center gap-1 border border-white/5">
                                <Hourglass className="w-3 h-3 text-amber-400 animate-spin-slow" />
                                <span className="font-mono text-xs text-white font-bold">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>

                            {ticketCount > 0 && (
                                <button
                                    onClick={() => onReduceCooldown(egg.id, 'HATCHING')}
                                    className={`bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all ${tutorialHighlight === 'speedup-btn' ? 'ring-4 ring-yellow-400 z-50 animate-pulse' : ''}`}
                                    title="-5 Min"
                                >
                                    <FastForward className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // FREIER SLOT (JETZT KLICKBAR)
    return (
        <button
            onClick={() => onClick(index)}
            className={`aspect-square bg-slate-800/30 border-2 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50 rounded-3xl flex flex-col items-center justify-center gap-2 group transition-all active:scale-95 cursor-pointer ${tutorialHighlight === `slot-${index}` ? 'ring-4 ring-yellow-400 animate-pulse z-50' : ''}`}
        >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                <Plus className="w-6 h-6 text-slate-500 group-hover:text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-emerald-400">{t ? t('hatchery_assign_btn') : 'Belegen'}</div>
        </button>
    );
}
