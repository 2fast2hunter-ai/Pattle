import React from 'react';
import { Trophy, Crown, Shield, Flame, X, Castle } from 'lucide-react';
import { getUnlockedTeamSlots } from '../utils/gameMechanics';
import { PageBackground } from '../components/GameLayout';
import HubTile from '../components/arena/HubTile';
import BattleCard from '../components/arena/BattleCard';
import AutoBattleCard from '../components/arena/AutoBattleCard';

export default function ArenaHub({ onBack, onBattle, onTeam, onLeaderboard, user, onAutoBattle, onTower, onGauntlet, t, tutorialHighlight }) {

    const rank = user?.rating || 1000;
    const teamCount = user?.team?.filter(Boolean).length || 0;
    const unlockedSlots = getUnlockedTeamSlots(user?.level || 1);
    const ticketCount = user?.adTickets || 0;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative overflow-hidden">
            <PageBackground />

            <div className="relative flex items-center justify-between mb-4 sm:mb-6 pt-2 px-4 shrink-0 z-10">
                <div className="flex flex-col">
                    <h2 className="text-2xl sm:text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-sm">
                        {t ? t('arena_title') : 'ARENA'}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500" />
                        <span className="text-xs font-bold text-slate-400">{rank} {t ? t('arena_elo') : 'Elo'}</span>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-red-500/30 backdrop-blur-md"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-4 z-10">

                <BattleCard
                    onBattle={onBattle}
                    t={t}
                    tutorialHighlight={tutorialHighlight}
                />

                <AutoBattleCard
                    ticketCount={ticketCount}
                    onAutoBattle={onAutoBattle}
                    t={t}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <HubTile
                        title={t ? t('arena_tower_btn') : "Battle Tower"}
                        subtitle={t ? t('arena_tower_desc') : "PvE Herausforderung"}
                        icon={Castle}
                        colorFrom="from-indigo-700"
                        colorTo="to-purple-800"
                        iconColor="text-indigo-300"
                        onClick={onTower}
                        extraInfo={`${t ? t('arena_stage') : 'Stufe'} ${user?.towerProgress || 1}`}
                        delay={100}
                    />

                    <HubTile
                        title={t ? t('arena_team_btn') : "Team"}
                        subtitle={t ? t('arena_team_desc') : "Verwalten"}
                        icon={Shield}
                        colorFrom="from-slate-700"
                        colorTo="to-slate-800"
                        iconColor="text-indigo-400"
                        onClick={onTeam}
                        extraInfo={`${teamCount} / ${unlockedSlots}`}
                        delay={200}
                        highlight={tutorialHighlight === 'team'}
                    />

                    <HubTile
                        title={t ? t('arena_leaderboard_btn') : "Rangliste"}
                        subtitle={t ? t('arena_leaderboard_desc') : "Top Spieler"}
                        icon={Crown}
                        colorFrom="from-slate-700"
                        colorTo="to-slate-800"
                        iconColor="text-yellow-400"
                        onClick={onLeaderboard}
                        delay={300}
                    />

                    <HubTile
                        title={t ? t('arena_gauntlet_btn') : "Gauntlet"}
                        subtitle={t ? t('arena_gauntlet_desc') : "Endlos Survival"}
                        icon={Flame}
                        colorFrom="from-red-900"
                        colorTo="to-orange-900"
                        iconColor="text-red-500"
                        onClick={onGauntlet}
                        extraInfo={`High: ${user?.stats?.gauntletHighscore || 0}`}
                        delay={400}
                    />
                </div>
            </div>
        </div>
    );
}
