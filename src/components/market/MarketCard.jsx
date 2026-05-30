import React from 'react';
import { Coins, Egg, Trash2, Box } from 'lucide-react';
import { RARITIES, RESOURCE_ITEMS } from '../../data/gameData';
import PetAvatar from '../PetAvatar';

// --- HELPER: Flatten Resource List ---
const ALL_RESOURCE_ITEMS = (() => {
    const list = [];
    Object.values(RESOURCE_ITEMS).forEach(items => list.push(...items));
    return list;
})();

const getResourceInfo = (itemId) => ALL_RESOURCE_ITEMS.find(i => i.id === itemId);

export default function MarketCard({ listing, isOwner, onClickAction, onRemoveListing, setViewingPetDetails, t }) {
    const isResource = listing.type === 'RESOURCE';

    // PET CARD
    if (!isResource) {
        const pet = listing.pet;
        const rarity = RARITIES[pet.rarity] || RARITIES.COMMON;
        const isEgg = pet.isEgg;
        const displayCount = listing.quantity || 1;

        const displayName = isEgg ? (t ? `${t('rarity_' + pet.rarity)} ${t('inv_egg_suffix')}` : `${rarity.label} Ei`) : pet.name;

        return (
            <div className="bg-slate-800 rounded-2xl border border-white/5 p-3 flex items-center gap-4">
                <div className="relative shrink-0" onClick={() => !isEgg && setViewingPetDetails({ pet, price: listing.price, isOwner, listingId: listing.id, onBuy: onClickAction })}>
                    {isEgg ? <div className="w-16 h-16 flex items-center justify-center"><Egg className={`w-10 h-10 ${rarity.color}`} /></div> : <PetAvatar pet={pet} className="w-16 h-16" />}
                    {displayCount > 1 && <div className="absolute -top-1 -right-1 bg-white text-black font-bold text-xs px-1.5 rounded">x{displayCount}</div>}
                </div>
                <div className="flex-1">
                    <div className={`font-black text-sm ${rarity.color}`}>{displayName}</div>
                    <div className="text-xs text-slate-500">{isOwner ? "Dein Angebot" : listing.sellerName}</div>
                </div>
                {isOwner ? (
                    <button onClick={() => onRemoveListing(listing.id)} className="bg-red-600 p-2 rounded-xl text-white"><Trash2 className="w-4 h-4" /></button>
                ) : (
                    <button onClick={onClickAction} className="bg-yellow-500 px-3 py-2 rounded-xl text-black font-bold text-xs flex items-center gap-1"><Coins className="w-3 h-3" /> {listing.price}</button>
                )}
            </div>
        );
    }

    // RESOURCE CARD
    const resInfo = getResourceInfo(listing.itemId);
    if (!resInfo) return null;

    return (
        <div className="bg-slate-800 rounded-2xl border border-white/5 p-3 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center ${resInfo.color} font-bold text-lg border border-white/10`}>
                <Box className="w-8 h-8" />
            </div>
            <div className="flex-1">
                <div className={`font-black text-sm ${resInfo.color}`}>{t ? t('item_' + resInfo.id) : resInfo.label}</div>
                <div className="text-xs text-slate-400">Amount: {listing.amount}</div>
                <div className="text-xs text-slate-600">{isOwner ? (t ? t('market_your_listing') : 'Your listing') : listing.sellerName}</div>
            </div>
            {isOwner ? (
                <button onClick={() => onRemoveListing(listing.id)} className="bg-red-600 p-2 rounded-xl text-white"><Trash2 className="w-4 h-4" /></button>
            ) : (
                <button onClick={onClickAction} className="bg-yellow-500 px-3 py-2 rounded-xl text-black font-bold text-xs flex items-center gap-1"><Coins className="w-3 h-3" /> {listing.price}</button>
            )}
        </div>
    );
}
