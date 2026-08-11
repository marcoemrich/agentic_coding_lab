export type Card = {
  monster: string;
  rank?: number;
};

const DIVERSITY_THRESHOLD = 3;
const POINTS_PER_SPHINX = 1;
const POINTS_PER_SPHINX_WHEN_DIVERSE = 2;

const countSphinxes = (army: Card[]): number =>
  army.filter((card) => card.monster === "sphinx").length;

// A monster type is its name plus its rank: Undead Warriors of different
// ranks are different types, while same-rank ones are the same type.
const monsterTypeOf = (card: Card): string => `${card.monster}-${card.rank}`;

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map(monsterTypeOf)).size;

export const scoreArmy = (army: Card[]): number => {
  const isDiverse = countDistinctTypes(army) > DIVERSITY_THRESHOLD;
  const pointsPerSphinx = isDiverse ? POINTS_PER_SPHINX_WHEN_DIVERSE : POINTS_PER_SPHINX;
  return countSphinxes(army) * pointsPerSphinx;
};
