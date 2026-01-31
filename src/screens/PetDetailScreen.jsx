import React, { useState } from 'react';
import { ArrowLeft, Swords, Shield, Zap, Heart, Wind, Activity, Star, Edit3, Sparkles, Trash2 } from 'lucide-react';
import { RARITIES, TYPES, ABILITIES, ZODIAC_ANIMALS } from '../data/gameData';
import { getPetLevelProgress } from '../utils/mechanics/petStats'; // IMPORT HINZUGEFÜGT
import PetAvatar from '../components/PetAvatar';
import RenameModal from '../components/modals/RenameModal';
import DeleteModal from '../components/modals/DeleteModal';

export default function PetDetailScreen({ pet, onBack, onRenamePet, onReleasePet, t }) { // t prop added
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  if (!pet) return null;

  const rarity = RARITIES[pet.rarity] || RARITIES.COMMON;
  const type = TYPES[pet.type] || TYPES.FIRE;
  const ability = ABILITIES[pet.abilityId] || ABILITIES.fireball;
  const species = ZODIAC_ANIMALS[pet.species] || { label: 'Unbekannt' };
  
  // --- NEU: Benutze die Helper-Funktion für korrekten Balken ---
  const { current: levelXp, max: levelMaxXp, percent: xpPercent } = getPetLevelProgress(pet);
  // ------------------------------------------------------------

  const stats = [
      { icon: Swords, label: 'ANGRIFF', value: pet.atk, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
      { icon: Zap, label: 'FÄHIGKEIT', value: pet.ap, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
      { icon: Shield, label: 'ABWEHR', value: pet.def, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
      { icon: Activity, label: 'RESISTENZ', value: pet.res, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
      { icon: Wind, label: 'TEMPO', value: pet.speed, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
      { icon: Heart, label: 'LEBEN', value: pet.maxHp, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  ];

  const handleRenameSubmit = async (newName) => {
      if (newName === pet.name) { setShowRenameModal(false); return; }
      const success = await onRenamePet(pet.id, newName);
      if (success) setShowRenameModal(false);
  };

  const handleReleaseSubmit = async () => {
      const success = await onReleasePet(pet.id);
      if (success) {
          setShowDeleteModal(false);
          onBack();
      }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 relative bg-slate-950">
        
        {showRenameModal && (<RenameModal currentName={pet.name} cost={100} onClose={() => setShowRenameModal(false)} onConfirm={handleRenameSubmit} />)}
        {showDeleteModal && (<DeleteModal petName={pet.name} onClose={() => setShowDeleteModal(false)} onConfirm={handleReleaseSubmit} />)}

        <div className={`absolute top-0 left-0 w-full h-2/5 ${type.bg} opacity-20 rounded-b-[40px] blur-3xl`}></div>
        
        {/* TOP BAR */}
        <div className="relative z-10 flex items-center justify-between p-4">
            <button onClick={onBack} className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all active:scale-95 border border-white/10"><ArrowLeft className="w-5 h-5" /></button>
            <div className="flex gap-2">
                {pet.isShiny && (
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 border border-white/20 flex items-center gap-1.5 shadow-lg animate-pulse">
                        <Sparkles className="w-3 h-3 text-white fill-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">SHINY</span>
                    </div>
                )}
                <div className={`px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 ${rarity.color}`}>
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t ? t('rarity_' + pet.rarity) : rarity.label}</span>
                </div>
            </div>
        </div>

        {/* AVATAR & NAME */}
        <div className="relative z-10 flex flex-col items-center -mt-2">
            <div className="relative">
                <div className={`absolute inset-0 ${rarity.bg} blur-[40px] opacity-40 rounded-full`}></div>
                <div className="drop-shadow-2xl filter scale-125 transition-transform hover:scale-150 duration-500">
                    <PetAvatar pet={pet} className="w-48 h-48" />
                </div>
                <div className="absolute bottom-0 right-0 bg-slate-900 text-white text-xs font-black px-2.5 py-1 rounded-lg border border-white/20 shadow-lg">Lvl {pet.level}</div>
            </div>
            
            <div className="mt-6 text-center flex items-center gap-2">
                <h1 className={`text-3xl font-black text-white drop-shadow-lg ${pet.isShiny ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-cyan-300' : ''}`}>
                    {pet.name}
                </h1>
                <button onClick={() => setShowRenameModal(true)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"><Edit3 className="w-4 h-4" /></button>
            </div>
            
            <div className="flex items-center gap-2 mt-2 mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider text-slate-500`}>{species.label}</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <div className={`flex items-center gap-1 ${type.color} text-[10px] font-black uppercase`}>{type.icon} {t ? t('type_' + pet.type) : type.label}</div>
            </div>

            {/* XP BAR (ANGEPASST) */}
            <div className="w-64 px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Erfahrung</span>
                    <span className="text-[10px] font-mono font-bold text-white">{levelXp} / {levelMaxXp}</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${xpPercent}%` }}></div>
                </div>
            </div>
        </div>

        {/* STATS CARD */}
        <div className="flex-1 bg-slate-900/80 backdrop-blur-xl mt-6 rounded-t-[40px] border-t border-white/10 p-6 overflow-y-auto relative pb-24">
            <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`bg-slate-950/50 p-3 rounded-2xl border ${stat.border} flex items-center justify-between group hover:bg-slate-950 transition-colors`}>
                        <div className="flex items-center gap-3"><div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon className="w-4 h-4" /></div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span></div>
                        <span className={`text-lg font-black ${pet.isShiny ? 'text-yellow-200' : 'text-white'}`}>{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-5 rounded-3xl border border-indigo-500/20 relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-20 h-20 text-indigo-400" /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20"><Zap className="w-3.5 h-3.5 fill-current" /></div><span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Spezialfähigkeit</span></div>
                    <h3 className="text-lg font-black text-white mb-1">{ability.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{ability.desc}</p>
                </div>
            </div>
            
            <button 
                onClick={() => setShowDeleteModal(true)} 
                className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
                <Trash2 className="w-5 h-5" /> Pet freilassen
            </button>
        </div>
    </div>
  );
}