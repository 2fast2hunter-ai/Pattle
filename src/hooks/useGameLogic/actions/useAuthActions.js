import { auth } from '../../../firebase'; 
import { initializeUser, updateUser } from '../../../utils/db';

export function useAuthActions(state, showNotification) {
    const { setUserId, setAuthLoading, setUser, setMyPets, setCurrentView } = state;

    const handleLogin = async (firebaseUser, displayName) => { 
        try { 
            await initializeUser(firebaseUser, displayName); 
            setUserId(firebaseUser.uid); 
        } catch (_error) {
            showNotification("Fehler beim Laden der Daten", "error"); 
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
        showNotification("Profil aktualisiert!", "success");
    };

    return { handleLogin, handleLogout, handleUpdateProfile };
}