import React from 'react';
import { ThermometerSun, Ticket, X } from 'lucide-react';
import { useHatchery } from '../hooks/useHatchery';
import EggSelectionModal from '../components/modals/EggSelectionModal';
import HatchingModal from '../components/hatchery/HatchingModal';
import EggSlot from '../components/hatchery/EggSlot';

// --- MAIN SCREEN ---
export default function HatcheryScreen({ pets, user, onBack, onHatchEgg, onReduceCooldown, onStartIncubation, onWatchAdForHatch, t, tutorialHighlight }) {
    const {
        unlockedSlots, maxSlots,
        hatchingPet,
        nameInput, setNameInput,
        showSelector, setShowSelector,
        ticketCount,
        incubatingEggs, inventoryEggs,
        handleSlotClick, handleSelectEgg,
        startHatchingProcess, confirmHatch,
        formatTime
    } = useHatchery(pets, user, onHatchEgg, onStartIncubation);

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">

            {/* MODAL: EI AUSWAHL */}
            {showSelector && (
                <EggSelectionModal
                    eggs={inventoryEggs}
                    onSelect={handleSelectEgg}
                    onClose={() => setShowSelector(false)}
                />
            )}

            {/* MODAL: SCHLÜPFEN */}
            <HatchingModal
                hatchingPet={hatchingPet}
                nameInput={nameInput}
                setNameInput={setNameInput}
                confirmHatch={confirmHatch}
                t={t}
                tutorialHighlight={tutorialHighlight}
            />

            {/* --- HEADER --- */}
            <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white">
                    {t ? t('hatchery_title') : 'BRUTSTÄTTE'}
                </h1>
                <button
                    onClick={onBack}
                    className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* --- INFO BAR --- */}
            <div className="px-4 mb-4">
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <ThermometerSun className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">{t ? t('hatchery_capacity') : 'Kapazität'}</div>
                            <div className="text-sm font-black text-white">{incubatingEggs.length} / {unlockedSlots} {t ? t('hatchery_eggs') : 'Eier'}</div>
                        </div>
                    </div>

                    {/* Tickets Info (zum Beschleunigen) */}
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5">
                        <Ticket className="w-3.5 h-3.5 text-pink-400" />
                        <span className="text-xs font-bold text-white">{ticketCount}</span>
                    </div>
                </div>
            </div>

            {/* --- SLOTS GRID --- */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: maxSlots }).map((_, index) => {
                        const isUnlocked = index < unlockedSlots;
                        const egg = index < incubatingEggs.length ? incubatingEggs[index] : null;

                        return (
                            <EggSlot
                                key={index}
                                index={index}
                                egg={egg}
                                isUnlocked={isUnlocked}
                                unlockedSlots={unlockedSlots}
                                onClick={handleSlotClick}
                                startHatchingProcess={startHatchingProcess}
                                onReduceCooldown={onReduceCooldown}
                                onWatchAdForHatch={onWatchAdForHatch}
                                ticketCount={ticketCount}
                                formatTime={formatTime}
                                t={t}
                                tutorialHighlight={tutorialHighlight}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
