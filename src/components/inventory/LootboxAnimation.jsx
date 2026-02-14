import React from 'react';
import { Package, Sparkles } from 'lucide-react';

export default function LootboxAnimation({
    animationStage, cycleRarity, resultPet, canCollect,
    finishAnimation, t
}) {
    if (animationStage === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">

            {/* HINTERGRUND EFFEKTE */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Sternenfeld */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                {/* Wirbelnder Tunnel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(79,70,229,0.1)_0deg,transparent_60deg,rgba(79,70,229,0.1)_120deg,transparent_180deg,rgba(79,70,229,0.1)_240deg,transparent_300deg,rgba(79,70,229,0.1)_360deg)] animate-spin-slow opacity-50"></div>
            </div>

            {/* CHARGING & SHAKING */}
            {(animationStage === 'charging' || animationStage === 'shaking') && (
                <div className="relative z-10 flex flex-col items-center">
                    {/* Glow hinter der Box */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500 rounded-full blur-[80px] transition-all duration-500 ${animationStage === 'shaking' ? 'scale-150 opacity-60' : 'scale-0 opacity-0'}`}></div>

                    {/* Die Box */}
                    <div className={`relative ${animationStage === 'charging' ? 'animate-bounce' : 'animate-shake-hard'} transition-transform duration-300`}>
                        <Package className={`w-48 h-48 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] ${animationStage === 'shaking' ? 'brightness-150' : ''}`} />
                    </div>

                    <p className="text-yellow-200 mt-12 font-black text-2xl tracking-[0.3em] animate-pulse">
                        {animationStage === 'charging' ? (t ? t('inv_status_ready') : 'BEREIT...') : (t ? t('inv_status_opening') : 'ÖFFNEN')}
                    </p>
                </div>
            )}

            {/* CYCLING & REVEAL */}
            {(animationStage === 'cycling' || animationStage === 'revealed') && (
                <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in duration-200">
                    {/* Background Flash based on current cycle rarity */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${cycleRarity.bg} blur-[100px] opacity-80 transition-colors duration-75 pointer-events-none`}></div>

                    <div className="scale-150 mb-8">
                        <Sparkles className={`w-32 h-32 ${cycleRarity.color} ${animationStage === 'cycling' ? 'animate-spin-slow' : 'animate-pulse'}`} />
                    </div>

                    <div className="text-center">
                        <h2 className={`text-4xl font-black uppercase tracking-widest ${cycleRarity.color} drop-shadow-lg transition-colors duration-75`}>
                            {cycleRarity.label}
                        </h2>
                        <p className="text-white/50 text-sm font-bold uppercase tracking-[0.5em] mt-2">
                            {animationStage === 'cycling' ? "Bestimme Seltenheit..." : "GEFUNDEN!"}
                        </p>
                    </div>

                    {/* Button */}
                    {animationStage === 'revealed' && canCollect && (
                        <button
                            onClick={finishAnimation}
                            className="mt-12 bg-white hover:bg-slate-200 text-black px-10 py-4 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all animate-in fade-in zoom-in duration-300 relative z-20"
                        >
                            EINSAMMELN
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
