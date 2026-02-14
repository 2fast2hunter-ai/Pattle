import React from 'react';
import { Edit3, Trophy, Copy, Sword } from 'lucide-react';
import { COSMETICS } from '../../data/gameData';

export default function ProfileHeader({ user, setShowEditModal, copyId }) {
    const getProfileBgClass = () => {
        if (user.profileBg && COSMETICS[user.profileBg]) return COSMETICS[user.profileBg].colorClass;
        return 'bg-gradient-to-br from-indigo-600 to-violet-700'; // Default
    };

    return (
        <div className="text-center relative py-2">
            <div className={`w-32 h-32 ${getProfileBgClass()} mx-auto rounded-[32px] flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10 overflow-hidden group`}>
                {user.avatar}
                <button onClick={() => setShowEditModal(true)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                    <Edit3 className="w-8 h-8 text-white" />
                </button>
                <div className="absolute -bottom-3 bg-slate-900 text-yellow-400 text-xs font-black px-3 py-1 rounded-full border border-yellow-500/30">LVL {user.level}</div>
            </div>
            <div className="mt-5">
                <h2 className="text-3xl font-black text-white tracking-tight">{user.username}</h2>
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                    <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-indigo-400 font-bold flex items-center gap-1.5 text-xs shadow-sm">
                        <Trophy className="w-3.5 h-3.5" /> {user.rating} Elo
                    </div>
                    <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-red-400 font-bold flex items-center gap-1.5 text-xs shadow-sm">
                        <Sword className="w-3.5 h-3.5" /> {user.stats?.gauntletHighscore || 0} Score
                    </div>
                    <button onClick={copyId} className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-mono active:scale-95">
                        <Copy className="w-3.5 h-3.5" /> ID
                    </button>
                </div>
            </div>
        </div>
    );
}
