window.TCG = window.TCG || {};
window.TCG.BALANCE = {
  /* Base power — progressão clara Common < Rare < Epic < Legend */
  powerByRarity: { common: 10, rare: 17, epic: 26, legend: 38 },
  holoBonus: 3,              /* vantagem mecânica pequena (~poucos %) */
  specialEditionBonus: 4,
  rankBonus: {
    "Rank E": 0, "Rank D": 1, "Rank C": 2, "Rank B": 4,
    "Rank A": 6, "Rank S": 9, "Especial": 5, "Clandestino": 3, "Clandestina": 3
  },
  hpMult: 2.0,
  hpMin: 22,
  dmgMult: 1.0,
  legendDmgBonus: 2,
  critChanceHolo: 0.25,
  critMult: 1.5,
  championHpBonus: 8,
  guardReduce: 0.45,
  evadeChance: 0.4,
  aceHpBonusPct: 0.05,
  aceDmgBonusPct: 0.05,
  team2ResPct: 0.03,
  team3DmgPct: 0.05,
  team3StartEnergy: 1,
  traitProcCap: 0.2,
  maxLegend: 3,
  maxEpic: 4
};
