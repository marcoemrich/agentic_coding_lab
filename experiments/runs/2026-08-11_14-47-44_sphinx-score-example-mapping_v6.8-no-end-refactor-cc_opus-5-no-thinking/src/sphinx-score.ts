export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const SPHINX_BASE_POINTS = 1;

// "2 per type beyond three, else 1" — counted over the types a Sphinx can
// see, which excludes the Sphinx's own card.
const FLAT_VARIETY_POINTS = 1;
const VARIETY_POINTS_PER_EXTRA_TYPE = 2;
const TYPES_BEFORE_VARIETY_SCALES = 3;

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

// A card's type is its monster; rank marks a variant (e.g. Undead Warrior
// (1) and (3)) and does not make it a separate type.
const typeOf = (card: Card): string => card.monster;

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map(typeOf)).size;

const varietyPoints = (typeCount: number): number => {
  const extraTypes = typeCount - TYPES_BEFORE_VARIETY_SCALES;
  return extraTypes > 0
    ? VARIETY_POINTS_PER_EXTRA_TYPE * extraTypes
    : FLAT_VARIETY_POINTS;
};

const countSphinxes = (army: Card[]): number => army.filter(isSphinx).length;

// A Sphinx counts the types it can see — every card in the army except its
// own. Its own card is the only one it drops, so the type "sphinx" survives
// whenever some *other* Sphinx is still there to carry it. Only a lone Sphinx
// loses its own type, and that makes the visible type count identical for
// every Sphinx in a given army.
const typesVisibleToEachSphinx = (army: Card[]): number => {
  const ownTypeSurvives = countSphinxes(army) > 1;
  return countDistinctTypes(army) - (ownTypeSurvives ? 0 : 1);
};

const sphinxScore = (army: Card[]): number =>
  SPHINX_BASE_POINTS + varietyPoints(typesVisibleToEachSphinx(army));

// Each Sphinx scores on its own, and they all see the same types — so the
// army's score is one Sphinx's score, once per Sphinx.
export const scoreArmy = (army: Card[]): number =>
  countSphinxes(army) * sphinxScore(army);
