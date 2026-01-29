import { updateUser, calculateEloChange, setBattleActive } from '../../../utils/db';

export const handleLose = async (state, showNotification, startBattleFn, enemyRating) => {
    const { user, activeBattle, setActiveBattle, autoBattleRemaining, setAutoBattleRemaining, setCurrentView } = state;
    if (!user) return;

    const isAuto = autoBattleRemaining > 0;
    const isFriendly = activeBattle?.isFriendly;
    const isTower = activeBattle?.isTower;

    let newRating = user.rating;
    if (!isFriendly && !isTower) {
        const eloChange = calculateEloChange(user.rating, enemyRating || 1000, false);
        newRating += eloChange;
    }

    await updateUser(user.id, { 
        rating: newRating, 
        isInBattle: false,
        "stats.pvpTotal": (user.stats?.pvpTotal || 0) + 1 
    });
    await setBattleActive(user.id, false);

    if (!isAuto) {
        showNotification(isTower ? "Turm-Kampf verloren!" : "Niederlage!", "error");
        setCurrentView(isTower ? 'tower' : 'arena-hub');
        setActiveBattle(null);
    } else {
        // Auto-Battle Logik wird im BattleScreen gehandhabt oder hier erweitert
        if (autoBattleRemaining <= 1) {
            setAutoBattleRemaining(0);
            showNotification("Auto-Kampf beendet (Niederlage).", "info");
            setCurrentView('arena-hub');
            setActiveBattle(null);
        } else {
             // Bei Niederlage Auto-Battle abbrechen? Oder weitermachen? 
             // Hier: Abbrechen
             setAutoBattleRemaining(0);
             showNotification("Auto-Kampf nach Niederlage gestoppt.", "error");
             setCurrentView('arena-hub');
             setActiveBattle(null);
        }
    }
};