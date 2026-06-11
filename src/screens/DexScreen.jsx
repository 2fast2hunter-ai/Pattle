import React, { useState, useMemo } from 'react';
import { X, Lock, Eye, CheckCircle } from 'lucide-react';
import { RARITIES, BASE_ANIMALS, MYTHIC_SPECIES } from '../data/gameData';
import { TYPES } from '../data/types';
import PetAvatar from '../components/PetAvatar';

const RARITY_ORDER = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'ANCIENT', 'COSMIC', 'TRANSCENDENT'];

// Group all species by type, including mythic species in their natural type
function buildTypeGroups() {
    const groups = {};
    const typeKeys = Object.keys(TYPES);
    typeKeys.forEach(typeKey => {
        groups[typeKey] = Object.values(BASE_ANIMALS)
            .filter(a => a.type === typeKey);
    });
    return groups;
}

const TYPE_GROUPS = buildTypeGroups();

// Status per species: 'owned' | 'seen' | 'unknown'
function getSpeciesStatus(speciesId, ownedSet, seenSet) {
    if (ownedSet.has(speciesId)) return 'owned';
    if (seenSet.has(speciesId)) return 'seen';
    return 'unknown';
}

function DexCard({ animal, status, t }) {
    const isMythic = MYTHIC_SPECIES.includes(animal.id);
    const typeData = TYPES[animal.type] || {};

    const cardClass = {
        owned: 'bg-yellow-900/30 border-yellow-500/50 shadow-lg shadow-yellow-900/20',
        seen: 'bg-slate-800/60 border-blue-500/30',
        unknown: 'bg-slate-900/60 border-white/5 opacity-40',
    }[status];

    return (
        <div className={`relative rounded-2xl p-2.5 border transition-all duration-200 ${cardClass}`}>
            <div className="flex flex-col items-center gap-1.5 relative z-10">

                {/* Avatar / Icon */}
                {status === 'owned' ? (
                    <PetAvatar
                        pet={{ species: animal.id, type: animal.type, rarity: isMythic ? 'MYTHIC' : 'COMMON', isEgg: false, name: animal.label }}
                        className="w-12 h-12 drop-shadow-md"
                    />
                ) : status === 'seen' ? (
                    <div className="w-12 h-12 flex items-center justify-center text-2xl grayscale opacity-70 select-none">
                        {animal.icon}
                    </div>
                ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-xl border border-white/10">
                        <Lock className="w-5 h-5 text-slate-600" />
                    </div>
                )}

                {/* Name */}
                <div className="text-center w-full">
                    <div className={`text-[10px] font-black truncate w-full leading-tight ${
                        status === 'owned' ? 'text-white' :
                        status === 'seen'  ? 'text-slate-300' :
                                            'text-slate-600'
                    }`}>
                        {status === 'unknown' ? '???' : animal.label}
                    </div>
                    {status !== 'unknown' && (
                        <div className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${typeData.color || 'text-slate-400'}`}>
                            {typeData.label || animal.type}
                        </div>
                    )}
                </div>

                {/* Status badge */}
                {status === 'owned' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-black">
                        ✓
                    </div>
                )}
                {status === 'seen' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Eye className="w-2.5 h-2.5 text-white" />
                    </div>
                )}
                {isMythic && status !== 'unknown' && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[7px] font-black text-black">
                        M
                    </div>
                )}
            </div>
        </div>
    );
}

function TypeSection({ typeKey, animals, ownedSet, seenSet, t }) {
    const typeData = TYPES[typeKey] || {};
    const ownedCount = animals.filter(a => ownedSet.has(a.id)).length;
    const seenCount = animals.filter(a => seenSet.has(a.id) && !ownedSet.has(a.id)).length;
    const total = animals.length;

    return (
        <div className="mb-4">
            {/* Type header */}
            <div className="flex items-center gap-2 mb-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${typeData.bg || 'bg-slate-700'}`}>
                    <span className="text-white text-xs">{typeData.icon}</span>
                </div>
                <span className={`text-sm font-black uppercase tracking-wide ${typeData.color || 'text-white'}`}>
                    {typeData.label || typeKey}
                </span>
                <div className="flex-1 h-px bg-white/10" />
                <div className="flex items-center gap-1">
                    {seenCount > 0 && (
                        <span className="text-[9px] font-bold text-blue-400">{seenCount} gesehen</span>
                    )}
                    {seenCount > 0 && <span className="text-[9px] text-slate-600">·</span>}
                    <span className="text-[9px] font-bold text-yellow-400">{ownedCount}/{total}</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2">
                {animals.map(animal => (
                    <DexCard
                        key={animal.id}
                        animal={animal}
                        status={getSpeciesStatus(animal.id, ownedSet, seenSet)}
                        t={t}
                    />
                ))}
            </div>
        </div>
    );
}

export default function DexScreen({ myPets = [], user = null, onBack, t }) {
    const [activeTab, setActiveTab] = useState('ALL');

    const ownedSet = useMemo(
        () => new Set(myPets.filter(p => !p.isEgg).map(p => p.species)),
        [myPets]
    );
    const seenSet = useMemo(
        () => new Set(user?.seenSpecies || []),
        [user]
    );

    const typeKeys = Object.keys(TYPES);

    // Total stats for header
    const totalSpecies = Object.values(BASE_ANIMALS).length;
    const totalOwned = Object.values(BASE_ANIMALS).filter(a => ownedSet.has(a.id)).length;
    const totalSeen = Object.values(BASE_ANIMALS).filter(a => seenSet.has(a.id) && !ownedSet.has(a.id)).length;

    const visibleTypes = activeTab === 'ALL' ? typeKeys : [activeTab];

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 bg-slate-950">

            {/* Header */}
            <div className="relative flex items-center justify-center pt-2 px-4 shrink-0">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 drop-shadow-sm">
                    {t ? t('dex_title') : 'DEX'}
                </h1>
                <button
                    onClick={onBack}
                    className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95 border border-red-500/30"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Global progress */}
            <div className="px-4 pt-2 pb-2 shrink-0">
                <div className="flex items-center justify-center gap-4 py-2 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-300">{totalOwned} {t ? t('dex_status_owned') : 'Owned'}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold text-blue-300">{totalSeen} {t ? t('dex_status_seen') : 'Seen'}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-bold text-slate-500">{totalSpecies - totalOwned - totalSeen} {t ? t('dex_status_unknown') : 'Unknown'}</span>
                    </div>
                </div>
            </div>

            {/* Type filter tabs */}
            <div className="px-4 pb-2 shrink-0">
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
                    <button
                        onClick={() => setActiveTab('ALL')}
                        className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border transition-all ${
                            activeTab === 'ALL'
                                ? 'bg-white text-black border-white'
                                : 'bg-slate-800/60 text-slate-400 border-white/10 hover:border-white/30'
                        }`}
                    >
                        {t ? t('dex_tab_all') : 'All'}
                    </button>
                    {typeKeys.map(typeKey => {
                        const td = TYPES[typeKey] || {};
                        const isActive = activeTab === typeKey;
                        return (
                            <button
                                key={typeKey}
                                onClick={() => setActiveTab(typeKey)}
                                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border transition-all ${
                                    isActive
                                        ? `${td.bg || 'bg-slate-700'} text-white border-transparent`
                                        : 'bg-slate-800/60 text-slate-400 border-white/10 hover:border-white/30'
                                }`}
                            >
                                <span className="text-[11px]">{td.icon}</span>
                                {td.label || typeKey}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-2">

                {visibleTypes.map(typeKey => {
                    const animals = TYPE_GROUPS[typeKey] || [];
                    if (animals.length === 0) return null;
                    return (
                        <TypeSection
                            key={typeKey}
                            typeKey={typeKey}
                            animals={animals}
                            ownedSet={ownedSet}
                            seenSet={seenSet}
                            t={t}
                        />
                    );
                })}

                {/* Hatch Rates */}
                <div className="pt-2">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
                            {t ? t('dex_hatch_rates') : 'Hatch Rates'}
                        </span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>
                    <div className="space-y-1.5">
                        {RARITY_ORDER.map(rKey => {
                            const r = RARITIES[rKey];
                            if (!r) return null;
                            const isMythic = rKey === 'MYTHIC';
                            return (
                                <div
                                    key={rKey}
                                    className={`flex items-center justify-between px-3 py-2 rounded-xl border ${
                                        isMythic
                                            ? 'bg-yellow-900/20 border-yellow-500/40'
                                            : 'bg-slate-900/40 border-white/5'
                                    }`}
                                >
                                    <span className={`text-xs font-black uppercase ${r.color}`}>{r.label}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{r.dropChance}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
