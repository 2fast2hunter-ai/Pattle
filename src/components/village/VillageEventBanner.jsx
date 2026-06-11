import React, { useState, useEffect } from 'react';
import { Tv, ShoppingBag } from 'lucide-react';
import { VILLAGE_EVENT_TYPES } from '../../data/villageEvents';
import { showRewardedAd } from '../../utils/adManager';
import AdModal from '../ui/AdModal';

function formatTimeLeft(ms) {
    if (ms <= 0) return '0:00';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
}

export default function VillageEventBanner({ user, onDismissStorm, onOpenMerchant, t, lang }) {
    const [now, setNow] = useState(Date.now());
    const [devAdEventId, setDevAdEventId] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const activeEvents = (user?.village?.activeEvents || []).filter(e => !e.dismissed && e.expiresAt > now);
    if (activeEvents.length === 0) return null;

    if (devAdEventId) {
        return (
            <AdModal
                onClose={() => setDevAdEventId(null)}
                onReward={() => { onDismissStorm(devAdEventId); setDevAdEventId(null); }}
            />
        );
    }

    return (
        <div className="space-y-2">
            {activeEvents.map(event => {
                const def = VILLAGE_EVENT_TYPES[event.type];
                if (!def) return null;
                const timeLeft = event.expiresAt - now;
                const label = lang === 'en' ? def.labelEn : def.label;

                return (
                    <div
                        key={event.id}
                        className={`rounded-2xl p-3 border flex items-center justify-between gap-3 ${def.colorBg} ${def.colorBorder}`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-lg ${def.colorIcon}`}>
                                {def.icon}
                            </div>
                            <div className="min-w-0">
                                <div className={`text-xs font-black uppercase tracking-wider ${def.colorText}`}>{label}</div>
                                <div className="text-[10px] text-slate-400 font-bold">{formatTimeLeft(timeLeft)}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {def.canDismissWithAd && onDismissStorm && (
                                <button
                                    onClick={() => {
                                        showRewardedAd({
                                            onReward: () => onDismissStorm(event.id, null),
                                            onError: () => {},
                                            onOpenDevModal: () => setDevAdEventId(event.id),
                                        });
                                    }}
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-[10px] font-bold text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
                                >
                                    <Tv className="w-3 h-3" />
                                    <span>{lang === 'en' ? 'Dismiss' : 'Abwenden'}</span>
                                </button>
                            )}
                            {event.type === 'MERCHANT' && onOpenMerchant && (
                                <button
                                    onClick={onOpenMerchant}
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-yellow-700/60 border border-yellow-500/40 text-[10px] font-bold text-yellow-200 hover:bg-yellow-600/60 active:scale-95 transition-all"
                                >
                                    <ShoppingBag className="w-3 h-3" />
                                    <span>{lang === 'en' ? 'Shop' : 'Kaufen'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
