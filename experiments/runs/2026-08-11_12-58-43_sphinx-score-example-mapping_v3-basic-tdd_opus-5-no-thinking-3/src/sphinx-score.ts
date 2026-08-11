export type Monster =
  | 'sphinx'
  | 'undead-warrior'
  | 'zombie'
  | 'hydra'
  | 'cyclops'
  | 'orthrus'
  | 'chimera';

/**
 * Point variant of an Undead Warrior (1, 2 or 3). The variants are still a
 * single monster type as far as the Sphinx is concerned, so scoring never
 * reads this field.
 */
export type Rank = number;

export interface Card {
  monster: Monster;
  rank?: Rank;
}

const SPHINX: Monster = 'sphinx';

/** Types up to and including this many score the flat point; beyond it, per-type points. */
const TYPE_THRESHOLD = 3;

/** Points earned for each type beyond the threshold. */
const POINTS_PER_TYPE_BEYOND = 2;

/** Flat points when the army stays within the threshold. */
const POINTS_WITHIN_THRESHOLD = 1;

/** Every Sphinx is worth this before counting types. */
const BASE_POINTS = 1;

/** A lone Sphinx has no fellow Sphinx to count as a type. */
const ONE_SPHINX = 1;

/**
 * Points a single Sphinx is worth, given the number of monster types it can
 * see. A Sphinx never counts itself, but does count any other Sphinx.
 */
function scoreOneSphinx(typesSeen: number): number {
  const beyondThreshold = typesSeen - TYPE_THRESHOLD;
  const typePoints =
    beyondThreshold > 0 ? POINTS_PER_TYPE_BEYOND * beyondThreshold : POINTS_WITHIN_THRESHOLD;
  return BASE_POINTS + typePoints;
}

/** Points an army's Sphinx cards are worth in total. */
export function scoreArmy(army: readonly Card[]): number {
  const sphinxes = army.filter((card) => card.monster === SPHINX).length;
  if (sphinxes === 0) return 0;

  const otherTypes = new Set(
    army.map((card) => card.monster).filter((monster) => monster !== SPHINX),
  ).size;

  // Each Sphinx sees the other types plus, if present, its fellow Sphinx.
  const seesAnotherSphinx = sphinxes > ONE_SPHINX;
  const typesSeen = otherTypes + (seesAnotherSphinx ? 1 : 0);
  return sphinxes * scoreOneSphinx(typesSeen);
}
