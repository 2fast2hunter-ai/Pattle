import React from 'react';
import { ArrowLeft, ScrollText } from 'lucide-react';

const PATCHES = [
    {
        version: 'v1.10.0',
        date: '2026-06-01',
        changes: [
            { type: 'new', text: 'Arena rank tiers: Stone → Bronze → Silver → Gold → Platinum → Diamond → Master based on Elo rating' },
            { type: 'new', text: 'Rank badge shown next to Elo in Arena Hub and on every Leaderboard entry' },
            { type: 'fixed', text: 'LeaderboardScreen/ArenaHub: remaining German strings (RANGLISTE, Bald..., Top Spieler, Endlos Survival) now in English' },
        ]
    },
    {
        version: 'v1.9.0',
        date: '2026-06-01',
        changes: [
            { type: 'new', text: 'Battle speed toggle: tap ⚡ button during combat to switch between 1x and 2x speed (preference saved)' },
            { type: 'fixed', text: 'BattleScreen: remaining German strings (Wiederbelebung, Werbung schauen, Fertig) now in English' },
        ]
    },
    {
        version: 'v1.8.0',
        date: '2026-05-31',
        changes: [
            { type: 'fixed', text: 'Battle log: "nutzt"→"uses", "greift an"→"attacks", "KRIT!"→"CRIT!" in EN fallbacks' },
            { type: 'fixed', text: 'TowerScreen/ArenaHub: "Stufe"→"Stage", "Monatlicher Reset"→"Monthly Reset"' },
            { type: 'fixed', text: 'Team screen: "Verwaltung"→"Management", "Belegt"→"Used", "Leerer Slot"→"Empty Slot"' },
            { type: 'fixed', text: 'Currency: all remaining "Gold" labels replaced with "Coins"' },
            { type: 'fixed', text: 'GauntletSummary: "GAUNTLET BEENDET"→"GAUNTLET OVER", "Belohnungen"→"Rewards"' },
            { type: 'fixed', text: 'EggSlot, IdleReturnModal, PetHub, ItemInventory: remaining German fallbacks translated' },
            { type: 'fixed', text: 'db.js: all German console.error messages translated to English' },
            { type: 'fixed', text: 'battleLogic: PvE enemy prefix "Wildes"→"Wild"' },
        ]
    },
    {
        version: 'v1.7.0',
        date: '2026-05-31',
        changes: [
            { type: 'fixed', text: 'Full German→English translation pass: all UI labels, data files, quest names, rarity names, type names, village buildings, and shop items are now in English' },
            { type: 'fixed', text: 'Leaderboard: player name fallback and daily diff label now in English' },
            { type: 'fixed', text: 'Inventory: rarity filter "All" button was showing German' },
            { type: 'fixed', text: 'Achievement notification now shows "Coins" instead of "Gold"' },
        ]
    },
    {
        version: 'v1.6.0',
        date: '2026-05-28',
        changes: [
            { type: 'new', text: 'Achievements: 20 unlockable badges with gold and gem rewards' },
            { type: 'new', text: 'Daily login streak: Log in 7 days in a row for bonus rewards' },
            { type: 'new', text: 'Achievements overview in main menu with progress tracking' },
            { type: 'fixed', text: 'Pet image for NATURE_BEAR species failed to load (filename typo)' },
            { type: 'fixed', text: 'Feedback form: Added Firestore permission rule for feedback collection' },
            { type: 'fixed', text: 'Achievement cards always showed German regardless of language setting' },
            { type: 'fixed', text: 'Achievement unlock time showed Invalid Date instead of correct date' },
        ]
    },
    {
        version: 'v1.5.0',
        date: '2026-05-25',
        changes: [
            { type: 'new', text: 'Push notifications for egg hatching, full storage and daily quests' },
            { type: 'new', text: 'Security: Marketplace transactions are now validated server-side' },
            { type: 'fixed', text: 'Tower progress is now correctly saved to Firestore' },
            { type: 'fixed', text: 'Added Firebase offline fallback' },
        ]
    },
    {
        version: 'v1.4.0',
        date: '2026-05-24',
        changes: [
            { type: 'new', text: 'Season 1 content: 10 new pets (TECH, VOID, DIVINE, CHAOS, TIME types)' },
            { type: 'new', text: '20 new daily quest templates' },
            { type: 'new', text: 'Tower floors 31-40 with CHAOS mini-boss and DIVINE champion' },
            { type: 'new', text: 'Google Analytics 4 for player behavior analysis' },
            { type: 'new', text: 'Android PWA – installable from Chrome browser' },
            { type: 'new', text: 'Rewarded video ads + banner ads (AdSense-ready)' },
            { type: 'new', text: 'Player feedback reporting system' },
        ]
    },
    {
        version: 'v1.3.0',
        date: '2026-05-24',
        changes: [
            { type: 'new', text: 'Patch notes screen added' },
            { type: 'new', text: 'Feedback feature: Players can report bugs and suggestions' },
            { type: 'new', text: 'Idle earnings: Village produces resources while you are away' },
            { type: 'new', text: 'Fusion recipes and secret hybrid species in the breeding lab' },
            { type: 'changed', text: 'Rarity filter and sort by level in the collection' },
        ]
    },
    {
        version: 'v1.2.0',
        date: '2026-05-22',
        changes: [
            { type: 'new', text: 'Arena Tower: Climb floor by floor' },
            { type: 'new', text: 'Auto-battle: Let your team fight automatically' },
            { type: 'new', text: 'Gauntlet mode: 5 battles in a row' },
            { type: 'changed', text: 'Improved battle UI with round display and combat log' },
            { type: 'changed', text: 'CI/CD: Lint and test gates for automatic deployment' },
        ]
    },
    {
        version: 'v1.1.0',
        date: '2026-05-20',
        changes: [
            { type: 'new', text: 'Village system: Resource production and building upgrades' },
            { type: 'new', text: 'Breeding system: Combine pets to discover new species' },
            { type: 'new', text: 'Daily login with weekly rewards' },
            { type: 'new', text: 'Marketplace: Buy and sell pets with other players' },
            { type: 'changed', text: 'Redesigned UI: Modern dark theme' },
        ]
    },
    {
        version: 'v1.0.0',
        date: '2026-05-19',
        changes: [
            { type: 'new', text: 'First release: Pattle is live!' },
            { type: 'new', text: '25 element types with unique pets per type' },
            { type: 'new', text: 'Battle system: Turn-based fights with team mechanics' },
            { type: 'new', text: 'Lootboxes: Collect pets through daily rewards' },
            { type: 'new', text: 'Leaderboard: Compete against players worldwide' },
        ]
    }
];

const BADGE = {
    new: { label: 'NEW', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    changed: { label: 'CHANGED', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    fixed: { label: 'FIXED', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    removed: { label: 'REMOVED', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

export default function PatchesScreen({ onBack, t }) {
    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
            <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-black italic tracking-wide text-white">
                        {t ? t('patches_title') : 'PATCH NOTES'}
                    </h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {PATCHES.map((patch) => (
                    <div key={patch.version} className="rounded-2xl bg-slate-900 border border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-indigo-600/10 border-b border-white/5">
                            <span className="font-black text-white text-sm">{patch.version}</span>
                            <span className="text-xs text-slate-400">{patch.date}</span>
                        </div>
                        <ul className="p-4 space-y-3">
                            {patch.changes.map((change, i) => {
                                const badge = BADGE[change.type] || BADGE.changed;
                                return (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                        <span className={`shrink-0 mt-0.5 text-[10px] font-black px-1.5 py-0.5 rounded ${badge.className}`}>
                                            {badge.label}
                                        </span>
                                        <span>{change.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
