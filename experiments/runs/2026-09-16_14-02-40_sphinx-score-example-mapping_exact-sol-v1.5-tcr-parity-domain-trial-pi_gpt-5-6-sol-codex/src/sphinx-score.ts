interface Card {
  monster: string;
  rank?: 1 | 2 | 3; // eslint-disable-line no-magic-numbers -- normative ranks
}

const LOW_TYPE_SPHINX_SCORE = 2;
const BASE_SPHINX_POINTS = 1;
const TYPES_BEFORE_BONUS = 3;
const POINTS_PER_ADDITIONAL_TYPE = 2;

function isSphinx(card: Card): boolean {
  return card.monster === "sphinx";
}

function monsterTypeCount(army: readonly Card[]): number {
  return new Set(army.map(({ monster }) => monster)).size;
}

function typeCountSeenByEachSphinx(
  army: readonly Card[],
  sphinxCount: number,
): number {
  const observingSphinxIsOnlySphinx = sphinxCount === 1;
  return monsterTypeCount(army) - (observingSphinxIsOnlySphinx ? 1 : 0);
}

function scorePerSphinx(typeCount: number): number {
  return typeCount <= TYPES_BEFORE_BONUS
    ? LOW_TYPE_SPHINX_SCORE
    : BASE_SPHINX_POINTS +
        (typeCount - TYPES_BEFORE_BONUS) * POINTS_PER_ADDITIONAL_TYPE;
}

export function sphinxScore(army: readonly Card[]): number {
  const sphinxCount = army.filter(isSphinx).length;
  return (
    sphinxCount * scorePerSphinx(typeCountSeenByEachSphinx(army, sphinxCount))
  );
}
