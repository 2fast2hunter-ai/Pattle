import React from 'react';
import { ArrowLeft, Trophy, CheckCircle, Lock, Coins, Gem, Star } from 'lucide-react';
import { MILESTONES, RESOURCES } from '../data/gameData';

export default function VillageMilestonesScreen({ user, onBack, onClaim }) {
    const itemStats = user.village.stats?.totalItemsCollected || {};
    const timeStats = user.village.stats?.totalIdleTime || 0;
    const claimed = user.village.milestones || {};

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            <div className="relative flex items-center justify-center mb-4 pt-2 px-4 shrink-0 z-10">
                <h2 className="text-2xl font-black italic tracking-wide text-white">MEILENSTEINE</h2>
                <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"><ArrowLeft className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-4">
                {MILESTONES.map(milestone => {
                    // Unterschiedliche Stats je nach Typ
                    let current = 0;
                    let displayCurrent = 0;
                    let displayTarget = milestone.target;
                    let labelSuffix = "";

                    if (milestone.type === 'TIME') {
                        current = timeStats;
                        // Umrechnung in Stunden für Anzeige
                        displayCurrent = (current / 3600).toFixed(1);
                        displayTarget = (milestone.target / 3600).toFixed(1);
                        labelSuffix = "Std.";
                    } else {
                        current = itemStats[milestone.itemId] || 0;
                        displayCurrent = Math.floor(current);
                        // Optional: Resource Name anhängen
                        const resInfo = RESOURCES[milestone.resourceId?.toUpperCase()];
                        // labelSuffix = resInfo ? resInfo.label : "";
                    }

                    const isCompleted = current >= milestone.target;
                    const isClaimed = claimed[milestone.id];
                    const progressPercent = Math.min(100, (current / milestone.target) * 100);

                    return (
                        <div key={milestone.id} className={`relative p-4 rounded-2xl border ${isCompleted ? 'bg-slate-800 border-yellow-500/30' : 'bg-slate-900 border-white/5'} overflow-hidden`}>
                            <div className="flex justify-between items-center mb-2 relative z-10">
                                <h3 className={`font-black text-sm uppercase ${isCompleted ? 'text-yellow-400' : 'text-slate-400'}`}>{milestone.label}</h3>
                                {isClaimed ? (
                                    <span className="text-green-500 flex items-center gap-1 text-xs font-bold"><CheckCircle className="w-4 h-4" /> Erledigt</span>
                                ) : (
                                    <span className="text-xs font-mono text-slate-500">{displayCurrent} / {displayTarget} {labelSuffix}</span>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-3 border border-white/5 relative z-10">
                                <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500" style={{width: `${progressPercent}%`}}></div>
                            </div>

                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg border border-white/5">
                                    {milestone.reward.type === 'COINS' && <Coins className="w-3 h-3 text-yellow-400" />}
                                    {milestone.reward.type === 'GEMS' && <Gem className="w-3 h-3 text-pink-400" />}
                                    {milestone.reward.type === 'VILLAGE_XP' && <Star className="w-3 h-3 text-indigo-400" />}
                                    <span className="text-xs font-bold text-white">{milestone.reward.amount}</span>
                                </div>
                                
                                {!isClaimed && (
                                    <button 
                                        onClick={() => onClaim(milestone.id)}
                                        disabled={!isCompleted}
                                        className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${isCompleted ? 'bg-yellow-500 text-black hover:scale-105 shadow-lg shadow-yellow-900/20 cursor-pointer' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                                    >
                                        {isCompleted ? 'ABHOLEN' : 'LOCKED'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}