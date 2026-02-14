import React, { useState, useEffect } from 'react';
import { Heart, Egg, Sparkles } from 'lucide-react';
import { RARITIES } from '../../data/gameData';
import PetAvatar from '../PetAvatar';

export default function BreedingResultModal({ result, onClose, t }) {
    const [stage, setStage] = useState('parents'); // parents -> heart -> egg
    const { egg, parent1, parent2 } = result;
    const rarity = RARITIES[egg.rarity];

    useEffect(() => {
        const t1 = setTimeout(() => setStage('heart'), 800);
        const t2 = setTimeout(() => setStage('egg'), 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="flex flex-col items-center justify-center w-full max-w-md relative">

                {/* STAGE 1 & 2: PARENTS */}
                {stage !== 'egg' && (
                    <div className="flex items-center gap-8 mb-8">
                        <div className={`transition-all duration-1000 ${stage === 'heart' ? 'translate-x-8 scale-75 opacity-50' : ''}`}>
                            <PetAvatar pet={parent1} className="w-24 h-24" />
                        </div>
                        <div className={`transition-all duration-1000 ${stage === 'heart' ? '-translate-x-8 scale-75 opacity-50' : ''}`}>
                            <PetAvatar pet={parent2} className="w-24 h-24" />
                        </div>
                    </div>
                )}

                {/* STAGE 2: HEART */}
                {stage === 'heart' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-in zoom-in duration-500">
                        <Heart className="w-32 h-32 text-pink-500 fill-pink-500 animate-pulse drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" />
                    </div>
                )}

                {/* STAGE 3: EGG REVEAL */}
                {stage === 'egg' && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500">
                        <div className={`relative w-48 h-48 flex items-center justify-center mb-8`}>
                            <div className={`absolute inset-0 ${rarity.bg} blur-[60px] opacity-40 animate-pulse`}></div>
                            <Egg className={`w-40 h-40 ${rarity.color} drop-shadow-2xl animate-bounce`} />
                            <Sparkles className="absolute top-0 right-0 w-12 h-12 text-yellow-300 animate-spin-slow" />
                        </div>

                        <h2 className={`text-3xl font-black uppercase tracking-widest ${rarity.color} mb-2 drop-shadow-lg`}>
                            {t ? t('rarity_' + egg.rarity) : rarity.label}
                        </h2>
                        <p className="text-white text-sm font-bold opacity-80 mb-8">
                            {t ? t('inv_egg_suffix') : 'Ei'} erhalten!
                        </p>

                        <button onClick={onClose} className="bg-white text-black font-black py-3 px-10 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                            {t ? t('breeding_done') : 'Fertig'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
