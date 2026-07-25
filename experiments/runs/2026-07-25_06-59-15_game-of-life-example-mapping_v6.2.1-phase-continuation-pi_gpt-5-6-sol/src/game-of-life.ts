export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

const coordinateKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(([x, y]) => coordinateKey(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = coordinateKey(...neighbor);
      const entry = neighborCounts.get(key);
      neighborCounts.set(key, { cell: neighbor, count: (entry?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && liveKeys.has(key)))
    .map(([, { cell }]) => cell)
    .sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
