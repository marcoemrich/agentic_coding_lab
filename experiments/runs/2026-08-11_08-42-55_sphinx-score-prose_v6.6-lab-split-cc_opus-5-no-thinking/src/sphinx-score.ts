export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";
const FREE_TYPES = 3;
const POINTS_PER_EXTRA_TYPE = 2;
const BASE_POINTS = 1;

// Opaque identity key: two cards are the same monster type when their keys
// match. Rank is part of the identity, so ranked variants count separately.
const monsterTypeKey = (card: Card): string => `${card.monster}-${card.rank}`;

export const scoreArmy = (army: Card[]): number => {
  const distinctTypeCount = new Set(army.map(monsterTypeKey)).size;
  const typesBeyondFree = distinctTypeCount - FREE_TYPES;
  const pointsPerSphinx = Math.max(BASE_POINTS, POINTS_PER_EXTRA_TYPE * typesBeyondFree);
  const sphinxCount = army.filter((card) => card.monster === SPHINX).length;
  return sphinxCount * pointsPerSphinx;
};
