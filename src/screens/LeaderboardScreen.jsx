import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Info, Loader2 } from 'lucide-react';
import { getLeaderboard, getUserRankAndPercent } from '../utils/db';
import LeaderboardItem from '../components/leaderboard/LeaderboardItem';
import MyRankCard from '../components/leaderboard/MyRankCard';
import RewardsInfoModal from '../components/leaderboard/RewardsInfoModal';

export default function LeaderboardScreen({ user, onBack, onViewPlayer, t }) {
    const [leaders, setLeaders] = useState([]);
    const [myRankData, setMyRankData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRewardsInfo, setShowRewardsInfo] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [activeTab, setActiveTab] = useState('elo'); // 'elo' or 'gauntlet'

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            let targetDate;

            if (activeTab === 'elo') {
                targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            } else {
                // Gauntlet Saison Ende: 8. des nächsten Monats (weil Start = 8.)
                // Wenn heute < 8., dann ist Ende = 8. dieses Monats
                // Wenn heute >= 8., dann ist Ende = 8. nächsten Monats
                if (now.getDate() < 8) {
                    targetDate = new Date(now.getFullYear(), now.getMonth(), 8);
                } else {
                    targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 8);
                }
            }

            const diff = targetDate - now;
            if (diff > 0) {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${d}d ${h}h ${m}m`);
            } else setTimeLeft("Bald...");
        };
        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, [activeTab]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [data, rankData] = await Promise.all([
                getLeaderboard(activeTab),
                getUserRankAndPercent(user, activeTab)
            ]);
            setLeaders(data);
            setMyRankData(rankData);
            setLoading(false);
        };
        loadData();
    }, [activeTab]); // Reload when tab changes

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">

            {showRewardsInfo && (
                <RewardsInfoModal onClose={() => setShowRewardsInfo(false)} />
            )}

            {/* Background FX */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>

            {/* HEADER */}
            <div className="relative flex flex-col mb-4 pt-2 px-4 shrink-0 z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-wide text-white uppercase">RANGLISTE</h2>
                        </div>
                    </div>
                    <button onClick={() => setShowRewardsInfo(true)} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                        <Info className="w-5 h-5" />
                    </button>
                </div>

                {/* TABS */}
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 mb-2">
                    <button
                        onClick={() => setActiveTab('elo')}
                        className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'elo' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        PVP Elo
                    </button>
                    <button
                        onClick={() => setActiveTab('gauntlet')}
                        className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'gauntlet' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Gauntlet
                    </button>
                </div>

                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                        <Trophy className={`w-3.5 h-3.5 ${activeTab === 'gauntlet' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <span className="text-xs font-bold text-slate-400">{t ? t('label_season_end') : 'Season end'}: <span className="text-white">{timeLeft}</span></span>
                        {activeTab === 'gauntlet' && <span className="text-[9px] text-slate-500 ml-1">(+7d Offset)</span>}
                    </div>
                </div>
            </div>

            {/* MY RANK CARD */}
            <MyRankCard user={user} myRankData={myRankData} loading={loading} type={activeTab} />

            {/* LIST */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-3 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Lade Daten...</span>
                    </div>
                ) : (
                    leaders.map((player, index) => (
                        <LeaderboardItem
                            key={player.id}
                            player={player}
                            index={index}
                            isMe={player.id === user.id}
                            onViewPlayer={onViewPlayer}
                            type={activeTab}
                        />
                    ))
                )}
            </div>
        </div>
    );
}


