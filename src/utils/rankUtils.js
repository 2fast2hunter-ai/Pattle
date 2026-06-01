export const RANK_TIERS = [
    { key: 'stone',    name: 'Stone',    min: 0,    emoji: '🪨', badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600/30',    glow: '' },
    { key: 'bronze',   name: 'Bronze',   min: 850,  emoji: '🥉', badgeClass: 'bg-amber-900/40 text-amber-400 border-amber-700/40',    glow: 'shadow-amber-900/20' },
    { key: 'silver',   name: 'Silver',   min: 1100, emoji: '🥈', badgeClass: 'bg-slate-600/40 text-slate-200 border-slate-400/40',    glow: '' },
    { key: 'gold',     name: 'Gold',     min: 1400, emoji: '🥇', badgeClass: 'bg-yellow-900/40 text-yellow-300 border-yellow-600/40', glow: 'shadow-yellow-900/20' },
    { key: 'platinum', name: 'Platinum', min: 1700, emoji: '💎', badgeClass: 'bg-cyan-900/40 text-cyan-300 border-cyan-600/40',       glow: 'shadow-cyan-900/20' },
    { key: 'diamond',  name: 'Diamond',  min: 2000, emoji: '💠', badgeClass: 'bg-blue-900/40 text-blue-300 border-blue-500/40',       glow: 'shadow-blue-900/20' },
    { key: 'master',   name: 'Master',   min: 2300, emoji: '👑', badgeClass: 'bg-purple-900/40 text-purple-300 border-purple-500/40', glow: 'shadow-purple-900/20' },
];

export const getRankTier = (elo) => {
    const rating = elo || 1000;
    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
        if (rating >= RANK_TIERS[i].min) return RANK_TIERS[i];
    }
    return RANK_TIERS[0];
};

export const getNextRankTier = (elo) => {
    const current = getRankTier(elo);
    const idx = RANK_TIERS.findIndex(t => t.key === current.key);
    return idx < RANK_TIERS.length - 1 ? RANK_TIERS[idx + 1] : null;
};
