export type Cell = [x: number, y: number];

const keyOf = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentLiveCells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of currentLiveCells) {
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + deltaX, y + deltaY];
      const key = keyOf(...cell);
      const entry = neighborCounts.get(key);
      neighborCounts.set(key, { cell, count: (entry?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && liveCellKeys.has(key)))
    .map(([, { cell }]) => cell);
}
