import { db } from '../firebase';
import {
    doc, getDoc, setDoc, updateDoc, collection, addDoc,
    onSnapshot, query, where, deleteDoc, orderBy, limit, getDocs,
    runTransaction, increment, arrayUnion, arrayRemove, serverTimestamp,
    deleteField, writeBatch, getCountFromServer
} from 'firebase/firestore';

export const MAX_GUILD_MEMBERS = 30;
export const MAX_CHAT_MESSAGES = 100;

// --- CREATE GUILD ---
export const createGuild = async (user, name, tag, description) => {
    if (!user?.id) return { success: false, message: 'Not logged in.' };
    if (user.guildId) return { success: false, message: 'You are already in a guild.' };

    const trimmedTag = tag.trim().toUpperCase().slice(0, 4);
    const trimmedName = name.trim().slice(0, 30);
    if (trimmedTag.length < 2) return { success: false, message: 'Tag must be 2-4 characters.' };
    if (trimmedName.length < 3) return { success: false, message: 'Name must be at least 3 characters.' };

    try {
        // Check tag uniqueness
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

        await writeBatch(db)
            .set(guildRef, {
                id: guildRef.id,
                name: trimmedName,
                tag: trimmedTag,
                description: (description || '').trim().slice(0, 120),
                leaderId: user.id,
                members: [memberEntry],
                totalPoints: 0,
                createdAt: Date.now()
            })
            .update(doc(db, 'users', user.id), {
                guildId: guildRef.id,
                guildTag: trimmedTag,
                guildPoints: 0
            })
            .commit();

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
                // Guild gone — just clean user
                transaction.update(userRef, { guildId: deleteField(), guildTag: deleteField(), guildPoints: deleteField() });
                return { success: true };
            }

            const guildData = guildSnap.data();
            const isLeader = guildData.leaderId === user.id;
            const remaining = guildData.members.filter(m => m.userId !== user.id);

            if (isLeader && remaining.length > 0) {
                // Transfer leadership to longest-standing member
                const newLeader = remaining[0];
                const updatedMembers = remaining.map((m, i) =>
                    i === 0 ? { ...m, role: 'leader' } : m
                );
                transaction.update(guildRef, {
                    leaderId: newLeader.userId,
                    members: updatedMembers
                });
            } else if (remaining.length === 0) {
                transaction.delete(guildRef);
            } else {
                const updatedMembers = guildData.members.filter(m => m.userId !== user.id);
                transaction.update(guildRef, { members: updatedMembers });
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

// --- KICK MEMBER (leader only) ---
export const kickMember = async (leaderId, guildId, targetUserId) => {
    const guildRef = doc(db, 'guilds', guildId);
    const targetRef = doc(db, 'users', targetUserId);

    try {
        return await runTransaction(db, async (transaction) => {
            const guildSnap = await transaction.get(guildRef);
            if (!guildSnap.exists()) return { success: false, message: 'Guild not found.' };

            const guildData = guildSnap.data();
            if (guildData.leaderId !== leaderId) return { success: false, message: 'Not the leader.' };
            if (targetUserId === leaderId) return { success: false, message: 'Cannot kick yourself.' };

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
