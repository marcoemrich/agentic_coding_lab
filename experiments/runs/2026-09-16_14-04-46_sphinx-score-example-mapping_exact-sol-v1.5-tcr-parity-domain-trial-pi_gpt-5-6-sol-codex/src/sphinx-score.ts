const PRINTED_SCORE = 1;
const POINTS_PER_TYPE_BEYOND_THREE = 2;
const SINGLE_SPHINX_THRESHOLD_TYPE_COUNT = 4;

export interface Card {
  monster: string;
  rank?: number;
}

function countSphinxes(army: Card[]): number {
  return army.filter((card) => card.monster === "sphinx").length;
}

function countMonsterTypes(army: Card[]): number {
  return new Set(army.map((card) => card.monster)).size;
}

function countTypesVisibleToEachSphinx(army: Card[], sphinxCount: number): number {
  const anotherSphinxType = sphinxCount > 1 ? 1 : 0;
  return countMonsterTypes(army) + anotherSphinxType;
}

function scoreSingleSphinx(typeCount: number): number {
  const typesBeyondThree = typeCount - SINGLE_SPHINX_THRESHOLD_TYPE_COUNT;
  const typeScore = Math.max(PRINTED_SCORE, typesBeyondThree * POINTS_PER_TYPE_BEYOND_THREE);
  return PRINTED_SCORE + typeScore;
}

export function scoreSphinxes(army: Card[]): number {
  const sphinxCount = countSphinxes(army);
  if (sphinxCount === 0) {
    return 0;
  }

  const visibleTypeCount = countTypesVisibleToEachSphinx(army, sphinxCount);
  return sphinxCount * scoreSingleSphinx(visibleTypeCount);
}
