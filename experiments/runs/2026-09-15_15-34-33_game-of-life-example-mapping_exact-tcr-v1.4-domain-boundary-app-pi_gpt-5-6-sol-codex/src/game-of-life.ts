export type Cell = [number, number];

const SURVIVAL_MINIMUM = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

function livesInNextGeneration(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS
    || (isAlive && neighborCount === SURVIVAL_MINIMUM);
}

type NeighborCount = { cell: Cell; count: number };

function countNeighbors(cells: Cell[]): Map<string, NeighborCount> {
  const counts = new Map<string, NeighborCount>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      counts.set(key, { cell, count: (counts.get(key)?.count ?? 0) + 1 });
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  return [...countNeighbors(cells)].filter(([key, { count }]) =>
    livesInNextGeneration(living.has(key), count)
  ).map(([, { cell }]) => cell);
}
