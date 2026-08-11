export type Cell = [number, number]; // [x, y]

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

const key = ([x, y]: Cell): string => `${x},${y}`;

const neighbors = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                 [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

/**
 * Computes the next generation on an infinite grid.
 *
 * Only living cells are stored. Since a cell can only change state if it has at
 * least one living neighbor, tallying neighbor counts over the living cells
 * yields every cell relevant to the next generation.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(key));

  return [...countLiveNeighbors(cells)]
    .filter(([id, { count }]) => livesOn(living.has(id), count))
    .map(([, { cell }]) => cell);
}

/** Live neighbor count for every cell adjacent to at least one living cell. */
function countLiveNeighbors(
  cells: Cell[],
): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighbors(cell)) {
      const entry = counts.get(key(neighbor));
      if (entry) entry.count += 1;
      else counts.set(key(neighbor), { cell: neighbor, count: 1 });
    }
  }

  return counts;
}

function livesOn(isAlive: boolean, liveNeighbors: number): boolean {
  if (isAlive) {
    return (
      liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
      liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE
    );
  }
  return liveNeighbors === NEIGHBORS_TO_BE_BORN;
}
