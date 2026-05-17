export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(cellKey));
  const tallies = new Map<string, { cell: Cell; count: number }>();

  for (const neighbor of cells.flatMap(neighborsOf)) {
    const k = cellKey(neighbor);
    const entry = tallies.get(k);
    tallies.set(k, { cell: neighbor, count: (entry?.count ?? 0) + 1 });
  }

  const survives = (k: string, n: number): boolean =>
    n === 3 || (n === 2 && alive.has(k));

  return [...tallies]
    .filter(([k, { count }]) => survives(k, count))
    .map(([, { cell }]) => cell);
};
