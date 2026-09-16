export interface Card {
  monster: string;
  rank?: number;
}

const PRINTED_POINTS = 1;
const FALLBACK_TYPE_POINTS = 1;
const TYPE_LIMIT = 3;
const POINTS_PER_TYPE_BEYOND_LIMIT = 2;

function typePointsFor(viewedTypeCount: number): number {
  return viewedTypeCount > TYPE_LIMIT
    ? (viewedTypeCount - TYPE_LIMIT) * POINTS_PER_TYPE_BEYOND_LIMIT
    : FALLBACK_TYPE_POINTS;
}

function viewedTypeCount(army: readonly Card[], sphinxCount: number): number {
  const viewedTypes = new Set(army.map((card) => card.monster));
  if (sphinxCount === 1) {
    viewedTypes.delete("sphinx");
  }
  return viewedTypes.size;
}

export function scoreSphinx(army: readonly Card[]): number {
  const sphinxCount = army.filter((card) => card.monster === "sphinx").length;
  if (sphinxCount === 0) {
    return 0;
  }

  const pointsPerSphinx = PRINTED_POINTS
    + typePointsFor(viewedTypeCount(army, sphinxCount));
  return sphinxCount * pointsPerSphinx;
}
