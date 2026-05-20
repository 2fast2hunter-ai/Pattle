import React, { useEffect, useState } from 'react';
import { ArrowLeft, Ticket, Filter } from 'lucide-react';
import { useBreeding } from '../hooks/useBreeding';
import BreedingFilterSidebar from '../components/breeding/BreedingFilterSidebar';
import BreedingResultModal from '../components/breeding/BreedingResultModal';
import BreedingStation from '../components/breeding/BreedingStation';
import BreedingPetList from '../components/breeding/BreedingPetList';

export default function BreedingScreen({ pets, onBreed, onBack, user, onReduceCooldown, t }) {
    const {
        selected, isSidebarOpen, setSidebarOpen, searchTerm, setSearchTerm,
        activeTypeFilter, setActiveTypeFilter, sortBy, setSortBy, breedingResult, setBreedingResult,
        isBreeding, filteredPets, resetFilters, activeFilterCount, canBreed,
        rarityProbabilities, fusionRecipe, toggleSelect, handleBreedClick, getCooldownStatus, getLevelReq
    } = useBreeding(pets, user, onBreed);

    // Timer für Live-Updates
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const ticketCount = user?.inventory?.filter(i => i.type === 'TICKET').length || 0;

    return (
        <div className="h-full flex flex-col animate-in fade-in relative">
            {breedingResult && (
                <BreedingResultModal result={breedingResult} onClose={() => setBreedingResult(null)} t={t} />
            )}

            <BreedingFilterSidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                activeTypeFilter={activeTypeFilter} setActiveTypeFilter={setActiveTypeFilter}
                sortBy={sortBy} setSortBy={setSortBy}
                resetFilters={resetFilters}
                t={t}
            />

            <div className="relative flex items-center justify-between mb-4 pt-2 px-4">
                <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-xl border transition-all relative ${activeFilterCount > 0 ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400'}`}>
                    <Filter className="w-5 h-5" />
                    {activeFilterCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-pink-600 rounded-full flex items-center justify-center text-[9px] font-bold">{activeFilterCount}</div>}
                </button>
                <h1 className="text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-white">{t ? t('breeding_title') : 'ZUCHT LABOR'}</h1>
                <button onClick={onBack} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            </div>

            <BreedingStation
                selected={selected}
                pets={pets}
                toggleSelect={toggleSelect}
                canBreed={canBreed}
                isBreeding={isBreeding}
                handleBreedClick={handleBreedClick}
                rarityProbabilities={rarityProbabilities}
                fusionRecipe={fusionRecipe}
                t={t}
            />

            <div className="px-4 mb-2 flex justify-end">
                <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/5">
                    <Ticket className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-xs font-bold text-white">{ticketCount} {t ? t('arena_tickets') : 'Tickets'}</span>
                </div>
            </div>

            <BreedingPetList
                filteredPets={filteredPets}
                selected={selected}
                pets={pets}
                toggleSelect={toggleSelect}
                getCooldownStatus={getCooldownStatus}
                getLevelReq={getLevelReq}
                onReduceCooldown={onReduceCooldown}
                ticketCount={ticketCount}
                t={t}
            />
        </div>
    );
}