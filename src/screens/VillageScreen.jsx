import React from 'react';
import { Loader2 } from 'lucide-react';
import { TrainingScreen } from './TrainingScreen';
import VillageHeader from '../components/village/VillageHeader';
import IdleTimerBanner from '../components/village/IdleTimerBanner';
import VillageMap from '../components/village/VillageMap';
import VillageActionButtons from '../components/village/VillageActionButtons';
import ResourceStorageBars from '../components/village/ResourceStorageBars';
export default function VillageScreen({ user, pets, t, onBack, onCollect, onSelectResource, productionRates, onOpenMilestones, onOpenTrading, onAddIdleTime, onAddIdleTimeByAd, onOpenCosmetics, onOpenTraining, onToggleTrainingPet }) {

    const [timeLeftStr, setTimeLeftStr] = React.useState("00:00:00");
    const [isActive, setIsActive] = React.useState(false);
    const [showTraining, setShowTraining] = React.useState(false);
    const [cycleProgress, setCycleProgress] = React.useState(0);

    React.useEffect(() => {
        if (!user?.village) return;

        const updateTimer = () => {
            const now = Date.now();
            const expires = user.village.idleTimeExpiresAt || 0;
            const diff = expires - now;

            if (diff > 0) {
                setIsActive(true);
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeftStr(`${h}h ${m}m ${s}s`);
                const cycleDuration = 10000;
                setCycleProgress(((now % cycleDuration) / cycleDuration) * 100);
            } else {
                setIsActive(false);
                setTimeLeftStr(t ? t('village_inactive') : "Inaktiv");
                setCycleProgress(0);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 100);
        return () => clearInterval(interval);
    }, [user?.village?.idleTimeExpiresAt, t]);

    if (!user || !user.village) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-slate-900 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t ? t('village_init') : "Initializing Village..."}</p>
            </div>
        );
    }

    if (showTraining) {
        return (
            <TrainingScreen
                user={user}
                pets={pets}
                onBack={() => setShowTraining(false)}
                onToggleTrainingPet={onToggleTrainingPet}
                productionRates={productionRates}
                onCollect={onCollect}
                t={t}
            />
        );
    }

    const ticketCount = user.adTickets || 0;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">

            {/* HEADER with prominent level display */}
            <VillageHeader
                user={user}
                t={t}
                onBack={onBack}
                onCollect={onCollect}
                isActive={isActive}
            />

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-3">

                {/* IDLE TIME BANNER */}
                <IdleTimerBanner
                    isActive={isActive}
                    timeLeftStr={timeLeftStr}
                    onAddIdleTime={onAddIdleTime}
                    onAddIdleTimeByAd={onAddIdleTimeByAd}
                    ticketCount={ticketCount}
                    t={t}
                />

                {/* Cycle progress bar */}
                {isActive && (
                    <div className="w-full bg-slate-900/50 rounded-lg p-2 border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                                {t ? t('village_cycle') : 'Produktions-Zyklus'}
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all duration-100 ease-linear"
                                style={{ width: `${cycleProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* === INTERACTIVE VILLAGE MAP === */}
                <VillageMap
                    user={user}
                    productionRates={productionRates}
                    isActive={isActive}
                    onSelectResource={onSelectResource}
                    setShowTraining={setShowTraining}
                    t={t}
                />

                {/* STORAGE CAPACITY BARS */}
                <ResourceStorageBars user={user} t={t} />

                {/* ACTION BUTTONS */}
                <VillageActionButtons
                    onOpenMilestones={onOpenMilestones}
                    onOpenTrading={onOpenTrading}
                    onOpenCosmetics={onOpenCosmetics}
                    t={t}
                />

            </div>
        </div>
    );
}
