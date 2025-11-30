import React from 'react';
import { Volume2, VolumeX, Zap, LogOut } from 'lucide-react';

function SettingRow({ icon: Icon, label, active, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 cursor-pointer hover:bg-white/5" onClick={onToggle}>
      <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-slate-400" /><span className="font-medium">{label}</span></div>
      <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${active ? 'bg-indigo-500' : 'bg-slate-700'}`}><div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} /></div>
    </div>
  );
}

export default function SettingsScreen({ settings, setSettings, onLogout }) {
    const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });
    return (
      <div className="pt-4 space-y-6"><h2 className="text-2xl font-bold">Einstellungen</h2><div className="bg-slate-800 rounded-2xl overflow-hidden border border-white/5"><SettingRow icon={settings.music ? Volume2 : VolumeX} label="Musik" active={settings.music} onToggle={() => toggle('music')} /><SettingRow icon={settings.sfx ? Zap : VolumeX} label="Soundeffekte" active={settings.sfx} onToggle={() => toggle('sfx')} /></div><button onClick={onLogout} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl flex items-center justify-center gap-2 font-bold"><LogOut className="w-5 h-5" /> Abmelden</button></div>
    );
}