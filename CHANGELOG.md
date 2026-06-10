# Changelog

All notable changes to Pattle are documented here.

## [1.17.0] — 2026-06-11

### Fixes
- **Global Chat** (PAT-257): Firestore composite index added for the global chat feed — messages now load correctly for all players.
- **Caching** (PAT-255): Switched to network-first service worker strategy with `pattle-v17` cache; every deploy is immediately visible without a forced refresh.

---

## [1.16.0] — 2026-06-11

### Features
- **Store Assets** (PAT-222): 15 App Store / Google Play screenshots across 3 platform sizes (Google Play 1080×1920, iPhone 6.5", iPhone 5.5") covering Main Menu, Battle, Pet Collection, Village, and Profile. Feature graphic generated at 1024×500.
- **Privacy Policy** (PAT-225): Bilingual (DE/EN) GDPR-compliant privacy policy page, accessible in-app and on the web.
- **App Icon & Splash Screen** (PAT-221): Production-quality app icon and Capacitor splash screen assets added for Android and iOS.
- **Mythic Rarity Tier** (PAT-184): New Mythic rarity tier with 3 mythic pets — the rarest creatures in Pattle.
- **Pet Gear System** (PAT-183): Equip, unequip, and sell gear on pets. Gear drops from battles and applies stat bonuses during combat.
- **Feedback → Auto Issues** (PAT-192): Player feedback automatically creates Paperclip issues via Cloud Function webhook, closing the player→dev feedback loop.
- **Feedback Panel for All Users** (PAT-201): The in-game feedback panel and status indicator are now visible to all players, not just admins.

### Fixes & Improvements
- **Admin Dashboard** (PAT-194): Admin Dashboard shortcut added to Settings screen for admin users.
- **Guild Creation** (PAT-203): Fixed guild creation failing due to invalid Firestore batch chaining — now uses imperative `writeBatch`.
- **Chat & Firestore Rules** (PAT-200): Restored Firestore security rules deploy in CI; surfaced chat errors to the UI for easier debugging.
- **CI/CD Stability**: Resolved multiple Firebase deploy issues — firebase-tools version pinning, Gen 1 function compatibility, service account auth, and workflow deduplication.

---

## [0.1.0] — Initial Alpha

- Turn-based pet battle system with type advantages
- Idle village simulation
- Pet collection with Common → Legendary rarity tiers
- Guild system
- Daily quests and login rewards
- Firebase backend (Firestore, Auth, Cloud Functions)
- PWA + Android (Capacitor) builds
