const PATTERN = /^[a-z0-9](?:[a-z0-9._-]{1,30}[a-z0-9])?$/;
export function normalizePlayerId(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!PATTERN.test(normalized)) throw new TypeError("INVALID_PLAYER_ID");
  return normalized;
}
export const playerIdToInternalEmail = (value: string): string => `${normalizePlayerId(value)}@grpg.local`;
export function playerIdFromInternalEmail(email: string | null): string | null {
  return email?.endsWith("@grpg.local") ? email.slice(0, -"@grpg.local".length) : null;
}
