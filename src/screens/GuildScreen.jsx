import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft, Shield, Users, Trophy, MessageCircle, LogOut,
    Search, Plus, Crown, Star, UserX, ChevronRight, Loader2, Hash,
    UserPlus, ChevronDown, Sword, Mail
} from 'lucide-react';
import {
    createGuild, joinGuild, leaveGuild, kickMember,
    listenToGuild, listGuilds, searchGuilds,
    promoteToOfficer, demoteToMember,
    sendGuildInvite, respondToGuildInvite, listenToPendingInvites,
    findUserForInvite, GUILD_EMBLEMS, MAX_GUILD_MEMBERS
} from '../utils/guildDb';

function GuildTag({ tag }) {
    if (!tag) return null;
    return (
        <span className="inline-flex items-center gap-0.5 bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider">
            <Hash className="w-2.5 h-2.5" />{tag}
        </span>
    );
}

function RoleBadge({ role }) {
    if (role === 'leader') return (
        <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-yellow-400/15 text-yellow-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
            <Crown className="w-2.5 h-2.5" />Leader
        </span>
    );
    if (role === 'officer') return (
        <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-indigo-400/15 text-indigo-300 px-1.5 py-0.5 rounded uppercase tracking-wide">
            <Sword className="w-2.5 h-2.5" />Officer
        </span>
    );
    return null;
}

function MemberRow({ member, myRole, isMe, onKick, onPromote, onDemote }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const canManage = (myRole === 'leader' || myRole === 'officer') && !isMe && member.role !== 'leader';
    const canKick = canManage && (myRole === 'leader' || member.role === 'member');
    const canPromote = myRole === 'leader' && member.role === 'member';
    const canDemote = myRole === 'leader' && member.role === 'officer';

    return (
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-white/5 relative">
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-700/60 rounded-xl shrink-0">
                {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{member.username}</span>
                    <RoleBadge role={member.role} />
                    {isMe && <span className="text-[9px] font-bold text-slate-400 bg-slate-700/60 px-1.5 py-0.5 rounded">YOU</span>}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-amber-400 font-bold">{(member.contributionPoints || 0).toLocaleString()} pts</span>
                </div>
            </div>
            {canManage && (
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-8 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-20 min-w-[130px] overflow-hidden">
                            {canPromote && (
                                <button
                                    onClick={() => { onPromote(member.userId); setMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 flex items-center gap-2"
                                >
                                    <Sword className="w-3.5 h-3.5" />Promote Officer
                                </button>
                            )}
                            {canDemote && (
                                <button
                                    onClick={() => { onDemote(member.userId); setMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700/50 flex items-center gap-2"
                                >
                                    <ChevronDown className="w-3.5 h-3.5" />Demote Member
                                </button>
                            )}
                            {canKick && (
                                <button
                                    onClick={() => { onKick(member.userId); setMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                >
                                    <UserX className="w-3.5 h-3.5" />Kick
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function GuildCard({ guild, onJoin, loading }) {
    const emblem = guild.emblem || '🛡️';
    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{emblem}</div>
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
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{guild.members?.length || 0}/{MAX_GUILD_MEMBERS}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{(guild.totalPoints || 0).toLocaleString()} pts</span>
            </div>
        </div>
    );
}

// --- EMBLEM PICKER ---
function EmblemPicker({ value, onChange }) {
    return (
        <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Emblem</label>
            <div className="grid grid-cols-8 gap-1.5">
                {GUILD_EMBLEMS.map(e => (
                    <button
                        key={e}
                        type="button"
                        onClick={() => onChange(e)}
                        className={`text-xl w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                            value === e
                                ? 'bg-indigo-600/60 border-2 border-indigo-400 scale-110'
                                : 'bg-slate-800 border border-white/10 hover:bg-slate-700'
                        }`}
                    >
                        {e}
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- CREATE GUILD FORM ---
function CreateGuildForm({ user, onCreated, onCancel }) {
    const [name, setName] = useState('');
    const [tag, setTag] = useState('');
    const [desc, setDesc] = useState('');
    const [emblem, setEmblem] = useState('🛡️');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        setError('');
        setLoading(true);
        const result = await createGuild(user, name, tag, desc, emblem);
        setLoading(false);
        if (result.success) {
            onCreated(result.guildId, result.tag);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="space-y-4">
            <EmblemPicker value={emblem} onChange={setEmblem} />
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
                    Tag <span className="text-slate-500 normal-case font-normal">(exactly 3 chars, shown in arena)</span>
                </label>
                <input
                    value={tag}
                    onChange={e => setTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3))}
                    maxLength={3}
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
                    disabled={loading || name.length < 3 || tag.length !== 3}
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

// --- INVITE FRIEND FORM ---
function InviteFriendForm({ user, guild, onClose, showNotification }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleInvite = async () => {
        if (!username.trim()) return;
        setLoading(true);
        setMsg('');
        const target = await findUserForInvite(username.trim());
        if (!target) {
            setLoading(false);
            setMsg('Player not found.');
            return;
        }
        const result = await sendGuildInvite(user, guild.id, target.id);
        setLoading(false);
        if (result.success) {
            showNotification && showNotification(`Invite sent to ${target.username}!`, 'success');
            onClose();
        } else {
            setMsg(result.message);
        }
    };

    return (
        <div className="bg-slate-800/80 border border-indigo-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-black text-white uppercase tracking-wide">Invite Player</span>
            </div>
            <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleInvite()}
                placeholder="Player username..."
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                autoFocus
            />
            {msg && <p className="text-red-400 text-xs font-bold">{msg}</p>}
            <div className="flex gap-2">
                <button onClick={onClose} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm transition-colors">Cancel</button>
                <button
                    onClick={handleInvite}
                    disabled={loading || !username.trim()}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                    Send Invite
                </button>
            </div>
        </div>
    );
}

// --- GUILD OVERVIEW (member is in guild) ---
function GuildOverview({ user, guild, onLeave, onOpenChat, onOpenLeaderboard, onKick, onPromote, onDemote, showNotification }) {
    const [confirmLeave, setConfirmLeave] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [showInvite, setShowInvite] = useState(false);

    const myMember = guild.members?.find(m => m.userId === user.id);
    const myRole = myMember?.role || 'member';
    const isLeader = myRole === 'leader';
    const canInvite = myRole === 'leader' || myRole === 'officer';

    const handleLeave = async () => {
        setLeaving(true);
        await onLeave();
        setLeaving(false);
        setConfirmLeave(false);
    };

    const sortedMembers = [...(guild.members || [])].sort((a, b) => {
        const roleOrder = { leader: 0, officer: 1, member: 2 };
        const rDiff = (roleOrder[a.role] ?? 2) - (roleOrder[b.role] ?? 2);
        if (rDiff !== 0) return rDiff;
        return (b.contributionPoints || 0) - (a.contributionPoints || 0);
    });

    const emblem = guild.emblem || '🛡️';

    return (
        <div className="space-y-4">
            {/* Guild Header Card */}
            <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                    <div className="text-4xl">{emblem}</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-black text-white">{guild.name}</h3>
                            <GuildTag tag={guild.tag} />
                        </div>
                        {guild.description && <p className="text-slate-400 text-sm mt-1">{guild.description}</p>}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{guild.members?.length || 0}/{MAX_GUILD_MEMBERS} members</span>
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

            {/* Invite friend (leader/officer) */}
            {canInvite && !showInvite && (
                <button
                    onClick={() => setShowInvite(true)}
                    className="w-full py-2.5 text-sm font-bold text-indigo-300 hover:text-indigo-200 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Player
                </button>
            )}
            {showInvite && (
                <InviteFriendForm
                    user={user}
                    guild={guild}
                    onClose={() => setShowInvite(false)}
                    showNotification={showNotification}
                />
            )}

            {/* Members List */}
            <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Members ({guild.members?.length || 0}/{MAX_GUILD_MEMBERS})
                </h4>
                <div className="space-y-2">
                    {sortedMembers.map(member => (
                        <MemberRow
                            key={member.userId}
                            member={member}
                            myRole={myRole}
                            isMe={member.userId === user.id}
                            onKick={uid => onKick(uid)}
                            onPromote={uid => onPromote(uid)}
                            onDemote={uid => onDemote(uid)}
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
                                ? 'Leadership transfers to the next officer/member.'
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

// --- PENDING INVITES PANEL ---
function PendingInvites({ user, invites, onAccepted, showNotification }) {
    const [loading, setLoading] = useState(false);

    const handleRespond = async (invite, accept) => {
        setLoading(true);
        const result = await respondToGuildInvite(user, invite.id, accept);
        setLoading(false);
        if (accept && result.success) {
            showNotification && showNotification(`Joined ${invite.guildName}!`, 'success');
            onAccepted(invite.guildId, invite.guildTag);
        } else if (!accept && result.success) {
            showNotification && showNotification('Invite declined.', 'info');
        } else if (result.message) {
            showNotification && showNotification(result.message, 'error');
        }
    };

    if (!invites.length) return null;

    return (
        <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />Guild Invites ({invites.length})
            </h4>
            {invites.map(invite => (
                <div key={invite.id} className="bg-indigo-900/30 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-3">
                    <div className="text-2xl">{invite.guildEmblem || '🛡️'}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">{invite.guildName}</span>
                            <GuildTag tag={invite.guildTag} />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">from {invite.invitedByUsername}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                        <button
                            onClick={() => handleRespond(invite, false)}
                            disabled={loading}
                            className="px-2.5 py-1.5 text-xs font-bold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Decline
                        </button>
                        <button
                            onClick={() => handleRespond(invite, true)}
                            disabled={loading}
                            className="px-2.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                            Accept
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- MAIN GUILD SCREEN ---
export default function GuildScreen({ user, onBack, onOpenChat, onOpenLeaderboard, showNotification }) {
    const [view, setView] = useState('loading');
    const [guild, setGuild] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [pendingInvites, setPendingInvites] = useState([]);
    const unsubRef = useRef(null);
    const unsubInvitesRef = useRef(null);

    useEffect(() => {
        if (user?.id && !user?.guildId) {
            const unsub = listenToPendingInvites(user.id, setPendingInvites);
            unsubInvitesRef.current = unsub;
        } else {
            setPendingInvites([]);
            if (unsubInvitesRef.current) { unsubInvitesRef.current(); unsubInvitesRef.current = null; }
        }
        return () => { if (unsubInvitesRef.current) unsubInvitesRef.current(); };
    }, [user?.id, user?.guildId]);

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
        if (!guild || actionLoading) return;
        setActionLoading(true);
        const result = await kickMember(user.id, guild.id, targetUserId);
        setActionLoading(false);
        if (result.success) {
            showNotification && showNotification('Member kicked.', 'info');
        } else {
            showNotification && showNotification(result.message, 'error');
        }
    };

    const handlePromote = async (targetUserId) => {
        if (!guild || actionLoading) return;
        setActionLoading(true);
        const result = await promoteToOfficer(user.id, guild.id, targetUserId);
        setActionLoading(false);
        if (result.success) {
            showNotification && showNotification('Member promoted to Officer!', 'success');
        } else {
            showNotification && showNotification(result.message, 'error');
        }
    };

    const handleDemote = async (targetUserId) => {
        if (!guild || actionLoading) return;
        setActionLoading(true);
        const result = await demoteToMember(user.id, guild.id, targetUserId);
        setActionLoading(false);
        if (result.success) {
            showNotification && showNotification('Officer demoted to Member.', 'info');
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
                    {view === 'overview' && guild && <GuildTag tag={guild.tag} />}
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
                        {pendingInvites.length > 0 && (
                            <PendingInvites
                                user={user}
                                invites={pendingInvites}
                                onAccepted={handleJoined}
                                showNotification={showNotification}
                            />
                        )}
                        <div className="text-center py-6">
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
                        onPromote={handlePromote}
                        onDemote={handleDemote}
                        showNotification={showNotification}
                    />
                )}
            </div>
        </div>
    );
}
