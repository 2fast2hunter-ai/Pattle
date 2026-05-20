# CODEBASE.md — Pattle Architecture Overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | JavaScript (JSX) — **not TypeScript** |
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS + App.css |
| State | Custom React hooks (no Redux/Zustand) |
| Backend | Firebase (Firestore, Auth, Analytics) |
| Mobile | Capacitor 8 (Android wrapper) |
| Deployment | GitHub Pages (web), APK via Capacitor (Android) |
| CI/CD | GitHub Actions — deploy to Pages on push to `main` |
| Icons | lucide-react |

## Entry Points

| File | Role |
|------|------|
| `index.html` | HTML shell |
| `src/main.jsx` | React root — mounts `<App />` |
| `src/App.jsx` | App root — composes `useGameLogic`, routing, modals |
| `src/firebase.js` | Firebase init (hardcoded config — see Gaps below) |
| `src/index.js` | Re-export barrel (minor) |
| `.github/workflows/deploy.yml` | CI: npm install → build → deploy to Pages |
| `capacitor.config.json` | Android app config (`com.harry.pattle`) |

## Folder Structure

```
src/
├── App.jsx                    # App root
├── main.jsx                   # Entry point
├── firebase.js                # Firebase init
├── components/
│   ├── battle/                # Battle UI (arena background, units, log, victory)
│   ├── breeding/              # Breeding station UI
│   ├── hatchery/              # Egg slots, hatching modal
│   ├── inventory/             # Item cards, lootbox animation
│   ├── leaderboard/           # Leaderboard items, rank card
│   ├── market/                # Market cards, sell input
│   ├── modals/                # Generic modals (daily login, delete, upgrade, etc.)
│   ├── navigation/            # ScreenRouter
│   ├── profile/               # Profile header, friends, stats
│   ├── quests/                # Quest items, reward badges
│   ├── shop/                  # Shop sections, lootbox modal
│   ├── ui/                    # Shared UI (AdModal, Notification, LoadingScreen, Tutorial)
│   └── village/               # Village header, resource grid, idle banner
├── data/                      # Static game data (no business logic)
│   ├── abilities.js           # Ability definitions (name, type, dmgScale, element)
│   ├── battleData.js          # Enemy/battle seed data
│   ├── consumableData.js      # Consumable item definitions
│   ├── cosmeticData.js        # Village cosmetics
│   ├── gameData.jsx           # Master data (BASE_ANIMALS, ABILITIES, RARITIES re-exports)
│   ├── levelData.js           # Player level XP table
│   ├── petData.jsx            # Pet display data
│   ├── petStatsData.js        # Stat scaling tables
│   ├── pets.js                # ZODIAC_ANIMALS, SPECIES_BY_TYPE, FUSION_RECIPES, SECRET_ANIMALS
│   ├── questData.js           # Quest definitions
│   ├── rarities.js            # Rarity tiers (COMMON → MYTHIC)
│   ├── shopData.js            # Shop item catalog
│   ├── towerData.js           # Tower floor definitions
│   ├── translations.js        # i18n strings (de / en)
│   ├── types.jsx              # 25 elemental types with icons, colors, TYPE_ADVANTAGES
│   └── villageData.js         # Village building definitions
├── hooks/
│   ├── useGameLogic.js        # Root game hook — composes state + actions + Firebase listeners
│   ├── useGameLogic/
│   │   ├── useGameLogicState.js   # All useState declarations
│   │   ├── useGameActions.js      # Action dispatcher
│   │   └── actions/               # Individual action modules (battle, breeding, shop, etc.)
│   ├── useAppActions.js       # App-level actions (login, settings)
│   ├── useAutoBattleLoop.js   # Auto-battle tick loop
│   ├── useBattleTurn.js       # Turn execution with animation state
│   ├── useBreeding.js         # Breeding UI state + logic
│   ├── useHatchery.js         # Hatchery timers + hatching
│   ├── useInventory.js        # Inventory filtering/sorting
│   ├── useMarketplace.js      # Market listing/buying state
│   ├── useProfileStats.js     # Profile stats aggregation
│   ├── useQuests.js           # Quest progress tracking
│   └── useTutorial.js         # Tutorial step machine
├── screens/                   # Full-page screen components (routed by ScreenRouter)
│   ├── AuthScreen.jsx
│   ├── MainMenu.jsx
│   ├── ArenaHub.jsx
│   ├── BattleScreen.jsx
│   ├── TowerScreen.jsx
│   ├── BreedingScreen.jsx
│   ├── HatcheryScreen.jsx
│   ├── InventoryScreen.jsx / ItemInventoryScreen.jsx
│   ├── PetHub.jsx / PetDetailScreen.jsx
│   ├── TeamEditScreen.jsx
│   ├── VillageScreen.jsx / VillageCosmeticsScreen.jsx / VillageMilestonesScreen.jsx / VillageTradingScreen.jsx
│   ├── MarketplaceScreen.jsx
│   ├── ShopScreen.jsx
│   ├── QuestsScreen.jsx
│   ├── LeaderboardScreen.jsx
│   ├── ProfileScreen.jsx / FriendProfileScreen.jsx
│   ├── TrainingScreen.jsx
│   ├── SettingsScreen.jsx
│   └── LegalScreen.jsx
└── utils/
    ├── adManager.js           # Ad integration stub
    ├── db.js                  # All Firestore read/write operations
    ├── gameMechanics.js       # Re-export barrel for mechanics
    ├── soundManager.js        # BGM + SFX manager
    └── mechanics/
        ├── battleLogic.js     # calculateDamage, executeTurn, generateBattleTeam
        ├── lootLogic.js       # Lootbox roll tables
        ├── petGeneration.js   # generatePet, calculateBreedRarity
        ├── petLogic.js        # Pet utility functions
        ├── petStats.js        # recalculatePetStats, calculateMaxXp
        ├── progression.js     # calculatePlayerLevel, getXpToNextPlayerLevel
        ├── progressionLogic.js
        ├── questLogic.js      # Quest completion checks
        └── quests.js          # Quest helpers
```

## Key Game Systems — Implementation Status

### Battle Engine ✅ Implemented
- **Files:** `src/utils/mechanics/battleLogic.js`, `src/hooks/useBattleTurn.js`
- Turn order determined by `speed` stat
- Damage formula: `max(1, floor((2 * scaledAtk) - defStat) * crit * effectiveness * variance)`
- Physical (ATK vs DEF) and Special (AP vs RES) damage types
- Crit system: `critRate` stat, fallback to speed differential
- Type effectiveness: 2× super-effective, 0.5× not very effective (from 25-type chart)
- Ability system: `abilityId` + cooldown counter; auto-attack fallback
- Headless-capable: `calculateDamage` and `executeTurn` are pure functions

### Battle Modes ✅ Implemented
- Arena (standard PvE farming)
- Tower Mode (floor-by-floor with escalating enemies — `towerData.js`)
- Gauntlet Mode (multi-fight survival, no heal between rounds)
- Auto-battle loop (`useAutoBattleLoop.js`)
- Friend battles (`startFriendBattle.js`)

### Pet & Type System ✅ Implemented
- 25 elemental types defined in `src/data/types.jsx` with icons, colors, and `TYPE_ADVANTAGES`
- Type chart auto-generated (circular advantage pattern: strong vs 4 prior types, weak vs 4 next)
- Rarities: COMMON, UNCOMMON, RARE, EPIC, MYTHIC (+ LEGENDARY implied)
- Stats per pet: HP, ATK, DEF, AP, RES, SPEED, critRate, level, XP
- `SPECIES_BY_TYPE` maps each type to catchable species
- `ZODIAC_ANIMALS` defines base species pool

### Breeding & Genetics ✅ Implemented
- `breedPets.js` + `useBreeding.js` — select 2 parents → generate egg
- Rarity inheritance: probabilistic (child usually min-parent rarity, 9% chance to hit max, 1% to exceed)
- Breeding cooldown on parents
- `FUSION_RECIPES` in `pets.js` — predefined element combos produce specific species
- `SECRET_ANIMALS` — rare easter-egg combinations

### Hatchery ✅ Implemented
- Real-time countdown timers per egg slot
- Ad-watch shortcut to reduce incubation time (`adManager.js` + `useHatchery.js`)
- Hatching animation reveal (`HatchingModal.jsx`)

### Village Idle Economy ✅ Implemented
- Resource buildings (gold, wood, stone) with production rates in `villageData.js`
- Offline accumulation: computed on login from `lastCollected` timestamp
- Idle banner on login (`IdleTimerBanner.jsx`)
- Building upgrades (rate + cap increases)
- Village milestones and cosmetic unlocks

### Pet Roster / Team Builder ✅ Implemented
- `PetHub.jsx` — grid view with element, rarity badge, level
- `PetDetailScreen.jsx` — stat breakdown
- `TeamEditScreen.jsx` — select up to N pets for battle team
- Sort/filter by element, rarity, level in `useInventory.js`

### Marketplace ✅ Implemented
- `MarketplaceScreen.jsx` + `useMarketplace.js`
- List pets/items for sale, buy from other players (Firestore-backed)

### Quests ✅ Implemented
- Daily + weekly quests (`questData.js`, `useQuests.js`, `questLogic.js`)
- Composite reward system (gold + XP + items + badges)

### Social / Leaderboards ✅ Implemented
- Friends list, friend profile visits, friend battles
- Global leaderboards (tower, arena, village)

### Shop ✅ Implemented
- Lootbox system with reveal animation
- Free daily lootbox (ad-gated — `ShopFreeSection.jsx`)

### Ad Integration ⚠️ Partial
- `adManager.js` exists as a stub/wrapper
- Ad flow triggers via `AdModal.jsx`
- Actual AdMob/Google Ad Manager SDK not yet integrated

## Data Flow

```
Firebase Auth
    ↓
useGameLogic.js  (root hook)
    ├── useGameLogicState.js  (all useState)
    ├── useGameActions.js     (dispatches to action modules)
    └── Firestore listeners   (listenToUser, listenToPets, listenToMarket)
            ↓
    App.jsx  →  ScreenRouter  →  [Screen]
```

State lives entirely in the `useGameLogic` hook. All screens receive state and action callbacks as props. No global state library.

## Backend (Firebase)

- **Auth:** Firebase Auth (email/password, Google sign-in implied)
- **Database:** Firestore — collections: `users`, `pets`, `market`
- **Rules:** `firestore.rules` — needs review before production
- **Config:** Hardcoded in `src/firebase.js` (API key is public-facing, which is normal for Firebase web, but rules must restrict access)

## Known Gaps Before Feature Work

1. **No test suite** — zero `.test.js` or `.spec.js` files. Core mechanics (`battleLogic`, `petGeneration`, `questLogic`) have no coverage. Add Vitest before building on top.
2. **CI only deploys — no lint/test step** — `deploy.yml` does `npm ci && npm run build` only. Needs lint + test gates.
3. **No TypeScript** — codebase is plain JS/JSX. `package.json` description says TypeScript but none is used. Type-safety issues will grow as the codebase scales.
4. **Ad SDK not integrated** — `adManager.js` is a stub. Revenue model requires real AdMob wiring.
5. **README is Vite template boilerplate** — no project-specific setup instructions.
6. **Duplicate files** — `TowerScreen.jsx` exists in `src/`, `src/utils/`, and `src/hooks/useGameLogic/actions/` — only `src/screens/TowerScreen.jsx` is the live screen. Others appear to be stale copies.
7. **Firebase config in source** — acceptable for web Firebase (security is via Firestore rules), but rules need hardening.
8. **No Android build in CI** — Capacitor/Android APK build is not automated.

## Dependency on PET-2 for Subsequent Tasks

- **PET-3 (CI/CD):** Add `npm run lint` + `npx vitest run` steps before the deploy step. Install Vitest first.
- **PET-4 (Battle engine):** Core logic exists in `battleLogic.js`. Task should focus on headless test coverage + any missing features (status effects, multi-hit abilities).
- **PET-5 (Pet roster UI):** `PetHub.jsx` and `TeamEditScreen.jsx` are built. Task should review completeness against spec.
- **PET-6 (Breeding lab):** `BreedingScreen.jsx` + `breedPets.js` are built. Task should add fusion recipe UI and secret hybrid feedback.
- **PET-7 (Village idle):** `VillageScreen.jsx` + `villageData.js` are built. Task should audit offline accumulation edge cases and upgrade flow completeness.
