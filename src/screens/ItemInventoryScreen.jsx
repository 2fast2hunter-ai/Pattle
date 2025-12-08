import React, { useState } from 'react';
import { ArrowLeft, X, Egg, Dna, ShoppingBag, ThermometerSun, BoxSelect, Package, Ticket, Gift, Sparkles, TreePine, Pickaxe, Fish, Star, Cpu, FlaskConical, Zap, Palette, Minus, Plus } from 'lucide-react';
import { RARITIES, RESOURCE_ITEMS, CONSUMABLES, COSMETICS } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

// Icons für Materialien
const RES_ICONS = {
    wood: TreePine, stone: Pickaxe, seafood: Fish, stardust: Star, computer_parts: Cpu, special: Sparkles
};

// --- INVENTORY CARD ---
const InventoryCard = ({ icon: Icon, count, label, colorColor, bgColor, onClick, specialIcon, footerButton, ringColor }) => (
    <div 
        onClick={onClick} 
        className={`
            relative group aspect-square rounded-[24px] p-3 cursor-pointer overflow-hidden transition-all duration-300
            bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg
            hover:scale-[1.02] hover:shadow-2xl hover:border-white/30 active:scale-95
            ${ringColor ? `ring-2 ${ringColor} ring-offset-2 ring-offset-slate-950` : ''}
            flex flex-col items-center justify-between
        `}
    >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${bgColor} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}></div>

        <div className="w-full flex justify-end relative z-10">
            <span className="bg-slate-950/80 text-[10px] font-black text-white px-2 py-0.5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">
                x{Math.floor(count).toLocaleString()}
            </span>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="relative">
                <Icon className={`w-12 h-12 ${colorColor} drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform`} />
                {specialIcon}
            </div>
        </div>
        
        <div className="relative z-10 w-full text-center flex flex-col gap-1.5">
            <div className={`text-[9px] font-black uppercase tracking-wider ${colorColor} ${footerButton ? 'truncate leading-none' : 'bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm w-full leading-tight'}`}>
                {label}
            </div>
            {footerButton}
        </div>
    </div>
);

// --- MODERNES MODAL MIT MENGENAUSWAHL ---
const ModernModal = ({ title, icon: MainIcon, count, description, actionLabel, actionIcon: ActionIcon, onAction, onClose, colorClass, bgClass, borderClass, specialBadge, showQuantitySelector }) => {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity(q => Math.min(q + 1, count));
    const decrement = () => setQuantity(q => Math.max(q - 1, 1));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in zoom-in-50 duration-300">
            <div className={`bg-slate-900/90 border border-white/10 w-full max-w-sm rounded-[32px] p-0 relative overflow-hidden flex flex-col shadow-2xl shadow-black/50`}>
                
                <div className="relative h-44 flex items-center justify-center overflow-hidden shrink-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${bgClass} blur-[60px] opacity-30 animate-pulse`}></div>
                    
                    <div className="relative z-10 scale-150 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                        <MainIcon className={`w-28 h-28 ${colorClass}`} />
                        {specialBadge}
                    </div>
                    
                    <div className="absolute bottom-4 bg-slate-950/80 text-white text-sm font-black px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg z-20 flex items-center gap-1">
                        <span className="text-slate-400">Besitz:</span> x{Math.floor(count)}
                    </div>

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-white/20 transition-colors z-20 backdrop-blur-md border border-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <h2 className={`text-2xl font-black ${colorClass} mb-3 uppercase tracking-wide drop-shadow-sm`}>{title}</h2>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">{description}</p>
                    
                    {/* MENGENAUSWAHL */}
                    {showQuantitySelector && count > 1 && (
                        <div className="flex justify-center items-center gap-4 mb-6 bg-slate-800/50 p-2 rounded-2xl border border-white/5 w-fit mx-auto">
                            <button onClick={decrement} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-white/10"><Minus className="w-4 h-4 text-white" /></button>
                            <div className="text-center w-12">
                                <span className="block text-[10px] text-slate-400 font-bold uppercase">Menge</span>
                                <span className="block text-xl font-black text-white">{quantity}</span>
                            </div>
                            <button onClick={increment} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-white/10"><Plus className="w-4 h-4 text-white" /></button>
                            <button onClick={() => setQuantity(count)} className="text-[10px] font-bold text-indigo-400 uppercase ml-2 hover:text-white transition-colors">Max</button>
                        </div>
                    )}

                    {onAction && (
                        <button 
                            onClick={() => onAction(quantity)} 
                            className={`w-full py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all font-black text-white
                            bg-gradient-to-r ${borderClass === 'pink' ? 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-500/30' : (borderClass === 'yellow' ? 'from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 shadow-yellow-500/30' : 'from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/30')}`}
                        >
                            <ActionIcon className="w-5 h-5" /> {actionLabel} {showQuantitySelector && quantity > 1 ? `(${quantity}x)` : ''}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


export default function ItemInventoryScreen({ pets, onBack, onStartIncubation, user, onRedeemTicket, onUseConsumable }) { 
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedPotion, setSelectedPotion] = useState(null); 
  
  // --- ANIMATION STATES ---
  const [animationStage, setAnimationStage] = useState('idle'); 
  const [processingBoxId, setProcessingBoxId] = useState(null);
  const [resultPet, setResultPet] = useState(null); 

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
          const key = `${pet.rarity}-${pet.source || 'SHOP'}`;
          if (!stacks[key]) { stacks[key] = { base: pet, count: 0, ids: [], rarity: pet.rarity, source: pet.source || 'SHOP' }; }
          stacks[key].count++;
          stacks[key].ids.push(pet.id);
      }
  });

  const inventoryItems = Object.values(stacks).sort((a, b) => {
      const rA = RARITIES[a.base.rarity]?.id || 0;
      const rB = RARITIES[b.base.rarity]?.id || 0;
      return rB - rA;
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
            onStartIncubation(boxId, boxType)
        ]);
        if (newPet) {
            setResultPet(newPet);
            setAnimationStage('exploding');
            // Kurzer weißer Blitz
            await new Promise(resolve => setTimeout(resolve, 200));
            setAnimationStage('revealed');
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
          <ModernModal 
              title={selectedPotion.config.label}
              icon={Icon}
              count={selectedPotion.count}
              description={selectedPotion.config.desc || "Ein magischer Gegenstand."}
              actionLabel="WÄHLEN"
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
             <div className="absolute inset-0">
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

             {/* EXPLOSION FLASH */}
             {animationStage === 'exploding' && (
                 <div className="absolute inset-0 bg-white z-[110] animate-out fade-out duration-300"></div>
             )}

             {/* REVEAL */}
             {animationStage === 'revealed' && resultPet && (
                 <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
                     
                     {/* Rotierende God Rays */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0 opacity-30 animate-spin-slow pointer-events-none">
                         <div className={`w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,${rarity.color.replace('text-', '')}_0deg,transparent_20deg,${rarity.color.replace('text-', '')}_40deg,transparent_60deg,${rarity.color.replace('text-', '')}_80deg,transparent_100deg,${rarity.color.replace('text-', '')}_120deg,transparent_140deg,${rarity.color.replace('text-', '')}_160deg,transparent_180deg,${rarity.color.replace('text-', '')}_200deg,transparent_220deg,${rarity.color.replace('text-', '')}_240deg,transparent_260deg,${rarity.color.replace('text-', '')}_280deg,transparent_300deg,${rarity.color.replace('text-', '')}_320deg,transparent_340deg,${rarity.color.replace('text-', '')}_360deg)]`}></div>
                     </div>

                     {/* Rarity Glow */}
                     <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${rarity.bg} blur-[80px] opacity-60 animate-pulse`}></div>

                     {/* Pet Avatar */}
                     <div className="relative z-10 scale-150 mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                         <PetAvatar pet={resultPet} className="w-48 h-48" />
                     </div>

                     <div className="text-center relative z-10 space-y-2">
                         <div className={`text-sm font-black uppercase tracking-[0.2em] ${rarity.color} drop-shadow-md`}>
                             {isEgg ? 'NEUER FUND' : rarity.label}
                         </div>
                         <h2 className="text-4xl font-black text-white drop-shadow-xl">
                             {/* HIER GEÄNDERT: Bei Eiern wird nur die Seltenheit (oder 'EI') angezeigt, nicht der Tiername */}
                             {isEgg ? rarity.label : resultPet.name}
                         </h2>
                         {!isEgg && (
                             <div className="text-slate-400 font-bold text-sm bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm mx-auto w-fit border border-white/10 mt-2">
                                 Lvl {resultPet.level}
                             </div>
                         )}
                     </div>

                     <button 
                        onClick={finishAnimation} 
                        className="mt-12 bg-white hover:bg-slate-200 text-black px-10 py-4 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                     >
                         EINSAMMELN
                     </button>
                 </div>
             )}
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* MODALS */}
      {selectedItem && (
        <ModernModal 
            title={`${RARITIES[selectedItem.base.rarity].label} Ei`}
            icon={Egg}
            count={selectedItem.count}
            description={<span>Ein {selectedItem.source === 'BREEDING' ? 'durch Zucht entstandenes' : 'mysteriöses'} Ei.</span>}
            actionLabel="INKUBIEREN"
            actionIcon={ThermometerSun}
            onAction={() => { onStartIncubation(selectedItem.ids[0]); setSelectedItem(null); }}
            onClose={() => setSelectedItem(null)}
            colorClass={RARITIES[selectedItem.base.rarity].color}
            bgClass={RARITIES[selectedItem.base.rarity].bg}
        />
      )}
      {selectedBox && (
        <ModernModal 
            title={`${selectedBox.variant} Box`}
            icon={Package}
            count={selectedBox.count}
            description="Eine verschlossene Schatzkiste."
            actionLabel="ÖFFNEN"
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
              RUCKSACK
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
              <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-400" /> Verbrauchsgüter</h3>
              <div className="grid grid-cols-2 gap-4">
                  {potionItems.map((potion, idx) => {
                      const isCosmetic = !!COSMETICS[potion.variant];
                      return (
                          <InventoryCard 
                              key={idx}
                              onClick={() => setSelectedPotion(potion)} 
                              icon={isCosmetic ? Palette : FlaskConical}
                              count={potion.count}
                              label={potion.config.label}
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
              <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Pickaxe className="w-4 h-4 text-emerald-400" /> Materialien</h3>
              <div className="grid grid-cols-2 gap-4">
                  {materialItems.map((item) => (
                      <InventoryCard 
                          key={item.id}
                          icon={RES_ICONS[item.category]} 
                          count={item.count}
                          label={item.label}
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
              <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Ticket className="w-4 h-4 text-pink-400" /> Spezial-Items</h3>
              <div className="grid grid-cols-2 gap-4">
                  {ticketItems.map((ticket, idx) => (
                      <InventoryCard 
                          key={idx}
                          icon={Ticket}
                          count={ticket.count}
                          label="Zucht-Ticket"
                          colorColor="text-pink-400"
                          bgColor="bg-pink-600"
                          ringColor="ring-pink-500/50"
                          footerButton={
                            <button 
                                onClick={(e) => { e.stopPropagation(); onRedeemTicket(ticket.ids[0]); }} 
                                className='w-full bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black py-2 rounded-xl shadow-lg flex justify-center items-center gap-1 active:scale-95 transition-all'
                            >
                                <Gift className='w-3 h-3' /> EINLÖSEN
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
               <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Package className="w-4 h-4 text-yellow-400" /> Schatzkisten</h3>
              <div className="grid grid-cols-2 gap-4">
                  {boxItems.map((box, idx) => (
                      <InventoryCard 
                          key={idx}
                          onClick={() => setSelectedBox(box)}
                          icon={Package}
                          count={box.count}
                          label={box.variant}
                          colorColor="text-yellow-400"
                          bgColor="bg-yellow-500"
                      />
                  ))}
              </div>
          </div>
      )}

      {/* 5. EIER */}
      <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2"><Egg className="w-4 h-4 text-indigo-400" /> Monster-Eier</h3>
          <div className="grid grid-cols-2 gap-4">
              {inventoryItems.map((item, idx) => { 
                  const rarity = RARITIES[item.base.rarity]; 
                  return (
                    <InventoryCard 
                        key={idx}
                        onClick={() => setSelectedItem(item)}
                        icon={Egg}
                        count={item.count}
                        label={rarity.label}
                        colorColor={rarity.color}
                        bgColor={rarity.bg}
                        ringColor={item.source === 'BREEDING' ? 'ring-pink-500/50' : null}
                        specialIcon={
                            item.source === 'BREEDING' && <div className="absolute -bottom-2 -right-2 bg-pink-500 p-1.5 rounded-full border-2 border-slate-900 shadow-sm z-20"><Dna className="w-3.5 h-3.5 text-white" /></div>
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