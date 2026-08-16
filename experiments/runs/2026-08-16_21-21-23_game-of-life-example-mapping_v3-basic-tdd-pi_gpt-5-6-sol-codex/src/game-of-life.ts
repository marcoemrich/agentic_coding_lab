export type Cell = [number, number];

type Candidate = { cell: Cell; count: number };

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function incrementCount(counts: Map<string, Candidate>, cell: Cell): void {
  const key = keyOf(cell);
  const candidate = counts.get(key);
  if (candidate) candidate.count += 1;
  else counts.set(key, { cell, count: 1 });
}

function countNeighbors(living: Map<string, Cell>): Map<string, Candidate> {
  const counts = new Map<string, Candidate>();
  for (const [x, y] of living.values()) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      incrementCount(counts, [x + dx, y + dy]);
    }
  }
  return counts;
}

/** Computes one simultaneous Conway's Game of Life step on a sparse grid. */
export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map((cell) => [keyOf(cell), cell]));
  const neighborCounts = countNeighbors(living);

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) =>
      count === REPRODUCTION_NEIGHBORS
      || (count === SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([, { cell }]) => cell);
}
