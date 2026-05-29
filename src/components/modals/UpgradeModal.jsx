import React from 'react';
import { X, ArrowUpCircle } from 'lucide-react';
import { UPGRADE_COSTS, RESOURCE_ITEMS } from '../../data/gameData';

export default function UpgradeModal({ resource, currentLevel, storage, onUpgrade, onClose, t }) {
    const nextLevel = currentLevel + 1;
    const costData = UPGRADE_COSTS.find(u => u.level === nextLevel);
    
    if (!costData) return null;
    
    const baseCost = costData.baseCost;
    const specialCost = costData.specialCost;

    const drops = RESOURCE_ITEMS[resource.id] || [];
    const sortedDrops = [...drops].sort((a, b) => b.chance - a.chance);
    
    const baseItem = sortedDrops[0]; 
    const rareItem = sortedDrops[sortedDrops.length - 1];

    const haveBase = (storage[baseItem.id] || 0);
    const haveRare = (storage[rareItem.id] || 0);
    
    const enoughBase = haveBase >= baseCost;
    const enoughSpecial = specialCost === 0 || haveRare >= specialCost;
    const canAfford = enoughBase && enoughSpecial;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in zoom-in-50">
            <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[32px] p-6 relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X className="w-5 h-5"/>
                </button>
                
                <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-white uppercase">{resource.buildingLabel}</h3>
                    <p className="text-indigo-400 font-bold text-sm">{t ? t('upgrade_to_level', { level: nextLevel }) : `Upgrade to Level ${nextLevel}`}</p>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4 mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{t ? t('label_duration') : 'Duration:'}</span>
                        <span className="text-white font-bold">{costData.time}s</span>
                    </div>
                    
                    <div className="border-t border-white/5 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">{t ? t('label_cost') : 'Cost:'}</span>
                            <span className={`${enoughBase ? 'text-white' : 'text-red-400'} font-black`}>
                                {baseCost.toLocaleString()} {baseItem.label}
                            </span>
                        </div>
                        <div className="flex justify-end text-[10px] text-slate-500">
                            ({t ? t('label_you_have', { count: haveBase.toLocaleString() }) : `You have: ${haveBase.toLocaleString()}`})
                        </div>
                    </div>

                    {specialCost > 0 && (
                        <div className="border-t border-white/5 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-400 font-bold">{t ? t('label_special_cost') : 'Special:'}</span>
                                <span className={`${enoughSpecial ? 'text-white' : 'text-red-400'} font-black`}>
                                    {specialCost.toLocaleString()} {rareItem.label}
                                </span>
                            </div>
                            <div className="flex justify-end text-[10px] text-slate-500">
                                ({t ? t('label_you_have', { count: haveRare.toLocaleString() }) : `You have: ${haveRare.toLocaleString()}`})
                            </div>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={() => { if (canAfford) { onUpgrade(resource.id); onClose(); } }} 
                    disabled={!canAfford} 
                    className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 
                        ${canAfford ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                    <ArrowUpCircle className="w-5 h-5" /> {t ? t('btn_upgrade') : 'UPGRADE'}
                </button>
            </div>
        </div>
    );
}