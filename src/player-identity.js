const PLAYER_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{1,30}[a-z0-9])?$/;
const INTERNAL_AUTH_DOMAIN = "grpg.local";

export function normalizePlayerId(playerId) {
  const normalized = playerId.trim().toLowerCase();

  if (!PLAYER_ID_PATTERN.test(normalized)) {
    throw new TypeError(
      "Player ID must contain 3-32 letters, numbers, dots, underscores or hyphens",
    );
  }

  return normalized;
}

/**
 * Authentication adapter only. UI code should speak in terms of Player ID and
 * Access Key, never display this implementation-specific email identifier.
 */
export function playerIdToInternalEmail(playerId) {
  return `${normalizePlayerId(playerId)}@${INTERNAL_AUTH_DOMAIN}`;
}
