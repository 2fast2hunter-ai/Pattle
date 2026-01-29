import React, { useState } from 'react';
import { ArrowLeft, Swords, Users, Trophy, Crown, Shield, Flame, ChevronRight, X, Zap, Minus, Plus, Play, Castle } from 'lucide-react';
import { getUnlockedTeamSlots } from '../utils/gameMechanics';
import { PageBackground } from '../components/GameLayout';

export default function ArenaHub({ onBack, onBattle, onTeam, onLeaderboard, user, onAutoBattle, onTower }) {
  
  const rank = user?.rating || 1000;
  const teamCount = user?.team?.filter(Boolean).length || 0;
  const unlockedSlots = getUnlockedTeamSlots(user?.level || 1);
  const ticketCount = user?.adTickets || 0;

  // State für die gewünschte Ticket-Anzahl
  const [ticketsToUse, setTicketsToUse] = useState(1);

  const incrementTickets = (e) => {
      e.stopPropagation();
      if (ticketsToUse < ticketCount) setTicketsToUse(prev => prev + 1);
  };

  const decrementTickets = (e) => {
      e.stopPropagation();
      if (ticketsToUse > 1) setTicketsToUse(prev => prev - 1);
  };

  // Helper für moderne Kacheln
  const HubTile = ({ title, subtitle, icon: Icon, colorFrom, colorTo, iconColor, onClick, extraInfo, delay }) => (
      <button 
          onClick={onClick} 
          style={{ animationDelay: `${delay}ms` }}
          className={`
              relative group w-full p-0.5 rounded-[24px] shadow-lg
              bg-gradient-to-br ${colorFrom} ${colorTo}
              transform transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left h-32 sm:h-36 animate-in slide-in-from-bottom-8 fade-in fill-mode-backwards overflow-hidden
          `}
      >
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-[22px] p-4 sm:p-5 h-full flex flex-col justify-between relative overflow-hidden group-hover:bg-slate-900/70 transition-colors">
              
              <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>

              <div className={`absolute -right-4 -bottom-4 text-${iconColor.split('-')[1]}-500/10 group-hover:text-${iconColor.split('-')[1]}-500/20 transition-colors group-hover:scale-110 duration-500`}>
                  <Icon className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              <div className="flex justify-between items-start relative z-10">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${iconColor.split('-')[1]}-500/20 rounded-2xl flex items-center justify-center ${iconColor} shadow-inner border border-white/5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  
                  {extraInfo && (
                      <div className="bg-slate-800 px-2 sm:px-2.5 py-1 rounded-lg border border-white/10 text-[9px] sm:text-[10px] font-black text-white shadow-sm">
                          {extraInfo}
                      </div>
                  )}
              </div>
              
              <div className="relative z-10">
                  <h4 className="font-black text-white text-base sm:text-lg leading-none mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                      {title}
                  </h4>
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-white transition-colors">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{subtitle}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </div>
              </div>
          </div>
      </button>
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative overflow-hidden">
      <PageBackground />

      <div className="relative flex items-center justify-between mb-4 sm:mb-6 pt-2 px-4 shrink-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-sm">
                ARENA
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
                  <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500" />
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

          <button 
              onClick={onBattle} 
              className="w-full relative h-56 sm:h-64 rounded-[32px] overflow-hidden group shadow-2xl shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-white/5 animate-in fade-in zoom-in-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-700"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="absolute -right-8 -bottom-8 text-red-900/30 group-hover:text-white/10 transition-colors rotate-12 duration-500 group-hover:rotate-0 group-hover:scale-110">
                <Swords className="w-64 h-64 sm:w-72 sm:h-72" />
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
                <div className="flex justify-between items-start">
                    <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-lg animate-pulse-slow">
                        <span className="text-[9px] sm:text-[10px] font-bold text-red-100 uppercase tracking-widest flex items-center gap-1.5">
                            <Flame className="w-3 h-3 fill-current animate-pulse" /> PvP Zone
                        </span>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-4xl sm:text-5xl font-black italic text-white mb-2 drop-shadow-xl uppercase tracking-tighter group-hover:text-glow transition-all">Kämpfen</h3>
                    <p className="text-red-100/90 text-xs sm:text-sm font-bold max-w-[200px] leading-tight">Fordere Gegner heraus und erklimme die Rangliste!</p>
                </div>
            </div>
          </button>
          
          {/* NEU: AUTO BATTLE CONFIG CARD */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-4 flex flex-col gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-4 delay-100 fill-mode-backwards relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner border border-purple-500/20">
                          <Zap className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                          <h4 className="font-black text-white text-lg leading-none">Auto-Kampf</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">1 Ticket = 10 Kämpfe</p>
                      </div>
                  </div>
                  
                  {/* Ticket Counter */}
                  <div className="flex flex-col items-end">
                     <div className="bg-black/30 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-1.5 mb-1">
                        <span className={`text-xs font-black ${ticketCount > 0 ? 'text-white' : 'text-red-400'}`}>{ticketCount}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Tickets</span>
                    </div>
                  </div>
              </div>

              <div className="flex gap-2">
                   {/* Menge wählen */}
                   <div className="flex items-center bg-slate-900 rounded-xl border border-white/5 px-2 py-1 gap-3 shrink-0">
                       <button 
                           onClick={decrementTickets} 
                           className={`p-2 rounded-lg transition-colors ${ticketsToUse > 1 ? 'text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'}`}
                       >
                           <Minus className="w-4 h-4" />
                       </button>
                       <span className="font-black text-white w-4 text-center">{ticketsToUse}</span>
                       <button 
                           onClick={incrementTickets} 
                           className={`p-2 rounded-lg transition-colors ${ticketsToUse < ticketCount ? 'text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'}`}
                       >
                           <Plus className="w-4 h-4" />
                       </button>
                   </div>

                   {/* Start Button */}
                   <button 
                        onClick={() => ticketCount >= ticketsToUse && onAutoBattle(ticketsToUse)}
                        disabled={ticketCount < 1}
                        className={`
                            flex-1 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
                            ${ticketCount >= ticketsToUse 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500' 
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }
                        `}
                   >
                       {ticketCount >= 1 ? (
                           <>STARTEN ({ticketsToUse * 10}) <Play className="w-4 h-4 fill-current" /></>
                       ) : (
                           "KEINE TICKETS"
                       )}
                   </button>
              </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <HubTile 
                  title="Battle Tower" 
                  subtitle="PvE Herausforderung" 
                  icon={Castle} 
                  colorFrom="from-indigo-700" 
                  colorTo="to-purple-800" 
                  iconColor="text-indigo-300"
                  onClick={onTower}
                  extraInfo={`Stufe ${user?.towerProgress || 1}`}
                  delay={100}
              />

              <HubTile 
                  title="Team" 
                  subtitle="Verwalten" 
                  icon={Shield} 
                  colorFrom="from-slate-700" 
                  colorTo="to-slate-800" 
                  iconColor="text-indigo-400"
                  onClick={onTeam}
                  extraInfo={`${teamCount} / ${unlockedSlots}`}
                  delay={200}
              />

              <HubTile 
                  title="Rangliste" 
                  subtitle="Top Spieler" 
                  icon={Crown} 
                  colorFrom="from-slate-700" 
                  colorTo="to-slate-800" 
                  iconColor="text-yellow-400"
                  onClick={onLeaderboard}
                  delay={300}
              />
          </div>
      </div>
    </div>
  );
}