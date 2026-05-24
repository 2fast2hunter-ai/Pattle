import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Lock, CheckCircle, Swords, Gift, Coins, Gem, Package, FlaskConical, Clock } from 'lucide-react';
import { TOWER_STAGES } from '../data/gameData';

export default function TowerScreen({ user, onBack, onStartStage }) {
    const currentStage = user.towerProgress || 1;
    const scrollRef = useRef(null);

    // Auto-Scroll zur aktuellen Stufe
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    const getRewardIcon = (reward) => {
        if (reward.type === 'COINS') return <Coins className="w-4 h-4 text-yellow-400" />;
        if (reward.type === 'GEMS') return <Gem className="w-4 h-4 text-pink-400" />;
        if (reward.type === 'LOOTBOX') return <Package className="w-4 h-4 text-amber-400" />;
        if (reward.type === 'CONSUMABLE') return <FlaskConical className="w-4 h-4 text-purple-400" />;
        return <Gift className="w-4 h-4 text-white" />;
    };

    const getResetTime = () => {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const diff = nextMonth - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${days}T ${hours}Std`;
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">
            
            {/* HEADER */}
            <div className="relative flex items-center justify-between mb-4 pt-2 px-4 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-wide text-white uppercase">BATTLE TOWER</h2>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Reset in {getResetTime()}</p>
                    </div>
                </div>
                <div className="bg-indigo-600 px-3 py-1 rounded-lg text-xs font-black text-white shadow-lg">
                    Stufe {currentStage} / 100
                </div>
            </div>

            {/* LISTE */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-3">
                {TOWER_STAGES.map((stage) => {
                    const isCompleted = stage.id < currentStage;
                    const isCurrent = stage.id === currentStage;
                    const isLocked = stage.id > currentStage;

                    return (
                        <div 
                            key={stage.id} 
                            ref={isCurrent ? scrollRef : null}
                            className={`
                                relative p-4 rounded-2xl border flex items-center justify-between transition-all
                                ${isCurrent ? 'bg-indigo-900/40 border-indigo-500 shadow-lg shadow-indigo-900/20 scale-[1.02]' : ''}
                                ${isCompleted ? 'bg-slate-900/40 border-green-500/30 opacity-70' : ''}
                                ${isLocked ? 'bg-slate-900/20 border-white/5 opacity-50' : ''}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${isCurrent ? 'bg-indigo-600 text-white' : (isCompleted ? 'bg-green-600/20 text-green-400' : 'bg-slate-800 text-slate-500')}`}>
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : stage.id}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">Stufe {stage.id}</div>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                        {getRewardIcon(stage.reward)}
                                        <span>{stage.reward.amount} {stage.reward.type === 'CONSUMABLE' ? 'Item' : (stage.reward.type === 'LOOTBOX' ? 'Box' : '')}</span>
                                    </div>
                                </div>
                            </div>

                            {isCurrent ? (
                                <button onClick={() => onStartStage(stage.id)} className="bg-white text-indigo-900 px-4 py-2 rounded-xl font-black text-xs hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 shadow-lg">
                                    <Swords className="w-4 h-4" /> KÄMPFEN
                                </button>
                            ) : (
                                isLocked && <Lock className="w-5 h-5 text-slate-600" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}