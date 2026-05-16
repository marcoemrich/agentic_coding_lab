export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const willLive = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const aliveKeys = new Set(cells.map(cellKey));
  const candidates = new Map<string, { cell: Cell; neighborCount: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const existing = candidates.get(key);
      if (existing) existing.neighborCount++;
      else candidates.set(key, { cell, neighborCount: 1 });
    }
  }

  return [...candidates]
    .filter(([key, { neighborCount }]) => willLive(neighborCount, aliveKeys.has(key)))
    .map(([, { cell }]) => cell);
};
