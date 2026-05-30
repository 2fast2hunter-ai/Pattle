import React from 'react';
import { PlayCircle, Calendar, Gift, Gem, Coins, ArrowUp, Star, Clock } from 'lucide-react';
import { AD_REWARDS, TIMED_REWARDS } from '../../data/gameData';

export default function ShopFreeSection({
    t,
    setShowDailyLogin,
    timedRewardTimers,
    onClaimTimedReward,
    playSound,
    adTimers,
    handleAdClick,
    formatTime
}) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3 text-indigo-300 px-1">
                <PlayCircle className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">{t ? t('shop_free_section') : 'Gratis & Boosts'}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

                {/* DAILY LOGIN BUTTON */}
                <button
                    onClick={() => setShowDailyLogin(true)}
                    className="col-span-2 sm:col-span-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-3 flex items-center justify-between relative overflow-hidden group transition-all shadow-lg hover:scale-[1.02] active:scale-95 border border-white/10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-sm">{t ? t('shop_daily_bonus') : 'Daily Bonus'}</div>
                            <div className="text-[10px] text-indigo-100">{t ? t('shop_daily_bonus_desc') : 'Jeden Tag Belohnungen!'}</div>
                        </div>
                    </div>
                </button>

                {/* NEU: TIME BASED REWARDS (GRATIS TICKET) */}
                {TIMED_REWARDS.map(reward => {
                    const cooldown = timedRewardTimers[reward.id];
                    const isReady = !cooldown || cooldown <= 0;

                    return (
                        <button
                            key={reward.id}
                            onClick={() => { if (isReady) { onClaimTimedReward(reward.id); playSound('success'); } }}
                            disabled={!isReady}
                            className={`
                                col-span-2 sm:col-span-1 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between relative overflow-hidden group transition-all shadow-lg
                                ${isReady ? 'hover:border-indigo-400 cursor-pointer active:scale-95' : 'opacity-75 cursor-not-allowed'}
                            `}
                        >
                            {isReady && <div className="absolute inset-0 bg-shimmer opacity-20 pointer-events-none"></div>}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 shadow-inner">
                                    <Gift className={`w-6 h-6 ${isReady ? 'text-indigo-300 animate-bounce' : 'text-slate-500'}`} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-white text-sm">{reward.label}</div>
                                    <div className="text-[10px] text-indigo-200">{reward.description}</div>
                                </div>
                            </div>

                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${isReady ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>
                                {isReady ? (t ? t('shop_claim') : 'CLAIM') : formatTime(cooldown)}
                            </div>
                        </button>
                    );
                })}

                {/* AD REWARDS */}
                {AD_REWARDS.map((reward) => {
                    const cooldown = adTimers[reward.id];
                    const isReady = !cooldown || cooldown <= 0;
                    return (
                        <button key={reward.id} onClick={() => handleAdClick(reward)} disabled={!isReady} className={`bg-slate-800 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden group transition-all ${isReady ? 'hover:bg-slate-750 hover:border-white/10 active:scale-95 cursor-pointer' : 'opacity-75 cursor-not-allowed'}`}>
                            {isReady && <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                            <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center mb-2 shadow-inner border border-white/5 relative z-10">
                                {reward.type === 'GEMS' && <Gem className="w-5 h-5 text-pink-400 drop-shadow-md" />}
                                {reward.type === 'COINS' && <Coins className="w-5 h-5 text-yellow-400 drop-shadow-md" />}
                                {reward.type === 'BUFF' && reward.buffType === 'COIN_BOOST' && <div className="relative"><Coins className="w-5 h-5 text-yellow-400" /><ArrowUp className="w-3 h-3 text-green-400 absolute -top-1 -right-1 bg-black/50 rounded-full" /></div>}
                                {reward.type === 'BUFF' && reward.buffType === 'XP_BOOST' && <div className="relative"><Star className="w-5 h-5 text-green-400" /><ArrowUp className="w-3 h-3 text-white absolute -top-1 -right-1 bg-black/50 rounded-full" /></div>}
                            </div>
                            <div className="relative z-10"><div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 leading-tight">{reward.label}</div></div>
                            <div className={`mt-2 w-full py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1 relative z-10 ${isReady ? 'bg-white text-indigo-900' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>{isReady ? (<><PlayCircle className="w-3 h-3" /> {t ? t('shop_video') : 'Video'}</>) : (<><Clock className="w-3 h-3" /> {formatTime(cooldown)}</>)}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
