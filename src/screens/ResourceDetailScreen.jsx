import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Hammer, Users, Plus, TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Lock, Clock, Zap, Backpack, X
} from 'lucide-react';
import { RESOURCES, RESOURCE_ITEMS, RARITIES } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';
import UpgradeModal from '../components/modals/UpgradeModal';
import FloatingBadge from '../components/ui/FloatingBadge';

const RESOURCE_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles
};

export default function ResourceDetailScreen({ resourceId, user, pets, onBack, onAssignWorker, onRemoveWorker, onUpgradeBuilding, productionRates, onCollect, t }) {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showFloating, setShowFloating] = useState(false);
    const [isProductionActive, setIsProductionActive] = useState(false);

    const isValid = resourceId && RESOURCES[resourceId.toUpperCase()];
    const resource = isValid ? RESOURCES[resourceId.toUpperCase()] : null;
    const drops = isValid ? (RESOURCE_ITEMS[resourceId] || []) : [];
    const storage = user?.village?.storage || {};
    const level = isValid ? (user?.village?.buildings?.[resourceId] || 1) : 1;
    const workers = isValid ? (user?.village?.workers?.[resourceId] || []) : [];
    const rate = (isValid && productionRates) ? productionRates(resourceId, level, workers) : 0;
    const cycleTime = Math.max(1, 10 - ((level - 1) * 0.05));

    useEffect(() => {
        const checkActive = () => {
            const now = Date.now();
            const expires = user?.village?.idleTimeExpiresAt || 0;
            setIsProductionActive(expires > now);
        };
        checkActive();
        const interval = setInterval(checkActive, 1000);
        return () => clearInterval(interval);
    }, [user?.village?.idleTimeExpiresAt]);

    useEffect(() => {
        if (rate > 0 && isProductionActive) {
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
    }, [rate, cycleTime, onCollect, isProductionActive]);

    if (!isValid) return null;

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
                <div className="flex items-center gap-3"><button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-black italic tracking-wide text-white uppercase">{t ? t('res_' + resourceId) : resource.label}</h2></div>
                <button onClick={() => setShowUpgrade(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-indigo-900/20 active:scale-95 transition-all flex items-center gap-2"><Hammer className="w-4 h-4" /> Lv {level}</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-6">
                
                {/* MAIN CARD */}
                <div className="relative h-48 rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group">
                    <div className={`absolute inset-0 ${resource.bg} opacity-20`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">{React.createElement(RESOURCE_ICONS[resourceId], { className: `w-32 h-32 text-white/10 transition-transform duration-1000 ${rate > 0 ? 'scale-110 opacity-20' : 'scale-100'}` })}</div>
                    {showFloating && <FloatingBadge text="+1" />}
                    <div className="absolute bottom-0 left-0 w-full p-6"><h3 className="text-3xl font-black text-white mb-1">{t ? t('res_' + resourceId) : resource.buildingLabel}</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{resource.desc}</p></div>
                </div>

                {/* PROGRESS & PRODUCTION */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2 relative z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">{rate > 0 && isProductionActive ? <Zap className="w-4 h-4 text-yellow-400 animate-pulse" /> : <Clock className="w-4 h-4 text-slate-600" />}{rate > 0 && isProductionActive ? (t ? t('production_running') : 'Production running') : (t ? t('production_stopped') : 'Production stopped')}</span>
                        <span className="text-[10px] font-mono text-slate-500">{rate > 0 && isProductionActive ? `${cycleTime.toFixed(2)}s ${t ? t('label_cycle') : 'cycle'}` : ''}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10 relative">{rate > 0 && isProductionActive && (<div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>)}</div>
                </div>

                {/* DROPS & STORAGE */}
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-slate-400 font-bold text-xs uppercase"><Backpack className="w-4 h-4" /> {t ? t('label_drops_storage') : 'Possible Drops & Storage'}</div>
                    <div className="space-y-2">
                        {drops.map(item => {
                            const count = storage[item.id] || 0;
                            const rarity = RARITIES[item.rarity] || RARITIES.COMMON;
                            return (
                                <div key={item.id} className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10 ${rarity.color} font-black`}>?</div>
                                        <div>
                                            <div className={`text-xs font-bold ${item.color}`}>{t ? t('item_' + item.id) : item.label}</div>
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
                    <div className="flex items-center gap-2 mb-3 px-1"><Users className="w-4 h-4 text-indigo-400" /><h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">{t ? t('label_workers') : 'Workers'} ({workers.filter(Boolean).length}/{resource.slots})</h3></div>
                    <div className="space-y-3">
                        {Array.from({ length: resource.slots }).map((_, idx) => {
                            const isSlotUnlocked = idx < user.village.level;
                            const petId = workers[idx];
                            const pet = petId ? pets.find(p => p.id === petId) : null;
                            if (!isSlotUnlocked) return (<div key={idx} className="bg-slate-900/50 border border-dashed border-white/5 rounded-2xl p-4 flex items-center gap-4 opacity-50"><div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center"><Lock className="w-5 h-5 text-slate-600" /></div><div className="text-slate-600 text-xs font-bold uppercase">{t ? t('needs_village_level', { level: idx + 1 }) : `Requires Village Level ${idx + 1}`}</div></div>);
                            if (pet) return (<div key={idx} className="bg-slate-800 border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-lg group cursor-pointer" onClick={() => onRemoveWorker(resourceId, idx)}><div className="flex items-center gap-4"><div className="relative"><PetAvatar pet={pet} className="w-12 h-12" /><div className="absolute inset-0 bg-red-500/90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-5 h-5 text-white" /></div></div><div><div className="font-bold text-white">{pet.name}</div><div className="text-[10px] text-slate-400 uppercase font-bold">Lvl {pet.level} • {pet.rarity}</div></div></div>{rate > 0 && isProductionActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>}</div>);
                            return (<button key={idx} onClick={() => onAssignWorker(resourceId, idx)} className="w-full bg-slate-800/30 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-3 flex items-center gap-4 group transition-all active:scale-98"><div className="w-12 h-12 bg-slate-900/80 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors"><Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" /></div><div className="text-slate-500 font-bold group-hover:text-indigo-300 transition-colors text-sm">{t ? t('btn_assign_worker') : 'Assign worker'}</div></button>);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}