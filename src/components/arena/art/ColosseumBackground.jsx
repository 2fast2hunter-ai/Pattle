import React from 'react';

export default function ColosseumBackground({ className }) {
    return (
        <svg
            viewBox="0 0 400 200"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax meet"
        >
            {/* Sky gradient fills handled by parent; this is pure silhouette */}

            {/* Far background colosseum ring - outermost */}
            <ellipse cx="200" cy="180" rx="195" ry="50" fill="#1a0a0a" opacity="0.6" />

            {/* Colosseum outer wall */}
            <path d="
                M10,180
                Q10,130 50,120
                Q80,112 110,108
                Q140,104 160,102
                Q180,100 200,100
                Q220,100 240,102
                Q260,104 290,108
                Q320,112 350,120
                Q390,130 390,180
                Z
            " fill="#1e0c0c" />

            {/* Outer arch row - bottom tier */}
            {[30,58,86,114,142,170,198,226,254,282,310,338,366].map((x, i) => (
                <g key={i}>
                    <rect x={x - 10} y={160 - Math.abs(6 - i) * 3.5} width="16" height={25 + Math.abs(6 - i) * 3.5} rx="0" fill="#2a1010" />
                    <path d={`M${x - 10},${162 - Math.abs(6 - i) * 3.5} Q${x},${156 - Math.abs(6 - i) * 3.5} ${x + 6},${162 - Math.abs(6 - i) * 3.5}`}
                        fill="#0a0404" />
                </g>
            ))}

            {/* Mid tier wall */}
            <path d="
                M30,158
                Q60,145 100,138
                Q140,132 180,130
                Q200,129 220,130
                Q260,132 300,138
                Q340,145 370,158
                L370,165 L30,165 Z
            " fill="#260e0e" />

            {/* Mid tier arches */}
            {[48,76,104,132,160,188,216,244,272,300,328,356].map((x, i) => (
                <g key={i}>
                    <rect x={x - 9} y={147 - Math.abs(5.5 - i) * 2} width="14" height={20 + Math.abs(5.5 - i) * 2} rx="0" fill="#1e0a0a" />
                    <path d={`M${x - 9},${149 - Math.abs(5.5 - i) * 2} Q${x},${143 - Math.abs(5.5 - i) * 2} ${x + 5},${149 - Math.abs(5.5 - i) * 2}`}
                        fill="#080202" />
                </g>
            ))}

            {/* Upper tier wall */}
            <path d="
                M55,140
                Q80,130 120,124
                Q160,118 200,116
                Q240,118 280,124
                Q320,130 345,140
                L345,148 L55,148 Z
            " fill="#2e1212" />

            {/* Upper tier arches (smaller) */}
            {[68,92,116,140,164,188,212,236,260,284,308,332].map((x, i) => (
                <g key={i}>
                    <rect x={x - 8} y={132 - Math.abs(5.5 - i) * 1.5} width="12" height={18 + Math.abs(5.5 - i) * 1.5} rx="0" fill="#1e0a0a" />
                    <path d={`M${x - 8},${134 - Math.abs(5.5 - i) * 1.5} Q${x},${129 - Math.abs(5.5 - i) * 1.5} ${x + 4},${134 - Math.abs(5.5 - i) * 1.5}`}
                        fill="#060202" />
                </g>
            ))}

            {/* Top battlements / cornice */}
            <path d="
                M70,118
                Q100,110 140,106
                Q170,103 200,102
                Q230,103 260,106
                Q300,110 330,118
                L330,124 L70,124 Z
            " fill="#381414" />

            {/* Battlement merlons */}
            {[80,96,112,128,144,160,176,192,208,224,240,256,272,288,304,320].map((x, i) => (
                <rect key={i} x={x - 5} y={108 + Math.abs(7.5 - i) * 1.2} width="8" height="10" rx="0.5"
                    fill="#2a0e0e" />
            ))}

            {/* Torches on battlements */}
            {[100,200,300].map((x, i) => (
                <g key={i}>
                    <rect x={x - 1} y={105 - (x === 200 ? 6 : 0)} width="2" height="8" rx="0.5" fill="#8a5530" />
                    <ellipse cx={x} cy={102 - (x === 200 ? 6 : 0)} rx="3" ry="4" fill="#ff6622" opacity="0.7" />
                    <ellipse cx={x} cy={101 - (x === 200 ? 6 : 0)} rx="2" ry="3" fill="#ffaa22" opacity="0.8" />
                </g>
            ))}

            {/* Central grand arch above entrance */}
            <path d="M165,124 Q200,90 235,124" fill="none" stroke="#4a1818" strokeWidth="3" />
            <path d="M170,124 Q200,94 230,124" fill="none" stroke="#2a0e0e" strokeWidth="2" />

            {/* Subtle red fire glow at bottom */}
            <ellipse cx="200" cy="185" rx="180" ry="25" fill="#880000" opacity="0.08" />
            <ellipse cx="200" cy="190" rx="140" ry="18" fill="#aa1100" opacity="0.06" />
        </svg>
    );
}
