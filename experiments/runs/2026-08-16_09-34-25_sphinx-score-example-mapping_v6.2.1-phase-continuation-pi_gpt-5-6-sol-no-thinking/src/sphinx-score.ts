export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export interface Card {
  monster: Monster;
  rank?: 1 | 2 | 3;
}

const isSphinxCard = ({ monster }: Card): boolean => monster === "sphinx";

const scorePerSphinxFor = (visibleTypeCount: number): number =>
  1 + (visibleTypeCount > 3 ? 2 * (visibleTypeCount - 3) : 1);

export const scoreSphinxes = (army: Card[]): number => {
  const sphinxCount = army.filter(isSphinxCard).length;
  if (sphinxCount === 0) return 0;

  const distinctMonsterTypeCount = new Set(army.map(({ monster }) => monster)).size;
  const visibleTypeCount = distinctMonsterTypeCount - (sphinxCount === 1 ? 1 : 0);
  return sphinxCount * scorePerSphinxFor(visibleTypeCount);
};
