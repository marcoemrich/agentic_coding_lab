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
  // These literals mirror the three variants in the input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const TYPE_THRESHOLD = 3;
const POINTS_PER_EXTRA_TYPE = 2;
const BASE_POINTS = 1;
const FALLBACK_POINTS = 1;

/** Return the points produced by all Sphinx cards in an army. */
export function scoreSphinxes(army: readonly Card[]): number {
  const armyTypeCount = new Set(army.map(({ monster }) => monster)).size;
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  const observedTypeCount = armyTypeCount - Number(sphinxCount === 1);
  const rulePoints =
    observedTypeCount > TYPE_THRESHOLD
      ? POINTS_PER_EXTRA_TYPE * (observedTypeCount - TYPE_THRESHOLD)
      : FALLBACK_POINTS;

  return sphinxCount * (BASE_POINTS + rulePoints);
}
