import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, X, Store, Coins, Tag, DollarSign, Egg, Search, Swords, Shield, Zap, Heart, Info, Eye, Minus, Plus, Trash2, Pickaxe, Box } from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS, ABILITIES, RESOURCE_ITEMS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

// --- HELPER: Flatten Resource List ---
// Erstellt eine einfache Liste aller Item-Definitionen aus villageData
const ALL_RESOURCE_ITEMS = (() => {
    const list = [];
    Object.values(RESOURCE_ITEMS).forEach(items => list.push(...items));
    return list;
})();

const getResourceInfo = (itemId) => ALL_RESOURCE_ITEMS.find(i => i.id === itemId);


// --- DETAIL MODAL (PET) ---
function MarketDetailModal({ pet, onClose, price, onBuy, isOwner, onRemove }) {
    if (!pet || pet.isEgg) return null;
    const typeInfo = TYPES[pet.type] || TYPES.FIRE;
    const rarityInfo = RARITIES[pet.rarity] || RARITIES.COMMON;
    const ability = ABILITIES[pet.abilityId] || ABILITIES.fireball;
    const speciesInfo = ZODIAC_ANIMALS[pet.species] || { label: 'Unbekannt' };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in zoom-in-50">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-0 relative overflow-hidden flex flex-col max-h-[85vh]">
                <div className="relative h-40 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    <div className={`absolute inset-0 ${typeInfo.bg} opacity-20 blur-3xl`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${rarityInfo.bg} blur-[50px] opacity-30 animate-pulse`}></div>
                    <div className="relative z-10 scale-125 drop-shadow-2xl"><PetAvatar pet={pet} className="w-32 h-32" /></div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors z-20"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 flex-1 overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold text-slate-500 uppercase">{speciesInfo.label}</span><span className={`text-[10px] font-bold ${typeInfo.color} uppercase border border-white/10 px-1.5 rounded`}>{typeInfo.label}</span></div>
                            <h2 className={`text-2xl font-black ${rarityInfo.color}`}>{pet.name}</h2>
                        </div>
                        <div className="text-right"><div className="text-[10px] text-slate-500 font-bold uppercase">Level</div><div className="text-2xl font-black text-white">{pet.level}</div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                         <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-red-500/10 rounded-lg text-red-400"><Swords className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">ATK</div><div className="text-sm font-black text-white">{pet.atk}</div></div></div>
                         <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-green-500/10 rounded-lg text-green-400"><Heart className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">HP</div><div className="text-sm font-black text-white">{pet.maxHp}</div></div></div>
                        <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-slate-500/10 rounded-lg text-slate-400"><Shield className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">DEF</div><div className="text-sm font-black text-white">{pet.def}</div></div></div>
                         <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400"><Zap className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">AP</div><div className="text-sm font-black text-white">{pet.ap}</div></div></div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5"><div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold text-slate-500 uppercase">Fähigkeit</span><span className="text-[10px] font-bold text-indigo-400 uppercase">{ability.name}</span></div><p className="text-xs text-slate-400 leading-relaxed">{ability.desc}</p></div>
                </div>
                <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0">
                    {isOwner ? (
                        <button onClick={onRemove} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            <Trash2 className="w-4 h-4" /> ANGEBOT ENTFERNEN
                        </button>
                    ) : (
                        <button onClick={onBuy} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            <Coins className="w-4 h-4 fill-black/20" /> KAUFEN FÜR {price}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MarketplaceScreen({ user, listings, onBack, onBuy, onSell, onSellResource, onRemoveListing, myPets }) {
    const [activeTab, setActiveTab] = useState('buy'); // 'buy' | 'sell'
    const [subTab, setSubTab] = useState('pets'); // 'pets' | 'items'
    
    const [sellPrice, setSellPrice] = useState('');
    const [sellQuantity, setSellQuantity] = useState(1); 
    const [selectedForSale, setSelectedForSale] = useState(null);
    const [viewingPetDetails, setViewingPetDetails] = useState(null); 

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRarity, setFilterRarity] = useState('ALL');

    // --- FILTER LOGIK ---
    const checkFilters = (item, price = null) => {
        if (!item) return false;
        
        // Für Pets
        if (item.type || item.isEgg) {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchesName = item.name && item.name.toLowerCase().includes(term);
                if (!matchesName) return false;
            }
            if (filterRarity !== 'ALL' && item.rarity !== filterRarity) return false;
        }
        // Für Ressourcen
        else if (item.id) { // Resource item struct
            if (searchTerm && !item.label.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        }

        return true;
    };

    // --- LISTEN VORBEREITEN ---
    
    // 1. BUY LISTE
    const buyList = useMemo(() => {
        return listings
            .filter(l => {
                if (subTab === 'pets') return l.type !== 'RESOURCE' && (!l.type || l.pet);
                if (subTab === 'items') return l.type === 'RESOURCE';
                return false;
            })
            .sort((a, b) => {
                // Eigene zuerst
                const isMyA = a.sellerId === user.id;
                const isMyB = b.sellerId === user.id;
                if (isMyA && !isMyB) return -1;
                if (!isMyA && isMyB) return 1;
                return b.createdAt - a.createdAt;
            });
    }, [listings, subTab, user.id]);

    // 2. SELL LISTE (PETS)
    const sellPetsList = useMemo(() => {
        const list = [];
        const eggStacks = {};
        
        myPets.forEach(p => {
            if (user.team.includes(p.id)) return; // Im Team
            if (!checkFilters(p)) return;

            if (p.isEgg) {
                const stackKey = `${p.rarity}`;
                if (!eggStacks[stackKey]) eggStacks[stackKey] = { ...p, id: `stack-${p.rarity}`, isStack: true, count: 0, pets: [] };
                eggStacks[stackKey].count++;
                eggStacks[stackKey].pets.push(p);
            } else {
                list.push(p);
            }
        });
        return [...list, ...Object.values(eggStacks)];
    }, [myPets, user.team, searchTerm, filterRarity]);

    // 3. SELL LISTE (ITEMS)
    const sellItemsList = useMemo(() => {
        const storage = user.village?.storage || {};
        const list = [];
        
        Object.entries(storage).forEach(([id, count]) => {
            if (count <= 0) return;
            const info = getResourceInfo(id);
            if (info) {
                list.push({ ...info, count, isResource: true });
            }
        });
        return list;
    }, [user.village]);


    // --- ACTIONS ---
    const handleSellSubmit = () => {
        if (!selectedForSale || !sellPrice || isNaN(sellPrice) || sellPrice <= 0) return;
        const price = parseInt(sellPrice);

        if (selectedForSale.isResource) {
             // RESSOURCE VERKAUFEN
             const qty = Math.max(1, Math.min(sellQuantity, selectedForSale.count));
             const totalPrice = price * qty;
             // onSellResource muss von App.jsx -> useMarketActions kommen
             if (onSellResource) {
                 onSellResource(selectedForSale.id, qty, totalPrice);
             }
        } else {
            // PET VERKAUFEN
            if (selectedForSale.isStack) {
                const qty = Math.max(1, Math.min(sellQuantity, selectedForSale.count));
                const petsToSell = selectedForSale.pets.slice(0, qty);
                const totalPrice = price * qty;
                onSell(petsToSell, totalPrice);
            } else {
                onSell(selectedForSale, price);
            }
        }

        setSelectedForSale(null);
        setSellPrice('');
        setSellQuantity(1);
    };

    const toggleSaleSelection = (item) => {
        if (selectedForSale?.id === item.id) { 
            setSelectedForSale(null); setSellPrice(''); setSellQuantity(1); 
        } else { 
            setSelectedForSale(item); setSellPrice(''); setSellQuantity(1); 
        }
    };

    // --- CARDS ---
    const MarketCard = ({ listing, isOwner, onClickAction }) => {
        const isResource = listing.type === 'RESOURCE';
        
        // PET CARD
        if (!isResource) {
            const pet = listing.pet;
            const rarity = RARITIES[pet.rarity] || RARITIES.COMMON;
            const isEgg = pet.isEgg;
            const type = isEgg ? null : (TYPES[pet.type] || TYPES.FIRE);
            const displayCount = listing.quantity || 1;

            return (
                <div className="bg-slate-800 rounded-2xl border border-white/5 p-3 flex items-center gap-4">
                     <div className="relative shrink-0" onClick={() => !isEgg && setViewingPetDetails({ pet, price: listing.price, isOwner, listingId: listing.id, onBuy: () => onBuy(listing.id) })}>
                         {isEgg ? <div className="w-16 h-16 flex items-center justify-center"><Egg className={`w-10 h-10 ${rarity.color}`} /></div> : <PetAvatar pet={pet} className="w-16 h-16" />}
                         {displayCount > 1 && <div className="absolute -top-1 -right-1 bg-white text-black font-bold text-xs px-1.5 rounded">x{displayCount}</div>}
                     </div>
                     <div className="flex-1">
                         <div className={`font-black text-sm ${rarity.color}`}>{isEgg ? 'Ei' : pet.name}</div>
                         <div className="text-xs text-slate-500">{isOwner ? "Dein Angebot" : listing.sellerName}</div>
                     </div>
                     {isOwner ? (
                        <button onClick={() => onRemoveListing(listing.id)} className="bg-red-600 p-2 rounded-xl text-white"><Trash2 className="w-4 h-4"/></button>
                     ) : (
                        <button onClick={() => onBuy(listing.id)} className="bg-yellow-500 px-3 py-2 rounded-xl text-black font-bold text-xs flex items-center gap-1"><Coins className="w-3 h-3"/> {listing.price}</button>
                     )}
                </div>
            );
        } 
        
        // RESOURCE CARD
        const resInfo = getResourceInfo(listing.itemId);
        if (!resInfo) return null; // Fallback

        return (
            <div className="bg-slate-800 rounded-2xl border border-white/5 p-3 flex items-center gap-4">
                 <div className={`w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center ${resInfo.color} font-bold text-lg border border-white/10`}>
                     ? {/* Placeholder Icon, da wir die Icons hier nicht importiert haben, oder nimm Box */}
                     <Box className="w-8 h-8" />
                 </div>
                 <div className="flex-1">
                     <div className={`font-black text-sm ${resInfo.color}`}>{resInfo.label}</div>
                     <div className="text-xs text-slate-400">Menge: {listing.amount}</div>
                     <div className="text-xs text-slate-600">{isOwner ? "Dein Angebot" : listing.sellerName}</div>
                 </div>
                 {isOwner ? (
                    <button onClick={() => onRemoveListing(listing.id)} className="bg-red-600 p-2 rounded-xl text-white"><Trash2 className="w-4 h-4"/></button>
                 ) : (
                    <button onClick={() => onBuy(listing.id)} className="bg-yellow-500 px-3 py-2 rounded-xl text-black font-bold text-xs flex items-center gap-1"><Coins className="w-3 h-3"/> {listing.price}</button>
                 )}
            </div>
        );
    };

    // SELL CARD (Selectable)
    const SellCard = ({ item, isSelected }) => {
        // RESOURCE
        if (item.isResource) {
            return (
                <div onClick={() => toggleSaleSelection(item)} className={`bg-slate-800 p-3 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${isSelected ? 'border-green-500' : 'border-white/5'}`}>
                    <div className={`w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center ${item.color}`}><Pickaxe className="w-6 h-6"/></div>
                    <div className="flex-1">
                        <div className={`font-bold ${item.color}`}>{item.label}</div>
                        <div className="text-xs text-slate-400">Besitz: {item.count}</div>
                    </div>
                    {isSelected && <div className="bg-green-500 text-black p-1 rounded-full"><DollarSign className="w-4 h-4"/></div>}
                </div>
            );
        }
        // PET
        const rarity = RARITIES[item.rarity];
        return (
            <div onClick={() => toggleSaleSelection(item)} className={`bg-slate-800 p-3 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${isSelected ? 'border-green-500' : 'border-white/5'}`}>
                {item.isEgg ? <Egg className={`w-12 h-12 ${rarity.color}`}/> : <PetAvatar pet={item} className="w-12 h-12"/>}
                <div className="flex-1">
                    <div className={`font-bold ${rarity.color}`}>{item.name || rarity.label}</div>
                    <div className="text-xs text-slate-400">{item.isStack ? `x${item.count}` : `Lvl ${item.level}`}</div>
                </div>
                {isSelected && <div className="bg-green-500 text-black p-1 rounded-full"><DollarSign className="w-4 h-4"/></div>}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">
            {viewingPetDetails && (<MarketDetailModal pet={viewingPetDetails.pet} price={viewingPetDetails.price} isOwner={viewingPetDetails.isOwner} onBuy={viewingPetDetails.onBuy} onRemove={() => { onRemoveListing(viewingPetDetails.listingId); setViewingPetDetails(null); }} onClose={() => setViewingPetDetails(null)} />)}
            
            {/* HEADER & TABS */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-4">
                     <h1 className="text-2xl font-black italic text-white">MARKT</h1>
                     <button onClick={onBack} className="p-2 bg-slate-800 rounded-full"><X className="w-5 h-5 text-white" /></button>
                </div>
                
                {/* MAIN TABS (BUY / SELL) */}
                <div className="flex p-1 bg-slate-800 rounded-xl border border-white/5 mb-3">
                    <button onClick={() => setActiveTab('buy')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'buy' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}>KAUFEN</button>
                    <button onClick={() => setActiveTab('sell')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'sell' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500'}`}>VERKAUFEN</button>
                </div>

                {/* SUB TABS (PETS / ITEMS) */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <button onClick={() => setSubTab('pets')} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${subTab === 'pets' ? 'bg-white text-slate-900 border-white' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>Pets & Eier</button>
                    <button onClick={() => setSubTab('items')} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${subTab === 'items' ? 'bg-white text-slate-900 border-white' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>Materialien</button>
                </div>
            </div>

            {/* LISTE */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide pt-2">
                
                {activeTab === 'buy' && (
                    <div className="space-y-3">
                        {buyList.length === 0 ? <div className="text-center text-slate-500 py-10">Nichts gefunden.</div> : buyList.map(l => (
                            <MarketCard key={l.id} listing={l} isOwner={l.sellerId === user.id} onClickAction={() => onBuy(l.id)} />
                        ))}
                    </div>
                )}

                {activeTab === 'sell' && (
                    <div className="space-y-3">
                        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl flex items-center gap-3 mb-2"><Info className="w-5 h-5 text-blue-400 shrink-0" /><p className="text-xs text-blue-200">Gebühr: 100 Gold pro Angebot.</p></div>
                        
                        {subTab === 'pets' && sellPetsList.map(item => <SellCard key={item.id} item={item} isSelected={selectedForSale?.id === item.id} />)}
                        {subTab === 'items' && sellItemsList.map(item => <SellCard key={item.id} item={item} isSelected={selectedForSale?.id === item.id} />)}

                        {/* INPUT PANEL (Fixed Bottom wenn ausgewählt) */}
                        {selectedForSale && (
                            <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-white/10 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                                <div className="flex flex-col gap-3 max-w-md mx-auto">
                                    <div className="flex justify-between text-sm font-bold text-white">
                                        <span>Verkaufe: {selectedForSale.name || selectedForSale.label}</span>
                                        {/* Quantity Selector nur wenn Stack/Resource */}
                                        {(selectedForSale.isStack || selectedForSale.isResource) && (
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}><Minus className="w-4 h-4"/></button>
                                                <span>{sellQuantity}</span>
                                                <button onClick={() => setSellQuantity(Math.min(selectedForSale.count, sellQuantity + 1))}><Plus className="w-4 h-4"/></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Preis (Gesamt)" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white font-bold w-full" autoFocus />
                                        <button onClick={handleSellSubmit} className="bg-green-600 text-white font-black px-6 rounded-xl">OK</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}