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
  rank?: number;
}

const BASE_POINTS = 1;
const ELSE_POINTS = 1;
// Domain values printed on the Sphinx card.
const TYPES_BEFORE_BONUS = 3;
const POINTS_PER_EXCESS_TYPE = 2;

function bonusForOtherTypeCount(otherTypeCount: number): number {
  return otherTypeCount > TYPES_BEFORE_BONUS
    ? POINTS_PER_EXCESS_TYPE * (otherTypeCount - TYPES_BEFORE_BONUS)
    : ELSE_POINTS;
}

function pointsForOneSphinx(otherTypeCount: number): number {
  return BASE_POINTS + bonusForOtherTypeCount(otherTypeCount);
}

function countTypesSeenByEachSphinx(army: readonly Card[], sphinxCount: number): number {
  const types = new Set(army.map(({ monster }) => monster));
  if (sphinxCount === 1) types.delete("sphinx");
  return types.size;
}

export function scoreSphinx(army: readonly Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  if (sphinxCount === 0) return 0;

  const otherTypeCount = countTypesSeenByEachSphinx(army, sphinxCount);
  return sphinxCount * pointsForOneSphinx(otherTypeCount);
}
