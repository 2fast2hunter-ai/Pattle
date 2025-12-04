import React, { useState, useEffect, useRef } from 'react';
import { Zap, Skull, Trophy, Swords, Shield, Activity, Wind, Timer, Coins, Star, ArrowUp } from 'lucide-react';
import { ABILITIES, TYPES } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

// --- HILFSKOMPONENTEN ---

const FloatingText = ({ text, color }) => (
  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 z-[100] pointer-events-none animate-bounce`}>
      <span className={`text-2xl sm:text-3xl font-black ${color} drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider`} 
            style={{ WebkitTextStroke: '1px rgba(0,0,0,0.5)' }}>
        {text}
      </span>
  </div>
);

const TeamDots = ({ team, currentIndex, isEnemy }) => (
  <div className={`flex gap-1.5 mb-2 ${isEnemy ? 'justify-end' : 'justify-start'}`}>
    {team.map((p, i) => {
        const isActive = i === currentIndex;
        const isDead = p.hp <= 0;
        return (
            <div key={i} className={`
                w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-500 border border-white/10
                ${isActive 
                    ? (isEnemy ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-125' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] scale-125') 
                    : (isDead ? 'bg-slate-800' : 'bg-slate-600')
                }
            `} />
        );
    })}
  </div>
);

function BattleUnit({ pet, isEnemy, isActive, isHit, damageText }) {
  const hpPercent = (pet.hp / pet.maxHp) * 100;
  const typeInfo = TYPES[pet.type] || TYPES.FIRE;
  
  const attackAnim = isActive ? (isEnemy ? '-translate-x-8 sm:-translate-x-12 scale-105 rotate-[-2deg]' : 'translate-x-8 sm:translate-x-12 scale-105 rotate-[2deg]') : '';
  const hitAnim = isHit ? (isEnemy ? 'translate-x-2 sm:translate-x-4 brightness-150' : '-translate-x-2 sm:-translate-x-4 brightness-150') : '';
  
  const getHpColor = (pct) => {
      if (pct > 50) return 'bg-gradient-to-r from-emerald-500 to-green-400';
      if (pct > 20) return 'bg-gradient-to-r from-yellow-500 to-orange-400';
      return 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse';
  };

  return (
   <div className={`flex flex-col ${isEnemy ? 'items-end' : 'items-start'} relative group w-full max-w-[220px] sm:max-w-[280px]`}>
      
      <div className={`relative z-20 transition-all duration-300 ease-out ${attackAnim} ${hitAnim} mb-2`}>
        {damageText && <FloatingText text={damageText.val} color={damageText.col} />}
        <div className="relative">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 ${typeInfo.bg} opacity-30 blur-[30px] sm:blur-[40px] rounded-full`}></div>
            <div className="drop-shadow-xl filter transition-transform">
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                    <PetAvatar pet={pet} className="w-full h-full" />
                </div>
            </div>
        </div>
        {pet.currentCd > 0 && (
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-black/70 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1 shadow-lg">
                <Timer className="w-3 h-3 text-slate-400" />
                <span>{pet.currentCd}</span>
            </div>
        )}
      </div>

      <div className={`
          relative w-full transition-all duration-500
          bg-slate-900/70 backdrop-blur-md border border-white/10 p-2 sm:p-2.5 rounded-xl shadow-xl
          ${isActive ? 'ring-1 ring-white/30 z-30' : 'opacity-95'}
      `}>
          <div className="flex justify-between items-center mb-1.5">
              <div className="flex flex-col overflow-hidden">
                  <span className={`font-black text-xs sm:text-sm truncate ${isEnemy ? 'text-red-200' : 'text-indigo-200'}`}>
                      {pet.name}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      Lvl {pet.level}
                  </span>
              </div>
              <div className={`
                  flex items-center gap-1 px-1 py-0.5 rounded-md border border-white/5 shadow-sm
                  bg-gradient-to-br ${typeInfo.bg} from-black/40 to-transparent
              `}>
                  <div className="text-white">{React.cloneElement(typeInfo.icon, { size: 10 })}</div>
                  <span className="text-[7px] sm:text-[8px] font-black text-white uppercase">{typeInfo.label}</span>
              </div>
          </div>
          <div className="relative w-full h-2.5 sm:h-3 bg-slate-950 rounded-full overflow-hidden mb-1 shadow-inner border border-white/5">
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out shadow-[0_0_5px_rgba(255,255,255,0.2)] ${getHpColor(hpPercent)}`} 
                style={{ width: `${hpPercent}%` }}
              ></div>
          </div>
          <div className="flex justify-end mb-1">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-slate-500">{pet.hp}/{pet.maxHp}</span>
          </div>
          <div className="grid grid-cols-5 gap-0.5">
              <StatBox icon={Swords} val={pet.atk} color="text-red-400" bg="bg-red-500/5" />
              <StatBox icon={Shield} val={pet.def} color="text-slate-400" bg="bg-slate-500/5" />
              <StatBox icon={Zap} val={pet.ap} color="text-purple-400" bg="bg-purple-500/5" />
              <StatBox icon={Activity} val={pet.res} color="text-pink-400" bg="bg-pink-500/5" />
              <StatBox icon={Wind} val={pet.speed} color="text-sky-400" bg="bg-sky-500/5" />
          </div>
      </div>
    </div>
  );
}

const StatBox = ({ icon: Icon, val, color, bg }) => (
    <div className={`flex flex-col items-center justify-center py-0.5 sm:py-1 rounded ${bg} border border-white/5`}>
        <Icon className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${color} mb-0.5`} />
        <span className="text-[7px] sm:text-[8px] font-black text-slate-300 leading-none">{val}</span>
    </div>
);

export default function BattleScreen({ battleState, setBattleState, onWin, onLose }) {
  const [animatingUnit, setAnimatingUnit] = useState(null); 
  const [hitUnit, setHitUnit] = useState(null); 
  const [floatingDamage, setFloatingDamage] = useState(null); 
  
  const logEndRef = useRef(null);
  const { myTeam, enemyTeam, myIndex, enemyIndex, turn, log, isOver, round } = battleState;
  const myPet = myTeam[myIndex];
  const enemyPet = enemyTeam[enemyIndex];

  useEffect(() => {
    if (logEndRef.current) {
        logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [log]);

  useEffect(() => {
    if (isOver) return;
    const timer = setTimeout(() => {
      if (animatingUnit || hitUnit) return; 
      if (turn === 'PLAYER') executeTurn(myPet, enemyPet, 'PLAYER');
      else executeTurn(enemyPet, myPet, 'ENEMY');
    }, 800); // Etwas schnellerer Loop (vorher 1200)
    return () => clearTimeout(timer);
  }, [turn, isOver, animatingUnit, hitUnit, myPet, enemyPet]);

  const executeTurn = async (attacker, defender, who) => {
    setAnimatingUnit(who);
    let newLog = [...log];
    let damage = 0;
    let isAbility = (attacker.currentCd <= 0);
    let isCrit = false;
    const ability = ABILITIES[attacker.abilityId];
    const safeAbility = ability || { name: 'Angriff', type: 'PHYSICAL', element: attacker.type, dmgScale: 1.0, cd: 0 };
    
    if (isAbility) newLog.push(`${attacker.name} nutzt ${safeAbility.name}!`);
    else newLog.push(`${attacker.name} greift an.`);

    let rawDmg = isAbility 
        ? (safeAbility.type === 'PHYSICAL' ? attacker.atk : attacker.ap) * (safeAbility.dmgScale || 1) 
        : attacker.atk;
    let defense = isAbility 
        ? (safeAbility.type === 'PHYSICAL' ? defender.def : defender.res)
        : defender.def;

    damage = Math.floor(rawDmg * (100 / (100 + defense)));
    if (Math.random() * 100 < attacker.critRate) { 
        isCrit = true;
        damage = Math.floor(damage * 1.5); 
    }
    damage = Math.max(1, damage);
    const newHp = Math.max(0, defender.hp - damage);
    
    await new Promise(r => setTimeout(r, 200)); // Kürzerer Impact (vorher 300)

    const targetSide = who === 'PLAYER' ? 'ENEMY' : 'PLAYER';
    setHitUnit(targetSide);
    setFloatingDamage({ 
        val: isCrit ? `KRIT! ${damage}` : `${damage}`, 
        col: isCrit ? 'text-yellow-400' : 'text-white', 
        target: targetSide 
    });
    await new Promise(r => setTimeout(r, 500)); // Kürzeres Lesen (vorher 800)

    setAnimatingUnit(null);
    setHitUnit(null);
    setFloatingDamage(null);

    const updatedAttacker = { ...attacker, currentCd: isAbility ? safeAbility.cd : Math.max(0, attacker.currentCd - 1) };
    const updatedDefender = { ...defender, hp: newHp };
    let nextMyIndex = myIndex, nextEnemyIndex = enemyIndex, gameOver = false, nextTurn = who === 'PLAYER' ? 'ENEMY' : 'PLAYER', nextRound = who === 'ENEMY' ? round + 1 : round;

    if (newHp === 0) {
        newLog.push(`💀 ${updatedDefender.name} besiegt!`);
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
    const rewardCoins = won ? 50 : 5;
    const rewardXp = won ? 50 : 5;
    const petXpGain = won ? 50 : 10;

    return (
        <div className="h-full flex flex-col relative overflow-hidden animate-in zoom-in duration-500 z-50 bg-slate-900">
          <div className={`absolute inset-0 ${won ? 'bg-yellow-500/5' : 'bg-red-500/5'}`}></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/0 via-slate-950 to-black"></div>

          <div className="relative z-10 flex flex-col h-full p-6">
              <div className="flex flex-col items-center mb-6 mt-4">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 shadow-[0_0_40px_rgba(0,0,0,0.5)] border-4 border-white/10 ${won ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : 'bg-gradient-to-br from-red-500 to-red-800'}`}>
                      {won ? <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" /> : <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />}
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-lg">
                      {won ? 'SIEG!' : 'NIEDERLAGE'}
                  </h2>
              </div>
              
              <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 mb-6 flex justify-around items-center shadow-lg">
                  <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Spieler XP</span>
                      <div className="flex items-center gap-1.5 text-green-400">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-black text-xl">+{rewardXp}</span>
                      </div>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Münzen</span>
                      <div className="flex items-center gap-1.5 text-yellow-400">
                          <Coins className="w-5 h-5 fill-current" />
                          <span className="font-black text-xl">+{rewardCoins}</span>
                      </div>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide mb-6">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 pl-1">Team Fortschritt</h3>
                  <div className="space-y-2">
                      {myTeam.map((pet) => {
                          const currentPercent = (pet.xp / pet.maxXp) * 100;
                          const gainPercent = (petXpGain / pet.maxXp) * 100;
                          return (
                              <div key={pet.id} className="bg-slate-800/40 border border-white/5 p-2 sm:p-3 rounded-xl flex items-center gap-3 sm:gap-4">
                                  <div className="relative shrink-0">
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                          <PetAvatar pet={pet} className="w-full h-full drop-shadow-md" />
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 bg-slate-900 text-[8px] sm:text-[9px] font-bold px-1.5 rounded border border-white/10 text-white">Lvl {pet.level}</div>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-end mb-1.5">
                                          <span className="font-bold text-xs sm:text-sm text-slate-200 truncate">{pet.name}</span>
                                          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-green-400 flex items-center gap-0.5 shrink-0">
                                              <ArrowUp className="w-2.5 h-2.5" /> {petXpGain} XP
                                          </span>
                                      </div>
                                      <div className="w-full h-2 sm:h-2.5 bg-slate-950 rounded-full overflow-hidden relative border border-white/5">
                                          <div className="absolute top-0 left-0 h-full bg-indigo-900" style={{width: `${currentPercent}%`}}></div>
                                          <div className="absolute top-0 h-full bg-indigo-500 animate-pulse" style={{left: `${currentPercent}%`, width: `${Math.min(100 - currentPercent, gainPercent)}%`}}></div>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
              
              <button 
                onClick={() => won ? onWin({coins: rewardCoins, xp: rewardXp}, myTeamIds) : onLose()} 
                className="w-full py-4 rounded-2xl bg-white text-slate-950 font-black text-lg shadow-lg hover:scale-[1.02] transition-transform active:scale-95 flex justify-center items-center gap-2"
              >
                  WEITER
              </button>
          </div>
        </div>
      );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-950">
      
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-900/20 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      </div>

      <div className="absolute top-2 left-0 w-full flex justify-center z-10">
          <div className="bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border border-white/5">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Runde {round}</span>
          </div>
      </div>
      
      <div className="flex-1 flex flex-col relative z-10 p-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
              <span className="text-[10rem] sm:text-[12rem] font-black italic">VS</span>
          </div>

          <div className="flex-1 flex flex-col items-end justify-center pr-2 pt-16 sm:pt-24 relative">
              <TeamDots team={enemyTeam} currentIndex={enemyIndex} isEnemy={true} />
              <BattleUnit 
                pet={enemyPet} 
                isEnemy={true} 
                isActive={turn === 'ENEMY' && animatingUnit === 'ENEMY'} 
                isHit={hitUnit === 'ENEMY'}
                damageText={hitUnit === 'ENEMY' ? floatingDamage : null}
              />
          </div>

          <div className="flex-1 flex flex-col items-start justify-center pl-2 mt-[-20px]"> 
              <BattleUnit 
                pet={myPet} 
                isEnemy={false} 
                isActive={turn === 'PLAYER' && animatingUnit === 'PLAYER'} 
                isHit={hitUnit === 'PLAYER'}
                damageText={hitUnit === 'PLAYER' ? floatingDamage : null}
              />
              <div className="mt-2">
                <TeamDots team={myTeam} currentIndex={myIndex} isEnemy={false} />
              </div>
          </div>
      </div>

      <div className="h-28 sm:h-32 relative shrink-0 z-20 border-t border-white/5 bg-slate-950/90 backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[9px] sm:text-[10px] scrollbar-hide h-full">
              {[...log].reverse().map((entry, i) => {
                  const isCrit = entry.includes('KRIT');
                  const isDeath = entry.includes('besiegt');
                  return (
                    <div key={i} className={`
                        ${i === 0 ? 'opacity-100 text-white font-bold' : 'opacity-50 text-slate-400'}
                        ${isDeath ? 'text-red-400 !opacity-100' : ''}
                        ${isCrit ? 'text-yellow-400 !opacity-100' : ''}
                    `}>
                        {entry}
                    </div>
                  );
              })}
              <div ref={logEndRef} />
          </div>
      </div>
    </div>
  );
}