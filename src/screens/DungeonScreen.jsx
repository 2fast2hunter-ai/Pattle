import React from 'react';
import { ArrowLeft, Key, Skull, Sword, Trophy, Map } from 'lucide-react';
import { DUNGEON_CONFIG, getDungeonKeysRemaining } from '../data/dungeonData';

export default function DungeonScreen({ user, onBack, onStartRun, t }) {
    const keysRemaining = getDungeonKeysRemaining(user);
    const bestFloor = user?.stats?.dungeonBestFloor || 0;
    const totalRuns = user?.stats?.dungeonRuns || 0;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            <div className="relative flex items-center justify-between mb-4 pt-2 px-4 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-wide text-white uppercase">{t ? t('dungeon_title') : 'DUNGEON'}</h2>
                        <p className="text-xs font-bold text-slate-400">{t ? t('dungeon_subtitle') : 'Roguelike Runs'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-900/40 border border-amber-500/40 px-3 py-1.5 rounded-xl">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-black text-amber-300">{keysRemaining} / {DUNGEON_CONFIG.dailyKeys}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide space-y-4">
                <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-700/40 flex items-center justify-center">
                            <Skull className="w-6 h-6 text-purple-300" />
                        </div>
                        <div>
                            <div className="font-black text-white">{t ? t('dungeon_info_title') : 'DUNGEON MODE'}</div>
                            <div className="text-xs text-slate-400">{t ? t('dungeon_info_desc') : '5 floors · Permanent death · Scaling difficulty'}</div>
                        </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2"><Skull className="w-3 h-3 text-red-400" />{t ? t('dungeon_rule_permadeath') : 'KO = Permanent: fallen pets stay KO for the run'}</div>
                        <div className="flex items-center gap-2"><Map className="w-3 h-3 text-blue-400" />{t ? t('dungeon_rule_floors') : 'Random battles, loot rooms, and a boss on floor 5'}</div>
                        <div className="flex items-center gap-2"><Key className="w-3 h-3 text-amber-400" />{t ? t('dungeon_rule_keys', { max: DUNGEON_CONFIG.dailyKeys }) : `${DUNGEON_CONFIG.dailyKeys} keys per day — refills at midnight`}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-3 text-center">
                        <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <div className="text-xl font-black text-white">{bestFloor}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t ? t('dungeon_best_floor') : 'Best Floor'}</div>
                    </div>
                    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-3 text-center">
                        <Sword className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                        <div className="text-xl font-black text-white">{totalRuns}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t ? t('dungeon_total_runs') : 'Total Runs'}</div>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4">
                    <div className="text-xs font-black text-slate-400 uppercase mb-3">{t ? t('dungeon_rewards_preview') : 'Rewards per Floor'}</div>
                    <div className="space-y-2">
                        {[
                            { floor: 1, label: t ? t('dungeon_floor_battle') : 'Battle',       coins: 40,  xp: 20,  color: 'text-slate-300' },
                            { floor: 2, label: t ? t('dungeon_floor_random') : 'Battle / Loot', coins: 65,  xp: 35,  color: 'text-blue-400'  },
                            { floor: 3, label: t ? t('dungeon_floor_battle') : 'Battle',       coins: 100, xp: 55,  color: 'text-green-400' },
                            { floor: 4, label: t ? t('dungeon_floor_elite') : 'Elite',         coins: 150, xp: 80,  color: 'text-purple-400' },
                            { floor: 5, label: t ? t('dungeon_floor_boss') : 'BOSS',           coins: 400, xp: 200, color: 'text-red-400', gems: 5 },
                        ].map(f => (
                            <div key={f.floor} className="flex items-center justify-between text-xs">
                                <span className={`font-bold ${f.color}`}>{t ? t('dungeon_floor_label', { floor: f.floor }) : `Floor ${f.floor}`} · {f.label}</span>
                                <span className="text-slate-300">+{f.coins} Gold · +{f.xp} XP{f.gems ? ` · +${f.gems} 💎` : ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-6">
                {keysRemaining > 0 ? (
                    <button
                        onClick={onStartRun}
                        className="w-full py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-black text-lg rounded-2xl shadow-lg hover:from-purple-600 hover:to-indigo-600 active:scale-95 transition-all"
                    >
                        {t ? t('dungeon_enter_btn', { keys: keysRemaining }) : `ENTER DUNGEON (${keysRemaining} keys left)`}
                    </button>
                ) : (
                    <div className="w-full py-4 bg-slate-800/80 text-slate-500 font-black text-base rounded-2xl text-center">
                        {t ? t('dungeon_no_keys') : 'No keys left today — come back tomorrow'}
                    </div>
                )}
            </div>
        </div>
    );
}
