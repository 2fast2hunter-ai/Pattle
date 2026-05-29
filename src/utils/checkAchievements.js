import { db } from '../firebase';
import { doc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { ACHIEVEMENTS } from '../data/achievements';

// Session-level guard: prevents re-firing achievements during the window between
// a Firestore write and the listener updating local state (fixes infinite loop on mobile).
const sessionUnlocked = new Set();

export async function checkAchievements(user, trigger, projected = {}, showNotification, lang = 'en', pets = []) {
  if (!user?.id) return;

  const already = user.achievements || {};
  const toUnlock = [];

  for (const achievement of Object.values(ACHIEVEMENTS)) {
    if (achievement.trigger !== trigger) continue;
    if (already[achievement.id]) continue;
    if (sessionUnlocked.has(achievement.id)) continue;
    try {
      if (achievement.check(user, projected, pets)) {
        toUnlock.push(achievement);
      }
    } catch (e) { /* ignore check errors */ }
  }

  if (toUnlock.length === 0) return;

  // Mark in session set BEFORE the async Firestore write to prevent race-condition re-fires
  toUnlock.forEach(a => sessionUnlocked.add(a.id));

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
