import { findUserPublic, updateUser } from '../../../utils/db';

export function useSocialActions(state, showNotification) {
    const { user } = state;

    const handleAddFriend = async (friendId) => { 
        if (!user || !friendId || friendId === user.id) return; 
        const foundUser = await findUserPublic(friendId); 
        if (foundUser) { 
            const newFriends = [...(user.friends || []), { id: foundUser.id, username: foundUser.username, avatar: foundUser.avatar, level: foundUser.level, rating: foundUser.rating }]; 
            updateUser(user.id, { friends: newFriends }); 
            showNotification(state.t ? state.t('notif_friend_added', { name: foundUser.username }) : `${foundUser.username} added!`, 'success');
        } else {
            showNotification(state.t ? state.t('notif_player_not_found') : 'Player not found.', 'error');
        }
    };

    return { handleAddFriend };
}