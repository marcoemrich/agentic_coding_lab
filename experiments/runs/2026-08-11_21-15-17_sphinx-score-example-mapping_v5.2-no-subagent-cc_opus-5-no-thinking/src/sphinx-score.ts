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

/** "Sphinx — 1 point. 2 per type beyond three, else 1." */
const SPHINX_BASE = 1;
const PER_TYPE_BEYOND = 2;
const THRESHOLD = 3;
const ELSE_BONUS = 1;

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const countDistinctTypes = (cards: Card[]): number =>
  new Set(cards.map((card) => card.monster)).size;

const scoreOneSphinx = (companionTypes: number): number =>
  companionTypes > THRESHOLD
    ? SPHINX_BASE + PER_TYPE_BEYOND * (companionTypes - THRESHOLD)
    : SPHINX_BASE + ELSE_BONUS;

const everyCardExcept = (army: Card[], position: number): Card[] =>
  army.filter((_, index) => index !== position);

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, position) =>
      isSphinx(card)
        ? total + scoreOneSphinx(countDistinctTypes(everyCardExcept(army, position)))
        : total,
    0,
  );
