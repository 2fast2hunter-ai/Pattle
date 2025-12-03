import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getLeaderboard } from '../utils/db';

export default function LeaderboardScreen({ user, onBack }) {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date().toLocaleDateString();

    useEffect(() => {
        const loadData = async () => {
            const data = await getLeaderboard();
            setPlayers(data);
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-black italic text-yellow-400">BESTENLISTE</h2>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-2 text-center">
                <div className="text-xs text-slate-400 uppercase font-bold">Dein Rang</div>
                <div className="text-3xl font-black text-white">
                    {players.findIndex(p => p.id === user.id) !== -1 ? `#${players.findIndex(p => p.id === user.id) + 1}` : '-'}
                </div>
                <div className="text-sm text-indigo-400 font-bold">{user.rating} Elo</div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 space-y-2 scrollbar-hide">
                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                ) : (
                    players.map((player, index) => {
                        const isMe = player.id === user.id;
                        
                        // Daily Elo Logic
                        // Wenn das Datum nicht heute ist, ist die Änderung 0 (neuer Tag)
                        const dailyChange = player.lastEloDate === today ? (player.dailyEloChange || 0) : 0;

                        return (
                            <div key={player.id} className={`flex items-center justify-between p-3 rounded-xl border ${isMe ? 'bg-indigo-900/40 border-indigo-500' : 'bg-slate-800 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 flex items-center justify-center font-black ${index < 3 ? 'text-yellow-400 text-xl' : 'text-slate-500'}`}>{index + 1}</div>
                                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">{player.avatar}</div>
                                    <div>
                                        <div className={`font-bold ${isMe ? 'text-indigo-300' : 'text-white'}`}>{player.username} {isMe && '(Du)'}</div>
                                        <div className="text-xs text-slate-400">Level {player.level}</div>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 font-mono font-bold text-yellow-500">
                                        <Trophy className="w-4 h-4" />{player.rating}
                                    </div>
                                    
                                    {/* Daily Change Anzeige */}
                                    <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${dailyChange > 0 ? 'text-green-400' : (dailyChange < 0 ? 'text-red-400' : 'text-slate-500')}`}>
                                        {dailyChange > 0 && <TrendingUp className="w-3 h-3" />}
                                        {dailyChange < 0 && <TrendingDown className="w-3 h-3" />}
                                        {dailyChange === 0 && <Minus className="w-3 h-3" />}
                                        {dailyChange > 0 ? '+' : ''}{dailyChange} heute
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}