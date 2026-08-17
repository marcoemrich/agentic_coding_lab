export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export interface Card {
  monster: Monster;
  // The numeric literals are binding values from the input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

export interface ArmyInput {
  army: Card[];
}

const SPHINX_MONSTER = "sphinx";
const BASE_POINTS_PER_SPHINX = 2;
const SMALL_TYPE_BONUS_POINTS_PER_SPHINX = BASE_POINTS_PER_SPHINX + 1;
const LARGE_TYPE_BASE_POINTS = 1;
const SMALL_TYPE_COUNT_LIMIT = 2;
const MEDIUM_TYPE_COUNT_LIMIT = 4;
const TYPES_BEYOND_THRESHOLD = 3;
const BONUS_POINTS_PER_EXTRA_TYPE = 2;

export function calculateSphinxScore(input: ArmyInput): number {
  const sphinxCount = input.army.filter((card) => card.monster === SPHINX_MONSTER).length;

  if (sphinxCount === 0) {
    return 0;
  }

  const nonSphinxMonsterTypes = new Set(
    input.army
      .filter((card) => card.monster !== SPHINX_MONSTER)
      .map((card) => card.monster),
  );

  if (nonSphinxMonsterTypes.size <= SMALL_TYPE_COUNT_LIMIT) {
    return sphinxCount * BASE_POINTS_PER_SPHINX;
  }

  if (nonSphinxMonsterTypes.size <= MEDIUM_TYPE_COUNT_LIMIT) {
    return sphinxCount * SMALL_TYPE_BONUS_POINTS_PER_SPHINX;
  }

  return sphinxCount *
    (LARGE_TYPE_BASE_POINTS + BONUS_POINTS_PER_EXTRA_TYPE * (nonSphinxMonsterTypes.size - TYPES_BEYOND_THRESHOLD));
}
