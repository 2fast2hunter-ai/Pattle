import { QUEST_TEMPLATES } from '../../data/questData';
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuests = (category) => {
    // UPDATED: Counts auf 5, 10, 15 gesetzt
    const countMap = { DAILY: 5, WEEKLY: 10, MONTHLY: 15 };
    const count = countMap[category] || 5;
    
    const quests = [];
    for (let i = 0; i < count; i++) {
        const template = QUEST_TEMPLATES[randomInt(0, QUEST_TEMPLATES.length - 1)];
        let multiplier = 1;
        if (category === 'WEEKLY') multiplier = 5;
        if (category === 'MONTHLY') multiplier = 20;
        quests.push({ id: `${category}_${Date.now()}_${i}`, type: template.type, label: template.label, target: template.baseAmount * multiplier, progress: 0, rewardType: template.rewardType, rewardAmount: template.rewardBase * multiplier, claimed: false });
    }
    let composite = { rewardType: 'COINS', rewardAmount: 100, label: 'Bonus' };
    if (category === 'DAILY') composite = { rewardType: 'GEMS', rewardAmount: 5, label: 'Tages-Bonus' };
    if (category === 'WEEKLY') composite = { rewardType: 'EGG_EPIC', rewardAmount: 1, label: 'Wochen-Truhe' };
    if (category === 'MONTHLY') composite = { rewardType: 'COINS', rewardAmount: 10000, label: 'Monats-Schatz' };
    return { expiresAt: Date.now() + (category === 'DAILY' ? 86400000 : (category === 'WEEKLY' ? 604800000 : 2592000000)), quests: quests, completedCount: 0, totalQuests: count, reward: composite, claimedComposite: false };
};