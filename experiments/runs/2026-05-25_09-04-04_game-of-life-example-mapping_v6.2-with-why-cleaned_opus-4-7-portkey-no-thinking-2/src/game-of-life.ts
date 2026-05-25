/** A live cell's coordinates as [x, y] on an infinite 2D grid. */
export type Cell = [number, number];

const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

function* neighborsOf([x, y]: Cell): Generator<Cell> {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) yield [x + dx, y + dy];
    }
  }
}

const willBeAlive = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

/**
 * Computes the next generation of live cells per Conway's Game of Life rules.
 * Any cell not in the input is considered dead.
 * @param liveCells - The currently live cells (order is irrelevant).
 * @returns The cells that are live in the next generation.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(([x, y]) => toKey(x, y)));
  const liveNeighborCounts = new Map<string, number>();

  for (const cell of liveCells) {
    for (const [nx, ny] of neighborsOf(cell)) {
      const key = toKey(nx, ny);
      liveNeighborCounts.set(key, (liveNeighborCounts.get(key) ?? 0) + 1);
    }
  }

  const nextLiveCells: Cell[] = [];
  for (const [key, count] of liveNeighborCounts) {
    if (willBeAlive(liveKeys.has(key), count)) {
      nextLiveCells.push(fromKey(key));
    }
  }
  return nextLiveCells;
}
