export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (count: number, wasAlive: boolean): boolean =>
  count === 3 || (count === 2 && wasAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const neighborhood = new Map<string, { cell: Cell; count: number }>();

  for (const cell of liveCells.flatMap(neighborsOf)) {
    const key = keyOf(cell);
    const prev = neighborhood.get(key);
    neighborhood.set(key, { cell, count: (prev?.count ?? 0) + 1 });
  }

  return Array.from(neighborhood.values())
    .filter(({ cell, count }) => survives(count, liveKeys.has(keyOf(cell))))
    .map(({ cell }) => cell);
}
