export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

const TYPES_INCLUDED_IN_BASE_BONUS = 3;
const SPHINX_POINTS = 1;
const BASE_BONUS = 1;
const BONUS_PER_EXTRA_TYPE = 2;

const bonusForVariety = (distinctTypeCount: number): number => {
  const typesBeyondBase = distinctTypeCount - TYPES_INCLUDED_IN_BASE_BONUS;

  return Math.max(BASE_BONUS, BONUS_PER_EXTRA_TYPE * typesBeyondBase);
};

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

// A Sphinx scores the distinct types it can see: every card except itself.
// It still sees the Sphinx type when a second Sphinx stands beside it.
const typesSeenByASphinx = (army: Card[], sphinxCount: number): Set<string> => {
  const typesInArmy = new Set(army.map((card) => card.monster));

  if (sphinxCount === 1) typesInArmy.delete(SPHINX);

  return typesInArmy;
};

export const scoreArmy = (army: Card[]): number => {
  const sphinxCount = army.filter(isSphinx).length;
  const typeCount = typesSeenByASphinx(army, sphinxCount).size;

  return sphinxCount * (SPHINX_POINTS + bonusForVariety(typeCount));
};
