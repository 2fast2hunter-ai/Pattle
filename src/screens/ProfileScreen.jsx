import React, { useState } from 'react';
import { Copy, UserPlus, Users, UserCheck, Trophy, LayoutGrid, Dna, ThermometerSun, Percent, Swords, ShoppingBag } from 'lucide-react';
import { DUMMY_USERS } from '../data/gameData';

export default function ProfileScreen({ user, petCount, onViewFriend, onAddFriend }) {
    const [activeTab, setActiveTab] = useState('stats');
    const [friendIdInput, setFriendIdInput] = useState('');

    const winRate = user.stats?.pvpTotal > 0 ? Math.round((user.stats.pvpWins / user.stats.pvpTotal) * 100) : 0;
    const marketBalance = (user.stats?.marketEarned || 0) - (user.stats?.marketSpent || 0);

    const stats = [
        { label: 'Pets', value: petCount, icon: LayoutGrid, color: 'text-blue-400', bg: 'bg-blue-500/20' },
        { label: 'Gezüchtet', value: user.stats?.bred || 0, icon: Dna, color: 'text-pink-400', bg: 'bg-pink-500/20' },
        { label: 'Gebrütet', value: user.stats?.hatched || 0, icon: ThermometerSun, color: 'text-amber-400', bg: 'bg-amber-500/20' },
        { label: 'Siegesrate', value: `${winRate}%`, icon: Percent, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
        { label: 'Kämpfe', value: user.stats?.pvpTotal || 0, icon: Swords, color: 'text-red-400', bg: 'bg-red-500/20' },
        { label: 'Markt Bilanz', value: marketBalance > 0 ? `+${marketBalance}` : `${marketBalance}`, icon: ShoppingBag, color: marketBalance >= 0 ? 'text-green-400' : 'text-red-400', bg: marketBalance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20' },
    ];

    const copyId = () => { alert(`ID kopiert: ${user.id}`); };

    return (
        <div className="pt-8 space-y-6 h-full overflow-y-auto pb-24 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="text-center relative px-4">
                <div className="w-32 h-32 bg-indigo-600 mx-auto rounded-3xl flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10">{user.avatar}<div className="absolute -bottom-3 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full border-2 border-slate-800">LVL {user.level}</div></div>
                <div className="mt-4"><h2 className="text-3xl font-black text-white">{user.username}</h2><p className="text-indigo-400 font-bold flex items-center justify-center gap-1 mb-2"><Trophy className="w-4 h-4" /> {user.rating} Elo</p><button onClick={copyId} className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-400 hover:bg-slate-700 transition-colors">ID: {user.id} <Copy className="w-3 h-3" /></button></div>
            </div>
            <div className="flex p-1 bg-slate-800 rounded-xl mx-4">
                <button onClick={() => setActiveTab('stats')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Statistiken</button>
                <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Freunde</button>
            </div>
            {activeTab === 'stats' ? (
                <div className="grid grid-cols-2 gap-3 px-4">{stats.map((stat, i) => (<div key={i} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-24"><div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div><div><div className={`text-2xl font-black ${stat.label === 'Markt Bilanz' ? stat.color : 'text-white'}`}>{stat.value}</div><div className="text-xs font-bold text-slate-400 uppercase">{stat.label}</div></div></div>))}</div>
            ) : (
                <div className="px-4 space-y-4">
                    <div className="bg-slate-800 p-4 rounded-2xl border border-white/5"><h3 className="text-sm font-bold text-white mb-2">Freund hinzufügen</h3><div className="flex gap-2"><input type="text" placeholder="Spieler-ID eingeben..." value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 text-sm text-white outline-none focus:border-indigo-500" /><button onClick={() => { onAddFriend(friendIdInput); setFriendIdInput(''); }} className="bg-indigo-600 text-white p-2 rounded-xl"><UserPlus className="w-5 h-5" /></button></div></div>
                    <div className="space-y-2">{!user.friends || user.friends.length === 0 ? (<div className="text-center text-slate-500 py-8"><Users className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>Noch keine Freunde.</p></div>) : (user.friends.map((friend, idx) => (<div key={idx} onClick={() => onViewFriend(friend)} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">{friend.avatar}</div><div><div className="font-bold text-white">{friend.username}</div><div className="text-xs text-indigo-400">Lvl {friend.level} • {friend.rating} Elo</div></div></div><UserCheck className="text-green-500 w-5 h-5" /></div>)))}</div>
                </div>
            )}
            <div className="text-center text-slate-600 text-xs font-mono px-4"><p>Member since 2024</p></div>
        </div>
    );
}