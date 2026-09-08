import type { Stats } from "../types/domain";
export interface GameClass { id: string; name: string; role: string; bonuses: Partial<Stats> }
const entry = (id: string, name: string, role: string, bonuses: Partial<Stats>): GameClass => ({ id, name, role, bonuses });
export const CLASSES: readonly GameClass[] = [
  entry("warrior", "Guerreiro", "Vanguarda", { str: 2 }), entry("guardian", "Guardião", "Defesa", { vit: 2 }),
  entry("rogue", "Ladino", "Infiltração", { agi: 1, dex: 1 }), entry("archer", "Arqueiro", "Precisão", { dex: 2 }),
  entry("lancer", "Lanceiro", "Alcance", { str: 1, dex: 1 }), entry("fighter", "Lutador", "Combate", { str: 1, agi: 1 }),
  entry("mage", "Mago", "Arcano", { int: 2 }), entry("sorcerer", "Feiticeiro", "Canalização", { int: 1, luk: 1 }),
  entry("warlock", "Bruxo", "Pactos", { int: 2 }), entry("acolyte", "Acólito", "Suporte", { vit: 1, int: 1 }),
  entry("priest", "Sacerdote", "Restauração", { int: 2 }), entry("naturalist", "Naturalista", "Natureza", { int: 1, vit: 1 }),
  entry("ranger", "Patrulheiro", "Exploração", { agi: 1, dex: 1 }), entry("artificer", "Artífice", "Criação", { int: 1, dex: 1 }),
  entry("prophet", "Profeta", "Visão", { int: 1, luk: 1 }), entry("oracle", "Oráculo", "Presságio", { int: 1, luk: 1 }),
  entry("strategist", "Estrategista", "Comando", { int: 1, dex: 1 }), entry("observer", "Observador", "Análise", { dex: 2 }),
  entry("dancer", "Dançarino", "Ritmo", { agi: 2 }), entry("puppeteer", "Marionetista", "Controle", { dex: 1, int: 1 }),
  entry("gambler", "Apostador", "Fortuna", { luk: 2 }), entry("wanderer", "Andarilho", "Versatilidade", { agi: 1, luk: 1 }),
] as const;
