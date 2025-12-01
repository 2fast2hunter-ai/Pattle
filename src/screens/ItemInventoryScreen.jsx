import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Egg, Dna, ShoppingBag, ThermometerSun, BoxSelect, Package, Backpack, Ticket, Gift, Sparkles } from 'lucide-react';
import { RARITIES } from '../data/gameData';

export default function ItemInventoryScreen({ pets, onBack, onStartIncubation, user, onRedeemTicket }) { 
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  
  // --- NEUE STATES FÜR ANIMATION ---
  // 'idle' | 'shaking' | 'exploding' | 'revealed'
  const [animationStage, setAnimationStage] = useState('idle'); 
  const [processingBoxId, setProcessingBoxId] = useState(null);
  // --------------------------------

  // --- STAPEL LOGIK (Bleibt gleich) ---
  const stacks = {};
  pets.forEach(pet => {
      if (pet.isEgg && pet.hatchAt === 0) {
          const key = `${pet.rarity}-${pet.source || 'SHOP'}`;
          if (!stacks[key]) { stacks[key] = { base: pet, count: 0, ids: [], rarity: pet.rarity, source: pet.source || 'SHOP' }; }
          stacks[key].count++;
          stacks[key].ids.push(pet.id);
      }
  });
  const inventoryItems = Object.values(stacks);

  const boxStacks = {};
  const ticketStacks = {};
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
          }
      });
  }
  const boxItems = Object.values(boxStacks);
  const ticketItems = Object.values(ticketStacks); 

  // --- NEUE ANIMATIONS-LOGIK ---
  const startLootboxSequence = async (boxId, boxType) => {
      // 1. Modal schließen, Animation starten
      setSelectedBox(null);
      setProcessingBoxId(boxId);
      setAnimationStage('shaking');

      // 2. Backend Call (passiert im Hintergrund während der Animation)
      // Wir warten hier NICHT auf das Ergebnis, damit die Animation flüssig startet.
      // Das Ergebnis (Navigieren zur Hatchery) passiert automatisch durch useGameActions.
      onStartIncubation(boxId, boxType);

      // 3. Animations-Phasen steuern (Timer)
      
      // Phase 1: Schütteln (2.5s) -> Phase 2: Explosion
      setTimeout(() => {
          setAnimationStage('exploding');
      }, 2500);

      // Phase 2: Explosion (0.3s Blitz) -> Phase 3: Enthüllung
      setTimeout(() => {
        setAnimationStage('revealed');
    }, 2800); // 2500 + 300ms Blitz
  };

  const finishAnimation = () => {
    // Reset und schließen. Der View-Wechsel passiert durch das Backend.
    setAnimationStage('idle');
    setProcessingBoxId(null);
  };

  // --- CSS FÜR ANIMATIONEN (Inline für diesen Screen) ---
  const animStyles = `
    @keyframes shake-hard {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
    }
    .animate-shake-hard { animation: shake-hard 0.5s linear infinite; }

    @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
    .animate-spin-slow-reverse { animation: spin-slow-reverse 12s linear infinite; }
    
    @keyframes float-up { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1;} }
    .animate-float-up { animation: float-up 1s ease-out forwards; }
  `;


  // --- VOLLBILD ANIMATIONS OVERLAY ---
  if (animationStage !== 'idle') {
      return (
          <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center overflow-hidden">
              <style>{animStyles}</style>
              
              {/* PHASE 1: SHAKING */}
              {animationStage === 'shaking' && (
                  <div className="relative flex flex-col items-center justify-center animate-in fade-in duration-300">
                      {/* Hintergrund Licht */}
                      <div className="absolute inset-0 bg-yellow-500/30 blur-[100px] animate-pulse rounded-full scale-150"></div>
                      <div className="absolute -inset-20 bg-gradient-radial from-yellow-400/20 to-transparent animate-spin-slow opacity-70"></div>
                      
                      <div className="relative z-10 animate-shake-hard">
                          <Package className="w-48 h-48 text-yellow-400 drop-shadow-[0_10px_30px_rgba(250,204,21,0.5)]" />
                      </div>
                      <p className="text-yellow-200 font-black tracking-widest mt-12 text-xl animate-pulse uppercase relative z-10">Wird geöffnet...</p>
                  </div>
              )}

              {/* PHASE 2: EXPLOSION (Weißer Blitz) */}
              {animationStage === 'exploding' && (
                  <div className="fixed inset-0 bg-white z-[110] animate-out fade-out duration-500"></div>
              )}

              {/* PHASE 3: REVEAL */}
              {animationStage === 'revealed' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
                       {/* God Rays Hintergrund */}
                       <div className="absolute inset-0 flex items-center justify-center opacity-50">
                           <div className="w-[200vw] h-[200vw] bg-gradient-conic from-yellow-500/0 via-yellow-200/30 to-yellow-500/0 animate-spin-slow"></div>
                           <div className="absolute w-[200vw] h-[200vw] bg-gradient-conic from-white/0 via-white/20 to-white/0 animate-spin-slow-reverse"></div>
                       </div>

                       <div className="relative z-10 flex flex-col items-center animate-float-up">
                           <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg">Geschafft!</h2>
                           
                           {/* Das resultierende Ei (Generisch, da wir das genaue Ergebnis hier nicht kennen) */}
                           <div className="relative mb-10 group">
                               <div className="absolute inset-0 bg-white blur-3xl opacity-40 animate-pulse rounded-full"></div>
                               <Egg className="w-40 h-40 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] relative z-10 animate-bounce-slow" />
                               <Sparkles className="absolute top-0 right-0 text-yellow-300 w-12 h-12 animate-ping-slow" />
                           </div>
                           
                           <p className="text-slate-300 text-lg mb-8 font-bold">Ein neues Ei wartet in der Brutstätte!</p>
                           
                           <button 
                               onClick={finishAnimation}
                               className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center gap-3"
                           >
                               <ThermometerSun className="w-6 h-6" />
                               ZUR BRUTSTÄTTE
                           </button>
                       </div>
                  </div>
              )}
          </div>
      );
  }


  // --- NORMALER SCREEN INHALT (unverändert) ---
  return (
    <div className="h-full flex flex-col animate-in fade-in relative">
      
      {/* --- MODAL: EIER (Inkubation starten) --- */}
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in zoom-in-50">
             <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-full ${RARITIES[selectedItem.base.rarity].bg} opacity-5 blur-3xl`}></div>
                 
                 <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white"><X className="w-5 h-5" /></button>
                 
                 <h2 className="text-2xl font-black text-white mb-1 relative z-10">Ei ausbrüten?</h2>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6 relative z-10">{RARITIES[selectedItem.base.rarity].label}</p>
                 
                 <div className="w-32 h-32 bg-slate-800/50 rounded-full mx-auto flex items-center justify-center mb-6 relative border border-white/10 shadow-inner">
                     <Egg className={`w-16 h-16 ${RARITIES[selectedItem.base.rarity].color} drop-shadow-lg`} />
                     <div className="absolute -bottom-3 bg-white text-black text-xs font-black px-3 py-1 rounded-full shadow-lg border border-slate-200">x{selectedItem.count}</div>
                 </div>
                 
                 <p className="text-slate-300 text-sm mb-6 px-4 relative z-10">
                     Dieses Ei benötigt einen Platz in der Brutstätte.
                 </p>
                 
                 <button onClick={() => { onStartIncubation(selectedItem.ids[0]); setSelectedItem(null); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10">
                    <ThermometerSun className="w-5 h-5" /> IN DEN INKUBATOR
                 </button>
             </div>
          </div>
      )}

      {/* --- MODAL: LOOTBOX (Öffnen Dialog) --- */}
      {selectedBox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in zoom-in-50">
             <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-yellow-500 opacity-5 blur-3xl"></div>

                 <button onClick={() => setSelectedBox(null)} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white"><X className="w-5 h-5" /></button>
                 
                 <h2 className="text-2xl font-black text-white mb-1 relative z-10">{selectedBox.variant} BOX</h2>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6 relative z-10">Geheimnisvoller Inhalt</p>
                 
                 <div className="w-36 h-36 mx-auto flex items-center justify-center mb-6 relative">
                     <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                     <Package className="w-24 h-24 text-yellow-500 drop-shadow-2xl relative z-10" />
                     <div className="absolute -bottom-2 bg-white text-black text-xs font-black px-3 py-1 rounded-full shadow-lg border border-slate-200 z-20">x{selectedBox.count}</div>
                 </div>
                 
                 <p className="text-slate-300 text-sm mb-6 relative z-10">
                     Enthält ein zufälliges Ei. <br/> Bist du bereit für die Überraschung?
                 </p>
                 
                 {/* HIER WIRD JETZT DIE ANIMATION GESTARTET */}
                 <button onClick={() => startLootboxSequence(selectedBox.ids[0], 'BOX')} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10">
                    <BoxSelect className="w-5 h-5" /> JETZT ÖFFNEN
                 </button>
             </div>
          </div>
      )}


      {/* --- HEADER --- */}
      <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
          <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              RUCKSACK
          </h1>
          <button 
              onClick={onBack} 
              className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors active:scale-95"
          >
              <X className="w-5 h-5" />
          </button>
      </div>
      
      {/* --- INHALT --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">
        
        {/* 1. TICKETS */}
        {ticketItems.length > 0 && (
            <div className="animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-2 mb-3 text-pink-400">
                    <Ticket className="w-4 h-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Tickets & Gutscheine</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {ticketItems.map((ticket, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-pink-900/40 to-slate-800 border border-pink-500/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group">
                            <div className="absolute -left-4 -top-4 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center border border-pink-500/50 text-pink-400">
                                    <Gift className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">Zucht-Ticket</div>
                                    <div className="text-xs text-pink-200/60">Ermöglicht eine Zucht im Labor</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 relative z-10">
                                <span className="text-2xl font-black text-white/20 group-hover:text-white/40 transition-colors">x{ticket.count}</span>
                                <button onClick={() => onRedeemTicket(ticket.ids[0])} className='bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg active:scale-95 transition-all shadow-lg'>EINLÖSEN</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 2. LOOTBOXEN */}
        {boxItems.length > 0 && (
            <div className="animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-2 mb-3 text-yellow-400">
                    <BoxSelect className="w-4 h-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Lootboxen</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {boxItems.map((box, idx) => (
                        <div key={idx} onClick={() => setSelectedBox(box)} className="bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 relative cursor-pointer hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-900/20 transition-all group">
                            <div className="absolute top-2 right-2 bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded text-slate-400 border border-white/5">x{box.count}</div>
                            <div className="relative mt-2">
                                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                <Package className="w-14 h-14 text-yellow-500 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-white text-sm">{box.variant}</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">Box</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 3. EIER */}
        <div>
            <div className="flex items-center gap-2 mb-3 text-slate-400">
                <Egg className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Gesammelte Eier</h3>
            </div>
            {inventoryItems.length === 0 && boxItems.length === 0 && ticketItems.length === 0 ? (
                <div className="text-center text-slate-500 py-10 flex flex-col items-center bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-700">
                    <Backpack className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-bold">Leer</p>
                    <p className="text-xs mt-1 opacity-60">Kaufe Boxen oder züchte Pets!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {inventoryItems.map((item, idx) => { 
                        const rarity = RARITIES[item.base.rarity]; 
                        return (
                          <div key={idx} onClick={() => setSelectedItem(item)} className={`bg-slate-800 rounded-xl p-2 flex flex-col items-center justify-between relative cursor-pointer hover:bg-slate-750 transition-all border ${rarity.border} group`}>
                              <div className="absolute top-1 right-1 bg-black/40 text-[9px] font-bold text-white px-1.5 rounded">{item.count}</div>
                              <div className="relative my-2">
                                  <Egg className={`w-10 h-10 ${rarity.color} drop-shadow-md group-hover:scale-110 transition-transform`} />
                                  {item.source === 'BREEDING' && <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-0.5 border border-slate-800"><Dna className="w-2.5 h-2.5 text-white" /></div>}
                                  {item.source === 'SHOP' && <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-slate-800"><ShoppingBag className="w-2.5 h-2.5 text-black" /></div>}
                              </div>
                              <span className={`text-[8px] font-black ${rarity.color} uppercase bg-black/20 px-2 py-0.5 rounded w-full text-center truncate`}>{rarity.label}</span>
                          </div>
                        ); 
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}