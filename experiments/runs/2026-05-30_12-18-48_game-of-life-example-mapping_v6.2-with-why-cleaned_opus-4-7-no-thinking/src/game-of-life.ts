/** Coordinates of a live cell on an infinite grid, as `[x, y]`. */
export type Cell = [x: number, y: number];

const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

/**
 * Computes the next Game of Life generation from the current live cells.
 *
 * Algorithm: tally how many live neighbors each candidate cell has (every
 * neighbor of a live cell is a candidate), then apply Conway's rules:
 *   - A cell with exactly 3 neighbors is alive next tick (birth or survival).
 *   - A live cell with exactly 2 neighbors also survives.
 *   - All other cells are dead.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey(x + dx, y + dy);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }
  const isAliveNextTick = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));
  return [...neighborCounts]
    .filter(([key, count]) => isAliveNextTick(key, count))
    .map(([key]) => fromKey(key));
}
