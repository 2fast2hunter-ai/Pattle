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

        /* ELEMENT BACKGROUND ANIMATIONEN */
        @keyframes fire-flicker {
            0%   { transform: scaleY(1)   scaleX(1)   translateY(0);   opacity: 0.9; }
            25%  { transform: scaleY(1.08) scaleX(0.96) translateY(-4%); opacity: 1; }
            50%  { transform: scaleY(0.94) scaleX(1.04) translateY(2%);  opacity: 0.85; }
            75%  { transform: scaleY(1.05) scaleX(0.98) translateY(-3%); opacity: 0.95; }
            100% { transform: scaleY(1)   scaleX(1)   translateY(0);   opacity: 0.9; }
        }
        @keyframes fire-ember-rise {
            0%   { transform: translateY(0)    translateX(0)    scale(1);   opacity: 0.8; }
            30%  { opacity: 1; }
            60%  { transform: translateY(-60vh) translateX(15px)  scale(0.6); opacity: 0.5; }
            100% { transform: translateY(-110vh) translateX(-10px) scale(0.1); opacity: 0; }
        }
        @keyframes water-ripple {
            0%   { transform: scale(0.8) translateX(0);   opacity: 0.4; }
            50%  { transform: scale(1.2) translateX(8px);  opacity: 0.7; }
            100% { transform: scale(0.8) translateX(0);   opacity: 0.4; }
        }
        @keyframes water-wave {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes ice-shimmer {
            0%, 100% { opacity: 0.15; transform: rotate(0deg) scale(1); }
            50%       { opacity: 0.45; transform: rotate(3deg) scale(1.05); }
        }
        @keyframes grass-sway {
            0%, 100% { transform: rotate(-3deg) scaleY(1); transform-origin: bottom center; }
            50%       { transform: rotate(3deg)  scaleY(1.04); transform-origin: bottom center; }
        }
        @keyframes leaf-drift {
            0%   { transform: translateY(-5vh)  translateX(0)   rotate(0deg);   opacity: 0; }
            10%  { opacity: 0.7; }
            90%  { opacity: 0.5; }
            100% { transform: translateY(110vh) translateX(40px) rotate(720deg); opacity: 0; }
        }
        @keyframes dark-pulse {
            0%, 100% { opacity: 0.06; transform: scale(1); }
            50%       { opacity: 0.18; transform: scale(1.08); }
        }
        @keyframes void-swirl {
            0%   { transform: rotate(0deg)   scale(1); opacity: 0.3; }
            100% { transform: rotate(360deg) scale(1.2); opacity: 0; }
        }
        @keyframes lightning-bolt {
            0%, 85%, 100% { opacity: 0; }
            87%, 93%      { opacity: 0.9; }
            90%           { opacity: 0.3; }
        }
        @keyframes electric-spark {
            0%   { transform: translateY(0)   translateX(0)   scale(1);   opacity: 0; }
            20%  { opacity: 1; }
            50%  { transform: translateY(-40px) translateX(20px)  scale(0.5); opacity: 0.8; }
            100% { transform: translateY(-80px) translateX(-15px) scale(0.1); opacity: 0; }
        }
        @keyframes tech-scan {
            0%   { transform: translateY(-100%); opacity: 0; }
            10%  { opacity: 0.4; }
            90%  { opacity: 0.2; }
            100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes magic-orb-float {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            33%       { transform: translate(12px, -18px) scale(1.1); opacity: 0.8; }
            66%       { transform: translate(-8px, 10px) scale(0.9); opacity: 0.4; }
        }
        @keyframes bg-breathe {
            0%, 100% { opacity: 0.85; }
            50%       { opacity: 1; }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-dash-right { animation: dash-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-dash-left { animation: dash-left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-cast { animation: cast-pulse 0.5s ease-out; }
        .animate-hit { animation: hit-shake 0.4s ease-in-out; }
        .animate-rain { animation: rain-fall 0.6s linear infinite; }
        .animate-snow { animation: snow-fall 6s linear infinite; }
        .animate-ash { animation: ash-float 8s linear infinite; }
        .animate-flash { animation: flash 6s infinite; }
        .animate-fire-flicker { animation: fire-flicker 2s ease-in-out infinite; }
        .animate-ember { animation: fire-ember-rise 4s linear infinite; }
        .animate-water-ripple { animation: water-ripple 3s ease-in-out infinite; }
        .animate-water-wave { animation: water-wave 8s linear infinite; }
        .animate-ice-shimmer { animation: ice-shimmer 4s ease-in-out infinite; }
        .animate-grass-sway { animation: grass-sway 2.5s ease-in-out infinite; }
        .animate-leaf { animation: leaf-drift 8s linear infinite; }
        .animate-dark-pulse { animation: dark-pulse 4s ease-in-out infinite; }
        .animate-void-swirl { animation: void-swirl 12s linear infinite; }
        .animate-lightning { animation: lightning-bolt 5s linear infinite; }
        .animate-spark { animation: electric-spark 3s linear infinite; }
        .animate-tech-scan { animation: tech-scan 4s linear infinite; }
        .animate-magic-orb { animation: magic-orb-float 5s ease-in-out infinite; }
        .animate-bg-breathe { animation: bg-breathe 4s ease-in-out infinite; }
    `}</style>
);