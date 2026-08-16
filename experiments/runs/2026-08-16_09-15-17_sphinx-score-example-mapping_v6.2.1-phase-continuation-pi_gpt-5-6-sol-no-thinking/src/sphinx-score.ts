export interface Card {
  monster: string;
  rank?: number;
}

export function scoreSphinxes(army: readonly Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === "sphinx").length;
  if (sphinxCount === 0) return 0;
  const distinctMonsterTypes = new Set(army.map((card) => card.monster));
  const visibleMonsterTypeCount = distinctMonsterTypes.size - (sphinxCount === 1 ? 1 : 0);
  const visibleTypeScore = visibleMonsterTypeCount > 3 ? 2 * (visibleMonsterTypeCount - 3) : 1;
  return (1 + visibleTypeScore) * sphinxCount;
}
