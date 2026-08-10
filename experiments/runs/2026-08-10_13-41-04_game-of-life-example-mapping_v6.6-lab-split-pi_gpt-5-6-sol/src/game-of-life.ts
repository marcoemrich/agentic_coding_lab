export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNT = 2;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of currentLiveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const entry = neighborCounts.get(key);
      neighborCounts.set(key, { cell, count: (entry?.count ?? 0) + 1 });
    }
  }

  const liveCellKeys = new Set(currentLiveCells.map(cellKey));
  return [...neighborCounts.entries()]
    .filter(([key, { count }]) =>
      count === REPRODUCTION_NEIGHBOR_COUNT ||
      (count === SURVIVAL_NEIGHBOR_COUNT && liveCellKeys.has(key)),
    )
    .map(([, { cell }]) => cell);
}
