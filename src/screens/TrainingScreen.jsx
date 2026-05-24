// src/screens/TrainingScreen.jsx

import React from 'react';
import { ArrowLeft, Swords, Plus, X, Info, Zap } from 'lucide-react';
import { calculateMaxXp } from '../utils/gameMechanics';
import { playSound } from '../utils/soundManager';

export function TrainingScreen({ user, pets, onBack, onToggleTrainingPet, productionRates, onCollect, t }) {
    const workers = user?.village?.workers?.training || [null, null, null, null, null];
    const villageLevel = user?.village?.level || 1;
    const maxSlots = 5;

    // --- AUTOMATISCHER ZYKLUS & XP UPDATE ---
    const [progress, setProgress] = React.useState(0);
    const [_isCollecting, setIsCollecting] = React.useState(false);
    const buildingLevel = user?.village?.buildings?.training || 1;

    // Rate berechnen (Items pro Sekunde)
    const rate = productionRates ? productionRates('training', buildingLevel, workers) : 0;
    const isIdleActive = (user?.village?.idleTimeExpiresAt || 0) > Date.now();

    // 1. Sync mit DB-Status (wenn gesammelt wurde, Buffer resetten)
    React.useEffect(() => {
        const currentBuffer = user?.village?.resources?.training || 0;
        setProgress(currentBuffer);
        // DB Update erhalten (Zeitstempel oder Ressource geändert) -> Request abgeschlossen -> Lock entfernen
        setIsCollecting(false);
    }, [user?.village?.resources?.training, user?.village?.lastCollectionTime]);

    // 2. Lokaler Timer für flüssige Bar (Synchronisiert mit 10s Zyklus)
    React.useEffect(() => {
        if (!isIdleActive || rate <= 0) {
            setProgress(0);
            return;
        }

        const updateProgress = () => {
            const now = Date.now();
            const cycleDuration = 10000; // 10s fix
            const cyclePos = (now % cycleDuration) / cycleDuration;
            setProgress(cyclePos);
        };

        const interval = setInterval(updateProgress, 100);
        updateProgress(); // Sofort update

        return () => clearInterval(interval);
    }, [isIdleActive, rate]);

    // 3. Überwachen des Fortschritts für Auto-Collect
    // Wir nutzen hier einen Tick-Check, da Progress jetzt springt (0.9 -> 0.0)
    React.useEffect(() => {
        if (!isIdleActive || rate <= 0) return;

        const checkCollect = setInterval(() => {
            const now = Date.now();
            const cycleDuration = 10000;
            const cyclePos = (now % cycleDuration) / cycleDuration;

            // Wenn Zyklus kurz vor Ende (z.B. > 9.8s) und noch nicht collected
            if (cyclePos > 0.95 && !isCollectingRef.current) {
                isCollectingRef.current = true;
                onCollect(true, 'training');
                playSound('pop');
            }
            // Reset Lock nach Zyklus-Neustart
            if (cyclePos < 0.1 && isCollectingRef.current) {
                isCollectingRef.current = false;
            }
        }, 500);

        return () => clearInterval(checkCollect);
    }, [isIdleActive, rate, onCollect]);

    // Ref für Collect Lock
    const isCollectingRef = React.useRef(false);



    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">

            {/* HEADER */}
            <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-black italic tracking-wide text-white flex items-center gap-2 justify-center">
                        <Swords className="w-5 h-5 text-orange-500" />
                        {t ? t('training_title') : 'ÜBUNGSPLATZ'}
                    </h2>
                </div>
            </div>

            {/* INFO BANNER */}
            <div className="p-4 pb-0">
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 flex gap-3 items-start">
                    <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
                        <Info className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-orange-200 font-bold text-sm mb-1">{t ? t('training_info_title') : 'Intensiv-Training'}</h3>
                        <p className="text-xs text-orange-200/70 leading-relaxed">
                            {t ? t('training_info_desc') : 'Jedes Pet erhält 10 Erfahrungspunkte pro Zyklus, unabhängig von der Seltenheit.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* CYCLE PROGRESS BAR */}
            <div className="px-4 pt-4">
                <div className="bg-slate-900 rounded-xl p-3 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            {isIdleActive ? <Zap className="w-3 h-3 text-green-400 animate-pulse" /> : <Zap className="w-3 h-3 text-red-500" />}
                            {isIdleActive ? (t ? t('training_active') : 'Training läuft...') : (t ? t('training_paused') : 'Training pausiert')}
                        </span>
                        <span className="text-xs font-black text-white">
                            {rate > 0 ? `${(rate * 3600).toFixed(0)} ${t ? t('training_cycles') : 'Zyklen/h'}` : `0 ${t ? t('training_cycles') : 'Zyklen/h'}`}
                        </span>
                    </div>
                    <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                        <div className="absolute inset-0 bg-orange-500/10"></div>
                        {/* Progress Bar Animation */}
                        <div className="h-full bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-100 ease-linear" style={{ width: `${Math.min(100, progress * 100)}%` }}></div>
                    </div>
                </div>
            </div>

            {/* SLOTS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {Array.from({ length: maxSlots }).map((_, index) => {
                    const petId = workers[index];
                    const pet = petId && pets ? pets.find(p => p.id === petId) : null;
                    const maxXp = pet ? (pet.maxXp || calculateMaxXp(pet.level)) : 100;
                    const xpPercent = pet ? Math.min(100, (pet.xp / maxXp) * 100) : 0;

                    // Slots werden basierend auf dem Dorf-Level freigeschaltet (wie in useVillageActions definiert)
                    const isLocked = index >= villageLevel;

                    return (
                        <button
                            key={index}
                            disabled={isLocked}
                            onClick={() => onToggleTrainingPet && onToggleTrainingPet(index)}
                            className={`
                                w-full relative h-20 rounded-2xl border flex items-center px-4 gap-4 transition-all text-left group
                                ${isLocked
                                    ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed'
                                    : petId
                                        ? 'bg-slate-800 border-orange-500/30 hover:border-orange-500/50'
                                        : 'bg-slate-800 border-white/5 hover:bg-slate-750 hover:border-white/20 active:scale-[0.98]'
                                }
                            `}
                        >
                            {/* Slot Number */}
                            <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors
                                ${isLocked
                                    ? 'bg-slate-900 text-slate-700'
                                    : petId
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                        : 'bg-slate-900 text-slate-500 group-hover:bg-slate-700 group-hover:text-white'
                                }
                            `}>
                                {index + 1}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                {isLocked ? (
                                    <div className="flex flex-col">
                                        <span className="text-slate-600 font-bold text-sm uppercase">{t ? t('training_locked') : 'Gesperrt'}</span>
                                        <span className="text-[10px] text-slate-700 font-bold">{t ? t('training_needs_village_lvl') : 'Benötigt Dorf Level'} {index + 1}</span>
                                    </div>
                                ) : pet ? (
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center pr-2">
                                            <span className="text-white font-bold text-sm truncate">{pet.name}</span>
                                            <span className="text-xs font-black text-orange-400">{t ? t('village_lvl') : 'Lvl'} {pet.level}</span>
                                        </div>

                                        {/* XP Bar */}
                                        <div className="mt-1.5 w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5 relative">
                                            <div className="absolute inset-0 bg-orange-500/20"></div>
                                            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
                                        </div>

                                        <div className="text-[9px] text-slate-400 font-bold mt-0.5 text-right">{Math.floor(pet.xp)} / {maxXp} {t ? t('common_xp') : 'XP'}</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-bold text-sm group-hover:text-white transition-colors">{t ? t('training_available') : 'Verfügbar'}</span>
                                        <span className="text-[10px] text-slate-600 font-bold group-hover:text-slate-500">{t ? t('training_assign') : 'Tippen zum Zuweisen'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Icon */}
                            {!isLocked && (
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center border transition-all
                                    ${petId
                                        ? 'bg-red-500/10 border-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500'
                                        : 'bg-white/5 border-white/10 text-slate-400 group-hover:bg-white group-hover:text-slate-900'
                                    }
                                `}>
                                    {petId ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
