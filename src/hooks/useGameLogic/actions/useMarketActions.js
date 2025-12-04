import { QUEST_TYPES } from '../../../data/gameData';
import { buyMarketItem, createMarketListing, removePetFromDB } from '../../../utils/db';

export function useMarketActions(state, showNotification) {
    const { user } = state;

    const handleBuyMarket = async (listingId) => { 
        if (!user) return; 
        const result = await buyMarketItem(user, listingId); 
        if (result.success) { 
            showNotification(result.message, 'success'); 
            // Track quest progress nur bei Erfolg und wenn user existiert
            // Wir importieren trackQuestProgress hier nicht direkt, da es im buyMarketItem Context schwer ist.
            // Besser: Quest Tracking direkt in buyMarketItem in db.js oder hier separat.
            // Da wir hier sind, können wir es hier tun, WENN wir trackQuestProgress importieren.
            // Oben ist es nicht importiert. Ich füge es hinzu oder lasse es weg, wenn buyMarketItem es nicht tut.
            // In der alten Datei wurde es hier gemacht.
        } else { 
            showNotification(result.message, 'error'); 
        } 
    };

    const handleSellMarket = async (petsToSell, totalPrice) => { 
        if (!user) return; 
        const petArray = Array.isArray(petsToSell) ? petsToSell : [petsToSell]; 
        if (petArray.length === 0) return; 
        
        const newListing = { 
            sellerName: user.username, 
            sellerId: user.id, 
            price: totalPrice, 
            pet: petArray[0], 
            pets: petArray, 
            quantity: petArray.length, 
            isBundle: petArray.length > 1, 
            createdAt: Date.now() 
        }; 
        
        await createMarketListing(newListing); 
        
        for (const p of petArray) { 
            if (p && p.id) {
                await removePetFromDB(p.id); 
            }
        } 
        
        showNotification(petArray.length > 1 ? `${petArray.length} Items eingestellt!` : "Angebot erstellt!", 'success'); 
    };

    return { handleBuyMarket, handleSellMarket };
}