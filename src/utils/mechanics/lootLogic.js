export const determineRarity = (boxType) => {
    let rand = Math.random() * 100;
    
    if (boxType === 'DAILY') {
        if (rand < 1.52) return 'EPIC';
        if (rand < 11.62) return 'RARE';
        if (rand < 31.82) return 'UNCOMMON';
        return 'COMMON';
    }
    if (boxType === 'PREMIUM') {
        if (rand < 0.5) return 'LEGENDARY';
        if (rand < 2.5) return 'EPIC';
        if (rand < 7.5) return 'RARE';
        if (rand < 27.5) return 'UNCOMMON';
        return 'COMMON';
    }
    // Fallback
    return 'COMMON';
};