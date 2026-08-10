export type Cell = [number, number];

type Candidate = { cell: Cell; neighbors: number };

const BIRTH_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;
const OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function uniqueCells(cells: Cell[]): Map<string, Cell> {
  return new Map(cells.map((cell) => [keyOf(cell), cell]));
}

function countNeighbors(living: Map<string, Cell>): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of living.values()) {
    for (const [dx, dy] of OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const previous = candidates.get(key);
      candidates.set(key, { cell, neighbors: (previous?.neighbors ?? 0) + 1 });
    }
  }
  return candidates;
}

function survives(neighbors: number, isAlive: boolean): boolean {
  return neighbors === BIRTH_NEIGHBORS
    || (isAlive && neighbors === SURVIVAL_NEIGHBORS);
}

/** Computes one generation while retaining only living cells. */
export function nextGeneration(cells: Cell[]): Cell[] {
  const living = uniqueCells(cells);
  const next: Cell[] = [];
  for (const [key, candidate] of countNeighbors(living)) {
    if (survives(candidate.neighbors, living.has(key))) {
      next.push(candidate.cell);
    }
  }
  return next.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}
