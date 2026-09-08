import type { Stats } from "../types/domain";

export interface Race {
  id: string;
  name: string;
  description: string;
  bonuses: Partial<Stats>;
  flexiblePoints?: number;
}

export const RACES: readonly Race[] = [
  { id: "human", name: "Humano", description: "Versátil e adaptável. Recebe +1 em quaisquer dois atributos diferentes à escolha.", bonuses: {}, flexiblePoints: 2 },
  { id: "elf", name: "Elfo", description: "Precisão e afinidade natural com artes arcanas.", bonuses: { dex: 2, int: 1 } },
  { id: "dwarf", name: "Anão", description: "Resistência excepcional e força de combate.", bonuses: { vit: 2, str: 1 } },
  { id: "orc", name: "Orc", description: "Poder físico bruto e presença intimidadora.", bonuses: { str: 2, vit: 1 } },
  { id: "beastfolk", name: "Beastfolk", description: "Sentidos aguçados e mobilidade superior.", bonuses: { agi: 2, dex: 1 } },
  { id: "draconian", name: "Draconiano", description: "Herança dracônica: força e vigor elevados.", bonuses: { str: 2, vit: 1 } },
  { id: "demon", name: "Demônio", description: "Afinidade com poder mágico e força sombria.", bonuses: { int: 2, str: 1 } },
  { id: "celestial", name: "Celestial", description: "Linhagem voltada a magia e proteção.", bonuses: { int: 2, vit: 1 } },
  { id: "fairy", name: "Fada", description: "Leveza, agilidade e conexão com o arcano.", bonuses: { agi: 2, int: 1 } },
  { id: "undead", name: "Morto-Vivo", description: "Corpo endurecido e afinidade com o oculto.", bonuses: { vit: 2, int: 1 } },
] as const;
