import React from 'react';
import { ArrowLeft, Globe, LogOut, Music, Volume2, Scale, ChevronRight, ScrollText, MessageSquare } from 'lucide-react';
import { playSound } from '../utils/soundManager';

export default function SettingsScreen({ settings, setSettings, onLogout, onBack, onNavigate, t }) {
    const currentSettings = settings || {};
    const language = currentSettings.language || 'de'; // Standard: Deutsch
    const musicEnabled = currentSettings.musicEnabled !== false; // Default: true
    const soundEnabled = currentSettings.soundEnabled !== false; // Default: true

    const toggleMusic = () => {
        setSettings({ ...currentSettings, musicEnabled: !musicEnabled });
        playSound('click');
    };

    const toggleSound = () => {
        setSettings({ ...currentSettings, soundEnabled: !soundEnabled });
        playSound('click');
    };

    const handleLanguageChange = (lang) => {
        setSettings({ ...currentSettings, language: lang });
        playSound('click');
    };

    const LANGUAGES = [
        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
        { code: 'fr', label: 'French', flag: '🇫🇷' },
        { code: 'es', label: 'Spanish', flag: '🇪🇸' }
    ];

    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
            {/* HEADER */}
            <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                <button
                    onClick={() => { onBack(); playSound('click'); }}
                    className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black italic tracking-wide text-white">{t ? t('settings_title') : 'EINSTELLUNGEN'}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">

                {/* AUDIO EINSTELLUNGEN */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                        <Volume2 className="w-4 h-4" /> Audio
                    </h3>
                    
                    {/* Musik Toggle */}
                    <button 
                        onClick={toggleMusic}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${musicEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                <Music className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-white text-sm">{t ? t('settings_music') : 'Musik'}</span>
                        </div>
                        <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${musicEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{musicEnabled ? (t ? t('settings_on') : 'AN') : (t ? t('settings_off') : 'AUS')}</span>
                    </button>

                    {/* Sound Toggle */}
                    <button 
                        onClick={toggleSound}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${soundEnabled ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                <Volume2 className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-white text-sm">{t ? t('settings_sound') : 'Soundeffekte'}</span>
                        </div>
                        <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${soundEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{soundEnabled ? (t ? t('settings_on') : 'AN') : (t ? t('settings_off') : 'AUS')}</span>
                    </button>
                </div>

                {/* SPRACHE */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                        <Globe className="w-4 h-4" /> {t ? t('settings_language') : 'Sprache'}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`
                                    flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98]
                                    ${language === lang.code
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                        : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-white/10'
                                    }
                                `}
                            >
                                <span className="font-bold flex items-center gap-4">
                                    <span className="text-2xl drop-shadow-sm">{lang.flag}</span>
                                    <span className="text-sm">{lang.label}</span>
                                </span>
                                {language === lang.code && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PATCHES */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                        <ScrollText className="w-4 h-4" /> {t ? t('settings_patches') : 'Updates'}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => { onNavigate('patches'); playSound('click'); }} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600/20 text-indigo-400">
                                    <ScrollText className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-white text-sm">{t ? t('settings_patches') : 'Patch Notes'}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                        <button onClick={() => { onNavigate('feedback'); playSound('click'); }} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-pink-600/20 text-pink-400">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-white text-sm">{t ? t('settings_feedback') : 'Feedback senden'}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* RECHTLICHES */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                        <Scale className="w-4 h-4" /> {t ? t('settings_legal') : 'Rechtliches'}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => onNavigate('legal-imprint')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition-all active:scale-[0.98]">
                            <span className="font-bold text-white text-sm">{t ? t('legal_imprint') : 'Impressum'}</span>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                        <button onClick={() => onNavigate('legal-privacy')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition-all active:scale-[0.98]">
                            <span className="font-bold text-white text-sm">{t ? t('legal_privacy') : 'Datenschutz'}</span>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* LOGOUT */}
                <div className="pt-4">
                    <button
                        onClick={() => { onLogout(); playSound('click'); }}
                        className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <LogOut className="w-5 h-5" /> {t ? t('settings_logout') : 'Abmelden'}
                    </button>
                </div>

            </div>
        </div>
    );
}