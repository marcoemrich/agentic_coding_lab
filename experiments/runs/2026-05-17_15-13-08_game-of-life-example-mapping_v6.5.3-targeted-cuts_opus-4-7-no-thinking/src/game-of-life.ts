export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (count: number, wasAlive: boolean): boolean =>
  count === 3 || (count === 2 && wasAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(keyOf));
  const tally = new Map<string, { cell: Cell; count: number }>();
  for (const cell of cells)
    for (const neighbor of neighborsOf(cell)) {
      const k = keyOf(neighbor);
      const entry = tally.get(k) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      tally.set(k, entry);
    }
  return [...tally.values()]
    .filter(({ cell, count }) => survives(count, aliveKeys.has(keyOf(cell))))
    .map(({ cell }) => cell);
}
