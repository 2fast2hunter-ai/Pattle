const GAME_URL = 'https://2fast2hunter-ai.github.io/Pattle/';

export async function sharePet(pet, rarityLabel, elementLabel) {
    const text = [
        `🐾 I caught a ${rarityLabel} ${pet.name} in #Pattle! 🐾`,
        '',
        `Element: ${elementLabel} | Level ${pet.level}`,
        `HP: ${pet.maxHp} | ATK: ${pet.atk} | DEF: ${pet.def} | SPD: ${pet.speed}`,
        '',
        `Play free at ${GAME_URL}`,
        '#PattlePets #IdleRPG',
    ].join('\n');

    if (navigator.share) {
        await navigator.share({ text });
        return 'shared';
    }
    await navigator.clipboard.writeText(text);
    return 'copied';
}

export async function shareVictory(elementLabel, floorNumber) {
    const locationText = floorNumber
        ? `Floor ${floorNumber} of the Pattle Tower`
        : 'a battle in #Pattle';
    const text = [
        `Just beat ${locationText} with my ${elementLabel} team! 🏆`,
        '',
        `Play free at ${GAME_URL}`,
        '#PattlePets #IdleRPG',
    ].join('\n');

    if (navigator.share) {
        await navigator.share({ text });
        return 'shared';
    }
    await navigator.clipboard.writeText(text);
    return 'copied';
}
