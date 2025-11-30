import React, { useState } from 'react';
import { ArrowLeft, Filter, X, Store, Coins, Tag, DollarSign, Egg } from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS } from '../data/gameData';

export default function MarketplaceScreen({ user, listings, onBack, onBuy, onSell, myPets }) {
    const [activeTab, setActiveTab] = useState('buy'); 
    const [sellPrice, setSellPrice] = useState('');
    const [selectedForSale, setSelectedForSale] = useState(null);
    const [filterRarity, setFilterRarity] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSellSubmit = () => {
        if (!selectedForSale || !sellPrice || isNaN(sellPrice) || sellPrice <= 0) return;
        onSell(selectedForSale.id, parseInt(sellPrice));
        setSelectedForSale(null);
        setSellPrice('');
    }

    const sellablePets = myPets.filter(p => !user.team.includes(p.id) && p.hatchAt === 0);

    const filteredListings = listings.filter(listing => {
        if (filterRarity !== 'ALL' && listing.pet.rarity !== filterRarity) return false;
        if (filterType !== 'ALL' && listing.pet.type !== filterType) return false;
        if (minPrice !== '' && listing.price < parseInt(minPrice)) return false;
        if (maxPrice !== '' && listing.price > parseInt(maxPrice)) return false;
        return true;
    });

    const resetFilters = () => {
        setFilterRarity('ALL'); setFilterType('ALL'); setMinPrice(''); setMaxPrice('');
    }

    return (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic text-cyan-400">MARKTPLATZ</h2></div>
            <div className="flex justify-between items-center">
                <div className="flex p-1 bg-slate-800 rounded-xl flex-1 mr-2">
                    <button onClick={() => setActiveTab('buy')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'buy' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>KAUFEN</button>
                    <button onClick={() => setActiveTab('sell')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'sell' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>VERKAUFEN</button>
                </div>
                {activeTab === 'buy' && (
                    <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl border transition-colors ${showFilters ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400'}`}><Filter className="w-5 h-5" /></button>
                )}
            </div>
            {activeTab === 'buy' && showFilters && (
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Seltenheit</label>
                            <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500">
                                <option value="ALL">Alle</option>
                                {Object.keys(RARITIES).map(key => (<option key={key} value={key}>{RARITIES[key].label}</option>))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Typ</label>
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500">
                                <option value="ALL">Alle</option>
                                {Object.keys(TYPES).map(key => (<option key={key} value={key}>{TYPES[key].label}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Preis</label>
                        <div className="flex gap-2 items-center">
                            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500" />
                            <span className="text-slate-500">-</span>
                            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-slate-900 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-indigo-500" />
                        </div>
                    </div>
                    <button onClick={resetFilters} className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"><X className="w-3 h-3" /> Filter zurücksetzen</button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto pb-20">
                {activeTab === 'buy' ? (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredListings.length === 0 ? (
                            <div className="text-center text-slate-500 py-20"><Store className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>Keine Angebote gefunden.</p></div>
                        ) : (
                            filteredListings.map(listing => {
                                const rarity = RARITIES[listing.pet.rarity];
                                return (
                                    <div key={listing.id} className="bg-slate-800 p-3 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
                                        <div className={`w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-3xl shadow-inner ${TYPES[listing.pet.type].bgLight}`}>
                                            {listing.pet.isEgg ? <Egg className={rarity.color} /> : ZODIAC_ANIMALS[listing.pet.species].icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div><h3 className="font-bold">{listing.pet.name}</h3><span className={`text-[10px] ${rarity.color} font-bold uppercase`}>{rarity.label} {listing.pet.isEgg ? 'Ei' : 'Pet'}</span></div>
                                                <div className="text-right"><div className="text-xs text-slate-400">Verkäufer</div><div className="text-xs font-bold">{listing.sellerName}</div></div>
                                            </div>
                                            <button onClick={() => onBuy(listing.id)} className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg flex items-center justify-center gap-2 text-xs active:scale-95 transition-transform"><Coins className="w-3 h-3" /> {listing.price} Kaufen</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedForSale && (
                            <div className="bg-slate-800 border border-green-500/30 p-4 rounded-2xl mb-4 animate-in fade-in">
                                <h3 className="font-bold mb-2 text-green-400">Verkaufen: {selectedForSale.name}</h3>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Coins className="w-4 h-4 text-yellow-500" /></div>
                                        <input type="number" placeholder="Preis" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-green-500" />
                                    </div>
                                    <button onClick={handleSellSubmit} className="bg-green-600 text-white font-bold px-4 rounded-xl">OK</button>
                                    <button onClick={() => setSelectedForSale(null)} className="bg-slate-700 text-white px-4 rounded-xl"><X className="w-5 h-5" /></button>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-3">
                            {sellablePets.length === 0 ? (
                                <div className="text-center text-slate-500 py-20"><Tag className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>Keine verkaufbaren Items.</p><p className="text-xs">Lootboxen können nicht verkauft werden.</p></div>
                            ) : (
                                sellablePets.map(pet => {
                                    const rarity = RARITIES[pet.rarity];
                                    return (
                                        <div key={pet.id} onClick={() => setSelectedForSale(pet)} className={`bg-slate-800 p-3 rounded-2xl border-l-4 ${rarity.border} flex items-center gap-4 cursor-pointer transition-all active:scale-95 hover:bg-slate-750 ${selectedForSale?.id === pet.id ? 'ring-2 ring-green-500' : ''}`}>
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner bg-slate-900`}>{pet.isEgg ? <Egg className={rarity.color} /> : ZODIAC_ANIMALS[pet.species].icon}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center"><h3 className="font-bold text-sm">{pet.name}</h3><span className={`text-[10px] ${rarity.color} font-bold`}>{rarity.label}</span></div>
                                                <div className="text-xs text-slate-400 mt-1">{pet.isEgg ? 'Ei' : `Lvl ${pet.level}`} • {pet.isEgg ? 'Schlüpft bald' : `ATK ${pet.atk}`}</div>
                                            </div>
                                            <DollarSign className="text-slate-600" />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}