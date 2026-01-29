import React from 'react';
import { Check, Gift, Coins, Gem, Package, Zap, X } from 'lucide-react';

const REWARDS = [
    { day: 1, type: 'COINS', amount: 250, label: '250 Münzen' },
    { day: 2, type: 'COINS', amount: 500, label: '500 Münzen' },
    { day: 3, type: 'GEMS', amount: 5, label: '5 Edelsteine' },
    { day: 4, type: 'COINS', amount: 1000, label: '1.000 Münzen' },
    { day: 5, type: 'GEMS', amount: 10, label: '10 Edelsteine' },
    { day: 6, type: 'ITEM', variant: 'XP_POTION_M', amount: 2, label: '2x XP Trank (M)' },
    { day: 7, type: 'LOOTBOX', variant: 'PREMIUM', amount: 1, label: 'Premium Box' },
];

export default function DailyLoginModal({ user, onClaim, onClose }) {
    // Berechne den aktuellen Tag im Zyklus (1-7)
    // Wenn der letzte Login nicht gestern war, ist der Streak gebrochen -> Tag 1
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = user.loginStreak || 0;
    const lastLogin = user.lastLoginDate || '';

    // Streak Reset Logik für die Anzeige
    if (lastLogin !== yesterdayStr && lastLogin !== today && lastLogin !== '') {
        currentStreak = 0;
    }

    // Der Tag, der heute beansprucht wird (0-basiert für Array Index, +1 für Anzeige)
    // Wenn heute schon geclaimed wurde, zeigen wir den Status von morgen (oder heute als erledigt)
    const isClaimedToday = lastLogin === today;
    const activeDayIndex = isClaimedToday ? (currentStreak % 7) : (currentStreak % 7); 
    
    // Helper für Icons
    const getIcon = (type) => {
        if (type === 'COINS') return <Coins className="w-5 h-5 text-yellow-400" />;
        if (type === 'GEMS') return <Gem className="w-5 h-5 text-pink-400" />;
        if (type === 'ITEM') return <Zap className="w-5 h-5 text-blue-400" />;
        if (type === 'LOOTBOX') return <Package className="w-5 h-5 text-amber-400" />;
        return <Gift className="w-5 h-5 text-white" />;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow-md relative z-10">Täglicher Bonus</h2>
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mt-1 relative z-10">Komm jeden Tag zurück!</p>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors z-20">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Grid */}
                <div className="p-6 grid grid-cols-4 gap-3">
                    {REWARDS.map((reward, idx) => {
                        const isBigReward = idx === 6; // Tag 7
                        const isPast = idx < activeDayIndex;
                        const isToday = idx === activeDayIndex;
                        
                        // Style Klassen
                        let containerClass = "bg-slate-800 border-slate-700";
                        if (isPast) containerClass = "bg-slate-800/50 border-slate-700 opacity-60";
                        if (isToday) containerClass = "bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20 scale-105 z-10";
                        if (isBigReward) containerClass += " col-span-2 bg-gradient-to-br from-slate-800 to-slate-900";

                        return (
                            <div key={reward.day} className={`relative rounded-2xl border p-3 flex flex-col items-center justify-center text-center transition-all ${containerClass}`}>
                                {isPast && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-20">
                                        <Check className="w-8 h-8 text-green-400 drop-shadow-md" />
                                    </div>
                                )}
                                
                                <span className={`text-[10px] font-black uppercase mb-2 ${isToday ? 'text-indigo-300' : 'text-slate-500'}`}>Tag {reward.day}</span>
                                
                                <div className={`mb-2 ${isToday ? 'scale-110 animate-pulse-slow' : ''}`}>
                                    {getIcon(reward.type)}
                                </div>
                                
                                <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-slate-300'}`}>{reward.label}</span>
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
                        {isClaimedToday ? 'Morgen wiederkommen' : 'Jetzt Einsammeln'}
                    </button>
                </div>
            </div>
        </div>
    );
}
