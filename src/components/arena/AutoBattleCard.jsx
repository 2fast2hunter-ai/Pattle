import React, { useState } from 'react';
import { Zap, Minus, Plus, Play } from 'lucide-react';

export default function AutoBattleCard({ ticketCount, onAutoBattle, t }) {
    // State für die gewünschte Ticket-Anzahl
    const [ticketsToUse, setTicketsToUse] = useState(1);

    const incrementTickets = (e) => {
        e.stopPropagation();
        if (ticketsToUse < ticketCount) setTicketsToUse(prev => prev + 1);
    };

    const decrementTickets = (e) => {
        e.stopPropagation();
        if (ticketsToUse > 1) setTicketsToUse(prev => prev - 1);
    };

    return (
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-4 flex flex-col gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-4 delay-100 fill-mode-backwards relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner border border-purple-500/20">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-black text-white text-lg leading-none">{t ? t('arena_auto_btn') : 'Auto-Kampf'}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{t ? t('arena_auto_desc') : '1 Ticket = 10 Kämpfe'}</p>
                    </div>
                </div>

                {/* Ticket Counter */}
                <div className="flex flex-col items-end">
                    <div className="bg-black/30 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-1.5 mb-1">
                        <span className={`text-xs font-black ${ticketCount > 0 ? 'text-white' : 'text-red-400'}`}>{ticketCount}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{t ? t('arena_tickets') : 'Tickets'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {/* Menge wählen */}
                <div className="flex items-center bg-slate-900 rounded-xl border border-white/5 px-2 py-1 gap-3 shrink-0">
                    <button
                        onClick={decrementTickets}
                        className={`p-2 rounded-lg transition-colors ${ticketsToUse > 1 ? 'text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'}`}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-white w-4 text-center">{ticketsToUse}</span>
                    <button
                        onClick={incrementTickets}
                        className={`p-2 rounded-lg transition-colors ${ticketsToUse < ticketCount ? 'text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'}`}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Start Button */}
                <button
                    onClick={() => ticketCount >= ticketsToUse && onAutoBattle(ticketsToUse)}
                    disabled={ticketCount < 1}
                    className={`
                    flex-1 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
                    ${ticketCount >= ticketsToUse
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }
                `}
                >
                    {ticketCount >= 1 ? (
                        <>{t ? t('arena_start_btn') : 'STARTEN'} ({ticketsToUse * 10}) <Play className="w-4 h-4 fill-current" /></>
                    ) : (
                        (t ? t('arena_no_tickets') : "KEINE TICKETS")
                    )}
                </button>
            </div>
        </div>
    );
}
