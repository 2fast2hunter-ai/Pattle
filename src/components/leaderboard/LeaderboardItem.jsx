import React from 'react';
import { Crown, Medal, Shield, TrendingUp, TrendingDown, Minus, Sword } from 'lucide-react';
import { getRankTier } from '../../utils/rankUtils';

const getRankStyle = (index) => {
    if (index === 0) return 'bg-yellow-500 text-yellow-950 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]'; // Gold
    if (index === 1) return 'bg-slate-300 text-slate-800 border-slate-400 shadow-[0_0_10px_rgba(203,213,225,0.5)]'; // Silber
    if (index === 2) return 'bg-orange-400 text-orange-900 border-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]'; // Bronze
    return 'bg-slate-800 text-slate-400 border-white/5';
};

const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-5 h-5" />;
    if (index === 1) return <Medal className="w-5 h-5" />;
    if (index === 2) return <Medal className="w-5 h-5" />;
    return <span className="font-black text-sm">{index + 1}</span>;
};

export default function LeaderboardItem({ player, index, isMe, onViewPlayer, type = 'elo' }) {
    // --- FIX: ELO BILANZ BERECHNUNG MIT ISO DATUM ---
    const today = new Date().toISOString().split('T')[0];

    // 1. Prüfen, ob der gespeicherte Startwert von HEUTE ist
    const isDataFromToday = player.lastEloDate === today;

    // 2. Wenn ja: Differenz berechnen. Wenn nein: 0 (da heute noch nicht gespielt)
    const startElo = isDataFromToday && player.startEloToday !== undefined
        ? player.startEloToday
        : (player.rating || 1000);

    const diff = (player.rating || 1000) - startElo;
    const isPositive = diff > 0;
    const isNeutral = diff === 0;
    // ----------------------------------

    const _label = type === 'gauntlet' ? 'Score' : 'Elo';
    const val = type === 'gauntlet' ? (player.stats?.gauntletHighscore || 0) : (player.rating || 1000);
    const rankInfo = type === 'elo' ? getRankTier(player.rating) : null;

    return (
        <div
            onClick={() => onViewPlayer(player)}
            className={`
              relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]
              ${isMe ? 'bg-indigo-900/40 border-indigo-500/50 shadow-lg shadow-indigo-900/20' : 'bg-slate-900/60 border-white/5 hover:bg-slate-800'}
          `}
        >
            {/* RANK BADGE */}
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${getRankStyle(index)}`}>
                {getRankIcon(index)}
            </div>

            {/* AVATAR & NAME */}
            <div className="w-10 h-10 shrink-0 bg-slate-800 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/10">
                {player.avatar || '🛡️'}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={`font-black text-sm truncate ${isMe ? 'text-indigo-200' : 'text-slate-200'}`}>
                        {player.username || 'Unknown'} {isMe && '(Me)'}
                    </span>
                    {player.level && <span className="text-[9px] font-bold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">Lvl {player.level}</span>}
                </div>

                {/* RATING & DAILY DIFF */}
                <div className="flex items-center gap-3 mt-0.5">
                    <div className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                        {type === 'gauntlet' ? <Sword className="w-3 h-3 text-red-400" /> : <Shield className="w-3 h-3" />} {val}
                    </div>
                    {rankInfo && (
                        <span className={`text-[9px] font-black px-1 py-0.5 rounded border ${rankInfo.badgeClass}`}>{rankInfo.emoji} {rankInfo.name}</span>
                    )}

                    {/* TAGES-BILANZ (Nur bei Elo anzeigen oder auch bei Gauntlet? Erstmal nur bei Elo lassen oder immer?) */}
                    {type === 'elo' && (
                        <div className={`text-[10px] font-bold flex items-center gap-0.5 ${isNeutral ? 'text-slate-500' : (isPositive ? 'text-green-400' : 'text-red-400')}`}>
                            {isNeutral ? <Minus className="w-3 h-3" /> : (isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                            {!isNeutral && (isPositive ? '+' : '')}{diff} today
                        </div>
                    )}
                    {type === 'gauntlet' && (
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Score</div>
                    )}
                </div>
            </div>
        </div>
    );
}
