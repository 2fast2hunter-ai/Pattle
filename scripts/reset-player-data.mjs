#!/usr/bin/env node
/**
 * Resets all player data from Firestore for Pattle.
 *
 * Deletes: users, pets, market, globalChat, guilds (incl. messages subcollection)
 * Keeps:   feedback (player bug reports / suggestions)
 *
 * Run via GitHub Actions (reset-database.yml) which injects
 * GOOGLE_APPLICATION_CREDENTIALS from the FIREBASE_SERVICE_ACCOUNT secret.
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);

const require = createRequire(import.meta.url);
const admin = require(join(__dir, '../functions/node_modules/firebase-admin'));

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('ERROR: GOOGLE_APPLICATION_CREDENTIALS not set');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'pattle-6edea',
});

const db = admin.firestore();

const COLLECTIONS_TO_RESET = ['users', 'pets', 'market', 'globalChat'];

async function deleteBatch(query, count = 0) {
  const snap = await query.get();
  if (snap.empty) return count;
  const batch = db.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  count += snap.size;
  process.stdout.write(`\r  ... ${count} deleted`);
  if (snap.size < 500) return count;
  return deleteBatch(query, count);
}

async function deleteCollection(name) {
  process.stdout.write(`Deleting /${name} ...`);
  const n = await deleteBatch(db.collection(name).limit(500));
  console.log(`\r  /${name}: ${n} documents deleted`);
  return n;
}

async function deleteGuilds() {
  process.stdout.write('Deleting /guilds (+ messages subcollections) ...\n');
  const guildsSnap = await db.collection('guilds').get();
  if (guildsSnap.empty) { console.log('  /guilds: empty'); return 0; }

  let total = 0;
  for (const guild of guildsSnap.docs) {
    const msgCount = await deleteBatch(guild.ref.collection('messages').limit(500));
    await guild.ref.delete();
    total += msgCount + 1;
    process.stdout.write(`\r  guild ${guild.id}: ${msgCount} msgs deleted`);
  }
  console.log(`\n  /guilds: ${guildsSnap.size} guilds + subcollection docs deleted`);
  return total;
}

async function main() {
  console.log('==============================');
  console.log(' PATTLE — FULL DATABASE RESET ');
  console.log('==============================');
  console.log('Resetting: users, pets, market, globalChat, guilds');
  console.log('Preserving: feedback\n');

  let total = 0;
  for (const col of COLLECTIONS_TO_RESET) {
    total += await deleteCollection(col);
  }
  total += await deleteGuilds();

  console.log('\n==============================');
  console.log(` RESET COMPLETE — ~${total} documents removed`);
  console.log(' All players must now start fresh.');
  console.log('==============================');
}

main().catch(err => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
