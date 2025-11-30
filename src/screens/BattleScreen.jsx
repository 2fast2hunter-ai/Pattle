import React, { useState, useEffect } from 'react';
import { Zap, Skull, Trophy } from 'lucide-react';
import { ABILITIES, TYPES, ZODIAC_ANIMALS } from '../data/gameData';
import { getDamageMultiplier } from '../utils/gameMechanics';

// Sub-Komponenten für den Battle Screen
const TeamDots = ({ team, currentIndex, isEnemy }) => (
  <div className={`flex gap-1 mb-2 ${isEnemy ? 'justify-end' : 'justify-start'}`}>
    {team.map((p, i) => (
      <div key={i} className={`w-2 h-2 rounded-full ${i < currentIndex ? 'bg-slate-700' : i === currentIndex ? (isEnemy ? 'bg-red-500' : 'bg-indigo-500') : 'bg-slate-500'}`} />
    ))}
  </div>
);

function BattleUnit({ pet, isEnemy, isActive, animating }) {
  const typeInfo = TYPES[pet.type];
  const secTypeInfo = pet.secondaryType ? TYPES[pet.secondaryType] : null;
  const hpPercent = (pet.hp / pet.maxHp) * 100;
  return (
    <div className={`flex flex-col ${isEnemy ? 'items-end' : 'items-start'}`}>
      <div className={`w-24 h-24 ${typeInfo.bg} rounded-2xl flex items-center justify-center text-4xl shadow-2xl relative z-10 border-4 ${isActive ? 'border-white scale-110' : 'border-transparent'} transition-all duration-300 ${animating && isActive ? (isEnemy ? '-translate-x-8' : 'translate-x-8') : ''}`}>
        {ZODIAC_ANIMALS[pet.species].icon}
        {secTypeInfo && (<div className={`absolute top-0 right-0 w-8 h-8 ${secTypeInfo.bg} rounded-full border-2 border-slate-900 flex items-center justify-center text-xs shadow-md -mr-2 -mt-2`}>{secTypeInfo.icon}</div>)}
        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-1"><Zap className={`w-3 h-3 ${pet.currentCd > 0 ? 'text-slate-500' : 'text-yellow-400'}`} />{pet.currentCd > 0 ? pet.currentCd : 'RDY'}</div>
      </div>
      <div className={`bg-slate-800 p-2 rounded-lg border border-white/10 w-48 mt-2 shadow-lg transition-all ${isActive ? 'scale-105' : 'opacity-80'}`}>
          <div className="flex justify-between items-center mb-1">
              <span className={`font-bold text-xs ${isEnemy ? 'text-red-300' : 'text-indigo-300'}`}>{pet.name}</span>
              <div className="flex gap-1">
                  <span className="text-[8px] font-bold text-slate-400 mr-1">{ZODIAC_ANIMALS[pet.species].label}</span>
                  <div className={`text-[8px] font-bold ${TYPES[pet.type].color}`}>{TYPES[pet.type].label}</div>
                  {pet.secondaryType && <div className={`text-[8px] font-bold ${TYPES[pet.secondaryType].color}`}>/{TYPES[pet.secondaryType].label}</div>}
              </div>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1"><div className={`h-full transition-all duration-300 ${hpPercent < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${hpPercent}%` }}></div></div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono"><span>{pet.hp}/{pet.maxHp} HP</span><span>ATK {pet.atk}</span></div>
      </div>
    </div>
  );
}

export default function BattleScreen({ battleState, setBattleState, onWin, onLose }) {
  const [animating, setAnimating] = useState(false);
  const { myTeam, enemyTeam, myIndex, enemyIndex, turn, log, isOver, round } = battleState;
  const myPet = myTeam[myIndex];
  const enemyPet = enemyTeam[enemyIndex];

  useEffect(() => {
    if (isOver) return;
    const timer = setTimeout(() => {
      if (animating) return;
      if (turn === 'PLAYER') executeTurn(myPet, enemyPet, 'PLAYER');
      else executeTurn(enemyPet, myPet, 'ENEMY');
    }, 1000);
    return () => clearTimeout(timer);
  }, [turn, isOver, animating, myPet, enemyPet]);

  const executeTurn = (attacker, defender, who) => {
    setAnimating(true);
    let newLog = [...log];
    let damage = 0;
    let isAbility = false;
    let isCrit = false;

    const ability = ABILITIES[attacker.abilityId];
    let attackElementType = attacker.type; 
    if (attacker.currentCd <= 0) {
       isAbility = true;
       if (ability.type !== 'HEAL') attackElementType = ability.element;
    }

    const effectiveness = getDamageMultiplier(attackElementType, defender.type, defender.secondaryType);
    let effText = "";
    if (effectiveness >= 4.0) effText = " (x4!)";
    else if (effectiveness >= 2.0) effText = " (x2)";
    else if (effectiveness <= 0.25) effText = " (x0.25)";
    else if (effectiveness <= 0.5) effText = " (x0.5)";

    if (isAbility) {
      const rawDmg = ability.type === 'PHYSICAL' ? attacker.atk : attacker.ap;
      const defense = ability.type === 'PHYSICAL' ? defender.def : defender.res;
      const mitigation = 100 / (100 + defense);
      damage = Math.floor(rawDmg * ability.dmgScale * mitigation * effectiveness);
      newLog.push(`Runde ${round}: ${attacker.name} wirkt ${ability.name}!`);
    } else {
      const mitigation = 100 / (100 + defender.def);
      damage = Math.floor(attacker.atk * mitigation * effectiveness);
      newLog.push(`Runde ${round}: ${attacker.name} greift an.`);
    }

    const roll = Math.random() * 100;
    if (roll < attacker.critRate) {
      isCrit = true;
      damage = Math.floor(damage * (attacker.critDmg / 100));
    }

    damage = Math.max(1, damage);
    const newHp = Math.max(0, defender.hp - damage);
    newLog.push(`> ${damage} Schaden${isCrit ? ' (KRIT!)' : ''}${effText}`);

    const updatedAttacker = { ...attacker, currentCd: isAbility ? ability.cd : Math.max(0, attacker.currentCd - 1) };
    const updatedDefender = { ...defender, hp: newHp };

    let nextMyIndex = myIndex;
    let nextEnemyIndex = enemyIndex;
    let gameOver = false;
    let nextTurn = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';
    let nextRound = who === 'ENEMY' ? round + 1 : round;

    if (newHp === 0) {
        newLog.push(`${updatedDefender.name} wurde besiegt!`);
        if (who === 'PLAYER') {
            if (enemyIndex + 1 < enemyTeam.length) { nextEnemyIndex++; newLog.push(`Gegner schickt ${enemyTeam[nextEnemyIndex].name} in den Kampf!`); } 
            else { gameOver = true; }
        } else {
            if (myIndex + 1 < myTeam.length) { nextMyIndex++; newLog.push(`Du schickst ${myTeam[nextMyIndex].name} in den Kampf!`); } 
            else { gameOver = true; }
        }
    }

    const newMyTeam = [...myTeam];
    const newEnemyTeam = [...enemyTeam];
    if (who === 'PLAYER') { newMyTeam[myIndex] = updatedAttacker; newEnemyTeam[enemyIndex] = updatedDefender; } 
    else { newEnemyTeam[enemyIndex] = updatedAttacker; newMyTeam[myIndex] = updatedDefender; }

    setBattleState(prev => ({ ...prev, myTeam: newMyTeam, enemyTeam: newEnemyTeam, myIndex: nextMyIndex, enemyIndex: nextEnemyIndex, log: newLog, turn: nextTurn, round: nextRound, isOver: gameOver }));
    setTimeout(() => setAnimating(false), 500);
  };

  if (isOver) {
    const won = enemyTeam[enemyTeam.length - 1].hp === 0;
    const myTeamIds = myTeam.map(p => p.id);
    return (
        <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${won ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>{won ? <Trophy className="w-16 h-16" /> : <Skull className="w-16 h-16" />}</div>
          <h2 className="text-4xl font-black uppercase mb-2">{won ? 'SIEG!' : 'NIEDERLAGE'}</h2>
          <div className="bg-slate-800 p-4 rounded-xl mb-8 w-64 border border-white/5"><div className="flex justify-between mb-2 pb-2 border-b border-white/5"><span className="text-slate-400">Spieler XP</span><span className="text-green-400 font-bold">{won ? '+50 XP' : '+5 XP'}</span></div><div className="flex justify-between mb-2"><span className="text-slate-400">Münzen</span><span className="text-yellow-400 font-bold">{won ? '+50' : '+0'}</span></div><p className="text-xs text-slate-500 mt-2">Team XP verteilt!</p></div>
          <button onClick={() => won ? onWin({coins: 50, xp: 50}, myTeamIds) : onLose()} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-white/10">Zurück zur Basis</button>
        </div>
      );
  }

  return (
    <div className="h-full flex flex-col pt-4 relative">
      <div className="absolute top-2 left-0 w-full text-center z-10 opacity-50 text-[10px] font-bold uppercase tracking-widest">Runde {round}</div>
      <div className="flex flex-col items-end pr-4 pt-4"><TeamDots team={enemyTeam} currentIndex={enemyIndex} isEnemy={true} /><BattleUnit pet={enemyPet} isEnemy={true} isActive={turn === 'ENEMY'} animating={animating} /></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"><span className="bg-black/80 backdrop-blur px-3 py-1 rounded-full font-black italic text-2xl border border-white/20 shadow-2xl">VS</span></div>
      <div className="flex flex-col items-start pl-4 mt-auto mb-4"><BattleUnit pet={myPet} isEnemy={false} isActive={turn === 'PLAYER'} animating={animating} /><TeamDots team={myTeam} currentIndex={myIndex} isEnemy={false} /></div>
      <div className="bg-slate-900 border-t border-white/10 h-1/3 flex flex-col relative"><div className="absolute top-0 left-0 w-full h-0.5 bg-slate-800"><div className={`h-full ${turn === 'PLAYER' ? 'bg-indigo-500' : 'bg-red-500'} transition-all duration-[1000ms] ease-linear w-full origin-left animate-pulse`}></div></div><div className="flex-1 overflow-y-auto text-xs text-slate-300 space-y-1 font-mono p-4 flex flex-col-reverse">{[...log].reverse().map((entry, i) => (<div key={i} className={`py-1 border-b border-white/5 last:border-0 ${i === 0 ? 'text-white font-bold' : 'opacity-60'}`}>{entry}</div>))}</div></div>
    </div>
  );
}