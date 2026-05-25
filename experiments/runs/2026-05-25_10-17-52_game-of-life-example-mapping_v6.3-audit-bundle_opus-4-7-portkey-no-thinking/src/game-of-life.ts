/** Coordinates of a cell on the infinite grid: [x, y]. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

/**
 * Computes the next generation of live cells per Conway's Game of Life rules.
 * Returns the set of cells alive after one tick.
 */
export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const prior = neighborCounts.get(key)?.count ?? 0;
      neighborCounts.set(key, { cell, count: prior + 1 });
    }
  }
  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));
  return [...neighborCounts]
    .filter(([key, { count }]) => survives(key, count))
    .map(([, { cell }]) => cell);
};
