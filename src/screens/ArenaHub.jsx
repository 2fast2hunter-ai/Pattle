import React from 'react';
import { ArrowLeft, Swords, Users, Trophy, Crown, Shield, Flame, ChevronRight, X } from 'lucide-react';
import { getUnlockedTeamSlots } from '../utils/gameMechanics';

export default function ArenaHub({ onBack, onBattle, onTeam, onLeaderboard, user }) {
  
  // Rank & Team Infos
  const rank = user?.rating || 1000;
  const teamCount = user?.team?.filter(Boolean).length || 0;
  const unlockedSlots = getUnlockedTeamSlots(user?.level || 1);

  // Helper für moderne Kacheln
  const HubTile = ({ title, subtitle, icon: Icon, colorFrom, colorTo, iconColor, onClick, extraInfo }) => (
      <button 
          onClick={onClick} 
          className={`
              relative group w-full p-0.5 rounded-[24px] shadow-lg
              bg-gradient-to-br ${colorFrom} ${colorTo}
              transform transition-all duration-200 hover:scale-[1.02] active:scale-95 text-left h-36
          `}
      >
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-[22px] p-5 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Hintergrund Deko */}
              <div className={`absolute -right-4 -bottom-4 text-${iconColor.split('-')[1]}-500/10 group-hover:text-${iconColor.split('-')[1]}-500/20 transition-colors`}>
                  <Icon className="w-24 h-24" />
              </div>

              <div className="flex justify-between items-start relative z-10">
                  <div className={`w-12 h-12 bg-${iconColor.split('-')[1]}-500/20 rounded-2xl flex items-center justify-center ${iconColor} shadow-inner border border-white/5`}>
                      <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Extra Info Badge */}
                  {extraInfo && (
                      <div className="bg-slate-800 px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-black text-white shadow-sm">
                          {extraInfo}
                      </div>
                  )}
              </div>
              
              <div className="relative z-10">
                  <h4 className="font-black text-white text-lg leading-none mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                      {title}
                  </h4>
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-white transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{subtitle}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </div>
              </div>
          </div>
      </button>
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative overflow-hidden bg-slate-950">
      
      {/* Hintergrund Effekte */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-red-900/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-orange-900/20 blur-[80px] rounded-full pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="relative flex items-center justify-between mb-6 pt-2 px-4 shrink-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-sm">
                ARENA
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs font-bold text-slate-400">{rank} Elo</span>
             </div>
          </div>
          
          <button 
            onClick={onBack} 
            className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-red-500/30 backdrop-blur-md"
          >
              <X className="w-5 h-5" />
          </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-4 z-10">

          {/* --- MAIN BATTLE CARD --- */}
          <button 
              onClick={onBattle} 
              className="w-full relative h-64 rounded-[32px] overflow-hidden group shadow-2xl shadow-red-900/20 transition-transform hover:scale-[1.02] active:scale-95 border border-white/5"
          >
            {/* Animierter Hintergrund */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-700"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            
            {/* Interaktive Elemente */}
            <div className="absolute -right-8 -bottom-8 text-red-900/30 group-hover:text-white/10 transition-colors rotate-12 duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Swords className="w-72 h-72" />
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                    <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-lg">
                        <span className="text-[10px] font-bold text-red-100 uppercase tracking-widest flex items-center gap-1.5">
                            <Flame className="w-3 h-3 fill-current animate-pulse" /> PvP Zone
                        </span>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-5xl font-black italic text-white mb-2 drop-shadow-xl uppercase tracking-tighter">Kämpfen</h3>
                    <p className="text-red-100/90 text-sm font-bold max-w-[200px] leading-tight">Fordere Gegner heraus und erklimme die Rangliste!</p>
                </div>
                
                {/* Button removed as requested */}
            </div>
          </button>
          
          {/* --- GRID FÜR TEAM & RANKING --- */}
          <div className="grid grid-cols-2 gap-4">
              
              <HubTile 
                  title="Team" 
                  subtitle="Verwalten" 
                  icon={Shield} 
                  colorFrom="from-slate-700" 
                  colorTo="to-slate-800" 
                  iconColor="text-indigo-400"
                  onClick={onTeam}
                  extraInfo={`${teamCount} / ${unlockedSlots}`}
              />

              <HubTile 
                  title="Rangliste" 
                  subtitle="Top Spieler" 
                  icon={Crown} 
                  colorFrom="from-slate-700" 
                  colorTo="to-slate-800" 
                  iconColor="text-yellow-400"
                  onClick={onLeaderboard}
              />

          </div>

      </div>
    </div>
  );
}