import { db } from '../firebase';
import {
  collection, addDoc, serverTimestamp, getDocs,
  query, where, Timestamp
} from 'firebase/firestore';

export const DISCORD_URL = 'https://discord.gg/pattle';

const GUILD_SHOWCASE_POST = {
  title: '🏆 Guild Emblem Showcase — Wer hat das krasseste Design?',
  body: `Guild Leaders, eure Zeit ist gekommen!

Das Guild-System ist jetzt live — und wir wollen die beeindruckendsten Embleme der Pattle-Community feiern!

📸 So nimmst du teil:
• Öffne dein Guild-Profil
• Tippe auf "Emblem anzeigen"
• Mach einen Screenshot
• Teile ihn in unserem Discord (#community) oder auf Twitter mit #PattleGuild

🎖️ Die besten Embleme erscheinen auf unseren offiziellen Kanälen und im Community-Spotlight!

Submission-Deadline: Sonntag, 22. Juni 2026

⚔️ May the best guild win.
— Das Pattle Team`,
  category: 'community_event',
  isPinned: true,
  ctaLabel: 'Discord beitreten',
  ctaAction: 'discord',
  authorName: 'Das Pattle Team',
  authorAvatar: '⚔️',
  expiresAt: Timestamp.fromDate(new Date('2026-06-22T23:59:59Z')),
};

export async function seedGuildShowcasePost() {
  const existing = await getDocs(
    query(collection(db, 'communityPosts'), where('category', '==', 'community_event'), where('isPinned', '==', true))
  );
  if (!existing.empty) return { alreadyExists: true };

  await addDoc(collection(db, 'communityPosts'), {
    ...GUILD_SHOWCASE_POST,
    pinnedAt: serverTimestamp(),
    timestamp: serverTimestamp(),
  });
  return { created: true };
}
