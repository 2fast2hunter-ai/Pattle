import React from 'react';

export default function SawmillSprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="sawmill-woodGrain" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7a4525" stopOpacity="0.4" />
                    <stop offset="40%" stopColor="#5a3018" stopOpacity="0" />
                    <stop offset="60%" stopColor="#7a4525" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#5a3018" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Sky/background tint */}
            <rect x="0" y="0" width="80" height="80" fill="rgba(0,0,0,0)" />

            {/* Log pile on left */}
            <rect x="4" y="62" width="16" height="4" rx="2" fill="#7c3d1f" />
            <rect x="4" y="57" width="16" height="4" rx="2" fill="#9b4f28" />
            <rect x="4" y="52" width="16" height="4" rx="2" fill="#7c3d1f" />
            {/* Log end circles */}
            <circle cx="4" cy="64" r="2" fill="#5a2a10" />
            <circle cx="4" cy="59" r="2" fill="#5a2a10" />
            <circle cx="4" cy="54" r="2" fill="#5a2a10" />

            {/* Building body */}
            <rect x="20" y="42" width="52" height="30" rx="2" fill="#5a3018" />
            <rect x="20" y="42" width="52" height="30" rx="2" fill="url(#sawmill-woodGrain)" />

            {/* Wood plank lines */}
            <line x1="20" y1="50" x2="72" y2="50" stroke="#4a2510" strokeWidth="0.7" opacity="0.6" />
            <line x1="20" y1="58" x2="72" y2="58" stroke="#4a2510" strokeWidth="0.7" opacity="0.6" />
            <line x1="20" y1="66" x2="72" y2="66" stroke="#4a2510" strokeWidth="0.7" opacity="0.6" />

            {/* Roof */}
            <polygon points="15,42 46,14 77,42" fill="#8b4513" />
            <polygon points="17,42 46,16 75,42" fill="#a0522d" />
            {/* Roof ridge beam */}
            <line x1="46" y1="14" x2="46" y2="42" stroke="#7a3010" strokeWidth="1.5" />

            {/* Door */}
            <rect x="38" y="56" width="14" height="16" rx="2" fill="#2a1005" />
            <rect x="40" y="58" width="4" height="12" rx="1" fill="#1a0800" opacity="0.5" />
            <rect x="46" y="58" width="4" height="12" rx="1" fill="#1a0800" opacity="0.5" />

            {/* Windows */}
            <rect x="22" y="48" width="10" height="8" rx="1" fill="#1a2a3a" stroke="#6b3a1a" strokeWidth="0.5" />
            <line x1="27" y1="48" x2="27" y2="56" stroke="#6b3a1a" strokeWidth="0.5" />
            <line x1="22" y1="52" x2="32" y2="52" stroke="#6b3a1a" strokeWidth="0.5" />
            <rect x="58" y="48" width="10" height="8" rx="1" fill="#1a2a3a" stroke="#6b3a1a" strokeWidth="0.5" />
            <line x1="63" y1="48" x2="63" y2="56" stroke="#6b3a1a" strokeWidth="0.5" />
            <line x1="58" y1="52" x2="68" y2="52" stroke="#6b3a1a" strokeWidth="0.5" />

            {/* Chimney */}
            <rect x="56" y="24" width="8" height="18" rx="1" fill="#7a3a20" />
            <rect x="56" y="22" width="8" height="4" rx="0.5" fill="#5a2a10" />
            {/* Smoke */}
            <circle cx="59" cy="18" r="2.5" fill="#888" opacity="0.25" />
            <circle cx="61" cy="13" r="2" fill="#888" opacity="0.18" />
            <circle cx="63" cy="9" r="1.5" fill="#888" opacity="0.12" />

            {/* Circular saw blade - mounted on front */}
            <g transform="translate(46, 35)">
                <circle cx="0" cy="0" r="8" fill="#555" stroke="#999" strokeWidth="1" />
                <circle cx="0" cy="0" r="5" fill="#444" />
                <circle cx="0" cy="0" r="2" fill="#888" />
                {/* Teeth */}
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
                    <polygon key={i}
                        points="8,-1.5 11,0 8,1.5"
                        fill="#bbb"
                        transform={`rotate(${a})`}
                    />
                ))}
                {/* Center spokes */}
                {[0,90,180,270].map((a, i) => (
                    <line key={i} x1="0" y1="2" x2="0" y2="4.5" stroke="#aaa" strokeWidth="0.8"
                        transform={`rotate(${a})`} />
                ))}
            </g>

            {/* Saw blade mount arm */}
            <rect x="42" y="33" width="10" height="2" rx="1" fill="#666" />
        </svg>
    );
}
