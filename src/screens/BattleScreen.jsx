import React, { useState, useEffect, useRef } from 'react';
import { Zap, Skull, Trophy, Swords, Shield, Activity, Wind, Timer, Coins, Star, ArrowUp, Repeat, XCircle, CheckCircle, Flame, Droplets, Leaf, Moon, Sun, Sparkles } from 'lucide-react';
import { ABILITIES, TYPES } from '../data/gameData';
import { calculateDamage } from '../utils/mechanics/battleLogic'; 
import PetAvatar from '../components/PetAvatar';

// --- STYLES & ANIMATIONS ---
const BattleStyles = () => (
    <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes dash-right { 0% { transform: translateX(0) scale(1); } 50% { transform: translateX(40px) scale(1.1); } 100% { transform: translateX(0) scale(1); } }
        @keyframes dash-left { 0% { transform: translateX(0) scale(1); } 50% { transform: translateX(-40px) scale(1.1); } 100% { transform: translateX(0) scale(1); } }
        @keyframes cast-pulse { 0% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.1); filter: brightness(1.5); } 100% { transform: scale(1); filter: brightness(1); } }
        @keyframes hit-shake { 0%, 100% { transform: translateX(0); filter: none; } 25% { transform: translateX(-5px) rotate(-5deg); filter: sepia(1) hue-rotate(-50deg) saturate(5); } 75% { transform: translateX(5px) rotate(5deg); filter: sepia(1) hue-rotate(-50deg) saturate(5); } }
        @keyframes particle-rise { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(-10vh) scale(1); opacity: 0; } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-dash-right { animation: dash-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-dash-left { animation: dash-left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-cast { animation: cast-pulse 0.5s ease-out; }
        .animate-hit { animation: hit-shake 0.4s ease-in-out; }
        .particle { position: absolute; border-radius: 50%; animation: particle-rise linear infinite; }
    `}</style>
);

// --- ARENA BACKGROUND ---
const ArenaBackground = ({ enemyType }) => {
    const getTheme = (type) => {
        switch(type) {
            case 'FIRE': case 'DRAGON': case 'CHAOS': return { bg: 'bg-gradient-to-b from-red-900 via-orange-950 to-slate-950', particle: 'bg-orange-500', icon: Flame };
            case 'WATER': case 'ICE': return { bg: 'bg-gradient-to-b from-blue-900 via-cyan-950 to-slate-950', particle: 'bg-cyan-400', icon: Droplets };
            case 'NATURE': case 'POISON': case 'EARTH': return { bg: 'bg-gradient-to-b from-emerald-900 via-green-950 to-slate-950', particle: 'bg-green-400', icon: Leaf };
            case 'DARK': case 'GHOST': case 'VOID': return { bg: 'bg-gradient-to-b from-slate-900 via-purple-950 to-black', particle: 'bg-purple-500', icon: Moon };
            case 'LIGHT': case 'ELECTRIC': case 'MAGIC': return { bg: 'bg-gradient-to-b from-indigo-900 via-violet-950 to-slate-950', particle: 'bg-yellow-300', icon: Sun };
            default: return { bg: 'bg-gradient-to-b from-slate-800 via-slate-900 to-black', particle: 'bg-white', icon: Sparkles };
        }
    };

    const theme = getTheme(enemyType);
    
    // Generiere statische Partikel für Performance
    const particles = React.useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 2}px`,
        duration: `${Math.random() * 10 + 5}s`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.1
    })), []);

    return (
        <div className={`absolute inset-0 ${theme.bg} overflow-hidden -z-10 transition-colors duration-1000`}>
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80"></div>
            
            {/* Particles */}
            {particles.map((p, i) => (
                <div 
                    key={i} 
                    className={`particle ${theme.particle}`}
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                        opacity: p.opacity
                    }}
                />
            ))}
            
            {/* Grid Floor Effect */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%),repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px),repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px)] perspective-[1000px] rotate-x-60 origin-bottom"></div>
        </div>
    );
};

// --- BATTLE UNIT ---
function BattleUnit({ pet, isEnemy, attackState, isHit, damageText }) {
  const hpPercent = (pet.hp / pet.maxHp) * 100;
  const typeInfo = TYPES[pet.type] || TYPES.FIRE;
  
  // Animation Classes
  let animClass = "animate-float"; // Default Idle
  if (attackState) {
      if (attackState.type === 'PHYSICAL') {
          animClass = isEnemy ? "animate-dash-left" : "animate-dash-right";
      } else {
          animClass = "animate-cast";
      }
  } else if (isHit) {
      animClass = "animate-hit";
  }

  const getHpColor = (pct) => { 
      if (pct > 50) return 'bg-gradient-to-r from-emerald-500 to-green-400'; 
      if (pct > 20) return 'bg-gradient-to-r from-yellow-500 to-orange-400'; 
      return 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse'; 
  };

  return (
   <div className={`flex flex-col ${isEnemy ? 'items-end' : 'items-start'} relative group w-full max-w-[220px] sm:max-w-[280px]`}>
      
      {/* AVATAR & EFFECTS CONTAINER */}
      <div className={`relative z-20 transition-all duration-300 mb-4 ${animClass}`}>
        
        {/* Damage Floating Text */}
        {damageText && (
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 z-[100] pointer-events-none animate-bounce whitespace-nowrap`}>
                <span className={`text-4xl font-black ${damageText.col} drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider`} style={{ textShadow: '0 0 10px rgba(0,0,0,0.5), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                    {damageText.val}
                </span>
            </div>
        )}

        {/* Aura / Glow */}
        <div className="relative">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 ${typeInfo.bg} opacity-20 blur-[40px] rounded-full transition-opacity duration-500 ${attackState?.type === 'SPECIAL' ? 'opacity-60 scale-125' : ''}`}></div>
            
            {/* The Pet */}
            <div className="drop-shadow-2xl filter transition-transform">
                <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                    <PetAvatar pet={pet} className="w-full h-full object-contain" />
                </div>
            </div>

            {/* Attack Projectile (Visual Only) */}
            {attackState?.type === 'SPECIAL' && (
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 ${isEnemy ? 'animate-dash-left' : 'animate-dash-right'}`}>
                    <div className={`w-12 h-12 rounded-full ${typeInfo.bg} blur-md opacity-80`}></div>
                </div>
            )}
        </div>

        {/* Cooldown Badge */}
        {pet.currentCd > 0 && (
            <div className="absolute -top-2 -right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-lg z-30">
                <Timer className="w-3 h-3 text-slate-400" />
                <span>{pet.currentCd}</span>
            </div>
        )}
      </div>

      {/* STATS CARD */}
      <div className={`relative w-full transition-all duration-500 bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl ${attackState ? 'ring-2 ring-white/30 scale-105 z-30' : 'opacity-95'}`}>
          
          {/* Name & Level */}
          <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col overflow-hidden">
                  <span className={`font-black text-sm truncate ${isEnemy ? 'text-red-200' : 'text-indigo-200'}`}>{pet.name}</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Lvl {pet.level}</span>
              </div>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border border-white/10 shadow-sm bg-gradient-to-br ${typeInfo.bg} from-black/40 to-transparent`}>
                  <div className="text-white scale-75">{typeInfo.icon}</div>
                  <span className="text-[9px] font-black text-white uppercase">{typeInfo.label}</span>
              </div>
          </div>

          {/* HP Bar */}
          <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden mb-1.5 shadow-inner border border-white/5">
              {/* Background Ghost Bar (Delayed) */}
              <div className="absolute top-0 left-0 h-full bg-white/20 w-full transition-all duration-1000 ease-out" style={{ width: `${hpPercent}%` }}></div>
              {/* Actual HP */}
              <div className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.3)] ${getHpColor(hpPercent)}`} style={{ width: `${hpPercent}%` }}></div>
          </div>
          
          <div className="flex justify-end mb-2">
              <span className="text-[9px] font-mono font-bold text-slate-400">{Math.ceil(pet.hp)} / {pet.maxHp} HP</span>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-5 gap-1">
              <StatBox icon={Swords} val={pet.atk} color="text-red-400" bg="bg-red-500/10" />
              <StatBox icon={Shield} val={pet.def} color="text-slate-400" bg="bg-slate-500/10" />
              <StatBox icon={Zap} val={pet.ap} color="text-purple-400" bg="bg-purple-500/10" />
              <StatBox icon={Activity} val={pet.res} color="text-pink-400" bg="bg-pink-500/10" />
              <StatBox icon={Wind} val={pet.speed} color="text-sky-400" bg="bg-sky-500/10" />
          </div>
      </div>
    </div>
  );
}

const StatBox = ({ icon: Icon, val, color, bg }) => (
    <div className={`flex flex-col items-center justify-center py-1 rounded-lg ${bg} border border-white/5`}>
        <Icon className={`w-2.5 h-2.5 ${color} mb-0.5`} />
        <span className="text-[8px] font-black text-slate-300 leading-none">{val}</span>
    </div>
);

const TeamDots = ({ team, currentIndex, isEnemy }) => (
  <div className={`flex gap-1.5 mb-4 ${isEnemy ? 'justify-end' : 'justify-start'}`}>
    {team.map((p, i) => (
        <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 border border-white/10 ${i === currentIndex ? (isEnemy ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-125' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-125') : (p.hp <= 0 ? 'bg-slate-800' : 'bg-slate-600')}`} />
    ))}
  </div>
);

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
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-950">
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