import React, { useState } from 'react';
import { ArrowLeft, Filter, X, Store, Coins, Tag, DollarSign, Egg, Search, Swords, Shield, Zap, Heart, Info, HelpCircle, Eye, Minus, Plus } from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS, ABILITIES } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

// --- DETAIL MODAL (Unverändert) ---
function MarketDetailModal({ pet, onClose, price, onBuy, isOwner }) {
    if (pet.isEgg) return null;
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
                {onBuy && !isOwner && (<div className="p-4 bg-slate-900 border-t border-white/10 shrink-0"><button onClick={onBuy} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"><Coins className="w-4 h-4 fill-black/20" /> KAUFEN FÜR {price}</button></div>)}
            </div>
        </div>
    );
}

export default function MarketplaceScreen({ user, listings, onBack, onBuy, onSell, myPets }) {
    const [activeTab, setActiveTab] = useState('buy'); 
    const [sellPrice, setSellPrice] = useState('');
    const [sellQuantity, setSellQuantity] = useState(1); 
    const [selectedForSale, setSelectedForSale] = useState(null);
    const [viewingPetDetails, setViewingPetDetails] = useState(null); 

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRarity, setFilterRarity] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const checkFilters = (pet, price = null) => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesName = pet.name.toLowerCase().includes(term);
            const speciesData = ZODIAC_ANIMALS[pet.species];
            const matchesSpecies = !pet.isEgg && speciesData?.label.toLowerCase().includes(term);
            if (!matchesName && !matchesSpecies) return false;
        }
        if (filterRarity !== 'ALL' && pet.rarity !== filterRarity) return false;
        if (filterType !== 'ALL' && (pet.isEgg || pet.type !== filterType)) return false;
        
        if (price !== null) {
            if (minPrice !== '' && price < parseInt(minPrice)) return false;
            if (maxPrice !== '' && price > parseInt(maxPrice)) return false;
        }
        return true;
    };

    // --- 1. KAUFEN LISTE (SORTIERT NACH RARITY -> DATUM) ---
    const buyList = listings
        .filter(l => checkFilters(l.pet, l.price))
        .sort((a, b) => {
            // Sortierung nach Seltenheit (höchste ID zuerst)
            const rA = RARITIES[a.pet.rarity]?.id || 0;
            const rB = RARITIES[b.pet.rarity]?.id || 0;
            
            if (rB !== rA) return rB - rA;
            
            // Wenn Seltenheit gleich, dann neueste zuerst
            return b.createdAt - a.createdAt;
        });


    // --- 2. VERKAUFEN LISTE (SORTIERT & GESTAPELT) ---
    const rawSellItems = myPets
        .filter(p => !user.team.includes(p.id)) 
        .filter(p => !p.isEgg || (p.isEgg && (p.hatchAt === 0 || !p.hatchAt)))
        .filter(p => checkFilters(p));

    const sellList = [];
    const eggStacks = {};

    rawSellItems.forEach(p => {
        if (p.isEgg) {
            if (!eggStacks[p.rarity]) {
                eggStacks[p.rarity] = { ...p, id: `stack-${p.rarity}`, isStack: true, count: 0, pets: [] };
            }
            eggStacks[p.rarity].count++;
            eggStacks[p.rarity].pets.push(p);
        } else {
            sellList.push(p);
        }
    });

    // Kombinieren und Sortieren nach Seltenheit
    const finalSellList = [...sellList, ...Object.values(eggStacks)].sort((a, b) => {
        const rA = RARITIES[a.rarity]?.id || 0;
        const rB = RARITIES[b.rarity]?.id || 0;
        if (rB !== rA) return rB - rA;
        
        return b.level - a.level; // Bei gleicher Seltenheit: Level (nur bei Pets relevant)
    });


    // --- ACTIONS ---
    const handleSellSubmit = () => {
        if (!selectedForSale || !sellPrice || isNaN(sellPrice) || sellPrice <= 0) return;
        const price = parseInt(sellPrice);

        if (selectedForSale.isStack) {
            const qty = Math.max(1, Math.min(sellQuantity, selectedForSale.count));
            const petsToSell = selectedForSale.pets.slice(0, qty);
            petsToSell.forEach(p => onSell(p.id, price));
        } else {
            onSell(selectedForSale.id, price);
        }

        setSelectedForSale(null);
        setSellPrice('');
        setSellQuantity(1);
    }

    const toggleSaleSelection = (item) => {
        if (selectedForSale?.id === item.id) { 
            setSelectedForSale(null); setSellPrice(''); setSellQuantity(1); 
        } else { 
            setSelectedForSale(item); setSellPrice(''); setSellQuantity(1); 
        }
    };

    const resetFilters = () => { setSearchTerm(''); setFilterRarity('ALL'); setFilterType('ALL'); setMinPrice(''); setMaxPrice(''); };
    const activeFilterCount = (filterRarity !== 'ALL' ? 1 : 0) + (filterType !== 'ALL' ? 1 : 0) + (minPrice || maxPrice ? 1 : 0) + (searchTerm ? 1 : 0);

    // --- CARD COMPONENT ---
    const MarketCard = ({ pet, price, seller, isSelected, onClickCard, onClickAction }) => {
        const rarity = RARITIES[pet.rarity] || RARITIES.COMMON;
        const isEgg = pet.isEgg;
        const type = isEgg ? null : (TYPES[pet.type] || TYPES.FIRE);
        const isStack = pet.isStack; 
        
        const speciesInfo = ZODIAC_ANIMALS[pet.species] || { label: 'Unbekannt' };

        return (
            <div className={`bg-slate-800 rounded-2xl border-2 transition-all overflow-hidden ${isSelected ? 'border-green-500 shadow-lg shadow-green-900/20' : 'border-white/5 hover:bg-slate-750'} group`}>
                 <div className="p-3 flex items-center gap-4 relative">
                    
                    <div className="flex-1 flex items-center gap-4 cursor-pointer" onClick={() => { if (!isEgg && onClickCard) onClickCard(); }}>
                        <div className="relative shrink-0">
                            <div className={`absolute -inset-2 ${isEgg ? 'bg-slate-700' : type.bg} opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity`}></div>
                            {isEgg ? (
                                <div className="w-16 h-16 flex items-center justify-center relative z-10"><Egg className={`w-12 h-12 ${rarity.color} drop-shadow-md`} /></div>
                            ) : (
                                <PetAvatar pet={pet} className="w-16 h-16 relative z-10 drop-shadow-md" />
                            )}
                            {!isEgg && <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded border border-white/10 z-20">Lvl {pet.level}</div>}
                            {isStack && <div className="absolute -top-1 -right-1 bg-white text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg z-20">x{pet.count}</div>}
                            {!isStack && isEgg && <div className="absolute -bottom-1 -right-1 bg-slate-950 text-slate-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-white/10 z-20">EI</div>}
                            {!isEgg && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30"><div className="bg-black/60 p-1 rounded-full backdrop-blur-sm"><Eye className="w-4 h-4 text-white" /></div></div>}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className={`font-black text-sm truncate ${isSelected ? 'text-green-400' : (isEgg ? 'text-white' : rarity.color)}`}>
                                    {isStack ? `${rarity.label}e Eier` : (isEgg ? 'Mysteriöses Ei' : pet.name)}
                                </h3>
                                <span className={`text-[9px] ${rarity.color} font-bold uppercase bg-black/30 px-1.5 py-0.5 rounded`}>{rarity.label}</span>
                            </div>

                            {isEgg ? (
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 bg-slate-900/50 p-1.5 rounded border border-white/5 w-fit">
                                    <HelpCircle className="w-3 h-3" />
                                    <span className="font-mono text-[10px]">Inhalt unbekannt</span>
                                </div>
                            ) : (
                                <div className="flex gap-2 mt-1 text-[10px] text-slate-400 font-mono flex-wrap">
                                    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/20 ${type.color} uppercase font-bold border border-white/5`}>{type.label}</span>
                                    <span className="flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded"><Swords className="w-2.5 h-2.5 text-red-400" />{pet.atk}</span>
                                    <span className="flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded"><Heart className="w-2.5 h-2.5 text-green-400" />{pet.hp}</span>
                                </div>
                            )}
                            {seller && <div className="text-[10px] text-slate-600 mt-1 truncate">Verkäufer: {seller}</div>}
                        </div>
                    </div>

                    <div onClick={onClickAction} className="cursor-pointer pl-2 border-l border-white/5 flex flex-col items-center justify-center min-w-[60px]">
                        {price ? (
                            <div className="bg-yellow-500 hover:bg-yellow-400 transition-colors text-black font-black px-3 py-2 rounded-xl text-xs shadow-lg flex flex-col items-center gap-0.5 active:scale-95">
                                <Coins className="w-4 h-4 fill-black/20" /> <span>{price}</span>
                            </div>
                        ) : (
                            <div className={`p-2 rounded-full ${isSelected ? 'bg-green-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                                <DollarSign className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                 </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">
            {viewingPetDetails && (<MarketDetailModal pet={viewingPetDetails.pet} price={viewingPetDetails.price} isOwner={viewingPetDetails.isOwner} onBuy={viewingPetDetails.onBuy} onClose={() => setViewingPetDetails(null)} />)}
            
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative w-4/5 max-w-xs bg-slate-900 h-full shadow-2xl p-5 flex flex-col gap-6 border-r border-white/10 animate-in slide-in-from-left duration-300">
                        {/* Sidebar Content gekürzt... */}
                        <div className="flex justify-between items-center pb-4 border-b border-white/10"><h2 className="text-xl font-black text-white flex items-center gap-2"><Filter className="w-5 h-5 text-cyan-400" /> FILTER</h2><button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
                        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                             <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Suche</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" placeholder="Name, Art..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500" /></div></div>
                             {activeTab === 'buy' && (<div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Preis</label><div className="flex gap-2 items-center"><input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-3 text-sm text-white outline-none focus:border-cyan-500" /><span className="text-slate-500">-</span><input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-3 text-sm text-white outline-none focus:border-cyan-500" /></div></div>)}
                             <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Seltenheit</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setFilterRarity('ALL')} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${filterRarity === 'ALL' ? 'bg-white text-black border-white' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Alle</button>{Object.keys(RARITIES).map(key => (<button key={key} onClick={() => setFilterRarity(key)} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${filterRarity === key ? `${RARITIES[key].bg} text-white border-white/50` : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{RARITIES[key].label}</button>))}</div></div>
                             <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Element (Nur Pets)</label><div className="grid grid-cols-4 gap-2"><button onClick={() => setFilterType('ALL')} className={`aspect-square rounded-xl border flex items-center justify-center font-bold text-[10px] ${filterType === 'ALL' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>ALL</button>{Object.keys(TYPES).map(k => (<button key={k} onClick={() => setFilterType(k)} className={`aspect-square rounded-xl border flex items-center justify-center ${filterType === k ? `${TYPES[k].bg} text-white border-transparent` : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{TYPES[k].icon}</button>))}</div></div>
                        </div>
                        <div className="pt-4 border-t border-white/10"><button onClick={resetFilters} className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm mb-3">Filter zurücksetzen</button><button onClick={() => setSidebarOpen(false)} className="w-full py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-900/20">Fertig</button></div>
                    </div>
                </div>
            )}

            <div className="relative flex items-center justify-between mb-4 pt-2 px-4">
                 <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-xl border transition-all relative ${activeFilterCount > 0 ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400'}`}><Filter className="w-5 h-5" />{activeFilterCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-cyan-600 rounded-full flex items-center justify-center text-[9px] font-bold">{activeFilterCount}</div>}</button>
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">MARKT</h1>
                <button onClick={onBack} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="px-4 mb-4">
                <div className="flex p-1 bg-slate-800 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('buy')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'buy' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>KAUFEN</button>
                    <button onClick={() => setActiveTab('sell')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'sell' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>VERKAUFEN</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
                {activeTab === 'buy' && (
                    <div className="grid grid-cols-1 gap-3">
                        {buyList.length === 0 ? (
                            <div className="text-center text-slate-500 py-20"><Store className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="font-bold">Keine Angebote.</p></div>
                        ) : (
                            buyList.map(listing => (
                                <MarketCard 
                                    key={listing.id} 
                                    pet={listing.pet} 
                                    price={listing.price} 
                                    seller={listing.sellerName}
                                    quantity={listing.quantity}
                                    onClickCard={() => setViewingPetDetails({ 
                                        pet: listing.pet, 
                                        price: listing.price, 
                                        isOwner: listing.sellerId === user.id,
                                        onBuy: () => { onBuy(listing.id); setViewingPetDetails(null); }
                                    })}
                                    onClickAction={() => onBuy(listing.id)}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'sell' && (
                    <div className="grid grid-cols-1 gap-3">
                         <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl flex items-center gap-3 mb-2"><Info className="w-5 h-5 text-blue-400 shrink-0" /><p className="text-xs text-blue-200">Gebühr: 5% des Verkaufspreises werden vom Erlös abgezogen.</p></div>
                        {finalSellList.length === 0 ? (
                            <div className="text-center text-slate-500 py-20"><Tag className="w-16 h-16 mx-auto mb-4 opacity-20" /><p className="font-bold">Nichts zu verkaufen.</p></div>
                        ) : (
                            finalSellList.map(item => {
                                const isSelected = selectedForSale?.id === item.id;
                                return (
                                    <div key={item.id}>
                                        <MarketCard 
                                            pet={item} 
                                            isSelected={isSelected}
                                            onClickCard={() => setViewingPetDetails({ pet: item, isOwner: true })}
                                            onClickAction={() => toggleSaleSelection(item)}
                                        />
                                        {isSelected && (
                                            <div className="p-3 mt-[-4px] mx-0.5 border-x border-b border-green-500/30 rounded-b-2xl bg-slate-900/80 animate-in slide-in-from-top-2 mb-3">
                                                
                                                {/* MENGEN AUSWAHL (Nur bei Stacks) */}
                                                {item.isStack && item.count > 1 && (
                                                    <div className="flex items-center justify-between mb-3 bg-black/30 p-2 rounded-xl"><span className="text-xs font-bold text-slate-400 ml-2">Menge:</span><div className="flex items-center gap-3"><button onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))} className="p-1 bg-slate-700 rounded hover:bg-slate-600"><Minus className="w-4 h-4 text-white" /></button><span className="font-black text-white w-6 text-center">{sellQuantity}</span><button onClick={() => setSellQuantity(Math.min(item.count, sellQuantity + 1))} className="p-1 bg-slate-700 rounded hover:bg-slate-600"><Plus className="w-4 h-4 text-white" /></button></div></div>
                                                )}

                                                <div className="flex gap-2 items-center">
                                                    <div className="relative flex-1"><div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Coins className="w-4 h-4 text-yellow-500" /></div><input type="number" placeholder="Stückpreis" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-green-500 font-bold" autoFocus /></div>
                                                    <button onClick={handleSellSubmit} className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-lg active:scale-95">OK</button>
                                                </div>
                                                {sellPrice && !isNaN(sellPrice) && (<p className="text-[10px] text-slate-400 mt-2 text-center">Gesamt-Erlös: <span className="text-yellow-400 font-bold">{Math.floor(sellPrice * 0.95) * sellQuantity}</span></p>)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}