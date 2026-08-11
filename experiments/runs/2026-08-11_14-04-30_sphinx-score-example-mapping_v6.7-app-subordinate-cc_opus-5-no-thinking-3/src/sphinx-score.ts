export interface Card {
  monster: string;
  rank?: number;
}

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const TYPE_THRESHOLD = 3;
const POINTS_PER_SPHINX = 1;
const POINTS_WITHIN_THRESHOLD = 1;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

const otherCards = (army: Card[], index: number): Card[] =>
  army.filter((_card, position) => position !== index);

const countDistinctTypes = (cards: Card[]): number =>
  new Set(cards.map((card) => card.monster)).size;

const varietyPoints = (typeCount: number): number =>
  typeCount > TYPE_THRESHOLD
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * (typeCount - TYPE_THRESHOLD)
    : POINTS_WITHIN_THRESHOLD;

const scoreSphinxAt = (army: Card[], index: number): number =>
  POINTS_PER_SPHINX + varietyPoints(countDistinctTypes(otherCards(army, index)));

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card) ? total + scoreSphinxAt(army, index) : total,
    0,
  );
