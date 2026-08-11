export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

const countDistinctTypes = (cards: Card[]): number =>
  new Set(cards.map((card) => card.monster)).size;

const BASE_SCORE = 1;
const MINIMUM_BONUS = 1;
const POINTS_PER_EXTRA_TYPE = 2;
const TYPES_BEFORE_BONUS_STARTS = 3;

const varietyBonusFor = (otherTypeCount: number): number =>
  Math.max(
    MINIMUM_BONUS,
    POINTS_PER_EXTRA_TYPE * (otherTypeCount - TYPES_BEFORE_BONUS_STARTS),
  );

const otherTypeCountFor = (army: Card[], scorerIndex: number): number =>
  countDistinctTypes(army.filter((_, index) => index !== scorerIndex));

const scoreOneSphinx = (otherTypeCount: number): number =>
  BASE_SCORE + varietyBonusFor(otherTypeCount);

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card)
        ? total + scoreOneSphinx(otherTypeCountFor(army, index))
        : total,
    0,
  );
