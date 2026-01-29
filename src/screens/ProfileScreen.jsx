import React, { useState, useMemo } from 'react';
import { 
    Copy, UserPlus, Users, UserCheck, Trophy, LayoutGrid, Dna, ThermometerSun, 
    Percent, Swords, ShoppingBag, X, BarChart3, PieChart, Wallet, Shield, Edit3, Check, Lock,
    ArrowUpRight, ArrowDownRight, Crown, CheckCircle2, Palette, Smile
} from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS, COSMETICS, PROFILE_ICONS } from '../data/gameData';

// --- DETAIL STATS MODAL ---
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

// --- EDIT PROFILE MODAL ---
function EditProfileModal({ user, onClose, onSave }) {
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

export default function ProfileScreen({ user, pets, onViewFriend, onAddFriend, onBack, onUpdateProfile }) {
    const [activeTab, setActiveTab] = useState('stats');
    const [friendIdInput, setFriendIdInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // STATS BERECHNUNG
    const statsData = useMemo(() => {
        const safePets = pets || [];
        
        // 1. Battle
        const totalBattles = user.stats?.pvpTotal || 0;
        const wins = user.stats?.pvpWins || 0;
        const losses = totalBattles - wins;
        const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

        // 2. Collection
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

        // 3. Breeding Analysis (NEU)
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
        })).sort((a,b) => b.count - a.count); // Meiste zuerst

        const topTypes = Object.entries(bredTypeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([type, count]) => ({ type, count }));

        // 4. Economy
        const earned = user.stats?.marketEarned || 0;
        const spent = user.stats?.marketSpent || 0;

        return {
            battle: { wins, losses, winRate, total: totalBattles, rating: user.rating },
            collection: { 
                totalPets: safePets.length, 
                highestLevel: maxLvl, 
                rarityStats,
                speciesProgress: { count: uniqueSpecies.size, total: Object.keys(ZODIAC_ANIMALS).length, percent: Math.round((uniqueSpecies.size / Object.keys(ZODIAC_ANIMALS).length) * 100) },
                typeProgress: { count: uniqueTypes.size, total: Object.keys(TYPES).length, percent: Math.round((uniqueTypes.size / Object.keys(TYPES).length) * 100) }
            },
            economy: { coins: user.coins, gems: user.gems, marketEarned: earned, marketSpent: spent, marketBalance: earned - spent },
            breeding: { 
                bred: user.stats?.bred || 0, 
                hatched: user.stats?.hatched || 0,
                inventoryBredCount: bredPets.length,
                rarityStats: bredRarityStats,
                topTypes
            }
        };
    }, [user, pets]);

    const copyId = () => { alert(`ID kopiert: ${user.id}`); };

    // Hintergrund Klasse ermitteln
    const getProfileBgClass = () => {
        if (user.profileBg && COSMETICS[user.profileBg]) return COSMETICS[user.profileBg].colorClass;
        return 'bg-gradient-to-br from-indigo-600 to-violet-700'; // Default
    };

    const categories = [
        { id: 'BATTLE', label: 'Kampf', icon: Swords, color: 'from-red-500 to-orange-600', textColor: 'text-red-400', value: `${statsData.battle.winRate}% WR` },
        { id: 'COLLECTION', label: 'Sammlung', icon: LayoutGrid, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-400', value: `${statsData.collection.totalPets} Pets` },
        { id: 'ECONOMY', label: 'Wirtschaft', icon: PieChart, color: 'from-yellow-500 to-amber-600', textColor: 'text-amber-400', value: `${user.coins}` },
        { id: 'BREEDING', label: 'Zucht', icon: Dna, color: 'from-pink-500 to-rose-600', textColor: 'text-pink-400', value: `${statsData.breeding.hatched}` },
    ];

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom duration-500 relative">
            
            {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSave={onUpdateProfile} />}
            
            {selectedCategory && (
                <StatDetailModal 
                    category={categories.find(c => c.id === selectedCategory)}
                    data={statsData[selectedCategory.toLowerCase()]}
                    onClose={() => setSelectedCategory(null)}
                />
            )}

            <div className="relative flex items-center justify-center mb-6 pt-6 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">
                    PROFIL
                </h1>
                <button onClick={onBack} className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 space-y-6 px-4 scrollbar-hide">
                
                <div className="text-center relative py-2">
                    <div className={`w-32 h-32 ${getProfileBgClass()} mx-auto rounded-[32px] flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10 overflow-hidden group`}>
                        {user.avatar}
                        <button onClick={() => setShowEditModal(true)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                            <Edit3 className="w-8 h-8 text-white" />
                        </button>
                        <div className="absolute -bottom-3 bg-slate-900 text-yellow-400 text-xs font-black px-3 py-1 rounded-full border border-yellow-500/30">LVL {user.level}</div>
                    </div>
                    <div className="mt-5">
                        <h2 className="text-3xl font-black text-white tracking-tight">{user.username}</h2>
                        <div className="flex justify-center gap-2 mt-3">
                            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-indigo-400 font-bold flex items-center gap-1.5 text-xs shadow-sm">
                                <Trophy className="w-3.5 h-3.5" /> {user.rating} Elo
                            </div>
                            <button onClick={copyId} className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-mono active:scale-95">
                                <Copy className="w-3.5 h-3.5" /> ID
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex p-1 bg-slate-800 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('stats')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>Statistiken</button>
                    <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>Freunde</button>
                </div>

                {activeTab === 'stats' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:bg-slate-750 transition-all active:scale-95 group relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cat.color} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
                                <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center ${cat.textColor} shadow-inner border border-white/5`}><cat.icon className="w-5 h-5" /></div>
                                <div className="text-left relative z-10"><div className="text-2xl font-black text-white">{cat.value}</div><div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">{cat.label} <ArrowUpRight className="w-3 h-3 opacity-50" /></div></div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Freund hinzufügen</h3>
                            <div className="flex gap-2"><input type="text" placeholder="Spieler-ID eingeben..." value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder-slate-600" /><button onClick={() => { onAddFriend(friendIdInput); setFriendIdInput(''); }} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-900/20"><UserPlus className="w-5 h-5" /></button></div>
                        </div>
                        <div className="space-y-2">
                            {!user.friends || user.friends.length === 0 ? (
                                <div className="text-center text-slate-500 py-10"><Users className="w-12 h-12 mx-auto mb-2 opacity-20" /><p className="text-sm font-bold">Noch keine Freunde.</p></div>
                            ) : (
                                user.friends.map((friend, idx) => (
                                    <div key={idx} onClick={() => onViewFriend(friend)} className="bg-slate-800 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-750 transition-colors border border-white/5 active:scale-[0.98]"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl shadow-inner">{friend.avatar}</div><div><div className="font-bold text-white text-sm">{friend.username}</div><div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded w-fit mt-0.5">Lvl {friend.level} • {friend.rating} Elo</div></div></div><UserCheck className="text-emerald-500 w-5 h-5" /></div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                <div className="text-center pt-4"><p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Mitglied seit 2025</p></div>
            </div>
        </div>
    );
}