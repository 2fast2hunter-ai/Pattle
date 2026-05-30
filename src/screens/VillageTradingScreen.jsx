import React, { useState, useMemo } from 'react';
import { ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import { RESOURCE_ITEMS, TRADE_RECIPES, RESOURCES } from '../data/gameData';

export default function VillageTradingScreen({ user, onBack, onTrade, t }) { // t prop added
    const [selectedOffer, setSelectedOffer] = useState(null); // Item ID
    const [selectedWant, setSelectedWant] = useState(null); // Item ID
    const [tradesCount, setTradesCount] = useState(1); // Wie oft das Rezept ausführen?

    const storage = user.village.storage || {};

    // Flache Liste aller Items
    const allItems = useMemo(() => {
        let items = [];
        Object.entries(RESOURCE_ITEMS).forEach(([catKey, list]) => {
            const itemsWithCat = list.map(i => ({ ...i, category: catKey }));
            items.push(...itemsWithCat);
        });
        return items;
    }, []);

    // Liste der Items, die man für das gewählte Angebot bekommen kann
    const availableTargets = useMemo(() => {
        if (!selectedOffer) return [];
        // Finde alle Rezepte wo offerId = selectedOffer
        const recipes = TRADE_RECIPES.filter(r => r.offerId === selectedOffer);
        // Mappe auf Item-Objekte
        return recipes.map(r => allItems.find(i => i.id === r.wantId)).filter(Boolean);
    }, [selectedOffer, allItems]);

    // Aktuelles Rezept finden
    const currentRecipe = useMemo(() => {
        if (!selectedOffer || !selectedWant) return null;
        return TRADE_RECIPES.find(r => r.offerId === selectedOffer && r.wantId === selectedWant);
    }, [selectedOffer, selectedWant]);

    // Max mögliche Trades berechnen
    const maxTrades = currentRecipe ? Math.floor((storage[selectedOffer] || 0) / currentRecipe.cost) : 0;

    const handleTrade = () => {
        if (selectedOffer && selectedWant && tradesCount > 0) {
            onTrade(selectedOffer, selectedWant, tradesCount);
            setTradesCount(1);
            // Optional: Reset selection wenn leer?
        }
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            <div className="relative flex items-center justify-center mb-4 pt-2 px-4 shrink-0 z-10">
                <h2 className="text-2xl font-black italic tracking-wide text-white">HANDELSPOSTEN</h2>
                <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"><ArrowLeft className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-6">
                
                {/* OFFER SECTION (Was ich gebe) */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 pl-1">Dein Angebot (aus Lager)</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                        {allItems.map(item => {
                            const count = storage[item.id] || 0;
                            // Nur anzeigen, wenn man es besitzt UND es Rezepte dafür gibt
                            const hasRecipes = TRADE_RECIPES.some(r => r.offerId === item.id);
                            if (count === 0 || !hasRecipes) return null;

                            return (
                                <button 
                                    key={item.id} 
                                    onClick={() => { setSelectedOffer(item.id); setSelectedWant(null); setTradesCount(1); }}
                                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${selectedOffer === item.id ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-white/5 hover:bg-slate-700'}`}
                                >
                                    <div className={`w-6 h-6 rounded bg-slate-900 flex items-center justify-center ${item.color} font-bold text-xs`}>?</div>
                                    <div className="text-[9px] font-bold text-white truncate w-full">{t ? t('item_' + item.id) : item.label}</div>
                                    <div className="text-[8px] text-slate-400">x{count}</div>
                                </button>
                            );
                        })}
                    </div>
                    {Object.keys(storage).length === 0 && <div className="text-slate-500 text-xs text-center py-4">Lager ist leer.</div>}
                </div>

                {/* WANT SECTION (Was ich haben will - Gefiltert!) */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 pl-1">{t ? t('trade_you_receive') : 'You receive'}</h3>
                    {availableTargets.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                            {availableTargets.map(item => {
                                // Unlock Check
                                const resConfig = RESOURCES[item.category.toUpperCase()];
                                if (user.level < resConfig.unlockLevel) return null; // Versteckt wenn Level zu niedrig

                                return (
                                    <button 
                                        key={item.id} 
                                        onClick={() => setSelectedWant(item.id)}
                                        className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${selectedWant === item.id ? 'bg-green-600 border-green-400' : 'bg-slate-800 border-white/5 hover:bg-slate-700'}`}
                                    >
                                        <div className={`w-6 h-6 rounded bg-slate-900 flex items-center justify-center ${item.color} font-bold text-xs`}>?</div>
                                        <div className="text-[9px] font-bold text-white truncate w-full">{t ? t('item_' + item.id) : item.label}</div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-slate-500 text-xs text-center py-4 italic">
                            {selectedOffer ? (t ? t('trade_no_partners') : 'No trade partners (level too low?)') : (t ? t('trade_select_first') : 'Select an offer first.')}
                        </div>
                    )}
                </div>

                {/* CONTROLS */}
                {currentRecipe && (
                    <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                                <div className="text-xl font-black text-white">{currentRecipe.cost * tradesCount}</div>
                                <div className="text-[10px] text-slate-500 uppercase">{t ? t('trade_give') : 'GIVE'}</div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-600" />
                            <div className="text-center">
                                <div className={`text-xl font-black ${tradesCount > 0 ? 'text-green-400' : 'text-red-400'}`}>{currentRecipe.receive * tradesCount}</div>
                                <div className="text-[10px] text-slate-500 uppercase">{t ? t('trade_receive') : 'RECEIVE'}</div>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <input 
                                type="range" 
                                min="1" 
                                max={maxTrades} 
                                value={tradesCount} 
                                onChange={(e) => setTradesCount(parseInt(e.target.value))} 
                                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                disabled={maxTrades === 0}
                            />
                            <div className="text-center text-xs text-slate-400 mt-1">{tradesCount} / {maxTrades} {t ? t('trade_possible') : 'available'}</div>
                        </div>

                        <button 
                            onClick={handleTrade}
                            disabled={maxTrades < 1}
                            className={`w-full py-3 rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 ${maxTrades >= 1 ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        >
                            <RefreshCw className="w-4 h-4" /> {t ? t('trade_action') : 'TRADE'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}