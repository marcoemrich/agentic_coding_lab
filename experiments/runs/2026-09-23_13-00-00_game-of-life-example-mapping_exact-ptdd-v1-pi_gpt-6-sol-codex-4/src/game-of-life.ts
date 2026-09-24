export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

type Candidate = { cell: Cell; neighbors: number };

const ADJACENT: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function survives(neighbors: number): boolean {
  return neighbors >= MIN_SURVIVAL_NEIGHBORS && neighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function reproduces(neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS;
}

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function countNeighbors(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of ADJACENT) {
      const cell: Cell = [x + dx, y + dy];
      const id = key(cell);
      const candidate = candidates.get(id) ?? { cell, neighbors: 0 };
      candidate.neighbors++;
      candidates.set(id, candidate);
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(key));
  const next: Cell[] = [];
  for (const [id, { cell, neighbors }] of countNeighbors(cells)) {
    if (living.has(id) ? survives(neighbors) : reproduces(neighbors)) {
      next.push(cell);
    }
  }
  return next;
}
