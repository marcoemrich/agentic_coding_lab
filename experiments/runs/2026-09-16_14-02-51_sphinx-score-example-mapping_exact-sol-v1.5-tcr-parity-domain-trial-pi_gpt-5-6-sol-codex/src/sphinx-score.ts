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

const SPHINX_BASE_POINTS = 1;
const THREE_OR_FEWER_TYPES_BONUS = 1;
const INCLUDED_OTHER_TYPES = 3;
const POINTS_PER_ADDITIONAL_TYPE = 2;

function countSphinxes(army: Card[]): number {
  return army.filter((card) => card.monster === "sphinx").length;
}

function countTypesSeenByOneSphinx(army: Card[], sphinxCount: number): number {
  const nonSphinxTypes = new Set(
    army
      .filter((card) => card.monster !== "sphinx")
      .map((card) => card.monster),
  ).size;
  const otherSphinxType = sphinxCount > 1 ? 1 : 0;
  return nonSphinxTypes + otherSphinxType;
}

function typeBonusFor(otherTypeCount: number): number {
  const additionalTypeCount = Math.max(otherTypeCount - INCLUDED_OTHER_TYPES, 0);
  return additionalTypeCount === 0
    ? THREE_OR_FEWER_TYPES_BONUS
    : additionalTypeCount * POINTS_PER_ADDITIONAL_TYPE;
}

function pointsForOneSphinx(army: Card[], sphinxCount: number): number {
  return SPHINX_BASE_POINTS + typeBonusFor(countTypesSeenByOneSphinx(army, sphinxCount));
}

export function scoreSphinxes(army: Card[]): number {
  const sphinxCount = countSphinxes(army);
  if (sphinxCount === 0) return 0;

  return sphinxCount * pointsForOneSphinx(army, sphinxCount);
}
