export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const BASE_TYPE_ALLOWANCE = 3;

const SPHINX_BASE_POINTS = 1;

const BASE_BONUS = 1;

const POINTS_PER_EXTRA_TYPE = 2;

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

const distinctMonsterTypes = (cards: Card[]): Set<string> =>
  new Set(cards.map((card) => card.monster));

// A Sphinx never counts itself, but it does count a fellow Sphinx — so the
// types any one Sphinx sees are the army's types, minus Sphinx unless a second
// Sphinx remains. Every Sphinx therefore sees the same number of types.
const typesSeenByEachSphinx = (army: Card[], sphinxCount: number): number => {
  const types = distinctMonsterTypes(army);
  if (sphinxCount < 2) types.delete(SPHINX);
  return types.size;
};

const scoreOneSphinx = (typesSeen: number): number => {
  const extraTypes = typesSeen - BASE_TYPE_ALLOWANCE;
  const bonus =
    extraTypes > 0 ? POINTS_PER_EXTRA_TYPE * extraTypes : BASE_BONUS;
  return SPHINX_BASE_POINTS + bonus;
};

export const scoreArmy = (army: Card[]): number => {
  const sphinxCount = army.filter(isSphinx).length;
  return sphinxCount * scoreOneSphinx(typesSeenByEachSphinx(army, sphinxCount));
};
