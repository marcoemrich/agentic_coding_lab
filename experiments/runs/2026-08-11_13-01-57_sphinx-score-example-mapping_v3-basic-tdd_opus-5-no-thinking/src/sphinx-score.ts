export type Monster =
  | 'sphinx'
  | 'undead-warrior'
  | 'zombie'
  | 'hydra'
  | 'cyclops'
  | 'orthrus'
  | 'chimera'

/** The point variants an Undead Warrior card comes in. */
// eslint-disable-next-line no-magic-numbers -- the variants are named values, not magic
export type Rank = 1 | 2 | 3

export interface Card {
  monster: Monster
  /** Point variant of an Undead Warrior card; irrelevant to the Sphinx. */
  rank?: Rank
}

/** "…beyond three": the number of types a Sphinx sees for free. */
const FREE_TYPES = 3
const BASE_POINTS = 1
const POINTS_PER_EXTRA_TYPE = 2
const POINTS_WITHIN_FREE_TYPES = 1

/**
 * Sphinx — 1 point. 2 per type beyond three, else 1.
 *
 * A Sphinx counts the distinct monster types around it, not counting itself.
 * Another Sphinx is one of those types, and the Undead Warrior's point
 * variants are all the same type.
 */
function scoreSphinx(army: readonly Card[], sphinxIndex: number): number {
  const surroundingTypes = new Set(
    army.filter((_, index) => index !== sphinxIndex).map((card) => card.monster),
  )
  const extraTypes = surroundingTypes.size - FREE_TYPES

  return (
    BASE_POINTS +
    (extraTypes > 0 ? POINTS_PER_EXTRA_TYPE * extraTypes : POINTS_WITHIN_FREE_TYPES)
  )
}

/** The points an army's Sphinx cards are worth. Other monsters score nothing here. */
export function scoreArmy(army: readonly Card[]): number {
  return army.reduce(
    (score, card, index) =>
      card.monster === 'sphinx' ? score + scoreSphinx(army, index) : score,
    0,
  )
}
