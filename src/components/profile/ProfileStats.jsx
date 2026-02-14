import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ProfileStats({ categories, setSelectedCategory }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:bg-slate-750 transition-all active:scale-95 group relative overflow-hidden"
                >
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cat.color} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
                    <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center ${cat.textColor} shadow-inner border border-white/5`}><cat.icon className="w-5 h-5" /></div>
                    <div className="text-left relative z-10"><div className="text-2xl font-black text-white">{cat.value}</div><div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">{cat.label} <ArrowUpRight className="w-3 h-3 opacity-50" /></div></div>
                </button>
            ))}
        </div>
    );
}
