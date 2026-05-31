import React from 'react';
import { Moon, Package, Sparkles, X } from 'lucide-react';
import { RESOURCE_ITEMS } from '../../data/gameData';

const ALL_ITEMS = Object.values(RESOURCE_ITEMS).flat();

function getItemLabel(itemId) {
    const found = ALL_ITEMS.find(i => i.id === itemId);
    return found ? found.label : itemId;
}

function groupItems(itemIds) {
    const counts = {};
    itemIds.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

export default function IdleReturnModal({ result, onClose, t }) {
    if (!result) return null;
    const { items = [], xp = 0, elapsedMs = 0 } = result;
    const grouped = groupItems(items);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9990] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-indigo-500/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600/30 rounded-xl">
                            <Moon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                                {t ? t('idle_return_title') : 'While you were away'}
                            </div>
                            {elapsedMs > 0 && (
                                <div className="text-[11px] text-slate-500">
                                    {formatDuration(elapsedMs)} {t ? t('idle_return_offline') : 'offline'}
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {grouped.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                        {t ? t('idle_return_nothing') : 'Nothing produced.'}
                    </div>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {grouped.map(([itemId, count]) => (
                            <div key={itemId} className="flex items-center justify-between bg-slate-700/50 rounded-xl px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span className="text-sm font-medium text-white">{getItemLabel(itemId)}</span>
                                </div>
                                <span className="text-sm font-bold text-emerald-400">+{count}</span>
                            </div>
                        ))}
                    </div>
                )}

                {xp > 0 && (
                    <div className="flex items-center justify-between mt-3 bg-purple-900/30 border border-purple-500/20 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">
                                {t ? t('idle_return_xp') : 'Dorf-XP'}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-purple-300">+{xp}</span>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl text-white font-bold text-sm transition-all"
                >
                    {t ? t('idle_return_claim') : 'Einsammeln'}
                </button>
            </div>
        </div>
    );
}
