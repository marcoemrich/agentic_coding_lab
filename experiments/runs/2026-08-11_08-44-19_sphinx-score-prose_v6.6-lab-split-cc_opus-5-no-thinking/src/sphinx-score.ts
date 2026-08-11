export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export type Rank = 1 | 2 | 3;

export interface Card {
  monster: Monster;
  rank?: Rank;
}

const VARIETY_THRESHOLD = 3;
const POINTS_PER_SPHINX_BEYOND_THRESHOLD = 2;
const POINTS_PER_SPHINX = 1;

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

// `rank` is deliberately excluded from the key: rank variants (e.g. Undead
// Warrior ranks 1-3) are variants of one monster and count as a single type.
const countDistinctMonsterTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

const pointsPerSphinx = (army: Card[]): number =>
  countDistinctMonsterTypes(army) > VARIETY_THRESHOLD
    ? POINTS_PER_SPHINX_BEYOND_THRESHOLD
    : POINTS_PER_SPHINX;

export const scoreArmy = (army: Card[]): number =>
  army.filter(isSphinx).length * pointsPerSphinx(army);
