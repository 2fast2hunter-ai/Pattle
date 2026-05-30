import React, { useState } from 'react';
import { X, Edit3, Gem } from 'lucide-react';

export default function RenameModal({ currentName, onClose, onConfirm, cost, t }) {
    const [name, setName] = useState(currentName);
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 border border-white/10 w-full max-w-xs rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-500/30"><Edit3 className="w-6 h-6" /></div>
                    <h3 className="text-xl font-black text-white uppercase">{t ? t('modal_rename_title') : 'Rename'}</h3>
                </div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-center font-bold text-white mb-6 focus:border-indigo-500 outline-none transition-colors text-lg" autoFocus placeholder={t ? t('modal_rename_placeholder') : 'New name...'} maxLength={15} />
                <button onClick={() => onConfirm(name)} className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-black text-white flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"><span>{cost}</span> <Gem className="w-4 h-4 fill-current text-pink-300" /> {t ? t('btn_rename') : 'RENAME'}</button>
            </div>
        </div>
    );
}
