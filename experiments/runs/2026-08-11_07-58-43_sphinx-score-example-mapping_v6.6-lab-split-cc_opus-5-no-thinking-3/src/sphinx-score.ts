export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";
const MAX_TYPES_FOR_BASE_SCORE = 3;
const SCORE_PER_TYPE_BEYOND = 2;

/**
 * How many distinct monster types are on the board. A type ignores rank:
 * Undead Warrior (1) and Undead Warrior (3) are the same type.
 */
const countDistinctMonsterTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

/**
 * "Sphinx — 1 point. 2 per type beyond three, else 1."
 *
 * The flat 1 point, plus either 2 for every type beyond the third or a
 * single point when there are no more than three.
 */
const scoreOneSphinx = (otherTypeCount: number): number =>
  1 +
  (otherTypeCount > MAX_TYPES_FOR_BASE_SCORE
    ? (otherTypeCount - MAX_TYPES_FOR_BASE_SCORE) * SCORE_PER_TYPE_BEYOND
    : 1);

/**
 * A Sphinx counts the types around it, not its own — but a second Sphinx
 * keeps "sphinx" on the board, so "sphinx" only drops out of the count when
 * this is the army's lone Sphinx. Every Sphinx therefore sees the same
 * number of other types, and scores the same.
 */
export const scoreArmy = (army: Card[]): number => {
  const sphinxCount = army.filter((card) => card.monster === SPHINX).length;
  const otherTypeCount =
    countDistinctMonsterTypes(army) - (sphinxCount === 1 ? 1 : 0);

  return sphinxCount * scoreOneSphinx(otherTypeCount);
};
