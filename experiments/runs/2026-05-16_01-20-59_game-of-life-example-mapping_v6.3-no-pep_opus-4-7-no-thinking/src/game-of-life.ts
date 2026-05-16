export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y    ],              [x + 1, y    ],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      const entry = neighborCounts.get(key) ?? { cell: neighbor, count: 0 };
      entry.count++;
      neighborCounts.set(key, entry);
    }
  }

  const isAliveNextGen = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && aliveKeys.has(key));

  return [...neighborCounts]
    .filter(([key, { count }]) => isAliveNextGen(key, count))
    .map(([, { cell }]) => cell);
}
