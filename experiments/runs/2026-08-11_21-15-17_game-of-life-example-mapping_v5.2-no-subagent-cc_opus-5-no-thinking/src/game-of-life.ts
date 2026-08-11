/** A living cell's position on the infinite grid: [x, y]. */
export type Cell = [number, number];

/** The eight cells surrounding any cell on the grid. */
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

/** A living cell needs at least this many living neighbors to avoid dying. */
const MIN_NEIGHBORS_TO_SURVIVE = 2;

/** Above this many living neighbors a living cell dies of overpopulation. */
const MAX_NEIGHBORS_TO_SURVIVE = 3;

/** A dead cell with exactly this many living neighbors is born. */
const NEIGHBORS_TO_BE_BORN = 3;

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

export function nextGeneration(livingCells: Cell[]): Cell[] {
  // Deduplicated up front: a coordinate names one cell, so a repeated input
  // tuple must not appear twice in the output — which would otherwise happen,
  // since surviving cells are carried straight through from the input.
  const living = new Map<string, Cell>(
    livingCells.map((cell) => [toKey(cell), cell]),
  );
  const isLiving = (cell: Cell): boolean => living.has(toKey(cell));

  const countLivingNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isLiving).length;

  // Covers three rules at once: too few neighbors is underpopulation, too many
  // is overpopulation, and the range between them is survival.
  const survives = (cell: Cell): boolean => {
    const neighbors = countLivingNeighbors(cell);
    return (
      neighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
      neighbors <= MAX_NEIGHBORS_TO_SURVIVE
    );
  };

  const isBorn = (cell: Cell): boolean =>
    countLivingNeighbors(cell) === NEIGHBORS_TO_BE_BORN;

  // Only cells adjacent to a living cell can reach 3 living neighbors, so the
  // dead neighbors of the living set are the only birth candidates worth
  // checking. The Map deduplicates candidates shared by several living cells.
  const birthCandidates = new Map<string, Cell>(
    [...living.values()]
      .flatMap(neighborsOf)
      .filter((cell) => !isLiving(cell))
      .map((cell) => [toKey(cell), cell]),
  );

  // These two groups are disjoint and exhaustive: every cell that can be alive
  // next generation is either living now, or a dead neighbor of a living cell.
  // That is what keeps an infinite grid tractable — no bounds are ever needed.
  return [
    ...[...living.values()].filter(survives),
    ...[...birthCandidates.values()].filter(isBorn),
  ];
}
