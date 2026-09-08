import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { PLAYER_SCHEMA_VERSION } from "../../../game/constants";
import { isPlayer } from "../../../types/guards";
import type { Player, Stats } from "../../../types/domain";
import { db } from "../app";

const EMPTY_STATS: Stats = { str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 };
export class PlayerRepository {
  async get(uid: string): Promise<Player | null> {
    const snapshot = await getDoc(doc(db, "players", uid));
    if (!snapshot.exists()) return null;
    const data: unknown = snapshot.data();
    if (!isPlayer(data)) throw new Error("INVALID_PLAYER_DOCUMENT");
    return { uid, ...data };
  }
  async ensureInitial(uid: string, playerId: string): Promise<Player> {
    const existing = await this.get(uid);
    if (existing) return existing;
    await setDoc(doc(db, "players", uid), {
      playerId, displayName: null, characterCreated: false, raceId: null, classId: null,
      level: 1, xp: 0, hp: 0, maxHp: 0, mp: 0, maxMp: 0, condition: "stable",
      locationId: null, regionId: null, zoneType: "safe", guildId: null, partyId: null,
      activeTitleId: null, avatarUrl: null, appearance: {}, stats: EMPTY_STATS,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(), schemaVersion: PLAYER_SCHEMA_VERSION,
    });
    const player = await this.get(uid);
    if (!player) throw new Error("PLAYER_RECOVERY_FAILED");
    return player;
  }
  async completeCharacter(uid: string, input: { displayName: string; raceId: string; classId: string; stats: Stats; maxHp: number; maxMp: number }): Promise<void> {
    await updateDoc(doc(db, "players", uid), { ...input, hp: input.maxHp, mp: input.maxMp, characterCreated: true, updatedAt: serverTimestamp() });
  }
}
export const playerRepository = new PlayerRepository();
