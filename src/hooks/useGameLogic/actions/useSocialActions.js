import { findUserByUsername, sendFriendRequest, respondFriendRequest } from '../../../utils/db';

export function useSocialActions(state, showNotification) {
    const { user } = state;

    const handleAddFriend = async (username) => {
        if (!user || !username) return;
        const found = await findUserByUsername(username.trim());
        if (!found) {
            showNotification(state.t ? state.t('notif_player_not_found') : 'Player not found.', 'error');
            return;
        }
        if (found.id === user.id) {
            showNotification(state.t ? state.t('notif_player_not_found') : 'Player not found.', 'error');
            return;
        }
        const result = await sendFriendRequest(user, found.id);
        if (result.success) {
            showNotification(state.t ? state.t('notif_friend_request_sent', { name: found.username }) : `Request sent to ${found.username}!`, 'success');
        } else if (result.reason === 'already_friends') {
            showNotification(state.t ? state.t('notif_already_friends') : 'Already friends.', 'error');
        } else if (result.reason === 'already_sent') {
            showNotification(state.t ? state.t('notif_request_already_sent') : 'Request already sent.', 'error');
        } else {
            showNotification(state.t ? state.t('notif_player_not_found') : 'Player not found.', 'error');
        }
    };

    const handleAcceptFriendRequest = async (request) => {
        if (!user || !request) return;
        const result = await respondFriendRequest(user.id, request, true);
        if (result.success) {
            showNotification(state.t ? state.t('notif_friend_added', { name: request.fromUsername }) : `${request.fromUsername} added!`, 'success');
        }
    };

    const handleDeclineFriendRequest = async (request) => {
        if (!user || !request) return;
        await respondFriendRequest(user.id, request, false);
    };

    return { handleAddFriend, handleAcceptFriendRequest, handleDeclineFriendRequest };
}