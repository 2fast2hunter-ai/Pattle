export const getUnlockedTeamSlots = (level) => {
    const maxSlots = 10;
    let slots = 1;
    if (level >= 3) { slots = 2; slots += Math.floor((level - 3) / 5); }
    return Math.min(maxSlots, slots);
};

export const getUnlockedHatcherySlots = (level) => {
  if (level < 15) return 1;
  return Math.min(10, 2 + Math.floor((level - 15) / 10));
};