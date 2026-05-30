import React from 'react';
import { ArrowLeft, CheckCircle, Coins, Gem, Star, RefreshCw, FlaskConical } from 'lucide-react';
import { MILESTONES, RESOURCES, CONSUMABLES } from '../data/gameData';

export default function VillageMilestonesScreen({ user, onBack, onClaim, t }) { // t prop added
    const itemStats = user.village.stats?.totalItemsCollected || {};
    const timeStats = user.village.stats?.totalIdleTime || 0;
    const milestoneLevels = user.village.milestones || {};

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            <div className="relative flex items-center justify-center mb-4 pt-2 px-4 shrink-0 z-10">
                <h2 className="text-2xl font-black italic tracking-wide text-white">{t ? t('village_milestones_title') : 'MILESTONES'}</h2>
                <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"><ArrowLeft className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-4">
                {MILESTONES.map(milestone => {
                    const currentLevel = milestoneLevels[milestone.id] || 0;
                    let totalCollected = 0;
                    
                    if (milestone.type === 'TIME') {
                        totalCollected = timeStats;
                    } else {
                        totalCollected = itemStats[milestone.itemId] || 0;
                    }

                    const previousTarget = milestone.target * currentLevel;
                    const nextTarget = milestone.target * (currentLevel + 1);
                    
                    const progressInCurrentLevel = totalCollected - previousTarget;
                    const isCompleted = totalCollected >= nextTarget;
                    
                    const displayProgress = Math.min(milestone.target, progressInCurrentLevel);
                    const progressPercent = Math.min(100, (displayProgress / milestone.target) * 100);

                    let displayValue = Math.floor(displayProgress);
                    let displayMax = milestone.target;
                    let labelSuffix = "";
                    
                    if (milestone.type === 'TIME') {
                        displayValue = (displayProgress / 3600).toFixed(1);
                        displayMax = (milestone.target / 3600).toFixed(1);
                        labelSuffix = t ? t('milestone_hours') : 'hrs';
                    }

                    // Consumable Info holen
                    const rewardItem = milestone.reward.type === 'CONSUMABLE' ? CONSUMABLES[milestone.reward.variant] : null;
                    
                    // Label übersetzen (wenn es ein Item-Meilenstein ist)
                    const itemName = t ? t('item_' + milestone.itemId) : milestone.label.split(' ').pop();
                    const label = milestone.itemId
                        ? (t ? t('milestone_collect', { count: milestone.target, item: itemName }) : `Collect ${milestone.target}x ${itemName}`)
                        : milestone.label;
                    
                    return (
                        <div key={milestone.id} className={`relative p-4 rounded-2xl border ${isCompleted ? 'bg-slate-800 border-yellow-500/30' : 'bg-slate-900 border-white/5'} overflow-hidden shadow-lg`}>
                            
                            <div className="flex justify-between items-center mb-2 relative z-10">
                                <div>
                                    <h3 className={`font-black text-sm uppercase ${isCompleted ? 'text-yellow-400' : 'text-slate-400'}`}>{label}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{t ? t('milestone_reached', { count: currentLevel }) : `Reached ${currentLevel}x`}</span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-500 font-bold">{displayValue} / {displayMax} {labelSuffix}</span>
                            </div>

                            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden mb-3 border border-white/10 relative z-10">
                                <div className={`h-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-yellow-500 to-amber-500 animate-pulse' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`} style={{width: `${progressPercent}%`}}></div>
                            </div>

                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Belohnung:</span>
                                    
                                    {milestone.reward.type === 'COINS' && <Coins className="w-3.5 h-3.5 text-yellow-400" />}
                                    {milestone.reward.type === 'GEMS' && <Gem className="w-3.5 h-3.5 text-pink-400" />}
                                    {milestone.reward.type === 'VILLAGE_XP' && <Star className="w-3.5 h-3.5 text-indigo-400" />}
                                    
                                    {milestone.reward.type === 'CONSUMABLE' && (
                                        <div className="flex items-center gap-1.5">
                                             <FlaskConical className={`w-3.5 h-3.5 ${rewardItem?.color || 'text-white'}`} />
                                             {/* HIER GEÄNDERT: Voller Name statt S/M/L */}
                                             <span className={`text-[10px] font-bold ${rewardItem?.color || 'text-white'}`}>
                                                 {rewardItem ? (t ? t('item_' + milestone.reward.variant) : rewardItem.label) : milestone.reward.variant}
                                             </span>
                                        </div>
                                    )}

                                    <span className="text-xs font-black text-white">
                                        {milestone.reward.type === 'CONSUMABLE' ? '' : milestone.reward.amount}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => onClaim(milestone.id)}
                                    disabled={!isCompleted}
                                    className={`
                                        px-6 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2
                                        ${isCompleted 
                                            ? 'bg-yellow-500 text-black hover:scale-105 shadow-lg shadow-yellow-500/20 cursor-pointer active:scale-95' 
                                            : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                                        }
                                    `}
                                >
                                    {isCompleted ? (t ? t('quests_claim_btn') : 'CLAIM') : 'COLLECTING...'}
                                    {isCompleted && <RefreshCw className="w-3 h-3" />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}