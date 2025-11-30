import React, { useState } from 'react';
import { Egg } from 'lucide-react';

export default function AuthScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white p-8 justify-center items-center text-center">
      <div className="w-32 h-32 bg-indigo-600 rounded-3xl mb-8 flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3"><Egg className="w-16 h-16 text-white" /></div>
      <h1 className="text-4xl font-black mb-2">MONSTER<br/>EVOLUTION</h1>
      <p className="text-slate-400 mb-8">RPG Edition</p>
      <input type="text" placeholder="Dein Spielername" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 text-center font-bold focus:border-indigo-500 outline-none" />
      <button onClick={() => onLogin(username)} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-4 rounded-xl mb-4 shadow-lg transition-all active:scale-95">STARTEN</button>
      <button onClick={() => onLogin('Gast', true)} className="text-slate-500 text-sm font-bold">Als Gast spielen</button>
    </div>
  );
}