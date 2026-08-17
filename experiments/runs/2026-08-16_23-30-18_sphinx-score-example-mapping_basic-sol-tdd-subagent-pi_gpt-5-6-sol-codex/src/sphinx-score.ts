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
  // Rank literals are fixed by the normative input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const SPHINX_BASE_POINT = 1;
const MINIMUM_TYPE_BONUS = 1;
const POINTS_PER_EXCESS_TYPE = 2;
const MAX_VIEWED_TYPES_FOR_BASE_SCORE = 3;

export function scoreSphinxes(army: Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  if (sphinxCount === 0) return 0;

  const viewedMonsterTypes = new Set(
    army.filter(({ monster }) => monster !== "sphinx").map(({ monster }) => monster),
  );
  if (sphinxCount > 1) viewedMonsterTypes.add("sphinx");

  const excessTypePoints =
    (viewedMonsterTypes.size - MAX_VIEWED_TYPES_FOR_BASE_SCORE) * POINTS_PER_EXCESS_TYPE;
  const scorePerSphinx =
    SPHINX_BASE_POINT + Math.max(MINIMUM_TYPE_BONUS, excessTypePoints);
  return sphinxCount * scorePerSphinx;
}
