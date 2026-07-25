export type Cell = [number, number];

/** The 8 neighbor positions of a cell (Moore neighborhood). */
const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

/** Rule 4 (and Rule 2 upper bound): a cell with this many live neighbors is born or survives. */
const BIRTH_NEIGHBOR_COUNT = 3;

/** Rule 2 lower bound: a live cell with exactly this many live neighbors survives. */
const SURVIVAL_NEIGHBOR_COUNT = 2;

const cellKey = (cell: Cell): string => cell.join(",");

const cellFromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

/**
 * Map every candidate cell position to its count of live neighbors.
 * Candidates are the live cells and their 8 neighbors.
 */
const countNeighbors = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey([cell[0] + dx, cell[1] + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

/**
 * Compute the next generation of cells under Conway's Game of Life:
 *   Rule 1: live cell with < SURVIVAL_NEIGHBOR_COUNT dies (underpopulation).
 *   Rule 2: live cell with SURVIVAL_NEIGHBOR_COUNT or BIRTH_NEIGHBOR_COUNT lives.
 *   Rule 3: live cell with > BIRTH_NEIGHBOR_COUNT dies (overpopulation).
 *   Rule 4: dead cell with exactly BIRTH_NEIGHBOR_COUNT is born (reproduction).
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(cellKey));
  const neighborCounts = countNeighbors(cells);
  const next: Cell[] = [];

  // Rules 2 + 4 combined: a candidate survives when it has BIRTH_NEIGHBOR_COUNT
  // live neighbors (birth or survival) or is already alive with exactly
  // SURVIVAL_NEIGHBOR_COUNT live neighbors.
  for (const [key, n] of neighborCounts) {
    const isLive = liveSet.has(key);
    if (n === BIRTH_NEIGHBOR_COUNT || (isLive && n === SURVIVAL_NEIGHBOR_COUNT)) {
      next.push(cellFromKey(key));
    }
  }

  return next;
}
