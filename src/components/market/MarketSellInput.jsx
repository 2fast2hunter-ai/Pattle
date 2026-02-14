import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { RARITIES } from '../../data/gameData';

export default function MarketSellInput({
    selectedForSale, sellPrice, setSellPrice, sellQuantity, setSellQuantity,
    handleSellSubmit, t
}) {
    if (!selectedForSale) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-white/10 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col gap-3 max-w-md mx-auto">
                <div className="flex justify-between text-sm font-bold text-white items-center">
                    <span>Verkaufe: <span className={selectedForSale.color || 'text-white'}>
                        {selectedForSale.isResource
                            ? (t ? t('item_' + selectedForSale.id) : selectedForSale.label)
                            : (selectedForSale.isEgg
                                ? (t ? `${t('rarity_' + selectedForSale.rarity)} ${t('inv_egg_suffix')}` : `${RARITIES[selectedForSale.rarity].label} Ei`)
                                : (selectedForSale.name || selectedForSale.label))
                        }
                    </span></span>

                    {(selectedForSale.isStack || selectedForSale.isResource) && (
                        <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1 border border-white/10">
                            <button
                                onClick={() => setSellQuantity(Math.max(1, (parseInt(sellQuantity) || 0) - 1))}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            <input
                                type="number"
                                value={sellQuantity}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setSellQuantity('');
                                    } else {
                                        const num = parseInt(val);
                                        if (!isNaN(num)) setSellQuantity(num);
                                    }
                                }}
                                onBlur={() => {
                                    let val = parseInt(sellQuantity);
                                    if (isNaN(val) || val < 1) val = 1;
                                    if (val > selectedForSale.count) val = selectedForSale.count;
                                    setSellQuantity(val);
                                }}
                                className="w-12 bg-transparent text-center font-bold text-white outline-none appearance-none"
                            />

                            <button
                                onClick={() => setSellQuantity(Math.min(selectedForSale.count, (parseInt(sellQuantity) || 0) + 1))}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="number"
                            placeholder="Preis (Gesamt)"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            className="bg-slate-800 border border-white/10 rounded-xl p-3 pl-4 text-white font-bold w-full outline-none focus:border-green-500 transition-colors"
                            autoFocus
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">GOLD</span>
                    </div>
                    <button onClick={handleSellSubmit} className="bg-green-600 hover:bg-green-500 text-white font-black px-6 rounded-xl shadow-lg active:scale-95 transition-all">OK</button>
                </div>
            </div>
        </div>
    );
}
