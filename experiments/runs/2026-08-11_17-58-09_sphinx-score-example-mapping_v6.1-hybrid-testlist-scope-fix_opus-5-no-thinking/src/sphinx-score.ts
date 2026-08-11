export type Card = {
  monster: string;
  rank?: number;
};

const POINTS_PER_SPHINX = 1;
const TYPE_THRESHOLD = 3;
const BASE_BONUS = 1;
const POINTS_PER_EXTRA_TYPE = 2;

const typeBonus = (typesSeen: number): number =>
  typesSeen > TYPE_THRESHOLD
    ? POINTS_PER_EXTRA_TYPE * (typesSeen - TYPE_THRESHOLD)
    : BASE_BONUS;

/** The distinct monsters a card sees — every other card in the army, itself excluded. */
const typesSeenFrom = (army: Card[], cardIndex: number): number =>
  army.reduce(
    (seen, card, index) =>
      index === cardIndex ? seen : seen.add(card.monster),
    new Set<string>(),
  ).size;

export const sphinxScore = (army: Card[]): number =>
  army.reduce(
    (score, card, index) =>
      card.monster === "sphinx"
        ? score + POINTS_PER_SPHINX + typeBonus(typesSeenFrom(army, index))
        : score,
    0,
  );
