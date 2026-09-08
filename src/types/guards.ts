import type { Player, Stats } from "./domain";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isNullableString = (value: unknown): value is string | null => value === null || typeof value === "string";
const isStats = (value: unknown): value is Stats => isRecord(value) && ["str", "agi", "vit", "int", "dex", "luk"].every((key) => {
  const stat = value[key];
  return typeof stat === "number" && Number.isFinite(stat);
});

export function isPlayer(value: unknown): value is Omit<Player, "uid"> {
  if (!isRecord(value)) return false;
  return typeof value.playerId === "string" && isNullableString(value.displayName) &&
    typeof value.characterCreated === "boolean" && isNullableString(value.raceId) &&
    isNullableString(value.classId) && Number.isInteger(value.level) && Number.isFinite(value.xp) &&
    Number.isFinite(value.hp) && Number.isFinite(value.maxHp) && Number.isFinite(value.mp) &&
    Number.isFinite(value.maxMp) && isStats(value.stats) && Number.isInteger(value.schemaVersion);
}
