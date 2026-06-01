import { useState } from 'react';
import { ABILITIES } from '../data/gameData';
import { calculateDamage } from '../utils/mechanics/battleLogic';

export function useBattleTurn(battleState, setBattleState, t, speed = 1) {
    const [animatingUnit, setAnimatingUnit] = useState(null); // { side: 'PLAYER'|'ENEMY', type: 'PHYSICAL'|'SPECIAL' }
    const [hitUnit, setHitUnit] = useState(null);
    const [floatingDamage, setFloatingDamage] = useState(null);
    const [damageDealt, setDamageDealt] = useState({});

    const executeTurn = async (attacker, defender, who) => {
        const { myTeam, enemyTeam, myIndex, enemyIndex, log, round } = battleState;
        let newLog = [...log];

        // 1. Ability oder Smart Auto Attack wählen
        const hasAbility = attacker.abilityId && ABILITIES[attacker.abilityId];
        const isAbilityReady = attacker.currentCd <= 0;
        const shouldUseAbility = hasAbility && isAbilityReady;

        let abilityToUse;

        if (shouldUseAbility) {
            abilityToUse = ABILITIES[attacker.abilityId];
        } else {
            const useMagicAuto = (attacker.ap || 0) > (attacker.atk || 0);
            abilityToUse = {
                name: useMagicAuto ? 'Magic Strike' : 'Attack',
                type: useMagicAuto ? 'SPECIAL' : 'PHYSICAL',
                element: attacker.type,
                dmgScale: 1.0,
                cd: 0
            };
        }

        // --- ANIMATION START ---
        setAnimatingUnit({ side: who, type: abilityToUse.type });
        if (shouldUseAbility) newLog.push(t ? t('battle_log_uses', { attacker: attacker.name, ability: abilityToUse.name }) : `${attacker.name} uses ${abilityToUse.name}!`);
        else newLog.push(t ? t('battle_log_attacks', { attacker: attacker.name }) : `${attacker.name} attacks.`);

        await new Promise(r => setTimeout(r, Math.round(400 / speed)));

        // 2. Schaden berechnen
        const { damage, isCrit, effectiveness } = calculateDamage(attacker, defender, abilityToUse);

        if (effectiveness > 1) newLog.push(t ? t('battle_log_effective') : "⚡ Super effective!");
        else if (effectiveness < 1) newLog.push(t ? t('battle_log_not_effective') : "🛡️ Not very effective...");

        const effectiveDamage = Math.min(damage, defender.hp);
        setDamageDealt(prev => ({ ...prev, [attacker.id]: (prev[attacker.id] || 0) + effectiveDamage }));

        const newHp = Math.max(0, defender.hp - damage);

        // --- HIT ANIMATION ---
        const targetSide = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';
        setHitUnit(targetSide);

        let floatCol = 'text-white';
        if (isCrit) floatCol = 'text-yellow-400';
        else if (effectiveness > 1) floatCol = 'text-red-400';
        else if (effectiveness < 1) floatCol = 'text-slate-400';
        else if (abilityToUse.type === 'SPECIAL' && !shouldUseAbility) floatCol = 'text-purple-300';

        const displayVal = isCrit ? (t ? t('battle_log_crit', { damage }) : `CRIT! ${damage}`) : `${damage}`;
        setFloatingDamage({ val: displayVal, col: floatCol, target: targetSide });

        await new Promise(r => setTimeout(r, Math.round(500 / speed)));

        // Reset Animations
        setAnimatingUnit(null);
        setHitUnit(null);
        setFloatingDamage(null);

        const nextCd = shouldUseAbility ? abilityToUse.cd : Math.max(0, attacker.currentCd - 1);

        const updatedAttacker = { ...attacker, currentCd: nextCd };
        const updatedDefender = { ...defender, hp: newHp };

        let nextMyIndex = myIndex, nextEnemyIndex = enemyIndex, gameOver = false;

        // Standard Nächster Zug
        let nextTurn = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';
        let nextRound = who === 'ENEMY' ? round + 1 : round;

        // --- DOPPEL-ANGRIFF LOGIK (SPEED) ---
        const hasDoubleSpeed = (attacker.speed || 0) >= (defender.speed || 0) * 2;
        const extraTurnTaken = battleState.extraTurnTaken || false;
        let nextExtraTurnState = false;

        if (newHp > 0 && hasDoubleSpeed && !extraTurnTaken) {
            nextTurn = who; // Angreifer bleibt dran
            newLog.push(t ? t('battle_log_extra_turn', { attacker: attacker.name }) : `⚡ ${attacker.name} is so fast! Extra turn!`);
            nextExtraTurnState = true;
        }

        if (newHp === 0) {
            newLog.push(t ? t('battle_log_defeated', { defender: updatedDefender.name }) : `💀 ${updatedDefender.name} defeated!`);
            if (who === 'PLAYER') {
                if (enemyIndex + 1 < enemyTeam.length) {
                    nextEnemyIndex++;
                    nextTurn = 'ENEMY';
                    nextExtraTurnState = false;
                } else {
                    gameOver = true;
                }
            } else {
                if (myIndex + 1 < myTeam.length) {
                    nextMyIndex++;
                    nextTurn = 'PLAYER';
                    nextExtraTurnState = false;
                } else {
                    gameOver = true;
                }
            }
        }

        const newMyTeam = [...myTeam]; const newEnemyTeam = [...enemyTeam];
        if (who === 'PLAYER') { newMyTeam[myIndex] = updatedAttacker; newEnemyTeam[enemyIndex] = updatedDefender; }
        else { newEnemyTeam[enemyIndex] = updatedAttacker; newMyTeam[myIndex] = updatedDefender; }

        setBattleState({
            ...battleState,
            myTeam: newMyTeam,
            enemyTeam: newEnemyTeam,
            myIndex: nextMyIndex,
            enemyIndex: nextEnemyIndex,
            log: newLog,
            turn: nextTurn,
            round: nextRound,
            isOver: gameOver,
            extraTurnTaken: nextExtraTurnState
        });
    };

    return {
        executeTurn,
        animatingUnit,
        hitUnit,
        floatingDamage,
        damageDealt
    };
}
