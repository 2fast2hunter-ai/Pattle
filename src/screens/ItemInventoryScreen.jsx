import React from 'react';
import { ArrowLeft, Egg, Dna, ThermometerSun, BoxSelect, Package, Ticket, Gift, TreePine, Pickaxe, Fish, Star, Cpu, FlaskConical, Zap, Palette, Sparkles } from 'lucide-react';
import { RARITIES, CONSUMABLES, COSMETICS, TYPES, ZODIAC_ANIMALS } from '../data/gameData';
import InventoryCard from '../components/inventory/InventoryCard';
import ItemActionModal from '../components/inventory/ItemActionModal';
import LootboxAnimation from '../components/inventory/LootboxAnimation';
import InventorySection from '../components/inventory/InventorySection';
import { useInventory } from '../hooks/useInventory';

const RES_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles
};

export default function ItemInventoryScreen({ pets, onBack, onStartIncubation, user, onRedeemTicket, onUseConsumable, onOpenLootbox, t, tutorialHighlight }) {
    const {
        selectedItem, setSelectedItem, selectedBox, setSelectedBox, selectedPotion, setSelectedPotion,
        animationStage, cycleRarity, resultPet, canCollect,
        materialItems, hasResources, inventoryItems, boxItems, ticketItems, potionItems,
        startLootboxSequence, finishAnimation
    } = useInventory(user, pets, onOpenLootbox);

    // Helper to render specific modal content
    const renderPotionModal = () => {
        if (!selectedPotion) return null;
        const isCosmetic = !!COSMETICS[selectedPotion.variant];
        return (
            <ItemActionModal
                title={selectedPotion.config.label} icon={isCosmetic ? Palette : FlaskConical}
                count={selectedPotion.count} description={selectedPotion.config.desc || (t && t('inv_magic_item_desc'))}
                actionLabel={t && t('inv_use')} actionIcon={Zap}
                onAction={(qty) => { onUseConsumable(selectedPotion.ids[0], qty); setSelectedPotion(null); }}
                onClose={() => setSelectedPotion(null)}
                colorClass={selectedPotion.config.color} bgClass={selectedPotion.config.bg}
                showQuantitySelector={!isCosmetic}
            />
        );
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            {/* ANIMATION OVERLAY */}
            <LootboxAnimation
                animationStage={animationStage} cycleRarity={cycleRarity} resultPet={resultPet}
                canCollect={canCollect} finishAnimation={finishAnimation} t={t}
            />

            {/* MODALS */}
            {selectedItem && (
                <ItemActionModal
                    title={t ? `${t('rarity_' + selectedItem.base.rarity)} ${t('inv_egg_suffix')}` : `${RARITIES[selectedItem.base.rarity].label} Ei`}
                    icon={Egg} count={selectedItem.count}
                    description={
                        <div className="flex flex-col items-center gap-1">
                            <span className="mb-2">{t ? (selectedItem.isBreeding ? t('inv_egg_desc_breed') : t('inv_egg_desc_mystery')) : `A ${selectedItem.isBreeding ? 'bred' : 'mysterious'} egg.`}</span>
                            {selectedItem.base.parents && selectedItem.base.parents.length > 0 ? (
                                <div className="w-full bg-slate-950/40 rounded-xl p-3 border border-white/5">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase text-center mb-2 flex items-center justify-center gap-1">
                                        <Dna className="w-3 h-3 text-pink-400" /> {t ? t('inv_genetics') : 'Eltern-Genetik'}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedItem.base.parents.map((p, i) => {
                                            const pType = TYPES[p.type] || TYPES.FIRE;
                                            const pSpecies = ZODIAC_ANIMALS[p.species] || { label: 'Unbekannt' };
                                            return (
                                                <div key={i} className="bg-slate-900 rounded-lg p-2 flex flex-col items-center border border-white/5 shadow-sm">
                                                    <div className="font-bold text-xs text-white mb-0.5 truncate w-full text-center">{p.name}</div>
                                                    <div className="text-[9px] text-slate-400 mb-1.5">{pSpecies.label}</div>
                                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${pType.bg} bg-opacity-20 border border-white/10`}>
                                                        <div className="scale-75 text-white">{pType.icon}</div>
                                                        <span className="text-[8px] font-black text-white uppercase">{pType.label}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (selectedItem.base.customData?.parentsNames && (
                                <div className="mt-1 flex items-center gap-2 bg-pink-500/20 px-3 py-1.5 rounded-lg border border-pink-500/30">
                                    <Dna className="w-3.5 h-3.5 text-pink-400" />
                                    <span className="text-pink-200 font-bold text-xs">{t ? t('inv_parents') : 'Eltern'}: {selectedItem.base.customData.parentsNames}</span>
                                </div>
                            ))}
                        </div>
                    }
                    actionLabel={t && t('inv_incubate')} actionIcon={ThermometerSun}
                    onAction={() => { onStartIncubation(selectedItem.ids[0]); setSelectedItem(null); }}
                    onClose={() => setSelectedItem(null)}
                    colorClass={RARITIES[selectedItem.base.rarity].color} bgClass={RARITIES[selectedItem.base.rarity].bg}
                />
            )}
            {selectedBox && (
                <ItemActionModal
                    title={t ? t('box_' + selectedBox.variant) : `${selectedBox.variant === 'TYPE_DAILY' ? 'Elementar' : selectedBox.variant} Box`}
                    icon={Package} count={selectedBox.count} description={t && t('inv_box_desc')}
                    actionLabel={t && t('inv_open')} actionIcon={BoxSelect}
                    onAction={() => startLootboxSequence(selectedBox.ids[0], selectedBox.variant)}
                    onClose={() => setSelectedBox(null)}
                    colorClass="text-yellow-400" bgClass="bg-yellow-500"
                />
            )}
            {renderPotionModal()}

            {/* HEADER */}
            <div className="relative flex items-center justify-between mb-6 pt-2 px-4 shrink-0">
                <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 drop-shadow-sm">{t ? t('pethub_items_btn') : 'RUCKSACK'}</h1>
                <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"><ArrowLeft className="w-5 h-5" /></button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">
                {/* 1. VERBRAUCHSGÜTER */}
                {potionItems.length > 0 && (
                    <InventorySection title={t ? t('inv_consumables') : 'Consumables'} icon={FlaskConical}>
                        {potionItems.map((potion, idx) => {
                            const isCosmetic = !!COSMETICS[potion.variant];
                            return (
                                <InventoryCard key={idx} onClick={() => setSelectedPotion(potion)}
                                    icon={isCosmetic ? Palette : FlaskConical} count={potion.count}
                                    label={t ? t('item_' + potion.variant) : potion.config.label}
                                    colorColor={potion.config.color} bgColor={potion.config.bg}
                                    ringColor={isCosmetic ? "ring-pink-500/50" : "ring-purple-500/50"}
                                />
                            );
                        })}
                    </InventorySection>
                )}

                {/* 2. MATERIALIEN */}
                {hasResources && (
                    <InventorySection title={t ? t('inv_materials') : 'Materialien'} icon={Pickaxe} className="delay-100">
                        {materialItems.map((item) => (
                            <InventoryCard key={item.id} icon={RES_ICONS[item.category]} count={item.count}
                                label={t ? t('item_' + item.id) : item.label} colorColor={item.color} bgColor="bg-slate-800" onClick={() => { }}
                            />
                        ))}
                    </InventorySection>
                )}

                {/* 3. TICKETS */}
                {ticketItems.length > 0 && (
                    <InventorySection title={t ? t('inv_special') : 'Spezial-Items'} icon={Ticket} className="delay-150">
                        {ticketItems.map((ticket, idx) => (
                            <InventoryCard key={idx} icon={Ticket} count={ticket.count} label={t ? t('inv_ticket_breed') : "Zucht-Ticket"}
                                colorColor="text-pink-400" bgColor="bg-pink-600" ringColor="ring-pink-500/50"
                                footerButton={
                                    <button onClick={(e) => { e.stopPropagation(); onRedeemTicket(ticket.ids[0]); }}
                                        className='w-full bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black py-2 rounded-xl shadow-lg flex justify-center items-center gap-1 active:scale-95 transition-all'>
                                        <Gift className='w-3 h-3' /> {t ? t('inv_redeem') : 'REDEEM'}
                                    </button>
                                }
                            />
                        ))}
                    </InventorySection>
                )}

                {/* 4. BOXEN */}
                {boxItems.length > 0 && (
                    <InventorySection title={t ? t('inv_lootboxes') : 'Schatzkisten'} icon={Package} className="delay-200">
                        {boxItems.map((box, idx) => (
                            <InventoryCard key={idx} onClick={() => setSelectedBox(box)} icon={Package} count={box.count}
                                label={t ? t('box_' + box.variant) : (box.variant === 'TYPE_DAILY' ? 'Elementar-Truhe' : box.variant)}
                                colorColor="text-yellow-400" bgColor="bg-yellow-500"
                                ringColor={tutorialHighlight === box.variant ? 'ring-yellow-400 animate-pulse' : null}
                            />
                        ))}
                    </InventorySection>
                )}

                {/* 5. EIER */}
                <InventorySection title={t ? t('inv_eggs') : 'Monster-Eier'} icon={Egg} className="delay-300">
                    {inventoryItems.map((item, idx) => {
                        const rarity = RARITIES[item.base.rarity];
                        return (
                            <InventoryCard key={idx} onClick={() => setSelectedItem(item)} icon={Egg} count={item.count}
                                label={t ? t('rarity_' + item.base.rarity) : rarity.label} colorColor={rarity.color} bgColor={rarity.bg}
                                ringColor={item.isBreeding ? 'ring-pink-500/50' : null}
                                specialIcon={item.isBreeding && <div className="absolute -bottom-2 -right-2 bg-pink-500 p-1.5 rounded-full border-2 border-slate-900 shadow-sm z-20"><Dna className="w-3.5 h-3.5 text-white" /></div>}
                            />
                        );
                    })}
                </InventorySection>
            </div>
        </div>
    );
}