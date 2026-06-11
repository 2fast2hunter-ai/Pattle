import React from 'react';

export default function CrystalFieldSprite({ className, style }) {
    return (
        <svg viewBox="0 0 80 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            {/* Cave floor */}
            <rect x="0" y="62" width="80" height="18" fill="#100820" />

            {/* Cave rock formation - base */}
            <path d="M0,62 Q8,55 15,58 Q22,48 30,52 Q38,40 40,42 Q42,40 50,52 Q58,48 65,58 Q72,55 80,62 L80,80 L0,80 Z"
                fill="#1a1030" />
            {/* Rock texture lines */}
            <path d="M10,65 Q16,62 20,65" fill="none" stroke="#2a1848" strokeWidth="0.6" opacity="0.6" />
            <path d="M55,65 Q62,62 68,65" fill="none" stroke="#2a1848" strokeWidth="0.6" opacity="0.6" />

            {/* Main crystal cluster - center */}
            <polygon points="40,42 36,62 44,62" fill="#7733cc" stroke="#aa55ff" strokeWidth="0.8" />
            <polygon points="40,42 38,62 36,62" fill="#9944ee" opacity="0.7" />
            <polygon points="40,42 42,62 44,62" fill="#6622aa" opacity="0.5" />

            {/* Crystal cluster - left group */}
            <polygon points="26,50 22,65 30,65" fill="#6622bb" stroke="#9944ee" strokeWidth="0.6" />
            <polygon points="26,50 24,65 22,65" fill="#7733cc" opacity="0.6" />

            <polygon points="20,54 17,65 23,65" fill="#5519aa" stroke="#8833dd" strokeWidth="0.6" />
            <polygon points="20,54 18,65 17,65" fill="#6622bb" opacity="0.5" />

            <polygon points="32,48 29,64 35,64" fill="#8844dd" stroke="#bb66ff" strokeWidth="0.6" />
            <polygon points="32,48 30,64 29,64" fill="#9955ee" opacity="0.6" />

            {/* Crystal cluster - right group */}
            <polygon points="54,50 50,65 58,65" fill="#6622bb" stroke="#9944ee" strokeWidth="0.6" />
            <polygon points="54,50 52,65 50,65" fill="#7733cc" opacity="0.6" />

            <polygon points="60,54 57,65 63,65" fill="#5519aa" stroke="#8833dd" strokeWidth="0.6" />

            <polygon points="48,48 45,64 51,64" fill="#8844dd" stroke="#bb66ff" strokeWidth="0.6" />

            {/* Small accent crystals */}
            <polygon points="12,58 10,65 14,65" fill="#4411aa" stroke="#7733cc" strokeWidth="0.5" />
            <polygon points="68,58 66,65 70,65" fill="#4411aa" stroke="#7733cc" strokeWidth="0.5" />
            <polygon points="38,52 36,60 40,60" fill="#aa55ff" opacity="0.5" />
            <polygon points="42,52 40,60 44,60" fill="#aa55ff" opacity="0.5" />

            {/* Crystal glow highlights */}
            <polygon points="40,44 39,48 41,48" fill="#dd99ff" opacity="0.6" />
            <polygon points="26,52 25,56 27,56" fill="#cc88ff" opacity="0.5" />
            <polygon points="54,52 53,56 55,56" fill="#cc88ff" opacity="0.5" />
            <polygon points="32,50 31,53 33,53" fill="#dd99ff" opacity="0.4" />
            <polygon points="48,50 47,53 49,53" fill="#dd99ff" opacity="0.4" />

            {/* Glow emanation from central crystal */}
            <ellipse cx="40" cy="55" rx="10" ry="5" fill="#7733cc" opacity="0.18" />
            <ellipse cx="40" cy="60" rx="20" ry="5" fill="#5511aa" opacity="0.12" />
            <ellipse cx="40" cy="64" rx="30" ry="4" fill="#4400aa" opacity="0.1" />

            {/* Floating crystal motes */}
            <circle cx="15" cy="40" r="1.2" fill="#cc88ff" opacity="0.7" />
            <circle cx="65" cy="36" r="1" fill="#bb77ff" opacity="0.6" />
            <circle cx="30" cy="30" r="0.8" fill="#dd99ff" opacity="0.5" />
            <circle cx="55" cy="32" r="1" fill="#cc88ff" opacity="0.6" />
            <circle cx="8" cy="46" r="0.8" fill="#aa66ff" opacity="0.5" />
            <circle cx="72" cy="44" r="0.8" fill="#aa66ff" opacity="0.5" />

            {/* Rock opening / cave arch */}
            <path d="M28,52 Q40,42 52,52 L50,62 L30,62 Z" fill="#0a0615" opacity="0.6" />
            <path d="M28,52 Q40,42 52,52" fill="none" stroke="#3a1a60" strokeWidth="1" />

            {/* Ambient cave glow floor */}
            <ellipse cx="40" cy="66" rx="25" ry="3" fill="#6622bb" opacity="0.08" />
        </svg>
    );
}
