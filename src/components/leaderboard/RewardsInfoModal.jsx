import React from 'react';
import { Trophy, X, Coins, Gem, Ticket, PlayCircle } from 'lucide-react';

const REWARD_TIERS = [
    { label: 'Platz 1', coins: 50000, gems: 500, tickets: 10, adTickets: 20, color: 'text-yellow-400' },
    { label: 'Platz 2', coins: 30000, gems: 300, tickets: 7, adTickets: 15, color: 'text-slate-300' },
    { label: 'Platz 3', coins: 20000, gems: 200, tickets: 5, adTickets: 10, color: 'text-orange-400' },
    { label: 'Top 5%', coins: 15000, gems: 150, tickets: 4, adTickets: 8 },
    { label: 'Top 10%', coins: 10000, gems: 100, tickets: 3, adTickets: 6 },
    { label: 'Top 20%', coins: 8000, gems: 80, tickets: 2, adTickets: 5 },
    { label: 'Top 30%', coins: 7000, gems: 70, tickets: 2, adTickets: 4 },
    { label: 'Top 40%', coins: 6000, gems: 60, tickets: 1, adTickets: 4 },
    { label: 'Top 50%', coins: 5000, gems: 50, tickets: 1, adTickets: 3 },
    { label: 'Top 60%', coins: 4000, gems: 40, tickets: 1, adTickets: 3 },
    { label: 'Top 70%', coins: 3000, gems: 30, tickets: 1, adTickets: 2 },
    { label: 'Top 80%', coins: 2000, gems: 20, tickets: 0, adTickets: 2 },
    { label: 'Top 90%', coins: 1000, gems: 10, tickets: 0, adTickets: 1 },
];

export default function RewardsInfoModal({ onClose, t }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl flex flex-col shadow-2xl max-h-[80vh]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h3 className="font-black text-white text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> {t ? t('label_season_rewards') : 'Season Rewards'}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-2">
                    {REWARD_TIERS.map((tier, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-xl border border-white/5">
                            <span className={`font-black text-xs uppercase ${tier.color || 'text-slate-300'}`}>{tier.label}</span>
                            <div className="flex items-center gap-3">
                                {tier.coins > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-400"><Coins className="w-3 h-3" /> {tier.coins}</div>}
                                {tier.gems > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-pink-400"><Gem className="w-3 h-3" /> {tier.gems}</div>}
                                {tier.tickets > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-pink-500"><Ticket className="w-3 h-3" /> {tier.tickets}</div>}
                                {tier.adTickets > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500"><PlayCircle className="w-3 h-3" /> {tier.adTickets}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
