import React from 'react';

export default function FisherySprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Water */}
            <rect x="0" y="58" width="80" height="22" fill="#0d2d4a" />
            {/* Water shimmer lines */}
            <path d="M0,63 Q10,61 20,63 Q30,65 40,63 Q50,61 60,63 Q70,65 80,63" fill="none" stroke="#1a4a7a" strokeWidth="1.2" opacity="0.6" />
            <path d="M0,69 Q10,67 20,69 Q30,71 40,69 Q50,67 60,69 Q70,71 80,69" fill="none" stroke="#1a4a7a" strokeWidth="1" opacity="0.5" />
            <path d="M0,75 Q10,73 20,75 Q30,77 40,75 Q50,73 60,75 Q70,77 80,75" fill="none" stroke="#1a4a7a" strokeWidth="0.8" opacity="0.4" />

            {/* Dock platform */}
            <rect x="8" y="52" width="64" height="8" rx="1" fill="#5a3a18" />
            {/* Dock planks */}
            {[12,20,28,36,44,52,60,68].map((x, i) => (
                <rect key={i} x={x} y="52" width="4" height="8" rx="0.5" fill={i % 2 === 0 ? "#6a4520" : "#5a3518"} />
            ))}

            {/* Dock support poles */}
            <rect x="16" y="54" width="3" height="20" rx="1" fill="#4a2810" />
            <rect x="34" y="54" width="3" height="20" rx="1" fill="#4a2810" />
            <rect x="52" y="54" width="3" height="20" rx="1" fill="#4a2810" />
            <rect x="62" y="54" width="3" height="20" rx="1" fill="#4a2810" />

            {/* Main building on dock */}
            <rect x="14" y="32" width="36" height="22" rx="1" fill="#4a3018" />
            {/* Roof */}
            <polygon points="10,32 32,18 54,32" fill="#6a4020" />
            <polygon points="12,32 32,20 52,32" fill="#7a5030" />
            {/* Roof tiles */}
            {[22,26,30,34,38,42,46].map((x, i) => (
                <line key={i} x1={x} y1="32" x2={x + 10 - i} y2="22" stroke="#5a3515" strokeWidth="0.5" opacity="0.5" />
            ))}

            {/* Door */}
            <rect x="28" y="40" width="10" height="14" rx="2" fill="#1a0d05" />
            {/* Window */}
            <rect x="16" y="36" width="8" height="6" rx="1" fill="#0d2a4a" stroke="#3a2010" strokeWidth="0.5" />
            <line x1="20" y1="36" x2="20" y2="42" stroke="#3a2010" strokeWidth="0.5" />
            <rect x="40" y="36" width="8" height="6" rx="1" fill="#0d2a4a" stroke="#3a2010" strokeWidth="0.5" />
            <line x1="44" y1="36" x2="44" y2="42" stroke="#3a2010" strokeWidth="0.5" />

            {/* Mast */}
            <rect x="55" y="12" width="3" height="42" rx="1" fill="#6a4520" />
            {/* Flag */}
            <polygon points="58,12 72,18 58,24" fill="#2244aa" opacity="0.85" />
            {/* Rigging ropes */}
            <line x1="56" y1="14" x2="30" y2="32" stroke="#aa8855" strokeWidth="0.8" opacity="0.6" />
            <line x1="58" y1="14" x2="68" y2="32" stroke="#aa8855" strokeWidth="0.8" opacity="0.6" />

            {/* Fishing rod and line */}
            <line x1="68" y1="38" x2="78" y2="52" stroke="#aa8855" strokeWidth="1" strokeLinecap="round" />
            <line x1="78" y1="52" x2="76" y2="62" stroke="#aa8855" strokeWidth="0.7" strokeDasharray="2,2" />
            <circle cx="76" cy="64" r="1.5" fill="#ff4444" opacity="0.8" />

            {/* Fish in water */}
            <path d="M22,65 Q28,62 32,65 Q28,68 22,65 Z" fill="#4a9a8a" opacity="0.7" />
            <path d="M18,65 L22,62 L22,68 Z" fill="#3a8a7a" opacity="0.7" />
            <circle cx="31" cy="65" r="0.8" fill="#000" />

            {/* Crates on dock */}
            <rect x="8" y="46" width="8" height="6" rx="0.5" fill="#7a5030" />
            <line x1="8" y1="49" x2="16" y2="49" stroke="#5a3510" strokeWidth="0.5" />
            <line x1="12" y1="46" x2="12" y2="52" stroke="#5a3510" strokeWidth="0.5" />
        </svg>
    );
}
