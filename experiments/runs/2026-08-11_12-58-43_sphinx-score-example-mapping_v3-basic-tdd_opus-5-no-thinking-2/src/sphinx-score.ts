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
  /**
   * Point variant (1, 2 or 3) of an Undead Warrior. All three variants are the
   * same type of monster, so scoring ignores this field entirely.
   */
  rank?: number;
}

const BASE_POINTS = 1;
const TYPE_THRESHOLD = 3;
const POINTS_PER_STEP = 2;
const TYPES_PER_STEP = 2;

/**
 * What one Sphinx is worth: "1 point. 2 per type beyond three, else 1."
 */
function sphinxValue(typeCount: number): number {
  const beyondThreshold = typeCount - TYPE_THRESHOLD;

  if (beyondThreshold <= 0) {
    return BASE_POINTS + 1;
  }

  // The points are earned per *pair* of types beyond the third: 4 and 5 types
  // are both worth 3, 6 and 7 are both worth 5.
  const steps = Math.ceil(beyondThreshold / TYPES_PER_STEP);

  return BASE_POINTS + POINTS_PER_STEP * steps;
}

/**
 * Scores an army's Sphinx cards. Every other monster scores by its own printed
 * rule, which is out of scope here.
 *
 * A type is a distinct monster: a Sphinx counts itself, and the three Undead
 * Warrior ranks are one type between them.
 */
export function scoreArmy(army: readonly Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === 'sphinx').length;

  if (sphinxCount === 0) {
    return 0;
  }

  const typeCount = new Set(army.map((card) => card.monster)).size;

  return sphinxCount * sphinxValue(typeCount);
}
