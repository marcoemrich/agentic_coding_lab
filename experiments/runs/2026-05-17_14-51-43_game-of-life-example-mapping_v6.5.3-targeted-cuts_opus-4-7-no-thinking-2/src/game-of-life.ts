export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (isAlive && neighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const k = cellKey(cell);
      const existing = neighborCounts.get(k);
      neighborCounts.set(k, { cell, count: (existing?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts]
    .filter(([k, { count }]) => survives(alive.has(k), count))
    .map(([, { cell }]) => cell);
}
