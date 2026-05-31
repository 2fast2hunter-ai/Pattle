import React from 'react';
import { X, Swords, Heart, Shield, Zap, Trash2, Coins } from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS, ABILITIES } from '../../data/gameData';
import PetAvatar from '../PetAvatar';

export default function MarketDetailModal({ pet, onClose, price, onBuy, isOwner, onRemove, t }) {
    if (!pet || pet.isEgg) return null;
    const typeInfo = TYPES[pet.type] || TYPES.FIRE;
    const rarityInfo = RARITIES[pet.rarity] || RARITIES.COMMON;
    const ability = ABILITIES[pet.abilityId] || ABILITIES.fireball;
    const speciesInfo = ZODIAC_ANIMALS[pet.species] || { label: 'Unknown' };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in zoom-in-50">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-0 relative overflow-hidden flex flex-col max-h-[85vh]">
                <div className="relative h-40 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    <div className={`absolute inset-0 ${typeInfo.bg} opacity-20 blur-3xl`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${rarityInfo.bg} blur-[50px] opacity-30 animate-pulse`}></div>
                    <div className="relative z-10 scale-125 drop-shadow-2xl"><PetAvatar pet={pet} className="w-32 h-32" /></div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-white/20 transition-colors z-20"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 flex-1 overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold text-slate-500 uppercase">{speciesInfo.label}</span><span className={`text-[10px] font-bold ${typeInfo.color} uppercase border border-white/10 px-1.5 rounded`}>{typeInfo.label}</span></div>
                            <h2 className={`text-2xl font-black ${rarityInfo.color}`}>{pet.name}</h2>
                        </div>
                        <div className="text-right"><div className="text-[10px] text-slate-500 font-bold uppercase">Level</div><div className="text-2xl font-black text-white">{pet.level}</div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                         <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-red-500/10 rounded-lg text-red-400"><Swords className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">ATK</div><div className="text-sm font-black text-white">{pet.atk}</div></div></div>
                         <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-green-500/10 rounded-lg text-green-400"><Heart className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">HP</div><div className="text-sm font-black text-white">{pet.maxHp}</div></div></div>
                        <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-slate-500/10 rounded-lg text-slate-400"><Shield className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">DEF</div><div className="text-sm font-black text-white">{pet.def}</div></div></div>
                         <div className="bg-slate-950/50 p-2 rounded-xl border border-white/5 flex items-center gap-2"><div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400"><Zap className="w-4 h-4" /></div><div><div className="text-[9px] text-slate-500 font-bold uppercase">AP</div><div className="text-sm font-black text-white">{pet.ap}</div></div></div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5"><div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold text-slate-500 uppercase">{t ? t('label_ability') : 'Ability'}</span><span className="text-[10px] font-bold text-indigo-400 uppercase">{ability.name}</span></div><p className="text-xs text-slate-400 leading-relaxed">{ability.desc}</p></div>
                </div>
                <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0">
                    {isOwner ? (
                        <button onClick={onRemove} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            <Trash2 className="w-4 h-4" /> {t ? t('market_remove_offer') : 'REMOVE LISTING'}
                        </button>
                    ) : (
                        <button onClick={onBuy} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            <Coins className="w-4 h-4 fill-black/20" /> {t ? t('market_buy_for', { price }) : `BUY FOR ${price}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}