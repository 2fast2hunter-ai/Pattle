import React from 'react';
import { ArrowLeft, Package, Coins, Star, Gem, Ticket } from 'lucide-react'; // Ticket NEU
import { SHOP_ITEMS } from '../data/gameData'; // SHOP_ITEMS NEU

export default function ShopScreen({ onBack, onBuyBox, onBuyTickets }) { // onBuyTickets NEU
    return (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic text-yellow-400">ITEM SHOP</h2></div>
            
            {/* NEU: TICKET SECTION */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-4">
                <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2"><Ticket className="w-4 h-4 text-pink-400"/> Zucht-Tickets</h3>
                <div className="grid grid-cols-2 gap-3">
                    {/* COINS OFFER */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-white/10 text-center">
                        <Ticket className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-slate-400 mb-2">{SHOP_ITEMS.TICKET_BUNDLE_COINS.label}</p>
                        <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_COINS)} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 text-xs transition-transform active:scale-95"><Coins className="w-3 h-3" /> {SHOP_ITEMS.TICKET_BUNDLE_COINS.costAmount}</button>
                    </div>
                    {/* GEMS OFFER */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-white/10 text-center">
                        <Ticket className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-slate-400 mb-2">{SHOP_ITEMS.TICKET_BUNDLE_GEMS.label}</p>
                        <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_GEMS)} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 text-xs transition-transform active:scale-95"><Gem className="w-3 h-3" /> {SHOP_ITEMS.TICKET_BUNDLE_GEMS.costAmount}</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* STANDARD BOX */}
                <div className="bg-slate-800 border-2 border-slate-600 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-5 -mt-5"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div><h3 className="text-xl font-bold text-white">Standard Box</h3><p className="text-xs text-slate-400 mt-1">Chance auf Gewöhnlich bis Legendär</p><button onClick={() => onBuyBox('STANDARD', 500, 'COINS')} className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-xl flex items-center gap-2 active:scale-95 transition-transform"><Coins className="w-4 h-4" /> 500</button></div>
                        <Package className="w-20 h-20 text-slate-400" />
                    </div>
                </div>
                {/* PREMIUM BOX */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-indigo-500 rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl -mr-5 -mt-5 animate-pulse"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div><h3 className="text-xl font-bold text-white flex items-center gap-2">Premium Box <Star className="w-4 h-4 text-yellow-400 fill-current"/></h3><p className="text-xs text-indigo-200 mt-1">Höhere Chance auf Selten & Episch!</p><button onClick={() => onBuyBox('PREMIUM', 50, 'GEMS')} className="mt-4 bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 active:scale-95 transition-transform shadow-lg"><Gem className="w-4 h-4" /> 50</button></div>
                        <Package className="w-20 h-20 text-indigo-300 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
                    </div>
                </div>
            </div>
            <div className="mt-8 p-4 bg-black/20 rounded-xl text-[10px] text-slate-500 text-center">
                <p>Drop Rates:</p>
                <p>Gewöhnlich 80.0% • Ungewöhnlich 15.0% • Selten 4.0% • Legendär 0.15%</p>
            </div>
        </div>
    );
}