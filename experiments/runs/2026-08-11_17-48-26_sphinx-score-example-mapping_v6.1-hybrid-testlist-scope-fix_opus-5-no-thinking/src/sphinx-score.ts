export type Card = {
  monster: string;
  rank?: number;
};

const isSphinx = (card: Card): boolean => card.monster === "sphinx";

const countDistinctTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

const TYPES_BEFORE_BONUS_SCALES = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

// "Sphinx — 1 point. 2 per type beyond three, else 1." The types counted are
// those among the other cards in the army: every card except the scoring Sphinx
// itself (a second Sphinx does count, as one type).
const scoreOneSphinx = (otherTypeCount: number): number => {
  const bonus =
    otherTypeCount > TYPES_BEFORE_BONUS_SCALES
      ? POINTS_PER_TYPE_BEYOND_THRESHOLD *
        (otherTypeCount - TYPES_BEFORE_BONUS_SCALES)
      : 1;
  return 1 + bonus;
};

export const sphinxScore = (army: Card[]): number => {
  const sphinxCount = army.filter(isSphinx).length;
  // Every Sphinx sees the same set of other types: the army's types, minus
  // "sphinx" itself when it is the lone Sphinx (removing it removes that type).
  const otherTypeCount =
    countDistinctTypes(army) - (sphinxCount === 1 ? 1 : 0);
  return sphinxCount * scoreOneSphinx(otherTypeCount);
};
