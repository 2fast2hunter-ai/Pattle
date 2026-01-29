import React, { useState, useEffect } from 'react';
import { Swords, Egg, Store, ShoppingBag, Trophy, ClipboardList, User, Settings, Home, Lock } from 'lucide-react';
import { PageBackground } from '../components/GameLayout';
import DailyLoginModal from '../components/modals/DailyLoginModal';
import { claimDailyLoginReward } from '../utils/db';

// --- RIPPLE BUTTON COMPONENT ---
const MenuTile = ({ item, index, onClick }) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        if (item.locked) return;
        
        // Ripple Position berechnen
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const newRipple = { x, y, size, id: Date.now() };
        setRipples(prev => [...prev, newRipple]);
        
        // Ripple nach Animation entfernen
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick();
    };

    return (
        <button 
            onClick={handleClick} 
            disabled={item.locked}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`
                group relative w-full aspect-square p-0.5 rounded-[24px] shadow-lg ${item.shadow}
                bg-gradient-to-br ${item.color} bg-[length:200%_200%] animate-gradient-xy
                transform transition-all duration-300 animate-in zoom-in-50 fade-in fill-mode-backwards overflow-hidden
                ${item.locked ? 'opacity-80 cursor-not-allowed grayscale-[0.3]' : 'hover:scale-[1.02] active:scale-95'}
            `}
        >
            {/* RIPPLES */}
            {ripples.map(r => (
                <span 
                    key={r.id}
                    className="absolute bg-white/30 rounded-full pointer-events-none"
                    style={{
                        top: r.y,
                        left: r.x,
                        width: r.size,
                        height: r.size,
                        animation: 'ripple 0.6s linear',
                        transform: 'scale(0)',
                    }}
                />
            ))}

            <div className="bg-slate-900/80 backdrop-blur-md rounded-[22px] p-4 h-full flex flex-col items-center justify-center text-center border border-white/10 gap-3 relative overflow-hidden z-10 pointer-events-none group-hover:bg-slate-900/70 transition-colors">
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                
                {item.locked && (
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
                        <Lock className="w-8 h-8 text-white/50" />
                    </div>
                )}

                <div className={`w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner border border-white/20 ${!item.locked && 'group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300'} group-hover:bg-white/20`}>
                    <item.icon className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                
                <div>
                    <h3 className="text-lg font-black italic text-white leading-none drop-shadow-md mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{item.title}</h3>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{item.subtitle}</p>
                </div>
            </div>
        </button>
    );
};

export default function MainMenu({ user, onArena, onPetHub, onShop, onMarketplace, onLeaderboard, onQuests, onProfile, onSettings, onVillage }) { // onVillage prop
  
  const [showDailyLogin, setShowDailyLogin] = useState(false);

  // Check Daily Login beim Laden
  useEffect(() => {
      if (user) {
          const today = new Date().toISOString().split('T')[0];
          if (user.lastLoginDate !== today) {
              // Verzögerung für sanfteres Einblenden
              const timer = setTimeout(() => setShowDailyLogin(true), 800);
              return () => clearTimeout(timer);
          }
      }
  }, [user?.lastLoginDate]);

  const handleClaimDaily = async () => {
      await claimDailyLoginReward(user);
      setShowDailyLogin(false);
  };

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
      // DORF BUTTON (JETZT AKTIV)
      { 
          id: 'village', title: 'DORF', subtitle: 'Ressourcen',
          icon: Home, color: 'from-emerald-600 to-green-700', shadow: 'shadow-emerald-900/20',
          onClick: onVillage, // Action zugewiesen
          locked: false // Entsperrt
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
    <div className="pt-4 pb-24 px-4 space-y-4 h-full overflow-y-auto scrollbar-hide relative">
      
      {showDailyLogin && (
        <DailyLoginModal 
            user={user} 
            onClaim={handleClaimDaily} 
            onClose={() => setShowDailyLogin(false)} 
        />
      )}

      <PageBackground />
      
      {/* Ripple Animation Keyframes */}
      <style>{`
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        @keyframes gradient-xy {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
            animation: gradient-xy 6s ease infinite;
        }
      `}</style>
      
      {/* --- GRID LAYOUT (Kacheln) --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {menuItems.map((item, index) => (
              <MenuTile key={item.id} item={item} index={index} onClick={item.onClick} />
          ))}
      </div>
    </div>
  );
}