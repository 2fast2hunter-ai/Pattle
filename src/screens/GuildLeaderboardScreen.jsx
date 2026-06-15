import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Star, Users, Hash, Loader2, Crown } from 'lucide-react';
import { getGuildLeaderboard } from '../utils/guildDb';

const RANK_COLORS = [
    'from-yellow-500/20 to-amber-600/10 border-yellow-500/30',
    'from-slate-400/20 to-slate-500/10 border-slate-400/30',
    'from-amber-700/20 to-orange-800/10 border-amber-700/30',
];
const RANK_ICONS = ['🥇', '🥈', '🥉'];
const RANK_TEXT = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];

function GuildRow({ guild, rank, isMyGuild }) {
    const colorClass = rank <= 3 ? RANK_COLORS[rank - 1] : 'from-slate-800/50 to-slate-800/30 border-white/5';
    const rankText = rank <= 3 ? RANK_ICONS[rank - 1] : `#${rank}`;

    return (
        <div className={`flex items-center gap-3 p-3 bg-gradient-to-r ${colorClass} border rounded-xl transition-all ${isMyGuild ? 'ring-1 ring-indigo-500/50' : ''}`}>
            <div className={`w-8 text-center font-black text-sm ${rank <= 3 ? RANK_TEXT[rank - 1] : 'text-slate-500'}`}>
                {rankText}
            </div>
            <div className="text-xl w-9 h-9 flex items-center justify-center bg-black/20 rounded-xl shrink-0">
                {guild.emblem || '🛡️'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm truncate">{guild.name}</span>
                    {guild.tag && (
                        <span className="inline-flex items-center gap-0.5 bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider shrink-0">
                            <Hash className="w-2 h-2" />{guild.tag}
                        </span>
                    )}
                    {isMyGuild && (
                        <span className="text-[9px] font-black text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded shrink-0">YOURS</span>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{guild.members?.length || 0}</span>
                </div>
            </div>
            <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-black text-amber-400 text-sm">{(guild.totalPoints || 0).toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">points</div>
            </div>
        </div>
    );
}

export default function GuildLeaderboardScreen({ user, onBack }) {
    const [guilds, setGuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myGuildRank, setMyGuildRank] = useState(null);

    useEffect(() => {
        getGuildLeaderboard().then(data => {
            setGuilds(data);
            if (user?.guildId) {
                const idx = data.findIndex(g => g.id === user.guildId);
                setMyGuildRank(idx >= 0 ? idx + 1 : null);
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center gap-3 px-4 pt-3 pb-3 shrink-0 z-10">
                <button
                    onClick={onBack}
                    className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-xl font-black italic text-white tracking-wide uppercase">Guild Leaderboard</h2>
                </div>
            </div>

            {/* My guild rank card */}
            {user?.guildId && myGuildRank && (
                <div className="px-4 mb-3 shrink-0 z-10 relative">
                    <div className="flex items-center gap-3 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-xl">
                        <Crown className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-sm font-bold text-white">Your Guild Rank</span>
                        <span className="ml-auto font-black text-indigo-300 text-lg">#{myGuildRank}</span>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-2 scrollbar-hide relative z-10">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    </div>
                ) : guilds.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Trophy className="w-12 h-12 opacity-20 mx-auto mb-3" />
                        <p className="text-sm font-bold">No guilds yet. Be the first!</p>
                    </div>
                ) : (
                    guilds.map((guild, i) => (
                        <GuildRow
                            key={guild.id}
                            guild={guild}
                            rank={i + 1}
                            isMyGuild={guild.id === user?.guildId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
