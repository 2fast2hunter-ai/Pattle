import { updateUser, addPetToDB, updatePetInDB, trackQuestProgress } from '../../../utils/db';
import { generatePet } from '../../../utils/gameMechanics';
import { RARITIES } from '../../../data/gameData';
import { getFusionRecipe } from '../../../data/fusionRecipes';
import { trackPetBred } from '../../../utils/analytics';
import { checkAchievements } from '../../../utils/checkAchievements';

export const breedPets = async (state, showNotification, p1Arg, p2Arg) => {
    const { user, myPets } = state;
    if (!user) return;

    const parent1 = typeof p1Arg === 'string' ? myPets.find(p => p.id === p1Arg) : p1Arg;
    const parent2 = typeof p2Arg === 'string' ? myPets.find(p => p.id === p2Arg) : p2Arg;

    if (!parent1 || !parent2) {
        showNotification(state.t ? state.t('notif_breed_parents_missing') : 'Parent pets not found.', "error");
        return;
    }

    // Ticket or coin cost
    const inventory = user.inventory || [];
    const ticketIndex = inventory.findIndex(i => i.type === 'TICKET');
    let cost = 0;
    let newInventory = [...inventory];

    if (ticketIndex !== -1) {
        newInventory.splice(ticketIndex, 1);
    } else {
        cost = 100;
        if (user.coins < cost) {
            showNotification(state.t ? state.t('notif_breed_no_gold') : 'Not enough gold!', "error");
            return;
        }
    }

    // Cooldown check
    const now = Date.now();
    if (parent1.breedingCooldown > now || parent2.breedingCooldown > now) {
        showNotification(state.t ? state.t('notif_breed_not_ready') : 'Parents not ready!', "error");
        return;
    }

    // --- Fusion Recipe Check ---
    const fusion = getFusionRecipe(parent1.type, parent2.type);

    let type, rarity, overrideSpecies, isFusion, isSecret;

    if (fusion) {
        type = fusion.resultType;
        rarity = fusion.rarity;
        overrideSpecies = fusion.species;
        isFusion = true;
        isSecret = fusion.isSecret || false;
    } else {
        // Standard breeding: random type from parents, chance to upgrade rarity
        type = Math.random() > 0.5 ? parent1.type : parent2.type;
        rarity = parent1.rarity || 'COMMON';

        const sortedRarities = Object.keys(RARITIES).sort((a, b) => RARITIES[a].id - RARITIES[b].id);
        const currentIndex = sortedRarities.indexOf(rarity);
        if (currentIndex !== -1 && currentIndex < sortedRarities.length - 1) {
            const upgradeChance = Math.max(1, 10 - currentIndex);
            if (Math.random() * 100 < upgradeChance) {
                rarity = sortedRarities[currentIndex + 1];
            }
        }
        isFusion = false;
        isSecret = false;
    }

    const baby = generatePet(1, type, rarity, null, 'BREEDING');
    baby.isEgg = true;
    baby.hatchAt = 0;
    baby.parents = [parent1.id, parent2.id];
    baby.isFusion = isFusion;
    baby.isSecret = isSecret;

    if (overrideSpecies) {
        baby.species = overrideSpecies;
        // Keep the name masked for secret hybrids until hatched
        baby.name = isSecret ? '???' : baby.name;
    }

    trackPetBred(baby.type, baby.rarity, isFusion);
    const babyData = JSON.parse(JSON.stringify(baby));
    await addPetToDB(babyData, user.id);

    const cooldownTime = 2 * 60 * 60 * 1000;
    await updatePetInDB(parent1.id, { breedingCooldown: now + cooldownTime });
    await updatePetInDB(parent2.id, { breedingCooldown: now + cooldownTime });

    const updates = {
        "stats.bred": (user.stats?.bred || 0) + 1,
        inventory: newInventory
    };
    if (cost > 0) updates.coins = user.coins - cost;

    // Track distinct fusion types for Fusion Master achievement
    if (isFusion && type) {
        const existing = user.stats?.fusionTypesBred || [];
        if (!existing.includes(type)) {
            updates["stats.fusionTypesBred"] = [...existing, type];
        }
    }

    await updateUser(user.id, updates);
    trackQuestProgress(user, 'BREED_PET', 1, [`BREED_${type}`]);

    const updatedUser = { ...user, stats: { ...user.stats, ...updates } };
    const lang = state.settings?.language || 'de';
    checkAchievements(updatedUser, 'breed', {}, showNotification, lang, myPets || []).catch(() => {});

    const msg = isFusion
        ? (isSecret ? (state.t ? state.t('notif_breed_secret') : '⭐ Secret hybrid egg obtained!') : (state.t ? state.t('notif_breed_fusion') : '✨ Fusion egg obtained!'))
        : (ticketIndex !== -1 ? (state.t ? state.t('notif_breed_success_ticket') : 'Breeding successful! (Ticket used)') : (state.t ? state.t('notif_breed_success_gold') : 'Breeding successful! (100 Gold)'));
    showNotification(msg, "success");

    return baby;
};
