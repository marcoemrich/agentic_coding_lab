export type Card = {
  monster: string;
  rank?: number;
};

const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const typeOf = (card: Card): string => `${card.monster}:${card.rank}`;

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map(typeOf)).size;

const pointsPerSphinxFor = (typeCount: number): number =>
  typeCount > TYPE_THRESHOLD
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * (typeCount - TYPE_THRESHOLD)
    : 1;

export const scoreArmy = (army: Card[]): number =>
  army.filter(isSphinx).length * pointsPerSphinxFor(countDistinctTypes(army));
