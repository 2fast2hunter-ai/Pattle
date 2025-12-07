import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Hammer, Users, ArrowUpCircle, X, Plus, TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Lock, Clock, Zap, Backpack
} from 'lucide-react';
import { RESOURCES, UPGRADE_COSTS, RESOURCE_ITEMS, RARITY_MULTIPLIERS, RARITIES } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

const RESOURCE_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles
};

const FloatingBadge = ({ text }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-50 animate-bounce pointer-events-none">
        <span className="text-4xl font-black text-green-400 drop-shadow-lg" style={{ WebkitTextStroke: '1px black' }}>{text}</span>
    </div>
);

// --- MODAL: ZEIGT JETZT BEIDE KOSTEN AN ---
function UpgradeModal({ resource, currentLevel, storage, onUpgrade, onClose }) {
    const nextLevel = currentLevel + 1;
    const costData = UPGRADE_COSTS.find(u => u.level === nextLevel);
    
    if (!costData) return null;
    
    const baseCost = costData.baseCost;
    const specialCost = costData.specialCost;

    // Items ermitteln
    const drops = RESOURCE_ITEMS[resource.id] || [];
    const sortedDrops = [...drops].sort((a, b) => b.chance - a.chance);
    
    const baseItem = sortedDrops[0]; 
    const rareItem = sortedDrops[sortedDrops.length - 1];

    // Verfügbarkeit prüfen
    const haveBase = (storage[baseItem.id] || 0);
    const haveRare = (storage[rareItem.id] || 0);
    
    const enoughBase = haveBase >= baseCost;
    const enoughSpecial = specialCost === 0 || haveRare >= specialCost;
    const canAfford = enoughBase && enoughSpecial;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in-50">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[32px] p-6 relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X className="w-5 h-5"/>
                </button>
                
                <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-white uppercase">{resource.buildingLabel}</h3>
                    <p className="text-indigo-400 font-bold text-sm">Auf Stufe {nextLevel} verbessern</p>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4 mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Dauer:</span>
                        <span className="text-white font-bold">{costData.time}s</span>
                    </div>
                    
                    {/* BASIS KOSTEN */}
                    <div className="border-t border-white/5 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Kosten:</span>
                            <span className={`${enoughBase ? 'text-white' : 'text-red-400'} font-black`}>
                                {baseCost.toLocaleString()} {baseItem.label}
                            </span>
                        </div>
                        <div className="flex justify-end text-[10px] text-slate-500">
                            (Du hast: {haveBase.toLocaleString()})
                        </div>
                    </div>

                    {/* SPEZIAL KOSTEN (Nur anzeigen wenn > 0) */}
                    {specialCost > 0 && (
                        <div className="border-t border-white/5 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-400 font-bold">Spezial:</span>
                                <span className={`${enoughSpecial ? 'text-white' : 'text-red-400'} font-black`}>
                                    {specialCost.toLocaleString()} {rareItem.label}
                                </span>
                            </div>
                            <div className="flex justify-end text-[10px] text-slate-500">
                                (Du hast: {haveRare.toLocaleString()})
                            </div>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={() => { if (canAfford) { onUpgrade(resource.id); onClose(); } }} 
                    disabled={!canAfford} 
                    className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 
                        ${canAfford ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                    <ArrowUpCircle className="w-5 h-5" /> VERBESSERN
                </button>
            </div>
        </div>
    );
}

export default function ResourceDetailScreen({ resourceId, user, pets, onBack, onAssignWorker, onRemoveWorker, onUpgradeBuilding, productionRates, onCollect }) {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showFloating, setShowFloating] = useState(false);
    
    if (!resourceId || !RESOURCES[resourceId.toUpperCase()]) return null;

    const resource = RESOURCES[resourceId.toUpperCase()];
    const drops = RESOURCE_ITEMS[resourceId] || [];
    const storage = user.village.storage || {}; 
    
    const level = user.village.buildings[resourceId] || 1;
    const workers = user.village.workers[resourceId] || [];
    
    const rate = productionRates ? productionRates(resourceId, level, workers) : 0;
    const cycleTime = Math.max(1, 10 - ((level - 1) * 0.05));

    useEffect(() => {
        if (rate > 0) {
            const tickRate = 100; 
            const step = (tickRate / (cycleTime * 1000)) * 100;
            const interval = setInterval(() => {
                setProgress(old => {
                    const next = old + step;
                    if (next >= 100) {
                        if (onCollect) onCollect();
                        setShowFloating(true);
                        setTimeout(() => setShowFloating(false), 800);
                        return 0;
                    }
                    return next;
                });
            }, tickRate);
            return () => clearInterval(interval);
        } else {
            setProgress(0);
        }
    }, [rate, cycleTime, onCollect]);

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            {showUpgrade && (
                <UpgradeModal 
                    resource={resource} 
                    currentLevel={level} 
                    storage={storage} 
                    onUpgrade={onUpgradeBuilding} 
                    onClose={() => setShowUpgrade(false)} 
                />
            )}

            {/* HEADER */}
            <div className="relative flex items-center justify-between mb-4 pt-2 px-4 shrink-0 z-10">
                <div className="flex items-center gap-3"><button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic tracking-wide text-white uppercase">{resource.label}</h2></div>
                <button onClick={() => setShowUpgrade(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-indigo-900/20 active:scale-95 transition-all flex items-center gap-2"><Hammer className="w-4 h-4" /> Lv {level}</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-6">
                
                {/* MAIN CARD */}
                <div className="relative h-48 rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group">
                    <div className={`absolute inset-0 ${resource.bg} opacity-20`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">{React.createElement(RESOURCE_ICONS[resourceId], { className: `w-32 h-32 text-white/10 transition-transform duration-1000 ${rate > 0 ? 'scale-110 opacity-20' : 'scale-100'}` })}</div>
                    {showFloating && <FloatingBadge text="+1" />}
                    <div className="absolute bottom-0 left-0 w-full p-6"><h3 className="text-3xl font-black text-white mb-1">{resource.buildingLabel}</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{resource.desc}</p></div>
                </div>

                {/* PROGRESS & PRODUCTION */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">{rate > 0 ? <Zap className="w-4 h-4 text-yellow-400 animate-pulse" /> : <Clock className="w-4 h-4 text-slate-600" />}{rate > 0 ? 'Produktion läuft' : 'Produktion gestoppt'}</span>
                        <span className="text-[10px] font-mono text-slate-500">{rate > 0 ? `${cycleTime.toFixed(2)}s Zyklus` : ''}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10 relative">{rate > 0 && (<div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>)}</div>
                </div>

                {/* DROPS & STORAGE */}
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-slate-400 font-bold text-xs uppercase"><Backpack className="w-4 h-4" /> Mögliche Drops & Lager</div>
                    <div className="space-y-2">
                        {drops.map(item => {
                            const count = storage[item.id] || 0;
                            const rarity = RARITIES[item.rarity] || RARITIES.COMMON;
                            return (
                                <div key={item.id} className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10 ${rarity.color} font-black`}>?</div>
                                        <div>
                                            <div className={`text-xs font-bold ${item.color}`}>{item.label}</div>
                                            <div className="text-[9px] text-slate-500">{item.chance}% Chance</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-mono font-bold text-white bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                                        x{count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* WORKERS */}
                <div>
                    <div className="flex items-center gap-2 mb-3 px-1"><Users className="w-4 h-4 text-indigo-400" /><h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Arbeiter ({workers.filter(Boolean).length}/{resource.slots})</h3></div>
                    <div className="space-y-3">
                        {Array.from({ length: resource.slots }).map((_, idx) => {
                            const isSlotUnlocked = idx < user.village.level;
                            const petId = workers[idx];
                            const pet = petId ? pets.find(p => p.id === petId) : null;
                            if (!isSlotUnlocked) return (<div key={idx} className="bg-slate-900/50 border border-dashed border-white/5 rounded-2xl p-4 flex items-center gap-4 opacity-50"><div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center"><Lock className="w-5 h-5 text-slate-600" /></div><div className="text-slate-600 text-xs font-bold uppercase">Benötigt Dorf Level {idx + 1}</div></div>);
                            if (pet) return (<div key={idx} className="bg-slate-800 border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-lg group cursor-pointer" onClick={() => onRemoveWorker(resourceId, idx)}><div className="flex items-center gap-4"><div className="relative"><PetAvatar pet={pet} className="w-12 h-12" /><div className="absolute inset-0 bg-red-500/90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-5 h-5 text-white" /></div></div><div><div className="font-bold text-white">{pet.name}</div><div className="text-[10px] text-slate-400 uppercase font-bold">Lvl {pet.level} • {pet.rarity}</div></div></div>{rate > 0 && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>}</div>);
                            return (<button key={idx} onClick={() => onAssignWorker(resourceId, idx)} className="w-full bg-slate-800/30 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-3 flex items-center gap-4 group transition-all active:scale-98"><div className="w-12 h-12 bg-slate-900/80 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors"><Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" /></div><div className="text-slate-500 font-bold group-hover:text-indigo-300 transition-colors text-sm">Arbeiter zuweisen</div></button>);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}