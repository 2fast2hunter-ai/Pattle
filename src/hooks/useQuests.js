import { useState } from 'react';
import { claimQuestReward, claimCompositeReward, trackQuestProgress } from '../utils/db';
import { COMPOSITE_QUEST_REWARDS } from '../data/gameData';
import { RefreshCw, Calendar, Star } from 'lucide-react';
import { trackQuestCompleted } from '../utils/analytics';

export function useQuests(user, t) {
    const [claiming, setClaiming] = useState(null);
    const [claimingComposite, setClaimingComposite] = useState(false);
    const [activeTab, setActiveTab] = useState('daily');

    const categories = {
        daily: { id: 'daily', label: t ? t('quests_tab_daily') : 'Täglich', icon: RefreshCw, color: 'text-blue-400', data: user?.quests?.daily },
        weekly: { id: 'weekly', label: t ? t('quests_tab_weekly') : 'Wöchentlich', icon: Calendar, color: 'text-purple-400', data: user?.quests?.weekly },
        monthly: { id: 'monthly', label: t ? t('quests_tab_monthly') : 'Monatlich', icon: Star, color: 'text-amber-400', data: user?.quests?.monthly },
    };

    const currentCat = categories[activeTab];
    const currentQuestData = currentCat?.data;
    const isQuestDataReady = currentQuestData && Array.isArray(currentQuestData.quests);

    const timeLeft = currentQuestData ? Math.max(0, currentQuestData.expiresAt - Date.now()) : 0;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursLeft / 24);

    const totalQuests = currentQuestData?.totalQuests || 5;
    const completedCount = currentQuestData?.completedCount || 0;
    const claimedComposite = currentQuestData?.claimedComposite || false;
    const progressPercent = Math.min(100, (completedCount / totalQuests) * 100);
    const isCompositeReady = completedCount >= totalQuests && !claimedComposite;

    const compositeReward = COMPOSITE_QUEST_REWARDS[activeTab.toUpperCase()];

    const fixedXpRewards = { daily: 500, weekly: 1000, monthly: 5000 };
    const displayXp = fixedXpRewards[activeTab];

    const handleClaim = async (questId) => {
        setClaiming(questId);
        await claimQuestReward(user, activeTab, questId);
        trackQuestCompleted(activeTab, questId);
        setClaiming(null);
    };

    const handleClaimComposite = async () => {
        setClaimingComposite(true);
        await claimCompositeReward(user, activeTab);

        if (activeTab === 'daily') {
            await trackQuestProgress(user, 'COMPLETE_DAILY_SET', 1);
        }
        setClaimingComposite(false);
    }

    return {
        activeTab, setActiveTab,
        claiming, claimingComposite,
        categories, currentCat, currentQuestData, isQuestDataReady,
        timeLeft, hoursLeft, daysLeft,
        totalQuests, completedCount, claimedComposite, progressPercent, isCompositeReady,
        compositeReward, displayXp,
        handleClaim, handleClaimComposite
    };
}
