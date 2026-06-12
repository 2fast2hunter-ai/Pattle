export const PATCHES = [
    {
        version: 'v1.19.0',
        date: '2026-06-12',
        changes: [
            { type: 'changed', text: 'Arena balance: Common-tier enemies are significantly tankier — fights now last 3+ rounds instead of ending in a single hit' },
            { type: 'changed', text: 'Arena balance: Enemy HP growth (COMMON rarity) increased ×3; DEF and RES growth increased ×2.5 across all 27 element types' },
        ]
    },
    {
        version: 'v1.18.0',
        date: '2026-06-11',
        changes: [
            { type: 'new', text: 'Village interactive map: tap any building to manage it directly on the map' },
            { type: 'new', text: 'Village events: random events now fire in your village (Harvest Festival, Tax Collection, and more)' },
            { type: 'new', text: '5 new village buildings: Sawmill, Quarry, Stable, Library, and Blacksmith' },
            { type: 'new', text: 'Full building artwork: all 9 village buildings and the arena now use crisp SVG sprite art' },
            { type: 'changed', text: 'Village storage: capacity limit removed — hoard as many resources as you like' },
            { type: 'fixed', text: 'Sawmill sprite: fixed a broken wood-grain texture reference that caused a visual glitch' },
            { type: 'fixed', text: 'Firestore rules deploy: resolved a 403 error in CI that occasionally blocked rule updates' },
        ]
    },
    {
        version: 'v1.17.0',
        date: '2026-06-11',
        changes: [
            { type: 'fixed', text: 'Global Chat: messages now load correctly — Firestore composite index added for the chat feed' },
            { type: 'fixed', text: 'Caching: switched to network-first strategy so every deploy is instantly visible without a forced refresh' },
        ]
    },
    {
        version: 'v1.16.0',
        date: '2026-06-11',
        changes: [
            { type: 'new', text: 'Mythic rarity tier: the rarest tier in Pattle — 3 Mythic pets now available to collect' },
            { type: 'new', text: 'Pet gear system: equip, unequip, and sell gear on your pets; gear drops from battles and boosts stats in combat' },
            { type: 'new', text: 'Privacy policy added: accessible from the Settings screen' },
            { type: 'changed', text: 'Feedback panel is now visible to all players, not just admins — let us know how the game can improve!' },
            { type: 'fixed', text: 'Guild creation: fixed a bug that caused guild creation to fail silently' },
            { type: 'fixed', text: 'Chat: errors are now shown in the UI instead of failing silently' },
        ]
    },
    {
        version: 'v1.15.0',
        date: '2026-06-05',
        changes: [
            { type: 'new', text: 'Global Chat: real-time chat with all players, accessible from the main menu' },
            { type: 'new', text: 'Friend requests: send friend requests by username (instead of ID), accept or decline in-profile' },
            { type: 'new', text: 'Admin dashboard: owner-only analytics screen (DAU/MAU, retention funnel, rank distribution, top pets)' },
            { type: 'changed', text: 'Social actions upgraded: friend requests now use Firestore batch writes for atomic mutual-friend creation' },
        ]
    },
    {
        version: 'v1.14.0',
        date: '2026-06-05',
        changes: [
            { type: 'new', text: 'What\'s New modal: shows the latest patch notes once per version after login' },
            { type: 'new', text: 'Daily auto-deploy: game automatically re-deploys every day at 8am UTC to pick up fresh assets' },
            { type: 'changed', text: 'Build toolchain updated: Vite 5.4 + @vitejs/plugin-react 4.7 for faster builds' },
        ]
    },
    {
        version: 'v1.13.0',
        date: '2026-06-04',
        changes: [
            { type: 'new', text: 'Animated battle backgrounds: each element type (Fire, Water, Nature, etc.) has its own themed battle scene' },
            { type: 'new', text: 'Low-power toggle: disable animated backgrounds to save battery on mobile' },
        ]
    },
    {
        version: 'v1.12.0',
        date: '2026-06-03',
        changes: [
            { type: 'new', text: 'Dungeon mode: roguelike runs with permanent death and scaling floor difficulty' },
            { type: 'new', text: 'Each dungeon run is unique — floors grow harder, rewards grow larger' },
            { type: 'new', text: 'Permadeath: if your team wipes, the run ends and you start fresh' },
        ]
    },
    {
        version: 'v1.11.0',
        date: '2026-06-02',
        changes: [
            { type: 'new', text: 'Guild system: create or join a guild, chat with members, earn contribution points' },
            { type: 'new', text: 'Guild leaderboard: see top guilds ranked by total contribution' },
            { type: 'new', text: 'Guild arena tag shown on your profile and leaderboard entries' },
        ]
    },
    {
        version: 'v1.10.0',
        date: '2026-06-01',
        changes: [
            { type: 'new', text: 'Arena rank tiers: Stone → Bronze → Silver → Gold → Platinum → Diamond → Master based on Elo rating' },
            { type: 'new', text: 'Rank badge shown next to Elo in Arena Hub and on every Leaderboard entry' },
            { type: 'fixed', text: 'LeaderboardScreen/ArenaHub: remaining German strings (RANGLISTE, Bald..., Top Spieler, Endlos Survival) now in English' },
        ]
    },
    {
        version: 'v1.9.0',
        date: '2026-06-01',
        changes: [
            { type: 'new', text: 'Battle speed toggle: tap ⚡ button during combat to switch between 1x and 2x speed (preference saved)' },
            { type: 'fixed', text: 'BattleScreen: remaining German strings (Wiederbelebung, Werbung schauen, Fertig) now in English' },
        ]
    },
    {
        version: 'v1.8.0',
        date: '2026-05-31',
        changes: [
            { type: 'fixed', text: 'Battle log: "nutzt"→"uses", "greift an"→"attacks", "KRIT!"→"CRIT!" in EN fallbacks' },
            { type: 'fixed', text: 'TowerScreen/ArenaHub: "Stufe"→"Stage", "Monatlicher Reset"→"Monthly Reset"' },
            { type: 'fixed', text: 'Team screen: "Verwaltung"→"Management", "Belegt"→"Used", "Leerer Slot"→"Empty Slot"' },
            { type: 'fixed', text: 'Currency: all remaining "Gold" labels replaced with "Coins"' },
            { type: 'fixed', text: 'GauntletSummary: "GAUNTLET BEENDET"→"GAUNTLET OVER", "Belohnungen"→"Rewards"' },
            { type: 'fixed', text: 'EggSlot, IdleReturnModal, PetHub, ItemInventory: remaining German fallbacks translated' },
            { type: 'fixed', text: 'db.js: all German console.error messages translated to English' },
            { type: 'fixed', text: 'battleLogic: PvE enemy prefix "Wildes"→"Wild"' },
        ]
    },
    {
        version: 'v1.7.0',
        date: '2026-05-31',
        changes: [
            { type: 'fixed', text: 'Full German→English translation pass: all UI labels, data files, quest names, rarity names, type names, village buildings, and shop items are now in English' },
            { type: 'fixed', text: 'Leaderboard: player name fallback and daily diff label now in English' },
            { type: 'fixed', text: 'Inventory: rarity filter "All" button was showing German' },
            { type: 'fixed', text: 'Achievement notification now shows "Coins" instead of "Gold"' },
        ]
    },
    {
        version: 'v1.6.0',
        date: '2026-05-28',
        changes: [
            { type: 'new', text: 'Achievements: 20 unlockable badges with gold and gem rewards' },
            { type: 'new', text: 'Daily login streak: Log in 7 days in a row for bonus rewards' },
            { type: 'new', text: 'Achievements overview in main menu with progress tracking' },
            { type: 'fixed', text: 'Pet image for NATURE_BEAR species failed to load (filename typo)' },
            { type: 'fixed', text: 'Feedback form: Added Firestore permission rule for feedback collection' },
            { type: 'fixed', text: 'Achievement cards always showed German regardless of language setting' },
            { type: 'fixed', text: 'Achievement unlock time showed Invalid Date instead of correct date' },
        ]
    },
    {
        version: 'v1.5.0',
        date: '2026-05-25',
        changes: [
            { type: 'new', text: 'Push notifications for egg hatching, full storage and daily quests' },
            { type: 'new', text: 'Security: Marketplace transactions are now validated server-side' },
            { type: 'fixed', text: 'Tower progress is now correctly saved to Firestore' },
            { type: 'fixed', text: 'Added Firebase offline fallback' },
        ]
    },
    {
        version: 'v1.4.0',
        date: '2026-05-24',
        changes: [
            { type: 'new', text: 'Season 1 content: 10 new pets (TECH, VOID, DIVINE, CHAOS, TIME types)' },
            { type: 'new', text: '20 new daily quest templates' },
            { type: 'new', text: 'Tower floors 31-40 with CHAOS mini-boss and DIVINE champion' },
            { type: 'new', text: 'Google Analytics 4 for player behavior analysis' },
            { type: 'new', text: 'Android PWA – installable from Chrome browser' },
            { type: 'new', text: 'Rewarded video ads + banner ads (AdSense-ready)' },
            { type: 'new', text: 'Player feedback reporting system' },
        ]
    },
    {
        version: 'v1.3.0',
        date: '2026-05-24',
        changes: [
            { type: 'new', text: 'Patch notes screen added' },
            { type: 'new', text: 'Feedback feature: Players can report bugs and suggestions' },
            { type: 'new', text: 'Idle earnings: Village produces resources while you are away' },
            { type: 'new', text: 'Fusion recipes and secret hybrid species in the breeding lab' },
            { type: 'changed', text: 'Rarity filter and sort by level in the collection' },
        ]
    },
    {
        version: 'v1.2.0',
        date: '2026-05-22',
        changes: [
            { type: 'new', text: 'Arena Tower: Climb floor by floor' },
            { type: 'new', text: 'Auto-battle: Let your team fight automatically' },
            { type: 'new', text: 'Gauntlet mode: 5 battles in a row' },
            { type: 'changed', text: 'Improved battle UI with round display and combat log' },
            { type: 'changed', text: 'CI/CD: Lint and test gates for automatic deployment' },
        ]
    },
    {
        version: 'v1.1.0',
        date: '2026-05-20',
        changes: [
            { type: 'new', text: 'Village system: Resource production and building upgrades' },
            { type: 'new', text: 'Breeding system: Combine pets to discover new species' },
            { type: 'new', text: 'Daily login with weekly rewards' },
            { type: 'new', text: 'Marketplace: Buy and sell pets with other players' },
            { type: 'changed', text: 'Redesigned UI: Modern dark theme' },
        ]
    },
    {
        version: 'v1.0.0',
        date: '2026-05-19',
        changes: [
            { type: 'new', text: 'First release: Pattle is live!' },
            { type: 'new', text: '25 element types with unique pets per type' },
            { type: 'new', text: 'Battle system: Turn-based fights with team mechanics' },
            { type: 'new', text: 'Lootboxes: Collect pets through daily rewards' },
            { type: 'new', text: 'Leaderboard: Compete against players worldwide' },
        ]
    }
];
