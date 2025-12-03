import React from 'react';
import { ArrowLeft, Sparkles, Swords, Shield, Zap, Activity, Heart, Timer, X, Wind, Award, Scroll } from 'lucide-react';
import { TYPES, RARITIES, ABILITIES, ZODIAC_ANIMALS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export default function PetDetailScreen({ pet, onBack }) {
    const typeInfo = TYPES[pet.type] || TYPES.FIRE;
    const rarityInfo = RARITIES[pet.rarity] || RARITIES.COMMON;
    const ability = ABILITIES[pet.abilityId] || ABILITIES.fireball;
    const abilityTypeInfo = TYPES[ability.element] || { color: 'text-slate-400', label: 'Neutral' };
    
    // FIX: Fallback für unbekannte Spezies (alte Pets)
    const speciesInfo = ZODIAC_ANIMALS[pet.species] || { label: 'Unbekannt', icon: '?' };

    const xpPercent = (pet.xp / pet.maxXp) * 100;

    return (
      <div className="h-full flex flex-col animate-in fade-in relative bg-slate-900">
        
        {/* --- HEADER --- */}
        <div className="relative flex items-center justify-center mb-2 pt-4 px-4 z-20">
            <h1 className="text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                DETAILS
            </h1>
            <button 
                onClick={onBack} 
                className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
            
            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-64 flex items-center justify-center mb-4 overflow-hidden">
                <div className={`absolute inset-0 ${typeInfo.bg} opacity-10 blur-3xl`}></div>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${rarityInfo.bg} blur-[60px] opacity-20 animate-pulse`}></div>
                
                <div className="relative z-10 scale-150 drop-shadow-2xl">
                    <PetAvatar pet={pet} className="w-40 h-40" />
                </div>

                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border ${rarityInfo.border} ${rarityInfo.bg} bg-opacity-20 backdrop-blur-md flex items-center gap-2 shadow-lg`}>
                    <Sparkles className={`w-3 h-3 ${rarityInfo.color}`} />
                    <span className={`text-xs font-black uppercase tracking-widest text-white`}>{rarityInfo.label}</span>
                </div>
            </div>

            <div className="px-4 space-y-4">
                
                {/* --- INFO CARD --- */}
                <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-bold text-slate-500 uppercase">{speciesInfo.label}</span>
                                
                                <div className={`w-1 h-1 rounded-full bg-slate-600`}></div>
                                <span className={`text-xs font-bold ${typeInfo.color} uppercase`}>{typeInfo.label}</span>
                                
                                <div className={`w-1 h-1 rounded-full bg-slate-600`}></div>
                                <span className={`text-xs font-bold ${rarityInfo.color} uppercase`}>{rarityInfo.label}</span>
                            </div>
                            <h2 className="text-3xl font-black text-white leading-none">{pet.name}</h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-slate-500 font-bold uppercase">Level</span>
                            <span className="text-3xl font-black text-white">{pet.level}</span>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span>Erfahrung</span>
                            <span>{pet.xp} / {pet.maxXp} XP</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-300" style={{width: `${xpPercent}%`}}></div>
                        </div>
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-400"><Swords className="w-5 h-5" /></div>
                        <div><div className="text-[10px] text-slate-500 font-bold uppercase">Angriff</div><div className="text-xl font-black text-white">{pet.atk}</div></div>
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-xl text-green-400"><Heart className="w-5 h-5" /></div>
                        <div><div className="text-[10px] text-slate-500 font-bold uppercase">Leben</div><div className="text-xl font-black text-white">{pet.maxHp}</div></div>
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-slate-500/10 rounded-xl text-slate-400"><Shield className="w-5 h-5" /></div>
                        <div><div className="text-[10px] text-slate-500 font-bold uppercase">Rüstung</div><div className="text-xl font-black text-white">{pet.def}</div></div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400"><Wind className="w-5 h-5" /></div>
                        <div><div className="text-[10px] text-slate-500 font-bold uppercase">Tempo</div><div className="text-xl font-black text-white">{pet.speed}</div></div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400"><Zap className="w-5 h-5" /></div>
                        <div><div className="text-[10px] text-slate-500 font-bold uppercase">Magie</div><div className="text-xl font-black text-white">{pet.ap}</div></div>
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400"><Activity className="w-5 h-5" /></div>
                        <div><div className="text-[10px] text-slate-500 font-bold uppercase">Resistenz</div><div className="text-xl font-black text-white">{pet.res}</div></div>
                    </div>
                </div>

                {/* --- ABILITY CARD --- */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 border border-indigo-500/30 p-5 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10"><Scroll className="w-24 h-24 text-indigo-400" /></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="bg-indigo-500 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-500/20"><Zap className="w-4 h-4 fill-current" /></div>
                                <span className="font-black text-indigo-200 uppercase tracking-wider text-xs">Spezialfähigkeit</span>
                            </div>
                            <div className="bg-black/30 px-2 py-1 rounded text-[10px] font-bold text-slate-400 border border-white/5 flex items-center gap-1"><Timer className="w-3 h-3" /> {ability.cd} Runden</div>
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">{ability.name}</h3>
                        <p className="text-sm text-indigo-100/80 leading-relaxed">{ability.desc}</p>
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Typ:</span>
                            <span className={`text-[10px] font-bold uppercase ${abilityTypeInfo.color}`}>{abilityTypeInfo.label}</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-6"></div>
            </div>
        </div>
      </div>
    );
}