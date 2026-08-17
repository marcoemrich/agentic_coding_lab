export interface ArmyCard {
  monster: string;
  rank?: number;
}

export interface ArmyInput {
  army: ArmyCard[];
}

const BASE_SCORE_WITHOUT_EXTRA_TYPES = 2;
const EXTRA_TYPE_THRESHOLD = 3;
const EXTRA_TYPE_POINT_INCREMENT = 2;

export function calculateSphinxScore(armyInput: ArmyInput): number {
  const sphinxCards = armyInput.army.filter((card) => card.monster === "sphinx");

  if (sphinxCards.length === 0) {
    return 0;
  }

  const nonSphinxMonsterTypes = new Set(
    armyInput.army
      .filter((card) => card.monster !== "sphinx")
      .map((card) => card.monster),
  );
  const distinctNonSphinxTypeCount = nonSphinxMonsterTypes.size;

  const pointsPerSphinx =
    distinctNonSphinxTypeCount > EXTRA_TYPE_THRESHOLD
      ? 1 + EXTRA_TYPE_POINT_INCREMENT * (distinctNonSphinxTypeCount - EXTRA_TYPE_THRESHOLD)
      : BASE_SCORE_WITHOUT_EXTRA_TYPES;

  return sphinxCards.length * pointsPerSphinx;
}
