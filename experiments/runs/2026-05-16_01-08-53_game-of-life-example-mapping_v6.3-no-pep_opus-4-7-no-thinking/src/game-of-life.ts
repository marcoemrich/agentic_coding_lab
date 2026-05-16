export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (count: number, isLive: boolean): boolean =>
  count === 3 || (count === 2 && isLive);

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, { cell: Cell; count: number }>();

  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const existing = candidates.get(key);
      candidates.set(key, { cell: neighbor, count: (existing?.count ?? 0) + 1 });
    }
  }

  return [...candidates]
    .filter(([key, { count }]) => survives(count, liveKeys.has(key)))
    .map(([, { cell }]) => cell);
};
