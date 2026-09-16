export type Card = {
  monster: string;
  rank?: number;
};

const BELOW_THRESHOLD_SCORE = 2;
const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

function countMonsterTypes(army: Card[]): number {
  return new Set(army.map(({ monster }) => monster)).size;
}

function countTypesSeenByEachSphinx(army: Card[], sphinxCount: number): number {
  const ownTypeAdjustment = sphinxCount === 1 ? 1 : 0;
  return countMonsterTypes(army) - ownTypeAdjustment;
}

function countSphinxes(army: Card[]): number {
  return army.filter(({ monster }) => monster === "sphinx").length;
}

function scoreSphinxForOtherTypeCount(otherTypeCount: number): number {
  return otherTypeCount > TYPE_THRESHOLD
    ? 1 + (otherTypeCount - TYPE_THRESHOLD) * POINTS_PER_TYPE_BEYOND_THRESHOLD
    : BELOW_THRESHOLD_SCORE;
}

export function scoreSphinxes(army: Card[]): number {
  const sphinxCount = countSphinxes(army);
  if (sphinxCount === 0) {
    return 0;
  }

  const visibleTypeCount = countTypesSeenByEachSphinx(army, sphinxCount);
  return sphinxCount * scoreSphinxForOtherTypeCount(visibleTypeCount);
}
