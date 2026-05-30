import React from 'react';
import { Sparkles, Coins, Gem, Egg, Package } from 'lucide-react';
import { RARITIES } from '../../data/gameData';

const RewardBadge = ({ type, amount, label: customLabel, t }) => {
    let Icon = Sparkles;
    let color = 'text-slate-400';
    let bg = 'bg-slate-800';
    let label = type;

    if (type === 'COINS') {
        Icon = Coins;
        color = 'text-yellow-400';
        bg = 'bg-yellow-500/10 border border-yellow-500/20';
        label = t ? t('reward_coins') : 'Coins';
    } else if (type === 'GEMS') {
        Icon = Gem;
        color = 'text-pink-400';
        bg = 'bg-pink-500/10 border border-pink-500/20';
        label = t ? t('reward_gems') : 'Gems';
    } else if (type === 'XP') {
        Icon = Sparkles;
        color = 'text-green-400';
        bg = 'bg-green-500/10 border border-green-500/20';
        label = t ? t('reward_xp') : 'XP';
    } else if (type && type.includes('EGG')) {
        Icon = Egg;
        const rarityStr = type.split('_')[1] || 'COMMON';
        const rarity = RARITIES[rarityStr] || RARITIES.COMMON;
        color = rarity.color;
        bg = `bg-slate-800 border ${rarity.border}`;
        label = t ? `${t('rarity_' + rarityStr)} ${t('reward_egg')}` : `${rarity.label} Egg`;
    } else if (type === 'LOOTBOX') {
        Icon = Package;
        color = 'text-amber-400';
        bg = 'bg-amber-500/10 border border-amber-500/20';
        label = customLabel || (t ? t('reward_lootbox') : 'Chest');
    }

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${bg} shadow-sm`}>
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            <span className={`text-[10px] font-black ${color} uppercase tracking-wide`}>+{amount} {label}</span>
        </div>
    );
};

export default RewardBadge;
