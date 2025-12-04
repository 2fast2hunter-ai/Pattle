import { TYPE_ADVANTAGES } from '../../data/gameData';

export const calculateEloChange = (playerRating, enemyRating, isWin) => {
    if (isWin) return 15;
    return -10;
};

export const getDamageMultiplier = (atkType, defType) => {
  if (!atkType || !defType) return 1.0;
  const advantages = TYPE_ADVANTAGES[atkType] || { strong: [], super: [] };
  if (advantages.super?.includes(defType)) return 4.0;
  if (advantages.strong?.includes(defType)) return 2.0;
  const defAdvantages = TYPE_ADVANTAGES[defType] || { strong: [], super: [] };
  if (defAdvantages.super?.includes(atkType)) return 0.25;
  if (defAdvantages.strong?.includes(atkType)) return 0.5;
  return 1.0;
};