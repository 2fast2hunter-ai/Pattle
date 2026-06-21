import { useState, useRef, useCallback, useEffect } from 'react';
import { ABILITIES, SPECIES_ABILITY_MAP } from '../data/gameData';
import { calculateDamage } from '../utils/mechanics/battleLogic';

export function useBattleTurn(battleState, setBattleState, t, speed = 1) {
    const [animatingUnit, setAnimatingUnit] = useState(null); // { side: 'PLAYER'|'ENEMY', type: 'PHYSICAL'|'SPECIAL' }
    const [hitUnit, setHitUnit] = useState(null);
    const [floatingDamage, setFloatingDamage] = useState(null);
    const [damageDealt, setDamageDealt] = useState({});

    // Always-fresh ref so executeTurn doesn't need battleState as a useCallback dep,
    // preventing the BattleScreen effect timer from resetting on every animation render.
    const battleStateRef = useRef(battleState);
    useEffect(() => { battleStateRef.current = battleState; });

    // Prevent concurrent turn executions (guards against React StrictMode double-invoke
    // and any edge case where the timer fires before the previous turn fully settles).
    const isExecutingRef = useRef(false);

    const executeTurn = useCallback(async (attacker, defender, who) => {
        if (!attacker || !defender) return;
        if (isExecutingRef.current) return;
        isExecutingRef.current = true;

        try {
            const { myTeam, enemyTeam, myIndex, enemyIndex, log, round } = battleStateRef.current;
            let newLog = [...log];

            // 1. Ability oder Smart Auto Attack wählen
            // Always resolve via SPECIES_ABILITY_MAP first so existing pets with old abilityIds get the right ability
            const resolvedAbilityId = SPECIES_ABILITY_MAP[attacker.species] || attacker.abilityId;
            const hasAbility = resolvedAbilityId && ABILITIES[resolvedAbilityId];
            const isAbilityReady = attacker.currentCd <= 0;
            const shouldUseAbility = hasAbility && isAbilityReady;

            let abilityToUse;

            if (shouldUseAbility) {
                abilityToUse = ABILITIES[resolvedAbilityId];
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

            const effect = shouldUseAbility ? abilityToUse.effect : null;

            // --- DOT tick: apply existing burn/poison on attacker before new action ---
            let attackerHpAfterDot = attacker.hp;
            if (attacker.dotDamage > 0 && attacker.dotTurns > 0) {
                const dotDmg = Math.max(1, Math.floor(attacker.dotDamage));
                attackerHpAfterDot = Math.max(0, attacker.hp - dotDmg);
                newLog.push(`🔥 ${attacker.name} takes ${dotDmg} DoT damage!`);
            }

            const effectiveDamage = Math.min(damage, defender.hp);
            setDamageDealt(prev => ({ ...prev, [attacker.id]: (prev[attacker.id] || 0) + effectiveDamage }));

            let newDefenderHp = Math.max(0, defender.hp - damage);
            let newAttackerHp = attackerHpAfterDot;

            // --- Effect handling ---
            let defenderStunTurns = defender.stunTurns || 0;
            let defenderDotDamage = defender.dotDamage || 0;
            let defenderDotTurns = defender.dotTurns || 0;
            let attackerHealAmount = 0;
            let revivedAllyIndex = -1;

            if (effect === 'STUN') {
                defenderStunTurns = (abilityToUse.effectDuration || 1);
                newLog.push(`😵 ${defender.name} is stunned for ${defenderStunTurns} turn(s)!`);
            } else if (effect === 'DOT') {
                const dotPerTurn = Math.max(1, Math.floor((attacker.maxHp || attacker.hp) * (abilityToUse.effectValue || 0.10)));
                defenderDotDamage = dotPerTurn;
                defenderDotTurns = (abilityToUse.effectDuration || 2);
                newLog.push(`🔥 ${defender.name} is burning! (${dotPerTurn}/turn for ${defenderDotTurns} turns)`);
            } else if (effect === 'HEAL') {
                attackerHealAmount = Math.floor((attacker.maxHp || attacker.hp) * (abilityToUse.effectValue || 0.15));
                newAttackerHp = Math.min(attacker.maxHp || attacker.hp, newAttackerHp + attackerHealAmount);
                newLog.push(`💚 ${attacker.name} heals for ${attackerHealAmount} HP!`);
            } else if (effect === 'REVIVE') {
                // Find first fainted ally on attacker's side
                const myTeamRef = who === 'PLAYER' ? myTeam : enemyTeam;
                const activeIdx = who === 'PLAYER' ? myIndex : enemyIndex;
                const faintedIdx = myTeamRef.findIndex((p, i) => i !== activeIdx && (p.hp <= 0 || p.currentHp <= 0));
                if (faintedIdx !== -1) {
                    revivedAllyIndex = faintedIdx;
                    const reviveHp = Math.floor((myTeamRef[faintedIdx].maxHp || 1) * (abilityToUse.effectValue || 0.25));
                    newLog.push(`✨ ${attacker.name} revives ${myTeamRef[faintedIdx].name} with ${reviveHp} HP!`);
                }
            }

            // --- HIT ANIMATION ---
            const targetSide = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';
            setHitUnit(targetSide);

            let floatCol = 'text-white';
            if (isCrit) floatCol = 'text-yellow-400';
            else if (effectiveness > 1) floatCol = 'text-red-400';
            else if (effectiveness < 1) floatCol = 'text-slate-400';
            else if (effect === 'HEAL') floatCol = 'text-green-400';
            else if (effect === 'REVIVE') floatCol = 'text-purple-400';
            else if (abilityToUse.type === 'SPECIAL' && !shouldUseAbility) floatCol = 'text-purple-300';

            const displayVal = isCrit ? (t ? t('battle_log_crit', { damage }) : `CRIT! ${damage}`) : `${damage}`;
            setFloatingDamage({ val: displayVal, col: floatCol, target: targetSide });

            await new Promise(r => setTimeout(r, Math.round(500 / speed)));

            // Reset Animations
            setAnimatingUnit(null);
            setHitUnit(null);
            setFloatingDamage(null);

            const nextCd = shouldUseAbility ? abilityToUse.cd : Math.max(0, attacker.currentCd - 1);
            const nextAttackerDotTurns = Math.max(0, (attacker.dotTurns || 0) - 1);

            const updatedAttacker = {
                ...attacker,
                currentCd: nextCd,
                hp: newAttackerHp,
                dotTurns: nextAttackerDotTurns,
                dotDamage: nextAttackerDotTurns > 0 ? (attacker.dotDamage || 0) : 0,
            };
            const updatedDefender = {
                ...defender,
                hp: newDefenderHp,
                stunTurns: defenderStunTurns,
                dotDamage: defenderDotDamage,
                dotTurns: defenderDotTurns,
            };

            let nextMyIndex = myIndex, nextEnemyIndex = enemyIndex, gameOver = false;

            // Standard Nächster Zug — skip enemy turn if stunned
            let nextTurn = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';
            if (defenderStunTurns > 0 && newDefenderHp > 0) {
                defenderStunTurns = defenderStunTurns - 1; // consume one stun turn
                nextTurn = who; // attacker gets another turn immediately
                newLog.push(`⚡ ${defender.name} is stunned — skipping their turn!`);
            }
            let nextRound = who === 'ENEMY' ? round + 1 : round;

            // --- DOPPEL-ANGRIFF LOGIK (SPEED) ---
            const hasDoubleSpeed = (attacker.speed || 0) >= (defender.speed || 0) * 2;
            const extraTurnTaken = battleStateRef.current.extraTurnTaken || false;
            let nextExtraTurnState = false;

            if (newDefenderHp > 0 && hasDoubleSpeed && !extraTurnTaken) {
                nextTurn = who; // Angreifer bleibt dran
                newLog.push(t ? t('battle_log_extra_turn', { attacker: attacker.name }) : `⚡ ${attacker.name} is so fast! Extra turn!`);
                nextExtraTurnState = true;
            }

            if (newDefenderHp === 0) {
                newLog.push(t ? t('battle_log_defeated', { defender: updatedDefender.name }) : `💀 ${updatedDefender.name} defeated!`);
                if (who === 'PLAYER') {
                    // Prefer next sequential enemy; fall back to any revived enemy at an earlier index
                    const nextAliveEnemyIdx = (() => {
                        for (let i = enemyIndex + 1; i < enemyTeam.length; i++) {
                            if ((enemyTeam[i].hp || 0) > 0) return i;
                        }
                        for (let i = 0; i < enemyIndex; i++) {
                            if ((enemyTeam[i].hp || 0) > 0) return i;
                        }
                        return -1;
                    })();
                    if (nextAliveEnemyIdx !== -1) {
                        nextEnemyIndex = nextAliveEnemyIdx;
                        nextTurn = 'ENEMY';
                        nextExtraTurnState = false;
                    } else {
                        gameOver = true;
                    }
                } else {
                    // Prefer next sequential player pet; fall back to any revived pet at an earlier index
                    const nextAliveMyIdx = (() => {
                        for (let i = myIndex + 1; i < myTeam.length; i++) {
                            if ((myTeam[i].hp || 0) > 0) return i;
                        }
                        for (let i = 0; i < myIndex; i++) {
                            if ((myTeam[i].hp || 0) > 0) return i;
                        }
                        return -1;
                    })();
                    if (nextAliveMyIdx !== -1) {
                        nextMyIndex = nextAliveMyIdx;
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

            // Apply REVIVE
            if (revivedAllyIndex !== -1) {
                const reviveTeam = who === 'PLAYER' ? newMyTeam : newEnemyTeam;
                const reviveHp = Math.floor((reviveTeam[revivedAllyIndex].maxHp || 1) * (abilityToUse.effectValue || 0.25));
                reviveTeam[revivedAllyIndex] = { ...reviveTeam[revivedAllyIndex], hp: reviveHp, currentHp: reviveHp };
            }

            setBattleState(prev => ({
                ...prev,
                myTeam: newMyTeam,
                enemyTeam: newEnemyTeam,
                myIndex: nextMyIndex,
                enemyIndex: nextEnemyIndex,
                log: newLog,
                turn: nextTurn,
                round: nextRound,
                isOver: gameOver,
                extraTurnTaken: nextExtraTurnState
            }));
        } finally {
            isExecutingRef.current = false;
        }
    }, [t, speed]); // stable: only changes when speed or locale changes, not on every battle render

    return {
        executeTurn,
        animatingUnit,
        hitUnit,
        floatingDamage,
        damageDealt
    };
}
