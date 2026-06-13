import React from 'react';
import { TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Swords, Lock, Beer, FlaskConical, Shield, BookOpen, ShoppingBag, Leaf, Gem } from 'lucide-react';
import { RESOURCES } from '../../data/gameData';
import { playSound } from '../../utils/soundManager';

const RESOURCE_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles, training: Swords,
    tavern: Beer, alchemy_lab: FlaskConical, barracks: Shield, library: BookOpen, market_stall: ShoppingBag,
    herb_garden: Leaf, crystal_field: Gem,
};

export default function ResourceGrid({
    user,
    productionRates,
    isActive,
    onSelectResource,
    setShowTraining,
    t
}) {
    const buildings = user?.village?.buildings || {};

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(RESOURCES).map(key => {
                const res = RESOURCES[key];
                const level = buildings[res.id] || 1;
                const workers = user.village.workers[res.id] || [];
                const isUnlocked = user.level >= res.unlockLevel;

                const rate = productionRates ? Math.floor(productionRates(res.id, level, workers) * 3600) : 0;

                return (
                    <button
                        key={res.id}
                        onClick={() => {
                            if (isUnlocked) {
                                playSound('click');
                                if (res.id === 'training') setShowTraining(true);
                                else onSelectResource(res.id);
                            }
                        }}
                        disabled={!isUnlocked}
                        className={`
                            relative p-4 rounded-3xl border text-left h-40 flex flex-col justify-between overflow-hidden group transition-all
                            ${isUnlocked ? 'bg-slate-800 border-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-95' : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}
                        `}
                    >
                        <div className={`absolute -right-4 -top-4 ${res.color} opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-700`}>
                            {React.createElement(RESOURCE_ICONS[res.id], { className: "w-24 h-24" })}
                        </div>

                        <div className="relative z-10">
                            <div className={`w-10 h-10 ${isUnlocked ? res.bg : 'bg-slate-700'} rounded-xl flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                                {isUnlocked ? React.createElement(RESOURCE_ICONS[res.id], { className: "w-5 h-5 text-white" }) : <Lock className="w-5 h-5 text-slate-500" />}
                            </div>
                            <h3 className={`font-black text-sm leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{t ? t('res_' + res.id) : res.buildingLabel}</h3>
                        </div>

                        <div className="relative z-10 space-y-1.5">
                            {isUnlocked ? (
                                <>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">{t ? t('village_rate') : 'Rate/h'}</span>
                                        <span className={`text-xs font-bold ${isActive ? 'text-green-400' : 'text-slate-500'}`}>+{rate}</span>
                                    </div>
                                    {!isActive && <div className="text-[8px] text-red-400 font-bold uppercase">{t ? t('village_paused') : 'Pausiert'}</div>}
                                </>
                            ) : (
                                <span className="text-[9px] font-bold text-red-400 uppercase bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{t ? t('village_lvl') : 'Lvl'} {res.unlockLevel}</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
