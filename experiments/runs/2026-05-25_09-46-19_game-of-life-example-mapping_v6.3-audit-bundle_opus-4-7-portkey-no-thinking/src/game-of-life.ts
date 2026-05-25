export type Cell = [number, number];

const key = (c: Cell): string => `${c[0]},${c[1]}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: readonly Cell[]): Cell[] {
  const alive = new Set(cells.map(key));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of cells) {
    for (const n of neighborsOf(cell)) {
      const k = key(n);
      const entry = neighborCounts.get(k);
      if (entry) entry.count++;
      else neighborCounts.set(k, { cell: n, count: 1 });
    }
  }
  return Array.from(neighborCounts.entries())
    .filter(([k, { count }]) => count === 3 || (count === 2 && alive.has(k)))
    .map(([, { cell }]) => cell);
}
