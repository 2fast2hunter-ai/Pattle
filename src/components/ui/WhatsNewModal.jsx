import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { PATCHES } from '../../data/patchData';

const BADGE = {
    new: { label: 'NEW', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    changed: { label: 'CHANGED', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    fixed: { label: 'FIXED', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    removed: { label: 'REMOVED', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

export default function WhatsNewModal({ onClose }) {
    const latest = PATCHES[0];
    if (!latest) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-4 py-3 bg-indigo-600/20 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="font-black text-white text-sm tracking-wide">WHAT'S NEW</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-indigo-300 font-bold">{latest.version}</span>
                        <button
                            onClick={onClose}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <ul className="p-4 space-y-3 max-h-72 overflow-y-auto">
                    {latest.changes.map((change, i) => {
                        const badge = BADGE[change.type] || BADGE.changed;
                        return (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <span className={`shrink-0 mt-0.5 text-[10px] font-black px-1.5 py-0.5 rounded ${badge.className}`}>
                                    {badge.label}
                                </span>
                                <span>{change.text}</span>
                            </li>
                        );
                    })}
                </ul>

                <div className="px-4 pb-4">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
