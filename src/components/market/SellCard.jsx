import React from 'react';
import { DollarSign, Pickaxe, Egg } from 'lucide-react';
import { RARITIES } from '../../data/gameData';
import PetAvatar from '../PetAvatar';

export default function SellCard({ item, isSelected, onToggle, t }) {
    // RESOURCE
    if (item.isResource) {
        return (
            <div onClick={() => onToggle(item)} className={`bg-slate-800 p-3 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${isSelected ? 'border-green-500' : 'border-white/5'}`}>
                <div className={`w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center ${item.color}`}><Pickaxe className="w-6 h-6" /></div>
                <div className="flex-1">
                    <div className={`font-bold ${item.color}`}>{t ? t('item_' + item.id) : item.label}</div>
                    <div className="text-xs text-slate-400">Besitz: {item.count}</div>
                </div>
                {isSelected && <div className="bg-green-500 text-black p-1 rounded-full"><DollarSign className="w-4 h-4" /></div>}
            </div>
        );
    }
    // PET
    const rarity = RARITIES[item.rarity];
    const displayName = item.isEgg ? (t ? `${t('rarity_' + item.rarity)} ${t('inv_egg_suffix')}` : `${rarity.label} Ei`) : (item.name || (t ? t('rarity_' + item.rarity) : rarity.label));

    return (
        <div onClick={() => onToggle(item)} className={`bg-slate-800 p-3 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${isSelected ? 'border-green-500' : 'border-white/5'}`}>
            {item.isEgg ? <Egg className={`w-12 h-12 ${rarity.color}`} /> : <PetAvatar pet={item} className="w-12 h-12" />}
            <div className="flex-1">
                <div className={`font-bold ${rarity.color}`}>{displayName}</div>
                <div className="text-xs text-slate-400">{item.isStack ? `x${item.count}` : `Lvl ${item.level}`}</div>
            </div>
            {isSelected && <div className="bg-green-500 text-black p-1 rounded-full"><DollarSign className="w-4 h-4" /></div>}
        </div>
    );
}
