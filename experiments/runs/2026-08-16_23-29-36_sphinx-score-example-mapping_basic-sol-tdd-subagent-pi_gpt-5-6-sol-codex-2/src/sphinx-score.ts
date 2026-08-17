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
  // Rank literals are fixed by the normative input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const PRINTED_POINT = 1;
const BASE_TYPE_POINTS = 1;
const OTHER_TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

export function scoreSphinx(army: Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === "sphinx").length;
  if (sphinxCount === 0) {
    return 0;
  }

  const nonSphinxTypeCount = new Set(
    army
      .filter((card) => card.monster !== "sphinx")
      .map((card) => card.monster),
  ).size;
  const hasAnotherSphinx = sphinxCount > 1;
  const otherMonsterTypeCount =
    nonSphinxTypeCount + (hasAnotherSphinx ? 1 : 0);
  const typePoints =
    otherMonsterTypeCount > OTHER_TYPE_THRESHOLD
      ? (otherMonsterTypeCount - OTHER_TYPE_THRESHOLD) *
        POINTS_PER_TYPE_BEYOND_THRESHOLD
      : BASE_TYPE_POINTS;
  return sphinxCount * (PRINTED_POINT + typePoints);
}
