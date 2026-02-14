import React from 'react';
import { X, Clock, Loader2 } from 'lucide-react';
import { useQuests } from '../hooks/useQuests';
import QuestCompositeReward from '../components/quests/QuestCompositeReward';
import QuestItem from '../components/quests/QuestItem';

export default function QuestsScreen({ user, onBack, t }) {
    const {
        activeTab, setActiveTab,
        claiming, claimingComposite,
        categories, currentQuestData, isQuestDataReady,
        hoursLeft, daysLeft,
        totalQuests, completedCount, claimedComposite, progressPercent, isCompositeReady,
        compositeReward, displayXp,
        handleClaim, handleClaimComposite
    } = useQuests(user, t);

    // Guard Clause
    if (!user || !user.quests) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center animate-in fade-in">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Lade Aufgaben...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">

            {/* --- HEADER --- */}
            <div className="relative flex items-center justify-center mb-4 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    {t ? t('quests_title') : 'AUFGABEN'}
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
                <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/10 backdrop-blur-sm">
                    {Object.values(categories).map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`
                                flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
                                ${activeTab === cat.id ? 'bg-slate-800 text-white shadow-md border border-white/10' : 'text-slate-500 hover:text-slate-300'}
                            `}
                        >
                            <cat.icon className={`w-3.5 h-3.5 ${activeTab === cat.id ? cat.color : 'text-slate-600'}`} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-5">

                {/* TIMER */}
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900/30 py-2 rounded-lg border border-white/5 mx-8">
                    <Clock className="w-3 h-3" />
                    <span>
                        {t ? t('quests_reset') : 'Reset in'}: <span className="text-white">{daysLeft > 0 ? `${daysLeft} d` : `${hoursLeft} h`}</span>
                    </span>
                </div>

                {/* COMPOSITE REWARD CARD */}
                <QuestCompositeReward
                    compositeReward={compositeReward}
                    activeTab={activeTab}
                    t={t}
                    isCompositeReady={isCompositeReady}
                    progressPercent={progressPercent}
                    completedCount={completedCount}
                    totalQuests={totalQuests}
                    claimedComposite={claimedComposite}
                    handleClaimComposite={handleClaimComposite}
                    claimingComposite={claimingComposite}
                />

                {/* QUEST LISTE */}
                <div className="space-y-3">
                    {!isQuestDataReady ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 opacity-50" />
                            <span className="text-xs font-bold">Daten werden synchronisiert...</span>
                        </div>
                    ) : (
                        currentQuestData.quests.map(quest => (
                            <QuestItem
                                key={quest.id}
                                quest={quest}
                                handleClaim={handleClaim}
                                claiming={claiming}
                                displayXp={displayXp}
                                t={t}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
