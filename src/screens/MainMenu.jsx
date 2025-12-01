import React from 'react';
import { Swords, Egg, Store, ShoppingBag, Trophy, ClipboardList, User, Settings } from 'lucide-react';

export default function MainMenu({ user, onArena, onPetHub, onShop, onMarketplace, onLeaderboard, onQuests, onProfile, onSettings }) {
  
  const menuItems = [
      { 
          id: 'arena', title: 'ARENA', subtitle: 'Kämpfe',
          icon: Swords, color: 'from-red-600 to-orange-600', shadow: 'shadow-red-900/20',
          onClick: onArena
      },
      { 
          id: 'pethub', title: 'PET HUB', subtitle: 'Sammlung',
          icon: Egg, color: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-900/20',
          onClick: onPetHub
      },
      { 
          id: 'quests', title: 'AUFGABEN', subtitle: 'Missionen',
          icon: ClipboardList, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-900/20',
          onClick: onQuests
      },
      { 
          id: 'marketplace', title: 'MARKT', subtitle: 'Handel',
          icon: Store, color: 'from-blue-600 to-cyan-600', shadow: 'shadow-cyan-900/20',
          onClick: onMarketplace
      },
      { 
          id: 'shop', title: 'SHOP', subtitle: 'Items',
          icon: ShoppingBag, color: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-900/20',
          onClick: onShop
      },
      { 
          id: 'leaderboard', title: 'RANGLISTE', subtitle: 'Top Spieler',
          icon: Trophy, color: 'from-indigo-600 to-violet-600', shadow: 'shadow-indigo-900/20',
          onClick: onLeaderboard
      },
      { 
          id: 'profile', title: 'PROFIL', subtitle: 'Stats',
          icon: User, color: 'from-pink-600 to-rose-600', shadow: 'shadow-pink-900/20',
          onClick: onProfile
      },
      { 
          id: 'settings', title: 'OPTIONEN', subtitle: 'System',
          icon: Settings, color: 'from-slate-600 to-slate-700', shadow: 'shadow-slate-900/20',
          onClick: onSettings
      },
  ];

  return (
    <div className="pt-4 pb-24 px-4 space-y-4 h-full overflow-y-auto scrollbar-hide">
      
      {/* --- GRID LAYOUT (Kacheln) --- */}
      <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={item.onClick} 
                className={`
                    group relative w-full aspect-square p-0.5 rounded-[24px] shadow-lg ${item.shadow}
                    bg-gradient-to-br ${item.color}
                    transform transition-all duration-200 hover:scale-[1.02] active:scale-95
                `}
              >
                  <div className="bg-slate-900/40 backdrop-blur-sm rounded-[22px] p-4 h-full flex flex-col items-center justify-center text-center border border-white/10 gap-3">
                      
                      {/* Icon Container */}
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-7 h-7 text-white drop-shadow-md" />
                      </div>
                      
                      {/* Text */}
                      <div>
                          <h3 className="text-lg font-black italic text-white leading-none drop-shadow-sm mb-1">{item.title}</h3>
                          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{item.subtitle}</p>
                      </div>

                  </div>
              </button>
          ))}
      </div>
    </div>
  );
}