export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export type ArmyCard = {
  monster: Monster;
  rank?: number;
};

export type ArmyInput = {
  army: ArmyCard[];
};

const SPHINX_MONSTER = "sphinx";
const BASE_SPHINX_POINTS = 1;
const MINIMUM_POINTS_PER_SPHINX = BASE_SPHINX_POINTS + 1;
const BONUS_THRESHOLD_TYPE_COUNT = 3;
const BONUS_POINTS_PER_EXTRA_TYPE = 2;

export function calculateSphinxScore(input: ArmyInput): number {
  const { sphinxCount, distinctOtherMonsterTypes } =
    countSphinxAndDistinctOtherMonsterTypes(input.army);

  if (sphinxCount === 0) {
    return 0;
  }

  const distinctMonsterTypeCountForSphinxScoring =
    distinctOtherMonsterTypes + (sphinxCount - 1);
  const pointsPerSphinx = getPointsPerSphinx(
    distinctMonsterTypeCountForSphinxScoring,
  );

  return sphinxCount * pointsPerSphinx;
}

function countSphinxAndDistinctOtherMonsterTypes(army: readonly ArmyCard[]): {
  sphinxCount: number;
  distinctOtherMonsterTypes: number;
} {
  let sphinxCount = 0;
  const otherMonsterTypes = new Set<Monster>();

  for (const card of army) {
    if (card.monster === SPHINX_MONSTER) {
      sphinxCount += 1;
      continue;
    }
    otherMonsterTypes.add(card.monster);
  }

  return {
    sphinxCount,
    distinctOtherMonsterTypes: otherMonsterTypes.size,
  };
}

function getPointsPerSphinx(sphinxScoringTypeCount: number): number {
  if (sphinxScoringTypeCount <= BONUS_THRESHOLD_TYPE_COUNT) {
    return MINIMUM_POINTS_PER_SPHINX;
  }

  const extraMonsterTypes =
    sphinxScoringTypeCount - BONUS_THRESHOLD_TYPE_COUNT;
  return BASE_SPHINX_POINTS + extraMonsterTypes * BONUS_POINTS_PER_EXTRA_TYPE;
}