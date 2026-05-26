/** A live cell's position as [x, y] coordinates. */
export type Cell = [number, number];

/** The 8 (dx, dy) offsets from a cell to each of its neighbors. */
const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const keyOf = (cell: Cell): string => `${cell[0]},${cell[1]}`;

/**
 * Computes the next generation of live cells per Conway's Game of Life rules.
 * Input and output represent only the live cells; absent coordinates are dead.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(keyOf));
  const neighborCounts = countNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survivesOrIsBorn(liveKeys.has(key), count)) nextCells.push(cell);
  }
  return nextCells;
}

/**
 * For each live cell, increments the neighbor count of its 8 surrounding cells.
 * Returns a map keyed by cell coordinates with the cell and its accumulated count.
 */
function countNeighbors(cells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = counts.get(key);
      if (entry) entry.count++;
      else counts.set(key, { cell: neighbor, count: 1 });
    }
  }
  return counts;
}

/** Conway's B3/S23: born with exactly 3 neighbors, survives with 2 or 3. */
function survivesOrIsBorn(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}
