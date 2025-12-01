import React from 'react';
// NEU: 'X' hinzugefügt
import { Swords, Trophy, Users, Shield, Zap, X } from 'lucide-react';
import { getUnlockedTeamSlots } from '../utils/gameMechanics';

export default function ArenaHub({ user, onBattle, onTeam, onLeaderboard, onBack }) {
  const teamCount = user.team.filter(id => id !== null).length;
  const maxSlots = getUnlockedTeamSlots(user.level);
  const isTeamReady = teamCount > 0;

  return (
    <div className="h-full flex flex-col animate-in fade-in">
        
        {/* --- NEUER HEADER --- */}
        <div className="relative flex items-center justify-center mb-6 pt-2">
            {/* Zentrierter Titel */}
            <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-white">
                ARENA
            </h1>
            
            {/* Rotes Schließen-Kreuz oben rechts */}
            <button 
                onClick={onBack} 
                className="absolute right-0 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 p-1">
            
            {/* PVP KAMPF BEREICH */}
            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl p-1 shadow-lg shadow-red-500/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-[22px] p-6 relative z-10 text-center h-full flex flex-col justify-center border border-white/10">
                    <Swords className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-80 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wider">PVP Kampf</h2>
                    <p className="text-red-200 font-bold mb-6 leading-tight">Kämpfe gegen andere Spieler und steige im Rang auf!</p>
                    
                    <button 
                        onClick={onBattle}
                        disabled={!isTeamReady || user.energy < 1}
                        className={`
                            w-full bg-white py-4 px-6 rounded-2xl shadow-xl
                            flex flex-col items-center justify-center gap-1
                            transform transition-all duration-300
                            ${(!isTeamReady || user.energy < 1) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-red-500/50 active:scale-95'}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <Zap className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                            <span className="text-3xl font-black text-red-700 tracking-tighter">1 FIGHT</span>
                        </div>
                        <div className="text-red-400 font-bold text-sm uppercase tracking-widest">
                            Aktuelle ELO: <span className="text-red-600">{user.rating}</span>
                        </div>
                    </button>

                    {!isTeamReady && <p className="text-red-400 text-xs font-bold mt-4 bg-black/30 py-2 rounded-lg px-4 inline-block mx-auto">Dein Team ist leer!</p>}
                    {isTeamReady && user.energy < 1 && <p className="text-red-400 text-xs font-bold mt-4 bg-black/30 py-2 rounded-lg px-4 inline-block mx-auto">Keine Energie!</p>}
                </div>
            </div>

             {/* Team Manager Button */}
             <button onClick={onTeam} className="w-full bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl p-1 shadow-lg shadow-indigo-500/20 relative overflow-hidden group text-left hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-[22px] p-6 relative z-10 flex items-center justify-between border border-white/10">
                    <div>
                        <h2 className="text-xl font-black text-white mb-1">Team verwalten</h2>
                        <p className="text-indigo-200 font-bold text-sm mb-3">Stelle dein bestes Team zusammen.</p>
                        <div className="flex items-center gap-2 bg-black/30 w-fit px-3 py-1.5 rounded-full border border-white/10">
                            <Users className="w-4 h-4 text-indigo-400" />
                            <span className="font-bold text-sm text-white">{teamCount} / {maxSlots} Pets im Team</span>
                        </div>
                    </div>
                    <Shield className="w-16 h-16 text-indigo-400 opacity-80 group-hover:scale-110 transition-transform" />
                </div>
            </button>

            {/* Rangliste Button */}
            <button onClick={onLeaderboard} className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-3xl p-1 shadow-lg shadow-yellow-500/20 relative overflow-hidden group text-left hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                 <div className="bg-slate-900/80 backdrop-blur-sm rounded-[22px] p-6 relative z-10 flex items-center justify-between border border-white/10">
                    <div>
                        <h2 className="text-xl font-black text-white mb-1">Rangliste</h2>
                        <p className="text-yellow-200 font-bold text-sm">Sieh dir die besten Spieler an!</p>
                    </div>
                     <Trophy className="w-16 h-16 text-yellow-400 opacity-80 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                </div>
            </button>
        </div>
    </div>
  );
}