import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { translateAuthError } from "../src/features/auth/authErrors.ts";
import { normalizePlayerId, playerIdFromInternalEmail, playerIdToInternalEmail } from "../src/features/auth/playerIdentity.ts";
import { CLASSES } from "../src/game/classes.ts";
import { RACES } from "../src/game/races.ts";
import { calculateMaxHp, calculateMaxMp, calculateStats } from "../src/game/stats.ts";

describe("Player identity", () => {
  it("keeps the technical email out of the public identifier", () => {
    assert.equal(normalizePlayerId("  Hunter.07 "), "hunter.07");
    assert.equal(playerIdToInternalEmail("Hunter.07"), "hunter.07@grpg.local");
    assert.equal(playerIdFromInternalEmail("hunter.07@grpg.local"), "hunter.07");
  });
  it("rejects unsafe identifiers", () => assert.throws(() => normalizePlayerId("x@example.com"), /INVALID_PLAYER_ID/));
});

describe("Character math", () => {
  it("combines race and class bonuses and derives HP/MP", () => {
    const dwarf = RACES.find((race) => race.id === "dwarf");
    const mage = CLASSES.find((gameClass) => gameClass.id === "mage");
    assert.ok(dwarf && mage);
    const stats = calculateStats(dwarf, mage);
    assert.deepEqual(stats, { str: 5, agi: 5, vit: 7, int: 7, dex: 5, luk: 5 });
    assert.equal(calculateMaxHp(stats), 120);
    assert.equal(calculateMaxMp(stats), 81);
  });
});

describe("Auth error translation", () => {
  it("never exposes a raw Firebase error", () => {
    assert.match(translateAuthError({ code: "auth/invalid-credential" }), /ACCESS DENIED/);
    assert.doesNotMatch(translateAuthError({ code: "auth/internal-error" }), /auth\//);
  });
});
