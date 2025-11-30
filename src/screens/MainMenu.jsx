import React from 'react';
import { Swords, Egg, Store, ShoppingBag, Trophy, ClipboardList } from 'lucide-react';
import { MenuCard } from '../components/ui/Shared';

export default function MainMenu({ user, onArena, onPetHub, onShop, onMarketplace, onLeaderboard, onQuests }) {
  return (
    <div className="space-y-8 pt-8 text-center h-full flex flex-col">
      {/* Header */}
      <div>
          <h2 className="text-3xl font-black">Willkommen,</h2>
          <h3 className="text-2xl font-black text-indigo-400">{user.username}</h3>
      </div>

      {/* Haupt-Navigation */}
      <div className="flex-1 flex flex-col justify-center gap-4 px-4">
          <button onClick={onArena} className="group relative bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-3xl shadow-xl shadow-red-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-red-400/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">ARENA HUB</h3><p className="text-red-100 text-xs font-bold">Kämpfe & Team</p></div><Swords className="w-12 h-12 text-white fill-white/20" /></div>
          </button>
          <button onClick={onPetHub} className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-3xl shadow-xl shadow-emerald-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-emerald-400/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">PET HUB</h3><p className="text-emerald-100 text-xs font-bold">Sammlung & Zucht</p></div><Egg className="w-12 h-12 text-white fill-white/20" /></div>
          </button>
          <button onClick={onMarketplace} className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-3xl shadow-xl shadow-cyan-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-cyan-400/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">MARKTPLATZ</h3><p className="text-cyan-100 text-xs font-bold">Kaufen & Verkaufen</p></div><Store className="w-12 h-12 text-white fill-white/20" /></div>
          </button>
          <button onClick={onShop} className="group relative bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-3xl shadow-xl shadow-amber-900/30 overflow-hidden transform transition hover:scale-[1.02] active:scale-95 text-left border-2 border-amber-400/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10"><div><h3 className="text-2xl font-black italic text-white mb-1">SHOP</h3><p className="text-amber-100 text-xs font-bold">Lootboxen & Mehr</p></div><ShoppingBag className="w-12 h-12 text-white fill-white/20" /></div>
          </button>
      </div>

      {/* Footer Buttons */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
          <MenuCard 
              icon={ClipboardList} 
              title="Aufgaben" 
              color="bg-amber-500" 
              onClick={onQuests} 
          />
          <MenuCard icon={Trophy} title="Bestenliste" color="bg-indigo-500" onClick={onLeaderboard} />
      </div>
    </div>
  );
}