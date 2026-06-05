import React, { useState, useEffect, useMemo } from 'react';

function FireBackground({ lowPower }) {
    const embers = useMemo(() => Array.from({ length: lowPower ? 8 : 20 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 6 + 3}px`,
        duration: `${Math.random() * 3 + 2}s`,
        delay: `${Math.random() * 4}s`,
        color: ['bg-orange-400', 'bg-red-400', 'bg-yellow-400'][i % 3],
    })), [lowPower]);

    return (
        <>
            {/* Flickering gradient overlay */}
            <div className="absolute inset-0 animate-fire-flicker pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(251,113,32,0.35) 0%, transparent 70%)' }} />
            {/* Rising embers */}
            {!lowPower && embers.map((e, i) => (
                <div key={i} className={`absolute rounded-full ${e.color} animate-ember shadow-[0_0_6px_orange]`}
                    style={{ left: e.left, bottom: 0, width: e.size, height: e.size, animationDuration: e.duration, animationDelay: e.delay, opacity: 0.8 }} />
            ))}
            {/* Lava cracks at bottom */}
            <svg className="absolute bottom-0 w-full h-24 pointer-events-none" viewBox="0 0 400 96" preserveAspectRatio="none">
                <path d="M0,96 L0,60 Q40,40 80,55 Q120,70 160,50 Q200,30 240,48 Q280,66 320,52 Q360,38 400,56 L400,96 Z"
                    fill="rgba(180,30,0,0.4)" />
                <path d="M0,96 L0,72 Q50,58 100,68 Q150,78 200,65 Q250,52 300,62 Q350,72 400,68 L400,96 Z"
                    fill="rgba(220,80,0,0.25)" />
            </svg>
        </>
    );
}

function WaterBackground({ lowPower }) {
    const bubbles = useMemo(() => Array.from({ length: lowPower ? 6 : 18 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 10 + 4}px`,
        duration: `${Math.random() * 4 + 3}s`,
        delay: `${Math.random() * 5}s`,
    })), [lowPower]);

    return (
        <>
            {/* Animated wave layers */}
            <div className="absolute bottom-0 left-0 w-[200%] h-16 pointer-events-none overflow-hidden animate-water-wave"
                style={{ background: 'repeating-linear-gradient(90deg, rgba(34,211,238,0.18) 0px, rgba(34,211,238,0.08) 40px, rgba(34,211,238,0.18) 80px)' }} />
            <div className="absolute bottom-4 left-0 w-[200%] h-12 pointer-events-none overflow-hidden animate-water-wave"
                style={{ background: 'repeating-linear-gradient(90deg, rgba(96,165,250,0.15) 0px, transparent 30px, rgba(96,165,250,0.15) 60px)', animationDuration: '12s', animationDirection: 'reverse' }} />
            {/* Ripple orbs */}
            {bubbles.map((b, i) => (
                <div key={i} className="absolute rounded-full border border-cyan-400/40 animate-water-ripple"
                    style={{ left: b.left, top: `${30 + Math.random() * 50}%`, width: b.size, height: b.size, animationDuration: b.duration, animationDelay: b.delay }} />
            ))}
        </>
    );
}

function IceBackground({ lowPower }) {
    const shards = useMemo(() => Array.from({ length: lowPower ? 5 : 14 }).map((_, i) => ({
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 80}%`,
        rotate: Math.random() * 360,
        size: Math.random() * 30 + 15,
        delay: `${Math.random() * 3}s`,
    })), [lowPower]);

    return (
        <>
            {/* Frost overlay */}
            <div className="absolute inset-0 pointer-events-none animate-ice-shimmer"
                style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(186,230,253,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(147,197,253,0.12) 0%, transparent 50%)' }} />
            {/* Ice shards */}
            {shards.map((s, i) => (
                <svg key={i} className="absolute pointer-events-none animate-ice-shimmer"
                    style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, opacity: 0.35 }}
                    viewBox="0 0 40 40">
                    <polygon points="20,2 38,38 2,38" fill="none" stroke="rgba(186,230,253,0.8)" strokeWidth="1.5"
                        transform={`rotate(${s.rotate}, 20, 20)`} />
                </svg>
            ))}
        </>
    );
}

function NatureBackground({ lowPower }) {
    const blades = useMemo(() => Array.from({ length: lowPower ? 8 : 24 }).map((_, i) => ({
        left: `${(i / (lowPower ? 8 : 24)) * 100 + Math.random() * 3}%`,
        height: `${Math.random() * 40 + 20}px`,
        delay: `${Math.random() * 2}s`,
        color: ['bg-emerald-500', 'bg-green-400', 'bg-emerald-400'][i % 3],
    })), [lowPower]);
    const leaves = useMemo(() => Array.from({ length: lowPower ? 4 : 12 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 5 + 6}s`,
        delay: `${Math.random() * 6}s`,
        size: `${Math.random() * 8 + 6}px`,
    })), [lowPower]);

    return (
        <>
            {/* Swaying grass blades */}
            <div className="absolute bottom-0 left-0 w-full flex items-end pointer-events-none" style={{ height: '60px' }}>
                {blades.map((b, i) => (
                    <div key={i} className={`absolute bottom-0 w-1.5 rounded-t-full ${b.color}/70 animate-grass-sway`}
                        style={{ left: b.left, height: b.height, animationDelay: b.delay, animationDuration: `${2 + Math.random()}s` }} />
                ))}
            </div>
            {/* Drifting leaves */}
            {leaves.map((l, i) => (
                <div key={i} className="absolute animate-leaf pointer-events-none"
                    style={{ left: l.left, top: 0, width: l.size, height: l.size, animationDuration: l.duration, animationDelay: l.delay }}>
                    <svg viewBox="0 0 20 20" className="w-full h-full">
                        <ellipse cx="10" cy="10" rx="8" ry="5" fill="rgba(52,211,153,0.6)" transform="rotate(-30,10,10)" />
                    </svg>
                </div>
            ))}
        </>
    );
}

function DarkBackground({ lowPower }) {
    const orbs = useMemo(() => Array.from({ length: lowPower ? 4 : 10 }).map((_, i) => ({
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 80}%`,
        size: `${Math.random() * 60 + 30}px`,
        delay: `${Math.random() * 4}s`,
        duration: `${Math.random() * 3 + 3}s`,
    })), [lowPower]);
    const swirls = useMemo(() => Array.from({ length: lowPower ? 2 : 5 }).map((_, i) => ({
        left: `${Math.random() * 80}%`,
        top: `${Math.random() * 80}%`,
        size: `${Math.random() * 80 + 40}px`,
        delay: `${Math.random() * 8}s`,
    })), [lowPower]);

    return (
        <>
            {orbs.map((o, i) => (
                <div key={i} className="absolute rounded-full animate-dark-pulse pointer-events-none"
                    style={{ left: o.left, top: o.top, width: o.size, height: o.size,
                        background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
                        animationDelay: o.delay, animationDuration: o.duration }} />
            ))}
            {!lowPower && swirls.map((s, i) => (
                <div key={i} className="absolute rounded-full border border-purple-500/20 animate-void-swirl pointer-events-none"
                    style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }} />
            ))}
        </>
    );
}

function ElectricBackground({ lowPower }) {
    const sparks = useMemo(() => Array.from({ length: lowPower ? 5 : 16 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        bottom: `${Math.random() * 40}%`,
        size: `${Math.random() * 4 + 2}px`,
        delay: `${Math.random() * 3}s`,
        duration: `${Math.random() * 2 + 1}s`,
    })), [lowPower]);

    return (
        <>
            {/* Lightning bolt overlay */}
            {!lowPower && (
                <div className="absolute inset-0 pointer-events-none animate-lightning"
                    style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(253,224,71,0.15) 50%, transparent 60%)' }} />
            )}
            {/* Electric sparks */}
            {sparks.map((s, i) => (
                <div key={i} className="absolute rounded-full bg-yellow-300 shadow-[0_0_8px_yellow] animate-spark pointer-events-none"
                    style={{ left: s.left, bottom: s.bottom, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }} />
            ))}
            {/* Static haze */}
            <div className="absolute inset-0 pointer-events-none animate-bg-breathe"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(253,224,71,0.07) 0%, transparent 65%)' }} />
        </>
    );
}

function TechBackground({ lowPower }) {
    const scanlines = useMemo(() => Array.from({ length: lowPower ? 2 : 4 }).map((_, i) => ({
        delay: `${i * 1.2}s`,
        duration: `${3 + i * 0.5}s`,
        color: i % 2 === 0 ? 'rgba(96,165,250,0.12)' : 'rgba(52,211,153,0.08)',
    })), [lowPower]);

    return (
        <>
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(96,165,250,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Scan lines */}
            {scanlines.map((s, i) => (
                <div key={i} className="absolute left-0 w-full h-8 pointer-events-none animate-tech-scan"
                    style={{ background: `linear-gradient(to bottom, transparent, ${s.color}, transparent)`, animationDelay: s.delay, animationDuration: s.duration }} />
            ))}
        </>
    );
}

function MagicBackground({ lowPower }) {
    const orbs = useMemo(() => Array.from({ length: lowPower ? 4 : 12 }).map((_, i) => ({
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 80}%`,
        size: `${Math.random() * 12 + 5}px`,
        delay: `${Math.random() * 4}s`,
        duration: `${Math.random() * 3 + 4}s`,
        color: ['bg-yellow-300', 'bg-indigo-300', 'bg-pink-300', 'bg-white'][i % 4],
    })), [lowPower]);

    return (
        <>
            {orbs.map((o, i) => (
                <div key={i} className={`absolute rounded-full ${o.color} animate-magic-orb pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.5)]`}
                    style={{ left: o.left, top: o.top, width: o.size, height: o.size, animationDelay: o.delay, animationDuration: o.duration, opacity: 0.6 }} />
            ))}
            <div className="absolute inset-0 pointer-events-none animate-bg-breathe"
                style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(199,210,254,0.12) 0%, transparent 60%)' }} />
        </>
    );
}

const THEMES = {
    FIRE:    { bg: 'from-orange-900 via-red-950 to-black',   ground: 'from-red-950 to-black',    landscape: 'MOUNTAIN' },
    DRAGON:  { bg: 'from-orange-900 via-red-950 to-black',   ground: 'from-red-950 to-black',    landscape: 'MOUNTAIN' },
    CHAOS:   { bg: 'from-orange-900 via-red-950 to-black',   ground: 'from-red-950 to-black',    landscape: 'MOUNTAIN' },
    WATER:   { bg: 'from-cyan-900 via-blue-950 to-black',    ground: 'from-blue-950 to-black',   landscape: 'WAVES' },
    ICE:     { bg: 'from-cyan-900 via-blue-950 to-black',    ground: 'from-blue-950 to-black',   landscape: 'WAVES' },
    NATURE:  { bg: 'from-emerald-900 via-green-950 to-black', ground: 'from-green-950 to-black', landscape: 'FOREST' },
    POISON:  { bg: 'from-emerald-900 via-green-950 to-black', ground: 'from-green-950 to-black', landscape: 'FOREST' },
    EARTH:   { bg: 'from-emerald-900 via-green-950 to-black', ground: 'from-green-950 to-black', landscape: 'FOREST' },
    DARK:    { bg: 'from-purple-900 via-slate-950 to-black',  ground: 'from-slate-950 to-black', landscape: 'CAVE' },
    GHOST:   { bg: 'from-purple-900 via-slate-950 to-black',  ground: 'from-slate-950 to-black', landscape: 'CAVE' },
    VOID:    { bg: 'from-purple-900 via-slate-950 to-black',  ground: 'from-slate-950 to-black', landscape: 'CAVE' },
    LIGHT:   { bg: 'from-yellow-900/40 via-indigo-950 to-black', ground: 'from-indigo-950 to-black', landscape: 'CITY' },
    ELECTRIC:{ bg: 'from-yellow-900/40 via-indigo-950 to-black', ground: 'from-indigo-950 to-black', landscape: 'CITY' },
    MAGIC:   { bg: 'from-yellow-900/40 via-indigo-950 to-black', ground: 'from-indigo-950 to-black', landscape: 'CITY' },
    TECH:    { bg: 'from-slate-800 via-blue-950 to-black',    ground: 'from-slate-900 to-black',  landscape: 'CITY' },
    METAL:   { bg: 'from-slate-800 via-blue-950 to-black',    ground: 'from-slate-900 to-black',  landscape: 'CITY' },
    TIME:    { bg: 'from-slate-800 via-blue-950 to-black',    ground: 'from-slate-900 to-black',  landscape: 'CITY' },
};
const DEFAULT_THEME = { bg: 'from-slate-800 via-slate-950 to-black', ground: 'from-slate-900 to-black', landscape: 'MOUNTAIN' };

function getElementLayer(type) {
    switch (type) {
        case 'FIRE': case 'DRAGON': case 'CHAOS': return 'FIRE';
        case 'WATER': return 'WATER';
        case 'ICE': return 'ICE';
        case 'NATURE': case 'POISON': case 'EARTH': return 'NATURE';
        case 'DARK': case 'GHOST': case 'VOID': return 'DARK';
        case 'ELECTRIC': case 'LIGHT': return 'ELECTRIC';
        case 'TECH': case 'METAL': case 'TIME': return 'TECH';
        case 'MAGIC': return 'MAGIC';
        default: return null;
    }
}

const WEATHER_OPTIONS = {
    MOUNTAIN: ['NONE', 'ASH', 'NONE', 'ASH'],
    WAVES:    ['NONE', 'RAIN', 'STORM', 'NONE'],
    FOREST:   ['NONE', 'RAIN', 'NONE', 'RAIN'],
    CITY:     ['NONE', 'RAIN', 'NONE'],
    CAVE:     ['NONE'],
};

export default function ArenaBackground({ enemyType, lowPower = false }) {
    const theme = THEMES[enemyType] || DEFAULT_THEME;
    const [weather, setWeather] = useState('NONE');
    const elementLayer = getElementLayer(enemyType);

    useEffect(() => {
        const opts = WEATHER_OPTIONS[theme.landscape] || ['NONE'];
        setWeather(opts[Math.floor(Math.random() * opts.length)]);
    }, [enemyType, theme.landscape]);

    const rainDrops = useMemo(() => Array.from({ length: lowPower ? 20 : 40 }).map(() => ({
        left: `${Math.random() * 100}%`,
        dur: `${0.5 + Math.random() * 0.3}s`,
        delay: `${Math.random()}s`,
    })), [lowPower]);
    const snowFlakes = useMemo(() => Array.from({ length: lowPower ? 20 : 40 }).map(() => ({
        left: `${Math.random() * 100}%`,
        dur: `${3 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`,
    })), [lowPower]);
    const ashPieces = useMemo(() => Array.from({ length: lowPower ? 15 : 30 }).map(() => ({
        left: `${Math.random() * 100}%`,
        dur: `${4 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`,
    })), [lowPower]);

    return (
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.bg} overflow-hidden z-0 transition-colors duration-1000`}>

            {/* Weather effects */}
            {weather === 'STORM' && <div className="absolute inset-0 z-20 animate-flash pointer-events-none mix-blend-overlay" />}
            {(weather === 'RAIN' || weather === 'STORM') && (
                <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
                    {rainDrops.map((r, i) => (
                        <div key={i} className="absolute w-0.5 h-20 bg-blue-200 animate-rain"
                            style={{ left: r.left, animationDuration: r.dur, animationDelay: r.delay }} />
                    ))}
                </div>
            )}
            {weather === 'SNOW' && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {snowFlakes.map((s, i) => (
                        <div key={i} className="absolute w-1.5 h-1.5 bg-white/80 rounded-full animate-snow blur-[1px]"
                            style={{ left: s.left, animationDuration: s.dur, animationDelay: s.delay }} />
                    ))}
                </div>
            )}
            {weather === 'ASH' && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {ashPieces.map((a, i) => (
                        <div key={i} className="absolute w-2 h-2 bg-orange-500/40 rounded-full animate-ash blur-[1px]"
                            style={{ left: a.left, animationDuration: a.dur, animationDelay: a.delay }} />
                    ))}
                </div>
            )}

            {/* Element-specific animation layer */}
            {!lowPower || elementLayer ? (
                <div className="absolute inset-0 z-5 pointer-events-none">
                    {elementLayer === 'FIRE'     && <FireBackground lowPower={lowPower} />}
                    {elementLayer === 'WATER'    && <WaterBackground lowPower={lowPower} />}
                    {elementLayer === 'ICE'      && <IceBackground lowPower={lowPower} />}
                    {elementLayer === 'NATURE'   && <NatureBackground lowPower={lowPower} />}
                    {elementLayer === 'DARK'     && <DarkBackground lowPower={lowPower} />}
                    {elementLayer === 'ELECTRIC' && <ElectricBackground lowPower={lowPower} />}
                    {elementLayer === 'TECH'     && <TechBackground lowPower={lowPower} />}
                    {elementLayer === 'MAGIC'    && <MagicBackground lowPower={lowPower} />}
                </div>
            ) : null}

            {/* Landscape silhouette */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30 pointer-events-none text-black/50">
                {theme.landscape === 'MOUNTAIN' && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,170.7C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </svg>
                )}
                {theme.landscape === 'FOREST' && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,224L48,213.3C96,203,192,192,288,197.3C384,203,480,224,576,224C672,224,768,203,864,186.7C960,171,1056,160,1152,165.3C1248,171,1344,192,1392,202.7L1440,213.3L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </svg>
                )}
                {theme.landscape === 'WAVES' && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </svg>
                )}
                {(theme.landscape === 'CITY' || theme.landscape === 'CAVE') && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,202.7C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
                    </svg>
                )}
            </div>

            <div className={`absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t ${theme.ground} opacity-90`} />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%),repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px),repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px)] perspective-[1000px] rotate-x-60 origin-bottom pointer-events-none" />
        </div>
    );
}
