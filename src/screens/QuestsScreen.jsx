import React, { useState } from 'react';
import { X, Clock, CheckCircle2, Gift, Play, Loader2, Star, Calendar, RefreshCw, Coins, Gem, Sparkles, Egg, Trophy, Info, Package } from 'lucide-react';
import { claimQuestReward, claimCompositeReward } from '../utils/db';
import { RARITIES, TYPES, COMPOSITE_QUEST_REWARDS } from '../data/gameData';

// Hilfskomponente für schöne Belohnungs-Badges
const RewardBadge = ({ type, amount, label: customLabel }) => {
    let Icon = Sparkles;
    let color = 'text-slate-400';
    let bg = 'bg-slate-800';
    let label = type;

    if (type === 'COINS') {
        Icon = Coins;
        color = 'text-yellow-400';
        bg = 'bg-yellow-500/10 border border-yellow-500/20';
        label = 'Münzen';
    } else if (type === 'GEMS') {
        Icon = Gem;
        color = 'text-pink-400';
        bg = 'bg-pink-500/10 border border-pink-500/20';
        label = 'Edelsteine';
    } else if (type === 'XP') {
        Icon = Sparkles;
        color = 'text-green-400';
        bg = 'bg-green-500/10 border border-green-500/20';
        label = 'XP';
    } else if (type && type.includes('EGG')) {
        Icon = Egg;
        const rarityStr = type.split('_')[1] || 'COMMON';
        const rarity = RARITIES[rarityStr] || RARITIES.COMMON;
        color = rarity.color;
        bg = `bg-slate-800 border ${rarity.border}`;
        label = `${rarity.label} Ei`;
    } else if (type === 'LOOTBOX') {
        Icon = Package;
        color = 'text-amber-400';
        bg = 'bg-amber-500/10 border border-amber-500/20';
        label = customLabel || 'Truhe';
    }

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${bg} shadow-sm`}>
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            <span className={`text-[10px] font-black ${color} uppercase tracking-wide`}>+{amount} {label}</span>
        </div>
    );
};

export default function QuestsScreen({ user, onBack }) {
    const [claiming, setClaiming] = useState(null); 
    const [claimingComposite, setClaimingComposite] = useState(false); 
    const [activeTab, setActiveTab] = useState('daily');

    // Guard Clause
    if (!user || !user.quests) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center animate-in fade-in">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Lade Aufgaben...</p>
            </div>
        );
    }

    const categories = {
        daily: { id: 'daily', label: 'Täglich', icon: RefreshCw, color: 'text-blue-400', data: user.quests.daily },
        weekly: { id: 'weekly', label: 'Wöchentlich', icon: Calendar, color: 'text-purple-400', data: user.quests.weekly },
        monthly: { id: 'monthly', label: 'Monatlich', icon: Star, color: 'text-amber-400', data: user.quests.monthly },
    };

    const currentCat = categories[activeTab];
    const currentQuestData = currentCat.data;
    const isQuestDataReady = currentQuestData && Array.isArray(currentQuestData.quests);
    
    const timeLeft = currentQuestData ? Math.max(0, currentQuestData.expiresAt - Date.now()) : 0;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursLeft / 24);
    
    const totalQuests = currentQuestData?.totalQuests || 5; 
    const completedCount = currentQuestData?.completedCount || 0;
    const claimedComposite = currentQuestData?.claimedComposite || false;
    const progressPercent = Math.min(100, (completedCount / totalQuests) * 100);
    const isCompositeReady = completedCount >= totalQuests && !claimedComposite;
    
    // --- VISUAL OVERRIDE: Neue Belohnungen sofort anzeigen ---
    // Wir nutzen die neuen Definitionen aus COMPOSITE_QUEST_REWARDS basierend auf dem Tab
    const compositeReward = COMPOSITE_QUEST_REWARDS[activeTab.toUpperCase()];
    
    // Fixe XP Werte für die Anzeige
    const fixedXpRewards = { daily: 500, weekly: 1000, monthly: 5000 };
    const displayXp = fixedXpRewards[activeTab];
    // ---------------------------------------------------------

    const handleClaim = async (questId) => {
        setClaiming(questId);
        await claimQuestReward(user, activeTab, questId);
        setClaiming(null);
    };

    const handleClaimComposite = async () => {
        setClaimingComposite(true);
        await claimCompositeReward(user, activeTab);
        setClaimingComposite(false);
    }

    // --- NEU: GENERIERT BESCHREIBUNGSTEXT ---
    const getQuestDescription = (quest) => {
        const { type, target } = quest;
        
        if (type === 'WIN_PVP') return `Gewinne ${target} Kämpfe in der Arena.`;
        if (type === 'HATCH_EGG') return `Brüte ${target} Eier in der Brutstätte aus.`;
        if (type === 'BREED_PET') return `Züchte ${target} neue Pets im Labor.`;
        if (type === 'SPEND_COINS') return `Gib insgesamt ${target} Münzen aus.`;
        if (type === 'EARN_XP') return `Sammle ${target} Erfahrungspunkte.`;
        if (type === 'LEVEL_UP_PET') return `Level deine Pets ${target} mal auf.`;
        
        // Spezifische Element-Wins
        if (type.startsWith('WIN_')) {
            const element = type.split('_')[1];
            const typeLabel = TYPES[element]?.label || element;
            return `Gewinne ${target}x mit einem ${typeLabel}-Pet im Team.`;
        }

        // Spezifische Zucht
        if (type.startsWith('BREED_')) {
            const element = type.split('_')[1];
            const typeLabel = TYPES[element]?.label || element;
            return `Züchte ${target} Pets vom Typ ${typeLabel}.`;
        }

        // Spezifisches Brüten (Element oder Rarity)
        if (type.startsWith('HATCH_')) {
            const suffix = type.split('_')[1];
            // Check ob Rarity oder Type
            const rarityLabel = RARITIES[suffix]?.label;
            const typeLabel = TYPES[suffix]?.label;

            if (rarityLabel) return `Brüte ${target} Eier der Seltenheit "${rarityLabel}".`;
            if (typeLabel) return `Brüte ${target} Eier vom Typ ${typeLabel}.`;
            return `Brüte ${target} spezielle Eier aus.`;
        }

        return `Erfülle das Ziel ${target} mal.`;
    };

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
                        Reset in: <span className="text-white">{daysLeft > 0 ? `${daysLeft} Tagen` : `${hoursLeft} Stunden`}</span>
                    </span>
                </div>

                {/* COMPOSITE REWARD CARD */}
                {compositeReward && (
                    <div className="relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <div className="bg-slate-900 rounded-[14px] p-4 relative">
                            
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-yellow-400" /> {compositeReward.label}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5 font-bold">
                                        Erledige alle Aufgaben für den Bonus!
                                    </p>
                                </div>
                                <div className="scale-90 origin-right">
                                    <RewardBadge type={compositeReward.rewardType} amount={compositeReward.rewardAmount} label={compositeReward.rewardType === 'LOOTBOX' ? 'Elementar-Truhe' : null} />
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden mb-3 border border-white/10 shadow-inner">
                                <div 
                                    className={`h-full transition-all duration-700 ease-out ${isCompositeReady ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} 
                                    style={{width: `${progressPercent}%`}}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center relative z-10">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{completedCount} / {totalQuests} FERTIG</span>
                                
                                {claimedComposite ? (
                                    <span className="flex items-center gap-1 text-green-400 text-xs font-black uppercase bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20">
                                        <CheckCircle2 className="w-3 h-3" /> Eingesammelt
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleClaimComposite()}
                                        disabled={!isCompositeReady || claimingComposite}
                                        className={`
                                            px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all
                                            ${isCompositeReady 
                                                ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 active:scale-95' 
                                                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'}
                                        `}
                                    >
                                        {claimingComposite ? <Loader2 className="w-3 h-3 animate-spin" /> : (isCompositeReady ? <><Gift className="w-3 h-3" /> ABHOLEN</> : 'LOCKED')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* QUEST LISTE */}
                <div className="space-y-3">
                    {!isQuestDataReady ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 opacity-50" />
                            <span className="text-xs font-bold">Daten werden synchronisiert...</span>
                        </div>
                    ) : (
                        currentQuestData.quests.map(quest => {
                            const isComplete = quest.progress >= quest.target;
                            const percent = Math.min(100, (quest.progress / quest.target) * 100);

                            return (
                                <div key={quest.id} className={`bg-slate-800 p-3 rounded-xl border ${isComplete ? 'border-green-500/30 bg-green-900/10' : 'border-white/5'} relative transition-all`}>
                                    
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 pr-2">
                                            <h3 className={`text-sm font-bold mb-1 ${quest.claimed ? 'text-slate-500 line-through' : 'text-white'}`}>{quest.label}</h3>
                                            
                                            {/* Progress Bar */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                    <div className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${percent}%`}}></div>
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400">{quest.progress}/{quest.target}</span>
                                            </div>

                                            {/* NEU: BESCHREIBUNGSTEXT UNTER DEM BALKEN */}
                                            <p className="text-[10px] text-slate-400 leading-tight flex items-center gap-1">
                                                <Info className="w-3 h-3 inline opacity-50" />
                                                {getQuestDescription(quest)}
                                            </p>

                                        </div>

                                        {/* Belohnung (Rechts) */}
                                        <div className="shrink-0">
                                            <RewardBadge type="XP" amount={displayXp} />
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="flex justify-end pt-2 border-t border-white/5 mt-2">
                                        {quest.claimed ? (
                                            <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 uppercase tracking-wider">
                                                <CheckCircle2 className="w-3 h-3" /> Fertig
                                            </span>
                                        ) : isComplete ? (
                                            <button 
                                                onClick={() => handleClaim(quest.id)} 
                                                disabled={claiming === quest.id}
                                                className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase py-1.5 px-4 rounded-lg shadow-md shadow-green-900/20 active:scale-95 transition-all flex items-center gap-1.5 animate-pulse"
                                            >
                                                {claiming === quest.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Gift className="w-3 h-3" /> BELOHNUNG</>}
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider bg-slate-900/50 px-2 py-1 rounded">
                                                <Play className="w-2.5 h-2.5" /> In Arbeit
                                            </span>
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