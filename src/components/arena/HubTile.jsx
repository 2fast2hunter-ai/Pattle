import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function HubTile({ title, subtitle, icon: Icon, colorFrom, colorTo, iconColor, onClick, extraInfo, delay, highlight }) {
    return (
        <button
            onClick={onClick}
            style={{ animationDelay: `${delay}ms` }}
            className={`
              relative group w-full p-0.5 rounded-[24px] shadow-lg
              bg-gradient-to-br ${colorFrom} ${colorTo} ${highlight ? 'ring-4 ring-yellow-400 z-50 animate-pulse' : ''}
              transform transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left h-32 sm:h-36 animate-in slide-in-from-bottom-8 fade-in fill-mode-backwards overflow-hidden
          `}
        >
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[22px] p-4 sm:p-5 h-full flex flex-col justify-between relative overflow-hidden group-hover:bg-slate-900/70 transition-colors">

                <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>

                <div className={`absolute -right-4 -bottom-4 text-${iconColor.split('-')[1]}-500/10 group-hover:text-${iconColor.split('-')[1]}-500/20 transition-colors group-hover:scale-110 duration-500`}>
                    <Icon className="w-20 h-20 sm:w-24 sm:h-24" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${iconColor.split('-')[1]}-500/20 rounded-2xl flex items-center justify-center ${iconColor} shadow-inner border border-white/5 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    {extraInfo && (
                        <div className="bg-slate-800 px-2 sm:px-2.5 py-1 rounded-lg border border-white/10 text-[9px] sm:text-[10px] font-black text-white shadow-sm">
                            {extraInfo}
                        </div>
                    )}
                </div>

                <div className="relative z-10">
                    <h4 className="font-black text-white text-base sm:text-lg leading-none mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                        {title}
                    </h4>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-white transition-colors">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{subtitle}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </div>
                </div>
            </div>
        </button>
    );
}
