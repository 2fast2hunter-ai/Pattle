const BASE = import.meta.env.BASE_URL;
const STORAGE_KEY = 'pattle_scheduled_notifs';
const STORAGE_FULL_KEY = 'pattle_storage_full_notified';
const DAILY_RESET_KEY = 'pattle_daily_reset_notified';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

async function showNotification(title, body, data = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      icon: `${BASE}icons/icon-192x192.png`,
      badge: `${BASE}icons/icon-192x192.png`,
      data,
      tag: data.tag || 'pattle-notif',
      renotify: true,
    });
  } catch {
    try { new Notification(title, { body, icon: `${BASE}icons/icon-192x192.png` }); } catch (_e) { /* fallback failed silently */ }
  }
}

function loadScheduled() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

function saveScheduled(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const activeTimers = {};

export function scheduleEggNotification(petId, petName, hatchAt) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const delay = hatchAt - Date.now();
  if (delay <= 0) return;

  // Cancel any existing timer for this pet
  cancelEggNotification(petId);

  const scheduled = loadScheduled();
  scheduled[petId] = { petId, petName, hatchAt };
  saveScheduled(scheduled);

  activeTimers[petId] = setTimeout(async () => {
    const current = loadScheduled();
    if (!current[petId]) return;
    delete current[petId];
    saveScheduled(current);
    delete activeTimers[petId];

    await showNotification(
      '🥚 Ei ist geschlüpft!',
      `${petName} ist bereit zum Schlüpfen!`,
      { screen: 'hatchery', petId, tag: `egg-${petId}` }
    );
  }, delay);
}

export function cancelEggNotification(petId) {
  if (activeTimers[petId]) {
    clearTimeout(activeTimers[petId]);
    delete activeTimers[petId];
  }
  const scheduled = loadScheduled();
  if (scheduled[petId]) {
    delete scheduled[petId];
    saveScheduled(scheduled);
  }
}

export function restoreEggNotifications(pets) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const scheduled = loadScheduled();
  const now = Date.now();

  // Clean up stale entries for pets that are no longer eggs
  const eggIds = new Set((pets || []).filter(p => p.isEgg && p.hatchAt > 0).map(p => p.id));
  const cleaned = {};
  for (const [petId, entry] of Object.entries(scheduled)) {
    if (eggIds.has(petId)) cleaned[petId] = entry;
  }
  saveScheduled(cleaned);

  // Re-arm timers for valid pending eggs
  for (const entry of Object.values(cleaned)) {
    if (entry.hatchAt > now && !activeTimers[entry.petId]) {
      scheduleEggNotification(entry.petId, entry.petName, entry.hatchAt);
    }
  }
}

export async function notifyStorageFull() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const lastNotified = parseInt(localStorage.getItem(STORAGE_FULL_KEY) || '0', 10);
  // Throttle: max once per hour
  if (Date.now() - lastNotified < 60 * 60 * 1000) return;
  localStorage.setItem(STORAGE_FULL_KEY, String(Date.now()));
  await showNotification(
    '📦 Lager ist voll!',
    'Dein Dorflager ist voll. Sammle deine Ressourcen!',
    { screen: 'village', tag: 'storage-full' }
  );
}

export function scheduleDailyQuestReset() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const today = new Date().toISOString().split('T')[0];
  const lastScheduled = localStorage.getItem(DAILY_RESET_KEY);
  if (lastScheduled === today) return;

  localStorage.setItem(DAILY_RESET_KEY, today);

  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 30, 0); // 30s after midnight
  const delay = midnight.getTime() - now.getTime();

  setTimeout(async () => {
    await showNotification(
      '🎯 Tägliche Quests zurückgesetzt!',
      'Neue Quests warten auf dich. Spiel jetzt!',
      { screen: 'quests', tag: 'daily-reset' }
    );
    // Re-schedule for next midnight
    localStorage.removeItem(DAILY_RESET_KEY);
    scheduleDailyQuestReset();
  }, delay);
}
