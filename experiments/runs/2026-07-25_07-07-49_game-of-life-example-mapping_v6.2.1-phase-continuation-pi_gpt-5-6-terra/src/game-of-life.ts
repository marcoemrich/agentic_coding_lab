export type Cell = [number, number];

const toCellKey = (x: number, y: number): string => `${x},${y}`;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],            [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => toCellKey(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const neighborKey = toCellKey(x + deltaX, y + deltaY);
      neighborCounts.set(
        neighborKey,
        (neighborCounts.get(neighborKey) ?? 0) + 1,
      );
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) =>
      count === 3 || (count === 2 && liveCellKeys.has(key)),
    )
    .map(([key]) => {
      const [x, y] = key.split(",").map(Number);
      return [x, y] as Cell;
    });
}
