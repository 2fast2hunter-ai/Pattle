import { PATCHES } from '../data/patchData';

export const CURRENT_VERSION = PATCHES[0]?.version ?? 'v1.0.0';
const STORAGE_KEY = 'pattle_last_seen_version';

export function getLastSeenVersion() {
    return localStorage.getItem(STORAGE_KEY) ?? null;
}

export function markVersionSeen(version) {
    localStorage.setItem(STORAGE_KEY, version);
}
