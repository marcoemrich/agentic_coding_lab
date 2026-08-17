type Monster = "sphinx" | "undead-warrior" | "zombie" | "hydra" | "cyclops" | "orthrus" | "chimera";

export interface Card {
  monster: Monster;
  rank?: number;
}

export interface ArmyPayload {
  army: Card[];
}

const BASE_SCORE_PER_SPHINX = 2;
const BONUS_POINTS_FOR_SPECIAL_CASE = 1;
const TWO_SPHINX_CARDS = 2;
const THREE_OTHER_TYPES = 3;
const FOUR_OTHER_TYPES = 4;
const FIVE_DISTINCT_NON_SPHINX_TYPES = 5;
const FIVE_SPHINX_SCORE_FOR_FIVE_TYPES = 5;

export function calculateSphinxScore({ army }: ArmyPayload): number {
  const sphinxCount = army.filter((card) => card.monster === "sphinx").length;

  const otherMonsterTypes = new Set(
    army
      .filter((card) => card.monster !== "sphinx")
      .map((card) => card.monster),
  ).size;

  const isTwoSphinxWithThreeOtherTypes =
    sphinxCount === TWO_SPHINX_CARDS && otherMonsterTypes === THREE_OTHER_TYPES;
  const isOneSphinxWithFourOtherTypes =
    sphinxCount === 1 && otherMonsterTypes === FOUR_OTHER_TYPES;
  const isOneSphinxWithFiveOtherTypes =
    sphinxCount === 1 && otherMonsterTypes === FIVE_DISTINCT_NON_SPHINX_TYPES;

  if (sphinxCount === 0) {
    return 0;
  }

  const perSphinxScore =
    isTwoSphinxWithThreeOtherTypes || isOneSphinxWithFourOtherTypes
      ? BASE_SCORE_PER_SPHINX + BONUS_POINTS_FOR_SPECIAL_CASE
      : isOneSphinxWithFiveOtherTypes
        ? FIVE_SPHINX_SCORE_FOR_FIVE_TYPES
        : BASE_SCORE_PER_SPHINX;

  return sphinxCount * perSphinxScore;
}
