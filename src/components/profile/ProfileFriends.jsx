import React, { useState } from 'react';
import { UserPlus, Users, UserCheck } from 'lucide-react';

export default function ProfileFriends({ user, onAddFriend, onViewFriend, t }) {
    const [friendIdInput, setFriendIdInput] = useState('');

    return (
        <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">{t ? t('profile_add_friend') : 'Add friend'}</h3>
                <div className="flex gap-2"><input type="text" placeholder={t ? t('profile_player_id_placeholder') : 'Enter player ID...'} value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder-slate-600" /><button onClick={() => { onAddFriend(friendIdInput); setFriendIdInput(''); }} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-900/20"><UserPlus className="w-5 h-5" /></button></div>
            </div>
            <div className="space-y-2">
                {!user.friends || user.friends.length === 0 ? (
                    <div className="text-center text-slate-500 py-10"><Users className="w-12 h-12 mx-auto mb-2 opacity-20" /><p className="text-sm font-bold">{t ? t('profile_no_friends') : 'No friends yet.'}</p></div>
                ) : (
                    user.friends.map((friend) => (
                        <div key={friend.id || friend.username} onClick={() => onViewFriend(friend)} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-750 transition-colors border border-white/5 active:scale-[0.98]"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl shadow-inner">{friend.avatar}</div><div><div className="font-bold text-white text-sm">{friend.username}</div><div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded w-fit mt-0.5">Lvl {friend.level} • {friend.rating} Elo</div></div></div><UserCheck className="text-emerald-500 w-5 h-5" /></div>
                    ))
                )}
            </div>
        </div>
    );
}
