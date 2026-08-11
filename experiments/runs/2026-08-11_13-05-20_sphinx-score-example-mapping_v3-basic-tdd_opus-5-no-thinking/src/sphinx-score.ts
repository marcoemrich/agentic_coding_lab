export type Monster =
  | 'sphinx'
  | 'undead-warrior'
  | 'zombie'
  | 'hydra'
  | 'cyclops'
  | 'orthrus'
  | 'chimera';

export interface Card {
  monster: Monster;
  /**
   * Point variant of an Undead Warrior (1, 2 or 3). Carried for completeness
   * only: the variant does not affect the card's type, so scoring ignores it.
   */
  rank?: number;
}

const TYPE_THRESHOLD = 3;
const POINTS_PER_EXTRA_TYPE = 2;

/**
 * Scores a single Sphinx: "1 point. 2 per type beyond three, else 1."
 *
 * The types counted are those of the *other* cards in the army — a Sphinx
 * does not count itself, though it does count any further Sphinx alongside it.
 */
const scoreSphinx = (otherCards: readonly Card[]): number => {
  const types = new Set(otherCards.map((card) => card.monster));

  const bonus =
    types.size > TYPE_THRESHOLD
      ? POINTS_PER_EXTRA_TYPE * (types.size - TYPE_THRESHOLD)
      : 1;

  return 1 + bonus;
};

/** Points the army's Sphinx cards are worth. Other monsters score nothing here. */
export const scoreArmy = (army: readonly Card[]): number =>
  army.reduce((total, card, index) => {
    if (card.monster !== 'sphinx') return total;

    const otherCards = army.filter((_, other) => other !== index);
    return total + scoreSphinx(otherCards);
  }, 0);
