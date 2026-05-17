/** A live cell on the infinite Game of Life grid, expressed as `[x, y]`. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = (x: number, y: number): string => `${x},${y}`;

const willBeAlive = (isAlive: boolean, neighborCount: number): boolean =>
  (isAlive && neighborCount === 2) || neighborCount === 3;

/**
 * Computes the next generation of live cells from the current generation,
 * following Conway's Game of Life rules.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  const liveKeys = new Set(liveCells.map(([x, y]) => toKey(x, y)));

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const key = toKey(nx, ny);
      const entry = neighborCounts.get(key);
      if (entry) entry.count++;
      else neighborCounts.set(key, { cell: [nx, ny], count: 1 });
    }
  }

  const survivors: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (willBeAlive(liveKeys.has(key), count)) survivors.push(cell);
  }
  return survivors;
}
