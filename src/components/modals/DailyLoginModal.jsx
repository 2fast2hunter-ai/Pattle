import React from 'react';
import { Check, Coins, Gem, Package, X, Flame } from 'lucide-react';

const REWARD_SETS = [
    [{ type: 'COINS', amount: 50 }],
    [{ type: 'COINS', amount: 100 }, { type: 'GEMS', amount: 1 }],
    [{ type: 'COINS', amount: 150 }, { type: 'GEMS', amount: 2 }],
    [{ type: 'COINS', amount: 200 }, { type: 'GEMS', amount: 3 }],
    [{ type: 'COINS', amount: 250 }, { type: 'GEMS', amount: 5 }, { type: 'LOOTBOX', variant: 'MYSTERY_EGG', amount: 1 }],
    [{ type: 'COINS', amount: 300 }, { type: 'GEMS', amount: 7 }],
    [{ type: 'COINS', amount: 500 }, { type: 'GEMS', amount: 10 }, { type: 'LOOTBOX', variant: 'MYSTERY_EGG', amount: 2 }],
];

const RewardIcon = ({ type, className = "w-4 h-4" }) => {
    if (type === 'COINS') return <Coins className={`${className} text-yellow-400`} />;
    if (type === 'GEMS') return <Gem className={`${className} text-pink-400`} />;
    if (type === 'LOOTBOX') return <Package className={`${className} text-purple-400`} />;
    return null;
};

export default function DailyLoginModal({ user, onClaim, onClose, t }) {
    const translate = t || ((key) => key);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = user.loginStreak || 0;
    const lastLogin = user.lastLoginDate || '';

    if (lastLogin !== yesterdayStr && lastLogin !== today && lastLogin !== '') {
        currentStreak = 0;
    }

    const isClaimedToday = lastLogin === today;
    const activeDayIndex = currentStreak % 7;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23fff\" fill-opacity=\"0.4\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')" }}></div>
                    <div className="flex items-center justify-center gap-2 relative z-10">
                        <Flame className="w-6 h-6 text-orange-300" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow-md">{translate('daily_streak_title')}</h2>
                    </div>
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mt-1 relative z-10">{translate('daily_streak_subtitle')}</p>
                    {currentStreak > 0 && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 relative z-10">
                            <Flame className="w-4 h-4 text-orange-300" />
                            <span className="text-white text-sm font-bold">{currentStreak} {translate('daily_streak_badge')}</span>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors z-20">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 7-day Calendar Grid */}
                <div className="p-6 grid grid-cols-4 gap-3">
                    {REWARD_SETS.map((rewards, idx) => {
                        const dayNum = idx + 1;
                        const isWeekly = idx === 6;
                        const isToday = isClaimedToday ? idx === activeDayIndex - 1 : idx === activeDayIndex;
                        const isDone = isClaimedToday && idx <= activeDayIndex - 1;

                        let containerClass = "bg-slate-800 border-slate-700";
                        if (isDone) containerClass = "bg-slate-800/50 border-slate-700 opacity-60";
                        if (isToday) containerClass = "bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20 scale-105 z-10";
                        if (isWeekly) containerClass += " col-span-2 bg-gradient-to-br from-amber-900/40 to-slate-900";

                        return (
                            <div key={dayNum} className={`relative rounded-2xl border p-3 flex flex-col items-center justify-center text-center transition-all ${containerClass}`}>
                                {isDone && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-20">
                                        <Check className="w-8 h-8 text-green-400 drop-shadow-md" />
                                    </div>
                                )}

                                <span className={`text-[10px] font-black uppercase mb-2 ${isToday ? 'text-indigo-300' : 'text-slate-500'}`}>
                                    {translate('daily_streak_day')} {dayNum}
                                </span>

                                <div className="flex flex-col items-center gap-1 mb-1">
                                    {rewards.map((r, ri) => (
                                        <div key={ri} className="flex items-center gap-1">
                                            <RewardIcon type={r.type} className="w-4 h-4" />
                                            <span className={`text-[10px] font-bold ${isToday ? 'text-white' : 'text-slate-400'}`}>
                                                {r.type === 'LOOTBOX' ? `${r.amount}x 🥚` : r.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onClaim}
                        disabled={isClaimedToday}
                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                            ${isClaimedToday
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-green-900/20 animate-pulse'
                            }
                        `}
                    >
                        {isClaimedToday ? translate('daily_streak_claimed') : translate('daily_streak_claim')}
                    </button>
                </div>
            </div>
        </div>
    );
}
