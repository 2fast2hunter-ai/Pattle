import React from 'react';
import { Trophy, Gift, CheckCircle2, Loader2 } from 'lucide-react';
import RewardBadge from './RewardBadge';

export default function QuestCompositeReward({
    compositeReward, activeTab, t, isCompositeReady,
    progressPercent, completedCount, totalQuests,
    claimedComposite, handleClaimComposite, claimingComposite
}) {
    if (!compositeReward) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="bg-slate-900 rounded-[14px] p-4 relative">

                <div className="flex justify-between items-center mb-3">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400" /> {t ? t('quest_bonus_' + activeTab) : compositeReward.label}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-bold">
                            {t ? t('quest_bonus_desc') : 'Complete all tasks for the bonus!'}
                        </p>
                    </div>
                    <div className="scale-90 origin-right">
                        <RewardBadge
                            type={compositeReward.rewardType}
                            amount={compositeReward.rewardAmount}
                            label={compositeReward.rewardType === 'LOOTBOX' ? (t ? t('shop_elemental_chest') : 'Elementar-Truhe') : null}
                            t={t}
                        />
                    </div>
                </div>

                {/* Progress */}
                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden mb-3 border border-white/10 shadow-inner">
                    <div
                        className={`h-full transition-all duration-700 ease-out ${isCompositeReady ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{completedCount} / {totalQuests} {t ? t('quests_progress_done') : 'FERTIG'}</span>

                    {claimedComposite ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs font-black uppercase bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20">
                            <CheckCircle2 className="w-3 h-3" /> {t ? t('shop_claimed') : 'Eingesammelt'}
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
                            {claimingComposite ? <Loader2 className="w-3 h-3 animate-spin" /> : (isCompositeReady ? <><Gift className="w-3 h-3" /> {t ? t('quests_claim_btn') : 'ABHOLEN'}</> : 'LOCKED')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
