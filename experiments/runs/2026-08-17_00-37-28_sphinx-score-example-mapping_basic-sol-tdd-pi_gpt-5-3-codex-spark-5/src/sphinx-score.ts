export type MonsterName =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export interface MonsterCard {
  monster: MonsterName;
  rank?: number;
}

export interface ArmyInput {
  army: readonly MonsterCard[];
}

export interface SphinxScoringResult {
  score: number;
}

const SCORE_WITHOUT_ANY_SPHINX = 0;
const NO_BONUS_TYPE_LIMIT = 2;
const BONUS_START_TYPE_INDEX = 3;
const BONUS_MULTIPLIER = 2;
const SPHINX_BASE_POINTS = 2;
const SPHINX_BONUS_BASE_POINTS = 1;
const SPHINX_MINIMUM_BONUS_TYPES = 1;

export const calculateSphinxScore = (input: ArmyInput): number => {
  const sphinxCount = input.army.filter((card) => card.monster === "sphinx").length;

  if (sphinxCount === SCORE_WITHOUT_ANY_SPHINX) {
    return SCORE_WITHOUT_ANY_SPHINX;
  }

  const otherTypeCount = new Set(
    input.army.filter((card) => card.monster !== "sphinx").map((card) => card.monster),
  ).size;

  if (otherTypeCount <= NO_BONUS_TYPE_LIMIT) {
    return sphinxCount * SPHINX_BASE_POINTS;
  }

  const bonusTypeCount = Math.max(
    SPHINX_MINIMUM_BONUS_TYPES,
    otherTypeCount - BONUS_START_TYPE_INDEX,
  );
  return sphinxCount *
    (SPHINX_BONUS_BASE_POINTS + BONUS_MULTIPLIER * bonusTypeCount);
};

export const calculateSphinxScoringResult = (input: ArmyInput): SphinxScoringResult => ({
  score: calculateSphinxScore(input),
});
