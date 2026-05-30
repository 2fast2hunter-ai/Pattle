import React from 'react';
import { Check, Edit3, Sparkles } from 'lucide-react';
import { RARITIES, TYPES } from '../../data/gameData';
import PetAvatar from '../PetAvatar';

export default function HatchingModal({ hatchingPet, nameInput, setNameInput, confirmHatch, t, tutorialHighlight }) {
    if (!hatchingPet) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-6 animate-in zoom-in-50 duration-300">
            <div className={`bg-slate-900 border-2 ${RARITIES[hatchingPet.rarity].border} w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden group`}>

                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] ${RARITIES[hatchingPet.rarity].bg} opacity-20 blur-[80px] animate-spin-slow`}></div>

                <div className="relative z-10">
                    <h2 className="text-4xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white mb-1 uppercase drop-shadow-sm">
                        {t ? t('hatchery_modal_title') : 'ES LEBT!'}
                    </h2>
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] ${RARITIES[hatchingPet.rarity].color} mb-8`}>
                        {t ? t('hatchery_modal_subtitle') : 'Neuer Begleiter'}
                    </p>

                    <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-8">
                        <div className={`absolute inset-0 border-4 border-dashed ${RARITIES[hatchingPet.rarity].border} rounded-full opacity-30 animate-spin-slow`}></div>
                        <div className={`absolute inset-6 border-2 ${RARITIES[hatchingPet.rarity].border} rounded-full opacity-50 animate-ping-slow`}></div>

                        <div className="relative z-10 transition-transform hover:scale-105 duration-500">
                            <PetAvatar
                                pet={{ ...hatchingPet, isEgg: false }}
                                className="w-56 h-56 drop-shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
                            />
                        </div>

                        <Sparkles className="absolute top-0 right-0 text-yellow-300 w-10 h-10 animate-bounce delay-100 z-20" />
                        <Sparkles className="absolute bottom-0 left-0 text-white w-8 h-8 animate-bounce delay-300 z-20" />
                    </div>

                    <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-4 mb-6 border border-white/5">
                        <p className="text-slate-300 text-sm">
                            {t ? t('hatchery_hatched_msg', { rarity: t('rarity_' + hatchingPet.rarity), type: TYPES[hatchingPet.type].label }) : `A ${RARITIES[hatchingPet.rarity].label} ${TYPES[hatchingPet.type].label} monster hatched!`}
                        </p>
                    </div>

                    <div className="text-left mb-6">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-wider">{t ? t('hatchery_name_label') : 'Gib ihm einen Namen'}</label>
                        <div className="flex items-center bg-slate-950 rounded-2xl mt-1 border border-white/10 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all overflow-hidden">
                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className="bg-transparent w-full p-4 outline-none text-white font-bold text-lg placeholder-slate-700 text-center"
                                autoFocus
                                onFocus={(e) => e.target.select()}
                            />
                            <div className="pr-4 text-slate-600">
                                <Edit3 className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={confirmHatch}
                        className={`w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${tutorialHighlight === 'welcome-btn' ? 'ring-4 ring-yellow-400 z-50 animate-pulse' : ''}`}
                    >
                        <Check className="w-6 h-6" />
                        {t ? t('hatchery_welcome_btn') : 'WILLKOMMEN!'}
                    </button>
                </div>
            </div>
        </div>
    );
}
