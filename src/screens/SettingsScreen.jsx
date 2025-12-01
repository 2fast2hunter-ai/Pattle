import React from 'react';
import { Volume2, VolumeX, Zap, LogOut, X } from 'lucide-react'; // X importiert

function SettingRow({ icon: Icon, label, active, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 last:border-0" onClick={onToggle}>
      <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-500'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-slate-200">{label}</span>
      </div>
      <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-indigo-500' : 'bg-slate-700'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}

export default function SettingsScreen({ settings, setSettings, onLogout, onBack }) { // onBack prop hinzugefügt
    const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });
    
    return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
        
        {/* --- HEADER --- */}
        <div className="relative flex items-center justify-center mb-6 pt-6 px-4">
            <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
                OPTIONEN
            </h1>
            <button 
                onClick={onBack} 
                className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="px-4 space-y-6">
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                <SettingRow icon={settings.music ? Volume2 : VolumeX} label="Hintergrundmusik" active={settings.music} onToggle={() => toggle('music')} />
                <SettingRow icon={settings.sfx ? Zap : VolumeX} label="Soundeffekte" active={settings.sfx} onToggle={() => toggle('sfx')} />
            </div>
            
            <div className="pt-8">
                <button 
                    onClick={onLogout} 
                    className="w-full bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-2xl flex items-center justify-center gap-2 font-black hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg"
                >
                    <LogOut className="w-5 h-5" /> 
                    ABMELDEN
                </button>
                <p className="text-center text-slate-600 text-xs mt-4 font-mono">Version 1.0.0 • Build 2025</p>
            </div>
        </div>
      </div>
    );
}