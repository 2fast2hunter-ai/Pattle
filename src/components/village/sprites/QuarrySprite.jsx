import React from 'react';

export default function QuarrySprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Ground base */}
            <rect x="0" y="62" width="80" height="18" fill="#3a3530" />

            {/* Rocky cliff left */}
            <polygon points="0,62 0,20 18,30 22,45 12,62" fill="#5a5248" />
            <polygon points="0,20 0,10 10,16 18,30" fill="#6a6258" />
            {/* Rock face lines */}
            <line x1="4" y1="25" x2="14" y2="35" stroke="#4a4238" strokeWidth="0.8" opacity="0.7" />
            <line x1="6" y1="38" x2="16" y2="50" stroke="#4a4238" strokeWidth="0.8" opacity="0.7" />

            {/* Rocky cliff right */}
            <polygon points="80,62 80,20 62,30 58,45 68,62" fill="#4e4a44" />
            <polygon points="80,20 80,10 70,16 62,30" fill="#6a6258" />
            {/* Rock face lines */}
            <line x1="76" y1="25" x2="66" y2="35" stroke="#3a3830" strokeWidth="0.8" opacity="0.7" />
            <line x1="74" y1="38" x2="64" y2="50" stroke="#3a3830" strokeWidth="0.8" opacity="0.7" />

            {/* Mine entrance arch */}
            <path d="M22,62 L22,38 Q40,22 58,38 L58,62 Z" fill="#1a1510" />
            {/* Arch stone ring */}
            <path d="M22,40 Q40,24 58,40" fill="none" stroke="#6a5e50" strokeWidth="3" />
            <path d="M22,43 Q40,27 58,43" fill="none" stroke="#4a4238" strokeWidth="1.5" />

            {/* Mine entrance glow */}
            <ellipse cx="40" cy="55" rx="14" ry="10" fill="rgba(255,180,60,0.08)" />

            {/* Stone blocks framing entrance */}
            {[22,28,34].map((x, i) => (
                <rect key={i} x={x} y={37 - i * 4} width="6" height="4" rx="0.5" fill="#5a5248" stroke="#3a3530" strokeWidth="0.5" />
            ))}
            {[58,52,46].map((x, i) => (
                <rect key={i} x={x - 6} y={37 - i * 4} width="6" height="4" rx="0.5" fill="#4e4a44" stroke="#3a3530" strokeWidth="0.5" />
            ))}

            {/* Mine cart tracks */}
            <line x1="34" y1="62" x2="28" y2="72" stroke="#555" strokeWidth="1" />
            <line x1="46" y1="62" x2="52" y2="72" stroke="#555" strokeWidth="1" />
            {[60,64,68,72].map((y, i) => (
                <line key={i} x1="28" y1={y} x2="52" y2={y} stroke="#555" strokeWidth="0.8" />
            ))}

            {/* Mine cart */}
            <rect x="34" y="55" width="12" height="8" rx="1" fill="#5a4a30" stroke="#4a3a20" strokeWidth="0.5" />
            <rect x="35" y="56" width="10" height="6" rx="0.5" fill="#3a2a15" />
            {/* Cart wheels */}
            <circle cx="36" cy="63" r="2" fill="#444" stroke="#666" strokeWidth="0.5" />
            <circle cx="44" cy="63" r="2" fill="#444" stroke="#666" strokeWidth="0.5" />

            {/* Stone pile */}
            {[
                { x: 8, y: 65, r: 5 },
                { x: 14, y: 67, r: 4 },
                { x: 5, y: 70, r: 4 },
            ].map((s, i) => (
                <ellipse key={i} cx={s.x} cy={s.y} rx={s.r} ry={s.r * 0.6} fill="#6a6258" />
            ))}

            {/* Pickaxe leaning */}
            <line x1="68" y1="62" x2="65" y2="50" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M65,50 L70,46 L67,50" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
