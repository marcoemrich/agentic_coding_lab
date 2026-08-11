export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

/** The Sphinx card: "1 point. 2 per type beyond three, else 1." */
const BASE_POINTS = 1;
const FREE_TYPES = 3;
const POINTS_PER_TYPE_BEYOND_FREE = 2;
const POINTS_WITHIN_FREE_TYPES = 1;

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

const typeBonus = (distinctTypes: number): number =>
  distinctTypes > FREE_TYPES
    ? POINTS_PER_TYPE_BEYOND_FREE * (distinctTypes - FREE_TYPES)
    : POINTS_WITHIN_FREE_TYPES;

/**
 * Each Sphinx surveys the types around it — every card in the army but itself.
 * Exclusion is positional, not by identity: an army may hold the same card
 * object in two slots, and each occupant must still see the other.
 */
const cardsSurrounding = (army: Card[], sphinxIndex: number): Card[] =>
  army.filter((_, index) => index !== sphinxIndex);

const scoreSphinxAt = (army: Card[], sphinxIndex: number): number =>
  BASE_POINTS +
  typeBonus(countDistinctTypes(cardsSurrounding(army, sphinxIndex)));

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card) ? total + scoreSphinxAt(army, index) : total,
    0,
  );
