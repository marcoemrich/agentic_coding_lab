export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const entry = neighborCounts.get(key) ?? { cell, count: 0 };
      entry.count++;
      neighborCounts.set(key, entry);
    }
  }

  const survivesOrIsBorn = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveSet.has(key));

  return Array.from(neighborCounts)
    .filter(([key, { count }]) => survivesOrIsBorn(key, count))
    .map(([, { cell }]) => cell);
};
