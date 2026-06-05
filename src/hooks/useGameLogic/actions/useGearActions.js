import { db } from '../../../firebase';
import { doc, updateDoc, increment, arrayRemove } from 'firebase/firestore';
import { updatePetInDB } from '../../../utils/db';
import { GEAR_ITEMS } from '../../../data/gearData';
import { RARITIES } from '../../../data/rarities';

export function useGearActions(state, showNotification) {
    const equipGear = async (petId, gearInstanceId) => {
        const { user, myPets } = state;
        const pet = myPets.find(p => p.id === petId);
        const gearInstance = (user.gearInventory || []).find(g => g.id === gearInstanceId);
        if (!pet || !gearInstance) return;

        const template = GEAR_ITEMS[gearInstance.key];
        if (!template) return;

        const newGear = { ...(pet.gear || {}), [template.slot]: gearInstanceId };
        await updatePetInDB(petId, { gear: newGear });
        showNotification(
            state.t ? state.t('notif_gear_equipped', { item: template.key }) : `${template.key} equipped!`,
            'success'
        );
    };

    const unequipGear = async (petId, slot) => {
        const { myPets } = state;
        const pet = myPets.find(p => p.id === petId);
        if (!pet) return;
        const newGear = { ...(pet.gear || {}), [slot]: null };
        await updatePetInDB(petId, { gear: newGear });
        showNotification(
            state.t ? state.t('notif_gear_unequipped') : 'Gear unequipped.',
            'info'
        );
    };

    const sellGear = async (gearInstanceId) => {
        const { user } = state;
        const gearInstance = (user.gearInventory || []).find(g => g.id === gearInstanceId);
        if (!gearInstance) return;

        const rarityDef = RARITIES[gearInstance.rarity] || RARITIES.COMMON;
        const sellPrice = Math.round(10 * rarityDef.multi);

        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
            gearInventory: arrayRemove(gearInstance),
            coins: increment(sellPrice),
        });

        showNotification(
            state.t ? state.t('notif_gear_sold', { coins: sellPrice }) : `Sold! +${sellPrice} coins`,
            'success'
        );
    };

    return { equipGear, unequipGear, sellGear };
}
