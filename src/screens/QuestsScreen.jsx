import React, { useState } from 'react';
import { X, Clock, CheckCircle2, Gift, Play, Loader2, Star, Calendar, RefreshCw } from 'lucide-react';
import { claimQuestReward, claimCompositeReward } from '../utils/db';

export default function QuestsScreen({ user, onBack }) {
    const [claiming, setClaiming] = useState(null); 
    const [claimingComposite, setClaimingComposite] = useState(null); 
    const [activeTab, setActiveTab] = useState('daily');

    // --- GUARD CLAUSE ---
    // Verhindert den Absturz, falls user.quests noch nicht geladen ist
    if (!user || !user.quests) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center animate-in fade-in">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Lade Aufgaben...</p>
            </div>
        );
    }

    // Kategorien definieren
    const categories = {
        daily: { id: 'daily', label: 'Täglich', icon: RefreshCw, color: 'text-blue-400', data: user.quests.daily },
        weekly: { id: 'weekly', label: 'Wöchentlich', icon: Calendar, color: 'text-purple-400', data: user.quests.weekly },
        monthly: { id: 'monthly', label: 'Monatlich', icon: Star, color: 'text-amber-400', data: user.quests.monthly },
    };

    const currentCat = categories[activeTab];
    const currentQuestData = currentCat.data;
    
    // Sicherstellen, dass Daten da sind
    const isQuestDataReady = currentQuestData && Array.isArray(currentQuestData.quests);
    
    const timeLeft = currentQuestData ? Math.max(0, currentQuestData.expiresAt - Date.now()) : 0;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursLeft / 24);
    
    // Composite Reward (Fortschrittsbalken oben)
    const totalQuests = currentQuestData?.totalQuests || 5; 
    const completedCount = currentQuestData?.completedCount || 0;
    const claimedComposite = currentQuestData?.claimedComposite || false;
    const progressPercent = Math.min(100, (completedCount / totalQuests) * 100);
    const isCompositeReady = completedCount >= totalQuests && !claimedComposite;
    const compositeReward = currentQuestData?.reward;

    // --- HANDLERS ---
    const handleClaim = async (questId) => {
        setClaiming(questId);
        const result = await claimQuestReward(user, activeTab, questId);
        if (result && result.message) {
            // Optional: Toast Notification statt Alert
            // alert("Belohnung: " + result.message); 
        }
        setClaiming(null);
    };

    const handleClaimComposite = async () => {
        setClaimingComposite(true);
        const result = await claimCompositeReward(user, activeTab);
        if (result && result.message) {
            // alert(result.message); 
        }
        setClaimingComposite(false);
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">
            
            {/* --- HEADER --- */}
            <div className="relative flex items-center justify-center mb-4 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    AUFGABEN
                </h1>
                <button 
                    onClick={onBack} 
                    className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* --- TABS --- */}
            <div className="px-4 mb-4">
                <div className="flex p-1 bg-slate-800 rounded-xl border border-white/5">
                    {Object.values(categories).map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveTab(cat.id)} 
                            className={`
                                flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5
                                ${activeTab === cat.id ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}
                            `}
                        >
                            <cat.icon className={`w-3 h-3 ${activeTab === cat.id ? cat.color : 'text-slate-600'}`} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-4">
                
                {/* TIMER & INFO */}
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 bg-slate-900/50 py-1.5 rounded-lg border border-white/5 mx-8">
                    <Clock className="w-3 h-3" />
                    <span>
                        Neue Aufgaben in: <span className="text-white">{daysLeft > 0 ? `${daysLeft} Tagen` : `${hoursLeft} Stunden`}</span>
                    </span>
                </div>

                {/* COMPOSITE REWARD CARD */}
                {compositeReward && (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 bg-white/5 rounded-full blur-2xl -mr-4 -mt-4 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-center mb-2 relative z-10">
                            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                                {compositeReward.label}
                            </h3>
                            <Gift className={`w-5 h-5 ${isCompositeReady ? 'text-yellow-400 animate-bounce' : 'text-slate-600'}`} />
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-4 bg-slate-950 rounded-full overflow-hidden mb-3 border border-white/5">
                            <div 
                                className={`h-full transition-all duration-700 ease-out flex items-center justify-end pr-1 ${isCompositeReady ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 'bg-gradient-to-r from-indigo-600 to-blue-500'}`} 
                                style={{width: `${progressPercent}%`}}
                            >
                                {progressPercent > 10 && <span className="text-[8px] font-black text-black/50">{Math.floor(progressPercent)}%</span>}
                            </div>
                        </div>

                        <div className="flex justify-between items-center relative z-10">
                            <span className="text-xs text-slate-400 font-bold">{completedCount} / {totalQuests} Erledigt</span>
                            
                            {claimedComposite ? (
                                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-black border border-green-500/20 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Abgeholt
                                </span>
                            ) : isCompositeReady ? (
                                <button
                                    onClick={() => handleClaimComposite()}
                                    disabled={claimingComposite}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full active:scale-95 transition-all shadow-lg shadow-yellow-900/20 flex items-center gap-2"
                                >
                                    {claimingComposite ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Gift className="w-3 h-3" /> ABHOLEN</>}
                                </button>
                            ) : (
                                <span className="text-xs text-slate-500 font-mono bg-black/30 px-2 py-1 rounded border border-white/5">
                                    {compositeReward.rewardAmount} {compositeReward.rewardType.includes('EGG') ? 'Ei' : compositeReward.rewardType}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* QUEST LISTE */}
                <div className="space-y-3">
                    {!isQuestDataReady ? (
                        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-slate-600" /></div>
                    ) : (
                        currentQuestData.quests.map(quest => {
                            const isComplete = quest.progress >= quest.target;
                            const percent = Math.min(100, (quest.progress / quest.target) * 100);

                            return (
                                <div key={quest.id} className={`bg-slate-800/50 backdrop-blur-sm p-3 rounded-2xl border ${isComplete ? 'border-green-500/30' : 'border-white/5'} relative overflow-hidden group transition-all hover:bg-slate-800`}>
                                    
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <div className="flex-1">
                                            <h3 className={`font-bold text-xs mb-1 ${quest.claimed ? 'text-slate-500 line-through' : 'text-white'}`}>{quest.label}</h3>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                    <div className={`h-full ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`} style={{width: `${percent}%`}}></div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono">{quest.progress}/{quest.target}</span>
                                            </div>
                                        </div>

                                        {/* Belohnung Badge */}
                                        <div className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase flex items-center gap-1 ${quest.claimed ? 'bg-slate-900 text-slate-600 border-transparent' : 'bg-black/30 text-yellow-400 border-yellow-500/20'}`}>
                                            {quest.rewardType === 'COINS' && '🪙'}
                                            {quest.rewardType === 'GEMS' && '💎'}
                                            {quest.rewardType === 'XP' && '✨'}
                                            {quest.rewardType.includes('EGG') && '🥚'}
                                            {quest.rewardAmount}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-2">
                                        {quest.claimed ? (
                                            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-900/50 py-1.5 rounded-lg">
                                                <CheckCircle2 className="w-3 h-3" /> ERLEDIGT
                                            </div>
                                        ) : isComplete ? (
                                            <button 
                                                onClick={() => handleClaim(quest.id)} 
                                                disabled={claiming === quest.id}
                                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 animate-pulse shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                                            >
                                                {claiming === quest.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>ABHOLEN</>}
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-800/50 py-1.5 rounded-lg border border-white/5">
                                                <Play className="w-3 h-3" /> OFFEN
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}