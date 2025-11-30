import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Loader2 } from 'lucide-react';
import { getLeaderboard } from '../utils/db'; // Echte DB Funktion

export default function LeaderboardScreen({ user, onBack }) {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    {/* Berechnet den Rang lokal anhand der geladenen Liste, falls enthalten */}
                    {players.findIndex(p => p.id === user.id) !== -1 ? `#${players.findIndex(p => p.id === user.id) + 1}` : '-'}
                </div>
                <div className="text-sm text-indigo-400 font-bold">{user.rating} Elo</div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 space-y-2">
                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                ) : (
                    players.map((player, index) => {
                        const isMe = player.id === user.id;
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
                                <div className="flex items-center gap-1 font-mono font-bold text-yellow-500"><Trophy className="w-4 h-4" />{player.rating}</div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}