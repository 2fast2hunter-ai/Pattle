import React, { useState, useEffect, useRef } from 'react';
import { Skull, Trophy, Coins, Star, Repeat, XCircle, CheckCircle } from 'lucide-react';
import { ABILITIES, TYPES } from '../data/gameData';
import { calculateDamage } from '../utils/mechanics/battleLogic'; 
import { BattleStyles } from '../components/battle/BattleStyles';
import ArenaBackground from '../components/battle/ArenaBackground';
import BattleUnit from '../components/battle/BattleUnit';
import TeamDots from '../components/battle/TeamDots';

export default function BattleScreen({ battleState, setBattleState, onWin, onLose, isAutoBattle, autoBattleRemaining, onCancelAutoBattle }) {
  const [animatingUnit, setAnimatingUnit] = useState(null); // { side: 'PLAYER'|'ENEMY', type: 'PHYSICAL'|'SPECIAL' }
  const [hitUnit, setHitUnit] = useState(null); 
  const [floatingDamage, setFloatingDamage] = useState(null); 
  const [autoProgress, setAutoProgress] = useState(0);
  const [damageDealt, setDamageDealt] = useState({});
  const logEndRef = useRef(null);
  
  const { myTeam, enemyTeam, myIndex, enemyIndex, turn, log, isOver, round, isFriendly } = battleState; 
  const myPet = myTeam[myIndex];
  const enemyPet = enemyTeam[enemyIndex];

  useEffect(() => { if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [log]);

  // Turn Execution Logic
  useEffect(() => {
    if (isOver) return;
    const timer = setTimeout(() => {
      if (animatingUnit || hitUnit) return; 
      if (turn === 'PLAYER') executeTurn(myPet, enemyPet, 'PLAYER');
      else executeTurn(enemyPet, myPet, 'ENEMY');
    }, 800);
    return () => clearTimeout(timer);
  }, [turn, isOver, animatingUnit, hitUnit, myPet, enemyPet]);

  // Auto Battle Logic
  useEffect(() => {
      if (isOver && isAutoBattle && autoBattleRemaining > 1) {
          const won = enemyTeam[enemyTeam.length - 1].hp === 0;
          const myTeamIds = myTeam.map(p => p.id);
          const rewardCoins = won ? 50 : 5;
          const rewardXp = won ? 50 : 5;
          const duration = 3000; // Schnellerer Auto-Battle (3s statt 10s)
          const step = 50;
          let elapsed = 0;
          const interval = setInterval(() => {
              elapsed += step;
              const pct = Math.min(100, (elapsed / duration) * 100);
              setAutoProgress(pct);
              if (elapsed >= duration) {
                   clearInterval(interval);
                   if (won) onWin({coins: rewardCoins, xp: rewardXp}, myTeamIds, null, damageDealt);
                   else onLose();
              }
          }, step);
          return () => clearInterval(interval);
      } else { setAutoProgress(0); }
  }, [isOver, isAutoBattle, autoBattleRemaining]); 

  const executeTurn = async (attacker, defender, who) => {
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
            name: useMagicAuto ? 'Magischer Stoß' : 'Angriff',
            type: useMagicAuto ? 'SPECIAL' : 'PHYSICAL',
            element: attacker.type,
            dmgScale: 1.0,
            cd: 0
        };
    }

    // --- ANIMATION START ---
    setAnimatingUnit({ side: who, type: abilityToUse.type });
    if (shouldUseAbility) newLog.push(`${attacker.name} nutzt ${abilityToUse.name}!`);
    else newLog.push(`${attacker.name} greift an.`);

    // Warte auf Angriffs-Animation
    await new Promise(r => setTimeout(r, 400));

    // 2. Schaden berechnen
    const { damage, isCrit, effectiveness } = calculateDamage(attacker, defender, abilityToUse);
    
    if (effectiveness > 1) newLog.push("⚡ Sehr effektiv!");
    else if (effectiveness < 1) newLog.push("🛡️ Nicht sehr effektiv...");

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

    const displayVal = isCrit ? `KRIT! ${damage}` : `${damage}`;
    setFloatingDamage({ val: displayVal, col: floatCol, target: targetSide });
    
    // Warte auf Hit-Animation
    await new Promise(r => setTimeout(r, 500));
    
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

    if (newHp > 0 && hasDoubleSpeed && !extraTurnTaken) {
        nextTurn = who; // Angreifer bleibt dran
        newLog.push(`⚡ ${attacker.name} ist so schnell! Extra Angriff!`);
        var nextExtraTurnState = true; 
    } else {
        var nextExtraTurnState = false;
    }

    if (newHp === 0) {
        newLog.push(`💀 ${updatedDefender.name} besiegt!`);
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

  // --- RENDER ---
  if (isOver) {
    const won = enemyTeam[enemyTeam.length - 1].hp === 0;
    const myTeamIds = myTeam.map(p => p.id);
    const rewardCoins = !isFriendly && won ? 150 : (!isFriendly ? 5 : 0);
    const rewardXp = !isFriendly && won ? 200 : (!isFriendly ? 20 : 0);
    const isLastAuto = isAutoBattle && autoBattleRemaining === 1;

    return (
        <div className="h-full flex flex-col relative overflow-hidden animate-in zoom-in duration-500 z-50 bg-slate-900">
          <BattleStyles />
          <ArenaBackground enemyType={won ? 'LIGHT' : 'DARK'} />
          
          <div className="relative z-10 flex flex-col h-full p-6 items-center justify-center">
              {isAutoBattle && (<div className={`absolute top-4 right-4 backdrop-blur px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-2 shadow-lg z-50 ${isLastAuto ? 'bg-green-600/90 border-green-400/30 text-white' : 'bg-purple-600/90 border-purple-400/30 text-white animate-pulse'}`}>{isLastAuto ? <CheckCircle className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}{isLastAuto ? 'Fertig' : `Auto: Noch ${autoBattleRemaining}`}</div>)}
              
              <div className="flex flex-col items-center mb-8">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-[0_0_60px_rgba(0,0,0,0.6)] border-4 border-white/20 ${won ? 'bg-gradient-to-br from-yellow-400 to-amber-600 animate-bounce' : 'bg-gradient-to-br from-red-500 to-red-900'}`}>
                      {won ? <Trophy className="w-12 h-12 text-white drop-shadow-md" /> : <Skull className="w-12 h-12 text-white drop-shadow-md" />}
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 drop-shadow-2xl">
                      {won ? 'SIEG!' : 'NIEDERLAGE'}
                  </h2>
              </div>

              {isAutoBattle && !isLastAuto && (
                  <div className="w-full max-w-xs mx-auto mb-8">
                      <div className="flex justify-between text-[10px] text-purple-300 font-bold mb-1 uppercase"><span>Nächster Kampf</span><span>{(3 - (autoProgress / 33.3)).toFixed(1)}s</span></div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-purple-500/30"><div className="h-full bg-purple-500 transition-all duration-100 ease-linear" style={{ width: `${autoProgress}%` }}></div></div>
                  </div>
              )}

              {!isFriendly ? (
                  <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 mb-8 flex justify-around items-center shadow-2xl w-full max-w-sm">
                      <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">XP</span>
                          <div className="flex items-center gap-2 text-green-400"><Star className="w-6 h-6 fill-current" /><span className="font-black text-2xl">+{rewardXp}</span></div>
                      </div>
                      <div className="w-px h-12 bg-white/10"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Münzen</span>
                          <div className="flex items-center gap-2 text-yellow-400"><Coins className="w-6 h-6 fill-current" /><span className="font-black text-2xl">+{rewardCoins}</span></div>
                      </div>
                  </div>
              ) : (
                  <div className="bg-blue-900/40 backdrop-blur-md p-4 rounded-2xl border border-blue-500/30 mb-8 text-center w-full max-w-sm">
                      <p className="text-blue-200 font-black text-sm">FREUNDSCHAFTSKAMPF</p>
                      <p className="text-blue-300/70 text-xs">Keine Belohnungen erhalten</p>
                  </div>
              )}

              <div className="flex flex-col gap-3 w-full max-w-sm">
                  <button onClick={() => won ? onWin({coins: rewardCoins, xp: rewardXp}, myTeamIds, null, damageDealt) : onLose()} className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl flex justify-center items-center gap-2 transition-all ${isAutoBattle && !isLastAuto ? 'bg-purple-600 text-white animate-pulse' : (isLastAuto ? 'bg-green-600 text-white hover:scale-[1.02]' : 'bg-white text-slate-950 hover:scale-[1.02] active:scale-95')}`}>
                      {isLastAuto ? <><CheckCircle className="w-5 h-5" /> ABSCHLIESSEN</> : isAutoBattle ? <><Repeat className="w-5 h-5" /> WEITER ({autoBattleRemaining})</> : (isFriendly ? "ZURÜCK" : "WEITER")}
                  </button>
                  {isAutoBattle && !isLastAuto && (<button onClick={onCancelAutoBattle} className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"><XCircle className="w-4 h-4" /> AUTO-KAMPF ABBRECHEN</button>)}
              </div>
          </div>
        </div>
      );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <BattleStyles />
      <ArenaBackground enemyType={enemyPet?.type} />

      {isAutoBattle && (<div className="absolute top-14 right-4 z-20 bg-purple-600/80 backdrop-blur px-3 py-1 rounded-full border border-purple-400/30 text-[10px] font-bold text-white flex items-center gap-1 shadow-lg"><Repeat className="w-3 h-3 animate-spin-slow" />Auto: {autoBattleRemaining}</div>)}
      
      {/* ROUND INDICATOR */}
      <div className="absolute top-4 left-0 w-full flex justify-center z-10">
          <div className="bg-black/60 backdrop-blur-md px-6 py-1.5 rounded-full border border-white/10 shadow-lg">
              <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Runde {round}</span>
          </div>
      </div>

      {/* BATTLE AREA */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10 p-4 md:items-center md:justify-center">
          {/* VS WATERMARK */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none mix-blend-overlay">
              <span className="text-[12rem] font-black italic text-white">VS</span>
          </div>

          {/* ENEMY SIDE */}
          <div className="flex-1 flex flex-col items-end justify-center pr-2 pt-12 relative md:pt-0 md:order-2">
              <TeamDots team={enemyTeam} currentIndex={enemyIndex} isEnemy={true} />
              <BattleUnit 
                  pet={enemyPet} 
                  isEnemy={true} 
                  attackState={animatingUnit?.side === 'ENEMY' ? animatingUnit : null} 
                  isHit={hitUnit === 'ENEMY'} 
                  damageText={hitUnit === 'ENEMY' ? floatingDamage : null} 
              />
          </div>

          {/* PLAYER SIDE */}
          <div className="flex-1 flex flex-col items-start justify-center pl-2 mt-[-40px] md:mt-0 md:order-1">
              <BattleUnit 
                  pet={myPet} 
                  isEnemy={false} 
                  attackState={animatingUnit?.side === 'PLAYER' ? animatingUnit : null} 
                  isHit={hitUnit === 'PLAYER'} 
                  damageText={hitUnit === 'PLAYER' ? floatingDamage : null} 
              />
              <div className="mt-4">
                  <TeamDots team={myTeam} currentIndex={myIndex} isEnemy={false} />
              </div>
          </div>
      </div>

      {/* LOG AREA */}
      <div className="h-32 sm:h-36 relative shrink-0 z-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px] sm:text-xs scrollbar-hide h-full">
              {[...log].reverse().map((entry, i) => {
                  const isCrit = entry.includes('KRIT');
                  const isDeath = entry.includes('besiegt');
                  const isEffective = entry.includes('effektiv');
                  return (
                    <div key={i} className={`flex items-center gap-2 ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className={`${i === 0 ? 'text-white font-bold' : 'text-slate-400'} ${isDeath ? 'text-red-400 !opacity-100' : ''} ${isCrit ? 'text-yellow-400 !opacity-100' : ''} ${isEffective ? 'text-cyan-300' : ''}`}>
                            {entry}
                        </span>
                    </div>
                  );
              })}
              <div ref={logEndRef} />
          </div>
      </div>
    </div>
  );
}