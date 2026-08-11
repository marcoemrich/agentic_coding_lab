export type Card = { monster: string; rank?: number };

const SPHINX = "sphinx";

const BASE_POINTS = 1;
const TYPE_THRESHOLD = 3;
const POINTS_PER_EXTRA_TYPE = 2;
const FALLBACK_POINTS = 1;

function isSphinx(card: Card): boolean {
  return card.monster === SPHINX;
}

/** A Sphinx counts every other card in the army, but never itself. */
function countTypesSeenBy(army: Card[], sphinxIndex: number): number {
  const monstersSeen = army
    .filter((_, index) => index !== sphinxIndex)
    .map((card) => card.monster);
  return new Set(monstersSeen).size;
}

function typeBonus(typesSeen: number): number {
  if (typesSeen > TYPE_THRESHOLD) {
    return POINTS_PER_EXTRA_TYPE * (typesSeen - TYPE_THRESHOLD);
  }
  return FALLBACK_POINTS;
}

export function sphinxScore(army: Card[]): number {
  return army.reduce((score, card, index) => {
    if (!isSphinx(card)) return score;
    return score + BASE_POINTS + typeBonus(countTypesSeenBy(army, index));
  }, 0);
}
