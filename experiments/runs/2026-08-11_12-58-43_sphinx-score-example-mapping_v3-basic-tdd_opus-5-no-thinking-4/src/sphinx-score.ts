export type Monster =
  | 'sphinx'
  | 'undead-warrior'
  | 'zombie'
  | 'hydra'
  | 'cyclops'
  | 'orthrus'
  | 'chimera';

/**
 * The point variants an Undead Warrior is printed in.
 *
 * These are literal types, not magic numbers: the base ESLint rule cannot
 * tell the difference, so it is disabled for this line alone.
 */
// eslint-disable-next-line no-magic-numbers
export type Rank = 1 | 2 | 3;

export interface Card {
  monster: Monster;
  /** Point variant of an Undead Warrior. Irrelevant to its type. */
  rank?: Rank;
}

const TYPES_BEFORE_BONUS = 3;
const POINTS_PER_TYPE_BEYOND = 2;

/**
 * Sphinx — 1 point. 2 per type beyond three, else 1.
 *
 * A Sphinx counts the types around it: every other card in the army,
 * itself excluded. Another Sphinx is one of those types, so Sphinxes see
 * each other. The rank of an Undead Warrior is a point variant, not a
 * type of its own, so all three ranks count once.
 */
export function scoreArmy(army: readonly Card[]): number {
  return army.reduce(
    (score, card, index) => (card.monster === 'sphinx' ? score + scoreSphinxAt(army, index) : score),
    0,
  );
}

function scoreSphinxAt(army: readonly Card[], sphinxIndex: number): number {
  const types = new Set(
    army.filter((_, index) => index !== sphinxIndex).map((card) => card.monster),
  );
  const beyond = types.size - TYPES_BEFORE_BONUS;

  return 1 + (beyond > 0 ? POINTS_PER_TYPE_BEYOND * beyond : 1);
}
