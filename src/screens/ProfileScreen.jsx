import React, { useState } from 'react';
import { Copy, UserPlus, Users, UserCheck, Trophy, LayoutGrid, Dna, ThermometerSun, Percent, Swords, ShoppingBag, X } from 'lucide-react'; // X importiert

export default function ProfileScreen({ user, petCount, onViewFriend, onAddFriend, onBack }) { // onBack prop hinzugefügt
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
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom duration-500">
            
            {/* --- HEADER --- */}
            <div className="relative flex items-center justify-center mb-6 pt-6 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">
                    PROFIL
                </h1>
                <button 
                    onClick={onBack} 
                    className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 space-y-6">
                <div className="text-center relative px-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-violet-700 mx-auto rounded-[32px] flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10 overflow-hidden">
                        {user.avatar}
                        <div className="absolute -bottom-3 bg-slate-900 text-yellow-400 text-xs font-black px-3 py-1 rounded-full border border-yellow-500/30">LVL {user.level}</div>
                    </div>
                    <div className="mt-5">
                        <h2 className="text-3xl font-black text-white">{user.username}</h2>
                        <div className="flex justify-center gap-2 mt-2">
                            <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-white/5 text-indigo-400 font-bold flex items-center gap-1 text-xs">
                                <Trophy className="w-3 h-3" /> {user.rating} Elo
                            </div>
                            <button onClick={copyId} className="bg-slate-800/50 px-3 py-1 rounded-full border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-mono">
                                <Copy className="w-3 h-3" /> ID Kopieren
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex p-1 bg-slate-800 rounded-xl mx-4">
                    <button onClick={() => setActiveTab('stats')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Statistiken</button>
                    <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Freunde</button>
                </div>

                {activeTab === 'stats' ? (
                    <div className="grid grid-cols-2 gap-3 px-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-24">
                                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`text-2xl font-black ${stat.label === 'Markt Bilanz' ? stat.color : 'text-white'}`}>{stat.value}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-4 space-y-4">
                        <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">
                            <h3 className="text-sm font-bold text-white mb-2">Freund hinzufügen</h3>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Spieler-ID eingeben..." value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 text-sm text-white outline-none focus:border-indigo-500" />
                                <button onClick={() => { onAddFriend(friendIdInput); setFriendIdInput(''); }} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all"><UserPlus className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {!user.friends || user.friends.length === 0 ? (
                                <div className="text-center text-slate-500 py-8"><Users className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>Noch keine Freunde.</p></div>
                            ) : (
                                user.friends.map((friend, idx) => (
                                    <div key={idx} onClick={() => onViewFriend(friend)} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl shadow-inner">{friend.avatar}</div>
                                            <div>
                                                <div className="font-bold text-white">{friend.username}</div>
                                                <div className="text-xs text-indigo-400 font-bold">Lvl {friend.level} • {friend.rating} Elo</div>
                                            </div>
                                        </div>
                                        <UserCheck className="text-emerald-500 w-5 h-5" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                <div className="text-center text-slate-600 text-[10px] font-mono uppercase tracking-widest px-4 pt-4">Mitglied seit 2024</div>
            </div>
        </div>
    );
}