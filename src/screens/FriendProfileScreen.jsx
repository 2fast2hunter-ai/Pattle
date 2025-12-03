import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeft, Trophy, LayoutGrid, Dna, ThermometerSun, 
    PieChart, Swords, ShoppingBag, X, Wallet, 
    ArrowUpRight, ArrowDownRight, Crown, Loader2, Copy
} from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS } from '../data/gameData';
import { findUserPublic, listenToPets } from '../utils/db';

// --- DETAIL STATS MODAL (Identisch zum Profil) ---
function StatDetailModal({ category, data, onClose }) {
    if (!category) return null;

    const renderContent = () => {
        switch(category.id) {
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
                                <div style={{width: `${data.winRate}%`}} className="h-full bg-green-500"></div>
                                <div style={{width: `${100 - data.winRate}%`}} className="h-full bg-red-900/50"></div>
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
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width: `${data.speciesProgress.percent}%`}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-300">Elemente gemeistert</span>
                                    <span className="text-white">{data.typeProgress.count} / {data.typeProgress.total}</span>
                                </div>
                                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{width: `${data.typeProgress.percent}%`}}></div>
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
                                            <div style={{width: `${(r.count / data.totalPets) * 100}%`}} className={`h-full ${r.bg}`}></div>
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
                        <div className="space-y-2 pt-2 border-t border-white/10">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Erfolge im Besitz ({data.inventoryBredCount})</h4>
                            <div className="flex gap-2 mb-4">
                                {data.topTypes.map((t, i) => (
                                    <div key={t.type} className="flex-1 bg-slate-800 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                                        <div className="text-lg">{TYPES[t.type]?.icon}</div>
                                        <div className="text-xs font-bold text-white">{t.count}</div>
                                        <div className="text-[8px] text-slate-500 uppercase">{TYPES[t.type]?.label}</div>
                                    </div>
                                ))}
                            </div>
                            {data.rarityStats.map(r => (
                                r.count > 0 && (
                                    <div key={r.label} className="flex items-center gap-2 text-xs">
                                        <span className={`w-24 font-bold ${r.color} truncate`}>{r.label}</span>
                                        <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                                            <div style={{width: `${(r.count / data.inventoryBredCount) * 100}%`}} className={`h-full ${r.bg}`}></div>
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

// --- MAIN SCREEN ---
export default function FriendProfileScreen({ friend, onBack }) {
    const [fullProfile, setFullProfile] = useState(null);
    const [friendPets, setFriendPets] = useState([]); // NEU: Pets laden für Stats
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 1. Lade Profildaten UND Pets des Freundes
    useEffect(() => {
        const fetchProfile = async () => {
            if (friend?.id) {
                const data = await findUserPublic(friend.id);
                setFullProfile(data);
                
                // Listener für Pets starten (einmalig abrufen wäre auch ok, aber Listener ist konsistent)
                const unsubscribe = listenToPets(friend.id, (pets) => {
                    setFriendPets(pets);
                    setLoading(false);
                });
                return unsubscribe;
            } else {
                setLoading(false);
            }
        };
        // Da fetchProfile einen Unsubscribe zurückgeben kann, müssen wir es so aufrufen:
        let unsub;
        fetchProfile().then(u => unsub = u);
        
        return () => { if(unsub) unsub(); };
    }, [friend]);

    const displayUser = fullProfile || friend;

    // 2. STATS BERECHNUNG (Identisch zum ProfileScreen)
    const statsData = useMemo(() => {
        const safePets = friendPets || [];
        
        // Battle
        const totalBattles = displayUser.stats?.pvpTotal || 0;
        const wins = displayUser.stats?.pvpWins || 0;
        const losses = totalBattles - wins;
        const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

        // Collection
        const rarityCounts = {};
        let maxLvl = 0;
        const uniqueSpecies = new Set();
        const uniqueTypes = new Set();

        safePets.forEach(p => {
            if (!p.isEgg) {
                const r = p.rarity;
                rarityCounts[r] = (rarityCounts[r] || 0) + 1;
                if (p.level > maxLvl) maxLvl = p.level;
                if (p.species) uniqueSpecies.add(p.species);
                if (p.type) uniqueTypes.add(p.type);
            }
        });

        const rarityStats = Object.values(RARITIES).map(r => ({
            label: r.label,
            count: rarityCounts[Object.keys(RARITIES).find(k => RARITIES[k].id === r.id)] || 0,
            color: r.color,
            bg: r.bg.replace('bg-', 'bg-') 
        })).sort((a,b) => b.count - a.count);

        const speciesProgress = {
            count: uniqueSpecies.size,
            total: Object.keys(ZODIAC_ANIMALS).length,
            percent: Math.round((uniqueSpecies.size / Object.keys(ZODIAC_ANIMALS).length) * 100)
        };
        const typeProgress = {
            count: uniqueTypes.size,
            total: Object.keys(TYPES).length,
            percent: Math.round((uniqueTypes.size / Object.keys(TYPES).length) * 100)
        };

        // Breeding Analysis
        const bredPets = safePets.filter(p => p.source === 'BREEDING' && !p.isEgg);
        const bredRarityCounts = {};
        const bredTypeCounts = {};

        bredPets.forEach(p => {
            const r = p.rarity;
            bredRarityCounts[r] = (bredRarityCounts[r] || 0) + 1;
            bredTypeCounts[p.type] = (bredTypeCounts[p.type] || 0) + 1;
        });

        const bredRarityStats = Object.values(RARITIES).map(r => ({
            label: r.label,
            count: bredRarityCounts[Object.keys(RARITIES).find(k => RARITIES[k].id === r.id)] || 0,
            color: r.color,
            bg: r.bg.replace('bg-', 'bg-') 
        })).sort((a,b) => b.count - a.count);

        const topTypes = Object.entries(bredTypeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type, count]) => ({ type, count }));

        // Economy
        const earned = displayUser.stats?.marketEarned || 0;
        const spent = displayUser.stats?.marketSpent || 0;

        return {
            battle: { wins, losses, winRate, total: totalBattles, rating: displayUser.rating },
            collection: { totalPets: safePets.length, highestLevel: maxLvl, rarityStats, speciesProgress, typeProgress },
            economy: { coins: displayUser.coins, gems: displayUser.gems, marketEarned: earned, marketSpent: spent, marketBalance: earned - spent },
            breeding: { bred: displayUser.stats?.bred || 0, hatched: displayUser.stats?.hatched || 0, inventoryBredCount: bredPets.length, rarityStats: bredRarityStats, topTypes }
        };
    }, [displayUser, friendPets]);

    const copyId = () => { alert(`ID kopiert: ${displayUser.id}`); };

    const categories = [
        { id: 'BATTLE', label: 'Kampf', icon: Swords, color: 'from-red-500 to-orange-600', textColor: 'text-red-400', value: `${statsData.battle.winRate}% WR` },
        { id: 'COLLECTION', label: 'Sammlung', icon: LayoutGrid, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-400', value: `${statsData.collection.totalPets} Pets` },
        { id: 'ECONOMY', label: 'Wirtschaft', icon: PieChart, color: 'from-yellow-500 to-amber-600', textColor: 'text-amber-400', value: `${displayUser.coins}` },
        { id: 'BREEDING', label: 'Zucht', icon: Dna, color: 'from-pink-500 to-rose-600', textColor: 'text-pink-400', value: `${statsData.breeding.hatched}` },
    ];

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative">
            
            {selectedCategory && (
                <StatDetailModal 
                    category={categories.find(c => c.id === selectedCategory)}
                    data={statsData[selectedCategory.toLowerCase()]}
                    onClose={() => setSelectedCategory(null)}
                />
            )}

            {/* HEADER */}
            <div className="relative flex items-center justify-center mb-6 pt-6 px-4">
                <h1 className="text-2xl font-black italic tracking-wide text-white">
                    FREUND
                </h1>
                <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pb-24 px-4 scrollbar-hide space-y-6">
                {/* User Card */}
                <div className="text-center relative py-2">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-violet-700 mx-auto rounded-[32px] flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10 overflow-hidden">
                        {loading ? <Loader2 className="w-10 h-10 animate-spin text-white/50" /> : displayUser.avatar}
                        <div className="absolute -bottom-3 bg-slate-900 text-yellow-400 text-xs font-black px-3 py-1 rounded-full border border-yellow-500/30">
                            LVL {displayUser.level}
                        </div>
                    </div>
                    <div className="mt-5">
                        <h2 className="text-3xl font-black text-white tracking-tight">{displayUser.username}</h2>
                        <div className="flex justify-center gap-2 mt-3">
                            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-indigo-400 font-bold flex items-center gap-1.5 text-xs shadow-sm">
                                <Trophy className="w-3.5 h-3.5" /> {displayUser.rating} Elo
                            </div>
                            <button onClick={copyId} className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-mono active:scale-95">
                                <Copy className="w-3.5 h-3.5" /> ID
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                {loading ? (
                     <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:bg-slate-750 transition-all active:scale-95 group relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cat.color} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
                                <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center ${cat.textColor} shadow-inner border border-white/5`}><cat.icon className="w-5 h-5" /></div>
                                <div className="text-left relative z-10">
                                    <div className="text-2xl font-black text-white">{cat.value}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        {cat.label} <ArrowUpRight className="w-3 h-3 opacity-50" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}