export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCells = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const existing = neighborCounts.get(key);
      neighborCounts.set(key, {
        cell: neighbor,
        count: (existing?.count ?? 0) + 1,
      });
    }
  }

  const survives = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveCells.has(key));

  return [...neighborCounts]
    .filter(([key, { count }]) => survives(key, count))
    .map(([, { cell }]) => cell);
};
