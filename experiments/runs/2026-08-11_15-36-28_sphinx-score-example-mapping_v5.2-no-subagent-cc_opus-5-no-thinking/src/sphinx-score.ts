export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export type Rank = 1 | 2 | 3;

export type Card = {
  monster: Monster;
  rank?: Rank;
};

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const typesSeenBySphinx = (army: Card[], sphinxIndex: number): Set<Monster> =>
  new Set(
    army.filter((_, index) => index !== sphinxIndex).map((card) => card.monster),
  );

// "Sphinx — 1 point. 2 per type beyond three, else 1."
const BASE_POINTS = 1;
const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;
const POINTS_WITHIN_THRESHOLD = 1;

const sphinxPoints = (typeCount: number): number =>
  BASE_POINTS +
  (typeCount > TYPE_THRESHOLD
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * (typeCount - TYPE_THRESHOLD)
    : POINTS_WITHIN_THRESHOLD);

const pointsForSphinxAt = (army: Card[], sphinxIndex: number): number =>
  sphinxPoints(typesSeenBySphinx(army, sphinxIndex).size);

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card) ? total + pointsForSphinxAt(army, index) : total,
    0,
  );
