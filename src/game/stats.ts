import type { Stats } from "../types/domain.ts";
import type { GameClass } from "./classes.ts";
import { BASE_HP, BASE_MP, BASE_STATS, HP_PER_VIT, MP_PER_INT } from "./constants.ts";
import type { Race } from "./races.ts";

export const STAT_KEYS = ["str", "agi", "vit", "int", "dex", "luk"] as const satisfies readonly (keyof Stats)[];

export function createFlexibleBonus(selections: readonly (keyof Stats)[], points: number): Partial<Stats> {
  if (selections.length !== points || new Set(selections).size !== selections.length) {
    throw new Error("INVALID_FLEXIBLE_STATS");
  }
  return selections.reduce<Partial<Stats>>((bonus, key) => {
    bonus[key] = 1;
    return bonus;
  }, {});
}

export function calculateStats(race: Race, gameClass: GameClass, flexible: Partial<Stats> = {}): Stats {
  return STAT_KEYS.reduce<Stats>((stats, key) => {
    stats[key] = BASE_STATS[key] + (race.bonuses[key] ?? 0) + (gameClass.bonuses[key] ?? 0) + (flexible[key] ?? 0);
    return stats;
  }, { ...BASE_STATS });
}

export const calculateMaxHp = (stats: Stats): number => BASE_HP + stats.vit * HP_PER_VIT;
export const calculateMaxMp = (stats: Stats): number => BASE_MP + stats.int * MP_PER_INT;
