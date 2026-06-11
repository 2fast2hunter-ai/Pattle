import React from 'react';

export default function TechFactorySprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Ground */}
            <rect x="0" y="66" width="80" height="14" fill="#0a1420" />

            {/* Main building body */}
            <rect x="10" y="36" width="60" height="32" rx="1" fill="#0e2a40" />
            {/* Paneling lines */}
            <rect x="10" y="36" width="60" height="32" rx="1" fill="none" stroke="#1a3a5a" strokeWidth="1" />
            <line x1="10" y1="48" x2="70" y2="48" stroke="#1a3a5a" strokeWidth="0.7" />
            <line x1="10" y1="58" x2="70" y2="58" stroke="#1a3a5a" strokeWidth="0.7" />
            <line x1="28" y1="36" x2="28" y2="68" stroke="#1a3a5a" strokeWidth="0.7" />
            <line x1="52" y1="36" x2="52" y2="68" stroke="#1a3a5a" strokeWidth="0.7" />

            {/* Upper section */}
            <rect x="16" y="24" width="48" height="14" rx="1" fill="#0c2238" />
            <rect x="16" y="24" width="48" height="14" rx="1" fill="none" stroke="#1a3a5a" strokeWidth="0.8" />

            {/* Rooftop structures */}
            <rect x="22" y="16" width="12" height="10" rx="0.5" fill="#0c2238" stroke="#1a3a5a" strokeWidth="0.8" />
            <rect x="46" y="16" width="12" height="10" rx="0.5" fill="#0c2238" stroke="#1a3a5a" strokeWidth="0.8" />

            {/* Antenna */}
            <line x1="40" y1="24" x2="40" y2="6" stroke="#3a6a8a" strokeWidth="1.5" />
            <line x1="36" y1="10" x2="44" y2="10" stroke="#3a6a8a" strokeWidth="1" />
            <line x1="34" y1="13" x2="46" y2="13" stroke="#3a6a8a" strokeWidth="0.8" />
            <circle cx="40" cy="6" r="2" fill="#00aaff" opacity="0.9" />
            <circle cx="40" cy="6" r="3.5" fill="none" stroke="#00aaff" strokeWidth="0.5" opacity="0.4" />

            {/* Radar dish */}
            <path d="M56,14 Q62,10 68,14" fill="none" stroke="#2a5a7a" strokeWidth="2" />
            <line x1="62" y1="10" x2="62" y2="18" stroke="#2a5a7a" strokeWidth="1.5" />
            <circle cx="62" cy="19" r="1" fill="#4a8aaa" />

            {/* Glowing windows / screens */}
            <rect x="13" y="38" width="13" height="8" rx="1" fill="#0a3060" stroke="#1a6aaa" strokeWidth="0.8" />
            <rect x="14" y="39" width="11" height="6" rx="0.5" fill="#0a2550" />
            {/* Circuit lines on left panel */}
            <line x1="15" y1="41" x2="20" y2="41" stroke="#00aaff" strokeWidth="0.5" opacity="0.8" />
            <line x1="20" y1="41" x2="20" y2="43" stroke="#00aaff" strokeWidth="0.5" opacity="0.8" />
            <line x1="17" y1="43" x2="23" y2="43" stroke="#00aaff" strokeWidth="0.5" opacity="0.8" />
            <circle cx="15" cy="41" r="0.8" fill="#00aaff" opacity="0.9" />
            <circle cx="23" cy="43" r="0.8" fill="#00aaff" opacity="0.9" />

            {/* Central glowing screen */}
            <rect x="30" y="38" width="20" height="8" rx="1" fill="#0a2050" stroke="#0a8aaa" strokeWidth="0.8" />
            <rect x="31" y="39" width="18" height="6" rx="0.5" fill="#051830" />
            {/* Screen content */}
            <line x1="32" y1="42" x2="48" y2="42" stroke="#00ffaa" strokeWidth="0.5" opacity="0.6" />
            <line x1="32" y1="43.5" x2="44" y2="43.5" stroke="#00ffaa" strokeWidth="0.5" opacity="0.4" />
            <circle cx="34" cy="40.5" r="1" fill="#00ff88" opacity="0.8" />
            <circle cx="38" cy="40.5" r="0.7" fill="#ff8800" opacity="0.8" />

            {/* Right panel */}
            <rect x="54" y="38" width="13" height="8" rx="1" fill="#0a3060" stroke="#1a6aaa" strokeWidth="0.8" />

            {/* Door */}
            <rect x="33" y="54" width="14" height="14" rx="1" fill="#050e1a" />
            <rect x="34" y="55" width="12" height="12" rx="0.5" fill="#060f1f" />
            {/* Door panel lines */}
            <line x1="40" y1="55" x2="40" y2="67" stroke="#1a3a5a" strokeWidth="0.7" />
            <line x1="34" y1="61" x2="46" y2="61" stroke="#1a3a5a" strokeWidth="0.7" />
            <circle cx="44" cy="61" r="1" fill="#00aaff" opacity="0.7" />

            {/* Exhaust pipes */}
            <rect x="14" y="26" width="4" height="12" rx="1" fill="#1a3a50" />
            <rect x="62" y="26" width="4" height="12" rx="1" fill="#1a3a50" />
            {/* Exhaust glow */}
            <circle cx="16" cy="25" r="2.5" fill="#00aaff" opacity="0.15" />
            <circle cx="64" cy="25" r="2.5" fill="#00aaff" opacity="0.15" />

            {/* Ambient glow under building */}
            <ellipse cx="40" cy="68" rx="28" ry="4" fill="#005580" opacity="0.12" />
        </svg>
    );
}
