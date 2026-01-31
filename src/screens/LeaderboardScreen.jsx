import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Crown, Shield, Medal, TrendingUp, TrendingDown, Minus, Loader2, Info, X, Coins, Gem, Ticket, PlayCircle } from 'lucide-react';
import { getLeaderboard, getUserRankAndPercent } from '../utils/db';
import PetAvatar from '../components/PetAvatar';

const REWARD_TIERS = [
    { label: 'Platz 1', coins: 50000, gems: 500, tickets: 10, adTickets: 20, color: 'text-yellow-400' },
    { label: 'Platz 2', coins: 30000, gems: 300, tickets: 7, adTickets: 15, color: 'text-slate-300' },
    { label: 'Platz 3', coins: 20000, gems: 200, tickets: 5, adTickets: 10, color: 'text-orange-400' },
    { label: 'Top 5%', coins: 15000, gems: 150, tickets: 4, adTickets: 8 },
    { label: 'Top 10%', coins: 10000, gems: 100, tickets: 3, adTickets: 6 },
    { label: 'Top 20%', coins: 8000, gems: 80, tickets: 2, adTickets: 5 },
    { label: 'Top 30%', coins: 7000, gems: 70, tickets: 2, adTickets: 4 },
    { label: 'Top 40%', coins: 6000, gems: 60, tickets: 1, adTickets: 4 },
    { label: 'Top 50%', coins: 5000, gems: 50, tickets: 1, adTickets: 3 },
    { label: 'Top 60%', coins: 4000, gems: 40, tickets: 1, adTickets: 3 },
    { label: 'Top 70%', coins: 3000, gems: 30, tickets: 1, adTickets: 2 },
    { label: 'Top 80%', coins: 2000, gems: 20, tickets: 0, adTickets: 2 },
    { label: 'Top 90%', coins: 1000, gems: 10, tickets: 0, adTickets: 1 },
];

export default function LeaderboardScreen({ user, onBack, onViewPlayer, t }) {
  const [leaders, setLeaders] = useState([]);
  const [myRankData, setMyRankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRewardsInfo, setShowRewardsInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
      const updateTimer = () => {
          const now = new Date();
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const diff = nextMonth - now;
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
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [data, rankData] = await Promise.all([
          getLeaderboard(),
          getUserRankAndPercent(user)
      ]);
      setLeaders(data);
      setMyRankData(rankData);
      setLoading(false);
    };
    loadData();
  }, []);

  const getRankStyle = (index) => {
      if (index === 0) return 'bg-yellow-500 text-yellow-950 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]'; // Gold
      if (index === 1) return 'bg-slate-300 text-slate-800 border-slate-400 shadow-[0_0_10px_rgba(203,213,225,0.5)]'; // Silber
      if (index === 2) return 'bg-orange-400 text-orange-900 border-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]'; // Bronze
      return 'bg-slate-800 text-slate-400 border-white/5';
  };

  const getRankIcon = (index) => {
      if (index === 0) return <Crown className="w-5 h-5" />;
      if (index === 1) return <Medal className="w-5 h-5" />;
      if (index === 2) return <Medal className="w-5 h-5" />;
      return <span className="font-black text-sm">{index + 1}</span>;
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
      
      {showRewardsInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl flex flex-col shadow-2xl max-h-[80vh]">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                      <h3 className="font-black text-white text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Saison-Belohnungen</h3>
                      <button onClick={() => setShowRewardsInfo(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-2">
                      {REWARD_TIERS.map((tier, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-xl border border-white/5">
                              <span className={`font-black text-xs uppercase ${tier.color || 'text-slate-300'}`}>{tier.label}</span>
                              <div className="flex items-center gap-3">
                                  {tier.coins > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-400"><Coins className="w-3 h-3" /> {tier.coins}</div>}
                                  {tier.gems > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-pink-400"><Gem className="w-3 h-3" /> {tier.gems}</div>}
                                  {tier.tickets > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-pink-500"><Ticket className="w-3 h-3" /> {tier.tickets}</div>}
                                  {tier.adTickets > 0 && <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500"><PlayCircle className="w-3 h-3" /> {tier.adTickets}</div>}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Background FX */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>

      {/* HEADER */}
      <div className="relative flex items-center justify-between mb-4 pt-2 px-4 shrink-0 z-10">
          <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                  <h2 className="text-2xl font-black italic tracking-wide text-white uppercase">RANGLISTE</h2>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                        <span>Saison Ende: <span className="text-white">{timeLeft}</span></span>
                      </div>
                  </div>
              </div>
          </div>
          <button onClick={() => setShowRewardsInfo(true)} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
              <Info className="w-5 h-5" />
          </button>
      </div>

      {/* MY RANK CARD */}
      {!loading && myRankData && (
          <div className="px-4 mb-4 relative z-10">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
                  <div>
                      <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Dein Rang</div>
                      <div className="text-2xl font-black text-white flex items-center gap-2">
                          #{myRankData.rank}
                          <span className="text-sm font-bold text-indigo-300 bg-black/20 px-2 py-0.5 rounded-lg">
                              Top {myRankData.percent < 1 ? '<1' : myRankData.percent.toFixed(0)}%
                          </span>
                      </div>
                  </div>
                  <div className="text-right">
                       <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Rating</div>
                       <div className="text-xl font-black text-white flex items-center justify-end gap-1">
                           <Shield className="w-4 h-4 text-indigo-300" />
                           {user.rating || 1000}
                       </div>
                  </div>
              </div>
          </div>
      )}

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-3 relative z-10">
          {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Lade Daten...</span>
              </div>
          ) : (
              leaders.map((player, index) => {
                  const isMe = player.id === user.id;
                  
                  // --- FIX: ELO BILANZ BERECHNUNG MIT ISO DATUM ---
                  const today = new Date().toISOString().split('T')[0];
                  
                  // 1. Prüfen, ob der gespeicherte Startwert von HEUTE ist
                  const isDataFromToday = player.lastEloDate === today;
                  
                  // 2. Wenn ja: Differenz berechnen. Wenn nein: 0 (da heute noch nicht gespielt)
                  const startElo = isDataFromToday && player.startEloToday !== undefined 
                      ? player.startEloToday 
                      : (player.rating || 1000); 
                  
                  const diff = (player.rating || 1000) - startElo;
                  const isPositive = diff > 0;
                  const isNeutral = diff === 0;
                  // ----------------------------------

                  return (
                      <div 
                          key={player.id} 
                          onClick={() => onViewPlayer(player)}
                          className={`
                              relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]
                              ${isMe ? 'bg-indigo-900/40 border-indigo-500/50 shadow-lg shadow-indigo-900/20' : 'bg-slate-900/60 border-white/5 hover:bg-slate-800'}
                          `}
                      >
                          {/* RANK BADGE */}
                          <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${getRankStyle(index)}`}>
                              {getRankIcon(index)}
                          </div>

                          {/* AVATAR & NAME */}
                          <div className="w-10 h-10 shrink-0 bg-slate-800 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/10">
                              {player.avatar || '🛡️'}
                          </div>

                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                  <span className={`font-black text-sm truncate ${isMe ? 'text-indigo-200' : 'text-slate-200'}`}>
                                      {player.username || 'Unbekannt'} {isMe && '(Du)'}
                                  </span>
                                  {player.level && <span className="text-[9px] font-bold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">Lvl {player.level}</span>}
                              </div>
                              
                              {/* RATING & DAILY DIFF */}
                              <div className="flex items-center gap-3 mt-0.5">
                                  <div className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                                      <Shield className="w-3 h-3" /> {player.rating || 1000}
                                  </div>
                                  
                                  {/* TAGES-BILANZ */}
                                  <div className={`text-[10px] font-bold flex items-center gap-0.5 ${isNeutral ? 'text-slate-500' : (isPositive ? 'text-green-400' : 'text-red-400')}`}>
                                      {isNeutral ? <Minus className="w-3 h-3" /> : (isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                                      {!isNeutral && (isPositive ? '+' : '')}{diff} heute
                                  </div>
                              </div>
                          </div>
                      </div>
                  );
              })
          )}
      </div>
    </div>
  );
}