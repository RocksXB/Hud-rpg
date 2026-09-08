import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  normalizePlayerId,
  playerIdToInternalEmail,
} from "../src/player-identity.js";

describe("Player ID authentication adapter", () => {
  it("normalizes Player IDs before creating the internal Auth identifier", () => {
    assert.equal(normalizePlayerId("  Hero.01  "), "hero.01");
    assert.equal(playerIdToInternalEmail("Hero.01"), "hero.01@grpg.local");
  });

  it("rejects IDs that cannot be mapped safely", () => {
    assert.throws(() => playerIdToInternalEmail("ab"), /Player ID must contain/);
    assert.throws(
      () => playerIdToInternalEmail("player@example.com"),
      /Player ID must contain/,
    );
  });
});
