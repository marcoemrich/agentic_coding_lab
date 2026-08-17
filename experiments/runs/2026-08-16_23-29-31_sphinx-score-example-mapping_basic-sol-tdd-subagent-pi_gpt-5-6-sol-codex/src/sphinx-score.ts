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
  // Schema-defined rank values are intentionally expressed as literals.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const MINIMUM_SCORE_PER_SPHINX = 2;
const BASE_POINTS_PER_SPHINX = 1;
const POINTS_PER_EXTRA_TYPE = 2;
const OTHER_TYPE_COUNT_BEFORE_EXTRA_POINTS = 3;

export function scoreSphinxes(army: Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  if (sphinxCount === 0) return 0;

  const otherMonsterTypeCount = new Set(
    army
      .map(({ monster }) => monster)
      .filter((monster) => monster !== "sphinx"),
  ).size;
  const supportingCardCountPerSphinx = otherMonsterTypeCount + sphinxCount - 1;
  if (supportingCardCountPerSphinx <= OTHER_TYPE_COUNT_BEFORE_EXTRA_POINTS) {
    return sphinxCount * MINIMUM_SCORE_PER_SPHINX;
  }

  return sphinxCount * (
    BASE_POINTS_PER_SPHINX
    + POINTS_PER_EXTRA_TYPE
      * (supportingCardCountPerSphinx - OTHER_TYPE_COUNT_BEFORE_EXTRA_POINTS)
  );
}
