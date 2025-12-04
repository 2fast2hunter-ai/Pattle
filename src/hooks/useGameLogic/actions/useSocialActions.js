import { findUserPublic, updateUser } from '../../../utils/db';

export function useSocialActions(state, showNotification) {
    const { user } = state;

    const handleAddFriend = async (friendId) => { 
        if (!user || !friendId || friendId === user.id) return; 
        const foundUser = await findUserPublic(friendId); 
        if (foundUser) { 
            const newFriends = [...(user.friends || []), { id: foundUser.id, username: foundUser.username, avatar: foundUser.avatar, level: foundUser.level, rating: foundUser.rating }]; 
            updateUser(user.id, { friends: newFriends }); 
            showNotification(`${foundUser.username} hinzugefügt!`, 'success'); 
        } else { 
            showNotification("Spieler nicht gefunden.", 'error'); 
        } 
    };

    return { handleAddFriend };
}