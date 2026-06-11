import React from 'react';

export default function AlchemySprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Ground */}
            <rect x="0" y="64" width="80" height="16" fill="#1a0a28" />

            {/* Crooked building body */}
            <polygon points="16,64 18,34 26,32 62,34 64,64" fill="#2d1040" />
            <polygon points="16,64 18,34 26,32 62,34 64,64" fill="none" stroke="#5a2a7a" strokeWidth="0.7" />
            {/* Plank lines */}
            <line x1="18" y1="44" x2="63" y2="44" stroke="#3a1a50" strokeWidth="0.7" opacity="0.6" />
            <line x1="18" y1="54" x2="63" y2="54" stroke="#3a1a50" strokeWidth="0.7" opacity="0.6" />
            <line x1="30" y1="34" x2="30" y2="64" stroke="#3a1a50" strokeWidth="0.5" opacity="0.5" />
            <line x1="50" y1="34" x2="50" y2="64" stroke="#3a1a50" strokeWidth="0.5" opacity="0.5" />

            {/* Crooked roof - slightly off-center */}
            <polygon points="13,34 42,10 67,34" fill="#3d1855" />
            <polygon points="15,34 42,12 65,34" fill="#4f2268" />
            {/* Roof planks */}
            {[20,26,32,38,44,50,56,62].map((x, i) => (
                <line key={i} x1={x} y1="34" x2={x - 2 + i} y2={20 + i} stroke="#3a1550" strokeWidth="0.4" opacity="0.4" />
            ))}

            {/* Chimney - slightly bent */}
            <polygon points="51,32 55,14 60,14 58,32" fill="#2d1040" stroke="#5a2a7a" strokeWidth="0.5" />
            {/* Chimney cap */}
            <rect x="49" y="13" width="12" height="3" rx="0.5" fill="#1a0828" stroke="#4a2060" strokeWidth="0.5" />

            {/* Smoke / magic wisps from chimney */}
            <path d="M55,13 Q57,8 54,5 Q51,2 55,0" fill="none" stroke="#aa44ff" strokeWidth="1.2" opacity="0.5" />
            <path d="M57,13 Q60,9 58,6 Q56,3 59,1" fill="none" stroke="#cc66ff" strokeWidth="0.8" opacity="0.4" />

            {/* Door - arched */}
            <path d="M33,64 L33,50 Q40,43 47,50 L47,64 Z" fill="#0d0518" />
            <path d="M33,51 Q40,44 47,51" fill="none" stroke="#8833cc" strokeWidth="1" />
            {/* Rune on door */}
            <text x="40" y="60" textAnchor="middle" fontSize="8" fill="#cc44ff" opacity="0.7" fontFamily="serif">⚗</text>

            {/* Windows */}
            <path d="M19,40 Q23,36 27,40 L27,46 L19,46 Z" fill="#0d0518" stroke="#5a2a7a" strokeWidth="0.5" />
            <circle cx="23" cy="41" r="2.5" fill="#1a0a30" />
            <circle cx="23" cy="41" r="1.5" fill="#8844ff" opacity="0.35" />

            <path d="M53,40 Q57,36 61,40 L61,46 L53,46 Z" fill="#0d0518" stroke="#5a2a7a" strokeWidth="0.5" />
            <circle cx="57" cy="41" r="2.5" fill="#1a0a30" />
            <circle cx="57" cy="41" r="1.5" fill="#8844ff" opacity="0.35" />

            {/* Cauldron */}
            <ellipse cx="40" cy="67" rx="10" ry="5" fill="#1a0a28" stroke="#4a2060" strokeWidth="0.8" />
            <path d="M30,66 Q30,72 40,74 Q50,72 50,66" fill="#1a0a28" />
            <path d="M30,66 Q30,72 40,74 Q50,72 50,66" fill="none" stroke="#4a2060" strokeWidth="0.8" />
            {/* Cauldron legs */}
            <line x1="33" y1="72" x2="31" y2="76" stroke="#3a1a50" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="40" y1="74" x2="40" y2="78" stroke="#3a1a50" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="47" y1="72" x2="49" y2="76" stroke="#3a1a50" strokeWidth="1.5" strokeLinecap="round" />
            {/* Cauldron bubbles */}
            <circle cx="36" cy="64" r="1.5" fill="#dd55ff" opacity="0.4" />
            <circle cx="42" cy="62" r="2" fill="#cc44ee" opacity="0.35" />
            <circle cx="46" cy="64" r="1.2" fill="#dd55ff" opacity="0.3" />
            {/* Potion glow in cauldron */}
            <ellipse cx="40" cy="66" rx="8" ry="3" fill="#7722cc" opacity="0.25" />

            {/* Sparkles */}
            <circle cx="8" cy="20" r="1" fill="#cc88ff" opacity="0.7" />
            <circle cx="72" cy="26" r="1.2" fill="#cc88ff" opacity="0.6" />
            <circle cx="14" cy="50" r="0.8" fill="#ee99ff" opacity="0.5" />
            <circle cx="70" cy="48" r="1" fill="#ee99ff" opacity="0.5" />
            {/* Star sparkles */}
            <path d="M12,28 L13,30 L15,30 L13.5,31.5 L14,33.5 L12,32 L10,33.5 L10.5,31.5 L9,30 L11,30 Z"
                fill="#cc88ff" opacity="0.6" transform="scale(0.6) translate(8,20)" />
        </svg>
    );
}
