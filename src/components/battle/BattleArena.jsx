import React from 'react';
import TeamDots from './TeamDots';
import BattleUnit from './BattleUnit';

export default function BattleArena({
    enemyTeam,
    enemyIndex,
    enemyPet,
    myTeam,
    myIndex,
    myPet,
    animatingUnit,
    hitUnit,
    floatingDamage,
    t
}) {
    return (
        <div className="flex-1 flex flex-col md:flex-row relative z-10 p-4 md:items-center md:justify-center">
            {/* VS WATERMARK */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none mix-blend-overlay">
                <span className="text-[12rem] font-black italic text-white">{t ? t('battle_vs') : 'VS'}</span>
            </div>

            {/* ENEMY SIDE */}
            <div className="flex-1 flex flex-col items-end justify-center pr-2 pt-12 relative md:pt-0 md:order-2">
                <TeamDots team={enemyTeam} currentIndex={enemyIndex} isEnemy={true} />
                <BattleUnit
                    pet={enemyPet}
                    isEnemy={true}
                    attackState={animatingUnit?.side === 'ENEMY' ? animatingUnit : null}
                    isHit={hitUnit === 'ENEMY'}
                    damageText={hitUnit === 'ENEMY' ? floatingDamage : null}
                    t={t}
                />
            </div>

            {/* PLAYER SIDE */}
            <div className="flex-1 flex flex-col items-start justify-center pl-2 mt-[-40px] md:mt-0 md:order-1">
                <BattleUnit
                    pet={myPet}
                    isEnemy={false}
                    attackState={animatingUnit?.side === 'PLAYER' ? animatingUnit : null}
                    isHit={hitUnit === 'PLAYER'}
                    damageText={hitUnit === 'PLAYER' ? floatingDamage : null}
                    t={t}
                />
                <div className="mt-4">
                    <TeamDots team={myTeam} currentIndex={myIndex} isEnemy={false} />
                </div>
            </div>
        </div>
    );
}
