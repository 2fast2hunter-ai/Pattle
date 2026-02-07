import React from 'react';
import { Info } from 'lucide-react';

export default function TutorialOverlay({ message, step }) {
    if (!message) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-bottom-10 duration-500 pointer-events-none">
            <div className="bg-indigo-600/90 backdrop-blur-md border-2 border-indigo-400 text-white p-4 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center gap-4 pointer-events-auto">
                <div className="bg-white/20 p-2 rounded-full animate-pulse shrink-0">
                    <Info className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-1">Tutorial • Schritt {step + 1}/10</div>
                    <div className="font-bold text-sm leading-tight">{message}</div>
                </div>
            </div>
        </div>
    );
}
