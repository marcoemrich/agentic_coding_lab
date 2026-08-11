export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

// A card's type is its monster name alone: rank distinguishes cards, not types,
// so Undead Warrior ranks 1 and 3 are two cards of a single type.
const monsterTypeOf = (card: Card): string => card.monster;

const countDistinctMonsterTypes = (army: Card[]): number =>
  new Set(army.map(monsterTypeOf)).size;

const BASE_POINTS_PER_SPHINX = 2;

// Ordered from the most demanding requirement down, so the first entry whose
// requirement is satisfied is also the highest-scoring one available.
const POINT_TIERS: ReadonlyArray<{
  atLeastTypes: number;
  points: number;
}> = [
  { atLeastTypes: 6, points: 5 },
  { atLeastTypes: 4, points: 3 },
];

const pointsPerSphinx = (distinctTypes: number): number =>
  POINT_TIERS.find(({ atLeastTypes }) => distinctTypes >= atLeastTypes)
    ?.points ?? BASE_POINTS_PER_SPHINX;

const countSphinxes = (army: Card[]): number => army.filter(isSphinx).length;

export const scoreArmy = (army: Card[]): number =>
  countSphinxes(army) * pointsPerSphinx(countDistinctMonsterTypes(army));
