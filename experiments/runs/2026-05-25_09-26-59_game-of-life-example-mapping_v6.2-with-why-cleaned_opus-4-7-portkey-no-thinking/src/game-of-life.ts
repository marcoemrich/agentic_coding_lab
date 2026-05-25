/** A live cell's position on the infinite grid, as [x, y] coordinates. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const livesNextGeneration = (isAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);

/**
 * Computes the live cells of the next generation of Conway's Game of Life
 * from the current set of live cells.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, { cell: Cell; liveNeighborCount: number }>();

  for (const live of liveCells) {
    for (const neighbor of neighborsOf(live)) {
      const key = cellKey(neighbor);
      const existing = candidates.get(key);
      if (existing) {
        existing.liveNeighborCount += 1;
      } else {
        candidates.set(key, { cell: neighbor, liveNeighborCount: 1 });
      }
    }
  }

  const survivors: Cell[] = [];
  for (const [key, { cell, liveNeighborCount }] of candidates) {
    if (livesNextGeneration(liveKeys.has(key), liveNeighborCount)) {
      survivors.push(cell);
    }
  }
  return survivors;
}
