import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Crown, Shield, Medal, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { getLeaderboard } from '../utils/db';
import PetAvatar from '../components/PetAvatar';

export default function LeaderboardScreen({ user, onBack, onViewPlayer }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaders(data);
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
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Top 100 Spieler</span>
                  </div>
              </div>
          </div>
      </div>

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