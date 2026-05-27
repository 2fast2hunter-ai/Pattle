import { db } from '../firebase';
import { doc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { ACHIEVEMENTS } from '../data/achievements';

/**
 * Check and unlock achievements after a trigger event.
 *
 * @param {object} user - Current Firestore user doc
 * @param {string} trigger - Event trigger (use ACHIEVEMENT_TRIGGERS constants)
 * @param {object} projected - Projected stat changes, e.g. { pvpWins: 5, hatched: 3 }
 * @param {function} showNotification - UI notification callback
 * @param {string} lang - 'de' or 'en' for notification language
 */
export async function checkAchievements(user, trigger, projected = {}, showNotification, lang = 'en') {
  if (!user?.id) return;

  const already = user.achievements || {};
  const toUnlock = [];

  for (const achievement of Object.values(ACHIEVEMENTS)) {
    if (achievement.trigger !== trigger) continue;
    if (already[achievement.id]) continue;
    try {
      if (achievement.check(user, projected)) {
        toUnlock.push(achievement);
      }
    } catch (e) { /* ignore check errors */ }
  }

  if (toUnlock.length === 0) return;

  const updates = {};
  let bonusCoins = 0;
  let bonusGems = 0;

  for (const a of toUnlock) {
    updates[`achievements.${a.id}`] = serverTimestamp();
    bonusCoins += a.reward?.coins || 0;
    bonusGems += a.reward?.gems || 0;
  }

  if (bonusCoins > 0) updates.coins = increment(bonusCoins);
  if (bonusGems > 0) updates.gems = increment(bonusGems);

  try {
    await updateDoc(doc(db, 'users', user.id), updates);
  } catch (e) {
    console.error('Achievement unlock error', e);
    return;
  }

  if (showNotification) {
    for (const a of toUnlock) {
      const title = lang === 'de' ? a.titleDe : a.title;
      const rewardText = [
        a.reward?.coins ? `+${a.reward.coins} Gold` : '',
        a.reward?.gems ? `+${a.reward.gems} Gems` : '',
      ].filter(Boolean).join(', ');
      showNotification(
        lang === 'de'
          ? `Achievement freigeschaltet: ${title}! ${rewardText}`
          : `Achievement unlocked: ${title}! ${rewardText}`,
        'success'
      );
    }
  }
}
