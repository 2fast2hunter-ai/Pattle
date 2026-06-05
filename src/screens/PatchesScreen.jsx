import React from 'react';
import { ArrowLeft, ScrollText } from 'lucide-react';
import { PATCHES } from '../data/patchData';


const BADGE = {
    new: { label: 'NEW', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    changed: { label: 'CHANGED', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    fixed: { label: 'FIXED', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    removed: { label: 'REMOVED', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

export default function PatchesScreen({ onBack, t }) {
    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
            <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-black italic tracking-wide text-white">
                        {t ? t('patches_title') : 'PATCH NOTES'}
                    </h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {PATCHES.map((patch) => (
                    <div key={patch.version} className="rounded-2xl bg-slate-900 border border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-indigo-600/10 border-b border-white/5">
                            <span className="font-black text-white text-sm">{patch.version}</span>
                            <span className="text-xs text-slate-400">{patch.date}</span>
                        </div>
                        <ul className="p-4 space-y-3">
                            {patch.changes.map((change, i) => {
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
                    </div>
                ))}
            </div>
        </div>
    );
}
