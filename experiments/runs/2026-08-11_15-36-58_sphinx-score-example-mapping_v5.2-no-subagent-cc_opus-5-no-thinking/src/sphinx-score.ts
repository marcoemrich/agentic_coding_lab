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

const BASE_POINTS = 1;
const FEW_TYPES_BONUS = 1;
const THRESHOLD_TYPES = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

// A card's type is its monster; rank variants of the same monster share one type.
const typeOf = (card: Card): Monster => card.monster;

const countDistinctTypes = (cards: Card[]): number => new Set(cards.map(typeOf)).size;

const bonusForTypeCount = (typeCount: number): number =>
  typeCount > THRESHOLD_TYPES
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * (typeCount - THRESHOLD_TYPES)
    : FEW_TYPES_BONUS;

const otherCards = (army: Card[], cardIndex: number): Card[] =>
  army.filter((_, index) => index !== cardIndex);

const scoreOneSphinx = (army: Card[], sphinxIndex: number): number =>
  BASE_POINTS + bonusForTypeCount(countDistinctTypes(otherCards(army, sphinxIndex)));

export const sphinxScore = (army: Card[]): number =>
  army.reduce(
    (total, card, index) => (isSphinx(card) ? total + scoreOneSphinx(army, index) : total),
    0,
  );
