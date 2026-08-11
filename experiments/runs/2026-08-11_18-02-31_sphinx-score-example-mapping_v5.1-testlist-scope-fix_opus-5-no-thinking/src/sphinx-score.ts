export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const BASE_POINTS = 1;
const FEW_TYPES_BONUS = 1;

const MANY_TYPES_THRESHOLD = 3;
const POINTS_PER_EXTRA_TYPE = 2;

const isSphinx = (card: Card) => card.monster === SPHINX;

/**
 * The distinct monster types the Sphinx at `index` sees. It does not count
 * itself, but it does count any other Sphinx in the army.
 */
function typesSeenBySphinx(army: Card[], index: number): number {
  const others = army.filter((_, i) => i !== index);
  return new Set(others.map((card) => card.monster)).size;
}

/** "2 per type beyond three, else 1." */
function bonusForTypes(types: number): number {
  if (types <= MANY_TYPES_THRESHOLD) return FEW_TYPES_BONUS;
  return POINTS_PER_EXTRA_TYPE * (types - MANY_TYPES_THRESHOLD);
}

/** "Sphinx — 1 point. 2 per type beyond three, else 1." */
function scoreSphinxAt(army: Card[], index: number): number {
  return BASE_POINTS + bonusForTypes(typesSeenBySphinx(army, index));
}

/** The points an army's Sphinx cards are worth. */
export function scoreArmy(army: Card[]): number {
  return army.reduce(
    (total, card, index) =>
      total + (isSphinx(card) ? scoreSphinxAt(army, index) : 0),
    0,
  );
}
