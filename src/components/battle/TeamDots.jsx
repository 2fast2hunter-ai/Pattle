import React from 'react';

export default function TeamDots({ team, currentIndex, isEnemy }) {
  return (
    <div className={`flex gap-1.5 mb-4 ${isEnemy ? 'justify-end' : 'justify-start'}`}>
      {team.map((p, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 border border-white/10 ${i === currentIndex ? (isEnemy ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-125' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-125') : (p.hp <= 0 ? 'bg-slate-800' : 'bg-slate-600')}`} />
      ))}
    </div>
  );
}