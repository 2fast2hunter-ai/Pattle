import { useState, useEffect } from 'react';

export function useTutorial(user, setUser, currentView, handleUpdateProfile) {
    const tutorialStep = user ? (user.tutorialStep !== undefined ? user.tutorialStep : (user.level === 1 && user.xp === 0 ? 0 : 13)) : 13;
    const isTutorialActive = tutorialStep < 13;

    const getTutorialState = () => {
        if (!isTutorialActive) return { msg: null, highlight: null };

        switch (tutorialStep) {
            case 0: return { msg: "Willkommen! Gehe zuerst zu deiner SAMMLUNG.", highlight: 'pethub', view: 'menu' };
            case 1: return { msg: "Öffne deinen RUCKSACK.", highlight: 'items', view: 'pet-hub' };
            case 2: return { msg: "Öffne die STARTER BOX!", highlight: 'STARTER', view: 'item-inventory' };
            case 3: return { msg: "Gehe zurück zur BRUTSTÄTTE.", highlight: 'hatchery', view: 'pet-hub' };
            case 4: return { msg: "Lege das Ei in den Inkubator.", highlight: 'slot-0', view: 'hatchery' };
            case 5: return { msg: "Benutze ein Ticket, um das Ausbrüten zu beschleunigen!", highlight: 'speedup-btn', view: 'hatchery' };
            case 6: return { msg: "Das Ei ist bereit! Lass es schlüpfen.", highlight: 'hatch-btn', view: 'hatchery' };
            case 7: return { msg: "Gehe zurück ins Hauptmenü zur ARENA.", highlight: 'arena', view: 'menu' };
            case 8: return { msg: "Verwalte dein TEAM.", highlight: 'team', view: 'arena-hub' };
            case 9: return { msg: "Füge dein neues Pet hinzu.", highlight: 'slot-0', view: 'team-edit' };
            case 10: return { msg: "Starte deinen ersten KAMPF!", highlight: 'battle', view: 'arena-hub' };
            case 11: return { msg: "Gewinne den Kampf!", highlight: null, view: 'battle' };
            default: return { msg: null, highlight: null };
        }
    };

    const { msg: tutorialMsg, highlight: tutorialHighlight } = getTutorialState();

    useEffect(() => {
        if (!user || !isTutorialActive) return;

        const advance = (newStep) => {
            const newUser = { ...user, tutorialStep: newStep };
            setUser(newUser); // Optimistisches Update
            handleUpdateProfile({ tutorialStep: newStep }); // DB Update
        };

        if (tutorialStep === 0 && currentView === 'pet-hub') advance(1);
        if (tutorialStep === 1 && currentView === 'item-inventory') advance(2);
        if (tutorialStep === 3 && currentView === 'hatchery') advance(4);
        if (tutorialStep === 7 && currentView === 'arena-hub') advance(8);
        if (tutorialStep === 8 && currentView === 'team-edit') advance(9);
        if (tutorialStep === 9 && user.team.filter(Boolean).length > 0) advance(10);
        if (tutorialStep === 10 && currentView === 'battle') advance(11);

    }, [user, currentView, tutorialStep, setUser, handleUpdateProfile, isTutorialActive]);

    return {
        tutorialStep,
        isTutorialActive,
        tutorialMsg,
        tutorialHighlight
    };
}
