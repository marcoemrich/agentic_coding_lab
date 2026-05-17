export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (count: number, isAlive: boolean): boolean =>
  count === 3 || (count === 2 && isAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(String));
  const tally = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = String(neighbor);
      const entry = tally.get(key) ?? { cell: neighbor, count: 0 };
      tally.set(key, { cell: entry.cell, count: entry.count + 1 });
    }
  }

  return Array.from(tally.values())
    .filter(({ cell, count }) => survives(count, liveSet.has(String(cell))))
    .map(({ cell }) => cell);
}
