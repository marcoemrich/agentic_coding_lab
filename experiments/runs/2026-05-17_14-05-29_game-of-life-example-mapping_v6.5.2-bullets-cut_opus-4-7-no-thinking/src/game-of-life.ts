export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const live = new Set(liveCells.map(cellKey));
  const tallies = new Map<string, { cell: Cell; count: number }>();

  for (const cell of liveCells.flatMap(neighborsOf)) {
    const k = cellKey(cell);
    const count = (tallies.get(k)?.count ?? 0) + 1;
    tallies.set(k, { cell, count });
  }

  const survives = (count: number, k: string): boolean =>
    count === 3 || (count === 2 && live.has(k));

  return [...tallies]
    .filter(([k, { count }]) => survives(count, k))
    .map(([, { cell }]) => cell);
}
