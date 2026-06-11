import React from 'react';

export default function ObservatorySprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Stars in background */}
            {[[10,8],[20,5],[35,3],[55,6],[68,4],[72,12],[5,18],[75,20]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1 : 0.7} fill="#e8e0ff" opacity={0.6 + (i % 4) * 0.1} />
            ))}

            {/* Platform / base ring */}
            <ellipse cx="40" cy="66" rx="30" ry="5" fill="#2a2438" />
            <rect x="10" y="60" width="60" height="8" rx="3" fill="#2a2438" />
            <rect x="10" y="60" width="60" height="8" rx="3" fill="none" stroke="#4a3a68" strokeWidth="0.8" />
            {/* Platform steps */}
            <rect x="14" y="64" width="52" height="4" rx="2" fill="#1e1830" />

            {/* Cylindrical building body */}
            <rect x="22" y="38" width="36" height="24" rx="2" fill="#2e2545" />
            <rect x="22" y="38" width="36" height="24" rx="2" fill="none" stroke="#4a3a68" strokeWidth="0.8" />
            {/* Stone block details */}
            {[40,44,48,52,56,60].map((y, i) => (
                <line key={i} x1="22" y1={y} x2="58" y2={y} stroke="#4a3a68" strokeWidth="0.4" opacity="0.5" />
            ))}
            <line x1="40" y1="38" x2="40" y2="62" stroke="#4a3a68" strokeWidth="0.4" opacity="0.5" />

            {/* Door arched */}
            <path d="M33,62 L33,50 Q40,44 47,50 L47,62 Z" fill="#0d0820" />
            <path d="M33,51 Q40,45 47,51" fill="none" stroke="#6a4a88" strokeWidth="1" />

            {/* Windows */}
            <circle cx="27" cy="44" r="3.5" fill="#0d0820" stroke="#4a3a68" strokeWidth="0.8" />
            <circle cx="27" cy="44" r="2.5" fill="#1a1040" />
            <circle cx="53" cy="44" r="3.5" fill="#0d0820" stroke="#4a3a68" strokeWidth="0.8" />
            <circle cx="53" cy="44" r="2.5" fill="#1a1040" />
            {/* Window glow */}
            <circle cx="27" cy="44" r="2" fill="#9060ff" opacity="0.3" />
            <circle cx="53" cy="44" r="2" fill="#9060ff" opacity="0.3" />

            {/* Dome */}
            <path d="M18,38 Q18,16 40,12 Q62,16 62,38 Z" fill="#3a2d5a" />
            <path d="M18,38 Q18,16 40,12 Q62,16 62,38 Z" fill="none" stroke="#6a4a88" strokeWidth="1" />
            {/* Dome meridian lines */}
            <path d="M40,12 Q30,24 26,38" fill="none" stroke="#4a3a68" strokeWidth="0.6" opacity="0.6" />
            <path d="M40,12 Q50,24 54,38" fill="none" stroke="#4a3a68" strokeWidth="0.6" opacity="0.6" />
            <path d="M22,30 Q40,26 58,30" fill="none" stroke="#4a3a68" strokeWidth="0.6" opacity="0.5" />

            {/* Dome slit opening */}
            <path d="M36,14 Q40,12 44,14 L44,38 L36,38 Z" fill="#0a0618" />
            <line x1="36" y1="14" x2="36" y2="38" stroke="#6a4a88" strokeWidth="0.5" />
            <line x1="44" y1="14" x2="44" y2="38" stroke="#6a4a88" strokeWidth="0.5" />

            {/* Telescope barrel */}
            <rect x="37" y="20" width="14" height="5" rx="1" fill="#888" stroke="#aaa" strokeWidth="0.5"
                transform="rotate(-20,44,22)" />
            <rect x="37" y="20" width="3" height="5" rx="0.5" fill="#555"
                transform="rotate(-20,44,22)" />
            {/* Telescope lens glow */}
            <circle cx="51" cy="22" r="3" fill="#aa88ff" opacity="0.35"
                transform="rotate(-20,44,22)" />

            {/* Stars above */}
            <circle cx="8" cy="28" r="1.2" fill="#cc99ff" opacity="0.8" />
            <circle cx="72" cy="22" r="1" fill="#cc99ff" opacity="0.7" />

            {/* Ambient glow */}
            <ellipse cx="40" cy="68" rx="28" ry="3" fill="#6030aa" opacity="0.1" />
        </svg>
    );
}
