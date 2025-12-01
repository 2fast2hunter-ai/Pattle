import React, { useState } from 'react';
import { ArrowLeft, Coins, Info, Heart, Ticket, Clock } from 'lucide-react';
import { TYPES, RARITIES } from '../data/gameData';

// ACHTUNG: coins aus Props entfernt!
export default function BreedingScreen({ pets, onBreed, onBack, user }) { 
  const [selected, setSelected] = useState([]);
  const cooldownDuration = 24 * 60 * 60 * 1000; // 1 Tag Cooldown

  const p1 = selected.length > 0 ? pets.find(p => p.id === selected[0]) : null;
  const p2 = selected.length > 1 ? pets.find(p => p.id === selected[1]) : null;

  const breedablePets = pets.filter(p => !p.isEgg);

  const toggleSelect = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(pid => pid !== id));
    else if (selected.length < 2) setSelected([...selected, id]);
  };

  const getCooldownStatus = (pet) => {
    if (!pet || !pet.bredAt) return null;
    
    // Hole den korrekten Cooldown für dieses Pet
    const cooldownDuration = RARITIES[pet.rarity].breedCooldown;
    
    const cooldownEnd = pet.bredAt + cooldownDuration;
    const timeLeft = cooldownEnd - Date.now();

    if (timeLeft <= 0) return null;

    // Formatierung für Tage/Stunden/Minuten
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m`;
  }

  const isReadyToBreed = selected.length === 2 && getCooldownStatus(p1) === null && getCooldownStatus(p2) === null;
  
  // KORREKTER ZÄHLER: Liest den Zähler aus der Datenbank (sollte 1 oder mehr sein)
  const userTicketCount = user?.redeemedTickets || 0; 

  const missingTickets = userTicketCount < 1;
  const isSelectionValid = selected.length === 2;
  const isCooldown = isSelectionValid && !isReadyToBreed;
  const isDisabled = isCooldown || missingTickets || !isSelectionValid;

  // Logik für den Button-Text
  const getButtonText = () => {
      if (missingTickets) return 'TICKET KAUFEN';
      if (!isSelectionValid) return 'WÄHLE 2 PETS';
      if (isCooldown) return 'WARTEN (Eltern im Cooldown)';
      return 'JETZT ZÜCHTEN';
  }
  
  // Logik für den Klick (Weiterleitung zum Shop, wenn Tickets fehlen)
  const handleButtonClick = () => {
      if (missingTickets) {
          alert("Bitte löse Zucht-Tickets im Inventar ein!");
          return;
      }
      if (isReadyToBreed && isSelectionValid) {
          onBreed(selected[0], selected[1]); 
          setSelected([]);
      }
  }
  

  return (
    <div className="space-y-4 pt-4 h-full flex flex-col">
      <div className="flex items-center gap-2"><button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-2xl font-bold">Zucht Labor</h2></div>
      
      {/* Kostenanzeige (Tickets) */}
      <div className={`p-4 rounded-xl border text-center text-sm ${missingTickets ? 'bg-red-900/30 border-red-500/30 text-red-200' : 'bg-indigo-900/30 border-indigo-500/30 text-indigo-200'}`}>
          <p>{missingTickets ? 'FEHLT:' : 'KOSTEN:'} 1 Zucht-Ticket</p>
          <div className="flex justify-center items-center gap-2 mt-1 font-bold">
            <Ticket className="w-4 h-4" /> 
            <span className={missingTickets ? 'text-red-400' : 'text-pink-400'}>{userTicketCount} / 1</span>
          </div>
      </div>
      
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pb-20">
        {breedablePets.length === 0 ? (
          <div className="col-span-2 text-center text-slate-500 py-10 flex flex-col items-center">
            <Info className="w-10 h-10 mb-2 opacity-50" /><p>Keine erwachsenen Pets verfügbar.</p><p className="text-xs mt-1">Brüte Eier in der Brutstätte aus!</p>
          </div>
        ) : (
          breedablePets.map(pet => {
            const cooldownStatus = getCooldownStatus(pet);
            return (
              <div 
                  key={pet.id} 
                  onClick={() => cooldownStatus === null && toggleSelect(pet.id)} 
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${cooldownStatus ? 'opacity-50 cursor-not-allowed bg-slate-900' : 'cursor-pointer hover:bg-slate-700'} ${selected.includes(pet.id) ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-transparent'}`}
              >
                  <div className={`w-10 h-10 rounded-full ${TYPES[pet.type].bg} flex items-center justify-center`}>{TYPES[pet.type].icon}</div>
                  <div className="font-bold text-xs truncate w-full text-center">{pet.name}</div>
                  
                  {cooldownStatus ? (
                      <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold"><Clock className="w-3 h-3" /> {cooldownStatus}</div>
                  ) : (
                      <div className={`text-[10px] ${RARITIES[pet.rarity].color}`}>{RARITIES[pet.rarity].label}</div>
                  )}
              </div>
            );
          })
        )}
      </div>

      <div className="absolute bottom-6 left-0 w-full px-6">
        <button 
          disabled={isDisabled} 
          onClick={handleButtonClick} 
          className="w-full bg-pink-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center gap-2"
        >
          <Heart className="w-5 h-5 fill-current" /> 
          {getButtonText()} 
        </button>
      </div>
    </div>
  );
}