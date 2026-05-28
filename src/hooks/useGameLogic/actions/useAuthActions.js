import { auth } from '../../../firebase'; 
import { initializeUser, updateUser } from '../../../utils/db';

export function useAuthActions(state, showNotification) {
    const { setUserId, setAuthLoading, setUser, setMyPets, setCurrentView } = state;

    const handleLogin = async (firebaseUser, displayName) => { 
        try { 
            await initializeUser(firebaseUser, displayName); 
            setUserId(firebaseUser.uid); 
        } catch (_error) {
            showNotification(state.t ? state.t('notif_load_error') : 'Error loading data', "error");
            setAuthLoading(false); 
        } 
    };

    const handleLogout = () => { 
        auth.signOut(); 
        setUser(null); 
        setUserId(null); 
        setMyPets([]); 
        setCurrentView('auth'); 
    };

    const handleUpdateProfile = async (data) => {
        if (!state.user) return;
        await updateUser(state.user.id, data);
        showNotification(state.t ? state.t('notif_profile_updated') : 'Profile updated!', "success");
    };

    return { handleLogin, handleLogout, handleUpdateProfile };
}