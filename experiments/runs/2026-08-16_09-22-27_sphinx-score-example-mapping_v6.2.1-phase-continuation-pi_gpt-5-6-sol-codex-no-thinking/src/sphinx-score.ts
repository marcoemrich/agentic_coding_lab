export interface Card {
  monster: string;
  rank?: number;
}

export function scoreSphinxes(army: readonly Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === "sphinx").length;
  const otherMonsterTypeCount = new Set(
    army
      .filter((card) => card.monster !== "sphinx")
      .map((card) => card.monster),
  ).size;
  const typesSeenByEachSphinx = otherMonsterTypeCount + (sphinxCount > 1 ? 1 : 0);
  const monsterVarietyPoints = typesSeenByEachSphinx > 3
    ? 2 * (typesSeenByEachSphinx - 3)
    : 1;

  return sphinxCount * (1 + monsterVarietyPoints);
}
