import React from 'react';
import { ArrowLeft, ScrollText } from 'lucide-react';

const PATCHES = [
    {
        version: 'v1.5.0',
        date: '2026-05-25',
        changes: [
            { type: 'new', text: 'Push-Benachrichtigungen für Ei-Schlüpfen, vollen Speicher und tägliche Quests' },
            { type: 'new', text: 'Sicherheit: Marktplatz-Transaktionen werden jetzt serverseitig validiert' },
            { type: 'fixed', text: 'Turm-Fortschritt wird jetzt korrekt in Firestore gespeichert' },
            { type: 'fixed', text: 'Firebase Offline-Fallback hinzugefügt' },
        ]
    },
    {
        version: 'v1.4.0',
        date: '2026-05-24',
        changes: [
            { type: 'new', text: 'Season 1 Inhalte: 10 neue Pets (TECH, VOID, DIVINE, CHAOS, TIME Typen)' },
            { type: 'new', text: '20 neue tägliche Quest-Vorlagen' },
            { type: 'new', text: 'Turm-Etagen 31-40 mit CHAOS-Zwischen-Boss und DIVINE-Champion' },
            { type: 'new', text: 'Google Analytics 4 zur Analyse des Spielerverhaltens' },
            { type: 'new', text: 'Android PWA – aus Chrome-Browser installierbar' },
            { type: 'new', text: 'Belohnte Video-Anzeigen + Banner-Ads (AdSense-bereit)' },
            { type: 'new', text: 'Spieler-Feedback-Meldesystem' },
        ]
    },
    {
        version: 'v1.3.0',
        date: '2026-05-24',
        changes: [
            { type: 'new', text: 'Patches-Bereich hinzugefügt' },
            { type: 'new', text: 'Feedback-Funktion: Spieler können Bugs und Vorschläge melden' },
            { type: 'new', text: 'Offline-Ertrag: Dorf produziert während du weg bist' },
            { type: 'new', text: 'Fusion-Rezepte und geheime Hybrid-Arten im Zuchtlabor' },
            { type: 'changed', text: 'Seltenheits-Filter und Sortierung nach Level in der Sammlung' },
        ]
    },
    {
        version: 'v1.2.0',
        date: '2026-05-22',
        changes: [
            { type: 'new', text: 'Arena-Turm: Steige Etage für Etage auf' },
            { type: 'new', text: 'Auto-Kampf: Lass dein Team automatisch kämpfen' },
            { type: 'new', text: 'Gauntlet-Modus: 5 Kämpfe hintereinander' },
            { type: 'changed', text: 'Verbessertes Battle-UI mit Rundenanzeige und Kampflog' },
            { type: 'changed', text: 'CI/CD: Lint- und Test-Gates für automatisches Deployment' },
        ]
    },
    {
        version: 'v1.1.0',
        date: '2026-05-20',
        changes: [
            { type: 'new', text: 'Dorf-System: Ressourcenproduktion und Gebäude-Upgrades' },
            { type: 'new', text: 'Zucht-System: Kombiniere Pets für neue Arten' },
            { type: 'new', text: 'Tages-Login mit wöchentlichen Belohnungen' },
            { type: 'new', text: 'Marktplatz: Kaufe und verkaufe Pets mit anderen Spielern' },
            { type: 'changed', text: 'Überarbeitetes Design: Modernes dunkles Theme' },
        ]
    },
    {
        version: 'v1.0.0',
        date: '2026-05-19',
        changes: [
            { type: 'new', text: 'Erstes Release: Pattle ist live!' },
            { type: 'new', text: '25 Elementtypen mit einzigartigen Pets pro Typ' },
            { type: 'new', text: 'Kampfsystem: Rundenbasierte Kämpfe mit Team-Mechanik' },
            { type: 'new', text: 'Lootboxen: Sammle Pets durch tägliche Belohnungen' },
            { type: 'new', text: 'Rangliste: Miss dich mit anderen Spielern weltweit' },
        ]
    }
];

const BADGE = {
    new: { label: 'NEU', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    changed: { label: 'GEÄNDERT', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    fixed: { label: 'BEHOBEN', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    removed: { label: 'ENTFERNT', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
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
