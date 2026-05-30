import React from 'react';
import { Ghost, Ticket, Clock, Lock } from 'lucide-react';
import { RARITIES, TYPES } from '../../data/gameData';
import PetAvatar from '../PetAvatar';

export default function BreedingPetList({
    filteredPets, selected, pets, toggleSelect,
    getCooldownStatus, getLevelReq, onReduceCooldown, ticketCount, t
}) {
    return (
        <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
            {filteredPets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500 opacity-50"><Ghost className="w-12 h-12 mb-2" /><p className="text-xs font-bold">{t ? t('breeding_no_pets') : 'No matching pets.'}</p></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredPets.map(pet => {
                        const rarity = RARITIES[pet.rarity];
                        const type = TYPES[pet.type];
                        const isSelected = selected.includes(pet.id);
                        const cooldown = getCooldownStatus(pet);
                        const minLevel = getLevelReq(pet);
                        const isLevelLow = pet.level < minLevel;

                        // NEU: Prüfen ob Seltenheit passt (wenn schon eins gewählt ist)
                        const firstSelected = selected.length > 0 ? pets.find(p => p.id === selected[0]) : null;
                        const isRarityMismatch = firstSelected && !isSelected && firstSelected.rarity !== pet.rarity;

                        return (
                            <div
                                key={pet.id}
                                onClick={() => !cooldown && !isLevelLow && !isRarityMismatch && toggleSelect(pet.id)}
                                className={`
                                relative overflow-hidden rounded-2xl p-2 transition-all
                                bg-slate-800 border-2 
                                ${isSelected ? 'border-pink-500 ring-2 ring-pink-500/30 scale-[0.98]' : (cooldown || isLevelLow || isRarityMismatch ? 'border-slate-700 opacity-50 cursor-not-allowed' : `${rarity.border} cursor-pointer active:scale-95`)}
                            `}
                            >
                                {isSelected && <div className="absolute top-2 right-2 w-4 h-4 bg-pink-500 rounded-full border-2 border-white z-20 shadow-lg"></div>}

                                {/* Level Low Overlay */}
                                {isLevelLow && (
                                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-[2px] p-2 text-center animate-in fade-in">
                                        <Lock className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-xs font-black text-slate-200 mb-1">{t ? t('village_lvl') : 'Lvl'} {minLevel}</span>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase">{t ? t('breeding_required') : 'Required'}</span>
                                    </div>
                                )}

                                {/* Rarity Mismatch Overlay */}
                                {isRarityMismatch && (
                                    <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center backdrop-blur-[1px] p-2 text-center animate-in fade-in">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase">{t ? t('breeding_wrong_rarity') : 'Wrong Rarity'}</span>
                                    </div>
                                )}

                                {/* Cooldown Overlay */}
                                {!isLevelLow && !isRarityMismatch && cooldown && (
                                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-[2px] p-2 text-center animate-in fade-in">
                                        <Clock className="w-5 h-5 text-red-400 mb-1" />
                                        <span className="text-xs font-black text-red-200 mb-2">{cooldown}</span>

                                        {ticketCount > 0 ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Verhindert Selektion
                                                    onReduceCooldown(pet.id, 'BREEDING');
                                                }}
                                                className="bg-pink-600 hover:bg-pink-500 text-white text-[9px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-lg"
                                            >
                                                <Ticket className="w-3 h-3" /> -5m
                                            </button>
                                        ) : (
                                            <span className="text-[9px] text-slate-500 font-bold">{t ? t('breeding_wait') : 'Wait...'}</span>
                                        )}
                                    </div>
                                )}

                                <div className={`absolute -right-8 -top-8 w-24 h-24 ${type.bg} opacity-20 blur-2xl rounded-full`}></div>

                                <div className="flex justify-center mb-1 relative z-10">
                                    <PetAvatar pet={pet} className="w-14 h-14 drop-shadow-md" />
                                </div>

                                <div className="relative z-10 text-center">
                                    <h3 className={`font-bold text-xs truncate mb-1 ${rarity.color}`}>{pet.name}</h3>
                                    <div className="flex justify-center gap-2 text-[9px] font-bold text-slate-400 bg-black/20 p-1 rounded-lg">
                                        <span className={`${type.color}`}>{t ? t('type_' + pet.type) : type.label}</span>
                                        <span>{t ? t('village_lvl') : 'Lvl'} {pet.level}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
