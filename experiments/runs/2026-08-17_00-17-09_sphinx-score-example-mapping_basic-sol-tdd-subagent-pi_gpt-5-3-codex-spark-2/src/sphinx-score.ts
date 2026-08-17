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

const SPHINX_MONSTER: Monster = "sphinx";
const SPHINX_BASE_POINT = 1;
const MINIMUM_TYPE_BONUS = 1;
const POINTS_PER_EXCESS_TYPE = 2;
const MAX_TYPES_FOR_BASE_SCORE = 3;

export function scoreSphinxes(army: Card[]): number {
  let sphinxCount = 0;
  const distinctNonSphinxTypes = new Set<Monster>();

  for (const { monster } of army) {
    if (monster === SPHINX_MONSTER) {
      sphinxCount += 1;
    } else {
      distinctNonSphinxTypes.add(monster);
    }
  }

  if (sphinxCount === 0) {
    return 0;
  }

  const sphinxCountsAsType = sphinxCount > 1 ? 1 : 0;
  const scoringTypeCount =
    distinctNonSphinxTypes.size + sphinxCountsAsType;

  const scorePerSphinx =
    SPHINX_BASE_POINT
    + Math.max(
      MINIMUM_TYPE_BONUS,
      (scoringTypeCount - MAX_TYPES_FOR_BASE_SCORE) * POINTS_PER_EXCESS_TYPE,
    );

  return sphinxCount * scorePerSphinx;
}
