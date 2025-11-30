import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2, Gift, Play } from 'lucide-react';
import { claimQuestReward, checkAndResetQuests } from '../utils/db';

export default function QuestsScreen({ user, onBack }) {
    const [activeTab, setActiveTab] = useState('daily');
    const [claiming, setClaiming] = useState(null);

    // Beim Laden prüfen, ob neue Quests generiert werden müssen
    useEffect(() => {
        checkAndResetQuests(user);
    }, [user]);

    const handleClaim = async (questId) => {
        setClaiming(questId);
        const msg = await claimQuestReward(user, activeTab, questId);
        if (msg) {
            alert("Belohnung: " + msg); // Einfaches Feedback, besser wäre showNotification
        }
        setClaiming(null);
    };

    const categories = {
        daily: { label: 'Täglich', data: user?.quests?.daily },
        weekly: { label: 'Wöchentlich', data: user?.quests?.weekly },
        monthly: { label: 'Monatlich', data: user?.quests?.monthly },
    };

    const currentQuestData = categories[activeTab].data;
    const timeLeft = currentQuestData ? Math.max(0, currentQuestData.expiresAt - Date.now()) : 0;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursLeft / 24);

    return (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-black italic text-yellow-400">AUFGABEN</h2>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-800 rounded-xl">
                {Object.keys(categories).map(key => (
                    <button 
                        key={key} 
                        onClick={() => setActiveTab(key)} 
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        {categories[key].label}
                    </button>
                ))}
            </div>

            {/* Timer */}
            <div className="bg-slate-800/50 p-2 rounded-lg text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Clock className="w-3 h-3" /> 
                Resettet in: <span className="text-white font-bold">{daysLeft > 0 ? `${daysLeft} Tagen` : `${hoursLeft} Stunden`}</span>
            </div>

            {/* Quest Liste */}
            <div className="flex-1 overflow-y-auto pb-20 space-y-3">
                {!currentQuestData ? (
                    <div className="text-center text-slate-500 mt-10">Lade Aufgaben...</div>
                ) : (
                    currentQuestData.quests.map(quest => {
                        const isComplete = quest.progress >= quest.target;
                        const percent = Math.min(100, (quest.progress / quest.target) * 100);

                        return (
                            <div key={quest.id} className={`bg-slate-800 p-4 rounded-2xl border-l-4 ${isComplete ? 'border-green-500' : 'border-slate-600'} relative overflow-hidden`}>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div>
                                        <h3 className="font-bold text-sm text-white">{quest.label}</h3>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Fortschritt: <span className={isComplete ? 'text-green-400' : 'text-white'}>{quest.progress}</span> / {quest.target}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase font-bold text-slate-500">Belohnung</div>
                                        <div className="text-yellow-400 font-bold text-xs flex items-center justify-end gap-1">
                                            {quest.rewardType === 'COINS' && '🪙'}
                                            {quest.rewardType === 'GEMS' && '💎'}
                                            {quest.rewardType === 'XP' && '✨'}
                                            {quest.rewardType.includes('EGG') && '🥚'}
                                            {quest.rewardAmount}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3 relative z-10">
                                    <div className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`} style={{width: `${percent}%`}}></div>
                                </div>

                                {/* Action Button */}
                                {quest.claimed ? (
                                    <button disabled className="w-full bg-slate-900/50 text-slate-500 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 cursor-default">
                                        <CheckCircle2 className="w-4 h-4" /> Erledigt
                                    </button>
                                ) : isComplete ? (
                                    <button 
                                        onClick={() => handleClaim(quest.id)} 
                                        disabled={claiming === quest.id}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 animate-bounce shadow-lg shadow-green-900/20"
                                    >
                                        <Gift className="w-4 h-4" /> Belohnung abholen
                                    </button>
                                ) : (
                                    <div className="w-full bg-slate-700/30 text-slate-500 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 cursor-default">
                                        <Play className="w-3 h-3" /> In Arbeit
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}