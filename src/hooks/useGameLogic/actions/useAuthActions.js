import { auth } from '../../../firebase'; 
import { initializeUser } from '../../../utils/db';

export function useAuthActions(state, showNotification) {
    const { setUserId, setAuthLoading, setUser, setMyPets, setCurrentView } = state;

    const handleLogin = async (firebaseUser, displayName) => { 
        try { 
            await initializeUser(firebaseUser, displayName); 
            setUserId(firebaseUser.uid); 
        } catch (error) { 
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

    return { handleLogin, handleLogout };
}