import React from 'react';
import { TreePine, Pickaxe, Fish, Star, Cpu, Sparkles, Swords, Lock, Leaf, Gem } from 'lucide-react';
import { RESOURCES } from '../../data/gameData';
import { playSound } from '../../utils/soundManager';

// Building positions [x%, y%] and visual config
const BUILDING_META = {
    wood: {
        x: 6,  y: 8,
        gradient: 'from-amber-900 to-amber-700',
        border: 'border-amber-600/40',
        glow: 'rgba(180,83,9,0.55)',
        Icon: TreePine,
        label: 'Sägewerk',
        animType: 'tree',
    },
    stone: {
        x: 41, y: 3,
        gradient: 'from-stone-800 to-stone-600',
        border: 'border-stone-500/40',
        glow: 'rgba(120,113,108,0.55)',
        Icon: Pickaxe,
        label: 'Steinbruch',
        animType: 'smoke',
    },
    seafood: {
        x: 75, y: 7,
        gradient: 'from-blue-900 to-blue-700',
        border: 'border-blue-500/40',
        glow: 'rgba(59,130,246,0.55)',
        Icon: Fish,
        label: 'Fischerei',
        animType: 'wave',
    },
    computer_parts: {
        x: 6,  y: 54,
        gradient: 'from-cyan-900 to-cyan-700',
        border: 'border-cyan-500/40',
        glow: 'rgba(6,182,212,0.55)',
        Icon: Cpu,
        label: 'Tech Fabrik',
        animType: 'pulse',
    },
    stardust: {
        x: 56, y: 48,
        gradient: 'from-purple-900 to-purple-700',
        border: 'border-purple-500/40',
        glow: 'rgba(147,51,234,0.55)',
        Icon: Star,
        label: 'Sternwarte',
        animType: 'star',
    },
    special: {
        x: 32, y: 65,
        gradient: 'from-pink-900 to-pink-700',
        border: 'border-pink-500/40',
        glow: 'rgba(236,72,153,0.55)',
        Icon: Sparkles,
        label: 'Alchemie',
        animType: 'sparkle',
    },
    training: {
        x: 74, y: 62,
        gradient: 'from-red-900 to-red-700',
        border: 'border-red-500/40',
        glow: 'rgba(220,38,38,0.55)',
        Icon: Swords,
        label: 'Training',
        animType: 'bounce',
    },
    herb_garden: {
        x: 15, y: 76,
        gradient: 'from-green-900 to-green-700',
        border: 'border-green-500/40',
        glow: 'rgba(34,197,94,0.55)',
        Icon: Leaf,
        label: 'Kräutergarten',
        animType: 'sparkle',
    },
    crystal_field: {
        x: 84, y: 30,
        gradient: 'from-violet-900 to-violet-700',
        border: 'border-violet-500/40',
        glow: 'rgba(139,92,246,0.55)',
        Icon: Gem,
        label: 'Kristallfeld',
        animType: 'star',
    },
};

// Decorative corner trees
const DECO_TREES = [
    { x: 1,  y: 1 },  { x: 91, y: 1 },  { x: 96, y: 12 },
    { x: 1,  y: 82 }, { x: 93, y: 80 }, { x: 48, y: 86 },
    { x: 26, y: 38 }, { x: 80, y: 36 },
];

function SmokeParticles() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible rounded-2xl">
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-slate-400/30"
                    style={{
                        bottom: '100%',
                        left: `${42 + i * 6}%`,
                        animation: `village-smoke ${1.8 + i * 0.4}s ease-out infinite`,
                        animationDelay: `${i * 0.55}s`,
                    }}
                />
            ))}
        </div>
    );
}

function TreeDecor({ active }) {
    return (
        <div className="absolute -top-3.5 left-0 right-0 flex justify-center gap-0.5 pointer-events-none">
            <TreePine
                className="w-4 h-4 text-green-500"
                style={{ animation: active ? 'village-sway 2.2s ease-in-out infinite' : 'none' }}
            />
            <TreePine
                className="w-3 h-3 text-green-700"
                style={{ animation: active ? 'village-sway 2.6s ease-in-out infinite 0.4s' : 'none' }}
            />
        </div>
    );
}

function SparkleDecor({ active }) {
    if (!active) return null;
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[0, 1, 2, 3].map(i => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-pink-300 rounded-full"
                    style={{
                        top:  `${15 + i * 20}%`,
                        left: `${8 + (i % 2) * 72}%`,
                        animation: `village-sparkle 1.4s ease-in-out infinite`,
                        animationDelay: `${i * 0.35}s`,
                    }}
                />
            ))}
        </div>
    );
}

function StarDecor({ active }) {
    if (!active) return null;
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-purple-200 rounded-full"
                    style={{
                        top:   `${8 + i * 28}%`,
                        right: `${6 + (i % 2) * 12}%`,
                        animation: `village-twinkle 1.8s ease-in-out infinite`,
                        animationDelay: `${i * 0.6}s`,
                    }}
                />
            ))}
        </div>
    );
}

function FullStorageGlitter() {
    return (
        <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-0"
            style={{
                background: 'radial-gradient(circle, rgba(255,215,0,0.28) 0%, transparent 70%)',
                animation: 'village-glitter 1.2s ease-in-out infinite',
            }}
        />
    );
}

function NPC({ index }) {
    const durations = [22, 28, 19, 25];
    const delays    = [0, -8, -14, -5];
    const tops      = [36, 50, 42, 30];
    const colors    = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'];
    return (
        <div
            className="absolute w-2.5 h-2.5 rounded-full border border-slate-900/60 z-10 pointer-events-none"
            style={{
                top:  `${tops[index % tops.length]}%`,
                animation: `village-npc-walk ${durations[index % durations.length]}s linear infinite`,
                animationDelay: `${delays[index % delays.length]}s`,
                background: colors[index % colors.length],
                boxShadow: `0 0 4px ${colors[index % colors.length]}88`,
            }}
        />
    );
}

function BuildingSprite({ resId, meta, level, workers, isUnlocked, isActive, rate, onSelect, unlockLevel }) {
    const Icon = meta.Icon;
    const workerCount = (workers || []).filter(Boolean).length;

    return (
        <button
            onClick={() => isUnlocked && onSelect(resId)}
            disabled={!isUnlocked}
            className={`
                absolute flex flex-col items-center justify-center rounded-2xl border transition-transform duration-200
                bg-gradient-to-br ${meta.gradient} ${meta.border}
                ${isUnlocked
                    ? 'hover:scale-110 active:scale-95 hover:z-20 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed grayscale'
                }
                overflow-visible
            `}
            style={{
                left:   `${meta.x}%`,
                top:    `${meta.y}%`,
                width:  '17%',
                aspectRatio: '1/1',
                boxShadow: isUnlocked && isActive
                    ? `0 0 14px 3px ${meta.glow}, 0 4px 12px rgba(0,0,0,0.5)`
                    : '0 4px 12px rgba(0,0,0,0.4)',
            }}
            aria-label={meta.label}
        >
            {/* Full storage glow */}

            {/* Building-type decorations */}
            {resId === 'wood' && <TreeDecor active={isUnlocked && isActive} />}
            {resId === 'stone' && isUnlocked && isActive && <SmokeParticles />}
            {resId === 'special' && <SparkleDecor active={isUnlocked && isActive} />}
            {resId === 'stardust' && <StarDecor active={isUnlocked && isActive} />}

            {/* Icon + label */}
            <div className="relative z-10 flex flex-col items-center gap-0.5 px-0.5">
                {isUnlocked ? (
                    <Icon
                        className="w-5 h-5 text-white drop-shadow"
                        style={
                            resId === 'training' && isActive
                                ? { animation: 'village-bounce 0.9s ease-in-out infinite' }
                                : resId === 'computer_parts' && isActive
                                    ? { animation: 'village-pulse 1.6s ease-in-out infinite' }
                                    : resId === 'seafood' && isActive
                                        ? { animation: 'village-wave 2s ease-in-out infinite' }
                                        : undefined
                        }
                    />
                ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-[7px] font-black text-white/80 leading-tight text-center leading-none" style={{ fontSize: '6px' }}>
                    {meta.label}
                </span>
            </div>

            {/* Level badge */}
            {isUnlocked && (
                <div className="absolute -bottom-1.5 -right-1.5 bg-slate-900 border border-white/10 text-white font-black rounded-full w-5 h-5 flex items-center justify-center z-20"
                    style={{ fontSize: '8px' }}>
                    {level}
                </div>
            )}

            {/* Worker dots */}
            {isUnlocked && workerCount > 0 && (
                <div className="absolute -top-1.5 left-0 right-0 flex justify-center gap-0.5 z-20">
                    {Array.from({ length: Math.min(workerCount, 5) }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-green-400 rounded-full border border-slate-900" />
                    ))}
                </div>
            )}

            {/* Rate badge (when active) */}
            {isUnlocked && isActive && rate > 0 && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
                    <span className="text-green-300 bg-slate-900/80 px-1 rounded font-bold"
                        style={{ fontSize: '7px' }}>
                        +{rate}/h
                    </span>
                </div>
            )}

            {/* Lock level */}
            {!isUnlocked && unlockLevel && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                    <span className="text-red-400 font-bold" style={{ fontSize: '6px' }}>
                        Lvl {unlockLevel}
                    </span>
                </div>
            )}
        </button>
    );
}

export default function VillageMap({ user, productionRates, isActive, onSelectResource, setShowTraining, t }) {
    return (
        <div
            className="relative w-full select-none rounded-2xl overflow-visible"
            style={{ aspectRatio: '16/11' }}
        >
            {/* Map background */}
            <div
                className="absolute inset-0 rounded-2xl overflow-hidden border border-white/5"
                style={{
                    background: `
                        radial-gradient(ellipse at 50% 100%, rgba(12,20,8,0.95) 0%, transparent 70%),
                        linear-gradient(155deg, #0e1f09 0%, #0c1c18 45%, #091420 100%)
                    `,
                }}
            >
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(100,180,60,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(100,180,60,0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: '36px 36px',
                    }}
                />

                {/* Dirt path — horizontal */}
                <div
                    className="absolute left-0 right-0"
                    style={{
                        top: '43%', height: '14%',
                        background: 'linear-gradient(90deg, transparent 3%, rgba(90,65,35,0.22) 18%, rgba(110,82,45,0.28) 50%, rgba(90,65,35,0.22) 82%, transparent 97%)',
                    }}
                />

                {/* Dirt path — vertical */}
                <div
                    className="absolute top-0 bottom-0"
                    style={{
                        left: '44%', width: '12%',
                        background: 'linear-gradient(rgba(90,65,35,0.2) 2%, rgba(110,82,45,0.25) 50%, rgba(90,65,35,0.2) 98%)',
                    }}
                />

                {/* Decorative trees */}
                {DECO_TREES.map((pos, i) => (
                    <div
                        key={i}
                        className="absolute text-green-900 pointer-events-none"
                        style={{
                            left: `${pos.x}%`,
                            top:  `${pos.y}%`,
                            fontSize: '9px',
                            lineHeight: 1,
                            animation: `village-sway ${2 + (i % 3) * 0.6}s ease-in-out infinite`,
                            animationDelay: `${(i * 0.45) % 2.2}s`,
                            opacity: 0.35,
                        }}
                    >
                        🌲
                    </div>
                ))}

                {/* Village well */}
                <div
                    className="absolute flex flex-col items-center pointer-events-none"
                    style={{ left: '42%', top: '32%' }}
                >
                    <div className="w-4 h-4 rounded-full border border-stone-700/40 bg-slate-800/50 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600/40" />
                    </div>
                    <span className="text-slate-700 font-bold mt-0.5" style={{ fontSize: '6px' }}>Brunnen</span>
                </div>
            </div>

            {/* NPC villagers (only when production active) */}
            {isActive && [0, 1, 2].map(i => <NPC key={i} index={i} />)}

            {/* Buildings */}
            {Object.keys(BUILDING_META).map(resId => {
                const res = RESOURCES[resId.toUpperCase()];
                if (!res) return null;

                const level       = user.village.buildings?.[resId] || 1;
                const workers     = user.village.workers?.[resId] || [];
                const isUnlocked  = user.level >= res.unlockLevel;
                const rate        = productionRates
                    ? Math.floor(productionRates(resId, level, workers) * 3600)
                    : 0;

                return (
                    <BuildingSprite
                        key={resId}
                        resId={resId}
                        meta={BUILDING_META[resId]}
                        level={level}
                        workers={workers}
                        isUnlocked={isUnlocked}
                        isActive={isActive}
                        rate={rate}
                        unlockLevel={res.unlockLevel}
                        onSelect={id => {
                            playSound('click');
                            if (id === 'training') setShowTraining(true);
                            else onSelectResource(id);
                        }}
                    />
                );
            })}
        </div>
    );
}
