import React from 'react';

export const BattleStyles = () => (
    <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes dash-right { 0% { transform: translateX(0) scale(1); } 50% { transform: translateX(40px) scale(1.1); } 100% { transform: translateX(0) scale(1); } }
        @keyframes dash-left { 0% { transform: translateX(0) scale(1); } 50% { transform: translateX(-40px) scale(1.1); } 100% { transform: translateX(0) scale(1); } }
        @keyframes cast-pulse { 0% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.1); filter: brightness(1.5); } 100% { transform: scale(1); filter: brightness(1); } }
        @keyframes hit-shake { 0%, 100% { transform: translateX(0); filter: none; } 25% { transform: translateX(-5px) rotate(-5deg); filter: sepia(1) hue-rotate(-50deg) saturate(5); } 75% { transform: translateX(5px) rotate(5deg); filter: sepia(1) hue-rotate(-50deg) saturate(5); } }
        
        /* PARTIKEL ANIMATIONEN */
        @keyframes particle-rise { 0% { transform: translateY(110vh) scale(0); opacity: 0; } 20% { opacity: 0.6; } 100% { transform: translateY(-10vh) scale(1.5); opacity: 0; } }
        @keyframes particle-fall { 0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; } 20% { opacity: 0.8; } 100% { transform: translateY(110vh) translateX(50px) rotate(360deg); opacity: 0; } }
        @keyframes particle-float-random { 0% { transform: translate(0,0); opacity: 0; } 25% { opacity: 0.4; } 50% { transform: translate(20px, -30px); } 75% { opacity: 0.4; } 100% { transform: translate(-20px, 30px); opacity: 0; } }
        
        /* WETTER ANIMATIONEN */
        @keyframes rain-fall { 0% { transform: translateY(-20vh); } 100% { transform: translateY(120vh); } }
        @keyframes snow-fall { 0% { transform: translateY(-10vh) translateX(0); } 100% { transform: translateY(110vh) translateX(20px); } }
        @keyframes ash-float { 0% { transform: translateY(110vh) translateX(0); opacity: 0; } 20% { opacity: 0.8; } 100% { transform: translateY(-10vh) translateX(40px); opacity: 0; } }
        @keyframes flash { 0%, 90%, 100% { opacity: 0; } 92%, 98% { opacity: 0.3; background-color: white; } }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-dash-right { animation: dash-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-dash-left { animation: dash-left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-cast { animation: cast-pulse 0.5s ease-out; }
        .animate-hit { animation: hit-shake 0.4s ease-in-out; }
        .animate-rain { animation: rain-fall 0.6s linear infinite; }
        .animate-snow { animation: snow-fall 6s linear infinite; }
        .animate-ash { animation: ash-float 8s linear infinite; }
        .animate-flash { animation: flash 6s infinite; }
    `}</style>
);