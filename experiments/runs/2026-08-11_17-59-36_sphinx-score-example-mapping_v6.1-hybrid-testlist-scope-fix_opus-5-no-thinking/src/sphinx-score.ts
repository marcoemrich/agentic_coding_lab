export type Card = {
  monster: string;
  rank?: number;
};

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const BASE_SCORE = 2;
const MAX_TYPES_FOR_BASE_SCORE = 3;
const SCORE_AT_FIRST_EXTRA_TYPE = 3;
const SCORE_PER_EXTRA_TYPE = 2;

// Rank is a variant of a monster, not a type of its own: all Undead Warrior
// ranks collapse into the single type "undead-warrior".
const monsterTypeOf = (card: Card): string => card.monster;

const countMonsterTypes = (cards: Card[]): number =>
  new Set(cards.map(monsterTypeOf)).size;

const armyWithout = (army: Card[], excluded: number): Card[] =>
  army.filter((_, index) => index !== excluded);

const scoreSphinx = (otherCards: Card[]): number => {
  const typeCount = countMonsterTypes(otherCards);
  if (typeCount <= MAX_TYPES_FOR_BASE_SCORE) return BASE_SCORE;

  const extraTypes = typeCount - MAX_TYPES_FOR_BASE_SCORE;
  return SCORE_AT_FIRST_EXTRA_TYPE + SCORE_PER_EXTRA_TYPE * (extraTypes - 1);
};

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card) ? total + scoreSphinx(armyWithout(army, index)) : total,
    0,
  );
