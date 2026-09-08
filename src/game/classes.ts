import type { Stats } from "../types/domain";

export interface GameClass {
  id: string;
  name: string;
  role: string;
  bonuses: Partial<Stats>;
}

const entry = (id: string, name: string, role: string, bonuses: Partial<Stats>): GameClass => ({ id, name, role, bonuses });

export const CLASSES: readonly GameClass[] = [
  entry("warrior", "Guerreiro", "STR / VIT", { str: 3, vit: 2 }),
  entry("guardian", "Guardião", "VIT / STR", { vit: 3, str: 2 }),
  entry("rogue", "Ladino", "DEX / AGI", { dex: 3, agi: 2 }),
  entry("archer", "Arqueiro", "DEX / AGI", { dex: 3, agi: 2 }),
  entry("lancer", "Lanceiro", "STR / DEX", { str: 3, dex: 2 }),
  entry("fighter", "Lutador", "STR / AGI", { str: 3, agi: 2 }),
  entry("mage", "Mago", "INT", { int: 4 }),
  entry("sorcerer", "Feiticeiro", "INT / LUK", { int: 3, luk: 2 }),
  entry("warlock", "Bruxo", "INT / LUK", { int: 3, luk: 2 }),
  entry("acolyte", "Acólito", "INT / VIT", { int: 3, vit: 2 }),
  entry("priest", "Sacerdote", "INT / VIT", { int: 3, vit: 2 }),
  entry("naturalist", "Naturalista", "INT / LUK", { int: 3, luk: 2 }),
  entry("ranger", "Patrulheiro", "DEX / AGI", { dex: 3, agi: 2 }),
  entry("artificer", "Artífice", "DEX / INT", { dex: 3, int: 2 }),
  entry("prophet", "Profeta", "INT / LUK", { int: 3, luk: 2 }),
  entry("oracle", "Oráculo", "INT / LUK", { int: 3, luk: 2 }),
  entry("strategist", "Estrategista", "INT / DEX", { int: 3, dex: 2 }),
  entry("observer", "Observador", "DEX / INT", { dex: 3, int: 2 }),
  entry("dancer", "Dançarino", "AGI / DEX", { agi: 3, dex: 2 }),
  entry("puppeteer", "Marionetista", "DEX / INT", { dex: 3, int: 2 }),
  entry("gambler", "Apostador", "LUK / DEX", { luk: 3, dex: 2 }),
  entry("wanderer", "Andarilho", "Variável", { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 }),
] as const;
