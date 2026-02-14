import React from 'react';
import { Trophy, Dna, ThermometerSun, Wallet, ArrowUpRight, ArrowDownRight, Crown, X } from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS } from '../../data/gameData';

export default function StatDetailModal({ category, data, onClose }) {
    if (!category) return null;

    const renderContent = () => {
        switch (category.id) {
            case 'BATTLE':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                                <div className="text-slate-400 text-xs font-bold uppercase">Siege</div>
                                <div className="text-3xl font-black text-green-400">{data.wins}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                                <div className="text-slate-400 text-xs font-bold uppercase">Niederlagen</div>
                                <div className="text-3xl font-black text-red-400">{data.losses}</div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                                <span>Siegesrate</span>
                                <span>{data.winRate}%</span>
                            </div>
                            <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex">
                                <div style={{ width: `${data.winRate}%` }} className="h-full bg-green-500"></div>
                                <div style={{ width: `${100 - data.winRate}%` }} className="h-full bg-red-900/50"></div>
                            </div>
                        </div>

                        <div className="bg-indigo-900/20 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500 rounded-lg text-white"><Trophy className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-indigo-200 text-xs font-bold uppercase">Aktuelles Rating</div>
                                    <div className="text-xl font-black text-white">{data.rating} Elo</div>
                                </div>
                            </div>
                            <Crown className="w-8 h-8 text-yellow-400 opacity-50" />
                        </div>
                    </div>
                );

            case 'COLLECTION':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                <div className="text-slate-400 text-xs font-bold uppercase">Gesamt</div>
                                <div className="text-2xl font-black text-white">{data.totalPets} <span className="text-sm text-slate-500">Pets</span></div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                <div className="text-slate-400 text-xs font-bold uppercase">Top Level</div>
                                <div className="text-2xl font-black text-yellow-400">{data.highestLevel}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-300">Arten entdeckt</span>
                                    <span className="text-white">{data.speciesProgress.count} / {data.speciesProgress.total}</span>
                                </div>
                                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${data.speciesProgress.percent}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-300">Elemente gemeistert</span>
                                    <span className="text-white">{data.typeProgress.count} / {data.typeProgress.total}</span>
                                </div>
                                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${data.typeProgress.percent}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/10">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Verteilung nach Seltenheit</h4>
                            {data.rarityStats.map(r => (
                                r.count > 0 && (
                                    <div key={r.label} className="flex items-center gap-2 text-xs">
                                        <span className={`w-24 font-bold ${r.color} truncate`}>{r.label}</span>
                                        <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                                            <div style={{ width: `${(r.count / data.totalPets) * 100}%` }} className={`h-full ${r.bg}`}></div>
                                        </div>
                                        <span className="w-6 text-right text-slate-400 font-mono">{r.count}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                );

            case 'ECONOMY':
                return (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 p-4 rounded-2xl border border-amber-500/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-amber-200 text-xs font-bold uppercase">Gesamtvermögen</span>
                                <Wallet className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="text-3xl font-black text-white">{data.coins} <span className="text-sm text-amber-400">Münzen</span></div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-xs font-bold">Markt Einnahmen</span>
                                <span className="text-green-400 font-mono font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {data.marketEarned}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-xs font-bold">Markt Ausgaben</span>
                                <span className="text-red-400 font-mono font-bold flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> {data.marketSpent}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-white/5 pt-2 mt-2 border-t-white/10">
                                <span className="text-slate-200 text-xs font-bold uppercase">Bilanz</span>
                                <span className={`font-mono font-black ${data.marketBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {data.marketBalance > 0 ? '+' : ''}{data.marketBalance}
                                </span>
                            </div>
                        </div>
                    </div>
                );

            case 'BREEDING':
                return (
                    <div className="space-y-6">
                        {/* Global Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-pink-900/20 rounded-3xl border border-pink-500/30 flex flex-col items-center justify-center gap-2">
                                <Dna className="w-8 h-8 text-pink-400" />
                                <div className="text-center">
                                    <div className="text-2xl font-black text-white">{data.bred}</div>
                                    <div className="text-[10px] text-pink-200 uppercase font-bold">Gesamt Gezüchtet</div>
                                </div>
                            </div>
                            <div className="aspect-square bg-emerald-900/20 rounded-3xl border border-emerald-500/30 flex flex-col items-center justify-center gap-2">
                                <ThermometerSun className="w-8 h-8 text-emerald-400" />
                                <div className="text-center">
                                    <div className="text-2xl font-black text-white">{data.hatched}</div>
                                    <div className="text-[10px] text-emerald-200 uppercase font-bold">Gesamt Geschlüpft</div>
                                </div>
                            </div>
                        </div>

                        {/* NEU: Analyse der aktuellen Sammlung (Gezüchtet) */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Erfolge im Besitz ({data.inventoryBredCount})</h4>

                            {/* Top 3 Types */}
                            <div className="flex gap-2 mb-4">
                                {data.topTypes.map((t, i) => (
                                    <div key={t.type} className="flex-1 bg-slate-800 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                                        <div className="text-lg">{TYPES[t.type]?.icon}</div>
                                        <div className="text-xs font-bold text-white">{t.count}</div>
                                        <div className="text-[8px] text-slate-500 uppercase">{TYPES[t.type]?.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Rarity Bars */}
                            {data.rarityStats.map(r => (
                                r.count > 0 && (
                                    <div key={r.label} className="flex items-center gap-2 text-xs">
                                        <span className={`w-24 font-bold ${r.color} truncate`}>{r.label}</span>
                                        <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                                            <div style={{ width: `${(r.count / data.inventoryBredCount) * 100}%` }} className={`h-full ${r.bg}`}></div>
                                        </div>
                                        <span className="w-6 text-right text-slate-400 font-mono">{r.count}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-50">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[32px] flex flex-col shadow-2xl relative overflow-hidden">
                <div className={`h-2 w-full bg-gradient-to-r ${category.color}`}></div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
                            <category.icon className={`w-6 h-6 ${category.textColor}`} />
                            {category.label}
                        </h2>
                        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-white" /></button>
                    </div>
                    <div className="overflow-y-auto max-h-[60vh] scrollbar-hide">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
