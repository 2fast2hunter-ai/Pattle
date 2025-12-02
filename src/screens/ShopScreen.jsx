import React, { useState } from 'react';
import { ArrowLeft, Package, Coins, Star, Gem, Ticket, Zap, X, PlayCircle, Info, Percent } from 'lucide-react';
import { SHOP_ITEMS, RARITIES } from '../data/gameData'; 

export default function ShopScreen({ onBack, onBuyBox, onBuyTickets, onWatchAd, user }) { 
    const adReward = SHOP_ITEMS.AD_REWARD_ENERGY;
    const maxEnergy = user?.level ? (10 + ((user.level - 1) * 2)) : 10;
    const isEnergyFull = (user?.energy || 0) >= maxEnergy;

    // State für das Detail-Modal
    const [viewingBox, setViewingBox] = useState(null); // 'STANDARD' | 'PREMIUM'

    // --- HELPER: Drop-Chancen berechnen ---
    const getDropRates = (boxType) => {
        const rates = [];
        let remainingChance = 100;
        
        // Sortierung von Hoch zu Niedrig (für die Anzeige schöner)
        const rarities = Object.values(RARITIES).sort((a, b) => b.id - a.id);

        rarities.forEach(rarity => {
            let chance = 0;

            if (boxType === 'STANDARD') {
                chance = rarity.dropChance;
            } else if (boxType === 'PREMIUM') {
                // Premium Logik (Kein Common, Rest x1.6)
                if (rarity.id === 1) {
                    chance = 0; // Common gibt es nicht
                } else if (rarity.id === 2) {
                    // Uncommon ist der "Rest"-Topf im Code (Fallback), 
                    // aber für die Anzeige berechnen wir es als 100% - Summe der anderen
                    // (wird am Ende korrigiert)
                    chance = 0; 
                } else {
                    chance = rarity.dropChance * 1.6;
                }
            }
            
            if (rarity.id !== 2) { // Uncommon (Fallback) später berechnen für Premium
                 rates.push({ ...rarity, chance });
                 if (boxType === 'PREMIUM') remainingChance -= chance;
            }
        });

        // Uncommon für Premium hinzufügen (den Rest)
        // Oder für Standard einfach den Standard-Wert
        const uncommon = RARITIES.UNCOMMON;
        if (boxType === 'PREMIUM') {
             rates.push({ ...uncommon, chance: Math.max(0, remainingChance) });
        } else {
             // Standard Uncommon einfach einsortieren
             // (Da wir oben sortiert haben und Uncommon übersprungen haben, müssen wir es jetzt korrekt einfügen oder die Logik oben anpassen.
             // Einfacher: Wir bauen die Liste neu.)
             return Object.values(RARITIES).sort((a,b) => b.id - a.id).map(r => ({
                 ...r,
                 chance: r.dropChance
             }));
        }

        // Sortieren nach ID absteigend
        return rates.sort((a, b) => b.id - a.id);
    };

    const handleBuy = (boxType, cost, currency) => {
        onBuyBox(boxType, cost, currency);
        setViewingBox(null); // Modal schließen nach Kauf
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">
            
            {/* --- BOX DETAIL MODAL --- */}
            {viewingBox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in-50">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-0 relative overflow-hidden flex flex-col max-h-[80vh]">
                        
                        {/* Header Bild */}
                        <div className="relative h-32 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                            <div className={`absolute inset-0 ${viewingBox === 'PREMIUM' ? 'bg-purple-500/20' : 'bg-yellow-500/10'} blur-3xl`}></div>
                            <Package className={`w-20 h-20 ${viewingBox === 'PREMIUM' ? 'text-purple-400' : 'text-yellow-500'} drop-shadow-2xl relative z-10`} />
                            <button onClick={() => setViewingBox(null)} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors z-20"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Inhalt */}
                        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
                            <h2 className="text-2xl font-black text-white mb-1 uppercase text-center">{viewingBox} BOX</h2>
                            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                {viewingBox === 'PREMIUM' ? 'Keine Gewöhnlichen Pets!' : 'Der Klassiker'}
                            </p>

                            {/* Wahrscheinlichkeiten Tabelle */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 mb-2 text-slate-500">
                                    <Percent className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Wahrscheinlichkeiten</span>
                                </div>
                                <div className="bg-slate-950/50 rounded-xl p-2 border border-white/5 space-y-1">
                                    {getDropRates(viewingBox).map((rate) => (
                                        rate.chance > 0 && (
                                            <div key={rate.id} className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-white/5 transition-colors">
                                                <span className={`text-xs font-bold ${rate.color} uppercase tracking-wider`}>{rate.label}</span>
                                                <span className="text-xs font-mono text-slate-300">
                                                    {rate.chance < 0.01 ? '< 0.01' : rate.chance.toFixed(2)}%
                                                </span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer: Kaufen Button */}
                        <div className="p-4 bg-slate-900 border-t border-white/5 shrink-0">
                            <button 
                                onClick={() => viewingBox === 'PREMIUM' ? handleBuy('PREMIUM', 50, 'GEMS') : handleBuy('STANDARD', 500, 'COINS')} 
                                className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                                    viewingBox === 'PREMIUM' 
                                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-purple-900/30 hover:brightness-110' 
                                    : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-900/20'
                                }`}
                            >
                                {viewingBox === 'PREMIUM' ? <Gem className="w-4 h-4 fill-white/20" /> : <Coins className="w-4 h-4 fill-black/20" />}
                                FÜR {viewingBox === 'PREMIUM' ? '50 KAUFEN' : '500 KAUFEN'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- HEADER --- */}
            <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                    ITEM SHOP
                </h1>
                <button 
                    onClick={onBack} 
                    className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">

                {/* 1. GRATIS ENERGIE */}
                <div className="relative overflow-hidden rounded-3xl p-0.5 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-900/20 group">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <div className="bg-slate-900 rounded-[22px] p-5 relative">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse"/> GRATIS ENERGIE
                                </h3>
                                <p className="text-xs text-emerald-200 font-bold mt-1">Fülle deine Energie auf!</p>
                            </div>
                            <div className="bg-slate-800 p-2 rounded-xl border border-white/10">
                                <PlayCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 flex items-center justify-between border border-white/5">
                            <span className="text-xs text-slate-400 font-bold uppercase">Belohnung</span>
                            <span className="text-lg font-black text-white flex items-center gap-1">
                                +{adReward.rewardAmount} <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </span>
                        </div>

                        <button 
                            onClick={onWatchAd} 
                            disabled={isEnergyFull}
                            className={`
                                w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95
                                ${isEnergyFull 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                                }
                            `}
                        >
                            {isEnergyFull ? 'ENERGIE IST VOLL' : 'VIDEO ANSEHEN'}
                        </button>
                    </div>
                </div>

                {/* 2. LOOTBOXEN */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-yellow-500">
                        <Package className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Lootboxen</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {/* PREMIUM BOX (Klick öffnet jetzt Details) */}
                        <div 
                            onClick={() => setViewingBox('PREMIUM')}
                            className="relative overflow-hidden rounded-3xl p-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-900/30 group cursor-pointer transition-transform active:scale-95"
                        >
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            
                            <div className="bg-slate-900/90 backdrop-blur-sm rounded-[22px] p-5 relative overflow-hidden">
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <div className="inline-flex items-center gap-1 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded mb-2 shadow-sm">
                                            <Star className="w-3 h-3 fill-black" /> BESTSELLER
                                        </div>
                                        <h3 className="text-2xl font-black text-white italic">PREMIUM BOX</h3>
                                        <p className="text-xs text-indigo-200 font-bold mt-1 max-w-[140px]">Hohe Chance auf seltene & epische Pets!</p>
                                    </div>
                                    <Package className="w-24 h-24 text-indigo-300 drop-shadow-[0_0_15px_rgba(167,139,250,0.6)] group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                                    <div className="flex items-center gap-1 text-purple-300 text-xs font-bold">
                                        <Info className="w-4 h-4" /> Infos & Chancen
                                    </div>
                                    <div className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-lg">
                                        <Gem className="w-3 h-3 text-purple-400" /> 
                                        <span className="font-bold text-white text-xs">50</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STANDARD BOX */}
                        <div 
                            onClick={() => setViewingBox('STANDARD')}
                            className="bg-slate-800 border-2 border-slate-700 rounded-3xl p-5 relative overflow-hidden group hover:border-slate-600 transition-all cursor-pointer active:scale-95"
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="text-xl font-black text-white">STANDARD BOX</h3>
                                    <p className="text-xs text-slate-400 font-bold mt-1">Der klassische Einstieg.</p>
                                </div>
                                <Package className="w-16 h-16 text-slate-500 group-hover:text-slate-400 transition-colors" />
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                                    <Info className="w-4 h-4" /> Infos & Chancen
                                </div>
                                <div className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-lg">
                                    <Coins className="w-3 h-3 text-yellow-500" /> 
                                    <span className="font-bold text-white text-xs">500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. ZUCHT TICKETS */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-pink-400">
                        <Ticket className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Zucht-Tickets</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {/* Coins Bundle */}
                        <div className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:bg-slate-750 transition-colors group">
                            <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Ticket className="w-6 h-6 text-pink-500" />
                            </div>
                            <div className="mb-3">
                                <div className="font-bold text-white text-sm">Einzelticket</div>
                                <div className="text-[10px] text-slate-500">Für 1x Zucht</div>
                            </div>
                            <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_COINS)} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform">
                                <Coins className="w-3 h-3 fill-black/20" /> {SHOP_ITEMS.TICKET_BUNDLE_COINS.costAmount}
                            </button>
                        </div>

                        {/* Gems Bundle */}
                        <div className="bg-slate-800 p-4 rounded-2xl border border-pink-500/20 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-black px-2 py-1 rounded-bl-lg">DEAL</div>
                            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-pink-500/30">
                                <Ticket className="w-6 h-6 text-pink-400" />
                            </div>
                            <div className="mb-3">
                                <div className="font-bold text-white text-sm">5er Pack</div>
                                <div className="text-[10px] text-slate-500">Vorrat anlegen</div>
                            </div>
                            <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_GEMS)} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-lg shadow-pink-900/20">
                                <Gem className="w-3 h-3 fill-white/20" /> {SHOP_ITEMS.TICKET_BUNDLE_GEMS.costAmount}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}