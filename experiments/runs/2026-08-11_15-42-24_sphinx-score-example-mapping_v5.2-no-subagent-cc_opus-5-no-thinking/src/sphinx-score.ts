export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

/** Undead Warriors come in three point variants; all other monsters have one. */
// eslint-disable-next-line no-magic-numbers -- type-level literals, not values
export type Rank = 1 | 2 | 3;

export type Card = {
  monster: Monster;
  rank?: Rank;
};

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

// The Sphinx card reads: "1 point. 2 per type beyond three, else 1."
const BASE_POINTS = 1;
const POINTS_PER_TYPE_BEYOND = 2;
const TYPE_THRESHOLD = 3;
const POINTS_WITHIN_THRESHOLD = 1;

const bonusFor = (visibleTypes: number): number =>
  visibleTypes > TYPE_THRESHOLD
    ? POINTS_PER_TYPE_BEYOND * (visibleTypes - TYPE_THRESHOLD)
    : POINTS_WITHIN_THRESHOLD;

// A Sphinx counts the types it can see: every card in the army but itself.
const scoreOneSphinx = (otherCards: Card[]): number =>
  BASE_POINTS + bonusFor(countDistinctTypes(otherCards));

const everyCardExcept = (army: Card[], index: number): Card[] => [
  ...army.slice(0, index),
  ...army.slice(index + 1),
];

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card)
        ? total + scoreOneSphinx(everyCardExcept(army, index))
        : total,
    0,
  );
