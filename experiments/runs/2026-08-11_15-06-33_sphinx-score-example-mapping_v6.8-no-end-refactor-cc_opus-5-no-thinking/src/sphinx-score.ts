export type Card = {
  monster: string;
  rank?: number;
};

const BASE_POINTS = 1;
const COMPANION_POINTS = 1;
const BONUS_POINTS_PER_EXTRA_TYPE = 2;

/**
 * A Sphinx scores a bonus once the army fields more than four distinct monster
 * types counting itself — i.e. more than three distinct types among the cards
 * beside it. Expressed here from the scoring Sphinx's point of view, since a
 * second Sphinx counts as one of those companion types.
 */
const COMPANION_TYPES_BEFORE_BONUS = 3;

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

/** Rank variants (e.g. Undead Warrior 1/2/3) are the same monster type. */
const countMonsterTypes = (cards: Card[]): number =>
  new Set(cards.map((card) => card.monster)).size;

const earnsBonus = (companionTypes: number): boolean =>
  companionTypes > COMPANION_TYPES_BEFORE_BONUS;

const scoreForOneSphinx = (companionTypes: number): number =>
  earnsBonus(companionTypes)
    ? BASE_POINTS +
      BONUS_POINTS_PER_EXTRA_TYPE *
        (companionTypes - COMPANION_TYPES_BEFORE_BONUS)
    : BASE_POINTS + COMPANION_POINTS;

const cardsBeside = (army: Card[], index: number): Card[] =>
  army.filter((_, other) => other !== index);

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (score, card, index) =>
      isSphinx(card)
        ? score + scoreForOneSphinx(countMonsterTypes(cardsBeside(army, index)))
        : score,
    0,
  );
