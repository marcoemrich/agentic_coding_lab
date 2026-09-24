export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function coordinateKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function liveNeighborCount([x, y]: Cell, living: ReadonlySet<string>): number {
  let neighbors = 0;
  for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
    if (living.has(coordinateKey([x + deltaX, y + deltaY]))) {
      neighbors += 1;
    }
  }
  return neighbors;
}

function survives(neighborCount: number): boolean {
  return neighborCount >= MINIMUM_SURVIVAL_NEIGHBORS
    && neighborCount <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function reproducedCells(cells: Cell[], living: ReadonlySet<string>): Cell[] {
  const candidates = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [deltaX, deltaY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + deltaX, y + deltaY];
      const key = coordinateKey(cell);
      const candidate = candidates.get(key);
      candidates.set(key, { cell, count: (candidate?.count ?? 0) + 1 });
    }
  }
  return [...candidates.entries()]
    .filter(([key, candidate]) => !living.has(key) && candidate.count === REPRODUCTION_NEIGHBORS)
    .map(([, candidate]) => candidate.cell);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(coordinateKey));
  const survivors = cells.filter((cell) => survives(liveNeighborCount(cell, living)));

  return [...survivors, ...reproducedCells(cells, living)];
}
