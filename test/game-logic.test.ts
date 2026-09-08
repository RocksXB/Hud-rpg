import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { translateAuthError } from "../src/features/auth/authErrors.ts";
import { normalizePlayerId, playerIdFromInternalEmail, playerIdToInternalEmail } from "../src/features/auth/playerIdentity.ts";
import { CLASSES } from "../src/game/classes.ts";
import { RACES } from "../src/game/races.ts";
import { calculateMaxHp, calculateMaxMp, calculateStats, createFlexibleBonus } from "../src/game/stats.ts";

describe("Player identity", () => {
  it("keeps the technical email out of the public identifier", () => {
    assert.equal(normalizePlayerId("  Hunter.07 "), "hunter.07");
    assert.equal(playerIdToInternalEmail("Hunter.07"), "hunter.07@grpg.local");
    assert.equal(playerIdFromInternalEmail("hunter.07@grpg.local"), "hunter.07");
  });

  it("rejects unsafe identifiers", () => assert.throws(() => normalizePlayerId("x@example.com"), /INVALID_PLAYER_ID/));
});

describe("Character math", () => {
  it("preserves canonical race/class bonuses and HP/MP math", () => {
    const dwarf = RACES.find((race) => race.id === "dwarf");
    const mage = CLASSES.find((gameClass) => gameClass.id === "mage");
    assert.ok(dwarf && mage);
    const stats = calculateStats(dwarf, mage);
    assert.deepEqual(stats, { str: 11, agi: 10, vit: 12, int: 14, dex: 10, luk: 10 });
    assert.equal(calculateMaxHp(stats), 128);
    assert.equal(calculateMaxMp(stats), 100);
  });

  it("applies the Human +1 bonus to two different chosen attributes", () => {
    const human = RACES.find((race) => race.id === "human");
    const warrior = CLASSES.find((gameClass) => gameClass.id === "warrior");
    assert.ok(human && warrior && human.flexiblePoints === 2);
    const flexible = createFlexibleBonus(["dex", "luk"], human.flexiblePoints);
    const stats = calculateStats(human, warrior, flexible);
    assert.deepEqual(stats, { str: 13, agi: 10, vit: 12, int: 10, dex: 11, luk: 11 });
    assert.equal(calculateMaxHp(stats), 128);
    assert.equal(calculateMaxMp(stats), 80);
  });

  it("rejects duplicate Human flexible attributes", () => {
    assert.throws(() => createFlexibleBonus(["dex", "dex"], 2), /INVALID_FLEXIBLE_STATS/);
  });
});

describe("Auth error translation", () => {
  it("never exposes a raw Firebase error", () => {
    assert.match(translateAuthError({ code: "auth/invalid-credential" }), /ACCESS DENIED/);
    assert.doesNotMatch(translateAuthError({ code: "auth/internal-error" }), /auth\//);
  });
});
