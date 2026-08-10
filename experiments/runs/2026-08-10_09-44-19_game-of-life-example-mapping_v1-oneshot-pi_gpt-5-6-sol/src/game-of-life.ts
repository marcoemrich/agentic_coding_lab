export type Cell = [number, number];

type NeighborCount = {
  cell: Cell;
  count: number;
};

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countNeighbor(counts: Map<string, NeighborCount>, cell: Cell): void {
  const key = cellKey(cell);
  const existing = counts.get(key);
  if (existing) {
    existing.count += 1;
  } else {
    counts.set(key, { cell, count: 1 });
  }
}

function countAllNeighbors(cells: Iterable<Cell>): Map<string, NeighborCount> {
  const counts = new Map<string, NeighborCount>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      countNeighbor(counts, [x + dx, y + dy]);
    }
  }
  return counts;
}

/** Calculates one generation while storing only live cells and their neighbors. */
export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map((cell) => [cellKey(cell), cell]));
  const counts = countAllNeighbors(living.values());
  const next = [...counts.entries()]
    .filter(([key, value]) =>
      value.count === REPRODUCTION_NEIGHBORS
      || (value.count === SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([, value]) => value.cell);

  return next.sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
