import React from 'react';
import { ArrowLeft, X, Info } from 'lucide-react';
import MarketDetailModal from '../components/market/MarketDetailModal';
import MarketCard from '../components/market/MarketCard';
import SellCard from '../components/market/SellCard';
import MarketSellInput from '../components/market/MarketSellInput';
import { useMarketplace } from '../hooks/useMarketplace';

export default function MarketplaceScreen({ user, listings, onBack, onBuy, onSell, onSellResource, onRemoveListing, myPets, t }) {
    const {
        activeTab, setActiveTab, subTab, setSubTab,
        sellPrice, setSellPrice, sellQuantity, setSellQuantity,
        selectedForSale, viewingPetDetails, setViewingPetDetails,
        buyList, sellPetsList, sellItemsList,
        handleSellSubmit, toggleSaleSelection
    } = useMarketplace(user, listings, myPets, onSell, onSellResource);

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
                            <MarketCard key={l.id} listing={l} isOwner={l.sellerId === user.id} onClickAction={() => onBuy(l.id)} onRemoveListing={onRemoveListing} setViewingPetDetails={setViewingPetDetails} t={t} />
                        ))}
                    </div>
                )}

                {activeTab === 'sell' && (
                    <div className="space-y-3">
                        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl flex items-center gap-3 mb-2"><Info className="w-5 h-5 text-blue-400 shrink-0" /><p className="text-xs text-blue-200">Gebühr: 100 Gold pro Angebot.</p></div>
                        {subTab === 'pets' && sellPetsList.map(item => <SellCard key={item.id} item={item} isSelected={selectedForSale?.id === item.id} onToggle={toggleSaleSelection} t={t} />)}
                        {subTab === 'items' && sellItemsList.map(item => <SellCard key={item.id} item={item} isSelected={selectedForSale?.id === item.id} onToggle={toggleSaleSelection} t={t} />)}
                        <MarketSellInput
                            selectedForSale={selectedForSale} sellPrice={sellPrice} setSellPrice={setSellPrice}
                            sellQuantity={sellQuantity} setSellQuantity={setSellQuantity} handleSellSubmit={handleSellSubmit} t={t}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
