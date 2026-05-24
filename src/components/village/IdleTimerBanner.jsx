import React, { useState } from 'react';
import { Zap, Timer, Plus, Tv } from 'lucide-react';
import { showRewardedAd } from '../../utils/adManager';
import AdModal from '../ui/AdModal';

export default function IdleTimerBanner({ isActive, timeLeftStr, onAddIdleTime, onAddIdleTimeByAd, ticketCount, t }) {
    const [showDevAdModal, setShowDevAdModal] = useState(false);

    const handleWatchAdForIdle = () => {
        showRewardedAd({
            onReward: () => { if (onAddIdleTimeByAd) onAddIdleTimeByAd(); },
            onError: () => {},
            onOpenDevModal: () => setShowDevAdModal(true)
        });
    };

    if (showDevAdModal) {
        return (
            <AdModal
                onClose={() => setShowDevAdModal(false)}
                onReward={() => { if (onAddIdleTimeByAd) onAddIdleTimeByAd(); setShowDevAdModal(false); }}
            />
        );
    }

    return (
        <div className={`rounded-2xl p-4 border flex items-center justify-between shadow-lg transition-all relative overflow-hidden ${isActive ? 'bg-indigo-900/40 border-indigo-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
            {isActive && <div className="absolute inset-0 bg-indigo-500/5 animate-pulse-slow pointer-events-none"></div>}
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-indigo-500 text-white' : 'bg-red-500/20 text-red-500'}`}>
                    {isActive ? <Zap className="w-5 h-5 animate-pulse" /> : <Timer className="w-5 h-5" />}
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {isActive ? (t ? t('village_production_active') : 'Produktion läuft') : (t ? t('village_production_stopped') : 'Produktion gestoppt')}
                    </div>
                    <div className={`text-lg font-black ${isActive ? 'text-white' : 'text-red-400'}`}>
                        {timeLeftStr}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onAddIdleTime}
                    disabled={ticketCount < 1}
                    className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all active:scale-95 ${ticketCount > 0 ? 'bg-slate-800 border-white/10 hover:bg-slate-700' : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}`}
                >
                    <div className="flex items-center gap-1 text-xs font-bold text-white mb-0.5">
                        <Plus className="w-3 h-3" /> 20m
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase">
                        {ticketCount} {t ? t('village_tickets') : 'Tickets'}
                    </div>
                </button>

                {onAddIdleTimeByAd && (
                    <button
                        onClick={handleWatchAdForIdle}
                        className="flex flex-col items-center justify-center px-3 py-2 rounded-xl border bg-indigo-900/60 border-indigo-500/30 hover:bg-indigo-800/60 transition-all active:scale-95"
                        title="Werbung schauen: +1 Stunde Produktion"
                    >
                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-300 mb-0.5">
                            <Tv className="w-3 h-3" /> +1h
                        </div>
                        <div className="text-[9px] text-indigo-500 font-bold uppercase">Ad</div>
                    </button>
                )}
            </div>
        </div>
    );
}
