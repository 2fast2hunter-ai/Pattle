import React, { useState, useEffect } from 'react';
import { ArrowLeft, Egg, Dna, ThermometerSun, BoxSelect, Package, Ticket, Gift, Sparkles, TreePine, Pickaxe, Fish, Star, Cpu, FlaskConical, Zap, Palette } from 'lucide-react';
import { RARITIES, RESOURCE_ITEMS, CONSUMABLES, COSMETICS, TYPES, ZODIAC_ANIMALS } from '../data/gameData';
import InventoryCard from '../components/inventory/InventoryCard';
import ItemActionModal from '../components/inventory/ItemActionModal';

const RES_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles
};

export default function ItemInventoryScreen({ pets, onBack, onStartIncubation, user, onRedeemTicket, onUseConsumable, onOpenLootbox, t }) { // t prop added
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedPotion, setSelectedPotion] = useState(null); 
  
  // --- ANIMATION STATES ---
  const [animationStage, setAnimationStage] = useState('idle'); 
  const [processingBoxId, setProcessingBoxId] = useState(null);
  const [resultPet, setResultPet] = useState(null); 
  const [cycleRarity, setCycleRarity] = useState(RARITIES.COMMON);
  const [canCollect, setCanCollect] = useState(false);

  // --- RESSOURCEN ---
  const villageStorage = user?.village?.storage || {};
  const materialItems = [];
  Object.keys(RESOURCE_ITEMS).forEach(catKey => {
      const items = RESOURCE_ITEMS[catKey];
      items.forEach(itemDef => {
          const count = villageStorage[itemDef.id] || 0;
          if (count > 0) {
              materialItems.push({ ...itemDef, count, category: catKey });
          }
      });
  });
  const hasResources = materialItems.length > 0;

  // --- STAPEL LOGIK ---
  const stacks = {};
  pets.forEach(pet => {
      if (pet.isEgg && pet.hatchAt === 0) {
          const isBreeding = !!(pet.customData?.isBreeding || (pet.parents && pet.parents.length > 0) || pet.source === 'BREEDING');
          const sourceKey = isBreeding ? 'BREEDING' : (pet.source || 'SHOP');
          const key = `${pet.rarity}-${sourceKey}`;
          if (!stacks[key]) { stacks[key] = { base: pet, count: 0, ids: [], rarity: pet.rarity, source: sourceKey, isBreeding: isBreeding }; }
          stacks[key].count++;
          stacks[key].ids.push(pet.id);
      }
  });

  const inventoryItems = Object.values(stacks).sort((a, b) => {
      const rA = RARITIES[a.base.rarity]?.id || 0;
      const rB = RARITIES[b.base.rarity]?.id || 0;
      if (rA !== rB) return rB - rA;
      return (a.isBreeding === b.isBreeding) ? 0 : (a.isBreeding ? -1 : 1);
  });

  const boxStacks = {};
  const ticketStacks = {};
  const potionStacks = {};

  if (user && user.inventory) {
      user.inventory.forEach(item => {
          if (item.type === 'LOOTBOX') {
              if (!boxStacks[item.variant]) boxStacks[item.variant] = { ...item, count: 0, ids: [] };
              boxStacks[item.variant].count++;
              boxStacks[item.variant].ids.push(item.id);
          } else if (item.type === 'TICKET') { 
              if (!ticketStacks[item.type]) ticketStacks[item.type] = { ...item, count: 0, ids: [] };
              ticketStacks[item.type].count++;
              ticketStacks[item.type].ids.push(item.id);
          } else if (item.type === 'CONSUMABLE') {
               const config = CONSUMABLES[item.variant] || COSMETICS[item.variant];
               if (config) {
                   if (!potionStacks[item.variant]) potionStacks[item.variant] = { ...item, config: config, count: 0, ids: [] };
                   potionStacks[item.variant].count++;
                   potionStacks[item.variant].ids.push(item.id);
               }
          }
      });
  }
  const boxItems = Object.values(boxStacks);
  const ticketItems = Object.values(ticketStacks); 
  const potionItems = Object.values(potionStacks);

  // --- CYCLING EFFECT ---
  useEffect(() => {
      if (animationStage === 'cycling' && resultPet) {
          const sortedRarities = Object.values(RARITIES).sort((a, b) => a.id - b.id);
          const targetRarity = RARITIES[resultPet.rarity] || RARITIES.COMMON;

          let currentIndex = 0;
          let delay = 50;
          let timeoutId;

          const loop = () => {
              const currentRarity = sortedRarities[currentIndex];
              setCycleRarity(currentRarity);

              if (delay >= 400 && currentRarity.id === targetRarity.id) {
                  setAnimationStage('revealed');
              } else {
                  currentIndex = (currentIndex + 1) % sortedRarities.length;
                  delay = Math.floor(delay * 1.15);
                  timeoutId = setTimeout(loop, delay);
              }
          };
          loop();
          return () => clearTimeout(timeoutId);
      }
  }, [animationStage, resultPet]);

  // Button Delay
  useEffect(() => {
      if (animationStage === 'revealed') {
          setCanCollect(false);
          const timer = setTimeout(() => setCanCollect(true), 1000);
          return () => clearTimeout(timer);
      } else {
          setCanCollect(false);
      }
  }, [animationStage]);

  // --- HANDLERS ---
  const startLootboxSequence = async (boxId, boxType) => {
      setSelectedBox(null);
      setProcessingBoxId(boxId);
      
      // Sequenz Start
      setAnimationStage('charging');
      
      // Wartezeit für Charging
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnimationStage('shaking');

      try {
        const [_, newPet] = await Promise.all([
            new Promise(resolve => setTimeout(resolve, 2000)), // Shake Dauer
            onOpenLootbox(boxId, boxType)
        ]);
        if (newPet) {
            setResultPet(newPet);
            setAnimationStage('cycling');
            // Kein fester Timeout mehr hier, useEffect übernimmt den Übergang zu 'revealed'
        } else {
            setAnimationStage('idle');
            setProcessingBoxId(null);
        }
      } catch (e) {
          console.error(e);
          setAnimationStage('idle');
          setProcessingBoxId(null);
      }
  };

  const finishAnimation = () => {
    setAnimationStage('idle');
    setProcessingBoxId(null);
    setResultPet(null);
  };
  
  // --- RENDER MODALS ---

  // Potion Modal (NEU)
  const renderPotionModal = () => {
      if (!selectedPotion) return null;
      const isCosmetic = !!COSMETICS[selectedPotion.variant];
      const Icon = isCosmetic ? Palette : FlaskConical;
      
      return (
          <ItemActionModal 
              title={selectedPotion.config.label}
              icon={Icon}
              count={selectedPotion.count}
              description={selectedPotion.config.desc || (t ? t('inv_magic_item_desc') : "Ein magischer Gegenstand.")}
              actionLabel={t ? t('inv_use') : "WÄHLEN"}
              actionIcon={Zap}
              onAction={(qty) => { onUseConsumable(selectedPotion.ids[0], qty); setSelectedPotion(null); }}
              onClose={() => setSelectedPotion(null)}
              colorClass={selectedPotion.config.color}
              bgClass={selectedPotion.config.bg}
              showQuantitySelector={!isCosmetic} 
          />
      );
  };

  if (animationStage !== 'idle') {
      const rarity = resultPet ? RARITIES[resultPet.rarity] : RARITIES.COMMON;
      const isEgg = resultPet?.isEgg;
      
      return (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
             
             {/* HINTERGRUND EFFEKTE */}
             <div className="absolute inset-0 pointer-events-none">
                 {/* Sternenfeld */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                 
                 {/* Wirbelnder Tunnel */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(79,70,229,0.1)_0deg,transparent_60deg,rgba(79,70,229,0.1)_120deg,transparent_180deg,rgba(79,70,229,0.1)_240deg,transparent_300deg,rgba(79,70,229,0.1)_360deg)] animate-spin-slow opacity-50"></div>
             </div>

             {/* CHARGING & SHAKING */}
             {(animationStage === 'charging' || animationStage === 'shaking') && (
                 <div className="relative z-10 flex flex-col items-center">
                     {/* Glow hinter der Box */}
                     <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500 rounded-full blur-[80px] transition-all duration-500 ${animationStage === 'shaking' ? 'scale-150 opacity-60' : 'scale-0 opacity-0'}`}></div>
                     
                     {/* Die Box */}
                     <div className={`relative ${animationStage === 'charging' ? 'animate-bounce' : 'animate-shake-hard'} transition-transform duration-300`}>
                         <Package className={`w-48 h-48 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] ${animationStage === 'shaking' ? 'brightness-150' : ''}`} />
                     </div>
                     
                     <p className="text-yellow-200 mt-12 font-black text-2xl tracking-[0.3em] animate-pulse">
                         {animationStage === 'charging' ? 'BEREIT...' : 'ÖFFNE...'}
                     </p>
                 </div>
             )}

             {/* CYCLING & REVEAL */}
             {(animationStage === 'cycling' || animationStage === 'revealed') && (
                 <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in duration-200">
                     {/* Background Flash based on current cycle rarity */}
                     <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${cycleRarity.bg} blur-[100px] opacity-80 transition-colors duration-75 pointer-events-none`}></div>
                     
                     <div className="scale-150 mb-8">
                        <Sparkles className={`w-32 h-32 ${cycleRarity.color} ${animationStage === 'cycling' ? 'animate-spin-slow' : 'animate-pulse'}`} />
                     </div>

                     <div className="text-center">
                         <h2 className={`text-4xl font-black uppercase tracking-widest ${cycleRarity.color} drop-shadow-lg transition-colors duration-75`}>
                             {cycleRarity.label}
                         </h2>
                         <p className="text-white/50 text-sm font-bold uppercase tracking-[0.5em] mt-2">
                             {animationStage === 'cycling' ? "Bestimme Seltenheit..." : "GEFUNDEN!"}
                         </p>
                     </div>

                     {/* Button */}
                     {animationStage === 'revealed' && canCollect && (
                         <button 
                            onClick={finishAnimation} 
                            className="mt-12 bg-white hover:bg-slate-200 text-black px-10 py-4 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all animate-in fade-in zoom-in duration-300 relative z-20"
                         >
                             EINSAMMELN
                         </button>
                     )}
                </div>
             )}
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* MODALS */}
      {selectedItem && (
        <ItemActionModal 
            title={t ? `${t('rarity_' + selectedItem.base.rarity)} ${t('inv_egg_suffix')}` : `${RARITIES[selectedItem.base.rarity].label} Ei`}
            icon={Egg}
            count={selectedItem.count}
            description={
                <div className="flex flex-col items-center gap-1">
                    <span className="mb-2">{t ? (selectedItem.isBreeding ? t('inv_egg_desc_breed') : t('inv_egg_desc_mystery')) : `Ein ${selectedItem.isBreeding ? 'durch Zucht entstandenes' : 'mysteriöses'} Ei.`}</span>
                    
                    {/* NEU: Detaillierte Eltern-Anzeige */}
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
                    ) : (
                        /* Fallback für alte Eier */
                        selectedItem.base.customData?.parentsNames && (
                        <div className="mt-1 flex items-center gap-2 bg-pink-500/20 px-3 py-1.5 rounded-lg border border-pink-500/30">
                            <Dna className="w-3.5 h-3.5 text-pink-400" />
                            <span className="text-pink-200 font-bold text-xs">
                                {t ? t('inv_parents') : 'Eltern'}: {selectedItem.base.customData.parentsNames}
                            </span>
                        </div>
                        )
                    )}
                </div>
            }
            actionLabel={t ? t('inv_incubate') : "INKUBIEREN"}
            actionIcon={ThermometerSun}
            onAction={() => { onStartIncubation(selectedItem.ids[0]); setSelectedItem(null); }}
            onClose={() => setSelectedItem(null)}
            colorClass={RARITIES[selectedItem.base.rarity].color}
            bgClass={RARITIES[selectedItem.base.rarity].bg}
        />
      )}
      {selectedBox && (
        <ItemActionModal 
            title={t ? t('box_' + selectedBox.variant) : `${selectedBox.variant === 'TYPE_DAILY' ? 'Elementar' : selectedBox.variant} Box`}
            icon={Package}
            count={selectedBox.count}
            description={t ? t('inv_box_desc') : "Eine verschlossene Schatzkiste."}
            actionLabel={t ? t('inv_open') : "ÖFFNEN"}
            actionIcon={BoxSelect}
            onAction={() => startLootboxSequence(selectedBox.ids[0], 'BOX')}
            onClose={() => setSelectedBox(null)}
            colorClass="text-yellow-400"
            bgClass="bg-yellow-500"
        />
      )}
      {renderPotionModal()}

      {/* HEADER */}
      <div className="relative flex items-center justify-between mb-6 pt-2 px-4 shrink-0">
          <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 drop-shadow-sm">
              {t ? t('pethub_items_btn') : 'RUCKSACK'}
          </h1>
          <button onClick={onBack} className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
              <ArrowLeft className="w-5 h-5" />
          </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">
      
      {/* 1. VERBRAUCHSGÜTER */}
      {potionItems.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-400" /> {t ? t('inv_consumables') : 'Verbrauchsgüter'}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {potionItems.map((potion, idx) => {
                      const isCosmetic = !!COSMETICS[potion.variant];
                      return (
                          <InventoryCard 
                              key={idx}
                              onClick={() => setSelectedPotion(potion)} 
                              icon={isCosmetic ? Palette : FlaskConical}
                              count={potion.count}
                              label={t ? t('item_' + potion.variant) : potion.config.label}
                              colorColor={potion.config.color}
                              bgColor={potion.config.bg}
                              ringColor={isCosmetic ? "ring-pink-500/50" : "ring-purple-500/50"}
                          />
                      );
                  })}
              </div>
          </div>
      )}

      {/* 2. MATERIALIEN */}
      {hasResources && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
              <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Pickaxe className="w-4 h-4 text-emerald-400" /> {t ? t('inv_materials') : 'Materialien'}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {materialItems.map((item) => (
                      <InventoryCard 
                          key={item.id}
                          icon={RES_ICONS[item.category]} 
                          count={item.count}
                          label={t ? t('item_' + item.id) : item.label}
                          colorColor={item.color} 
                          bgColor="bg-slate-800"
                          onClick={() => {}} 
                      />
                  ))}
              </div>
          </div>
      )}

      {/* 3. TICKETS */}
      {ticketItems.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-150">
              <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Ticket className="w-4 h-4 text-pink-400" /> {t ? t('inv_special') : 'Spezial-Items'}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {ticketItems.map((ticket, idx) => (
                      <InventoryCard 
                          key={idx}
                          icon={Ticket}
                          count={ticket.count}
                          label={t ? t('inv_ticket_breed') : "Zucht-Ticket"}
                          colorColor="text-pink-400"
                          bgColor="bg-pink-600"
                          ringColor="ring-pink-500/50"
                          footerButton={
                            <button 
                                onClick={(e) => { e.stopPropagation(); onRedeemTicket(ticket.ids[0]); }} 
                                className='w-full bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black py-2 rounded-xl shadow-lg flex justify-center items-center gap-1 active:scale-95 transition-all'
                            >
                                <Gift className='w-3 h-3' /> {t ? t('inv_redeem') : 'EINLÖSEN'}
                            </button>
                          }
                      />
                  ))}
              </div>
          </div>
      )}

      {/* 4. BOXEN */}
      {boxItems.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
               <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Package className="w-4 h-4 text-yellow-400" /> {t ? t('inv_lootboxes') : 'Schatzkisten'}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {boxItems.map((box, idx) => (
                      <InventoryCard 
                          key={idx}
                          onClick={() => setSelectedBox(box)}
                          icon={Package}
                          count={box.count}
                          label={t ? t('box_' + box.variant) : (box.variant === 'TYPE_DAILY' ? 'Elementar-Truhe' : box.variant)}
                          colorColor="text-yellow-400"
                          bgColor="bg-yellow-500"
                      />
                  ))}
              </div>
          </div>
      )}

      {/* 5. EIER */}
      <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Egg className="w-4 h-4 text-indigo-400" /> {t ? t('inv_eggs') : 'Monster-Eier'}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {inventoryItems.map((item, idx) => { 
                  const rarity = RARITIES[item.base.rarity]; 
                  return (
                    <InventoryCard 
                        key={idx}
                        onClick={() => setSelectedItem(item)}
                        icon={Egg}
                        count={item.count}
                        label={t ? t('rarity_' + item.base.rarity) : rarity.label}
                        colorColor={rarity.color}
                        bgColor={rarity.bg}
                        ringColor={item.isBreeding ? 'ring-pink-500/50' : null}
                        specialIcon={
                            item.isBreeding && <div className="absolute -bottom-2 -right-2 bg-pink-500 p-1.5 rounded-full border-2 border-slate-900 shadow-sm z-20"><Dna className="w-3.5 h-3.5 text-white" /></div>
                        }
                    />
                  ); 
              })}
          </div>
      </div>

      </div>
    </div>
  );
}