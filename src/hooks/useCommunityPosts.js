import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export function useCommunityPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'communityPosts'),
      orderBy('isPinned', 'desc'),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(
      q,
      snap => {
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setError(null);
        setLoading(false);
      },
      err => {
        console.error('[Community] listener error:', err);
        setError('load');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { posts, loading, error };
}
