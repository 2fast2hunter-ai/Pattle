import React from 'react';
import { LayoutGrid, Backpack, ThermometerSun, Heart, X, ChevronRight } from 'lucide-react';
import { PageBackground } from '../components/GameLayout';

export default function PetHub({ onBack, onInventory, onBreed, onHatchery, onItemInventory }) {
  
  // Helper Komponente für die modernen Kacheln
  const HubCard = ({ title, subtitle, icon: Icon, colorFrom, colorTo, iconColor, onClick, delay }) => (
    <button 
        onClick={onClick} 
        style={{ animationDelay: `${delay}ms` }}
        className={`
            group relative w-full p-0.5 rounded-3xl shadow-lg shadow-black/20
            bg-gradient-to-br ${colorFrom} ${colorTo}
            transform transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left animate-in slide-in-from-right-8 fade-in fill-mode-backwards
        `}
    >
        {/* Innerer Container (Glas-Effekt) */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-[22px] p-5 h-full flex items-center justify-between border border-white/10 relative overflow-hidden">
            
            {/* Hintergrund Glanz */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 relative z-10">
                {/* Icon Container */}
                <div className={`w-14 h-14 bg-black/30 rounded-2xl flex items-center justify-center shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${iconColor} drop-shadow-md`} />
                </div>
                
                {/* Text */}
                <div>
                    <h3 className="text-xl font-black italic text-white tracking-wide leading-none mb-1 drop-shadow-sm">{title}</h3>
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-wider opacity-80">{subtitle}</p>
                </div>
            </div>

            {/* Pfeil */}
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-white/70" />
            </div>
        </div>
    </button>
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in relative">
      <PageBackground />
      
      {/* --- HEADER --- */}
      <div className="relative flex items-center justify-center mb-6 pt-2">
          <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 drop-shadow-sm">
              PET HUB
          </h1>
          <button 
              onClick={onBack} 
              className="absolute right-0 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95 border border-red-500/30"
          >
              <X className="w-5 h-5" />
          </button>
      </div>

      {/* --- LISTE --- */}
      <div className="flex-1 overflow-y-auto space-y-4 p-1 pb-20 scrollbar-hide">

        {/* 1. PET SAMMLUNG (Blau) */}
        <HubCard 
            title="SAMMLUNG" 
            subtitle="Alle deine Monster" 
            icon={LayoutGrid} 
            colorFrom="from-blue-600" 
            colorTo="to-indigo-600" 
            iconColor="text-blue-400"
            onClick={onInventory}
            delay={0}
        />

        {/* 2. ITEM INVENTAR (Amber/Orange) */}
        <HubCard 
            title="RUCKSACK" 
            subtitle="Eier, Items & Tickets" 
            icon={Backpack} 
            colorFrom="from-amber-500" 
            colorTo="to-orange-600" 
            iconColor="text-amber-400"
            onClick={onItemInventory}
            delay={100}
        />

        {/* 3. ZUCHT LABOR (Pink/Rose) - Jetzt VOR der Brutstätte */}
        <HubCard 
            title="ZUCHT LABOR" 
            subtitle="Neue Arten erschaffen" 
            icon={Heart} 
            colorFrom="from-pink-600" 
            colorTo="to-rose-600" 
            iconColor="text-pink-400 fill-pink-400/20"
            onClick={onBreed}
            delay={200}
        />

        {/* 4. BRUTSTÄTTE (Emerald/Teal) */}
        <HubCard 
            title="BRUTSTÄTTE" 
            subtitle="Eier ausbrüten" 
            icon={ThermometerSun} 
            colorFrom="from-emerald-500" 
            colorTo="to-teal-600" 
            iconColor="text-emerald-400"
            onClick={onHatchery}
            delay={300}
        />

      </div>
    </div>
  );
}