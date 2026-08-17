export interface Card {
  monster: string;
  rank?: number;
}

const FALLBACK_POINTS = 2;
const BASE_POINTS = 1;
const POINTS_PER_EXTRA_TYPE = 2;
const TYPES_BEFORE_BONUS = 3;
const SPHINX = "sphinx";

export function scoreSphinxes(army: readonly Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === SPHINX).length;
  const otherTypes = new Set(
    army.filter((card) => card.monster !== SPHINX).map((card) => card.monster),
  );
  const anotherSphinxType = sphinxCount > 1 ? 1 : 0;
  const visibleTypeCount = otherTypes.size + anotherSphinxType;
  const pointsPerSphinx = visibleTypeCount > TYPES_BEFORE_BONUS
    ? BASE_POINTS + POINTS_PER_EXTRA_TYPE * (visibleTypeCount - TYPES_BEFORE_BONUS)
    : FALLBACK_POINTS;
  return sphinxCount * pointsPerSphinx;
}
