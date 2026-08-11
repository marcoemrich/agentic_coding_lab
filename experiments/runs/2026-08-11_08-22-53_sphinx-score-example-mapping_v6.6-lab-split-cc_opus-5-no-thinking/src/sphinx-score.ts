export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const SPHINX_POINT = 1;
const THREE_TYPES = 3;
const POINTS_PER_TYPE_BEYOND_THREE = 2;
const POINTS_WITHIN_THREE_TYPES = 1;

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

const scoreTypeVariety = (typeCount: number): number =>
  typeCount > THREE_TYPES
    ? POINTS_PER_TYPE_BEYOND_THREE * (typeCount - THREE_TYPES)
    : POINTS_WITHIN_THREE_TYPES;

// A Sphinx looks out at the rest of the army: every card except the one it is
// standing on. Its own card is dropped by position, not by type — the other
// cards of that same type stay, and can still make up a type it sees.
const armySeenBySphinxAt = (army: Card[], index: number): Card[] => [
  ...army.slice(0, index),
  ...army.slice(index + 1),
];

const scoreSphinxAt = (army: Card[], index: number): number =>
  SPHINX_POINT +
  scoreTypeVariety(countDistinctTypes(armySeenBySphinxAt(army, index)));

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card) ? total + scoreSphinxAt(army, index) : total,
    0,
  );
