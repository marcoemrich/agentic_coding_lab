export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const coordinateKey = ([x, y]: Cell): string => `${x},${y}`;

const cellFromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(coordinateKey));
  const neighborCounts = new Map<string, number>();

  for (const liveCellKey of liveCellKeys) {
    const [x, y] = cellFromKey(liveCellKey);

    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const neighborKey = coordinateKey([x + xOffset, y + yOffset]);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(
      ([key, count]) => count === 3 || (count === 2 && liveCellKeys.has(key)),
    )
    .map(([key]) => cellFromKey(key))
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
