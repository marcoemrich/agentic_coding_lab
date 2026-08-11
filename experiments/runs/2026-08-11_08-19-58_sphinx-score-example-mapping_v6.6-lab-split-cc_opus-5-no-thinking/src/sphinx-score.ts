export type Card = { monster: string; rank?: number };

const SPHINX = "sphinx";
const THREE_TYPES = 3;
const BASE_POINTS = 1;
const POINTS_PER_TYPE_BEYOND_THREE = 2;
const POINTS_WITHIN_THREE_TYPES = BASE_POINTS + 1;

const countDistinctMonsterTypes = (cards: Card[]): number =>
  new Set(cards.map((card) => card.monster)).size;

// A Sphinx scores against the types it can see: every type in the army except
// its own. A second Sphinx keeps "sphinx" visible, so a lone Sphinx is the only
// case that loses a type — and every Sphinx in an army therefore sees the same
// count, whatever position it holds.
const typesVisibleToEachSphinx = (army: Card[], sphinxCount: number): number =>
  countDistinctMonsterTypes(army) - (sphinxCount === 1 ? 1 : 0);

// "Sphinx — 1 point. 2 per type beyond three, else 1."
// At three types or fewer that flat 1 + 1 is the floor of the same line the
// beyond-three rule draws, so one max expresses both halves of the rule.
const pointsForVisibleTypes = (visibleTypes: number): number =>
  Math.max(
    POINTS_WITHIN_THREE_TYPES,
    BASE_POINTS + POINTS_PER_TYPE_BEYOND_THREE * (visibleTypes - THREE_TYPES),
  );

export const scoreArmy = (army: Card[]): number => {
  const sphinxCount = army.filter((card) => card.monster === SPHINX).length;
  const visibleTypes = typesVisibleToEachSphinx(army, sphinxCount);
  return sphinxCount * pointsForVisibleTypes(visibleTypes);
};
