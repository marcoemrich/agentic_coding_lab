export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function coordinateKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => coordinateKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const key of liveCellKeys) {
    const [x, y] = key.split(",").map(Number);

    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const neighborKey = coordinateKey(x + xOffset, y + yOffset);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === 3 || (count === 2 && liveCellKeys.has(key)))
    .map(([key]) => key.split(",").map(Number) as Cell)
    .sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);
}
