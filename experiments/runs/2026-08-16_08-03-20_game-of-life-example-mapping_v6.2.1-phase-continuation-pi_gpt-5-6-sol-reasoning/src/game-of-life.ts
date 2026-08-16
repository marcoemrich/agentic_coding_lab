export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const key = `${x + xOffset},${y + yOffset}`;
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === 3 || (count === 2 && liveCells.has(key)))
    .map(([key]) => key.split(",").map(Number) as Cell)
    .sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
