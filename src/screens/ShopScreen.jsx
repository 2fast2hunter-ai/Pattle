import React, { useState } from 'react';
import { ArrowLeft, Package, Coins, Star, Gem, Ticket, Zap, X, PlayCircle, Info, Percent, Crown, Sparkles } from 'lucide-react';
import { SHOP_ITEMS, RARITIES } from '../data/gameData'; 

export default function ShopScreen({ onBack, onBuyBox, onBuyTickets, onWatchAd, user }) { 
    const adReward = SHOP_ITEMS.AD_REWARD_ENERGY;
    const maxEnergy = user?.level ? (10 + ((user.level - 1) * 2)) : 10;
    const isEnergyFull = (user?.energy || 0) >= maxEnergy;

    const [viewingBox, setViewingBox] = useState(null); 

    const getDropRates = (boxType) => {
        let pool = Object.values(RARITIES).sort((a, b) => a.id - b.id); 
        
        if (boxType === 'STANDARD' || boxType === 'PREMIUM') pool = pool.filter(r => r.id <= 5);
        if (boxType === 'PREMIUM') pool = pool.filter(r => r.id > 1);
        if (boxType === 'DIVINE') pool = pool.filter(r => r.id >= 3);

        let totalWeight = 0;
        const weightedPool = pool.map(r => {
            let weight = r.dropChance;
            if (boxType === 'PREMIUM') weight *= 1.6;
            if (boxType === 'MASTER') weight *= 1.2;
            if (boxType === 'DIVINE') {
                if (r.id >= 6) weight *= 5.0; 
                else weight *= 1.0;
            }
            totalWeight += weight;
            return { ...r, weight };
        });

        return weightedPool.map(r => ({
            ...r,
            chance: (r.weight / totalWeight) * 100
        })).sort((a,b) => b.id - a.id);
    };

    const handleBuy = (boxType, cost, currency) => {
        onBuyBox(boxType, cost, currency);
        setViewingBox(null); 
    };

    const boxConfig = {
        'STANDARD': { color: 'text-slate-200', bg: 'bg-slate-600', icon: Package, title: 'Standard Box', sub: 'Maximal Legendär' },
        'PREMIUM': { color: 'text-purple-400', bg: 'bg-purple-600', icon: Star, title: 'Premium Box', sub: 'Kein Gewöhnlich' },
        'MASTER': { color: 'text-amber-400', bg: 'bg-amber-600', icon: Crown, title: 'Meister Box', sub: 'Chance auf Transzendent!' },
        'DIVINE': { color: 'text-cyan-300', bg: 'bg-cyan-600', icon: Sparkles, title: 'Göttliche Box', sub: 'Hohe Mythic+ Chance!' },
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">
            
            {viewingBox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in-50">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-0 relative overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="relative h-32 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                            <div className={`absolute inset-0 ${boxConfig[viewingBox].bg} opacity-20 blur-3xl`}></div>
                            {React.createElement(boxConfig[viewingBox].icon, { className: `w-20 h-20 ${boxConfig[viewingBox].color} drop-shadow-2xl relative z-10` })}
                            <button onClick={() => setViewingBox(null)} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors z-20"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
                            <h2 className={`text-2xl font-black ${boxConfig[viewingBox].color} mb-1 uppercase text-center`}>{boxConfig[viewingBox].title}</h2>
                            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{boxConfig[viewingBox].sub}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 mb-2 text-slate-500"><Percent className="w-4 h-4" /><span className="text-xs font-black uppercase">Wahrscheinlichkeiten</span></div>
                                <div className="bg-slate-950/50 rounded-xl p-2 border border-white/5 space-y-1">
                                    {getDropRates(viewingBox).map((rate) => (
                                        rate.chance > 0 && (
                                            <div key={rate.id} className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-white/5 transition-colors">
                                                <span className={`text-xs font-bold ${rate.color} uppercase tracking-wider`}>{rate.label}</span>
                                                <span className="text-xs font-mono text-slate-300">{rate.chance < 0.01 ? '< 0.01' : rate.chance.toFixed(2)}%</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-white/5 shrink-0">
                            {viewingBox === 'STANDARD' && <button onClick={() => handleBuy('STANDARD', 500, 'COINS')} className="w-full py-4 rounded-xl font-black text-sm bg-slate-700 text-white hover:bg-slate-600 flex justify-center gap-2"><Coins className="w-4 h-4 text-yellow-400" /> 500 KAUFEN</button>}
                            {viewingBox === 'PREMIUM' && <button onClick={() => handleBuy('PREMIUM', 50, 'GEMS')} className="w-full py-4 rounded-xl font-black text-sm bg-purple-600 text-white hover:bg-purple-500 flex justify-center gap-2"><Gem className="w-4 h-4 text-pink-200" /> 50 KAUFEN</button>}
                            {viewingBox === 'MASTER' && <button onClick={() => handleBuy('MASTER', 2500, 'COINS')} className="w-full py-4 rounded-xl font-black text-sm bg-amber-500 text-black hover:bg-amber-400 flex justify-center gap-2"><Coins className="w-4 h-4 text-black" /> 2500 KAUFEN</button>}
                            {viewingBox === 'DIVINE' && <button onClick={() => handleBuy('DIVINE', 150, 'GEMS')} className="w-full py-4 rounded-xl font-black text-sm bg-cyan-600 text-white hover:bg-cyan-500 flex justify-center gap-2"><Gem className="w-4 h-4 text-white" /> 150 KAUFEN</button>}
                        </div>
                    </div>
                </div>
            )}

            <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">ITEM SHOP</h1>
                <button onClick={onBack} className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">

                {/* GRATIS ENERGIE */}
                <div className="relative overflow-hidden rounded-3xl p-0.5 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-900/20 group">
                    <div className="bg-slate-900 rounded-[22px] p-5 relative">
                        <div className="flex justify-between items-center mb-4">
                            <div><h3 className="text-xl font-black text-white flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse"/> GRATIS ENERGIE</h3><p className="text-xs text-emerald-200 font-bold mt-1">Fülle deine Energie auf!</p></div>
                            <div className="bg-slate-800 p-2 rounded-xl border border-white/10"><PlayCircle className="w-8 h-8 text-emerald-500" /></div>
                        </div>
                        <button onClick={onWatchAd} disabled={isEnergyFull} className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${isEnergyFull ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}`}>{isEnergyFull ? 'ENERGIE IST VOLL' : 'VIDEO ANSEHEN (+3)'}</button>
                    </div>
                </div>

                {/* LOOTBOXEN */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-yellow-500"><Package className="w-4 h-4" /><h3 className="text-xs font-black uppercase tracking-widest">Lootboxen</h3></div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        
                        {/* STANDARD */}
                        <div onClick={() => setViewingBox('STANDARD')} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:border-slate-500 active:scale-95 transition-all">
                            <div className="text-center">
                                <Package className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                <div className="font-bold text-white text-sm">Standard</div>
                                <div className="text-[10px] text-slate-500 uppercase mb-3">Max. Legendär</div>
                                <div className="bg-slate-700 text-yellow-400 text-xs font-black py-1.5 rounded-lg flex justify-center gap-1"><Coins className="w-3 h-3 fill-current" /> 500</div>
                            </div>
                        </div>

                        {/* PREMIUM */}
                        <div onClick={() => setViewingBox('PREMIUM')} className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500 rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:brightness-110 active:scale-95 transition-all">
                            <div className="text-center relative z-10">
                                <Star className="w-12 h-12 text-purple-400 mx-auto mb-2 fill-purple-400/20" />
                                <div className="font-bold text-white text-sm">Premium</div>
                                <div className="text-[10px] text-purple-200 uppercase mb-3">Min. Ungewöhnlich</div>
                                <div className="bg-purple-600 text-white text-xs font-black py-1.5 rounded-lg flex justify-center gap-1"><Gem className="w-3 h-3 fill-current" /> 50</div>
                            </div>
                        </div>

                        {/* MASTER (NEU) */}
                        <div onClick={() => setViewingBox('MASTER')} className="bg-gradient-to-br from-yellow-900 to-amber-800 border border-amber-500 rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:brightness-110 active:scale-95 transition-all col-span-2 sm:col-span-1">
                            <div className="absolute -right-4 -top-4 bg-amber-500 blur-2xl w-20 h-20 opacity-20"></div>
                            <div className="text-center relative z-10">
                                <Crown className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                                <div className="font-bold text-white text-sm">Meister Box</div>
                                <div className="text-[10px] text-amber-200 uppercase mb-3">Chance auf Transzendent!</div>
                                <div className="bg-amber-500 text-black text-xs font-black py-1.5 rounded-lg flex justify-center gap-1"><Coins className="w-3 h-3 fill-current" /> 2500</div>
                            </div>
                        </div>

                        {/* DIVINE (NEU) */}
                        <div onClick={() => setViewingBox('DIVINE')} className="bg-gradient-to-br from-cyan-900 to-blue-900 border border-cyan-400 rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:brightness-110 active:scale-95 transition-all col-span-2 sm:col-span-1 shadow-lg shadow-cyan-500/20">
                            <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-10 animate-pulse"></div>
                            <div className="text-center relative z-10">
                                <Sparkles className="w-12 h-12 text-cyan-300 mx-auto mb-2" />
                                <div className="font-black text-white text-sm tracking-wide">GÖTTLICHE BOX</div>
                                <div className="text-[10px] text-cyan-200 uppercase mb-3">Hohe Mythic+ Chance</div>
                                <div className="bg-cyan-500 text-white text-xs font-black py-1.5 rounded-lg flex justify-center gap-1"><Gem className="w-3 h-3 fill-current" /> 150</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* TICKETS */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-pink-400"><Ticket className="w-4 h-4" /><h3 className="text-xs font-black uppercase tracking-widest">Zucht-Tickets</h3></div>
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