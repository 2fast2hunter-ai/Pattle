import React from 'react';
import { Shield, Sword } from 'lucide-react';

export default function MyRankCard({ user, myRankData, loading, type = 'elo' }) {
    if (loading || !myRankData) return null;

    const label = type === 'gauntlet' ? 'Score' : 'Elo';
    const val = type === 'gauntlet' ? (user.stats?.gauntletHighscore || 0) : (user.rating || 1000);

    return (
        <div className="px-4 mb-4 relative z-10">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
                <div>
                    <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Dein Rang</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        #{myRankData.rank}
                        <span className="text-sm font-bold text-indigo-300 bg-black/20 px-2 py-0.5 rounded-lg">
                            Top {myRankData.percent < 1 ? '<1' : myRankData.percent.toFixed(0)}%
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider">{label}</div>
                    <div className="text-xl font-black text-white flex items-center justify-end gap-1">
                        {type === 'gauntlet' ? <Sword className="w-4 h-4 text-red-300" /> : <Shield className="w-4 h-4 text-indigo-300" />}
                        {val}
                    </div>
                </div>
            </div>
        </div>
    );
}
