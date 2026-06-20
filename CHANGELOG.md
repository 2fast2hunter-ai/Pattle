# Changelog

All notable changes to Pattle are documented here.

## [1.25.2] — 2026-06-20

### Bugfixes
- **Battle: Gegner-Level an Team-Durchschnitt anpassen** ([PAT-391](/PAT/issues/PAT-391)): Gegner-Pets wurden bisher am stärksten Pet im Team des Spielers ausgerichtet — kämpfte man mit einem Team aus einem Level-30-Pet und vier Level-5-Pets, kämpfte man gegen Level-30-Gegner. Jetzt wird der Durchschnittslevel aller Team-Pets verwendet, sodass die Kampfschwierigkeit die tatsächliche Teamstärke widerspiegelt und die angestrebte ~80–90 % Gewinnrate unabhängig von der Team-Zusammensetzung erreicht wird.

---

## [1.25.1] — 2026-06-20

### Fixes
- **Feedback-Webhook HTTPS** (PAT-383): Die Webhook-URL wurde auf HTTPS umgestellt. Auf Android (API 28+) wird HTTP-Cleartext-Traffic standardmäßig blockiert — die HTTP-URL führte zu einem 301-Redirect, den Android nie gefolgt ist. Mit der direkten HTTPS-URL werden Feedback-Einsendungen jetzt auf Android zuverlässig übermittelt.

---

## [1.25.0] — 2026-06-17

### Neue Features
- **Unique Pet-Fähigkeiten** (PAT-317): Jede Pet-Spezies hat jetzt eine eigene, einzigartige Fähigkeit (143 Spezies abgedeckt). Fähigkeits-Typen: DOT (Schaden über Zeit), STUN (Runde überspringen), HEAL (HP regenerieren), REVIVE (gefallenen Verbündeten wiederbeleben). Bestehende Pets werden beim nächsten App-Start automatisch auf die korrekte Spezies-Fähigkeit migriert.
- **Feedback-Webhook** (PAT-381): Das Feedback-Formular übermittelt erfolgreiche Einsendungen jetzt automatisch an den Paperclip Player-Feedback-Processor. Webhook-Fehler blockieren nicht die Nutzer-Ansicht.

### Bugfixes
- **Battle: Spezies-Fähigkeit korrekt anwenden** (PAT-317): `useBattleTurn` löst Fähigkeiten jetzt über `SPECIES_ABILITY_MAP` auf — bestehende Pets mit alten abilityIds nutzen die richtige Spezies-Fähigkeit im Kampf. Stun-Turns werden korrekt verbraucht; wiederbelebte Pets werden beim Zug-Wechsel berücksichtigt.
- **Market: Fähigkeits-Anzeige** (PAT-367): `MarketDetailModal` zeigte bisher `pet.abilityId` direkt an, ohne die spezies-basierte Fähigkeit zu berücksichtigen. Wird jetzt wie in `PetDetailScreen` über `SPECIES_ABILITY_MAP` aufgelöst.
- **Items-Bildschirm: Crash beim Einlösen** (PAT-368): `handleRedeemTicket` war in `ScreenRouter` referenziert, aber nie implementiert — ein Klick auf REDEEM bei Breed-Tickets warf einen `TypeError` und brachte den Items-Screen zum Absturz. Die Funktion zeigt jetzt eine lokalisierte Info-Benachrichtigung, die Spieler ans Breeding Lab weiterleitet.
- **Doppelte Übersetzungsschlüssel** (PAT-368): Doppelte `notif_ticket_use_in_breeding`-Einträge in DE- und EN-Lokalisierungsdateien entfernt, die zu einem Lint-Fehler geführt hatten.

---

## [1.24.0] — 2026-06-16

### Neue Features
- **Guild System Phase 1** (PAT-302): Officer-Rollen, Einladesystem und Emblem-Picker eingeführt. Leader und Officers können Mitglieder einladen; Embleme werden beim Gründen der Gilde festgelegt.
- **Community Tab** (PAT-329): Neuer Community-Bereich mit angeheftetem „Guild Emblem Showcase"-Beitrag — Gilden können ihre Embleme präsentieren.
- **In-App Help Center** (PAT-333): Hilfecenter mit ausführlichem Guild-FAQ-Guide direkt in der App, erreichbar über die Einstellungen.
- **Admin-Dashboard: Spielstatistiken** (PAT-288): Das Admin-Dashboard wurde um umfangreiche Spielstatistiken erweitert.

### Bugfixes
- **Guild-Einladung: Rollenprüfung** (PAT-348): `sendGuildInvite` prüft jetzt korrekt, ob der Aufrufer Leader oder Officer ist, bevor eine Einladung gesendet wird.
- **Battle-Start: Pet-Zustand zurücksetzen** (PAT-290): `currentCd` und `currentHp` des Spieler-Pets werden jetzt beim Kampfstart korrekt zurückgesetzt.
- **Dungeon-Raumwechsel: Pet-CD zurücksetzen** (PAT-299): `currentCd` des Spieler-Pets wird beim Wechsel in einen neuen Dungeon-Raum zurückgesetzt.
- **FAQ-Text korrigiert** (PAT-333): Emblem-Erstellung und Mitglieder-Einladeflow im FAQ präzisiert.

---

## [1.23.0] — 2026-06-14

### Fixes
- **Battle pet state reset** (PAT-294): Player pets now always start arena and friend battles with full HP and zero cooldown. Previously, stale `currentHp`/`currentCd` values carried over from previous fights, preventing abilities from firing on the first turn. Enemy pets were already reset; the same reset now applies to the player's team in both arena and friendly battles.
- **Gear in friend battles** (PAT-294): Pet gear stats are now correctly applied in friendly battles, matching the existing arena battle behaviour.

---

## [1.22.0] — 2026-06-13

### Features
- **Feedback Processing Status** (PAT-289): Admin dashboard now supports full feedback lifecycle — admins can mark items as `reviewed` or `done` via Firestore-secured status updates. Status badges (Eye icon for reviewed, CheckCircle for done) are visible on each item. A new "Done" filter tab makes triaging easier. Players now see the correct status badge in the Community feedback list instead of always seeing "new".

---

## [1.21.0] — 2026-06-13

### Balance
- **Arena enemy level offset** (PAT-276): Enemy level window shifted 1 step lower on average — players should now win ~80–90% of arena fights instead of encountering too-hard matchups.

### Fixes
- **Village storage hard cap** (PAT-262): Removed the per-building storage cap that stopped resource production once the limit was reached — resources now accumulate without any ceiling.

---

## [1.20.1] — 2026-06-12

### Balance
- **Arena enemy level scaling** (PAT-276): Enemy level now scales with your highest team pet's level, not just your player account level — a level 11 pet will no longer fight level 1 enemies just because the account is low-level.
- **Arena rarity tier boundary fix** (PAT-276): The medium-difficulty rarity tier now correctly covers levels 26–50 (was incorrectly cutting off at 40).

---

## [1.20.0] — 2026-06-12

### Balance
- **Arena enemy rarity scaling** (PAT-276): Enemy rarity in the arena now scales with player level. Players ≤10 face only COMMON enemies; levels 11–25 introduce UNCOMMON and RARE; levels 26–40 add EPIC; level 41+ sees mostly UNCOMMON/RARE/EPIC with only 10% COMMON.

---

## [1.19.0] — 2026-06-12

### Features
- **Pokédex-style Dex** (PAT-270): The Dex screen is fully reworked into a species catalog — browse every species with stats, lore, and rarity before you catch them.

### Balance
- **Arena Common enemies** (PAT-274): COMMON-rarity enemy HP growth increased ×3 and DEF/RES growth increased ×2.5 across all 27 element types — fights against common enemies now last multiple rounds instead of ending in one hit.

### Fixes
- **Community feedback status badge** (PAT-269): Status badge now renders correctly in the Community feedback list, with proper translations in all supported languages.
- **Feedback list translation keys** (PAT-271): Removed raw translation key strings from labels — all text in the feedback list now renders correctly.
- **Feedback community list translations** (PAT-237): Added missing i18n keys for the feedback community list tab so no raw keys are shown as labels.
- **Firestore feedback index** (PAT-268): Added a composite index on `status + createdAt` for the feedback collection — the feedback list loads without index errors.

---

## [1.18.0] — 2026-06-11

### Features
- **Village Interactive Map** (PAT-248): Click any building on the village map to manage it — no more hunting through menus.
- **Village Events System** (PAT-247): Random events now fire in your village, including Harvest Festival and Tax Collection.
- **5 New Village Buildings** (PAT-245): Sawmill, Quarry, Stable, Library, and Blacksmith available to build and upgrade.
- **Full Building Artwork** (PAT-264): All 9 village buildings and the arena now render with SVG sprite art.

### Improvements
- **Village Storage** (PAT-262): Removed the village storage capacity limit — resources accumulate without a ceiling.

### Fixes
- **Sawmill Sprite** (PAT-265): Resolved broken `url(#woodGrain)` reference that caused a visual glitch on the Sawmill building.
- **Firestore Rules Deploy** (PAT-257): Fixed a 403 error in CI that occasionally blocked Firestore security rule updates.

---

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
