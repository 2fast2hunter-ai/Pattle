import React from 'react';

export default function BattleFieldFloor({ className }) {
    return (
        <svg
            viewBox="0 0 400 120"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax meet"
        >
            {/* Arena floor base */}
            <rect x="0" y="40" width="400" height="80" fill="#1a0a08" />

            {/* Floor perspective grid */}
            {/* Horizontal lines (closer = more spread) */}
            {[40, 55, 70, 85, 100, 115].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="400" y2={y}
                    stroke="#2a1410" strokeWidth={0.4 + i * 0.15} opacity={0.5 + i * 0.08} />
            ))}

            {/* Vertical perspective lines converging to center */}
            {[-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].map((offset, i) => {
                const x = 200 + offset * 160;
                return (
                    <line key={i} x1={200} y1={40} x2={x} y2={120}
                        stroke="#2a1410" strokeWidth="0.5" opacity="0.4" />
                );
            })}

            {/* Sand/dirt texture patches */}
            <ellipse cx="100" cy="90" rx="40" ry="12" fill="#221008" opacity="0.5" />
            <ellipse cx="300" cy="95" rx="35" ry="10" fill="#221008" opacity="0.5" />
            <ellipse cx="200" cy="85" rx="30" ry="8" fill="#261208" opacity="0.3" />

            {/* Stone circle border - arena ring */}
            <ellipse cx="200" cy="78" rx="170" ry="50" fill="none" stroke="#3a1a10" strokeWidth="2" opacity="0.6" />
            <ellipse cx="200" cy="78" rx="168" ry="48" fill="none" stroke="#2a1008" strokeWidth="1" opacity="0.4" />

            {/* Center marker */}
            <circle cx="200" cy="75" r="15" fill="none" stroke="#3a1a10" strokeWidth="1.5" opacity="0.5" />
            <circle cx="200" cy="75" r="3" fill="#3a1a10" opacity="0.5" />
            <line x1="185" y1="75" x2="215" y2="75" stroke="#3a1a10" strokeWidth="0.8" opacity="0.5" />
            <line x1="200" y1="60" x2="200" y2="90" stroke="#3a1a10" strokeWidth="0.8" opacity="0.5" />

            {/* Cracks in the floor */}
            <path d="M80,85 Q90,80 100,86 Q108,82 115,88" fill="none" stroke="#120808" strokeWidth="1" opacity="0.6" />
            <path d="M270,90 Q282,85 295,91 Q303,87 312,92" fill="none" stroke="#120808" strokeWidth="1" opacity="0.6" />
            <path d="M180,65 Q188,68 192,64 Q196,60 200,63" fill="none" stroke="#120808" strokeWidth="0.8" opacity="0.4" />

            {/* Blood/battle stains */}
            <ellipse cx="140" cy="88" rx="8" ry="4" fill="#3a0808" opacity="0.35" />
            <ellipse cx="260" cy="82" rx="6" ry="3" fill="#3a0808" opacity="0.3" />
            <ellipse cx="200" cy="92" rx="10" ry="4" fill="#3a0808" opacity="0.25" />

            {/* Arena wall base at edges */}
            <rect x="0" y="40" width="400" height="6" fill="none"
                style={{ filter: 'none' }} />
            {/* Left wall base blocks */}
            {[0, 12, 24, 36, 48].map((x, i) => (
                <rect key={i} x={x} y="40" width="11" height="18" rx="0.5"
                    fill={i % 2 === 0 ? "#2a1410" : "#221010"} opacity="0.7" />
            ))}
            {/* Right wall base blocks */}
            {[352, 364, 376, 388, 400].map((x, i) => (
                <rect key={i} x={x} y="40" width="11" height="18" rx="0.5"
                    fill={i % 2 === 0 ? "#2a1410" : "#221010"} opacity="0.7" />
            ))}

            {/* Torch holders on walls */}
            <line x1="20" y1="40" x2="20" y2="32" stroke="#4a2a18" strokeWidth="1.5" />
            <ellipse cx="20" cy="30" rx="4" ry="5" fill="#ff5500" opacity="0.6" />
            <ellipse cx="20" cy="29" rx="3" ry="4" fill="#ffaa00" opacity="0.7" />

            <line x1="380" y1="40" x2="380" y2="32" stroke="#4a2a18" strokeWidth="1.5" />
            <ellipse cx="380" cy="30" rx="4" ry="5" fill="#ff5500" opacity="0.6" />
            <ellipse cx="380" cy="29" rx="3" ry="4" fill="#ffaa00" opacity="0.7" />

            {/* Ground shadow gradient at top of floor */}
            <rect x="0" y="40" width="400" height="25"
                fill="url(#floorFade)" opacity="0.4" />

            <defs>
                <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
}
