export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

// A card's type is its monster alone — variants of the same monster
// (e.g. Undead Warrior ranks) all count as one type.
const typeOf = (card: Card): string => card.monster;

const isSphinx = (card: Card): boolean => typeOf(card) === SPHINX;

const isNotSphinx = (card: Card): boolean => !isSphinx(card);

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map(typeOf)).size;

const NO_SPHINX_SCORE = 0;
const FREE_TYPES = 3;
const SCORE_WITHIN_FREE_TYPES = 2;
const BASE_SCORE_BEYOND_FREE_TYPES = 1;
const POINTS_PER_EXTRA_TYPE = 2;

const scoreOneSphinx = (visibleTypeCount: number): number => {
  if (visibleTypeCount <= FREE_TYPES) return SCORE_WITHIN_FREE_TYPES;

  const extraTypes = visibleTypeCount - FREE_TYPES;
  return BASE_SCORE_BEYOND_FREE_TYPES + POINTS_PER_EXTRA_TYPE * extraTypes;
};

// A Sphinx counts the types it sees among the *other* cards, so it never
// counts its own type — unless a second Sphinx card is there to supply it.
const countTypesVisibleToASphinx = (
  army: Card[],
  sphinxCount: number,
): number => {
  const anotherSphinxSuppliesTheSphinxType = sphinxCount > 1;
  const visibleArmy = anotherSphinxSuppliesTheSphinxType
    ? army
    : army.filter(isNotSphinx);
  return countDistinctTypes(visibleArmy);
};

export const scoreArmy = (army: Card[]): number => {
  const sphinxCount = army.filter(isSphinx).length;
  if (sphinxCount === 0) return NO_SPHINX_SCORE;

  const visibleTypes = countTypesVisibleToASphinx(army, sphinxCount);
  return sphinxCount * scoreOneSphinx(visibleTypes);
};
