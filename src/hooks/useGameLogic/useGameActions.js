import { useAuthActions } from './actions/useAuthActions';
import { useShopActions } from './actions/useShopActions';
import { usePetActions } from './actions/usePetActions';
import { useBattleActions } from './actions/useBattleActions';
import { useMarketActions } from './actions/useMarketActions';
import { useSocialActions } from './actions/useSocialActions';
import { useVillageActions } from './actions/useVillageActions'; // <--- NEU
import { useGearActions } from './actions/useGearActions';

export function useGameActions(state, setUserId) {
    const showNotification = (msg, type = 'error') => {
        console.log("Notification:", msg, type);
        state.setNotification({ message: msg, type });
        setTimeout(() => state.setNotification(null), 3000);
    };

    const authActions = useAuthActions({ ...state, setUserId }, showNotification);
    const shopActions = useShopActions(state, showNotification);
    const petActions = usePetActions(state, showNotification);
    const battleActions = useBattleActions(state, showNotification);
    const marketActions = useMarketActions(state, showNotification);
    const socialActions = useSocialActions(state, showNotification);
    const villageActions = useVillageActions(state, showNotification); // <--- NEU
    const gearActions = useGearActions(state, showNotification);

    return {
        showNotification,
        ...authActions,
        ...shopActions,
        ...petActions,
        ...battleActions,
        ...marketActions,
        ...socialActions,
        ...villageActions, // <--- NEU
        ...gearActions,
    };
}