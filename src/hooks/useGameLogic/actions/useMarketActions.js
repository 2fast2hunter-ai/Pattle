import { buyMarketItem, createMarketListing, removePetFromDB, updateUser, cancelMarketListing } from '../../../utils/db'; // cancelMarketListing importieren

export function useMarketActions(state, showNotification) {
    const { user } = state;

    const handleBuyMarket = async (listingId) => { 
        if (!user) return; 
        const result = await buyMarketItem(user, listingId); 
        if (result.success) { 
            showNotification(result.message, 'success'); 
        } else { 
            showNotification(result.message, 'error'); 
        } 
    };

    const handleSellMarket = async (petsToSell, totalPrice) => { 
        if (!user) return; 
        const petArray = Array.isArray(petsToSell) ? petsToSell : [petsToSell]; 
        if (petArray.length === 0) return; 

        // 1. GEBÜHR PRÜFEN
        const LISTING_FEE = 100;
        if (user.coins < LISTING_FEE) {
            showNotification("Nicht genügend Münzen für die Einstellgebühr (100 Gold)!", "error");
            return;
        }
        
        // 2. GEBÜHR ABZIEHEN
        await updateUser(user.id, { coins: user.coins - LISTING_FEE });

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
        
        showNotification(petArray.length > 1 ? `${petArray.length} Items eingestellt! (-100G)` : "Angebot erstellt! (-100G)", 'success'); 
    };

    // NEU: EIGENES ANGEBOT LÖSCHEN
    const handleRemoveListing = async (listingId) => {
        if (!user) return;
        
        const result = await cancelMarketListing(user, listingId);
        
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    };

    return { handleBuyMarket, handleSellMarket, handleRemoveListing };
}