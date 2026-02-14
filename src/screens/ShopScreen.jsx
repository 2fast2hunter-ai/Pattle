import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { LOOTBOXES, AD_REWARDS, TIMED_REWARDS, TYPES } from '../data/gameData';
import AdModal from '../components/ui/AdModal';
import { PageBackground } from '../components/GameLayout';
import { showRewardedAd } from '../utils/adManager';
import DailyLoginModal from '../components/modals/DailyLoginModal';
import { claimDailyLoginReward } from '../utils/db';
import { playSound } from '../utils/soundManager';
import ShopLootboxModal from '../components/shop/ShopLootboxModal';
import ShopFreeSection from '../components/shop/ShopFreeSection';
import ShopLootboxSection from '../components/shop/ShopLootboxSection';

export default function ShopScreen({ onBack, onBuyBox, onBuyTickets, onWatchAd, user, onClaimTimedReward, showNotification, t }) {
    const [viewingBox, setViewingBox] = useState(null);
    const [showDevAdModal, setShowDevAdModal] = useState(false);
    const [buyAmount, setBuyAmount] = useState(1);
    const [pendingReward, setPendingReward] = useState(null);
    const [isBuying, setIsBuying] = useState(false);
    const [showDailyLogin, setShowDailyLogin] = useState(false);

    const AD_COOLDOWN_MS = 10 * 60 * 1000;
    const [adTimers, setAdTimers] = useState({});
    const [timedRewardTimers, setTimedRewardTimers] = useState({});
    const lastTimersRef = useRef({});

    useEffect(() => {
        const updateTimers = () => {
            const now = Date.now();

            // 1. AD Timers
            const newAdTimers = {};
            AD_REWARDS.forEach(reward => {
                const lastClaim = user?.adClaims?.[reward.id] || 0;
                const diff = now - lastClaim;
                if (diff < AD_COOLDOWN_MS) {
                    newAdTimers[reward.id] = AD_COOLDOWN_MS - diff;
                } else {
                    newAdTimers[reward.id] = 0;
                }
            });
            setAdTimers(newAdTimers);

            // 2. Timed Rewards Timers 
            const newTimedTimers = {};
            TIMED_REWARDS.forEach(reward => {
                const lastClaim = user?.timedClaims?.[reward.id] || 0;
                const diff = now - lastClaim;
                const cooldownDuration = 60 * 60 * 1000;
                let remaining = 0;
                if (diff < cooldownDuration) {
                    remaining = cooldownDuration - diff;
                }
                newTimedTimers[reward.id] = remaining;

                const prev = lastTimersRef.current[reward.id];
                if (prev > 0 && remaining <= 0) {
                    showNotification && showNotification(`${reward.label} ist wieder verfügbar!`, 'success');
                }
                lastTimersRef.current[reward.id] = remaining;
            });
            setTimedRewardTimers(newTimedTimers);
        };
        updateTimers();
        const interval = setInterval(updateTimers, 1000);
        return () => clearInterval(interval);
    }, [user?.adClaims, user?.timedClaims, showNotification]);

    useEffect(() => {
        if (viewingBox) setBuyAmount(1);
    }, [viewingBox]);

    const formatTime = (ms) => {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- TYPE SPECIFIC BOX LOGIC ---
    const typeKeys = Object.keys(TYPES);
    const dayIndex = new Date().getDay();
    const schedule = {
        1: { start: 0, count: 3 }, // Mo
        2: { start: 3, count: 3 }, // Di
        3: { start: 6, count: 3 }, // Mi
        4: { start: 9, count: 3 }, // Do
        5: { start: 12, count: 4 }, // Fr
        6: { start: 16, count: 4 }, // Sa
        0: { start: 20, count: 4 }  // So
    };
    const { start, count } = schedule[dayIndex];
    const dailyTypes = typeKeys.slice(start, start + count);
    const TYPE_BOX_COST = (LOOTBOXES.MASTER?.cost || 10000) + 5000;

    const handleBuy = (boxKey) => {
        if (isBuying) return;
        setIsBuying(true);
        const cost = boxKey === 'TYPE_DAILY' ? TYPE_BOX_COST : LOOTBOXES[boxKey].cost;
        const currency = boxKey === 'TYPE_DAILY' ? 'COINS' : LOOTBOXES[boxKey].currency;
        onBuyBox(boxKey, cost, currency, buyAmount);
        playSound('kaching');
        setViewingBox(null);
        setTimeout(() => setIsBuying(false), 500);
    };

    const isDailyAvailable = () => {
        const today = new Date().toDateString();
        return user?.lastDailyBoxClaim !== today;
    };

    const handleAdClick = (reward) => {
        if (adTimers[reward.id] > 0) return;
        setPendingReward(reward);
        showRewardedAd({
            onReward: () => { onWatchAd(reward); setPendingReward(null); },
            onError: () => { alert("Werbung Error"); setPendingReward(null); },
            onOpenDevModal: () => { setShowDevAdModal(true); }
        });
    };

    const handleClaimDaily = async () => {
        await claimDailyLoginReward(user);
        setShowDailyLogin(false);
        playSound('success');
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in relative overflow-hidden bg-slate-950">
            <PageBackground />

            <style>{`
                @keyframes gradient-xy {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 6s ease infinite;
                }
            `}</style>

            {showDailyLogin && (
                <DailyLoginModal
                    user={user}
                    onClaim={handleClaimDaily}
                    onClose={() => setShowDailyLogin(false)}
                />
            )}

            {showDevAdModal && (
                <AdModal
                    onClose={() => setShowDevAdModal(false)}
                    onReward={() => { if (pendingReward) { onWatchAd(pendingReward); setPendingReward(null); } }}
                />
            )}

            {/* Modal für Lootboxen */}
            {viewingBox && (
                <ShopLootboxModal
                    viewingBox={viewingBox}
                    onClose={() => setViewingBox(null)}
                    onBuy={handleBuy}
                    buyAmount={buyAmount}
                    setBuyAmount={setBuyAmount}
                    isBuying={isBuying}
                    isDailyAvailable={isDailyAvailable()}
                    t={t}
                    schedule={schedule}
                    dailyTypes={dailyTypes}
                    TYPE_BOX_COST={TYPE_BOX_COST}
                />
            )}

            {/* HEADER */}
            <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">{t ? t('shop_title') : 'ITEM SHOP'}</h1>
                <button onClick={onBack} className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">

                <ShopFreeSection
                    t={t}
                    setShowDailyLogin={setShowDailyLogin}
                    timedRewardTimers={timedRewardTimers}
                    onClaimTimedReward={onClaimTimedReward}
                    playSound={playSound}
                    adTimers={adTimers}
                    handleAdClick={handleAdClick}
                    formatTime={formatTime}
                />

                <ShopLootboxSection
                    t={t}
                    setViewingBox={setViewingBox}
                    isDailyAvailable={isDailyAvailable}
                    dailyTypes={dailyTypes}
                    TYPE_BOX_COST={TYPE_BOX_COST}
                />

            </div>
        </div>
    );
}