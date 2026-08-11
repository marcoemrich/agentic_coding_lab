export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export type Card = {
  monster: Monster;
  rank?: number;
};

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const countTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

// A Sphinx counts every type in the army except its own — so a lone Sphinx
// does not count itself, but a second Sphinx is a type its twin can see.
const countTypesSeenByASphinx = (army: Card[], sphinxCount: number): number => {
  const sphinxIsTheOnlyOne = sphinxCount === 1;
  return countTypes(army) - (sphinxIsTheOnlyOne ? 1 : 0);
};

// "Sphinx — 1 point. 2 per type beyond three, else 1."
const BASE_POINTS = 1;
const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;
const POINTS_WITHIN_THRESHOLD = 1;

const pointsPerSphinx = (typeCount: number): number =>
  BASE_POINTS +
  (typeCount > TYPE_THRESHOLD
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * (typeCount - TYPE_THRESHOLD)
    : POINTS_WITHIN_THRESHOLD);

export function scoreArmy(army: Card[]): number {
  const sphinxCount = army.filter(isSphinx).length;
  const typeCount = countTypesSeenByASphinx(army, sphinxCount);
  return sphinxCount * pointsPerSphinx(typeCount);
}
