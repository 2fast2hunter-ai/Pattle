import React, { useEffect } from 'react';
import { BattleStyles } from '../components/battle/BattleStyles';
import ArenaBackground from '../components/battle/ArenaBackground';
import GauntletSummary from '../components/battle/GauntletSummary';
import BattleVictory from '../components/battle/BattleVictory';
import BattleRoundIndicator from '../components/battle/BattleRoundIndicator';
import BattleLog from '../components/battle/BattleLog';
import BattleArena from '../components/battle/BattleArena';
import { Repeat, CheckCircle } from 'lucide-react';
import { useBattleTurn } from '../hooks/useBattleTurn';
import { useAutoBattleLoop } from '../hooks/useAutoBattleLoop';

export default function BattleScreen({ battleState, setBattleState, user, onWin, onLose, isAutoBattle, autoBattleRemaining, onCancelAutoBattle, t }) {
    const { myTeam, enemyTeam, myIndex, enemyIndex, turn, isOver, round, isFriendly, log } = battleState;
    const myPet = myTeam[myIndex];
    const enemyPet = enemyTeam[enemyIndex];

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
