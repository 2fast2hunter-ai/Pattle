import { createMarketListing, createResourceListing, removePetFromDB, updateUser, cancelMarketListing } from '../../../utils/db';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';

export function useMarketActions(state, showNotification) {
    // WICHTIG: marketListings aus dem State holen
    const { user, marketListings } = state;

    const handleBuyMarket = async (listingId) => {
        if (!user) return;
        try {
            const functions = getFunctions(getApp());
            const buyMarketItemFn = httpsCallable(functions, 'buyMarketItem');
            const result = await buyMarketItemFn({ listingId });
            showNotification(result.data.message, 'success');
        } catch (e) {
            showNotification(e.message || 'Fehler beim Kauf.', 'error');
        }
    };

    // SELL PETS
    const handleSellMarket = async (petsToSell, totalPrice) => { 
        if (!user) return; 
        
        // --- LIMIT CHECK (NEU) ---
        // Filtere alle Listings, die mir gehören
        const myListingsCount = (marketListings || []).filter(l => l.sellerId === user.id).length;
        if (myListingsCount >= 10) {
            showNotification(state.t ? state.t('notif_market_limit') : 'Limit reached! Max 10 listings at a time.', "error");
            return;
        }
        // -------------------------

        const petArray = Array.isArray(petsToSell) ? petsToSell : [petsToSell]; 
        if (petArray.length === 0) return; 

        const LISTING_FEE = 100;
        if (user.coins < LISTING_FEE) {
            showNotification(state.t ? state.t('notif_market_no_fee') : 'Not enough coins for the listing fee (100 Gold)!', "error");
            return;
        }
        
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
        
        showNotification(petArray.length > 1 ? (state.t ? state.t('notif_market_bundle_listed', { count: petArray.length }) : `${petArray.length} items listed! (-100G)`) : (state.t ? state.t('notif_market_listed') : 'Listing created! (-100G)'), 'success');
    };

    // SELL RESOURCE
    const handleSellResource = async (itemId, amount, totalPrice) => {
        if (!user) return;
        
        // --- LIMIT CHECK (NEU) ---
        const myListingsCount = (marketListings || []).filter(l => l.sellerId === user.id).length;
        if (myListingsCount >= 10) {
            showNotification(state.t ? state.t('notif_market_limit') : 'Limit reached! Max 10 listings at a time.', "error");
            return;
        }
        // -------------------------

        if (user.coins < 100) {
            showNotification(state.t ? state.t('notif_market_no_fee') : 'Not enough coins for the listing fee (100 Gold)!', "error");
            return;
        }

        const result = await createResourceListing(user, itemId, amount, totalPrice);
        
        if (result.success) {
            showNotification(state.t ? state.t('notif_market_resources_listed') : 'Materials listed! (-100G)', "success");
        } else {
            showNotification(result.message || "Fehler beim Erstellen.", "error");
        }
    };

    const handleRemoveListing = async (listingId) => {
        if (!user) return;
        const result = await cancelMarketListing(user, listingId);
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    };

    return { handleBuyMarket, handleSellMarket, handleSellResource, handleRemoveListing };
}