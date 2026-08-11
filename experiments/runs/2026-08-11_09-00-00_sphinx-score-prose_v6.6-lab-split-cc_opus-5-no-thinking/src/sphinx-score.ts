export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const countSphinxes = (army: Card[]): number =>
  army.filter((card) => card.monster === SPHINX).length;

const RANKLESS = "no-rank";

const typeKeyOf = (card: Card): string =>
  `${card.monster}:${card.rank ?? RANKLESS}`;

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map(typeKeyOf)).size;

const TYPE_BONUS_THRESHOLD = 3;
const BASE_POINTS_PER_TYPE = 1;
const BONUS_POINTS_PER_TYPE = 2;

const pointsPerType = (typeCount: number): number =>
  typeCount > TYPE_BONUS_THRESHOLD ? BONUS_POINTS_PER_TYPE : BASE_POINTS_PER_TYPE;

export const scoreArmy = (army: Card[]): number => {
  const typeCount = countDistinctTypes(army);
  return countSphinxes(army) * typeCount * pointsPerType(typeCount);
};
