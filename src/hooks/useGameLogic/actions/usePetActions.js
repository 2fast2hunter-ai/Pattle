import { releasePet } from './releasePet';
import { handleReduceCooldown, handleReduceCooldownByAd } from './handleReduceCooldown';
import { addToTeam } from './addToTeam';
import { removeFromTeam } from './removeFromTeam';
import { autoFillTeam } from './autoFillTeam';
import { breedPets } from './breedPets';
import { renamePet } from './renamePet';
import { applyItem } from './applyItem';
import { updatePetInDB, trackQuestProgress, updateUser } from '../../../utils/db';
import { RARITIES, ZODIAC_ANIMALS } from '../../../data/gameData';
import { getUnlockedHatcherySlots } from '../../../utils/mechanics/progression';
import { trackEggHatched } from '../../../utils/analytics';
import { scheduleEggNotification, cancelEggNotification, requestNotificationPermission } from '../../../utils/pushNotifications';
import { checkAchievements } from '../../../utils/checkAchievements';

export function usePetActions(state, showNotification) {
    const startIncubation = async (petId) => {
        const { user, myPets } = state;
        if (!user) return;

        const pet = myPets.find(p => p.id === petId);
        if (!pet) {
            showNotification(state.t ? state.t('notif_egg_not_found') : 'Egg not found!', "error");
            return;
        }

        const unlockedSlots = getUnlockedHatcherySlots(user.level);
        const incubatingCount = myPets.filter(p => p.isEgg && p.hatchAt > 0).length;

        if (incubatingCount >= unlockedSlots) {
            showNotification(state.t ? state.t('notif_hatchery_full', { count: incubatingCount, max: unlockedSlots }) : `Hatchery full! (${incubatingCount}/${unlockedSlots})`, "error");
            return;
        }

        const rarityConfig = RARITIES[pet.rarity] || RARITIES.COMMON;
        const duration = rarityConfig.hatchDuration || 60000;
        const hatchAt = Date.now() + duration;

        await updatePetInDB(pet.id, { hatchAt });
        showNotification(state.t ? state.t('notif_incubation_started') : 'Incubation started!', "success");

        // Request permission on first incubation, then schedule notification
        await requestNotificationPermission();
        scheduleEggNotification(pet.id, pet.name || 'Ei', hatchAt);
    };

    const hatchEgg = async (petId, customName) => {
        const { user, myPets } = state;
        if (!user) return;

        const pet = myPets.find(p => p.id === petId);
        if (!pet) {
            showNotification(state.t ? state.t('notif_egg_not_found') : 'Egg not found!', "error");
            return;
        }

        try {
            // Wenn kein Custom Name, versuche den Spezies-Namen zu nehmen, falls der aktuelle Name generisch ist
            let finalName = customName || pet.name;
            if (!customName && pet.name.startsWith('Wild')) {
                 const speciesInfo = ZODIAC_ANIMALS[pet.species];
                 if (speciesInfo) finalName = speciesInfo.label;
            }

            const updates = {
                isEgg: false,
                hatchAt: 0,
                name: finalName
            };
            
            await updatePetInDB(pet.id, updates);
            cancelEggNotification(pet.id);

            // Update User Stats (Hatched Count)
            const currentHatched = user.stats?.hatched || 0;
            await updateUser(user.id, { "stats.hatched": currentHatched + 1 });

            // Quest Progress
            const subTypes = [`HATCH_${pet.rarity}`, `HATCH_${pet.type}`];
            await trackQuestProgress(user, 'HATCH_EGG', 1, subTypes);
            trackEggHatched(pet.type, pet.rarity);

            // Achievement checks
            const lang = state.settings?.language || 'de';
            await checkAchievements(
                user,
                'egg_hatch',
                { hatched: currentHatched + 1 },
                showNotification,
                lang,
                state.myPets || []
            );

            showNotification(state.t ? state.t('notif_pet_hatched', { name: updates.name }) : `${updates.name} hatched!`, "success");
        } catch (error) {
            console.error("Hatch Error:", error);
            showNotification(state.t ? state.t('notif_hatch_error') : 'Error while hatching.', "error");
        }
    };

    return {
        handleReduceCooldown: (petId, type) => handleReduceCooldown(state, showNotification, petId, type),
        handleReduceCooldownByAd: (petId) => handleReduceCooldownByAd(state, showNotification, petId),
        addToTeam: (petId) => addToTeam(state, showNotification, petId),
        removeFromTeam: (index) => removeFromTeam(state, showNotification, index),
        autoFillTeam: () => autoFillTeam(state, showNotification),
        hatchEgg,
        startIncubation,
        breedPets: (p1, p2) => breedPets(state, showNotification, p1, p2),
        renamePet: (petId, newName) => renamePet(state, showNotification, petId, newName),
        applyXpItem: (petId, itemId, quantity) => applyItem(state, showNotification, petId, itemId, quantity), 
        releasePet: (petId) => releasePet(state, showNotification, petId),
        applyItem: (petId, itemId, quantity) => applyItem(state, showNotification, petId, itemId, quantity)
    };
}