import React from 'react';
import { Swords, Flame } from 'lucide-react';

export default function BattleCard({ onBattle, t, tutorialHighlight }) {
    return (
        <button
            onClick={onBattle}
            className={`w-full relative h-56 sm:h-64 rounded-[32px] overflow-hidden group shadow-2xl shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-white/5 animate-in fade-in zoom-in-95 ${tutorialHighlight === 'battle' ? 'ring-4 ring-yellow-400 z-50 animate-pulse' : ''}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-700"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>

            <div className="absolute -right-8 -bottom-8 text-red-900/30 group-hover:text-white/10 transition-colors rotate-12 duration-500 group-hover:rotate-0 group-hover:scale-110">
                <Swords className="w-64 h-64 sm:w-72 sm:h-72" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
                <div className="flex justify-between items-start">
                    <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-lg animate-pulse-slow">
                        <span className="text-[9px] sm:text-[10px] font-bold text-red-100 uppercase tracking-widest flex items-center gap-1.5">
                            <Flame className="w-3 h-3 fill-current animate-pulse" /> {t ? t('arena_pvp_zone') : 'PvP Zone'}
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="text-4xl sm:text-5xl font-black italic text-white mb-2 drop-shadow-xl uppercase tracking-tighter group-hover:text-glow transition-all">{t ? t('arena_battle_btn') : 'Kämpfen'}</h3>
                    <p className="text-red-100/90 text-xs sm:text-sm font-bold max-w-[200px] leading-tight">{t ? t('arena_pvp_desc') : 'Fordere Gegner heraus und erklimme die Rangliste!'}</p>
                </div>
            </div>
        </button>
    );
}
