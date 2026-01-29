import React from 'react';

export default function FloatingBadge({ text }) {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-50 animate-bounce pointer-events-none">
            <span className="text-4xl font-black text-green-400 drop-shadow-lg" style={{ WebkitTextStroke: '1px black' }}>{text}</span>
        </div>
    );
}