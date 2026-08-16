export type Cell = [number, number];

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  const liveCellKeys = new Set(currentLiveCells.map(([x, y]) => `${x},${y}`));

  for (const [x, y] of currentLiveCells) {
    for (const [dx, dy] of neighborOffsets) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = `${neighbor[0]},${neighbor[1]}`;
      const existingNeighbor = neighborCounts.get(key);
      neighborCounts.set(key, {
        cell: neighbor,
        count: (existingNeighbor?.count ?? 0) + 1,
      });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === 3 || (count === 2 && liveCellKeys.has(key)))
    .map(([, { cell }]) => cell);
}
