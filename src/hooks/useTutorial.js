import { useEffect } from 'react';

export function useTutorial(user, setUser, currentView, handleUpdateProfile, t) {
    const tutorialStep = user ? (user.tutorialStep !== undefined ? user.tutorialStep : (user.level === 1 && user.xp === 0 ? 0 : 13)) : 13;
    const isTutorialActive = tutorialStep < 13;

    const getTutorialState = () => {
        if (!isTutorialActive) return { msg: null, highlight: null };

        switch (tutorialStep) {
            case 0: return { msg: t ? t('tutorial_step_0') : 'Welcome! Go to your COLLECTION first.', highlight: 'pethub', view: 'menu' };
            case 1: return { msg: t ? t('tutorial_step_1') : 'Open your BACKPACK.', highlight: 'items', view: 'pet-hub' };
            case 2: return { msg: t ? t('tutorial_step_2') : 'Open the STARTER BOX!', highlight: 'STARTER', view: 'item-inventory' };
            case 3: return { msg: t ? t('tutorial_step_3') : 'Go back to the HATCHERY.', highlight: 'hatchery', view: 'pet-hub' };
            case 4: return { msg: t ? t('tutorial_step_4') : 'Place the egg in the incubator.', highlight: 'slot-0', view: 'hatchery' };
            case 5: return { msg: t ? t('tutorial_step_5') : 'Use a ticket to speed up hatching!', highlight: 'speedup-btn', view: 'hatchery' };
            case 6: return { msg: t ? t('tutorial_step_6') : 'The egg is ready! Let it hatch.', highlight: 'hatch-btn', view: 'hatchery' };
            case 7: return { msg: t ? t('tutorial_step_7') : 'Go back to the main menu to the ARENA.', highlight: 'arena', view: 'menu' };
            case 8: return { msg: t ? t('tutorial_step_8') : 'Manage your TEAM.', highlight: 'team', view: 'arena-hub' };
            case 9: return { msg: t ? t('tutorial_step_9') : 'Add your new pet.', highlight: 'slot-0', view: 'team-edit' };
            case 10: return { msg: t ? t('tutorial_step_10') : 'Start your first BATTLE!', highlight: 'battle', view: 'arena-hub' };
            case 11: return { msg: t ? t('tutorial_step_11') : 'Win the battle!', highlight: null, view: 'battle' };
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
        if (tutorialStep === 9 && (user.team || []).filter(Boolean).length > 0) advance(10);
        if (tutorialStep === 10 && currentView === 'battle') advance(11);

    }, [user, currentView, tutorialStep, setUser, handleUpdateProfile, isTutorialActive]);

    return {
        tutorialStep,
        isTutorialActive,
        tutorialMsg,
        tutorialHighlight
    };
}
