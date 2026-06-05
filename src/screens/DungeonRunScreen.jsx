import React from 'react';
import { Sword, Package, Skull, Coins, Zap, Gem } from 'lucide-react';

const ROOM_COLORS = {
    BATTLE: 'from-red-900/40 to-slate-900/40 border-red-500/30',
    LOOT:   'from-amber-900/40 to-slate-900/40 border-amber-500/30',
    BOSS:   'from-purple-900/40 to-red-900/40 border-purple-500/30',
};

const ROOM_ICONS = { BATTLE: Sword, LOOT: Package, BOSS: Skull };

export default function DungeonRunScreen({ battleState, onEnterBattle, onCollectLoot, t }) {
    if (!battleState?.isDungeon) return null;

    const { dungeonRooms, dungeonFloor, myTeam, accumulatedRewards } = battleState;
    const currentRoom = dungeonRooms[dungeonFloor - 1];
    if (!currentRoom) return null;

    const RoomIcon = ROOM_ICONS[currentRoom.type] || Sword;
    const roomColorClass = ROOM_COLORS[currentRoom.type] || ROOM_COLORS.BATTLE;

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-300 bg-slate-950 px-4 pt-4 pb-6">
            {/* Floor progress bar */}
            <div className="shrink-0 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">{t ? t('dungeon_floor_progress') : 'Floor Progress'}</span>
                    <span className="text-xs font-bold text-white">{dungeonFloor} / {dungeonRooms.length}</span>
                </div>
                <div className="flex gap-1.5">
                    {dungeonRooms.map((room, i) => {
                        const completed = i < dungeonFloor - 1;
                        const current = i === dungeonFloor - 1;
                        const color = completed ? 'bg-green-500' : current ? 'bg-purple-500 animate-pulse' : 'bg-slate-700';
                        return <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${color}`} />;
                    })}
                </div>
            </div>

            {/* Current room card */}
            <div className={`bg-gradient-to-br ${roomColorClass} border rounded-2xl p-5 mb-4 shrink-0`}>
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                        <RoomIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase">
                            {t ? t('dungeon_floor_label', { floor: dungeonFloor }) : `Floor ${dungeonFloor}`}
                        </div>
                        <div className="text-xl font-black text-white">
                            {currentRoom.type === 'BOSS'   ? (t ? t('dungeon_room_boss')   : 'BOSS FLOOR')
                           : currentRoom.type === 'LOOT'   ? (t ? t('dungeon_room_loot')   : 'LOOT ROOM')
                           :                                 (t ? t('dungeon_room_battle') : 'BATTLE ROOM')}
                        </div>
                        {currentRoom.type !== 'LOOT' && (
                            <div className="text-xs text-slate-400 mt-0.5">
                                {currentRoom.enemyCount}× Lv.{currentRoom.enemyLevel} · {currentRoom.enemyRarity}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-yellow-400" />+{currentRoom.reward.coins}</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-blue-400" />+{currentRoom.reward.xp} XP</span>
                    {currentRoom.reward.gems > 0 && (
                        <span className="flex items-center gap-1"><Gem className="w-3 h-3 text-pink-400" />+{currentRoom.reward.gems}</span>
                    )}
                </div>
            </div>

            {/* Team HP status */}
            <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 mb-3 shrink-0">
                <div className="text-xs font-black text-slate-400 uppercase mb-2">{t ? t('dungeon_team_status') : 'Team Status'}</div>
                <div className="flex gap-2 flex-wrap">
                    {myTeam.map(pet => {
                        const hp = pet.hp || 0;
                        const maxHp = pet.maxHp || 1;
                        const pct = Math.max(0, Math.round((hp / maxHp) * 100));
                        const isKO = hp <= 0;
                        return (
                            <div key={pet.id} className={`flex-1 min-w-[72px] bg-slate-800/60 rounded-xl p-2 ${isKO ? 'opacity-40' : ''}`}>
                                <div className="text-xs font-bold text-white truncate">{pet.name}</div>
                                <div className="text-[10px] text-slate-400">{isKO ? 'KO' : `${hp}/${maxHp}`}</div>
                                {!isKO && (
                                    <div className="mt-1 h-1 bg-slate-700 rounded-full">
                                        <div
                                            className={`h-1 rounded-full ${pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Accumulated rewards */}
            {(accumulatedRewards.coins > 0 || accumulatedRewards.xp > 0 || accumulatedRewards.gems > 0) && (
                <div className="bg-slate-800/20 border border-white/5 rounded-xl px-3 py-2 mb-3 shrink-0 flex items-center gap-3 text-xs flex-wrap">
                    <span className="font-bold text-slate-500 uppercase">{t ? t('dungeon_accumulated') : 'Collected:'}</span>
                    {accumulatedRewards.coins > 0 && <span className="flex items-center gap-1 text-yellow-400"><Coins className="w-3 h-3" />{accumulatedRewards.coins}</span>}
                    {accumulatedRewards.xp > 0 && <span className="flex items-center gap-1 text-blue-400"><Zap className="w-3 h-3" />{accumulatedRewards.xp} XP</span>}
                    {accumulatedRewards.gems > 0 && <span className="flex items-center gap-1 text-pink-400"><Gem className="w-3 h-3" />{accumulatedRewards.gems}</span>}
                </div>
            )}

            <div className="flex-1" />

            {currentRoom.type === 'LOOT' ? (
                <button
                    onClick={onCollectLoot}
                    className="w-full py-4 bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-black text-lg rounded-2xl shadow-lg hover:from-amber-600 hover:to-yellow-500 active:scale-95 transition-all"
                >
                    {t ? t('dungeon_collect_loot', { coins: currentRoom.reward.coins }) : `COLLECT LOOT (+${currentRoom.reward.coins} Gold)`}
                </button>
            ) : (
                <button
                    onClick={onEnterBattle}
                    className={`w-full py-4 font-black text-lg rounded-2xl shadow-lg active:scale-95 transition-all ${
                        currentRoom.type === 'BOSS'
                            ? 'bg-gradient-to-r from-red-800 to-purple-800 text-white hover:from-red-700 hover:to-purple-700'
                            : 'bg-gradient-to-r from-slate-700 to-indigo-700 text-white hover:from-slate-600 hover:to-indigo-600'
                    }`}
                >
                    {currentRoom.type === 'BOSS'
                        ? (t ? t('dungeon_enter_boss') : 'FIGHT THE BOSS')
                        : (t ? t('dungeon_enter_battle') : 'ENTER BATTLE')}
                </button>
            )}
        </div>
    );
}
