import React, { useState } from 'react';
import { ArrowLeft, Package, Coins, Star, Gem, Ticket, X, Percent, Crown, Sparkles, Box, Lock, PlayCircle } from 'lucide-react';
import { SHOP_ITEMS, LOOTBOXES, RARITIES } from '../data/gameData'; 
import AdModal from '../components/ui/AdModal';
import { showRewardedAd } from '../utils/adManager'; // Importiere unseren neuen Manager

export default function ShopScreen({ onBack, onBuyBox, onBuyTickets, onWatchAd, user }) { 
    const [viewingBox, setViewingBox] = useState(null); 
    
    // State für unser Simulations-Modal (nur für Dev-Mode wichtig)
    const [showDevAdModal, setShowDevAdModal] = useState(false);

    const boxConfig = {
        'DAILY': { color: 'text-sky-300', bg: 'bg-sky-600', icon: Box, border: 'border-sky-400', glow: 'shadow-sky-500/20' },
        'PREMIUM': { color: 'text-purple-300', bg: 'bg-purple-600', icon: Star, border: 'border-purple-400', glow: 'shadow-purple-500/20' },
        'MASTER': { color: 'text-amber-300', bg: 'bg-amber-600', icon: Crown, border: 'border-amber-400', glow: 'shadow-amber-500/20' },
        'DIVINE': { color: 'text-emerald-300', bg: 'bg-emerald-600', icon: Sparkles, border: 'border-emerald-400', glow: 'shadow-emerald-500/20' },
    };

    // Helper: Sortierte Liste der Drops für die Vorschau
    const getDropList = (boxKey) => {
        const box = LOOTBOXES[boxKey];
        if (!box) return [];
        return Object.entries(box.drops)
            .map(([rarityKey, chance]) => ({ 
                ...RARITIES[rarityKey], 
                chance 
            }))
            .sort((a, b) => b.id - a.id); 
    };

    const handleBuy = (boxKey) => {
        onBuyBox(boxKey, LOOTBOXES[boxKey].cost, LOOTBOXES[boxKey].currency);
        setViewingBox(null); 
    };

    const isDailyAvailable = () => {
        const today = new Date().toDateString();
        return user?.lastDailyBoxClaim !== today;
    };

    // --- NEUE AD LOGIK ---
    const handleAdClick = () => {
        showRewardedAd({
            onReward: () => {
                // Diese Funktion wird aufgerufen, wenn die Werbung erfolgreich war
                onWatchAd(); 
            },
            onError: () => {
                alert("Werbung konnte nicht geladen werden. Bitte deaktiviere deinen AdBlocker.");
            },
            onOpenDevModal: () => {
                // Nur für Localhost: Öffne unsere Simulation
                setShowDevAdModal(true);
            }
        });
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">
            
            {/* Nur sichtbar im Dev-Mode durch den Manager gesteuert */}
            {showDevAdModal && (
                <AdModal 
                    onClose={() => setShowDevAdModal(false)} 
                    onReward={() => { 
                        onWatchAd(); // Belohnung im Dev Mode
                    }} 
                />
            )}

            {viewingBox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in-50">
                    <div className={`bg-slate-900 border-2 ${boxConfig[viewingBox].border} w-full max-w-md rounded-[32px] p-0 relative overflow-hidden flex flex-col max-h-[85vh] shadow-2xl`}>
                        
                        <div className="relative h-40 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                            <div className={`absolute inset-0 ${boxConfig[viewingBox].bg} opacity-20 blur-[60px] animate-pulse`}></div>
                            
                            {React.createElement(boxConfig[viewingBox].icon, { 
                                className: `w-24 h-24 ${boxConfig[viewingBox].color} drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10` 
                            })}
                            
                            <button onClick={() => setViewingBox(null)} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors z-20 backdrop-blur-md border border-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
                            <h2 className={`text-2xl font-black ${boxConfig[viewingBox].color} mb-1 uppercase text-center tracking-wide`}>
                                {LOOTBOXES[viewingBox].label}
                            </h2>
                            <div className="flex justify-center mb-6">
                                <div className="bg-slate-950/50 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                                    <Percent className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wahrscheinlichkeiten</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                {getDropList(viewingBox).map((rate) => (
                                    <div key={rate.id} className="flex justify-between items-center px-3 py-2 bg-slate-800/50 rounded-xl border border-white/5">
                                        <span className={`text-xs font-black ${rate.color} uppercase tracking-wider`}>{rate.label}</span>
                                        <span className="text-xs font-mono font-bold text-white">{rate.chance.toFixed(2)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0">
                            <button 
                                onClick={() => handleBuy(viewingBox)} 
                                disabled={viewingBox === 'DAILY' && !isDailyAvailable()}
                                className={`
                                    w-full py-4 rounded-2xl font-black text-sm flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg
                                    ${viewingBox === 'DAILY' 
                                        ? (isDailyAvailable() ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed')
                                        : 'bg-white text-slate-900 hover:bg-slate-200'
                                    }
                                `}
                            >
                                {viewingBox === 'DAILY' ? (
                                    isDailyAvailable() ? 'GRATIS ABHOLEN' : 'SCHON ABGEHOLT'
                                ) : (
                                    <>
                                        <Coins className="w-4 h-4 text-amber-500 fill-amber-500" /> 
                                        {LOOTBOXES[viewingBox].cost.toLocaleString()} KAUFEN
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">ITEM SHOP</h1>
                <button onClick={onBack} className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">

               {/* FREE STUFF */}
               <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <h3 className="font-black text-white text-lg italic uppercase mb-1">Gratis Edelsteine</h3>
                        <div className="flex items-center gap-1 text-pink-300 text-xs font-bold">
                            <PlayCircle className="w-4 h-4" />
                            <span>Video ansehen</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleAdClick} // <-- HIER: Nutzt jetzt den neuen Handler
                        className="relative z-10 bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-black text-xs shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
                    >
                        + {SHOP_ITEMS.AD_REWARD.rewardAmount} <Gem className="w-4 h-4 fill-indigo-900" />
                    </button>
               </div>

                {/* LOOTBOXEN */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-yellow-500 px-1">
                        <Package className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Lootboxen</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        
                        {/* DAILY BOX */}
                        <div onClick={() => setViewingBox('DAILY')} className={`col-span-2 bg-slate-800 border-2 ${isDailyAvailable() ? 'border-sky-500 shadow-sky-900/20' : 'border-slate-700 opacity-80'} rounded-[24px] p-4 relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-lg`}>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10 ${isDailyAvailable() ? 'shadow-lg shadow-sky-500/20' : ''}`}>
                                    {isDailyAvailable() ? <Box className="w-8 h-8 text-sky-400" /> : <Lock className="w-6 h-6 text-slate-600" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-white text-lg italic uppercase">{LOOTBOXES.DAILY.label}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Täglich ein Geschenk</p>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${isDailyAvailable() ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                        {isDailyAvailable() ? 'GRATIS' : 'Abgeholt'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* PREMIUM */}
                        <div onClick={() => setViewingBox('PREMIUM')} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/50 rounded-[24px] p-4 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer hover:border-purple-400 transition-all shadow-lg active:scale-95">
                            <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Star className="w-10 h-10 text-purple-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform" />
                            <h4 className="font-black text-white text-sm uppercase mb-1">{LOOTBOXES.PREMIUM.label}</h4>
                            <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5">
                                <Coins className="w-3 h-3 text-amber-400" />
                                <span className="text-xs font-black text-white">{LOOTBOXES.PREMIUM.cost}</span>
                            </div>
                        </div>

                        {/* MASTER */}
                        <div onClick={() => setViewingBox('MASTER')} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/50 rounded-[24px] p-4 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer hover:border-amber-400 transition-all shadow-lg active:scale-95">
                            <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Crown className="w-10 h-10 text-amber-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform" />
                            <h4 className="font-black text-white text-sm uppercase mb-1">{LOOTBOXES.MASTER.label}</h4>
                            <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5">
                                <Coins className="w-3 h-3 text-amber-400" />
                                <span className="text-xs font-black text-white">{LOOTBOXES.MASTER.cost}</span>
                            </div>
                        </div>

                        {/* DIVINE */}
                        <div onClick={() => setViewingBox('DIVINE')} className="col-span-2 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/60 rounded-[24px] p-1 relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-lg shadow-emerald-900/20">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-xl animate-pulse"></div>
                            <div className="bg-slate-900/80 backdrop-blur-md rounded-[20px] p-4 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                                        <Sparkles className="w-7 h-7 text-emerald-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg italic uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400">
                                            {LOOTBOXES.DIVINE.label}
                                        </h4>
                                        <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">Höchste Chance auf Mythics!</p>
                                    </div>
                                </div>
                                <div className="bg-slate-950 px-4 py-2 rounded-xl border border-emerald-500/30 flex flex-col items-end">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Preis</span>
                                    <div className="flex items-center gap-1.5">
                                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-sm font-black text-white">{LOOTBOXES.DIVINE.cost.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* TICKETS */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-pink-400 px-1">
                        <Ticket className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Zucht-Tickets</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:bg-slate-750 transition-colors group">
                            <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center mb-2"><Ticket className="w-5 h-5 text-pink-500" /></div>
                            <div className="mb-2"><div className="font-bold text-white text-xs">Einzelticket</div></div>
                            <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_COINS)} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform"><Coins className="w-3 h-3 fill-black/20" /> {SHOP_ITEMS.TICKET_BUNDLE_COINS.costAmount}</button>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl border border-pink-500/20 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-black px-2 py-1 rounded-bl-lg">DEAL</div>
                            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center mb-2 border border-pink-500/30"><Ticket className="w-5 h-5 text-pink-400" /></div>
                            <div className="mb-2"><div className="font-bold text-white text-xs">5er Pack</div></div>
                            <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_GEMS)} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-lg"><Gem className="w-3 h-3 fill-white/20" /> {SHOP_ITEMS.TICKET_BUNDLE_GEMS.costAmount}</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}