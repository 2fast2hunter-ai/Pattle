import React, { useState } from 'react';
import { X, Swords, LayoutGrid, PieChart, Dna } from 'lucide-react';
import StatDetailModal from '../components/profile/StatDetailModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileFriends from '../components/profile/ProfileFriends';
import { useProfileStats } from '../hooks/useProfileStats';

export default function ProfileScreen({ user, pets, onViewFriend, onAddFriend, onBack, onUpdateProfile, t }) {
    const [activeTab, setActiveTab] = useState('stats');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const statsData = useProfileStats(user, pets);

    const categories = [
        { id: 'BATTLE', label: t ? t('profile_cat_battle') : 'Battle', icon: Swords, color: 'from-red-500 to-orange-600', textColor: 'text-red-400', value: `${statsData.battle.winRate}% WR` },
        { id: 'GAUNTLET', label: 'Gauntlet', icon: Swords, color: 'from-purple-500 to-indigo-600', textColor: 'text-purple-400', value: `${user.stats?.gauntletHighscore || 0}` },
        { id: 'COLLECTION', label: t ? t('profile_cat_collection') : 'Collection', icon: LayoutGrid, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-400', value: `${statsData.collection.totalPets} Pets` },
        { id: 'ECONOMY', label: t ? t('profile_cat_economy') : 'Economy', icon: PieChart, color: 'from-yellow-500 to-amber-600', textColor: 'text-amber-400', value: `${user.coins}` },
        { id: 'BREEDING', label: t ? t('profile_cat_breeding') : 'Breeding', icon: Dna, color: 'from-pink-500 to-rose-600', textColor: 'text-pink-400', value: `${statsData.breeding.hatched}` },
    ];

    const copyId = () => { alert(`ID kopiert: ${user.id}`); };

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom duration-500 relative">
            {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSave={onUpdateProfile} />}

            {selectedCategory && (
                <StatDetailModal
                    category={categories.find(c => c.id === selectedCategory)}
                    data={statsData[selectedCategory.toLowerCase()]}
                    onClose={() => setSelectedCategory(null)}
                    t={t}
                />
            )}

            <div className="relative flex items-center justify-center mb-6 pt-6 px-4">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">PROFIL</h1>
                <button onClick={onBack} className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 space-y-6 px-4 scrollbar-hide">
                <ProfileHeader user={user} setShowEditModal={setShowEditModal} copyId={copyId} />

                <div className="flex p-1 bg-slate-800 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('stats')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>Statistiken</button>
                    <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>Freunde</button>
                </div>

                {activeTab === 'stats' ? (
                    <ProfileStats categories={categories} setSelectedCategory={setSelectedCategory} />
                ) : (
                    <ProfileFriends user={user} onAddFriend={onAddFriend} onViewFriend={onViewFriend} />
                )}
                <div className="text-center pt-4"><p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Mitglied seit 2025</p></div>
            </div>
        </div>
    );
}