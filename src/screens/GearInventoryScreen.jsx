import React, { useState } from 'react';
import { ArrowLeft, Sword, Shield, Star, Trash2, Package } from 'lucide-react';
import { GEAR_ITEMS, GEAR_SLOTS } from '../data/gearData';
import { RARITIES } from '../data/rarities';
import { getGearBonuses } from '../utils/mechanics/gearUtils';

const SLOT_ICONS = { weapon: '⚔️', armor: '🛡️', accessory: '💍' };

function GearSlotCard({ slot, equipped, gearInventory, onEquip, onUnequip, t }) {
    const instance = equipped ? gearInventory.find(g => g.id === equipped) : null;
    const template = instance ? GEAR_ITEMS[instance.key] : null;
    const rarity = instance ? (RARITIES[instance.rarity] || RARITIES.COMMON) : null;
    const bonuses = instance ? getGearBonuses(instance) : null;

    return (
        <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{SLOT_ICONS[slot]}</span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {t ? t(`gear_slot_${slot}`) : slot}
                </span>
            </div>
            {template && rarity ? (
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className={`flex items-center gap-1.5 mb-1 ${rarity.color}`}>
                            <span className="text-lg">{template.icon}</span>
                            <span className="text-sm font-black">{t ? t(`gear_item_${instance.key}`) : instance.key.replace(/_/g, ' ')}</span>
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider ${rarity.color} opacity-70 mb-2`}>{rarity.label}</div>
                        <div className="flex flex-wrap gap-1.5">
                            {bonuses && Object.entries(bonuses).map(([stat, val]) => (
                                <span key={stat} className="text-[10px] font-bold bg-slate-800 rounded-lg px-2 py-0.5 text-green-400">
                                    +{val} {stat.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => onUnequip(slot)}
                        className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shrink-0"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center h-12 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    {t ? t('gear_slot_empty') : 'Empty'}
                </div>
            )}
        </div>
    );
}

function GearItemCard({ instance, isEquipped, onEquip, onSell, t }) {
    const template = GEAR_ITEMS[instance.key];
    if (!template) return null;
    const rarity = RARITIES[instance.rarity] || RARITIES.COMMON;
    const bonuses = getGearBonuses(instance);

    return (
        <div className={`bg-slate-900/60 rounded-2xl border p-3 transition-all ${isEquipped ? 'border-indigo-500/40 bg-indigo-900/10' : 'border-white/5'}`}>
            <div className="flex items-start gap-3">
                <div className={`text-2xl p-2 rounded-xl bg-slate-800 ${rarity.border} border`}>{template.icon}</div>
                <div className="flex-1 min-w-0">
                    <div className={`text-sm font-black ${rarity.color} flex items-center gap-1.5 mb-0.5`}>
                        <span>{t ? t(`gear_item_${instance.key}`) : instance.key.replace(/_/g, ' ')}</span>
                        {isEquipped && <span className="text-[9px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">EQ</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5">{rarity.label} · {t ? t(`gear_slot_${template.slot}`) : template.slot}</div>
                    <div className="flex flex-wrap gap-1">
                        {Object.entries(bonuses).map(([stat, val]) => (
                            <span key={stat} className="text-[9px] font-bold bg-slate-800 rounded px-1.5 py-0.5 text-green-400">
                                +{val} {stat.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                    {!isEquipped && (
                        <button
                            onClick={() => onEquip(instance.id)}
                            className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-95"
                        >
                            {t ? t('gear_btn_equip') : 'Equip'}
                        </button>
                    )}
                    <button
                        onClick={() => onSell(instance.id)}
                        className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                        {t ? t('gear_btn_sell') : 'Sell'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GearInventoryScreen({ pet, user, onBack, onEquipGear, onUnequipGear, onSellGear, t }) {
    const [filterSlot, setFilterSlot] = useState('ALL');

    if (!pet) return null;

    const gearInventory = user.gearInventory || [];
    const petGear = pet.gear || {};

    const equippedIds = new Set(Object.values(petGear).filter(Boolean));

    const filteredGear = gearInventory.filter(g => {
        const template = GEAR_ITEMS[g.key];
        if (!template) return false;
        if (filterSlot !== 'ALL' && template.slot !== filterSlot) return false;
        return true;
    }).sort((a, b) => {
        const rA = RARITIES[a.rarity]?.id || 0;
        const rB = RARITIES[b.rarity]?.id || 0;
        return rB - rA;
    });

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 bg-slate-950">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 shrink-0">
                <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-wider text-white">
                        {t ? t('gear_screen_title') : 'Gear'}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">{pet.name}</p>
                </div>
                <div className="ml-auto text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-white/5">
                    {gearInventory.length} {t ? t('gear_items_count') : 'items'}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
                {/* Equipped Slots */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                        {t ? t('gear_section_equipped') : 'Equipped (3 Slots)'}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {GEAR_SLOTS.map(slot => (
                            <GearSlotCard
                                key={slot}
                                slot={slot}
                                equipped={petGear[slot]}
                                gearInventory={gearInventory}
                                onEquip={onEquipGear ? (id) => onEquipGear(pet.id, id) : null}
                                onUnequip={onUnequipGear ? (s) => onUnequipGear(pet.id, s) : null}
                                t={t}
                            />
                        ))}
                    </div>
                </div>

                {/* Inventory Filter + List */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                        {t ? t('gear_section_inventory') : 'Inventory'}
                    </h3>

                    {/* Slot filter pills */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
                        {['ALL', ...GEAR_SLOTS].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterSlot(s)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                                    filterSlot === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 border border-white/5'
                                }`}
                            >
                                {s === 'ALL' ? (t ? t('filter_all') : 'All') : (t ? t(`gear_slot_${s}`) : s)}
                            </button>
                        ))}
                    </div>

                    {filteredGear.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                            <Package className="w-12 h-12 mb-3 opacity-30" />
                            <p className="text-sm font-bold">{t ? t('gear_inventory_empty') : 'No gear yet — win battles to find gear!'}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredGear.map(instance => (
                                <GearItemCard
                                    key={instance.id}
                                    instance={instance}
                                    isEquipped={equippedIds.has(instance.id)}
                                    onEquip={onEquipGear ? (id) => onEquipGear(pet.id, id) : null}
                                    onSell={onSellGear}
                                    t={t}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
