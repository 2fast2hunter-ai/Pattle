import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ petName, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 border-2 border-red-500/30 w-full max-w-xs rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30 animate-pulse">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase leading-none mb-2">Bist du sicher?</h3>
                    <p className="text-slate-400 text-sm">
                        Möchtest du <span className="text-white font-bold">{petName}</span> wirklich freilassen? <br/>
                        <span className="text-red-400 font-bold block mt-2">Das kann nicht rückgängig gemacht werden!</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 active:scale-95 transition-all">ABBRECHEN</button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-black text-white active:scale-95 transition-all shadow-lg shadow-red-900/20">JA, WEG DAMIT</button>
                </div>
            </div>
        </div>
    );
}