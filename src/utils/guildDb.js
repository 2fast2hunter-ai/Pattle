import { db } from '../firebase';
import {
    doc, getDoc, collection, addDoc,
    onSnapshot, query, where, orderBy, limit, getDocs,
    runTransaction, increment, arrayUnion,
    deleteField, writeBatch
} from 'firebase/firestore';

export const MAX_GUILD_MEMBERS = 20;
export const MAX_CHAT_MESSAGES = 100;

const GUILD_EMBLEMS = ['🛡️', '⚔️', '🐉', '🦁', '🐺', '🦅', '🌟', '💎', '🔥', '⚡', '🌙', '☀️', '🌊', '🏔️', '🌹'];
export { GUILD_EMBLEMS };

// --- CREATE GUILD ---
export const createGuild = async (user, name, tag, description, emblem) => {
    if (!user?.id) return { success: false, message: 'Not logged in.' };
    if (user.guildId) return { success: false, message: 'You are already in a guild.' };

    const trimmedTag = tag.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    const trimmedName = name.trim().slice(0, 30);
    const selectedEmblem = GUILD_EMBLEMS.includes(emblem) ? emblem : '🛡️';

    if (trimmedTag.length !== 3) return { success: false, message: 'Tag must be exactly 3 characters.' };
    if (trimmedName.length < 3) return { success: false, message: 'Name must be at least 3 characters.' };

    try {
        const tagsQ = query(collection(db, 'guilds'), where('tag', '==', trimmedTag));
        const tagSnap = await getDocs(tagsQ);
        if (!tagSnap.empty) return { success: false, message: 'Tag already taken.' };

        const namesQ = query(collection(db, 'guilds'), where('name', '==', trimmedName));
        const nameSnap = await getDocs(namesQ);
        if (!nameSnap.empty) return { success: false, message: 'Guild name already taken.' };

        const guildRef = doc(collection(db, 'guilds'));
        const memberEntry = {
            userId: user.id,
            username: user.username || 'Player',
            avatar: user.avatar || '🛡️',
            role: 'leader',
            contributionPoints: 0,
            joinedAt: Date.now()
        };

        const batch = writeBatch(db);
        batch.set(guildRef, {
            id: guildRef.id,
            name: trimmedName,
            tag: trimmedTag,
            emblem: selectedEmblem,
            description: (description || '').trim().slice(0, 120),
            leaderId: user.id,
            members: [memberEntry],
            totalPoints: 0,
            createdAt: Date.now()
        });
        batch.update(doc(db, 'users', user.id), {
            guildId: guildRef.id,
            guildTag: trimmedTag,
            guildPoints: 0
        });
        await batch.commit();

        return { success: true, guildId: guildRef.id, tag: trimmedTag };
    } catch (e) {
        console.error('[Guild] createGuild error:', e);
        return { success: false, message: e.message };
    }
};

// --- JOIN GUILD ---
export const joinGuild = async (user, guildId) => {
    if (!user?.id) return { success: false, message: 'Not logged in.' };
    if (user.guildId) return { success: false, message: 'You are already in a guild. Leave first.' };

    const guildRef = doc(db, 'guilds', guildId);
    const userRef = doc(db, 'users', user.id);

    try {
        return await runTransaction(db, async (transaction) => {
            const guildSnap = await transaction.get(guildRef);
            if (!guildSnap.exists()) return { success: false, message: 'Guild not found.' };

            const guildData = guildSnap.data();
            if (guildData.members.length >= MAX_GUILD_MEMBERS)
                return { success: false, message: `Guild is full (max ${MAX_GUILD_MEMBERS} members).` };

            const alreadyIn = guildData.members.some(m => m.userId === user.id);
            if (alreadyIn) return { success: false, message: 'Already a member.' };

            const memberEntry = {
                userId: user.id,
                username: user.username || 'Player',
                avatar: user.avatar || '🛡️',
                role: 'member',
                contributionPoints: 0,
                joinedAt: Date.now()
            };

            transaction.update(guildRef, { members: arrayUnion(memberEntry) });
            transaction.update(userRef, {
                guildId: guildId,
                guildTag: guildData.tag,
                guildPoints: 0
            });

            return { success: true, tag: guildData.tag };
        });
    } catch (e) {
        console.error('[Guild] joinGuild error:', e);
        return { success: false, message: e.message };
    }
};

// --- LEAVE GUILD ---
export const leaveGuild = async (user) => {
    if (!user?.id || !user.guildId) return { success: false, message: 'Not in a guild.' };

    const guildRef = doc(db, 'guilds', user.guildId);
    const userRef = doc(db, 'users', user.id);

    try {
        return await runTransaction(db, async (transaction) => {
            const guildSnap = await transaction.get(guildRef);
            if (!guildSnap.exists()) {
                transaction.update(userRef, { guildId: deleteField(), guildTag: deleteField(), guildPoints: deleteField() });
                return { success: true };
            }

            const guildData = guildSnap.data();
            const isLeader = guildData.leaderId === user.id;
            const remaining = guildData.members.filter(m => m.userId !== user.id);

            if (isLeader && remaining.length > 0) {
                // Transfer to an officer first, then oldest member
                const newLeader = remaining.find(m => m.role === 'officer') || remaining[0];
                const updatedMembers = remaining.map(m =>
                    m.userId === newLeader.userId ? { ...m, role: 'leader' } : m
                );
                transaction.update(guildRef, {
                    leaderId: newLeader.userId,
                    members: updatedMembers
                });
            } else if (remaining.length === 0) {
                transaction.delete(guildRef);
            } else {
                transaction.update(guildRef, { members: remaining });
            }

            transaction.update(userRef, {
                guildId: deleteField(),
                guildTag: deleteField(),
                guildPoints: deleteField()
            });

            return { success: true };
        });
    } catch (e) {
        console.error('[Guild] leaveGuild error:', e);
        return { success: false, message: e.message };
    }
};

// --- KICK MEMBER (leader or officer) ---
// Officers can kick members; only leader can kick officers
export const kickMember = async (actorUserId, guildId, targetUserId) => {
    const guildRef = doc(db, 'guilds', guildId);
    const targetRef = doc(db, 'users', targetUserId);

    try {
        return await runTransaction(db, async (transaction) => {
            const guildSnap = await transaction.get(guildRef);
            if (!guildSnap.exists()) return { success: false, message: 'Guild not found.' };

            const guildData = guildSnap.data();
            const actor = guildData.members.find(m => m.userId === actorUserId);
            const target = guildData.members.find(m => m.userId === targetUserId);

            if (!actor) return { success: false, message: 'You are not in this guild.' };
            if (!target) return { success: false, message: 'Target member not found.' };
            if (targetUserId === actorUserId) return { success: false, message: 'Cannot kick yourself.' };
            if (target.role === 'leader') return { success: false, message: 'Cannot kick the leader.' };

            const isLeader = guildData.leaderId === actorUserId;
            const isOfficer = actor.role === 'officer';

            if (!isLeader && !isOfficer) return { success: false, message: 'Insufficient permissions.' };
            if (isOfficer && !isLeader && target.role === 'officer')
                return { success: false, message: 'Officers cannot kick other officers.' };

            const updatedMembers = guildData.members.filter(m => m.userId !== targetUserId);
            transaction.update(guildRef, { members: updatedMembers });
            transaction.update(targetRef, {
                guildId: deleteField(),
                guildTag: deleteField(),
                guildPoints: deleteField()
            });

            return { success: true };
        });
    } catch (e) {
        console.error('[Guild] kickMember error:', e);
        return { success: false, message: e.message };
    }
};

// --- PROMOTE TO OFFICER (leader only) ---
export const promoteToOfficer = async (leaderId, guildId, targetUserId) => {
    const guildRef = doc(db, 'guilds', guildId);

    try {
        return await runTransaction(db, async (transaction) => {
            const guildSnap = await transaction.get(guildRef);
            if (!guildSnap.exists()) return { success: false, message: 'Guild not found.' };

            const guildData = guildSnap.data();
            if (guildData.leaderId !== leaderId) return { success: false, message: 'Only the leader can promote members.' };

            const target = guildData.members.find(m => m.userId === targetUserId);
            if (!target) return { success: false, message: 'Member not found.' };
            if (target.role !== 'member') return { success: false, message: 'Member is already an officer or leader.' };

            const updatedMembers = guildData.members.map(m =>
                m.userId === targetUserId ? { ...m, role: 'officer' } : m
            );
            transaction.update(guildRef, { members: updatedMembers });

            return { success: true };
        });
    } catch (e) {
        console.error('[Guild] promoteToOfficer error:', e);
        return { success: false, message: e.message };
    }
};

// --- DEMOTE TO MEMBER (leader only) ---
export const demoteToMember = async (leaderId, guildId, targetUserId) => {
    const guildRef = doc(db, 'guilds', guildId);

    try {
        return await runTransaction(db, async (transaction) => {
            const guildSnap = await transaction.get(guildRef);
            if (!guildSnap.exists()) return { success: false, message: 'Guild not found.' };

            const guildData = guildSnap.data();
            if (guildData.leaderId !== leaderId) return { success: false, message: 'Only the leader can demote officers.' };

            const target = guildData.members.find(m => m.userId === targetUserId);
            if (!target) return { success: false, message: 'Member not found.' };
            if (target.role !== 'officer') return { success: false, message: 'Member is not an officer.' };

            const updatedMembers = guildData.members.map(m =>
                m.userId === targetUserId ? { ...m, role: 'member' } : m
            );
            transaction.update(guildRef, { members: updatedMembers });

            return { success: true };
        });
    } catch (e) {
        console.error('[Guild] demoteToMember error:', e);
        return { success: false, message: e.message };
    }
};

// --- SEND GUILD INVITE ---
export const sendGuildInvite = async (inviterUser, guildId, targetUserId) => {
    if (!inviterUser?.id || !guildId || !targetUserId) return { success: false, message: 'Invalid parameters.' };
    if (inviterUser.id === targetUserId) return { success: false, message: 'Cannot invite yourself.' };

    const guildRef = doc(db, 'guilds', guildId);

    try {
        const guildSnap = await getDoc(guildRef);
        if (!guildSnap.exists()) return { success: false, message: 'Guild not found.' };

        const guildData = guildSnap.data();
        const actor = guildData.members.find(m => m.userId === inviterUser.id);
        if (!actor) return { success: false, message: 'You are not in this guild.' };

        const alreadyMember = guildData.members.some(m => m.userId === targetUserId);
        if (alreadyMember) return { success: false, message: 'Player is already in this guild.' };

        if (guildData.members.length >= MAX_GUILD_MEMBERS)
            return { success: false, message: `Guild is full (max ${MAX_GUILD_MEMBERS} members).` };

        // Check if invite already pending
        const existingQ = query(
            collection(db, 'guildInvites'),
            where('guildId', '==', guildId),
            where('inviteeId', '==', targetUserId),
            where('status', '==', 'pending')
        );
        const existingSnap = await getDocs(existingQ);
        if (!existingSnap.empty) return { success: false, message: 'Invite already sent.' };

        // Get target user info
        const targetSnap = await getDoc(doc(db, 'users', targetUserId));
        if (!targetSnap.exists()) return { success: false, message: 'Player not found.' };

        const targetData = targetSnap.data();
        if (targetData.guildId) return { success: false, message: 'Player is already in a guild.' };

        await addDoc(collection(db, 'guildInvites'), {
            guildId,
            guildName: guildData.name,
            guildTag: guildData.tag,
            guildEmblem: guildData.emblem || '🛡️',
            inviteeId: targetUserId,
            inviteeUsername: targetData.username || 'Player',
            invitedByUserId: inviterUser.id,
            invitedByUsername: inviterUser.username || 'Player',
            status: 'pending',
            timestamp: Date.now()
        });

        return { success: true };
    } catch (e) {
        console.error('[Guild] sendGuildInvite error:', e);
        return { success: false, message: e.message };
    }
};

// --- RESPOND TO GUILD INVITE ---
export const respondToGuildInvite = async (user, inviteId, accept) => {
    if (!user?.id || !inviteId) return { success: false };

    const inviteRef = doc(db, 'guildInvites', inviteId);

    try {
        const inviteSnap = await getDoc(inviteRef);
        if (!inviteSnap.exists()) return { success: false, message: 'Invite not found.' };

        const invite = inviteSnap.data();
        if (invite.inviteeId !== user.id) return { success: false, message: 'Not your invite.' };
        if (invite.status !== 'pending') return { success: false, message: 'Invite is no longer pending.' };

        if (!accept) {
            await writeBatch(db).delete(inviteRef).commit();
            return { success: true };
        }

        // Accept: join the guild
        const joinResult = await joinGuild(user, invite.guildId);
        if (!joinResult.success) return joinResult;

        // Delete the invite doc
        const batch = writeBatch(db);
        batch.delete(inviteRef);
        await batch.commit();

        return { success: true, tag: joinResult.tag };
    } catch (e) {
        console.error('[Guild] respondToGuildInvite error:', e);
        return { success: false, message: e.message };
    }
};

// --- GET PENDING INVITES FOR USER ---
export const listenToPendingInvites = (userId, callback) => {
    const q = query(
        collection(db, 'guildInvites'),
        where('inviteeId', '==', userId),
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc'),
        limit(10)
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
};

// --- ADD CONTRIBUTION POINTS ---
export const addGuildPoints = async (userId, guildId, points) => {
    if (!userId || !guildId || !points) return;

    const guildRef = doc(db, 'guilds', guildId);
    const userRef = doc(db, 'users', userId);

    try {
        return await runTransaction(db, async (transaction) => {
            const guildSnap = await transaction.get(guildRef);
            if (!guildSnap.exists()) return;

            const guildData = guildSnap.data();
            const updatedMembers = guildData.members.map(m =>
                m.userId === userId
                    ? { ...m, contributionPoints: (m.contributionPoints || 0) + points }
                    : m
            );

            transaction.update(guildRef, {
                members: updatedMembers,
                totalPoints: increment(points)
            });
            transaction.update(userRef, {
                guildPoints: increment(points)
            });
        });
    } catch (e) {
        console.error('[Guild] addGuildPoints error:', e);
    }
};

// --- SEND CHAT MESSAGE ---
export const sendGuildMessage = async (user, guildId, text) => {
    if (!user?.id || !guildId) return { success: false };
    const trimmed = text.trim().slice(0, 200);
    if (!trimmed) return { success: false };

    try {
        await addDoc(collection(db, 'guilds', guildId, 'messages'), {
            userId: user.id,
            username: user.username || 'Player',
            avatar: user.avatar || '🛡️',
            text: trimmed,
            timestamp: Date.now()
        });
        return { success: true };
    } catch (e) {
        console.error('[Guild] sendMessage error:', e);
        return { success: false, message: e.message };
    }
};

// --- LISTEN TO GUILD CHAT ---
export const listenToGuildChat = (guildId, callback) => {
    const q = query(
        collection(db, 'guilds', guildId, 'messages'),
        orderBy('timestamp', 'desc'),
        limit(MAX_CHAT_MESSAGES)
    );
    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach(d => messages.push({ id: d.id, ...d.data() }));
        callback(messages.reverse());
    });
};

// --- GET GUILD DATA ---
export const getGuild = async (guildId) => {
    try {
        const snap = await getDoc(doc(db, 'guilds', guildId));
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() };
    } catch (e) {
        console.error('[Guild] getGuild error:', e);
        return null;
    }
};

// --- LISTEN TO GUILD (real-time) ---
export const listenToGuild = (guildId, callback) => {
    return onSnapshot(doc(db, 'guilds', guildId), (snap) => {
        if (snap.exists()) callback({ id: snap.id, ...snap.data() });
        else callback(null);
    });
};

// --- SEARCH GUILDS ---
export const searchGuilds = async (searchTerm) => {
    try {
        const byTag = await getDocs(
            query(collection(db, 'guilds'), where('tag', '==', searchTerm.toUpperCase()))
        );
        const byName = await getDocs(
            query(collection(db, 'guilds'), orderBy('name'), limit(20))
        );

        const results = new Map();
        byTag.forEach(d => results.set(d.id, { id: d.id, ...d.data() }));
        byName.forEach(d => {
            const data = d.data();
            if (data.name.toLowerCase().includes(searchTerm.toLowerCase()))
                results.set(d.id, { id: d.id, ...data });
        });

        return Array.from(results.values()).slice(0, 20);
    } catch (e) {
        console.error('[Guild] searchGuilds error:', e);
        return [];
    }
};

// --- GET GUILD LEADERBOARD ---
export const getGuildLeaderboard = async () => {
    try {
        const q = query(collection(db, 'guilds'), orderBy('totalPoints', 'desc'), limit(50));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error('[Guild] getGuildLeaderboard error:', e);
        return [];
    }
};

// --- LIST ALL GUILDS (browsing) ---
export const listGuilds = async () => {
    try {
        const q = query(collection(db, 'guilds'), orderBy('totalPoints', 'desc'), limit(30));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error('[Guild] listGuilds error:', e);
        return [];
    }
};

// --- FIND USER BY USERNAME (for invites) ---
export const findUserForInvite = async (username) => {
    try {
        const q = query(collection(db, 'users'), where('username', '==', username.trim()), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
    } catch (e) {
        console.error('[Guild] findUserForInvite error:', e);
        return null;
    }
};
