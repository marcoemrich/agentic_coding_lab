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
  // Ranks are the three point values defined by the card variants.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const SPHINX = "sphinx";
const TYPE_THRESHOLD = 3;
const POINTS_PER_EXCESS_TYPE = 2;

export function scoreSphinx(army: readonly Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === SPHINX).length;
  if (sphinxCount === 0) return 0;

  const otherTypes = new Set(
    army.filter(({ monster }) => monster !== SPHINX).map(({ monster }) => monster),
  ).size;
  const visibleTypes = otherTypes + (sphinxCount > 1 ? 1 : 0);
  const typePoints = visibleTypes > TYPE_THRESHOLD
    ? POINTS_PER_EXCESS_TYPE * (visibleTypes - TYPE_THRESHOLD)
    : 1;

  return sphinxCount * (1 + typePoints);
}
