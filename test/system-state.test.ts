import assert from "node:assert/strict";
import { it } from "node:test";
import { deriveSystemState } from "../src/system/state/deriveSystemState.ts";
import type { Player } from "../src/types/domain.ts";

const player = { hp: 100, maxHp: 100, zoneType: "safe" } as Player;
it("derives state by safety priority", () => {
  assert.equal(deriveSystemState(player), "NORMAL");
  assert.equal(deriveSystemState({ ...player, zoneType: "combat" }), "COMBAT");
  assert.equal(deriveSystemState({ ...player, hp: 10 }), "CRITICAL");
  assert.equal(deriveSystemState(player, true, true), "SYSTEM");
  assert.equal(deriveSystemState(player, false, true), "EVENT");
});
