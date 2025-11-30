import React from 'react';

export function MenuCard({ icon: Icon, title, color, onClick }) {
  return (
    <button onClick={onClick} className="bg-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-750 border border-white/5 active:scale-95 transition-all">
      <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-5 h-5 fill-current" />
      </div>
      <span className="font-bold text-xs text-slate-300">{title}</span>
    </button>
  );
}