export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";

/** "Sphinx — 1 point. 2 per type beyond three, else 1." */
const BASE_POINTS = 1;
const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND = 2;
const POINTS_OTHERWISE = 1;

export function scoreArmy(army: Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === SPHINX).length;
  if (sphinxCount === 0) return 0;

  const allTypes = new Set(army.map((card) => card.monster));
  // A Sphinx does not count itself, but does count a second Sphinx.
  const visibleTypes = sphinxCount > 1 ? allTypes.size : allTypes.size - 1;
  const typesBeyondThree = Math.max(0, visibleTypes - TYPE_THRESHOLD);
  const perSphinx =
    BASE_POINTS +
    (typesBeyondThree > 0
      ? POINTS_PER_TYPE_BEYOND * typesBeyondThree
      : POINTS_OTHERWISE);
  return sphinxCount * perSphinx;
}
