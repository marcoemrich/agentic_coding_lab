export type Cell = readonly [number, number];

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(livingCells: readonly Cell[]): Cell[] {
  const livingCellKeys = new Set(livingCells.map(cellKey));
  const livingNeighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of livingCells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(neighbor);
      const previousCount = livingNeighborCounts.get(key)?.count ?? 0;

      livingNeighborCounts.set(key, { cell: neighbor, count: previousCount + 1 });
    }
  }

  return [...livingNeighborCounts.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && livingCellKeys.has(key)))
    .map(([, { cell }]) => cell);
}
