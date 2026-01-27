import React, { useState } from 'react';
import { Egg, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Importiere unsere Auth-Instanz
import { PageBackground } from '../components/GameLayout';

export default function AuthScreen({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Funktion für E-Mail Auth (Login oder Registrieren)
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const user = userCredential.user;
      // Erfolg! Wir geben den User an die App weiter
      // Bei Login nutzen wir die Email als Namen (falls kein DisplayName gesetzt), bei Register den eingegebenen Namen
      const displayName = username || user.email.split('@')[0];
      onLogin(user, displayName); 
      
    } catch (err) {
      console.error(err);
      let msg = "Ein Fehler ist aufgetreten.";
      if (err.code === 'auth/invalid-email') msg = "Ungültige E-Mail Adresse.";
      if (err.code === 'auth/user-not-found') msg = "Benutzer nicht gefunden.";
      if (err.code === 'auth/wrong-password') msg = "Falsches Passwort.";
      if (err.code === 'auth/email-already-in-use') msg = "E-Mail wird bereits verwendet.";
      if (err.code === 'auth/weak-password') msg = "Passwort muss mind. 6 Zeichen haben.";
      if (err.code === 'auth/invalid-credential') msg = "Falsche Zugangsdaten.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white p-6 justify-center items-center relative overflow-hidden">
      {/* Hintergrund Deko */}
      <PageBackground />
      
      <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] mb-8 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.6)] rotate-3 animate-float-slow border-4 border-white/10 relative z-10">
        <Egg className="w-14 h-14 text-white drop-shadow-md" />
      </div>
      
      <h1 className="text-4xl font-black mb-2 tracking-tight text-center text-white drop-shadow-lg relative z-10">MONSTER<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">EVOLUTION</span></h1>
      <p className="text-indigo-200 mb-10 text-xs font-black uppercase tracking-[0.3em] bg-slate-900/50 backdrop-blur px-4 py-1.5 rounded-full border border-white/10 relative z-10">RPG Edition</p>

      <div className="w-full max-w-sm bg-slate-900/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {/* Toggle Login / Register */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl mb-6">
          <button onClick={() => { setIsRegistering(false); setError(null); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isRegistering ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>ANMELDEN</button>
          <button onClick={() => { setIsRegistering(true); setError(null); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isRegistering ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>REGISTRIEREN</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200 text-xs font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3">
          {isRegistering && (
             <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><User className="w-4 h-4" /></div>
                <input type="text" placeholder="Spielername" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all placeholder:text-slate-600" required />
             </div>
          )}
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Mail className="w-4 h-4" /></div>
            <input type="email" placeholder="E-Mail Adresse" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all placeholder:text-slate-600" required />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Lock className="w-4 h-4" /></div>
            <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all placeholder:text-slate-600" required />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex justify-center items-center gap-2 mt-6">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isRegistering ? 'KONTO ERSTELLEN' : 'EINLOGGEN')}
          </button>
        </form>

      </div>
    </div>
  );
}