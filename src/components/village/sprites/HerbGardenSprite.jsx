import React from 'react';

export default function HerbGardenSprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Ground */}
            <rect x="0" y="64" width="80" height="16" fill="#0e1a08" />
            {/* Soil patch */}
            <ellipse cx="40" cy="65" rx="34" ry="4" fill="#1a2a0c" />

            {/* Greenhouse frame - rear wall */}
            <rect x="10" y="28" width="60" height="38" rx="1" fill="#0d1808" stroke="#2a4a1a" strokeWidth="0.8" />

            {/* Glass panels on rear wall */}
            {[12,22,32,42,52,62].map((x, i) => (
                <rect key={i} x={x} y="30" width="8" height="34" rx="0" fill="rgba(100,200,80,0.06)" stroke="#2a4a1a" strokeWidth="0.5" />
            ))}

            {/* Roof - pitched greenhouse */}
            <polygon points="6,28 40,10 74,28" fill="#0d1808" stroke="#2a4a1a" strokeWidth="0.8" />
            {/* Roof glass panes */}
            {[10,18,26,34,42,50,58,66].map((x, i) => (
                <polygon key={i}
                    points={`${x},28 ${x+3},28 ${40 + (x + 1.5 - 40) * 0.5},11`}
                    fill="rgba(100,200,80,0.07)"
                    stroke="#2a4a1a"
                    strokeWidth="0.4"
                />
            ))}

            {/* Door */}
            <rect x="32" y="48" width="16" height="18" rx="1" fill="#0a1205" stroke="#2a4a1a" strokeWidth="0.7" />
            {/* Door glass */}
            <rect x="33" y="49" width="6" height="15" rx="0.5" fill="rgba(100,200,80,0.08)" />
            <rect x="41" y="49" width="6" height="15" rx="0.5" fill="rgba(100,200,80,0.08)" />
            <circle cx="40" cy="56" r="1" fill="#3a6a1a" />

            {/* Plants inside - visible through glass */}
            {/* Tall plants back row */}
            <line x1="20" y1="62" x2="20" y2="44" stroke="#2a6a18" strokeWidth="1.2" />
            <ellipse cx="20" cy="43" rx="4" ry="5" fill="#2a6a18" opacity="0.8" />
            <ellipse cx="18" cy="46" rx="3" ry="3.5" fill="#3a8a22" opacity="0.7" />
            <ellipse cx="22" cy="46" rx="3" ry="3.5" fill="#2a7018" opacity="0.7" />

            <line x1="28" y1="62" x2="28" y2="40" stroke="#1a5a10" strokeWidth="1.2" />
            <ellipse cx="28" cy="39" rx="5" ry="6" fill="#1a5a10" opacity="0.8" />
            <ellipse cx="25" cy="42" rx="3.5" ry="4" fill="#2a7a18" opacity="0.7" />
            <ellipse cx="31" cy="42" rx="3.5" ry="4" fill="#1a6010" opacity="0.7" />

            <line x1="52" y1="62" x2="52" y2="42" stroke="#2a6a18" strokeWidth="1.2" />
            <ellipse cx="52" cy="41" rx="4.5" ry="5.5" fill="#2a6a18" opacity="0.8" />

            <line x1="60" y1="62" x2="60" y2="44" stroke="#1a5a10" strokeWidth="1.2" />
            <ellipse cx="60" cy="43" rx="4" ry="5" fill="#3a8a20" opacity="0.8" />
            <ellipse cx="58" cy="46" rx="3" ry="3.5" fill="#2a7818" opacity="0.7" />
            <ellipse cx="62" cy="46" rx="3" ry="3.5" fill="#2a7818" opacity="0.7" />

            {/* Small plants front row */}
            <line x1="16" y1="64" x2="16" y2="56" stroke="#3a8a22" strokeWidth="0.8" />
            <ellipse cx="16" cy="55" rx="3" ry="3.5" fill="#3a8a22" opacity="0.9" />
            <line x1="64" y1="64" x2="64" y2="56" stroke="#3a8a22" strokeWidth="0.8" />
            <ellipse cx="64" cy="55" rx="3" ry="3.5" fill="#2a7018" opacity="0.9" />

            {/* Flower pots on ground */}
            <ellipse cx="14" cy="66" rx="4" ry="2" fill="#5a3018" />
            <rect x="11" y="63" width="6" height="3" rx="0.5" fill="#6a3818" />
            <circle cx="14" cy="62" r="2" fill="#ff6644" opacity="0.85" />

            <ellipse cx="66" cy="66" rx="4" ry="2" fill="#5a3018" />
            <rect x="63" y="63" width="6" height="3" rx="0.5" fill="#6a3818" />
            <circle cx="66" cy="62" r="1.8" fill="#ffaa22" opacity="0.85" />

            {/* Water barrel */}
            <rect x="70" y="54" width="8" height="10" rx="1" fill="#2a5a28" stroke="#1a4018" strokeWidth="0.5" />
            <line x1="70" y1="57" x2="78" y2="57" stroke="#1a4018" strokeWidth="0.5" />
            <line x1="70" y1="61" x2="78" y2="61" stroke="#1a4018" strokeWidth="0.5" />
            <ellipse cx="74" cy="54" rx="4" ry="1.5" fill="#3a7030" />

            {/* Ambient green glow */}
            <ellipse cx="40" cy="66" rx="32" ry="3" fill="#22aa22" opacity="0.06" />
        </svg>
    );
}
