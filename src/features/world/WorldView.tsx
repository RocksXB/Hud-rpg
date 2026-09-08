import type { Player } from "../../types/domain";
export function WorldView({ player }: { player: Player }) {
  return <section className="world-view" aria-labelledby="world-title"><div className="world-atmosphere" aria-hidden="true"/><div className="world-copy"><p className="kicker">{player.regionId ?? "REGION UNCHARTED"} // {player.zoneType.toUpperCase()} ZONE</p><h1 id="world-title">{player.locationId ?? "The threshold"}</h1><p>O mundo aguarda além da interface.</p></div><aside className="vitals" aria-label="Estado vital"><div><span>HP</span><progress value={player.hp} max={player.maxHp || 1}/><strong>{player.hp}/{player.maxHp}</strong></div><div><span>MP</span><progress value={player.mp} max={player.maxMp || 1}/><strong>{player.mp}/{player.maxMp}</strong></div></aside></section>;
}
