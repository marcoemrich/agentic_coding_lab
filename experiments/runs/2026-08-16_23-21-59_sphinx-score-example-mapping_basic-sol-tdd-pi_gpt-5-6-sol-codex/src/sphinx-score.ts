export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export type Card =
  | { monster: Exclude<Monster, "undead-warrior"> }
  // The rank literals are binding values from the input schema.
  // eslint-disable-next-line no-magic-numbers
  | { monster: "undead-warrior"; rank: 1 | 2 | 3 };

const BASE_POINTS = 1;
const MINIMUM_TYPE_BONUS = 1;
const POINTS_PER_TYPE_BEYOND_THREE = 2;
const TYPES_BEFORE_BONUS = 3;

export const scoreSphinxes = (army: Card[]): number => {
  const sphinxCount = army.filter(({ monster }) => monster === "sphinx").length;
  if (sphinxCount === 0) return 0;

  const otherTypes = new Set(
    army
      .filter(({ monster }) => monster !== "sphinx")
      .map(({ monster }) => monster),
  );
  if (sphinxCount > 1) otherTypes.add("sphinx");

  const bonus = Math.max(
    MINIMUM_TYPE_BONUS,
    (otherTypes.size - TYPES_BEFORE_BONUS) * POINTS_PER_TYPE_BEYOND_THREE,
  );
  return sphinxCount * (BASE_POINTS + bonus);
};
