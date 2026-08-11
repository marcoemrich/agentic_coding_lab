export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";
const FREE_TYPES = 3;
const SCORE_WITHIN_FREE_TYPES = 2;
const SCORE_BEYOND_FREE_TYPES = 1;
const POINTS_PER_EXTRA_TYPE = 2;

const countTypesSeenBySphinx = (army: Card[], sphinxIndex: number): number =>
  new Set(
    army
      .filter((_card, index) => index !== sphinxIndex)
      .map((card) => card.monster),
  ).size;

const scoreSphinx = (army: Card[], sphinxIndex: number): number => {
  const typeCount = countTypesSeenBySphinx(army, sphinxIndex);
  if (typeCount <= FREE_TYPES) return SCORE_WITHIN_FREE_TYPES;

  const extraTypes = typeCount - FREE_TYPES;
  return SCORE_BEYOND_FREE_TYPES + POINTS_PER_EXTRA_TYPE * extraTypes;
};

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      card.monster === SPHINX ? total + scoreSphinx(army, index) : total,
    0,
  );
