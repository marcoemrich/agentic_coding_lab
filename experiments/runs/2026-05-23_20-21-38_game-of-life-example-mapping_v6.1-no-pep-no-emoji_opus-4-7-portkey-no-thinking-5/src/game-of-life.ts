export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const entry = neighborCounts.get(key);
      if (entry) entry.count++;
      else neighborCounts.set(key, { cell: neighbor, count: 1 });
    }
  }

  const survives = (cell: Cell, count: number): boolean =>
    count === 3 || (count === 2 && aliveKeys.has(cellKey(cell)));

  return [...neighborCounts.values()]
    .filter(({ cell, count }) => survives(cell, count))
    .map(({ cell }) => cell);
}
