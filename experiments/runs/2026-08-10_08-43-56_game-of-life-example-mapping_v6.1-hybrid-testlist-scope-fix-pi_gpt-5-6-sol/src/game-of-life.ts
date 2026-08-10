export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(currentGeneration: Cell[]): Cell[] {
  const liveCellKeys = new Set(currentGeneration.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of currentGeneration) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const existing = neighborCounts.get(key);
      neighborCounts.set(key, { cell, count: (existing?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && liveCellKeys.has(key)))
    .map(([, { cell }]) => cell);
}
