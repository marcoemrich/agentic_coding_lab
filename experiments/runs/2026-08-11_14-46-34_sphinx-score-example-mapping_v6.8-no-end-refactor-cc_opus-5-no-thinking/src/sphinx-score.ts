export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";
const SPHINX_BASE_SCORE = 2;
/**
 * The base score covers an army with up to three other monster types; a fourth
 * other type is the first that scores extra.
 */
const OTHER_TYPES_COVERED_BY_BASE_SCORE = 3;
const SCORE_PER_EXTRA_TYPE = 2;
/**
 * Once a Sphinx is scoring extra types the base score no longer applies —
 * scoring restarts from 1, so four other types is worth 3 (1 + 2), not 4.
 * Confirmed by the "Sphinx, Chimera, Orthrus, Zombie, Hydra → 3 points"
 * example; folding this into the base score breaks that test.
 */
const EXTRA_TYPE_SCORE_BASE = 1;

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

/**
 * Two cards are the same monster type when they name the same monster —
 * variant markers such as an Undead Warrior's rank do not split the type.
 */
const monsterTypeOf = (card: Card): string => card.monster;

const countOtherMonsterTypes = (army: Card[], sphinxIndex: number): number =>
  new Set(army.filter((_, index) => index !== sphinxIndex).map(monsterTypeOf))
    .size;

const scoreOneSphinx = (army: Card[], sphinxIndex: number): number => {
  const otherTypeCount = countOtherMonsterTypes(army, sphinxIndex);
  if (otherTypeCount <= OTHER_TYPES_COVERED_BY_BASE_SCORE) {
    return SPHINX_BASE_SCORE;
  }

  const extraTypes = otherTypeCount - OTHER_TYPES_COVERED_BY_BASE_SCORE;
  return EXTRA_TYPE_SCORE_BASE + SCORE_PER_EXTRA_TYPE * extraTypes;
};

export const scoreArmy = (army: Card[]): number =>
  army.reduce(
    (total, card, index) =>
      isSphinx(card) ? total + scoreOneSphinx(army, index) : total,
    0,
  );
