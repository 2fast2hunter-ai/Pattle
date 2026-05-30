import React, { useState, useEffect } from 'react';
import { X, Play, Loader2 } from 'lucide-react';

export default function AdModal({ onClose, onReward }) {
    const [timeLeft, setTimeLeft] = useState(5); // 5 Sekunden Simulation
    const [canClose, setCanClose] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanClose(true);
            // Automatische Belohnung nach Ablauf (oder manuell per Klick)
            // Bei echten Ads wird onReward oft per Callback vom Provider aufgerufen
        }
    }, [timeLeft]);

    const handleClose = () => {
        if (canClose) {
            onReward(); // Belohnung ausschütten
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            
            {/* Simulation eines Video-Players */}
            <div className="w-full max-w-lg aspect-video bg-slate-800 rounded-xl relative overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-center">
                
                {timeLeft > 0 ? (
                    <>
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-white font-bold text-lg animate-pulse">Ad playing...</p>
                    </>
                ) : (
                    <div className="text-center animate-in zoom-in">
                        <Play className="w-16 h-16 text-green-500 mx-auto mb-2 fill-current" />
                        <p className="text-white font-black text-2xl">THANKS!</p>
                        <p className="text-slate-400 text-sm">Support received</p>
                    </div>
                )}

                {/* Timer / Close Button */}
                <div className="absolute top-4 right-4">
                    {timeLeft > 0 ? (
                        <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white">
                            {timeLeft}
                        </div>
                    ) : (
                        <button 
                            onClick={handleClose}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
                
                {/* Fake Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-[5000ms] ease-linear w-full" style={{ width: timeLeft > 0 ? '0%' : '100%', transitionDuration: timeLeft === 5 ? '0s' : '1s' }}></div>
            </div>

            <p className="text-slate-500 text-xs mt-8 text-center max-w-xs">
                This is a simulation. In production, a real video ad from a provider (e.g. Google AdSense or Applixir) would play here.
            </p>
        </div>
    );
}