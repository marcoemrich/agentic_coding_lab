export type Monster =
  | 'sphinx'
  | 'undead-warrior'
  | 'zombie'
  | 'hydra'
  | 'cyclops'
  | 'orthrus'
  | 'chimera';

export interface Card {
  monster: Monster;
  /** Point variant of an Undead Warrior card. Variants are the same type. */
  rank?: number;
}

export type Army = Card[];

const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;
const BASE_POINTS = 1;
const FALLBACK_BONUS = 1;

/**
 * Sphinx — 1 point. 2 per type beyond three, else 1.
 *
 * A Sphinx counts the distinct monster types in the rest of the army: its own
 * card is excluded, but a second Sphinx counts as a type for the first.
 * Undead Warrior point variants all count as the one type.
 */
export function sphinxScore(army: Army): number {
  return army.reduce(
    (total, card, index) =>
      card.monster === 'sphinx' ? total + scoreOneSphinx(army, index) : total,
    0,
  );
}

function scoreOneSphinx(army: Army, sphinxIndex: number): number {
  const types = new Set(
    army.filter((_, index) => index !== sphinxIndex).map((card) => card.monster),
  );

  const beyond = types.size - TYPE_THRESHOLD;
  const bonus =
    beyond > 0 ? POINTS_PER_TYPE_BEYOND_THRESHOLD * beyond : FALLBACK_BONUS;

  return BASE_POINTS + bonus;
}
