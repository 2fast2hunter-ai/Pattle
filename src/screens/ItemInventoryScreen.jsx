import React, { useState } from 'react';
import { ArrowLeft, X, Egg, Dna, ShoppingBag, ThermometerSun, BoxSelect, Package, Backpack, Ticket, Gift, Sparkles } from 'lucide-react';
import { RARITIES } from '../data/gameData';
import PetAvatar from '../components/PetAvatar';

export default function ItemInventoryScreen({ pets, onBack, onStartIncubation, user, onRedeemTicket }) { 
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  
  const [animationStage, setAnimationStage] = useState('idle'); 
  const [processingBoxId, setProcessingBoxId] = useState(null);
  const [resultPet, setResultPet] = useState(null); 

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

  // --- NEUE SYNCHRONISIERTE ANIMATION ---
  const startLootboxSequence = async (boxId, boxType) => {
      // 1. Startzustand
      setSelectedBox(null);
      setProcessingBoxId(boxId);
      setAnimationStage('shaking');
      setResultPet(null);

      try {
          // 2. Warten auf BEIDES: Mindest-Animation (2.5s) UND Datenbank-Antwort
          const [_, newPet] = await Promise.all([
              new Promise(resolve => setTimeout(resolve, 2500)), // Mindestens 2.5s wackeln
              onStartIncubation(boxId, boxType)                  // Echte Daten laden
          ]);

          // 3. Nur weitermachen, wenn wir ein Pet haben
          if (newPet) {
              setResultPet(newPet);
              setAnimationStage('exploding');
              
              // Nach 300ms Blitz -> Enthüllen
              setTimeout(() => {
                  setAnimationStage('revealed');
              }, 300);
          } else {
              // Fehlerfall (z.B. Inventarfehler)
              setAnimationStage('idle');
              setProcessingBoxId(null);
          }
      } catch (error) {
          console.error("Lootbox Error:", error);
          setAnimationStage('idle');
          setProcessingBoxId(null);
      }
  };

  const finishAnimation = () => {
    setAnimationStage('idle');
    setProcessingBoxId(null);
    setResultPet(null);
  };

  const handleTicketRedeem = async (ticketId) => {
      onRedeemTicket(ticketId); 
  }

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

  // --- VOLLBILD ANIMATION ---
  if (animationStage !== 'idle') {
      return (
          <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center overflow-hidden">
              <style>{animStyles}</style>
              
              {/* PHASE 1: SHAKING */}
              {animationStage === 'shaking' && (
                  <div className="relative flex flex-col items-center justify-center animate-in fade-in duration-300">
                      <div className="absolute inset-0 bg-yellow-500/30 blur-[100px] animate-pulse rounded-full scale-150"></div>
                      <div className="absolute -inset-20 bg-gradient-radial from-yellow-400/20 to-transparent animate-spin-slow opacity-70"></div>
                      <div className="relative z-10 animate-shake-hard">
                          <Package className="w-48 h-48 text-yellow-400 drop-shadow-[0_10px_30px_rgba(250,204,21,0.5)]" />
                      </div>
                      <p className="text-yellow-200 font-black tracking-widest mt-12 text-xl animate-pulse uppercase relative z-10">Wird geöffnet...</p>
                  </div>
              )}

              {/* PHASE 2: EXPLOSION */}
              {animationStage === 'exploding' && (
                  <div className="fixed inset-0 bg-white z-[110] animate-out fade-out duration-500"></div>
              )}

              {/* PHASE 3: REVEAL (SICHERER RENDER) */}
              {animationStage === 'revealed' && resultPet && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
                       <div className="absolute inset-0 flex items-center justify-center opacity-50">
                           <div className={`w-[200vw] h-[200vw] bg-gradient-conic from-${RARITIES[resultPet.rarity].color.split('-')[1]}-500/0 via-${RARITIES[resultPet.rarity].color.split('-')[1]}-500/20 to-${RARITIES[resultPet.rarity].color.split('-')[1]}-500/0 animate-spin-slow`}></div>
                       </div>

                       <div className="relative z-10 flex flex-col items-center animate-float-up">
                           <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wider drop-shadow-lg">GEFUNDEN!</h2>
                           <p className={`text-lg font-bold mb-8 ${RARITIES[resultPet.rarity].color} uppercase tracking-widest`}>{RARITIES[resultPet.rarity].label}</p>
                           
                           <div className="relative mb-10 group scale-150">
                               <div className={`absolute inset-0 ${RARITIES[resultPet.rarity].bg} blur-3xl opacity-60 animate-pulse rounded-full`}></div>
                               
                               {/* PetAvatar zeigt jetzt das Ei, aber in groß und schön */}
                               <div className="relative z-10 animate-bounce-slow">
                                   <PetAvatar pet={resultPet} className="w-40 h-40 drop-shadow-2xl" />
                               </div>

                               <Sparkles className="absolute top-0 right-0 text-yellow-300 w-12 h-12 animate-ping-slow" />
                           </div>
                           
                           <div className="bg-slate-800/80 backdrop-blur border border-white/10 p-4 rounded-2xl mb-8 text-center">
                               <p className="text-slate-300 text-sm font-bold">
                                   {resultPet.isEgg ? 'Ein neues Ei!' : 'Ein neues Pet!'}
                               </p>
                               <p className="text-xs text-slate-500 mt-1">
                                   {resultPet.isEgg ? 'Ab in die Brutstätte damit.' : 'Es wartet im Pet Hub.'}
                               </p>
                           </div>
                           
                           <button 
                               onClick={finishAnimation}
                               className="px-10 py-4 bg-white text-slate-900 font-black text-lg rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95 flex items-center gap-3"
                           >
                               <ThermometerSun className="w-6 h-6" />
                               ALLES KLAR
                           </button>
                       </div>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in relative">
      
      {/* MODAL EIER */}
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in zoom-in-50">
             <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-full ${RARITIES[selectedItem.base.rarity].bg} opacity-5 blur-3xl`}></div>
                 <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/20 text-white"><X className="w-5 h-5" /></button>
                 <h2 className="text-2xl font-black text-white mb-1 relative z-10">Ei ausbrüten?</h2>
                 <div className="w-32 h-32 bg-slate-800/50 rounded-full mx-auto flex items-center justify-center my-6 relative border border-white/10 shadow-inner">
                     <Egg className={`w-16 h-16 ${RARITIES[selectedItem.base.rarity].color} drop-shadow-lg`} />
                 </div>
                 <button onClick={() => { onStartIncubation(selectedItem.ids[0]); setSelectedItem(null); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg relative z-10">IN DEN INKUBATOR</button>
             </div>
          </div>
      )}

      {/* MODAL LOOTBOX */}
      {selectedBox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in zoom-in-50">
             <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-yellow-500 opacity-5 blur-3xl"></div>
                 <button onClick={() => setSelectedBox(null)} className="absolute top-4 right-4 p-2 bg-white/5 text-white rounded-full"><X className="w-5 h-5" /></button>
                 <h2 className="text-2xl font-black text-white mb-1 relative z-10">{selectedBox.variant} BOX</h2>
                 <div className="w-36 h-36 mx-auto flex items-center justify-center my-6 relative">
                     <Package className="w-24 h-24 text-yellow-400 drop-shadow-2xl relative z-10" />
                 </div>
                 <button onClick={() => startLootboxSequence(selectedBox.ids[0], 'BOX')} className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg relative z-10">JETZT ÖFFNEN</button>
             </div>
          </div>
      )}

      {/* HEADER */}
      <div className="relative flex items-center justify-center mb-6 pt-2 px-4">
          <h1 className="text-3xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">RUCKSACK</h1>
          <button onClick={onBack} className="absolute right-4 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500"><X className="w-5 h-5" /></button>
      </div>
      
      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide space-y-8">
        {ticketItems.length > 0 && (
            <div className="animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-2 mb-3 text-pink-400"><Ticket className="w-4 h-4" /><h3 className="text-xs font-black uppercase">Tickets</h3></div>
                <div className="grid grid-cols-1 gap-3">{ticketItems.map((t, i) => (<div key={i} className="bg-gradient-to-r from-pink-900/40 to-slate-800 border border-pink-500/30 rounded-xl p-4 flex justify-between items-center"><div className="font-bold text-white">Zucht-Ticket <span className="text-pink-400">x{t.count}</span></div><button onClick={() => handleTicketRedeem(t.ids[0])} className="bg-pink-600 px-3 py-1 rounded text-xs font-bold">EINLÖSEN</button></div>))}</div>
            </div>
        )}
        {boxItems.length > 0 && (
            <div className="animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-2 mb-3 text-yellow-400"><BoxSelect className="w-4 h-4" /><h3 className="text-xs font-black uppercase">Lootboxen</h3></div>
                <div className="grid grid-cols-2 gap-3">{boxItems.map((b, i) => (<div key={i} onClick={() => setSelectedBox(b)} className="bg-slate-800 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 cursor-pointer"><Package className="w-12 h-12 text-yellow-500"/><span className="font-bold text-white">{b.variant}</span><span className="text-xs text-slate-500">x{b.count}</span></div>))}</div>
            </div>
        )}
        <div>
            <div className="flex items-center gap-2 mb-3 text-slate-400"><Egg className="w-4 h-4" /><h3 className="text-xs font-black uppercase">Eier</h3></div>
            <div className="grid grid-cols-3 gap-3">{inventoryItems.map((item, idx) => (<div key={idx} onClick={() => setSelectedItem(item)} className={`bg-slate-800 rounded-xl p-2 flex flex-col items-center relative cursor-pointer border ${RARITIES[item.base.rarity].border}`}><div className="absolute top-1 right-1 bg-black/40 text-[9px] px-1.5 rounded">{item.count}</div><Egg className={`w-10 h-10 ${RARITIES[item.base.rarity].color} my-2`} /><span className={`text-[8px] font-bold ${RARITIES[item.base.rarity].color}`}>{RARITIES[item.base.rarity].label}</span></div>))}</div>
        </div>
      </div>
    </div>
  );
}