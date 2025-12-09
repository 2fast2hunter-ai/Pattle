import { QUEST_TEMPLATES, COMPOSITE_QUEST_REWARDS } from '../../data/gameData';

const calculateNextResetTime = (category) => {
    let nextTarget = new Date();
    if (category === 'DAILY') {
        nextTarget.setDate(nextTarget.getDate() + 1);
        nextTarget.setHours(0, 0, 0, 0);
    } else if (category === 'WEEKLY') {
        const day = nextTarget.getDay(); 
        let daysUntilMonday = (1 + 7 - day) % 7;
        if (daysUntilMonday === 0) daysUntilMonday = 7;
        nextTarget.setDate(nextTarget.getDate() + daysUntilMonday);
        nextTarget.setHours(0, 0, 0, 0);
    } else if (category === 'MONTHLY') {
        nextTarget.setFullYear(nextTarget.getFullYear(), nextTarget.getMonth() + 1, 1);
        nextTarget.setHours(0, 0, 0, 0);
    }
    return nextTarget.getTime(); 
};

export const generateQuests = (category) => {
  let count = 5; // Default (Daily)
  let multiplier = 1;

  if (category === 'DAILY') {
      count = 5;
      multiplier = 1; 
  } else if (category === 'WEEKLY') {
      count = 10; // Mehr Aufgaben
      multiplier = 5; 
  } else if (category === 'MONTHLY') {
      count = 15; // Angepasst auf 15 Aufgaben
      multiplier = 20; 
  }

  const newQuests = [];
  const groupedTemplates = {};
  
  QUEST_TEMPLATES.forEach(template => {
      const categoryKey = template.type.split('_')[0]; 
      if (!groupedTemplates[categoryKey]) {
          groupedTemplates[categoryKey] = [];
      }
      groupedTemplates[categoryKey].push(template);
  });

  const availableCategories = Object.keys(groupedTemplates);
  
  for (let i = availableCategories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableCategories[i], availableCategories[j]] = [availableCategories[j], availableCategories[i]];
  }

  const selectedCategories = [];
  
  for (const cat of availableCategories) {
      if (selectedCategories.length < count) {
          selectedCategories.push(cat);
      }
  }

  while (selectedCategories.length < count) {
      const randomCat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      selectedCategories.push(randomCat);
  }

  selectedCategories.forEach(catKey => {
      const templatesInCat = groupedTemplates[catKey];
      const template = templatesInCat[Math.floor(Math.random() * templatesInCat.length)];

      const variance = 0.8 + Math.random() * 0.4;
      const targetAmount = Math.ceil(template.baseAmount * multiplier * variance);
      
      let rewardAmount = 0;
      let rewardType = template.rewardType;

      if (category === 'MONTHLY' && Math.random() > 0.7) { 
          rewardType = 'EGG_RARE';
          rewardAmount = 1;
      } else {
          if (rewardType === 'XP') {
              if (category === 'DAILY') rewardAmount = 75;
              else if (category === 'WEEKLY') rewardAmount = 250;
              else if (category === 'MONTHLY') rewardAmount = 750;
          } else {
              rewardAmount = Math.ceil(template.rewardBase * multiplier * variance);
          }
      }

      newQuests.push({
          id: Date.now() + Math.random().toString(), 
          type: template.type,
          label: template.label,
          target: targetAmount,
          progress: 0,
          rewardType: rewardType,
          rewardAmount: rewardAmount,
          claimed: false,
          category: category
      });
  });

  return {
      quests: newQuests,
      expiresAt: calculateNextResetTime(category),
      completedCount: 0,
      claimedComposite: false,
      totalQuests: count,
      reward: COMPOSITE_QUEST_REWARDS[category]
  };
};