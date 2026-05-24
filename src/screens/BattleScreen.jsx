import React, { useEffect, useState } from 'react';
import { BattleStyles } from '../components/battle/BattleStyles';
import ArenaBackground from '../components/battle/ArenaBackground';
import GauntletSummary from '../components/battle/GauntletSummary';
import BattleVictory from '../components/battle/BattleVictory';
import BattleRoundIndicator from '../components/battle/BattleRoundIndicator';
import BattleLog from '../components/battle/BattleLog';
import BattleArena from '../components/battle/BattleArena';
import { Repeat, CheckCircle, Tv } from 'lucide-react';
import { useBattleTurn } from '../hooks/useBattleTurn';
import { useAutoBattleLoop } from '../hooks/useAutoBattleLoop';
import { showRewardedAd } from '../utils/adManager';
import AdModal from '../components/ui/AdModal';

export default function BattleScreen({ battleState, setBattleState, user, onWin, onLose, isAutoBattle, autoBattleRemaining, onCancelAutoBattle, t }) {
    const { myTeam, enemyTeam, myIndex, enemyIndex, turn, isOver, round, isFriendly, log } = battleState;
    const myPet = myTeam[myIndex];
    const enemyPet = enemyTeam[enemyIndex];
    const [reviveUsed, setReviveUsed] = useState(false);
    const [showDevAdModal, setShowDevAdModal] = useState(false);

    // --- HOOKS ---
    const {
        executeTurn,
        animatingUnit,
        hitUnit,
        floatingDamage,
        damageDealt
    } = useBattleTurn(battleState, setBattleState, t);

    // Auto Battle Logic
    const { autoProgress } = useAutoBattleLoop(
        battleState,
        isAutoBattle,
        autoBattleRemaining,
        onWin,
        onLose,
        damageDealt
    );

    // Turn Execution Trigger
    useEffect(() => {
        if (isOver) return;
        const timer = setTimeout(() => {
            if (animatingUnit || hitUnit) return;
            if (turn === 'PLAYER') executeTurn(myPet, enemyPet, 'PLAYER');
            else executeTurn(enemyPet, myPet, 'ENEMY');
        }, 800);
        return () => clearTimeout(timer);
    }, [turn, isOver, animatingUnit, hitUnit, myPet, enemyPet, executeTurn]);


    const handleReviveByAd = () => {
        showRewardedAd({
            onReward: () => {
                setReviveUsed(true);
                const revivedTeam = battleState.myTeam.map(p => ({
                    ...p,
                    hp: Math.max(1, Math.floor(p.maxHp * 0.5))
                }));
                setBattleState(prev => ({ ...prev, myTeam: revivedTeam, isOver: false, turn: 'PLAYER' }));
            },
            onError: () => {},
            onOpenDevModal: () => setShowDevAdModal(true)
        });
    };

    if (showDevAdModal) {
        return (
            <div className="absolute inset-0 z-50">
                <BattleStyles />
                <AdModal
                    onClose={() => setShowDevAdModal(false)}
                    onReward={() => {
                        setShowDevAdModal(false);
                        setReviveUsed(true);
                        const revivedTeam = battleState.myTeam.map(p => ({
                            ...p,
                            hp: Math.max(1, Math.floor(p.maxHp * 0.5))
                        }));
                        setBattleState(prev => ({ ...prev, myTeam: revivedTeam, isOver: false, turn: 'PLAYER' }));
                    }}
                />
            </div>
        );
    }

    // --- RENDER ---
    if (isOver) {
        const won = enemyTeam[enemyTeam.length - 1].hp === 0;
        const myTeamIds = myTeam.map(p => p.id);

        const baseCoins = !isFriendly && won ? 150 : (!isFriendly ? 5 : 0);
        const baseXp = !isFriendly && won ? 200 : (!isFriendly ? 20 : 0);

        let displayCoins = baseCoins;
        let displayXp = baseXp;
        if (user?.buffs?.coinBoostMatches > 0) displayCoins *= 2;
        if (user?.buffs?.xpBoostMatches > 0) displayXp *= 2;

        const isLastAuto = isAutoBattle && autoBattleRemaining === 1;

        return (
            <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col">
                <BattleStyles />
                <ArenaBackground enemyType={won ? 'LIGHT' : 'DARK'} />

                <div className="relative z-10 flex-1 w-full overflow-y-auto p-6 flex flex-col items-center justify-center scrollbar-hide">
                    {isAutoBattle && (<div className={`absolute top-4 right-4 backdrop-blur px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-2 shadow-lg z-50 ${isLastAuto ? 'bg-green-600/90 border-green-400/30 text-white' : 'bg-purple-600/90 border-purple-400/30 text-white animate-pulse'}`}>{isLastAuto ? <CheckCircle className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}{isLastAuto ? (t ? t('battle_auto_done') : 'Fertig') : `${t ? t('battle_auto_remaining') : 'Auto: Noch'} ${autoBattleRemaining}`}</div>)}

                    {!won && !reviveUsed && !isAutoBattle && !isFriendly && !battleState.isGauntlet && (
                        <div className="w-full max-w-sm mb-6 bg-indigo-900/40 border border-indigo-500/30 rounded-2xl p-4 text-center animate-in fade-in slide-in-from-bottom">
                            <p className="text-white font-black text-lg mb-1">Wiederbelebung!</p>
                            <p className="text-slate-400 text-xs mb-4">Schau eine kurze Werbung und dein Team wird auf 50% HP wiederbelebt.</p>
                            <button
                                onClick={handleReviveByAd}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Tv className="w-5 h-5" />
                                Werbung schauen — Wiederbeleben
                            </button>
                        </div>
                    )}

                    {battleState.isGauntlet && !won ? (
                        <GauntletSummary
                            battleState={battleState}
                            myTeam={myTeam}
                            displayXp={displayXp}
                            displayCoins={displayCoins}
                            baseXp={baseXp}
                            onLose={onLose}
                            t={t}
                        />
                    ) : (
                        <BattleVictory
                            won={won}
                            battleState={battleState}
                            myTeam={myTeam}
                            myTeamIds={myTeamIds}
                            damageDealt={damageDealt}
                            isAutoBattle={isAutoBattle}
                            isLastAuto={isLastAuto}
                            autoProgress={autoProgress}
                            autoBattleRemaining={autoBattleRemaining}
                            baseCoins={baseCoins}
                            baseXp={baseXp}
                            displayCoins={displayCoins}
                            displayXp={displayXp}
                            isFriendly={isFriendly}
                            onWin={onWin}
                            onLose={onLose}
                            onCancelAutoBattle={onCancelAutoBattle}
                            t={t}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            <BattleStyles />
            <ArenaBackground enemyType={enemyPet?.type} />

            {isAutoBattle && (<div className="absolute top-14 right-4 z-20 bg-purple-600/80 backdrop-blur px-3 py-1 rounded-full border border-purple-400/30 text-[10px] font-bold text-white flex items-center gap-1 shadow-lg"><Repeat className="w-3 h-3 animate-spin-slow" />{t ? t('battle_auto_remaining') : 'Auto'}: {autoBattleRemaining}</div>)}

            <BattleRoundIndicator
                isGauntlet={battleState.isGauntlet}
                gauntletRound={battleState.gauntletRound}
                round={round}
                t={t}
            />

            <BattleArena
                enemyTeam={enemyTeam}
                enemyIndex={enemyIndex}
                enemyPet={enemyPet}
                myTeam={myTeam}
                myIndex={myIndex}
                myPet={myPet}
                animatingUnit={animatingUnit}
                hitUnit={hitUnit}
                floatingDamage={floatingDamage}
                t={t}
            />

            <BattleLog log={log} />
        </div>
    );
}
