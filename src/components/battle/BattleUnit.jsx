import React from 'react';
import { Swords, Shield, Zap, Activity, Wind, Timer } from 'lucide-react';
import { TYPES } from '../../data/gameData';
import { RARITIES } from '../../data/rarities';
import PetAvatar from '../PetAvatar';

const StatBox = ({ icon: Icon, val, color, bg }) => (
    <div className={`flex flex-col items-center justify-center py-1 rounded-lg ${bg} border border-white/5`}>
        <Icon className={`w-2.5 h-2.5 ${color} mb-0.5`} />
        <span className="text-[8px] font-black text-slate-300 leading-none">{val}</span>
    </div>
);

export default function BattleUnit({ pet, isEnemy, attackState, isHit, damageText, t }) {
    const hpPercent = (pet.hp / pet.maxHp) * 100;
    const typeInfo = TYPES[pet.type] || TYPES.FIRE;

    let animClass = "animate-float";
    if (attackState) {
        if (attackState.type === 'PHYSICAL') {
            animClass = isEnemy ? "animate-dash-left" : "animate-dash-right";
        } else {
            animClass = "animate-cast";
        }
    } else if (isHit) {
        animClass = "animate-hit";
    }

    const getHpColor = (pct) => {
        if (pct > 50) return 'bg-gradient-to-r from-emerald-500 to-green-400';
        if (pct > 20) return 'bg-gradient-to-r from-yellow-500 to-orange-400';
        return 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse';
    };

    return (
        <div className={`flex flex-col ${isEnemy ? 'items-end' : 'items-start'} relative group w-full max-w-[220px] sm:max-w-[280px]`}>

            <div className={`relative z-20 transition-all duration-300 mb-4 ${animClass}`}>

                {damageText && (
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 z-[100] pointer-events-none animate-bounce whitespace-nowrap`}>
                        <span className={`text-4xl font-black ${damageText.col} drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider`} style={{ textShadow: '0 0 10px rgba(0,0,0,0.5), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                            {damageText.val}
                        </span>
                    </div>
                )}

                <div className="relative">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 ${typeInfo.bg} opacity-20 blur-[40px] rounded-full transition-opacity duration-500 ${attackState?.type === 'SPECIAL' ? 'opacity-60 scale-125' : ''}`}></div>

                    {pet.rarity === 'MYTHIC' && (
                        <>
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute animate-mythic-particle pointer-events-none w-2 h-2 rounded-full bg-yellow-400"
                                    style={{
                                        bottom: `${10 + (i % 3) * 15}%`,
                                        left: `${10 + (i * 11) % 80}%`,
                                        animationDelay: `${i * 0.22}s`,
                                        '--tx': `${(i % 2 === 0 ? 1 : -1) * (8 + i * 4)}px`,
                                    }}
                                />
                            ))}
                            <div className="absolute inset-0 rounded-full animate-mythic-glow pointer-events-none" />
                        </>
                    )}

                    <div className="drop-shadow-2xl filter transition-transform">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                            <PetAvatar pet={pet} className="w-full h-full object-contain" />
                        </div>
                    </div>

                    {attackState?.type === 'SPECIAL' && (
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 ${isEnemy ? 'animate-dash-left' : 'animate-dash-right'}`}>
                            <div className={`w-12 h-12 rounded-full ${typeInfo.bg} blur-md opacity-80`}></div>
                        </div>
                    )}
                </div>

                {pet.currentCd > 0 && (
                    <div className="absolute -top-2 -right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-lg z-30">
                        <Timer className="w-3 h-3 text-slate-400" />
                        <span>{pet.currentCd}</span>
                    </div>
                )}
            </div>

            <div className={`relative w-full transition-all duration-500 bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl ${attackState ? 'ring-2 ring-white/30 scale-105 z-30' : 'opacity-95'}`}>

                <div className="flex flex-col mb-2 gap-1">
                    <span className={`font-black text-sm w-full truncate ${isEnemy ? 'text-right text-red-200' : 'text-left text-indigo-200'}`} title={pet.name}>{pet.name}</span>

                    <div className={`flex items-center justify-between w-full ${isEnemy ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t ? t('village_lvl') : 'Lvl'} {pet.level}</span>

                        <div className={`flex items-center gap-1.5 ${isEnemy ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border border-white/10 shadow-sm ${RARITIES[pet.rarity]?.bg || 'bg-slate-500'} bg-opacity-40`}>
                                <span className={`text-[9px] font-black uppercase ${RARITIES[pet.rarity]?.color || 'text-white'}`}>{t ? t('rarity_' + (pet.rarity || 'COMMON')) : (RARITIES[pet.rarity]?.label || 'Common')}</span>
                            </div>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border border-white/10 shadow-sm bg-gradient-to-br ${typeInfo.bg} from-black/40 to-transparent`}>
                                <div className="text-white scale-75">{typeInfo.icon}</div>
                                <span className="text-[9px] font-black text-white uppercase">{t ? t('type_' + pet.type) : typeInfo.label}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden mb-1.5 shadow-inner border border-white/5">
                    <div className="absolute top-0 left-0 h-full bg-white/20 w-full transition-all duration-1000 ease-out" style={{ width: `${hpPercent}%` }}></div>
                    <div className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.3)] ${getHpColor(hpPercent)}`} style={{ width: `${hpPercent}%` }}></div>
                </div>

                <div className="flex justify-end mb-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400">{Math.ceil(pet.hp)} / {pet.maxHp} HP</span>
                </div>

                <div className="grid grid-cols-5 gap-1">
                    <StatBox icon={Swords} val={pet.atk} color="text-red-400" bg="bg-red-500/10" />
                    <StatBox icon={Shield} val={pet.def} color="text-slate-400" bg="bg-slate-500/10" />
                    <StatBox icon={Zap} val={pet.ap} color="text-purple-400" bg="bg-purple-500/10" />
                    <StatBox icon={Activity} val={pet.res} color="text-pink-400" bg="bg-pink-500/10" />
                    <StatBox icon={Wind} val={pet.speed} color="text-sky-400" bg="bg-sky-500/10" />
                </div>
            </div>
        </div>
    );
}