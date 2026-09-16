export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

type NeighborCount = { cell: Cell; count: number };

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function willLive(isAlive: boolean, liveNeighbors: number): boolean {
  if (isAlive) {
    return liveNeighbors === MINIMUM_SURVIVAL_NEIGHBORS
      || liveNeighbors === REPRODUCTION_NEIGHBORS;
  }
  return liveNeighbors === REPRODUCTION_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const candidates = new Map<string, NeighborCount>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      const previous = candidates.get(key);
      candidates.set(key, { cell: neighbor, count: (previous?.count ?? 0) + 1 });
    }
  }

  return [...candidates.entries()]
    .filter(([key, { count }]) => willLive(living.has(key), count))
    .map(([, { cell }]) => cell);
}
