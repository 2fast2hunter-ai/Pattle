import React from 'react';

export default function InventoryCard({ icon: Icon, count, label, colorColor, bgColor, onClick, specialIcon, footerButton, ringColor }) {
    return (
        <div 
            onClick={onClick} 
            className={`
                relative group aspect-square rounded-[24px] p-3 cursor-pointer overflow-hidden transition-all duration-300
                bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg
                hover:scale-[1.02] hover:shadow-2xl hover:border-white/30 active:scale-95
                ${ringColor ? `ring-2 ${ringColor} ring-offset-2 ring-offset-slate-950` : ''}
                flex flex-col items-center justify-between
            `}
        >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${bgColor} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}></div>

            <div className="w-full flex justify-end relative z-10">
                <span className="bg-slate-950/80 text-[10px] font-black text-white px-2 py-0.5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">
                    x{Math.floor(count).toLocaleString()}
                </span>
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center">
                <div className="relative">
                    <Icon className={`w-12 h-12 ${colorColor} drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform`} />
                    {specialIcon}
                </div>
            </div>
            
            <div className="relative z-10 w-full text-center flex flex-col gap-1.5">
                <div className={`text-[9px] font-black uppercase tracking-wider ${colorColor} ${footerButton ? 'truncate leading-none' : 'bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm w-full leading-tight'}`}>
                    {label}
                </div>
                {footerButton}
            </div>
        </div>
    );
}