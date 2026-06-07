import React from 'react';
import { X, Lock } from 'lucide-react';
import { RARITIES, BASE_ANIMALS, MYTHIC_SPECIES, ZODIAC_ANIMALS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

const RARITY_ORDER = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'ANCIENT', 'COSMIC', 'TRANSCENDENT'];

// Collect all non-mythic species per rarity bucket by sampling their typical rarity from the data.
// For the Dex we group by the species' "natural" rarity tier: last species in each type-list
// (the rare one) maps to LEGENDARY, mythic ones to MYTHIC, the rest are bucketed COMMON→EPIC.
// We keep it simple: show MYTHIC section with the 3 mythic species, and an ALL section below.

function buildDexSections(myPets) {
    const owned = new Set(myPets.filter(p => !p.isEgg).map(p => p.species));

    // Mythic section: the 3 apex species
    const mythicEntries = MYTHIC_SPECIES.map(id => ({
        id,
        data: BASE_ANIMALS[id] || ZODIAC_ANIMALS[id],
        owned: owned.has(id),
    }));

    return { mythicEntries, owned };
}

function DexCard({ entry, t }) {
    const { data, owned } = entry;
    if (!data) return null;

    const mockPet = { species: entry.id, type: data.type, rarity: 'MYTHIC', isEgg: false, name: data.label };

    return (
        <div className={`relative rounded-2xl p-3 border transition-all duration-300 ${
            owned
                ? 'bg-yellow-900/30 border-yellow-500/50 shadow-lg shadow-yellow-900/20'
                : 'bg-slate-900/60 border-white/5 opacity-50'
        }`}>
            <div className="flex flex-col items-center gap-2 relative z-10">
                {owned ? (
                    <PetAvatar pet={mockPet} className="w-14 h-14 drop-shadow-md" />
                ) : (
                    <div className="w-14 h-14 flex items-center justify-center bg-slate-800 rounded-xl border border-white/10">
                        <Lock className="w-6 h-6 text-slate-600" />
                    </div>
                )}
                <div className="text-center">
                    <div className="text-xs font-black text-white truncate w-full">
                        {owned ? data.label : '???'}
                    </div>
                    <div className="text-[9px] font-bold text-yellow-300 uppercase tracking-wider mt-0.5">
                        {data.type}
                    </div>
                </div>
                {owned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px]">
                        ✓
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DexScreen({ myPets = [], onBack, t }) {
    const { mythicEntries } = buildDexSections(myPets);
    const mythicOwned = mythicEntries.filter(e => e.owned).length;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 bg-slate-950">

            {/* Header */}
            <div className="relative flex items-center justify-center mb-4 pt-2 px-4 shrink-0">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 drop-shadow-sm">
                    DEX
                </h1>
                <button
                    onClick={onBack}
                    className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95 border border-red-500/30"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-6">

                {/* MYTHIC SECTION — highlighted apex tier */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-px bg-yellow-500/30" />
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-600/20 border border-yellow-500/40">
                            <span className="text-xs font-black text-yellow-300 uppercase tracking-widest">✦ Mythic</span>
                            <span className="text-[9px] font-bold text-yellow-500">{mythicOwned}/{mythicEntries.length}</span>
                        </div>
                        <div className="flex-1 h-px bg-yellow-500/30" />
                    </div>

                    <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-3 mb-2">
                        <p className="text-[10px] text-yellow-400/70 text-center font-bold uppercase tracking-wider mb-3">
                            Apex-tier creatures — ultra-rare hatch only
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {mythicEntries.map(entry => (
                                <DexCard key={entry.id} entry={entry} t={t} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rarity probability reference */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Hatch Rates</span>
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
