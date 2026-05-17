export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const liveKeys = new Set(livingCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of livingCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const entry = neighborCounts.get(key) ?? { cell: neighbor, count: 0 };
      neighborCounts.set(key, { cell: entry.cell, count: entry.count + 1 });
    }
  }

  return [...neighborCounts]
    .filter(([key, { count }]) => survives(count, liveKeys.has(key)))
    .map(([, { cell }]) => cell);
}
