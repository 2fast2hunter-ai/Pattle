import React, { useState } from 'react';
import { Skull, Trophy, Coins, Star, Repeat, XCircle, CheckCircle, Flame, Share2, Check } from 'lucide-react';
import PetAvatar from '../PetAvatar';
import { getPetLevelProgress } from '../../utils/mechanics/petStats';
import { TYPES } from '../../data/gameData';
import { shareVictory } from '../../utils/shareUtils';

export default function BattleVictory({
    won,
    battleState,
    myTeam,
    myTeamIds,
    damageDealt,
    isAutoBattle,
    isLastAuto,
    autoProgress,
    autoBattleRemaining,
    baseCoins,
    baseXp,
    displayCoins,
    displayXp,
    isFriendly,
    onWin,
    onLose,
    onCancelAutoBattle,
    t
}) {
    const xpPerPet = Math.floor(displayXp / Math.max(1, myTeam.length));
    const [victoryCopied, setVictoryCopied] = useState(false);

    const handleShareVictory = async () => {
        try {
            const elementLabel = myTeam && myTeam.length > 0
                ? (TYPES[myTeam[0]?.type]?.label || myTeam[0]?.type || '')
                : '';
            const floorNumber = battleState.isGauntlet ? battleState.gauntletRound : null;
            const result = await shareVictory(elementLabel, floorNumber);
            if (result === 'copied') {
                setVictoryCopied(true);
                setTimeout(() => setVictoryCopied(false), 2000);
            }
        } catch (_) { /* share API unavailable or user cancelled */ }
    };

    return (
        <>
            <div className="flex flex-col items-center mb-8 shrink-0">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-[0_0_60px_rgba(0,0,0,0.6)] border-4 border-white/20 ${won ? 'bg-gradient-to-br from-yellow-400 to-amber-600 animate-bounce' : 'bg-gradient-to-br from-red-500 to-red-900'}`}>
                    {won ? <Trophy className="w-12 h-12 text-white drop-shadow-md" /> : <Skull className="w-12 h-12 text-white drop-shadow-md" />}
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 drop-shadow-2xl text-center">
                    {won ? (t ? t('battle_win') : 'SIEG!') : (t ? t('battle_loss') : 'NIEDERLAGE')}
                </h2>
            </div>

            {isAutoBattle && !isLastAuto && (
                <div className="w-full max-w-xs mx-auto mb-8 shrink-0">
                    <div className="flex justify-between text-[10px] text-purple-300 font-bold mb-1 uppercase"><span>{t ? t('battle_next_fight') : 'Next Fight'}</span><span>{(3 - (autoProgress / 33.3)).toFixed(1)}s</span></div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-purple-500/30"><div className="h-full bg-purple-500 transition-all duration-100 ease-linear" style={{ width: `${autoProgress}%` }}></div></div>
                </div>
            )}

            {!isFriendly && !battleState.isGauntlet ? (
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 mb-8 flex justify-around items-center shadow-2xl w-full max-w-sm shrink-0">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t ? t('reward_xp') : 'XP'}</span>
                        <div className="flex items-center gap-2 text-green-400"><Star className="w-6 h-6 fill-current" /><span className="font-black text-2xl">+{displayXp}</span></div>
                    </div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t ? t('reward_coins') : 'Coins'}</span>
                        <div className="flex items-center gap-2 text-yellow-400"><Coins className="w-6 h-6 fill-current" /><span className="font-black text-2xl">+{displayCoins}</span></div>
                    </div>
                </div>
            ) : isFriendly ? (
                <div className="bg-blue-900/40 backdrop-blur-md p-4 rounded-2xl border border-blue-500/30 mb-8 text-center w-full max-w-sm shrink-0">
                    <p className="text-blue-200 font-black text-sm">{t ? t('battle_friendly_title') : 'FRIENDLY BATTLE'}</p>
                    <p className="text-blue-300/70 text-xs">{t ? t('battle_friendly_desc') : 'No rewards earned'}</p>
                </div>
            ) : null}

            {!isFriendly && won && myTeam && !battleState.isGauntlet && (
                <div className="w-full max-w-sm space-y-2 mb-6 shrink-0">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">{t ? t('battle_team_xp') : 'Team Experience'}</h3>
                    {myTeam.map(pet => {
                        const progress = getPetLevelProgress(pet);
                        const gainedPercent = (xpPerPet / progress.max) * 100;
                        const isLevelUp = (progress.current + xpPerPet) >= progress.max;

                        return (
                            <div key={pet.id} className="flex flex-col bg-slate-800/60 p-2 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8"><PetAvatar pet={pet} className="w-full h-full" /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white">{pet.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400">Lvl {pet.level}</span>
                                                {isLevelUp && <span className="text-[9px] font-black text-yellow-400 animate-bounce">LEVEL UP!</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 px-2 py-1 rounded-lg">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>+{xpPerPet}</span>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden flex relative">
                                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress.percent}%` }}></div>
                                    <div className="h-full bg-green-400 animate-pulse transition-all duration-500" style={{ width: `${Math.min(gainedPercent, 100 - progress.percent)}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {battleState.isGauntlet && won ? (
                <div className="bg-slate-800/80 px-8 py-4 rounded-xl border border-white/10 animate-pulse">
                    <span className="text-white font-bold text-lg flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-500 animate-fire" />
                        {t ? t('battle_next_round') : 'Next round...'}
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full max-w-sm shrink-0 pb-6">
                    {won && (
                        <button onClick={handleShareVictory} className="w-full py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm flex justify-center items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all active:scale-95">
                            {victoryCopied ? <><Check className="w-4 h-4" /> {t ? t('label_copied') : 'Copied!'}</> : <><Share2 className="w-4 h-4" /> {t ? t('battle_share_victory') : 'Share victory'}</>}
                        </button>
                    )}
                    <button onClick={() => won ? onWin({ coins: baseCoins, xp: baseXp }, myTeamIds, null, damageDealt) : onLose({ xp: baseXp }, myTeamIds)} className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl flex justify-center items-center gap-2 transition-all ${isAutoBattle && !isLastAuto ? 'bg-purple-600 text-white animate-pulse' : (isLastAuto ? 'bg-green-600 text-white hover:scale-[1.02]' : 'bg-white text-slate-950 hover:scale-[1.02] active:scale-95')}`}>
                        {isLastAuto ? <><CheckCircle className="w-5 h-5" /> {t ? t('battle_finish') : 'FINISH'}</> : isAutoBattle ? <><Repeat className="w-5 h-5" /> {t ? t('battle_continue') : 'NEXT'} ({autoBattleRemaining})</> : (isFriendly ? (t ? t('battle_back') : "BACK") : (t ? t('battle_continue') : "NEXT"))}
                    </button>
                    {isAutoBattle && !isLastAuto && (<button onClick={onCancelAutoBattle} className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"><XCircle className="w-4 h-4" /> {t ? t('battle_cancel_auto') : 'CANCEL AUTO-BATTLE'}</button>)}
                </div>
            )}
        </>
    );
}
