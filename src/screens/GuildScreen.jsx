import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft, Shield, Users, Trophy, MessageCircle, LogOut,
    Search, Plus, Crown, Star, UserX, ChevronRight, Loader2, Hash, Copy
} from 'lucide-react';
import {
    createGuild, joinGuild, leaveGuild, kickMember,
    listenToGuild, listGuilds, searchGuilds
} from '../utils/guildDb';

// --- Sub-views: 'overview' | 'create' | 'browse' | 'manage' ---

function GuildTag({ tag }) {
    if (!tag) return null;
    return (
        <span className="inline-flex items-center gap-0.5 bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider">
            <Hash className="w-2.5 h-2.5" />{tag}
        </span>
    );
}

function MemberRow({ member, isLeader, isMe, onKick }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-white/5">
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-700/60 rounded-xl shrink-0">
                {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{member.username}</span>
                    {member.role === 'leader' && <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
                    {isMe && <span className="text-[9px] font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">YOU</span>}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-amber-400 font-bold">{(member.contributionPoints || 0).toLocaleString()} pts</span>
                </div>
            </div>
            {isLeader && !isMe && onKick && (
                <button onClick={() => onKick(member.userId)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                    <UserX className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

function GuildCard({ guild, onJoin, loading }) {
    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🛡️</div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm truncate">{guild.name}</span>
                        <GuildTag tag={guild.tag} />
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{guild.description || 'No description.'}</p>
                </div>
                <button
                    onClick={() => onJoin(guild.id)}
                    disabled={loading}
                    className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    Join
                </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{guild.members?.length || 0}/30</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{(guild.totalPoints || 0).toLocaleString()} pts</span>
            </div>
        </div>
    );
}

// --- CREATE GUILD FORM ---
function CreateGuildForm({ user, onCreated, onCancel }) {
    const [name, setName] = useState('');
    const [tag, setTag] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        setError('');
        setLoading(true);
        const result = await createGuild(user, name, tag, desc);
        setLoading(false);
        if (result.success) {
            onCreated(result.guildId, result.tag);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Guild Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={30}
                    placeholder="My Awesome Guild"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Tag <span className="text-slate-500 normal-case font-normal">(2-4 chars, shown in arena)</span>
                </label>
                <input
                    value={tag}
                    onChange={e => setTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))}
                    maxLength={4}
                    placeholder="MAG"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono uppercase"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Description <span className="text-slate-500 normal-case font-normal">(optional)</span></label>
                <textarea
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    maxLength={120}
                    rows={2}
                    placeholder="We battle hard..."
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
            </div>
            {error && <p className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">Cancel</button>
                <button
                    onClick={handleCreate}
                    disabled={loading || name.length < 3 || tag.length < 2}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create
                </button>
            </div>
        </div>
    );
}

// --- BROWSE / SEARCH GUILDS ---
function BrowseGuilds({ user, onJoined, onBack }) {
    const [guilds, setGuilds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        listGuilds().then(data => { setGuilds(data); setLoading(false); });
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setLoading(true);
            const data = await listGuilds();
            setGuilds(data);
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = await searchGuilds(searchTerm.trim());
        setGuilds(data);
        setLoading(false);
    };

    const handleJoin = async (guildId) => {
        setError('');
        setJoining(true);
        const result = await joinGuild(user, guildId);
        setJoining(false);
        if (result.success) {
            onJoined(guildId, result.tag);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Search name or tag..."
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-10"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>
            {error && <p className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
            {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>
            ) : guilds.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No guilds found.</div>
            ) : (
                <div className="space-y-3">
                    {guilds.map(guild => (
                        <GuildCard key={guild.id} guild={guild} onJoin={handleJoin} loading={joining} />
                    ))}
                </div>
            )}
        </div>
    );
}

// --- GUILD OVERVIEW (member is in guild) ---
function GuildOverview({ user, guild, onLeave, onOpenChat, onOpenLeaderboard, onKick }) {
    const [confirmLeave, setConfirmLeave] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const isLeader = guild.leaderId === user.id;

    const handleLeave = async () => {
        setLeaving(true);
        await onLeave();
        setLeaving(false);
        setConfirmLeave(false);
    };

    const sortedMembers = [...(guild.members || [])].sort((a, b) =>
        (b.contributionPoints || 0) - (a.contributionPoints || 0)
    );

    return (
        <div className="space-y-4">
            {/* Guild Header Card */}
            <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                    <div className="text-4xl">🛡️</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-black text-white">{guild.name}</h3>
                            <GuildTag tag={guild.tag} />
                        </div>
                        {guild.description && <p className="text-slate-400 text-sm mt-1">{guild.description}</p>}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{guild.members?.length || 0}/30 members</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{(guild.totalPoints || 0).toLocaleString()} total pts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onOpenChat}
                    className="flex items-center gap-2 p-3 bg-slate-800/60 hover:bg-slate-700/60 border border-white/5 rounded-xl transition-colors"
                >
                    <MessageCircle className="w-5 h-5 text-indigo-400" />
                    <div className="text-left">
                        <div className="text-sm font-bold text-white">Guild Chat</div>
                        <div className="text-[10px] text-slate-400">Talk to members</div>
                    </div>
                </button>
                <button
                    onClick={onOpenLeaderboard}
                    className="flex items-center gap-2 p-3 bg-slate-800/60 hover:bg-slate-700/60 border border-white/5 rounded-xl transition-colors"
                >
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div className="text-left">
                        <div className="text-sm font-bold text-white">Leaderboard</div>
                        <div className="text-[10px] text-slate-400">Top guilds</div>
                    </div>
                </button>
            </div>

            {/* Members List */}
            <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Members ({guild.members?.length || 0})
                </h4>
                <div className="space-y-2">
                    {sortedMembers.map(member => (
                        <MemberRow
                            key={member.userId}
                            member={member}
                            isLeader={isLeader}
                            isMe={member.userId === user.id}
                            onKick={isLeader ? (uid) => onKick(uid) : null}
                        />
                    ))}
                </div>
            </div>

            {/* Leave */}
            <div className="pt-2">
                {confirmLeave ? (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 space-y-3">
                        <p className="text-sm text-red-300 font-bold text-center">
                            {isLeader && (guild.members?.length || 0) > 1
                                ? 'Leadership will transfer to the next member.'
                                : 'Are you sure you want to leave?'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmLeave(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm transition-colors">Cancel</button>
                            <button onClick={handleLeave} disabled={leaving} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5">
                                {leaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                Leave
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setConfirmLeave(true)}
                        className="w-full py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-red-400/20 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Leave Guild
                    </button>
                )}
            </div>
        </div>
    );
}

// --- MAIN GUILD SCREEN ---
export default function GuildScreen({ user, onBack, onOpenChat, onOpenLeaderboard, showNotification }) {
    const [view, setView] = useState('loading'); // 'loading' | 'none' | 'overview' | 'create' | 'browse'
    const [guild, setGuild] = useState(null);
    const [kickLoading, setKickLoading] = useState(false);
    const unsubRef = useRef(null);

    useEffect(() => {
        if (user?.guildId) {
            setView('loading');
            unsubRef.current = listenToGuild(user.guildId, (data) => {
                if (data) {
                    setGuild(data);
                    setView('overview');
                } else {
                    setGuild(null);
                    setView('none');
                }
            });
        } else {
            setView('none');
            setGuild(null);
        }

        return () => { if (unsubRef.current) unsubRef.current(); };
    }, [user?.guildId]);

    const handleCreated = (guildId, tag) => {
        showNotification && showNotification(`Guild created! Tag: [${tag}]`, 'success');
        // user.guildId will update via listenToUser → triggers the useEffect above
    };

    const handleJoined = (guildId, tag) => {
        showNotification && showNotification(`Joined guild! Tag: [${tag}]`, 'success');
    };

    const handleLeave = async () => {
        const result = await leaveGuild(user);
        if (result.success) {
            showNotification && showNotification('Left the guild.', 'info');
            if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
            setGuild(null);
            setView('none');
        } else {
            showNotification && showNotification(result.message, 'error');
        }
    };

    const handleKick = async (targetUserId) => {
        if (!guild || kickLoading) return;
        setKickLoading(true);
        const result = await kickMember(user.id, guild.id, targetUserId);
        setKickLoading(false);
        if (result.success) {
            showNotification && showNotification('Member kicked.', 'info');
        } else {
            showNotification && showNotification(result.message, 'error');
        }
    };

    const getTitle = () => {
        if (view === 'create') return 'Create Guild';
        if (view === 'browse') return 'Browse Guilds';
        if (view === 'overview' && guild) return guild.name;
        return 'Guild';
    };

    const handleBack = () => {
        if (view === 'create' || view === 'browse') setView('none');
        else onBack();
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center gap-3 px-4 pt-3 pb-3 shrink-0 z-10">
                <button
                    onClick={handleBack}
                    className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-black italic text-white tracking-wide uppercase">{getTitle()}</h2>
                    {view === 'overview' && guild && (
                        <GuildTag tag={guild.tag} />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4 scrollbar-hide relative z-10">
                {view === 'loading' && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    </div>
                )}

                {view === 'none' && (
                    <div className="space-y-4 pt-2">
                        <div className="text-center py-8">
                            <Shield className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-300 font-bold text-lg">No Guild Yet</p>
                            <p className="text-slate-500 text-sm mt-1">Create or join a guild to battle together.</p>
                        </div>
                        <button
                            onClick={() => setView('create')}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3"
                        >
                            <Plus className="w-5 h-5" /> Create Guild
                        </button>
                        <button
                            onClick={() => setView('browse')}
                            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-base transition-all border border-white/5 flex items-center justify-center gap-3"
                        >
                            <Search className="w-5 h-5" /> Browse & Join
                        </button>
                        <button
                            onClick={onOpenLeaderboard}
                            className="w-full py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 rounded-2xl font-bold text-sm transition-all border border-white/5 flex items-center justify-center gap-2"
                        >
                            <Trophy className="w-4 h-4 text-yellow-400" /> Guild Leaderboard
                        </button>
                    </div>
                )}

                {view === 'create' && (
                    <CreateGuildForm
                        user={user}
                        onCreated={handleCreated}
                        onCancel={() => setView('none')}
                    />
                )}

                {view === 'browse' && (
                    <BrowseGuilds
                        user={user}
                        onJoined={handleJoined}
                        onBack={() => setView('none')}
                    />
                )}

                {view === 'overview' && guild && (
                    <GuildOverview
                        user={user}
                        guild={guild}
                        onLeave={handleLeave}
                        onOpenChat={onOpenChat}
                        onOpenLeaderboard={onOpenLeaderboard}
                        onKick={handleKick}
                    />
                )}
            </div>
        </div>
    );
}
