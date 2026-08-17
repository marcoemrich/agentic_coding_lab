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
  // The numeric literals are the binding rank values from the input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const ONE_SPHINX = 1;
const BASE_POINTS = 1;
const ELSE_BONUS = 1;
const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

export function scoreSphinx(army: readonly Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  const visibleTypes = new Set(army.map(({ monster }) => monster));

  if (sphinxCount === ONE_SPHINX) {
    visibleTypes.delete("sphinx");
  }

  const bonus = visibleTypes.size > TYPE_THRESHOLD
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * (visibleTypes.size - TYPE_THRESHOLD)
    : ELSE_BONUS;

  return sphinxCount * (BASE_POINTS + bonus);
}
