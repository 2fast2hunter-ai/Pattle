import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Coins, Star, Gem, Ticket, X, Percent, Crown, Sparkles, Box, Lock, PlayCircle, Clock, ArrowUp, Plus, Minus, Gift, Zap, ShoppingBag } from 'lucide-react';
import { SHOP_ITEMS, LOOTBOXES, RARITIES, AD_REWARDS, TIMED_REWARDS, TYPES } from '../data/gameData'; 
import AdModal from '../components/ui/AdModal';
import { PageBackground } from '../components/GameLayout';
import { showRewardedAd } from '../utils/adManager';
import { useShopActions } from '../hooks/useGameLogic/actions/useShopActions'; // Optional falls nicht als Prop

export default function ShopScreen({ onBack, onBuyBox, onBuyTickets, onWatchAd, user, onClaimTimedReward }) { 
    // Falls onClaimTimedReward nicht als Prop kommt (weil wir useGameLogic nicht angepasst haben im Parent),
    // könnten wir hier useShopActions nutzen, aber besser ist es, das Prop-Drilling in App.jsx zu machen.
    // Ich gehe davon aus, dass du App.jsx anpasst, um die Funktion durchzureichen,
    // ABER: um sicherzugehen, nutzen wir hier einen Workaround, falls du App.jsx vergessen hast:
    // const { claimTimedReward } = useShopActions({ user }, () => {}); 
    // Nein, wir verlassen uns auf das Prop, das ich unten in der Anleitung erkläre!
    
    // Wir brauchen aber einen lokalen State für den Timer
    const [viewingBox, setViewingBox] = useState(null); 
    const [showDevAdModal, setShowDevAdModal] = useState(false);
    const [buyAmount, setBuyAmount] = useState(1);
    const [pendingReward, setPendingReward] = useState(null);
    const [isBuying, setIsBuying] = useState(false); // NEU: Schutz vor Mehrfachklicks

    const AD_COOLDOWN_MS = 10 * 60 * 1000;
    const [adTimers, setAdTimers] = useState({}); 
    const [timedRewardTimers, setTimedRewardTimers] = useState({}); // NEU

    useEffect(() => {
        const updateTimers = () => {
            const now = Date.now();
            
            // 1. AD Timers
            const newAdTimers = {};
            AD_REWARDS.forEach(reward => {
                const lastClaim = user?.adClaims?.[reward.id] || 0;
                const diff = now - lastClaim;
                if (diff < AD_COOLDOWN_MS) {
                    newAdTimers[reward.id] = AD_COOLDOWN_MS - diff;
                } else {
                    newAdTimers[reward.id] = 0;
                }
            });
            setAdTimers(newAdTimers);

            // 2. Timed Rewards Timers (NEU)
            const newTimedTimers = {};
            TIMED_REWARDS.forEach(reward => {
                const lastClaim = user?.timedClaims?.[reward.id] || 0;
                const diff = now - lastClaim;
                if (diff < reward.cooldown) {
                    newTimedTimers[reward.id] = reward.cooldown - diff;
                } else {
                    newTimedTimers[reward.id] = 0;
                }
            });
            setTimedRewardTimers(newTimedTimers);
        };
        updateTimers(); 
        const interval = setInterval(updateTimers, 1000);
        return () => clearInterval(interval);
    }, [user?.adClaims, user?.timedClaims]);

    useEffect(() => {
        if (viewingBox) setBuyAmount(1);
    }, [viewingBox]);

    const formatTime = (ms) => {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- TYPE SPECIFIC BOX LOGIC ---
    const typeKeys = Object.keys(TYPES);
    const dayIndex = new Date().getDay(); 
    
    // Verteilung der 24 Typen auf die Woche
    const schedule = {
        1: { start: 0, count: 3 }, // Mo: 3 Typen
        2: { start: 3, count: 3 }, // Di: 3 Typen
        3: { start: 6, count: 3 }, // Mi: 3 Typen
        4: { start: 9, count: 3 }, // Do: 3 Typen
        5: { start: 12, count: 4 }, // Fr: 4 Typen
        6: { start: 16, count: 4 }, // Sa: 4 Typen
        0: { start: 20, count: 4 }  // So: 4 Typen
    };
    
    const { start, count } = schedule[dayIndex];
    const dailyTypes = typeKeys.slice(start, start + count);
    
    const TYPE_BOX_COST = (LOOTBOXES.MASTER?.cost || 10000) + 5000;

    // ... (boxConfig, getDropList bleiben gleich) ...
    const boxConfig = {
        'DAILY': { color: 'text-sky-300', bg: 'bg-sky-600', icon: Box, border: 'border-sky-400', glow: 'shadow-sky-500/20' },
        'PREMIUM': { color: 'text-purple-300', bg: 'bg-purple-600', icon: Star, border: 'border-purple-400', glow: 'shadow-purple-500/20' },
        'MASTER': { color: 'text-amber-300', bg: 'bg-amber-600', icon: Crown, border: 'border-amber-400', glow: 'shadow-amber-500/20' },
        'TYPE_DAILY': { color: 'text-indigo-300', bg: 'bg-indigo-600', icon: Zap, border: 'border-indigo-400', glow: 'shadow-indigo-500/20', label: 'Elementar-Truhe' },
    };

    const getDropList = (boxKey) => {
        if (boxKey === 'TYPE_DAILY') {
            // Nutzt die Drop-Raten der Master Box
            const masterDrops = LOOTBOXES.MASTER?.drops || {};
            return Object.entries(masterDrops).map(([rarityKey, chance]) => ({ ...RARITIES[rarityKey], chance })).sort((a, b) => b.id - a.id);
        }
        const box = LOOTBOXES[boxKey];
        if (!box) return [];
        return Object.entries(box.drops).map(([rarityKey, chance]) => ({ ...RARITIES[rarityKey], chance })).sort((a, b) => b.id - a.id); 
    };

    const handleBuy = (boxKey) => {
        if (isBuying) return; // Blockiere wenn bereits gekauft wird
        setIsBuying(true);
        const cost = boxKey === 'TYPE_DAILY' ? TYPE_BOX_COST : LOOTBOXES[boxKey].cost;
        const currency = boxKey === 'TYPE_DAILY' ? 'COINS' : LOOTBOXES[boxKey].currency;
        onBuyBox(boxKey, cost, currency, buyAmount);
        setViewingBox(null); 
        setTimeout(() => setIsBuying(false), 500); // Kurze Verzögerung zum Reset
    };

    const isDailyAvailable = () => {
        const today = new Date().toDateString();
        return user?.lastDailyBoxClaim !== today;
    };

    const handleAdClick = (reward) => {
        if (adTimers[reward.id] > 0) return; 
        setPendingReward(reward);
        showRewardedAd({
            onReward: () => { onWatchAd(reward); setPendingReward(null); },
            onError: () => { alert("Werbung Error"); setPendingReward(null); },
            onOpenDevModal: () => { setShowDevAdModal(true); }
        });
    };

    const increment = () => setBuyAmount(prev => Math.min(prev + 1, 50));
    const decrement = () => setBuyAmount(prev => Math.max(prev - 1, 1));

    const currentConfig = boxConfig[viewingBox] || boxConfig['DAILY'];

    return (
        <div className="h-full flex flex-col animate-in fade-in relative overflow-hidden bg-slate-950">
            <PageBackground />
            
            <style>{`
                @keyframes gradient-xy {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 6s ease infinite;
                }
            `}</style>
            
            {showDevAdModal && (
                <AdModal 
                    onClose={() => setShowDevAdModal(false)} 
                    onReward={() => { if (pendingReward) { onWatchAd(pendingReward); setPendingReward(null); } }} 
                />
            )}

            {/* Modal für Lootboxen */}
            {viewingBox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in-50">
                    <div className={`bg-slate-900 border-2 ${currentConfig.border} w-full max-w-md rounded-[32px] p-0 relative overflow-hidden flex flex-col max-h-[85vh] shadow-2xl`}>
                        <div className="relative h-40 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                            <div className={`absolute inset-0 ${currentConfig.bg} opacity-20 blur-[60px] animate-pulse`}></div>
                            {React.createElement(currentConfig.icon, { className: `w-24 h-24 ${currentConfig.color} drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10` })}
                            <button onClick={() => setViewingBox(null)} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors z-20 backdrop-blur-md border border-white/10"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
                            <h2 className={`text-2xl font-black ${currentConfig.color} mb-1 uppercase text-center tracking-wide`}>{viewingBox === 'TYPE_DAILY' ? 'Elementar-Truhe' : LOOTBOXES[viewingBox]?.label}</h2>
                            
                            {/* WOCHENPLAN FÜR ELEMENTAR-TRUHE */}
                            {viewingBox === 'TYPE_DAILY' && (
                                <div className="mb-6 mt-4 bg-slate-950/40 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Clock className="w-3 h-3 text-indigo-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wochenplan</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {[1, 2, 3, 4, 5, 6, 0].map(dIndex => {
                                            const dayName = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][dIndex];
                                            const { start, count } = schedule[dIndex];
                                            const typesForDay = typeKeys.slice(start, start + count);
                                            const isToday = dIndex === dayIndex;
                                            return (
                                                <div key={dIndex} className={`flex items-center gap-3 p-1.5 rounded-lg ${isToday ? 'bg-indigo-500/10 border border-indigo-500/30' : ''}`}>
                                                    <span className={`text-[10px] font-black w-6 text-center ${isToday ? 'text-indigo-300' : 'text-slate-500'}`}>{dayName}</span>
                                                    <div className="flex gap-1.5 flex-1 flex-wrap">
                                                        {typesForDay.map(tKey => (
                                                            <div key={tKey} className={`w-5 h-5 rounded-md flex items-center justify-center ${TYPES[tKey].bg} shadow-sm`} title={TYPES[tKey].label}>
                                                                {React.cloneElement(TYPES[tKey].icon, { size: 12, className: "text-white" })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center mb-6"><div className="bg-slate-950/50 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2"><Percent className="w-3 h-3 text-slate-400" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wahrscheinlichkeiten</span></div></div>
                            <div className="space-y-1.5">{getDropList(viewingBox).map((rate) => (<div key={rate.id} className="flex justify-between items-center px-3 py-2 bg-slate-800/50 rounded-xl border border-white/5"><span className={`text-xs font-black ${rate.color} uppercase tracking-wider`}>{rate.label}</span><span className="text-xs font-mono font-bold text-white">{rate.chance.toFixed(2)}%</span></div>))}</div>
                        </div>
                        <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0 space-y-4">
                            {viewingBox !== 'DAILY' && (
                                <div className="flex justify-center items-center gap-4">
                                    <button onClick={decrement} className="p-3 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 active:scale-95 transition-all"><Minus className="w-4 h-4 text-white" /></button>
                                    <div className="text-center w-12"><span className="block text-xs text-slate-400 font-bold uppercase">Menge</span><span className="block text-xl font-black text-white">{buyAmount}</span></div>
                                    <button onClick={increment} className="p-3 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 active:scale-95 transition-all"><Plus className="w-4 h-4 text-white" /></button>
                                </div>
                            )}
                            <button onClick={() => handleBuy(viewingBox)} disabled={(viewingBox === 'DAILY' && !isDailyAvailable()) || isBuying} className={`w-full py-4 rounded-2xl font-black text-sm flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg ${viewingBox === 'DAILY' ? (isDailyAvailable() ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed') : (isBuying ? 'bg-slate-500 text-slate-300 cursor-wait' : 'bg-white text-slate-900 hover:bg-slate-200')}`}>{viewingBox === 'DAILY' ? (isDailyAvailable() ? 'GRATIS ABHOLEN' : 'SCHON ABGEHOLT') : (<><Coins className="w-4 h-4 text-amber-500 fill-amber-500" /> {((viewingBox === 'TYPE_DAILY' ? TYPE_BOX_COST : LOOTBOXES[viewingBox].cost) * buyAmount).toLocaleString()} KAUFEN</>)}</button>
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

               {/* GRATIS SEKTION */}
               <div>
                    <div className="flex items-center gap-2 mb-3 text-indigo-300 px-1">
                        <PlayCircle className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Gratis & Boosts</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        
                        {/* NEU: TIME BASED REWARDS (GRATIS TICKET) */}
                        {TIMED_REWARDS.map(reward => {
                            const cooldown = timedRewardTimers[reward.id];
                            const isReady = !cooldown || cooldown <= 0;
                            
                            return (
                                <button 
                                    key={reward.id}
                                    onClick={() => isReady && onClaimTimedReward(reward.id)} // Hier muss die Funktion übergeben werden!
                                    disabled={!isReady}
                                    className={`
                                        col-span-2 sm:col-span-1 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between relative overflow-hidden group transition-all shadow-lg
                                        ${isReady ? 'hover:border-indigo-400 cursor-pointer active:scale-95' : 'opacity-75 cursor-not-allowed'}
                                    `}
                                >
                                    {isReady && <div className="absolute inset-0 bg-shimmer opacity-20 pointer-events-none"></div>}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 shadow-inner">
                                            <Gift className={`w-6 h-6 ${isReady ? 'text-indigo-300 animate-bounce' : 'text-slate-500'}`} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-white text-sm">{reward.label}</div>
                                            <div className="text-[10px] text-indigo-200">{reward.description}</div>
                                        </div>
                                    </div>
                                    
                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${isReady ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>
                                        {isReady ? 'ABHOLEN' : formatTime(cooldown)}
                                    </div>
                                </button>
                            );
                        })}

                        {/* AD REWARDS */}
                        {AD_REWARDS.map((reward) => {
                            const cooldown = adTimers[reward.id];
                            const isReady = !cooldown || cooldown <= 0;
                            return (
                                <button key={reward.id} onClick={() => handleAdClick(reward)} disabled={!isReady} className={`bg-slate-800 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden group transition-all ${isReady ? 'hover:bg-slate-750 hover:border-white/10 active:scale-95 cursor-pointer' : 'opacity-75 cursor-not-allowed'}`}>
                                    {isReady && <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                                    <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center mb-2 shadow-inner border border-white/5 relative z-10">
                                        {reward.type === 'GEMS' && <Gem className="w-5 h-5 text-pink-400 drop-shadow-md" />}
                                        {reward.type === 'COINS' && <Coins className="w-5 h-5 text-yellow-400 drop-shadow-md" />}
                                        {reward.type === 'BUFF' && reward.buffType === 'COIN_BOOST' && <div className="relative"><Coins className="w-5 h-5 text-yellow-400" /><ArrowUp className="w-3 h-3 text-green-400 absolute -top-1 -right-1 bg-black/50 rounded-full" /></div>}
                                        {reward.type === 'BUFF' && reward.buffType === 'XP_BOOST' && <div className="relative"><Star className="w-5 h-5 text-green-400" /><ArrowUp className="w-3 h-3 text-white absolute -top-1 -right-1 bg-black/50 rounded-full" /></div>}
                                    </div>
                                    <div className="relative z-10"><div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 leading-tight">{reward.label}</div></div>
                                    <div className={`mt-2 w-full py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1 relative z-10 ${isReady ? 'bg-white text-indigo-900' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>{isReady ? (<><PlayCircle className="w-3 h-3" /> Video</>) : (<><Clock className="w-3 h-3" /> {formatTime(cooldown)}</>)}</div>
                                </button>
                            );
                        })}
                    </div>
               </div>

                {/* LOOTBOXEN */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-yellow-500 px-1"><Package className="w-4 h-4" /><h3 className="text-xs font-black uppercase tracking-widest">Lootboxen</h3></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* DAILY BOX */}
                        <div onClick={() => setViewingBox('DAILY')} className={`col-span-2 sm:col-span-1 bg-slate-800 border-2 ${isDailyAvailable() ? 'border-sky-500 shadow-sky-900/20 animate-pulse-slow' : 'border-slate-700 opacity-80'} rounded-[24px] p-4 relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-lg animate-in fade-in slide-in-from-bottom-4 delay-0 fill-mode-backwards`}>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10 ${isDailyAvailable() ? 'shadow-lg shadow-sky-500/20' : ''}`}>{isDailyAvailable() ? <Box className="w-8 h-8 text-sky-400 animate-float-gentle" /> : <Lock className="w-6 h-6 text-slate-600" />}</div>
                                <div className="flex-1"><h4 className="font-black text-white text-lg italic uppercase">{LOOTBOXES.DAILY.label}</h4><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Täglich ein Geschenk</p><span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${isDailyAvailable() ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-500'}`}>{isDailyAvailable() ? 'GRATIS' : 'Abgeholt'}</span></div>
                            </div>
                        </div>
                        {/* PREMIUM & MASTER */}
                        <div onClick={() => setViewingBox('PREMIUM')} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/50 rounded-[24px] p-4 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer hover:border-purple-400 transition-all shadow-lg active:scale-95 animate-in fade-in slide-in-from-bottom-4 delay-100 fill-mode-backwards hover:shadow-purple-500/20">
                            <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div><Star className="w-10 h-10 text-purple-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform animate-float-gentle" /><h4 className="font-black text-white text-sm uppercase mb-1">{LOOTBOXES.PREMIUM.label}</h4><div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5"><Coins className="w-3 h-3 text-amber-400" /><span className="text-xs font-black text-white">{LOOTBOXES.PREMIUM.cost}</span></div>
                        </div>
                        <div onClick={() => setViewingBox('MASTER')} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/50 rounded-[24px] p-4 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer hover:border-amber-400 transition-all shadow-lg active:scale-95 animate-in fade-in slide-in-from-bottom-4 delay-200 fill-mode-backwards hover:shadow-amber-500/20">
                            <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div><Crown className="w-10 h-10 text-amber-400 mb-2 drop-shadow-md group-hover:scale-110 transition-transform animate-float-gentle" /><h4 className="font-black text-white text-sm uppercase mb-1">{LOOTBOXES.MASTER.label}</h4><div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5"><Coins className="w-3 h-3 text-amber-400" /><span className="text-xs font-black text-white">{LOOTBOXES.MASTER.cost}</span></div>
                        </div>
                        
                        {/* SINGLE TYPE SPECIFIC BOX */}
                        <div onClick={() => setViewingBox('TYPE_DAILY')} className="col-span-2 sm:col-span-1 bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-indigo-500/50 rounded-[24px] p-4 relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-lg animate-in fade-in slide-in-from-bottom-4 delay-300 fill-mode-backwards hover:shadow-indigo-500/20">
                            <div className="absolute inset-0 bg-indigo-600/5 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                                    <Zap className="w-8 h-8 text-indigo-400 scale-110 animate-pulse" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-lg italic uppercase text-indigo-300">Elementar-Truhe</h4>
                                    <div className="flex gap-1 mb-2 mt-1">
                                        {dailyTypes.map(tKey => (
                                            <div key={tKey} className={`w-5 h-5 rounded bg-slate-950 flex items-center justify-center border border-white/10 ${TYPES[tKey].color}`} title={TYPES[tKey].label}>
                                                {React.cloneElement(TYPES[tKey].icon, { size: 12 })}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-slate-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5 w-fit"><Coins className="w-3 h-3 text-amber-400" /><span className="text-xs font-black text-white">{TYPE_BOX_COST.toLocaleString()}</span></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* TICKETS */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
                        <span className="text-xs font-black text-pink-400 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-pink-500/20 backdrop-blur-sm">Zucht-Tickets</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800 rounded-3xl p-4 border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:bg-slate-800/80 transition-colors">
                            <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Ticket className="w-6 h-6 text-pink-500" />
                            </div>
                            <div className="font-bold text-white text-xs mb-3">Einzelticket</div>
                            <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_COINS)} className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 rounded-xl text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform border border-white/10">
                                <Coins className="w-3 h-3 text-amber-400" /> {SHOP_ITEMS.TICKET_BUNDLE_COINS.costAmount}
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-3xl p-4 border border-pink-500/30 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-black px-2 py-1 rounded-bl-xl shadow-lg">DEAL</div>
                            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-3 border border-pink-500/30 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                                <Ticket className="w-6 h-6 text-pink-400" />
                            </div>
                            <div className="font-bold text-white text-xs mb-3">5er Pack</div>
                            <button onClick={() => onBuyTickets(SHOP_ITEMS.TICKET_BUNDLE_GEMS)} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 rounded-xl text-[10px] flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-lg">
                                <Gem className="w-3 h-3 fill-white/20" /> {SHOP_ITEMS.TICKET_BUNDLE_GEMS.costAmount}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}