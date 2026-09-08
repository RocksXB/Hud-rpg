import type { Player, SystemState } from "../../types/domain";
export function deriveSystemState(player: Player, menuOpen = false, eventActive = false): SystemState {
  if (menuOpen) return "SYSTEM";
  if (player.maxHp > 0 && player.hp / player.maxHp <= 0.2) return "CRITICAL";
  if (eventActive) return "EVENT";
  if (player.zoneType === "combat") return "COMBAT";
  return "NORMAL";
}
