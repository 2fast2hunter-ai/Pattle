import React from 'react';
import { TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Swords } from 'lucide-react';

const ICONS = {
    wood: TreePine,
    stone: Pickaxe,
    seafood: Fish,
    stardust: Star,
    computer_parts: Cpu,
    special: Sparkles,
    training: Swords,
};

const COLORS = {
    wood: 'bg-amber-600',
    stone: 'bg-stone-500',
    seafood: 'bg-blue-500',
    stardust: 'bg-purple-600',
    computer_parts: 'bg-cyan-600',
    special: 'bg-pink-600',
    training: 'bg-red-600',
};

const STORAGE_CAP = 10000; // fallback cap per resource

export default function ResourceStorageBars({ user, t }) {
    if (!user?.village?.resources) return null;

    const resources = user.village.resources;
    const entries = Object.entries(resources).filter(([k]) => k !== 'training');

    if (entries.length === 0) return null;

    return (
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-3">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2">
                {t ? t('village_storage') : 'Lager'}
            </div>
            <div className="space-y-1.5">
                {entries.map(([key, amount]) => {
                    const Icon = ICONS[key];
                    const cap = user.village.storageCap?.[key] || STORAGE_CAP;
                    const pct = Math.min(100, (amount / cap) * 100);
                    const isFull = pct >= 95;
                    const barColor = COLORS[key] || 'bg-slate-500';

                    return (
                        <div key={key} className="flex items-center gap-2">
                            {Icon && <Icon className="w-3 h-3 text-slate-400 shrink-0" />}
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${barColor} ${isFull ? 'animate-pulse' : ''}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className={`text-[8px] font-bold w-10 text-right shrink-0 ${isFull ? 'text-yellow-400' : 'text-slate-500'}`}>
                                {amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : amount}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
