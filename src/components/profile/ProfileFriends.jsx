import React, { useState } from 'react';
import { UserPlus, Users, UserCheck, Check, X, Mail } from 'lucide-react';

export default function ProfileFriends({ user, onAddFriend, onAcceptFriendRequest, onDeclineFriendRequest, onViewFriend, t }) {
    const [usernameInput, setUsernameInput] = useState('');

    const pendingRequests = user.friendRequests || [];

    const handleSend = () => {
        if (!usernameInput.trim()) return;
        onAddFriend(usernameInput.trim());
        setUsernameInput('');
    };

    return (
        <div className="space-y-4 animate-in fade-in">
            {/* Add by username */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">{t ? t('profile_add_friend') : 'Add friend'}</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={t ? t('profile_username_placeholder') : 'Enter username...'}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-900/20"
                    >
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Incoming requests */}
            {pendingRequests.length > 0 && (
                <div className="bg-slate-800 p-4 rounded-2xl border border-amber-500/20">
                    <h3 className="text-xs font-bold text-amber-400 uppercase mb-3 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {t ? t('profile_friend_requests') : 'Friend Requests'}
                        <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">{pendingRequests.length}</span>
                    </h3>
                    <div className="space-y-2">
                        {pendingRequests.map((req) => (
                            <div key={req.fromId} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-lg flex-shrink-0">{req.fromAvatar}</div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-white text-sm truncate">{req.fromUsername}</div>
                                        <div className="text-[10px] text-slate-400">Lvl {req.fromLevel} • {req.fromRating} Elo</div>
                                    </div>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                    <button
                                        onClick={() => onAcceptFriendRequest(req)}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg active:scale-95 transition-all"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeclineFriendRequest(req)}
                                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-lg active:scale-95 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friends list */}
            <div className="space-y-2">
                {!user.friends || user.friends.length === 0 ? (
                    <div className="text-center text-slate-500 py-10">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-bold">{t ? t('profile_no_friends') : 'No friends yet.'}</p>
                    </div>
                ) : (
                    user.friends.map((friend) => (
                        <div
                            key={friend.id || friend.username}
                            onClick={() => onViewFriend(friend)}
                            className="bg-slate-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors border border-white/5 active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl shadow-inner">{friend.avatar}</div>
                                <div>
                                    <div className="font-bold text-white text-sm">{friend.username}</div>
                                    <div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded w-fit mt-0.5">Lvl {friend.level} • {friend.rating} Elo</div>
                                </div>
                            </div>
                            <UserCheck className="text-emerald-500 w-5 h-5" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
