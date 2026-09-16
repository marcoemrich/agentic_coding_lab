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
  // eslint-disable-next-line no-magic-numbers -- These are the binding schema's rank values.
  rank?: 1 | 2 | 3;
};

const PRINTED_POINTS = 1;
const BASE_AND_FALLBACK_POINTS = 2;
const TYPES_BEFORE_BONUS = 3;
const POINTS_PER_TYPE_BEYOND_THREE = 2;

function isSphinx(card: Card): boolean {
  return card.monster === "sphinx";
}

function distinctMonsterTypeCount(cards: Card[]): number {
  return new Set(cards.map((card) => card.monster)).size;
}

function scoreForOtherTypeCount(otherTypeCount: number): number {
  return otherTypeCount > TYPES_BEFORE_BONUS
    ? PRINTED_POINTS +
        POINTS_PER_TYPE_BEYOND_THREE * (otherTypeCount - TYPES_BEFORE_BONUS)
    : BASE_AND_FALLBACK_POINTS;
}

function otherTypeCountSeenBySphinx(army: Card[], sphinxCount: number): number {
  const nonSphinxCards = army.filter((card) => !isSphinx(card));
  const otherSphinxTypeCount = sphinxCount > 1 ? 1 : 0;
  return distinctMonsterTypeCount(nonSphinxCards) + otherSphinxTypeCount;
}

export function sphinxScore(army: Card[]): number {
  const sphinxCount = army.filter(isSphinx).length;
  if (sphinxCount === 0) return 0;

  const otherTypeCount = otherTypeCountSeenBySphinx(army, sphinxCount);
  return sphinxCount * scoreForOtherTypeCount(otherTypeCount);
}
