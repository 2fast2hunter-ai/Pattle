import React, { useState, useEffect } from 'react';
import { Zap, Skull, Trophy, Swords, Shield, Activity, Wind } from 'lucide-react';
import { ABILITIES, TYPES } from '../data/gameData';
import { getDamageMultiplier } from '../utils/gameMechanics';
import PetAvatar from '../components/PetAvatar';

// Hilfskomponente: Schwebender Schadenstext
const FloatingText = ({ text, color }) => (
  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 z-50 text-3xl font-black ${color} drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-bounce`}>
    {text}
  </div>
);

// Hilfskomponente: Team Punkte
const TeamDots = ({ team, currentIndex, isEnemy }) => (
  <div className={`flex gap-1 mb-2 ${isEnemy ? 'justify-end' : 'justify-start'}`}>
    {team.map((p, i) => (
      <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-500 ${i < currentIndex ? 'bg-slate-700' : i === currentIndex ? (isEnemy ? 'bg-red-500' : 'bg-indigo-500') : 'bg-slate-500'}`} />
    ))}
  </div>
);

function BattleUnit({ pet, isEnemy, isActive, isHit, damageText }) {
  const hpPercent = (pet.hp / pet.maxHp) * 100;
  
  // ANIMATIONEN:
  // 1. Angriff: Nach vorne stürmen (Translate X)
  const attackAnim = isActive ? (isEnemy ? '-translate-x-24 scale-110' : 'translate-x-24 scale-110') : '';
  
  // 2. Treffer: Rot aufleuchten und leicht zurückweichen
  const hitAnim = isHit ? (isEnemy ? 'translate-x-4 brightness-50 sepia hue-rotate-[-50deg] saturate-200' : '-translate-x-4 brightness-50 sepia hue-rotate-[-50deg] saturate-200') : '';

  return (
   <div className={`flex flex-col ${isEnemy ? 'items-end' : 'items-start'} relative`}>
      
      {/* Avatar Bereich mit Animationen */}
      <div className={`relative z-10 transition-transform duration-200 ease-out ${attackAnim} ${isHit ? 'duration-100' : ''}`}>
        
        {/* Schwebender Text erscheint hier */}
        {damageText && <FloatingText text={damageText.val} color={damageText.col} />}

        <div className={`transition-all duration-100 ${hitAnim}`}>
            <PetAvatar pet={pet} className="w-28 h-28" />
        </div>
        
        {/* Cooldown Anzeige */}
        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-1 z-20 shadow-lg">
            <Zap className={`w-3 h-3 ${pet.currentCd > 0 ? 'text-slate-500' : 'text-yellow-400'}`} />
            {pet.currentCd > 0 ? pet.currentCd : 'RDY'}
        </div>
      </div>

      {/* Info Box */}
      <div className={`bg-slate-800 p-3 rounded-xl border border-white/10 w-56 mt-4 shadow-xl transition-all duration-300 ${isActive ? 'scale-105 ring-2 ring-white/20' : 'opacity-90'}`}>
          <div className="flex justify-between items-center mb-2">
              <div className="flex items-baseline gap-2 overflow-hidden">
                  <span className={`font-black text-sm truncate ${isEnemy ? 'text-red-300' : 'text-indigo-300'}`}>
                      {pet.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                      Lvl {pet.level}
                  </span>
              </div>
              <div className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${TYPES[pet.type].bg} text-white flex-shrink-0 ml-1`}>
                  {TYPES[pet.type].label}
              </div>
          </div>

          {/* HP Bar mit Animation */}
          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden mb-1 border border-white/5">
              <div className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${hpPercent < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${hpPercent}%` }}></div>
          </div>
          <div className="text-[9px] text-slate-400 text-right mb-2 font-mono">{pet.hp} / {pet.maxHp} HP</div>

          <div className="grid grid-cols-3 gap-y-1 gap-x-2 text-[9px] font-bold text-slate-300 bg-black/20 p-2 rounded-lg">
              <div className="flex items-center gap-1"><Swords className="w-3 h-3 text-red-400"/> {pet.atk}</div>
              <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-purple-400"/> {pet.ap}</div>
              <div className="flex items-center gap-1"><Wind className="w-3 h-3 text-sky-400"/> {pet.speed}</div>
              <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-slate-400"/> {pet.def}</div>
              <div className="flex items-center gap-1"><Activity className="w-3 h-3 text-pink-400"/> {pet.res}</div>
          </div>
      </div>
    </div>
  );
}

export default function BattleScreen({ battleState, setBattleState, onWin, onLose }) {
  // Visuelle States für Animationen
  const [animatingUnit, setAnimatingUnit] = useState(null); // 'PLAYER' oder 'ENEMY'
  const [hitUnit, setHitUnit] = useState(null); // 'PLAYER' oder 'ENEMY'
  const [floatingDamage, setFloatingDamage] = useState(null); // { val: "-10", col: "text-red-500", target: "ENEMY" }

  const { myTeam, enemyTeam, myIndex, enemyIndex, turn, log, isOver, round } = battleState;
  const myPet = myTeam[myIndex];
  const enemyPet = enemyTeam[enemyIndex];

  useEffect(() => {
    if (isOver) return;
    const timer = setTimeout(() => {
      // Warten, bis keine Animation mehr läuft
      if (animatingUnit || hitUnit) return; 
      
      if (turn === 'PLAYER') executeTurn(myPet, enemyPet, 'PLAYER');
      else executeTurn(enemyPet, myPet, 'ENEMY');
    }, 1000);
    return () => clearTimeout(timer);
  }, [turn, isOver, animatingUnit, hitUnit, myPet, enemyPet]);

  const executeTurn = async (attacker, defender, who) => {
    // 1. Angriffs-Animation Starten
    setAnimatingUnit(who);
    
    // Berechnung
    let newLog = [...log];
    let damage = 0;
    let isAbility = (attacker.currentCd <= 0);
    let isCrit = false;
    
    const ability = ABILITIES[attacker.abilityId];
    let attackElementType = isAbility && ability.type !== 'HEAL' ? ability.element : attacker.type;

    const effectiveness = getDamageMultiplier(attackElementType, defender.type, defender.secondaryType);
    let effText = effectiveness >= 2 ? " (x2)" : (effectiveness <= 0.5 ? " (x0.5)" : "");

    if (isAbility) {
      const rawDmg = ability.type === 'PHYSICAL' ? attacker.atk : attacker.ap;
      const defense = ability.type === 'PHYSICAL' ? defender.def : defender.res;
      damage = Math.floor(rawDmg * ability.dmgScale * (100 / (100 + defense)) * effectiveness);
      newLog.push(`Runde ${round}: ${attacker.name} wirkt ${ability.name}!`);
    } else {
      damage = Math.floor(attacker.atk * (100 / (100 + defender.def)) * effectiveness);
      newLog.push(`Runde ${round}: ${attacker.name} greift an.`);
    }

    if (Math.random() * 100 < attacker.critRate) { 
        isCrit = true;
        damage = Math.floor(damage * 1.5); 
        effText += " (KRIT!)"; 
    }
    damage = Math.max(1, damage);
    const newHp = Math.max(0, defender.hp - damage);
    newLog.push(`> ${damage} Schaden${effText}`);

    // Kurze Pause für den "Impact"
    await new Promise(r => setTimeout(r, 250));

    // 2. Treffer-Animation & Schaden anzeigen
    const targetSide = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';
    setHitUnit(targetSide);
    setFloatingDamage({ 
        val: isCrit ? `KRIT! -${damage}` : `-${damage}`, 
        col: isCrit ? 'text-yellow-400' : 'text-white', 
        target: targetSide 
    });

    // Warten, damit der Spieler den Schaden sieht
    await new Promise(r => setTimeout(r, 600));

    // 3. Reset Animationen
    setAnimatingUnit(null);
    setHitUnit(null);
    setFloatingDamage(null);

    // 4. State Update (HP abziehen, Runde beenden)
    const updatedAttacker = { ...attacker, currentCd: isAbility ? ability.cd : Math.max(0, attacker.currentCd - 1) };
    const updatedDefender = { ...defender, hp: newHp };

    let nextMyIndex = myIndex, nextEnemyIndex = enemyIndex, gameOver = false, nextTurn = who === 'PLAYER' ? 'ENEMY' : 'PLAYER', nextRound = who === 'ENEMY' ? round + 1 : round;

    if (newHp === 0) {
        newLog.push(`${updatedDefender.name} besiegt!`);
        if (who === 'PLAYER') { if (enemyIndex + 1 < enemyTeam.length) nextEnemyIndex++; else gameOver = true; } 
        else { if (myIndex + 1 < myTeam.length) nextMyIndex++; else gameOver = true; }
    }

    const newMyTeam = [...myTeam]; const newEnemyTeam = [...enemyTeam];
    if (who === 'PLAYER') { newMyTeam[myIndex] = updatedAttacker; newEnemyTeam[enemyIndex] = updatedDefender; } 
    else { newEnemyTeam[enemyIndex] = updatedAttacker; newMyTeam[myIndex] = updatedDefender; }

    setBattleState({ ...battleState, myTeam: newMyTeam, enemyTeam: newEnemyTeam, myIndex: nextMyIndex, enemyIndex: nextEnemyIndex, log: newLog, turn: nextTurn, round: nextRound, isOver: gameOver });
  };

  if (isOver) {
    const won = enemyTeam[enemyTeam.length - 1].hp === 0;
    const myTeamIds = myTeam.map(p => p.id);
    return (
        <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${won ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>{won ? <Trophy className="w-16 h-16 drop-shadow-lg" /> : <Skull className="w-16 h-16 drop-shadow-lg" />}</div>
          <h2 className="text-5xl font-black uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{won ? 'SIEG!' : 'NIEDERLAGE'}</h2>
          <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl mb-8 w-72 border border-white/10 shadow-2xl">
              <div className="flex justify-between mb-3 pb-3 border-b border-white/5">
                  <span className="text-slate-400 font-bold uppercase text-xs">Spieler XP</span>
                  <span className="text-green-400 font-black text-lg">{won ? '+50' : '+5'}</span>
              </div>
              <div className="flex justify-between mb-3">
                  <span className="text-slate-400 font-bold uppercase text-xs">Münzen</span>
                  <span className="text-yellow-400 font-black text-lg">{won ? '+50' : '+0'}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-wider bg-black/20 py-1 rounded">Team wurde geheilt</div>
          </div>
          <button onClick={() => won ? onWin({coins: 50, xp: 50}, myTeamIds) : onLose()} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl hover:shadow-white/20 active:scale-95">WEITER</button>
        </div>
      );
  }

  return (
    <div className="h-full flex flex-col pt-4 relative">
      <div className="absolute top-2 left-0 w-full text-center z-10 opacity-30 text-[10px] font-black uppercase tracking-[0.3em]">Runde {round}</div>
      
      {/* GEGNER */}
      <div className="flex flex-col items-end pr-4 pt-4">
          <TeamDots team={enemyTeam} currentIndex={enemyIndex} isEnemy={true} />
          <BattleUnit 
            pet={enemyPet} 
            isEnemy={true} 
            isActive={turn === 'ENEMY' && animatingUnit === 'ENEMY'} 
            isHit={hitUnit === 'ENEMY'}
            damageText={hitUnit === 'ENEMY' ? floatingDamage : null}
          />
      </div>

      {/* VS Badge */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 scale-150 pointer-events-none">
          <span className="font-black italic text-9xl">VS</span>
      </div>

      {/* SPIELER */}
      <div className="flex flex-col items-start pl-4 mt-auto mb-4">
          <BattleUnit 
            pet={myPet} 
            isEnemy={false} 
            isActive={turn === 'PLAYER' && animatingUnit === 'PLAYER'} 
            isHit={hitUnit === 'PLAYER'}
            damageText={hitUnit === 'PLAYER' ? floatingDamage : null}
          />
          <TeamDots team={myTeam} currentIndex={myIndex} isEnemy={false} />
      </div>

      {/* Battle Log */}
      <div className="bg-slate-900/90 backdrop-blur border-t border-white/10 h-1/3 flex flex-col relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-slate-800">
              <div className={`h-full ${turn === 'PLAYER' ? 'bg-indigo-500' : 'bg-red-500'} transition-all duration-[1000ms] ease-linear w-full origin-left`}></div>
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-slate-300 space-y-2 font-mono p-4 flex flex-col-reverse">
              {[...log].reverse().map((entry, i) => (
                  <div key={i} className={`py-1 border-b border-white/5 last:border-0 ${i === 0 ? 'text-white font-bold text-sm' : 'opacity-50'}`}>
                      {entry}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}