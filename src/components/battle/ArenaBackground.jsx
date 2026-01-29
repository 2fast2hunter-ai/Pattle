import React, { useState, useEffect } from 'react';

export default function ArenaBackground({ enemyType }) {
    const getTheme = (type) => {
        switch(type) {
            case 'FIRE': case 'DRAGON': case 'CHAOS': return { 
                bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900 via-red-950 to-black', 
                particle: 'bg-orange-500 shadow-[0_0_10px_orange]', 
                anim: 'animate-[particle-rise_4s_linear_infinite]',
                ground: 'from-red-950 to-black',
                landscape: 'MOUNTAIN'
            };
            case 'WATER': case 'ICE': return { 
                bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900 via-blue-950 to-black', 
                particle: 'bg-cyan-400/50 shadow-[0_0_5px_cyan]', 
                anim: 'animate-[particle-float-random_8s_linear_infinite]',
                ground: 'from-blue-950 to-black',
                landscape: 'WAVES'
            };
            case 'NATURE': case 'POISON': case 'EARTH': return { 
                bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900 via-green-950 to-black', 
                particle: 'bg-emerald-400/60', 
                anim: 'animate-[particle-fall_10s_linear_infinite]',
                ground: 'from-green-950 to-black',
                landscape: 'FOREST'
            };
            case 'DARK': case 'GHOST': case 'VOID': return { 
                bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-950 to-black', 
                particle: 'bg-purple-500/50 shadow-[0_0_5px_purple]', 
                anim: 'animate-[particle-float-random_12s_linear_infinite]',
                ground: 'from-slate-950 to-black',
                landscape: 'CAVE'
            };
            case 'LIGHT': case 'ELECTRIC': case 'MAGIC': return { 
                bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/40 via-indigo-950 to-black', 
                particle: 'bg-yellow-200 shadow-[0_0_10px_yellow]', 
                anim: 'animate-[particle-rise_6s_linear_infinite]',
                ground: 'from-indigo-950 to-black',
                landscape: 'CITY'
            };
            case 'TECH': case 'METAL': case 'TIME': return {
                bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-blue-950 to-black',
                particle: 'bg-blue-400 shadow-[0_0_5px_blue]',
                anim: 'animate-[particle-float-random_10s_linear_infinite]',
                ground: 'from-slate-900 to-black',
                landscape: 'CITY'
            };
            default: return { 
                bg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black', 
                particle: 'bg-white/30', 
                anim: 'animate-[particle-float-random_15s_linear_infinite]',
                ground: 'from-slate-900 to-black',
                landscape: 'MOUNTAIN'
            };
        }
    };

    const theme = getTheme(enemyType);
    const [weather, setWeather] = useState('NONE');

    useEffect(() => {
        const allowedWeathers = {
            'MOUNTAIN': ['NONE', 'ASH', 'NONE', 'ASH'],
            'WAVES': ['NONE', 'RAIN', 'STORM', 'NONE'],
            'FOREST': ['NONE', 'RAIN', 'NONE', 'RAIN'],
            'CITY': ['NONE', 'RAIN', 'NONE'],
            'CAVE': ['NONE'],
        };
        const options = allowedWeathers[theme.landscape] || ['NONE', 'RAIN', 'SNOW'];
        setWeather(options[Math.floor(Math.random() * options.length)]);
    }, [enemyType]);
    
    const particles = React.useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 2}px`,
        duration: `${Math.random() * 10 + 5}s`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.2
    })), []);

    return (
        <div className={`absolute inset-0 ${theme.bg} overflow-hidden z-0 transition-colors duration-1000`}>
            {weather === 'STORM' && <div className="absolute inset-0 z-20 animate-flash pointer-events-none mix-blend-overlay"></div>}
            
            {(weather === 'RAIN' || weather === 'STORM') && (
                <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
                     {Array.from({ length: 40 }).map((_, i) => (
                         <div key={i} className="absolute w-0.5 h-20 bg-blue-200 animate-rain" style={{
                             left: `${Math.random() * 100}%`,
                             animationDuration: `${0.5 + Math.random() * 0.3}s`,
                             animationDelay: `${Math.random()}s`
                         }}></div>
                     ))}
                </div>
            )}

            {weather === 'SNOW' && (
                 <div className="absolute inset-0 z-10 pointer-events-none">
                     {Array.from({ length: 40 }).map((_, i) => (
                         <div key={i} className="absolute w-1.5 h-1.5 bg-white/80 rounded-full animate-snow blur-[1px]" style={{
                             left: `${Math.random() * 100}%`,
                             animationDuration: `${3 + Math.random() * 4}s`,
                             animationDelay: `${Math.random() * 5}s`
                         }}></div>
                     ))}
                 </div>
            )}

            {weather === 'ASH' && (
                 <div className="absolute inset-0 z-10 pointer-events-none">
                     {Array.from({ length: 30 }).map((_, i) => (
                         <div key={i} className="absolute w-2 h-2 bg-orange-500/40 rounded-full animate-ash blur-[1px]" style={{
                             left: `${Math.random() * 100}%`,
                             animationDuration: `${4 + Math.random() * 4}s`,
                             animationDelay: `${Math.random() * 5}s`
                         }}></div>
                     ))}
                 </div>
            )}
            
            {particles.map((p, i) => (
                <div 
                    key={i} 
                    className={`absolute rounded-full ${theme.particle} ${theme.anim}`}
                    style={{
                        left: p.left,
                        top: theme.anim.includes('rise') ? undefined : p.top,
                        width: p.size,
                        height: p.size,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                        opacity: p.opacity
                    }}
                />
            ))}
            
            <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30 pointer-events-none text-black/50">
                {theme.landscape === 'MOUNTAIN' && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,170.7C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                )}
                {theme.landscape === 'FOREST' && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,224L48,213.3C96,203,192,192,288,197.3C384,203,480,224,576,224C672,224,768,203,864,186.7C960,171,1056,160,1152,165.3C1248,171,1344,192,1392,202.7L1440,213.3L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                )}
                {theme.landscape === 'WAVES' && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                )}
                {(theme.landscape === 'CITY' || theme.landscape === 'CAVE') && (
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,202.7C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    </svg>
                )}
            </div>

            <div className={`absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t ${theme.ground} opacity-90`}></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%),repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px),repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px)] perspective-[1000px] rotate-x-60 origin-bottom pointer-events-none"></div>
        </div>
    );
}