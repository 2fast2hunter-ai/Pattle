import React from 'react';
import { TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Beer, FlaskConical, BookOpen, ShoppingBag, Leaf, Gem } from 'lucide-react';
import { RESOURCES, getStorageCapacity, getStorageTotalForResource } from '../../data/gameData';

const ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star,
    computer_parts: Cpu, special: Sparkles, tavern: Beer, alchemy_lab: FlaskConical,
    library: BookOpen, market_stall: ShoppingBag, herb_garden: Leaf, crystal_field: Gem,
};

const COLORS = {
    wood: 'bg-amber-600', stone: 'bg-stone-500', seafood: 'bg-blue-500',
    stardust: 'bg-purple-600', computer_parts: 'bg-cyan-600', special: 'bg-pink-600',
    tavern: 'bg-amber-600', alchemy_lab: 'bg-green-700', library: 'bg-indigo-700',
    market_stall: 'bg-yellow-600', herb_garden: 'bg-green-600', crystal_field: 'bg-violet-600',
};

// Resources that have item drop tables (excludes training/barracks which are XP-only)
const STORAGE_RESOURCE_IDS = Object.values(RESOURCES)
    .filter(r => r.id !== 'training' && r.id !== 'barracks')
    .map(r => r.id);

export default function ResourceStorageBars({ user, t }) {
    if (!user?.village) return null;

    const storage = user.village.storage || {};
    const buildings = user.village.buildings || {};
    const research = user.village.research || {};

    return (
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-3">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2">
                {t ? t('village_storage') : 'Lager'}
            </div>
            <div className="space-y-1.5">
                {STORAGE_RESOURCE_IDS.map(resId => {
                    const res = RESOURCES[resId.toUpperCase()] || Object.values(RESOURCES).find(r => r.id === resId);
                    if (!res) return null;
                    const Icon = ICONS[resId];
                    const buildingLevel = buildings[resId] || 1;
                    const baseCap = getStorageCapacity(resId, buildingLevel);
                    const capMultiplier = research.research_storage_1 ? 1.25 : 1.0;
                    const cap = Math.floor(baseCap * capMultiplier);
                    const total = getStorageTotalForResource(storage, resId);
                    const pct = cap > 0 ? Math.min(100, (total / cap) * 100) : 0;
                    const isFull = pct >= 95;
                    const barColor = COLORS[resId] || 'bg-slate-500';

                    return (
                        <div key={resId} className="flex items-center gap-2">
                            {Icon && <Icon className="w-3 h-3 text-slate-400 shrink-0" />}
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${barColor} ${isFull ? 'animate-pulse' : ''}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className={`text-[8px] font-bold w-16 text-right shrink-0 ${isFull ? 'text-yellow-400' : 'text-slate-500'}`}>
                                {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}/{cap >= 1000 ? `${(cap / 1000).toFixed(0)}k` : cap}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
