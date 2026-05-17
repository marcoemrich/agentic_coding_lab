export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of liveCells.flatMap(neighborsOf)) {
    const key = keyOf(cell);
    const entry = neighborCounts.get(key) ?? { cell, count: 0 };
    entry.count += 1;
    neighborCounts.set(key, entry);
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => survives(count, liveKeys.has(key)))
    .map(([, { cell }]) => cell);
}
