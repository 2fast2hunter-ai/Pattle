import React from 'react';

export default function TrainingSprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Ground / courtyard stones */}
            <rect x="0" y="62" width="80" height="18" fill="#1e1810" />
            {/* Stone tiles */}
            {[0,13,26,39,52,65].map((x, i) => (
                <rect key={i} x={x} y="62" width="13" height="8" rx="0" fill={i % 2 === 0 ? "#1e1810" : "#1a1408"} stroke="#2a2015" strokeWidth="0.3" />
            ))}
            {[0,13,26,39,52,65].map((x, i) => (
                <rect key={i} x={x + 6} y="70" width="13" height="10" rx="0" fill={i % 2 === 0 ? "#1a1408" : "#1e1810"} stroke="#2a2015" strokeWidth="0.3" />
            ))}

            {/* Main dojo building */}
            <rect x="12" y="38" width="56" height="28" rx="1" fill="#2a1e10" />
            {/* Wall texture */}
            <rect x="12" y="38" width="56" height="28" rx="1" fill="none" stroke="#4a3018" strokeWidth="0.8" />
            {[42,46,50,54,58,62].map((y, i) => (
                <line key={i} x1="12" y1={y} x2="68" y2={y} stroke="#3a2510" strokeWidth="0.4" opacity="0.5" />
            ))}

            {/* Curved roof - pagoda style */}
            <polygon points="6,38 40,16 74,38" fill="#3a2818" />
            <polygon points="8,38 40,18 72,38" fill="#4a3422" />
            {/* Roof tiles */}
            {[12,18,24,30,36,42,48,54,60,66].map((x, i) => (
                <rect key={i} x={x} y={28 + Math.abs(4 - i) * 1.5} width="5" height="3" rx="0.5"
                    fill={i % 2 === 0 ? "#5a4030" : "#4a3020"} />
            ))}
            {/* Roof ridge */}
            <line x1="6" y1="38" x2="74" y2="38" stroke="#5a3a20" strokeWidth="1.2" />
            <line x1="8" y1="38" x2="72" y2="38" stroke="#6a4a30" strokeWidth="0.6" />

            {/* Ridge end ornaments */}
            <polygon points="6,38 8,34 10,38" fill="#8a5a30" />
            <polygon points="74,38 72,34 70,38" fill="#8a5a30" />

            {/* Upper roof overhang */}
            <polygon points="14,38 40,26 66,38" fill="#2a1e10" opacity="0.8" />

            {/* Left pillar */}
            <rect x="14" y="38" width="7" height="28" rx="0.5" fill="#4a3828" stroke="#3a2818" strokeWidth="0.5" />
            {/* Pillar base cap */}
            <rect x="12" y="60" width="11" height="4" rx="0.5" fill="#5a4838" />
            <rect x="12" y="36" width="11" height="4" rx="0.5" fill="#5a4838" />

            {/* Right pillar */}
            <rect x="59" y="38" width="7" height="28" rx="0.5" fill="#4a3828" stroke="#3a2818" strokeWidth="0.5" />
            <rect x="57" y="60" width="11" height="4" rx="0.5" fill="#5a4838" />
            <rect x="57" y="36" width="11" height="4" rx="0.5" fill="#5a4838" />

            {/* Entrance/door */}
            <rect x="30" y="48" width="20" height="18" rx="1" fill="#0e0a06" />
            <path d="M30,54 L30,48 Q40,42 50,48 L50,54 Z" fill="#0e0a06" />
            <path d="M30,49 Q40,43 50,49" fill="none" stroke="#6a4a20" strokeWidth="0.8" />

            {/* Crossed swords above entrance */}
            <g transform="translate(40, 36)">
                {/* Sword 1 */}
                <line x1="-8" y1="-6" x2="8" y2="6" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
                <polygon points="-8,-6 -7,-8 -10,-5" fill="#888" />
                <rect x="-10" y="3" width="6" height="2" rx="0.5" fill="#aaa" transform="rotate(-36)" />
                {/* Sword 2 */}
                <line x1="8" y1="-6" x2="-8" y2="6" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
                <polygon points="8,-6 7,-8 10,-5" fill="#888" />
                <rect x="4" y="3" width="6" height="2" rx="0.5" fill="#aaa" transform="rotate(36)" />
            </g>

            {/* Training dummy to the side */}
            <rect x="67" y="48" width="4" height="14" rx="1" fill="#5a4030" />
            <ellipse cx="69" cy="47" rx="4" ry="5" fill="#6a5040" stroke="#4a3020" strokeWidth="0.5" />
            <line x1="69" y1="48" x2="65" y2="54" stroke="#5a4030" strokeWidth="2" strokeLinecap="round" />
            <line x1="69" y1="48" x2="73" y2="54" stroke="#5a4030" strokeWidth="2" strokeLinecap="round" />

            {/* Weapon rack left */}
            <line x1="10" y1="42" x2="10" y2="60" stroke="#6a4a28" strokeWidth="1.5" />
            <line x1="6" y1="44" x2="14" y2="44" stroke="#6a4a28" strokeWidth="1" />
            <line x1="6" y1="54" x2="14" y2="54" stroke="#6a4a28" strokeWidth="1" />
            {/* Spears */}
            <line x1="8" y1="44" x2="8" y2="62" stroke="#888" strokeWidth="0.8" />
            <polygon points="8,44 7,42 9,42" fill="#aaa" />
            <line x1="12" y1="44" x2="12" y2="62" stroke="#888" strokeWidth="0.8" />
            <polygon points="12,44 11,42 13,42" fill="#aaa" />
        </svg>
    );
}
