import React from 'react';
import { trackQuestProgress } from '../utils/db';

export function useAppActions(gameLogic, user, setUser, tutorialStep) {

    // Wrapper für Actions um Tutorial zu triggern
    const handleOpenLootboxWrapper = async (id, variant) => {
        const res = await gameLogic.openLootbox(id, variant);
        if (res && tutorialStep === 2) {
            const newUser = { ...user, tutorialStep: 3 };
            setUser(newUser);
            gameLogic.handleUpdateProfile({ tutorialStep: 3 });
        }
        return res;
    };

    const handleStartIncubationWrapper = async (id) => {
        await gameLogic.startIncubation(id);
        if (tutorialStep === 4) {
            // Gratis Ticket für Tutorial geben
            const newInventory = [...(user.inventory || []), { id: `tut_ticket_${Date.now()}`, type: 'TICKET', variant: 'BREED' }];
            const newUser = { ...user, tutorialStep: 5 };
            const newAdTickets = (user.adTickets || 0) + 1;

            setUser({ ...newUser, inventory: newInventory, adTickets: newAdTickets });
            gameLogic.handleUpdateProfile({ tutorialStep: 5, inventory: newInventory, adTickets: newAdTickets });
            gameLogic.showNotification("Gratis Ticket für Tutorial erhalten!", "success");
        }
    };

    const handleReduceCooldownWrapper = async (id, type) => {
        await gameLogic.handleReduceCooldown(id, type);
        if (tutorialStep === 5) {
            const newUser = { ...user, tutorialStep: 6 };
            setUser(newUser);
            gameLogic.handleUpdateProfile({ tutorialStep: 6 });
        }
    };

    const handleHatchEggWrapper = async (id, name) => {
        await gameLogic.hatchEgg(id, name);
        if (tutorialStep === 6) {
            const newUser = { ...user, tutorialStep: 7 };
            setUser(newUser);
            gameLogic.handleUpdateProfile({ tutorialStep: 7 });
        }
    };

    const handleWinWrapper = async (reward, team, rating, dmg) => {
        await gameLogic.handleWin(reward, team, rating, dmg);
        if (tutorialStep === 11) {
            const newUser = { ...user, tutorialStep: 13 };
            setUser(newUser);
            gameLogic.handleUpdateProfile({ tutorialStep: 13 });
            gameLogic.showNotification("Tutorial abgeschlossen! Viel Spaß!", "success");
        }
    };

    const handleWatchAd = async (reward) => {
        await gameLogic.watchAdForReward(reward);
        trackQuestProgress(user, 'WATCH_AD', 1);
    };

    return {
        handleOpenLootboxWrapper,
        handleStartIncubationWrapper,
        handleReduceCooldownWrapper,
        handleHatchEggWrapper,
        handleWinWrapper,
        handleWatchAd
    };
}
