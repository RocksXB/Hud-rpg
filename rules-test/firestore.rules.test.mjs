import { readFile } from "node:fs/promises";
import { after, before, beforeEach, describe, it } from "node:test";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

let env;
const player = (playerId) => ({
  playerId,
  displayName: null,
  characterCreated: false,
  raceId: null,
  classId: null,
  level: 1,
  xp: 0,
  hp: 0,
  maxHp: 0,
  mp: 0,
  maxMp: 0,
  condition: "stable",
  locationId: null,
  regionId: null,
  zoneType: "safe",
  guildId: null,
  partyId: null,
  activeTitleId: null,
  avatarUrl: null,
  appearance: {},
  stats: { str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  createdAt: null,
  updatedAt: null,
  schemaVersion: 1,
});

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "hud-rpg-rules-test",
    firestore: { rules: await readFile("firestore.rules", "utf8") },
  });
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "players", "alice"), player("alice"));
    await setDoc(doc(db, "players", "bob"), player("bob"));
    await setDoc(doc(db, "admins", "admin"), { createdAt: null });
    await setDoc(doc(db, "players", "alice", "inventory", "sword"), { itemId: "sword", quantity: 1, rarity: "rare", equipped: false, equippedSlot: null });
    await setDoc(doc(db, "players", "alice", "notifications", "notice"), { read: false, readAt: null, title: "Quest", message: "Assigned" });
  });
});

after(async () => env.cleanup());
const dbFor = (uid) => env.authenticatedContext(uid, { email: `${uid}@grpg.local` }).firestore();

describe("private player data", () => {
  it("allows own read and denies another player and anonymous access", async () => {
    await assertSucceeds(getDoc(doc(dbFor("alice"), "players", "alice")));
    await assertFails(getDoc(doc(dbFor("alice"), "players", "bob")));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), "players", "alice")));
  });

  it("does not allow privilege or progression escalation", async () => {
    await assertFails(setDoc(doc(dbFor("alice"), "admins", "alice"), {}));
    await assertFails(updateDoc(doc(dbFor("alice"), "players", "alice"), { level: 99 }));
  });

  it("does not allow self-granted inventory", async () => {
    await assertFails(setDoc(doc(dbFor("alice"), "players", "alice", "inventory", "gift"), { itemId: "gift", quantity: 99 }));
  });
});

describe("character creation", () => {
  it("accepts a canonical fixed race/class combination", async () => {
    await assertSucceeds(updateDoc(doc(dbFor("alice"), "players", "alice"), {
      displayName: "Alice",
      raceId: "dwarf",
      classId: "mage",
      stats: { str: 11, agi: 10, vit: 12, int: 14, dex: 10, luk: 10 },
      hp: 128,
      maxHp: 128,
      mp: 100,
      maxMp: 100,
      characterCreated: true,
      updatedAt: null,
    }));
  });

  it("accepts Human bonuses only as +1 on two different attributes", async () => {
    await assertSucceeds(updateDoc(doc(dbFor("bob"), "players", "bob"), {
      displayName: "Bob",
      raceId: "human",
      classId: "warrior",
      stats: { str: 13, agi: 10, vit: 12, int: 10, dex: 11, luk: 11 },
      hp: 128,
      maxHp: 128,
      mp: 80,
      maxMp: 80,
      characterCreated: true,
      updatedAt: null,
    }));
  });

  it("rejects forged stats, progression fields and invalid Human allocation", async () => {
    const alice = doc(dbFor("alice"), "players", "alice");
    await assertFails(updateDoc(alice, {
      displayName: "Alice",
      raceId: "dwarf",
      classId: "mage",
      stats: { str: 99, agi: 10, vit: 12, int: 14, dex: 10, luk: 10 },
      hp: 128,
      maxHp: 128,
      mp: 100,
      maxMp: 100,
      characterCreated: true,
    }));
    await assertFails(updateDoc(alice, { level: 2, xp: 10 }));

    const bob = doc(dbFor("bob"), "players", "bob");
    await assertFails(updateDoc(bob, {
      displayName: "Bob",
      raceId: "human",
      classId: "warrior",
      stats: { str: 15, agi: 10, vit: 12, int: 10, dex: 10, luk: 10 },
      hp: 128,
      maxHp: 128,
      mp: 80,
      maxMp: 80,
      characterCreated: true,
    }));
  });

  it("does not allow character creation to run twice", async () => {
    const ref = doc(dbFor("alice"), "players", "alice");
    await assertSucceeds(updateDoc(ref, {
      displayName: "Alice",
      raceId: "dwarf",
      classId: "mage",
      stats: { str: 11, agi: 10, vit: 12, int: 14, dex: 10, luk: 10 },
      hp: 128,
      maxHp: 128,
      mp: 100,
      maxMp: 100,
      characterCreated: true,
    }));
    await assertFails(updateDoc(ref, { displayName: "Rewritten" }));
  });
});

describe("requests and notifications", () => {
  it("allows an owned pending request but only admin review", async () => {
    const request = doc(dbFor("alice"), "itemRequests", "request-1");
    await assertSucceeds(setDoc(request, { requesterUid: "alice", requestedItemId: null, requestedName: "Rope", notes: "", status: "pending", createdAt: null, reviewedAt: null, reviewedBy: null, rejectionReason: null }));
    await assertFails(updateDoc(request, { status: "approved", reviewedBy: "alice" }));
    await assertSucceeds(updateDoc(doc(dbFor("admin"), "itemRequests", "request-1"), { status: "approved", reviewedBy: "admin" }));
  });

  it("allows read-state only on an owned notification", async () => {
    const notice = doc(dbFor("alice"), "players", "alice", "notifications", "notice");
    await assertSucceeds(updateDoc(notice, { read: true, readAt: null }));
    await assertFails(updateDoc(notice, { message: "Forged" }));
  });
});
