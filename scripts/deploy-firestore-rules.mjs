#!/usr/bin/env node
/**
 * Deploys firestore.rules to Firebase via the Firebase Rules REST API.
 *
 * firebase-tools@12 fails with 403 when using a service account because it
 * uses the wrong PATCH body format (missing the {release:{...},updateMask}
 * wrapper). This script calls the API directly with the correct format.
 *
 * Required env vars (set by google-github-actions/auth):
 *   GOOGLE_APPLICATION_CREDENTIALS - path to service account JSON key
 *   (or GCLOUD_PROJECT / --project flag)
 *
 * Usage: node scripts/deploy-firestore-rules.mjs <project-id> <rules-file>
 */

import { readFileSync } from 'fs';
import { createSign } from 'crypto';

const [, , projectId, rulesFile] = process.argv;
if (!projectId || !rulesFile) {
  console.error('Usage: node deploy-firestore-rules.mjs <project-id> <rules-file>');
  process.exit(1);
}

const credFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credFile) {
  console.error('GOOGLE_APPLICATION_CREDENTIALS not set');
  process.exit(1);
}

const key = JSON.parse(readFileSync(credFile, 'utf8'));
const rulesContent = readFileSync(rulesFile, 'utf8');

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');
  const toSign = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(toSign);
  const sig = sign.sign(key.private_key, 'base64url');
  const jwt = `${toSign}.${sig}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function deploy() {
  console.log(`Deploying ${rulesFile} to project ${projectId}...`);
  const token = await getAccessToken();
  const base = `https://firebaserules.googleapis.com/v1/projects/${projectId}`;
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // 1. Create a new ruleset
  const createRes = await fetch(`${base}/rulesets`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ source: { files: [{ name: rulesFile, content: rulesContent }] } }),
  });
  const ruleset = await createRes.json();
  if (!ruleset.name) throw new Error(`Failed to create ruleset: ${JSON.stringify(ruleset)}`);
  console.log(`Created ruleset: ${ruleset.name}`);

  // 2. Update the cloud.firestore release to point at the new ruleset
  // The correct PATCH format wraps the release in {release:{...}, updateMask:"..."}.
  const patchRes = await fetch(`${base}/releases/cloud.firestore`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({
      release: {
        name: `${base}/releases/cloud.firestore`,
        rulesetName: ruleset.name,
      },
      updateMask: 'rulesetName',
    }),
  });
  const updated = await patchRes.json();
  if (!updated.rulesetName) throw new Error(`Failed to update release: ${JSON.stringify(updated)}`);
  console.log(`Release updated → ${updated.rulesetName}`);
  console.log('Firestore rules deployed successfully.');
}

deploy().catch(err => { console.error(err); process.exit(1); });
