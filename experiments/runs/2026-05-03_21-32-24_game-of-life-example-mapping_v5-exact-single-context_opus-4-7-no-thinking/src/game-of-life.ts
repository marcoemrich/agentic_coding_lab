export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const key = (x: number, y: number): string => `${x},${y}`;

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const live = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);
      const entry = neighborCounts.get(k) ?? { cell: [nx, ny] as Cell, count: 0 };
      entry.count += 1;
      neighborCounts.set(k, entry);
    }
  }

  const willBeAlive = (isAlive: boolean, count: number): boolean =>
    (isAlive && count === 2) || count === 3;

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (willBeAlive(live.has(k), count)) result.push(cell);
  }
  return result;
};
