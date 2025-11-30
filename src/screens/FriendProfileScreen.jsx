import React from 'react';
import { ArrowLeft, Trophy, Dna, ThermometerSun, Percent, Swords, ShoppingBag } from 'lucide-react';

export default function FriendProfileScreen({ friend, onBack }) {
    const winRate = friend.stats?.pvpTotal > 0 ? Math.round((friend.stats.pvpWins / friend.stats.pvpTotal) * 100) : 0;
    const marketBalance = (friend.stats?.marketEarned || 0) - (friend.stats?.marketSpent || 0);
    const stats = [
        { label: 'Gezüchtet', value: friend.stats?.bred || 0, icon: Dna, color: 'text-pink-400', bg: 'bg-pink-500/20' },
        { label: 'Gebrütet', value: friend.stats?.hatched || 0, icon: ThermometerSun, color: 'text-amber-400', bg: 'bg-amber-500/20' },
        { label: 'Siegesrate', value: `${winRate}%`, icon: Percent, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
        { label: 'Kämpfe', value: friend.stats?.pvpTotal || 0, icon: Swords, color: 'text-red-400', bg: 'bg-red-500/20' },
        { label: 'Markt Bilanz', value: marketBalance > 0 ? `+${marketBalance}` : `${marketBalance}`, icon: ShoppingBag, color: marketBalance >= 0 ? 'text-green-400' : 'text-red-400', bg: marketBalance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20' },
    ];

    return (
        <div className="pt-8 space-y-8 h-full overflow-y-auto pb-24 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2 mb-2 px-4"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold text-white">Freund Profil</h2></div>
            <div className="text-center relative">
                <div className="w-32 h-32 bg-indigo-600 mx-auto rounded-3xl flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10">{friend.avatar}<div className="absolute -bottom-3 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full border-2 border-slate-800">LVL {friend.level}</div></div>
                <div className="mt-4"><h2 className="text-3xl font-black text-white">{friend.username}</h2><p className="text-indigo-400 font-bold flex items-center justify-center gap-1"><Trophy className="w-4 h-4" /> {friend.rating} Elo</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3 px-4">{stats.map((stat, i) => (<div key={i} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-24"><div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div><div><div className={`text-2xl font-black ${stat.label === 'Markt Bilanz' ? stat.color : 'text-white'}`}>{stat.value}</div><div className="text-xs font-bold text-slate-400 uppercase">{stat.label}</div></div></div>))}</div>
        </div>
    );
}