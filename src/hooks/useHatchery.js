import { useState, useEffect } from 'react';
import { getUnlockedHatcherySlots } from '../utils/gameMechanics';

export function useHatchery(pets, user, onHatchEgg, onStartIncubation) {
    const unlockedSlots = getUnlockedHatcherySlots(user.level);
    const maxSlots = 10;

    // States
    const [hatchingPet, setHatchingPet] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [showSelector, setShowSelector] = useState(false);

    const ticketCount = user?.inventory?.filter(i => i.type === 'TICKET').length || 0;

    // Timer force update
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Eier filtern
    const incubatingEggs = pets.filter(p => p.isEgg && p.hatchAt > 0);
    const inventoryEggs = pets.filter(p => p.isEgg && (p.hatchAt === 0 || !p.hatchAt));

    const handleSlotClick = (index) => {
        // Prüfen ob Slot leer und freigeschaltet ist
        if (index >= incubatingEggs.length && index < unlockedSlots) {
            setShowSelector(true);
        }
    };

    const handleSelectEgg = (eggId) => {
        onStartIncubation(eggId);
        setShowSelector(false);
    };

    const startHatchingProcess = (pet) => {
        setHatchingPet(pet);
        setNameInput(pet.name);
    }

    const confirmHatch = () => {
        if (hatchingPet) {
            onHatchEgg(hatchingPet.id, nameInput);
            setHatchingPet(null);
        }
    }

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return {
        unlockedSlots, maxSlots,
        hatchingPet, setHatchingPet,
        nameInput, setNameInput,
        showSelector, setShowSelector,
        ticketCount,
        incubatingEggs, inventoryEggs,
        handleSlotClick, handleSelectEgg,
        startHatchingProcess, confirmHatch,
        formatTime
    };
}
