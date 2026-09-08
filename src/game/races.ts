import type { Stats } from "../types/domain";
export interface Race { id: string; name: string; description: string; bonuses: Partial<Stats>; flexiblePoints?: number }
export const RACES: readonly Race[] = [
  { id: "human", name: "Humano", description: "Adaptável; distribui livremente dois pontos.", bonuses: {}, flexiblePoints: 2 },
  { id: "elf", name: "Elfo", description: "Sintonia aguçada com fluxos arcanos.", bonuses: { agi: 1, int: 1 } },
  { id: "dwarf", name: "Anão", description: "Constituição resistente e técnica precisa.", bonuses: { vit: 2 } },
  { id: "orc", name: "Orc", description: "Força frontal e vigor de combate.", bonuses: { str: 2 } },
  { id: "beastfolk", name: "Beastfolk", description: "Instinto e reflexos elevados.", bonuses: { agi: 1, dex: 1 } },
  { id: "draconian", name: "Draconiano", description: "Herança ancestral de grande potência.", bonuses: { str: 1, vit: 1 } },
  { id: "demon", name: "Demônio", description: "Vontade intensa e domínio instável.", bonuses: { int: 1, luk: 1 } },
  { id: "celestial", name: "Celestial", description: "Presença disciplinada e energia elevada.", bonuses: { int: 2 } },
  { id: "fairy", name: "Fada", description: "Agilidade etérea e afinidade mágica.", bonuses: { agi: 1, int: 1 } },
  { id: "undead", name: "Morto-Vivo", description: "Persistência além dos limites vitais.", bonuses: { vit: 1, luk: 1 } },
] as const;
