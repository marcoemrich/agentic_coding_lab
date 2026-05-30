/** A live cell's coordinates as [x, y]. */
export type Cell = [number, number];

/**
 * Returns the next generation of live cells per Conway's Game of Life rules.
 *
 * Rules:
 *  - Underpopulation: a live cell with fewer than 2 live neighbors dies.
 *  - Survival: a live cell with 2 or 3 live neighbors lives on.
 *  - Overpopulation: a live cell with more than 3 live neighbors dies.
 *  - Reproduction: a dead cell with exactly 3 live neighbors becomes alive.
 */
const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const survivesOrIsBorn = (isCurrentlyAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isCurrentlyAlive && liveNeighborCount === 2);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey([x + dx, y + dy]);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => survivesOrIsBorn(liveKeys.has(key), count))
    .map(([key]) => fromKey(key));
}
