import React from 'react';
import { CheckCircle2, Gift, Play, Loader2 } from 'lucide-react';
import RewardBadge from './RewardBadge';
import { TYPES, RARITIES } from '../../data/gameData';

export default function QuestItem({ quest, handleClaim, claiming, displayXp, t }) {
    const isComplete = quest.progress >= quest.target;
    const percent = Math.min(100, (quest.progress / quest.target) * 100);

    // Helper for description logic
    const getQuestDescription = (quest) => {
        if (!t) return quest.label;

        const { type, target } = quest;

        if (type === 'WIN_PVP') return t('quest_WIN_PVP', { target });
        if (type === 'HATCH_EGG') return t('quest_HATCH_EGG', { target });
        if (type === 'BREED_PET') return t('quest_BREED_PET', { target });
        if (type === 'SPEND_COINS') return t('quest_SPEND_COINS', { target });
        if (type === 'EARN_XP') return t('quest_EARN_XP', { target });
        if (type === 'LEVEL_UP_PET') return t('quest_LEVEL_UP_PET', { target });
        if (type === 'WATCH_AD') return t('quest_WATCH_AD', { target });
        if (type === 'COMPLETE_DAILY_SET') return t('quest_COMPLETE_DAILY_SET', { target });

        if (type.startsWith('WIN_')) {
            const element = type.split('_')[1];
            const typeKey = `type_${element}`;
            const typeLabel = t(typeKey) !== typeKey ? t(typeKey) : (TYPES[element]?.label || element);
            return t('quest_WIN_ELEMENT', { target, element: typeLabel });
        }

        if (type.startsWith('BREED_')) {
            const element = type.split('_')[1];
            const typeKey = `type_${element}`;
            const typeLabel = t(typeKey) !== typeKey ? t(typeKey) : (TYPES[element]?.label || element);
            return t('quest_BREED_ELEMENT', { target, element: typeLabel });
        }

        if (type.startsWith('HATCH_')) {
            const suffix = type.split('_')[1];
            if (RARITIES[suffix]) return t('quest_HATCH_RARITY', { target, rarity: t('rarity_' + suffix) });
            if (TYPES[suffix]) return t('quest_HATCH_ELEMENT', { target, element: t('type_' + suffix) });
            return t('quest_HATCH_SPECIAL', { target });
        }

        return t('quest_generic', { target });
    };

    return (
        <div className={`bg-slate-800 p-3 rounded-xl border ${isComplete ? 'border-green-500/30 bg-green-900/10' : 'border-white/5'} relative transition-all`}>

            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-2">
                    <h3 className={`text-sm font-bold mb-1 ${quest.claimed ? 'text-slate-500 line-through' : 'text-white'}`}>{getQuestDescription(quest)}</h3>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }}></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{quest.progress}/{quest.target}</span>
                    </div>

                </div>

                {/* Belohnung (Rechts) */}
                <div className="shrink-0">
                    <RewardBadge type="XP" amount={displayXp} t={t} />
                </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-end pt-2 border-t border-white/5 mt-2">
                {quest.claimed ? (
                    <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> {t ? t('quests_completed') : 'Fertig'}
                    </span>
                ) : isComplete ? (
                    <button
                        onClick={() => handleClaim(quest.id)}
                        disabled={claiming === quest.id}
                        className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase py-1.5 px-4 rounded-lg shadow-md shadow-green-900/20 active:scale-95 transition-all flex items-center gap-1.5 animate-pulse"
                    >
                        {claiming === quest.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Gift className="w-3 h-3" /> {t ? t('quests_claim_btn') : 'BELOHNUNG'}</>}
                    </button>
                ) : (
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider bg-slate-900/50 px-2 py-1 rounded">
                        <Play className="w-2.5 h-2.5" /> {t ? t('quests_in_progress') : 'In Arbeit'}
                    </span>
                )}
            </div>

        </div>
    );
}
