import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Coins, Gem } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';

const RARITY_ORDER = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'ANCIENT', 'COSMIC', 'TRANSCENDENT'];

export default function AchievementsScreen({ user, onBack, t, lang = 'de' }) {
    const [selectedTab, setSelectedTab] = useState('all');
    const achievements = user?.achievements || {};
    const achievementList = Object.values(ACHIEVEMENTS);
    const unlockedCount = Object.keys(achievements).length;
    const total = achievementList.length;

    const tabs = [
        { id: 'all', label: t ? t('achievement_tab_all') : 'All' },
        { id: 'unlocked', label: t ? t('achievement_tab_unlocked') : 'Unlocked' },
        { id: 'locked', label: t ? t('achievement_tab_locked') : 'Locked' },
    ];

    const filtered = achievementList.filter(a => {
        const isUnlocked = !!achievements[a.id];
        if (selectedTab === 'unlocked') return isUnlocked;
        if (selectedTab === 'locked') return !isUnlocked;
        return true;
    });

    return (
        <div className="h-full flex flex-col animate-in fade-in">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-3 pt-2 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                    {t ? t('achievement_title') : 'ACHIEVEMENTS'}
                </h1>
                <button
                    onClick={onBack}
                    className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="px-4 mb-3">
                <div className="bg-slate-900/60 rounded-2xl p-3 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {t ? t('achievement_progress') : 'Progress'}
                        </span>
                        <span className="text-xs font-black text-amber-400">{unlockedCount} / {total}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-500 rounded-full"
                            style={{ width: `${(unlockedCount / total) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 mb-3">
                <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/10">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                selectedTab === tab.id
                                    ? 'bg-slate-800 text-white shadow-md border border-white/10'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Achievement List */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-3">
                {filtered.map(a => {
                    const isUnlocked = !!achievements[a.id];
                    const unlockedAt = achievements[a.id];

                    return (
                        <AchievementCard
                            key={a.id}
                            achievement={a}
                            isUnlocked={isUnlocked}
                            unlockedAt={unlockedAt}
                            t={t}
                            lang={lang}
                        />
                    );
                })}
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                        <span className="text-4xl mb-3">🎖️</span>
                        <p className="text-xs font-bold uppercase tracking-widest">
                            {t ? t('achievement_empty') : 'No achievements here'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function AchievementCard({ achievement, isUnlocked, unlockedAt, t, lang = 'de' }) {
    const name = lang === 'de' ? (achievement.titleDe || achievement.title) : achievement.title;
    const desc = lang === 'de' ? (achievement.descDe || achievement.desc) : achievement.desc;

    return (
        <div className={`relative rounded-2xl border p-4 flex items-start gap-4 transition-all ${
            isUnlocked
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-slate-900/40 border-white/5 opacity-60'
        }`}>
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                isUnlocked
                    ? 'bg-amber-500/20 border-amber-500/40'
                    : 'bg-slate-800/60 border-white/10'
            }`}>
                {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-slate-600" />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-black text-sm ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {name}
                    </h3>
                    {isUnlocked && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                </div>
                {desc ? (
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{desc}</p>
                ) : null}

                {/* Reward */}
                <div className="flex items-center gap-3">
                    {achievement.reward.coins > 0 && (
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Coins className="w-3 h-3" />
                            <span className="text-[10px] font-bold">+{achievement.reward.coins}</span>
                        </div>
                    )}
                    {achievement.reward.gems > 0 && (
                        <div className="flex items-center gap-1 text-pink-400">
                            <Gem className="w-3 h-3" />
                            <span className="text-[10px] font-bold">+{achievement.reward.gems}</span>
                        </div>
                    )}
                    {isUnlocked && unlockedAt && (
                        <span className="ml-auto text-[9px] text-slate-600 font-bold">
                            {(unlockedAt?.toDate ? unlockedAt.toDate() : new Date(unlockedAt)).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
