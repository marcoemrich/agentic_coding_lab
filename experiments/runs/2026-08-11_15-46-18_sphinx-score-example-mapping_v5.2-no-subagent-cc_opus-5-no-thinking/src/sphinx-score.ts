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
  /** Point variant (1–3), carried by Undead Warrior cards only. Not used in scoring. */
  rank?: number;
};

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

/** Undead Warrior ranks are variants of one monster, so ranks are ignored here. */
const countTypes = (cards: Card[]): number =>
  new Set(cards.map((card) => card.monster)).size;

const BASE_POINTS = 1;
const TYPE_THRESHOLD = 3;
const POINTS_PER_EXTRA_TYPE = 2;
const FALLBACK_BONUS = 1;

/** "…2 per type beyond three, else 1." */
const bonusFor = (typeCount: number): number =>
  typeCount > TYPE_THRESHOLD
    ? POINTS_PER_EXTRA_TYPE * (typeCount - TYPE_THRESHOLD)
    : FALLBACK_BONUS;

/** "Sphinx — 1 point. 2 per type beyond three, else 1." */
const scoreSphinx = (otherCards: Card[]): number =>
  BASE_POINTS + bonusFor(countTypes(otherCards));

export const scoreArmy = (army: Card[]): number =>
  army.reduce((total, card, index) => {
    if (!isSphinx(card)) return total;

    const otherCards = army.filter((_, other) => other !== index);

    return total + scoreSphinx(otherCards);
  }, 0);
