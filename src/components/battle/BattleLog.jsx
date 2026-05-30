import React, { useEffect, useRef } from 'react';

export default function BattleLog({ log }) {
    const logEndRef = useRef(null);

    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    return (
        <div className="h-32 sm:h-36 relative shrink-0 z-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px] sm:text-xs scrollbar-hide h-full">
                {[...log].reverse().map((entry, i) => {
                    const isDeath = entry.includes('💀');
                    const isEffective = entry.startsWith('⚡');
                    return (
                        <div key={log.length - 1 - i} className={`flex items-center gap-2 ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-600'}`}></div>
                            <span className={`${i === 0 ? 'text-white font-bold' : 'text-slate-400'} ${isDeath ? 'text-red-400 !opacity-100' : ''} ${isEffective ? 'text-cyan-300 !opacity-100' : ''}`}>
                                {entry}
                            </span>
                        </div>
                    );
                })}
                <div ref={logEndRef} />
            </div>
        </div>
    );
}
