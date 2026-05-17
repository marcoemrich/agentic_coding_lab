export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const key = (x: number, y: number) => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const k = key(cell[0], cell[1]);
      const existing = neighborCounts.get(k);
      neighborCounts.set(k, {
        cell,
        count: (existing?.count ?? 0) + 1,
      });
    }
  }

  const survives = ([k, { count }]: [string, { cell: Cell; count: number }]) =>
    count === 3 || (count === 2 && live.has(k));

  return Array.from(neighborCounts)
    .filter(survives)
    .map(([, { cell }]) => cell);
}
