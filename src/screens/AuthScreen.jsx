import React, { useState } from 'react';
import { Egg, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Importiere unsere Auth-Instanz

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
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
      
      <div className="w-24 h-24 bg-indigo-600 rounded-3xl mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3 animate-bounce">
        <Egg className="w-12 h-12 text-white" />
      </div>
      
      <h1 className="text-3xl font-black mb-2 tracking-wide">MONSTER<br/>EVOLUTION</h1>
      <p className="text-slate-400 mb-8 text-sm font-bold uppercase tracking-widest">RPG Edition</p>

      <div className="w-full max-w-sm bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
        
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
                <input type="text" placeholder="Spielername" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-colors" required />
             </div>
          )}
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Mail className="w-4 h-4" /></div>
            <input type="email" placeholder="E-Mail Adresse" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-colors" required />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Lock className="w-4 h-4" /></div>
            <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-colors" required />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-600 disabled:text-slate-400 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 mt-4">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isRegistering ? 'KONTO ERSTELLEN' : 'EINLOGGEN')}
          </button>
        </form>

      </div>
    </div>
  );
}