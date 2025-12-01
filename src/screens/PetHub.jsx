import React from 'react';
import { LayoutGrid, Backpack, ThermometerSun, Heart, X } from 'lucide-react';

export default function PetHub({ onBack, onInventory, onBreed, onHatchery, onItemInventory }) {
  return (
    <div className="h-full flex flex-col animate-in fade-in">
      
      {/* --- HEADER --- */}
      <div className="relative flex items-center justify-center mb-6 pt-2">
          <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white">
              PET HUB
          </h1>
          <button 
              onClick={onBack} 
              className="absolute right-0 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
          >
              <X className="w-5 h-5" />
          </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-1">

        {/* 1. SAMMLUNG (Blau) */}
        <button onClick={onInventory} className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-lg shadow-blue-500/20 relative overflow-hidden group text-left hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-[22px] p-6 relative z-10 flex items-center justify-between border border-white/10">
                <div>
                    <h2 className="text-xl font-black text-white mb-1">Pet Sammlung</h2>
                    <p className="text-blue-200 font-bold text-sm">Verwalte deine Monster</p>
                </div>
                <LayoutGrid className="w-14 h-14 text-blue-400 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
        </button>

        {/* 2. BRUTSTÄTTE (Grün/Emerald) */}
        <button onClick={onHatchery} className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-1 shadow-lg shadow-emerald-500/20 relative overflow-hidden group text-left hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-[22px] p-6 relative z-10 flex items-center justify-between border border-white/10">
                <div>
                    <h2 className="text-xl font-black text-white mb-1">Brutstätte</h2>
                    <p className="text-emerald-200 font-bold text-sm">Brüte neue Eier aus</p>
                </div>
                <ThermometerSun className="w-14 h-14 text-emerald-400 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
        </button>

        {/* 3. ZUCHT LABOR (Pink) */}
        <button onClick={onBreed} className="w-full bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-1 shadow-lg shadow-pink-500/20 relative overflow-hidden group text-left hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-[22px] p-6 relative z-10 flex items-center justify-between border border-white/10">
                <div>
                    <h2 className="text-xl font-black text-white mb-1">Zucht Labor</h2>
                    <p className="text-pink-200 font-bold text-sm">Erschaffe neue Arten</p>
                </div>
                <Heart className="w-14 h-14 text-pink-400 opacity-80 fill-pink-400/20 group-hover:scale-110 transition-transform" />
            </div>
        </button>

        {/* 4. ITEM INVENTAR (Amber/Gelb) */}
        <button onClick={onItemInventory} className="w-full bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-1 shadow-lg shadow-amber-500/20 relative overflow-hidden group text-left hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-[22px] p-6 relative z-10 flex items-center justify-between border border-white/10">
                <div>
                    <h2 className="text-xl font-black text-white mb-1">Rucksack</h2>
                    <p className="text-amber-200 font-bold text-sm">Eier, Tickets & Items</p>
                </div>
                <Backpack className="w-14 h-14 text-amber-400 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
        </button>

      </div>
    </div>
  );
}