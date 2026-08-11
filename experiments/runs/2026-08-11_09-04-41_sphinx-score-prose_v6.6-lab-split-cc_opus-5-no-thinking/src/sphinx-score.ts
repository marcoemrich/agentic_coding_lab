export interface Card {
  monster: string;
  rank?: number;
}

const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;
const BASE_POINTS = 1;

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

// Undead Warriors of different ranks are different types; every other
// monster has a single variant, so its rank is absent and all its cards
// share one key.
const typeIdentityOf = (card: Card): string => `${card.monster}/${card.rank}`;

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map(typeIdentityOf)).size;

const pointsForEachSphinx = (distinctTypes: number): number => {
  const typesBeyondThreshold = distinctTypes - TYPE_THRESHOLD;
  return typesBeyondThreshold > 0
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * typesBeyondThreshold
    : BASE_POINTS;
};

export const scoreArmy = (army: Card[]): number =>
  army.filter(isSphinx).length *
  pointsForEachSphinx(countDistinctTypes(army));
