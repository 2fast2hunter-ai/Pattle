import React, { useState } from 'react';
import { Smile, Palette, Lock, Check, X } from 'lucide-react';
import { COSMETICS, PROFILE_ICONS } from '../../data/gameData';

export default function EditProfileModal({ user, onClose, onSave }) {
    const [selectedEmoji, setSelectedEmoji] = useState(user.avatar || '🛡️');
    const [selectedBg, setSelectedBg] = useState(user.profileBg || 'DEFAULT');
    const [activeTab, setActiveTab] = useState('EMOJI'); // EMOJI oder BG

    // Inventar prüfen auf freigeschaltete Items
    const unlockedBgs = ['DEFAULT'];
    const unlockedIcons = Object.values(PROFILE_ICONS).filter(i => i.costAmount === 0).map(i => i.id); // Defaults

    if (user.inventory) {
        user.inventory.forEach(item => {
            if (COSMETICS[item.variant]) {
                unlockedBgs.push(item.variant);
            } else if (PROFILE_ICONS[item.variant]) {
                unlockedIcons.push(item.variant);
            }
        });
    }

    const handleSave = () => {
        onSave({ avatar: selectedEmoji, profileBg: selectedBg });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-50">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[32px] flex flex-col shadow-2xl overflow-hidden max-h-[80vh]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h3 className="font-black text-white text-lg">Profil bearbeiten</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
                </div>

                {/* TABS */}
                <div className="flex p-2 gap-2 bg-slate-900">
                    <button onClick={() => setActiveTab('EMOJI')} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'EMOJI' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}><Smile className="w-4 h-4" /> Avatar</button>
                    <button onClick={() => setActiveTab('BG')} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'BG' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}><Palette className="w-4 h-4" /> Hintergrund</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {activeTab === 'EMOJI' && (
                        <div className="grid grid-cols-5 gap-3">
                            {Object.values(PROFILE_ICONS).map(iconDef => {
                                const isUnlocked = unlockedIcons.includes(iconDef.id);
                                return (
                                    <button
                                        key={iconDef.id}
                                        onClick={() => isUnlocked && setSelectedEmoji(iconDef.icon)}
                                        disabled={!isUnlocked}
                                        className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all relative ${selectedEmoji === iconDef.icon ? 'bg-indigo-600 shadow-lg scale-110 border-2 border-white' : 'bg-slate-800'} ${!isUnlocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-700 cursor-pointer'}`}
                                    >
                                        {iconDef.icon}
                                        {!isUnlocked && <div className="absolute -top-1 -right-1"><Lock className="w-3 h-3 text-slate-400" /></div>}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'BG' && (
                        <div className="grid grid-cols-2 gap-3">
                            {/* DEFAULT OPTION */}
                            <button onClick={() => setSelectedBg('DEFAULT')} className={`h-20 rounded-xl relative overflow-hidden border-2 transition-all ${selectedBg === 'DEFAULT' ? 'border-white ring-2 ring-pink-500' : 'border-transparent opacity-80'}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700"></div>
                                <span className="relative z-10 text-xs font-bold text-white drop-shadow-md">Standard</span>
                            </button>

                            {/* COSMETICS OPTIONS */}
                            {Object.values(COSMETICS).map(cosmetic => {
                                const isUnlocked = unlockedBgs.includes(cosmetic.id);
                                return (
                                    <button key={cosmetic.id} onClick={() => isUnlocked && setSelectedBg(cosmetic.id)} disabled={!isUnlocked} className={`h-20 rounded-xl relative overflow-hidden border-2 transition-all flex items-center justify-center ${selectedBg === cosmetic.id ? 'border-white ring-2 ring-pink-500' : 'border-transparent'} ${!isUnlocked ? 'opacity-40 grayscale' : ''}`}>
                                        <div className={`absolute inset-0 ${cosmetic.colorClass}`}></div>
                                        {isUnlocked ? (
                                            <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-md px-2 text-center">{cosmetic.label.replace('Hintergrund: ', '')}</span>
                                        ) : (
                                            <Lock className="relative z-10 w-6 h-6 text-white/50" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-slate-900">
                    <button onClick={handleSave} className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"><Check className="w-4 h-4" /> SPEICHERN</button>
                </div>
            </div>
        </div>
    );
}
