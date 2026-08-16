export type Cell = [number, number];

type NeighborCount = {
  cell: Cell;
  count: number;
};

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, NeighborCount>();

  for (const [x, y] of liveCells) {
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + xOffset, y + yOffset];
      const key = cellKey(cell);
      const count = neighborCounts.get(key)?.count ?? 0;

      neighborCounts.set(key, { cell, count: count + 1 });
    }
  }

  return [...neighborCounts.values()]
    .filter(({ cell, count }) =>
      count === REPRODUCTION_NEIGHBOR_COUNT ||
      (count === SURVIVAL_NEIGHBOR_COUNT && liveCellKeys.has(cellKey(cell))),
    )
    .map(({ cell }) => cell)
    .sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
