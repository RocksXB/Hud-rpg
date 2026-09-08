# HUD-RPG 2.0 foundation review

This branch replaces the stale PR #2 branch with a version based on the current `main`.

Key corrections applied during review:

- canonical race and class bonuses restored from `Gofreamer/HUD-RPG`;
- canonical base stats and HP/MP formulas restored;
- Human racial flexibility implemented as +1 to two distinct chosen attributes;
- Firestore rules validate allowed race/class IDs, exact derived stats, Human allocation, HP/MP formulas, and one-time character creation;
- rules tests cover valid character creation and reject forged progression/stat payloads.

The branch intentionally keeps the rest of the PR #2 scope as a foundation/skeleton. Inventory, Equipment, Skills, Quests, Guild, Party, Titles and Admin are not represented as complete production modules yet.
