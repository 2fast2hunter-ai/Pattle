import React from 'react';
import { Loader2 } from 'lucide-react';
import PetAvatar from '../PetAvatar';
import { TRANSLATIONS } from '../../data/translations';

const tl = (key, params) => {
    try {
        const saved = JSON.parse(localStorage.getItem('game_settings') || '{}');
        const lang = saved.language || (navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en');
        let str = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
        if (params) Object.entries(params).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
        return str;
    } catch { return TRANSLATIONS['en']?.[key] || key; }
};

export default function LoadingScreen({ loadingPet, loadingProgress }) {
    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>

            <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-1000">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.6)] mb-8 animate-bounce border-4 border-white/10">
                    {loadingPet ? <PetAvatar pet={loadingPet} className="w-24 h-24 drop-shadow-md" /> : <span className="text-6xl">🦁</span>}
                </div>
                <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 drop-shadow-lg text-center">Pattle</h1>

                <div className="w-64 h-1.5 bg-slate-800/50 rounded-full overflow-hidden border border-white/10 mb-6 relative shadow-inner backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-75 ease-linear shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/80 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-xl">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">{tl('loading_world', { progress: Math.floor(loadingProgress) })}</p>
                </div>
            </div>
        </div>
    );
}
