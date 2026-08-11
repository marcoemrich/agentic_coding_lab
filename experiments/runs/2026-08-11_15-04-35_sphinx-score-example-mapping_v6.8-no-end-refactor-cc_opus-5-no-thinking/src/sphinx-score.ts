export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

// "1 point. 2 per type beyond three, else 1."
const BASE_SCORE = 1;
const FREE_TYPES = 3;
const BONUS_PER_EXTRA_TYPE = 2;
const BONUS_WITHIN_FREE_TYPES = 1;

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

const countTypesSeenBy = (army: Card[], index: number): number =>
  new Set(
    army.filter((_, other) => other !== index).map((card) => card.monster),
  ).size;

const bonusFor = (otherTypes: number): number =>
  otherTypes > FREE_TYPES
    ? BONUS_PER_EXTRA_TYPE * (otherTypes - FREE_TYPES)
    : BONUS_WITHIN_FREE_TYPES;

const scorePerSphinx = (otherTypes: number): number =>
  BASE_SCORE + bonusFor(otherTypes);

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (score, card, index) =>
      isSphinx(card) ? score + scorePerSphinx(countTypesSeenBy(army, index)) : score,
    0,
  );
