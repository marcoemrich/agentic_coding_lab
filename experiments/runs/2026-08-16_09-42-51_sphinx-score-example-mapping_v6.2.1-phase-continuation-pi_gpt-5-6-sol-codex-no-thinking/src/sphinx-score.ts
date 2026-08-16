export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

const RANK_TWO = 2;
const RANK_THREE = 3;

export interface Card {
  monster: Monster;
  rank?: 1 | typeof RANK_TWO | typeof RANK_THREE;
}

const MINIMUM_POINTS_PER_SPHINX = 2;
const BONUS_TYPE_COUNT_THRESHOLD = 4;
const BONUS_POINTS_PER_ADDITIONAL_TYPE = 2;

export const scoreSphinxes = (army: readonly Card[]): number => {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  const distinctMonsterTypeCount = new Set(army.map(({ monster }) => monster)).size;
  const scoringTypeCount = distinctMonsterTypeCount + Math.max(0, sphinxCount - 1);
  const pointsPerSphinx = scoringTypeCount > BONUS_TYPE_COUNT_THRESHOLD
    ? 1 + BONUS_POINTS_PER_ADDITIONAL_TYPE * (scoringTypeCount - BONUS_TYPE_COUNT_THRESHOLD)
    : MINIMUM_POINTS_PER_SPHINX;

  return sphinxCount * pointsPerSphinx;
};
