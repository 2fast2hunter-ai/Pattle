import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowLeft, Trophy, LayoutGrid, Dna,
    PieChart, Swords, Loader2, Copy, Check, ArrowUpRight, Sword
} from 'lucide-react';
import { RARITIES, TYPES, ZODIAC_ANIMALS } from '../data/gameData';
import { findUserPublic, listenToPets } from '../utils/db';
import StatDetailModal from '../components/modals/StatDetailModal';

export default function FriendProfileScreen({ friend, onBack, onStartBattle, t }) {
    const [fullProfile, setFullProfile] = useState(null);
    const [friendPets, setFriendPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [idCopied, setIdCopied] = useState(false);
    const [battleError, setBattleError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (friend?.id) {
                const data = await findUserPublic(friend.id);
                setFullProfile(data);
                const unsubscribe = listenToPets(friend.id, (pets) => {
                    setFriendPets(pets);
                    setLoading(false);
                });
                return unsubscribe;
            } else {
                setLoading(false);
            }
        };
        let unsub;
        fetchProfile().then(u => unsub = u);
        return () => { if (unsub) unsub(); };
    }, [friend]);

    const displayUser = fullProfile || friend;

    const statsData = useMemo(() => {
        const safePets = friendPets || [];

        // 1. Battle
        const totalBattles = displayUser.stats?.pvpTotal || 0;
        const wins = displayUser.stats?.pvpWins || 0;
        const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

        // 2. Collection Analysis
        const rarityCounts = {};
        let maxLvl = 0;
        safePets.forEach(p => {
            if (!p.isEgg) {
                const r = p.rarity;
                rarityCounts[r] = (rarityCounts[r] || 0) + 1;
                if (p.level > maxLvl) maxLvl = p.level;
            }
        });

        const rarityStats = Object.values(RARITIES).map(r => ({
            label: r.label,
            count: rarityCounts[Object.keys(RARITIES).find(k => RARITIES[k].id === r.id)] || 0,
            color: r.color,
            bg: r.bg.replace('bg-', 'bg-')
        })).sort((a, b) => b.count - a.count);

        return {
            battle: { wins, losses: totalBattles - wins, winRate, rating: displayUser.rating },
            collection: {
                totalPets: safePets.length,
                highestLevel: maxLvl,
                rarityStats
            },
            economy: { coins: displayUser.coins },
            breeding: {
                hatched: displayUser.stats?.hatched || 0,
                bred: displayUser.stats?.bred || 0
            }
        };
    }, [displayUser, friendPets]);

    const copyId = () => {
        navigator.clipboard.writeText(displayUser.id).then(() => {
            setIdCopied(true);
            setTimeout(() => setIdCopied(false), 2000);
        });
    };

    const showBattleError = (msg) => {
        setBattleError(msg);
        setTimeout(() => setBattleError(null), 3000);
    };

    const handleBattleClick = () => {
        if (!displayUser.team || displayUser.team.length === 0) {
            showBattleError(t ? t('friend_no_team') : 'This friend has no team set up.');
            return;
        }
        const enemyTeamPets = friendPets.filter(p => displayUser.team.includes(p.id));
        if (enemyTeamPets.length === 0) {
            showBattleError(t ? t('friend_team_pets_not_found') : 'Could not find team pets.');
            return;
        }
        onStartBattle(enemyTeamPets);
    };

    const categories = [
        { id: 'BATTLE', label: t ? t('profile_cat_battle') : 'Battle', icon: Swords, color: 'from-red-500 to-orange-600', textColor: 'text-red-400', value: `${statsData.battle.winRate}% WR` },
        { id: 'GAUNTLET', label: 'Gauntlet', icon: Swords, color: 'from-purple-500 to-indigo-600', textColor: 'text-purple-400', value: `${displayUser.stats?.gauntletHighscore || 0}` },
        { id: 'COLLECTION', label: t ? t('profile_cat_collection') : 'Collection', icon: LayoutGrid, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-400', value: `${statsData.collection.totalPets} Pets` },
        { id: 'ECONOMY', label: t ? t('profile_cat_economy') : 'Economy', icon: PieChart, color: 'from-yellow-500 to-amber-600', textColor: 'text-amber-400', value: `${displayUser.coins}` },
        { id: 'BREEDING', label: t ? t('profile_cat_breeding') : 'Breeding', icon: Dna, color: 'from-pink-500 to-rose-600', textColor: 'text-pink-400', value: `${statsData.breeding.hatched}` },
    ];

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative">
            {selectedCategory && (<StatDetailModal category={categories.find(c => c.id === selectedCategory)} data={statsData[selectedCategory.toLowerCase()]} onClose={() => setSelectedCategory(null)} t={t} />)}
            <div className="relative flex items-center justify-center mb-6 pt-6 px-4">
                <h1 className="text-2xl font-black italic tracking-wide text-white">FREUND</h1>
                <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto pb-24 px-4 scrollbar-hide space-y-6">
                <div className="text-center relative py-2">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-violet-700 mx-auto rounded-[32px] flex items-center justify-center text-6xl shadow-2xl border-4 border-slate-800 relative z-10 overflow-hidden">
                        {loading ? <Loader2 className="w-10 h-10 animate-spin text-white/50" /> : displayUser.avatar}
                        <div className="absolute -bottom-3 bg-slate-900 text-yellow-400 text-xs font-black px-3 py-1 rounded-full border border-yellow-500/30">LVL {displayUser.level}</div>
                    </div>
                    <div className="mt-5">
                        <h2 className="text-3xl font-black text-white tracking-tight">{displayUser.username}</h2>
                        <div className="flex justify-center gap-2 mt-3">
                            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-indigo-400 font-bold flex items-center gap-1.5 text-xs shadow-sm"><Trophy className="w-3.5 h-3.5" /> {displayUser.rating} Elo</div>
                            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-red-400 font-bold flex items-center gap-1.5 text-xs shadow-sm"><Sword className="w-3.5 h-3.5" /> {displayUser.stats?.gauntletHighscore || 0} Score</div>
                            <button onClick={copyId} className={`bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-1.5 text-xs font-mono active:scale-95 transition-colors ${idCopied ? 'text-green-400 border-green-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>{idCopied ? <><Check className="w-3.5 h-3.5" /> {t ? t('label_copied') : 'Copied!'}</> : <><Copy className="w-3.5 h-3.5" /> ID</>}</button>
                        </div>
                    </div>
                    <div className="mt-6 px-6">
                        <button onClick={handleBattleClick} disabled={loading || !friendPets.length} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black py-3 rounded-2xl shadow-lg shadow-red-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Swords className="w-5 h-5" /> FREUNDSCHAFTSKAMPF
                        </button>
                        {battleError && <p className="text-xs text-red-400 mt-2 font-bold">{battleError}</p>}
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Just for Fun • No Rewards</p>
                    </div>
                </div>
                {loading ? (<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map((cat) => (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="bg-slate-800 p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:bg-slate-750 transition-all active:scale-95 group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cat.color} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
                                <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center ${cat.textColor} shadow-inner border border-white/5`}><cat.icon className="w-5 h-5" /></div>
                                <div className="text-left relative z-10"><div className="text-2xl font-black text-white">{cat.value}</div><div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">{cat.label} <ArrowUpRight className="w-3 h-3 opacity-50" /></div></div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}