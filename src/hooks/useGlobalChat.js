import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../firebase';
import {
  collection, addDoc, onSnapshot,
  query, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { filterProfanity } from '../utils/chatUtils';

const SEND_COOLDOWN_MS = 2000;
const MAX_MSG_LENGTH = 200;

export function useGlobalChat(user) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const lastSentAt = useRef(0);

  useEffect(() => {
    const q = query(
      collection(db, 'globalChat'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(q, snap => {
      const msgs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .reverse();
      setMessages(msgs);
      setError(null);
      setLoading(false);
    }, err => {
      console.error('[Chat] listener error:', err);
      setError(err.code === 'permission-denied' ? 'permission' : 'load');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || !user) return { success: false };

    const now = Date.now();
    if (now - lastSentAt.current < SEND_COOLDOWN_MS) {
      return { success: false, reason: 'cooldown' };
    }

    const trimmed = text.trim().slice(0, MAX_MSG_LENGTH);
    const filtered = filterProfanity(trimmed);

    setSending(true);
    lastSentAt.current = now;
    try {
      await addDoc(collection(db, 'globalChat'), {
        text: filtered,
        senderId: user.id,
        senderName: user.username,
        senderAvatar: user.avatar || '🛡️',
        senderLevel: user.level || 1,
        timestamp: serverTimestamp(),
      });
      return { success: true };
    } catch (e) {
      console.error('[Chat] send error:', e);
      return { success: false, reason: e.code === 'permission-denied' ? 'permission' : 'error' };
    } finally {
      setSending(false);
    }
  }, [user]);

  return { messages, loading, error, sending, sendMessage };
}
