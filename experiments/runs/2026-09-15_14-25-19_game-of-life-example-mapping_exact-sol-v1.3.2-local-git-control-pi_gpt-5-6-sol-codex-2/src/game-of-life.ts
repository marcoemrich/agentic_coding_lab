export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  neighbors: number;
};

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function livingCells(cells: Cell[]): Map<string, Cell> {
  return new Map(cells.map((cell) => [keyOf(cell), cell]));
}

function countNeighbors(living: Map<string, Cell>): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const cell of living.values()) {
    const ownKey = keyOf(cell);
    candidates.set(ownKey, candidates.get(ownKey) ?? { cell, neighbors: 0 });
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [cell[0] + dx, cell[1] + dy];
      const neighborKey = keyOf(neighbor);
      const candidate = candidates.get(neighborKey) ?? { cell: neighbor, neighbors: 0 };
      candidates.set(neighborKey, { ...candidate, neighbors: candidate.neighbors + 1 });
    }
  }
  return candidates;
}

function lives(candidate: Candidate, currentlyAlive: boolean): boolean {
  if (!currentlyAlive) return candidate.neighbors === REPRODUCTION_NEIGHBORS;
  return candidate.neighbors >= MIN_SURVIVAL_NEIGHBORS
    && candidate.neighbors <= MAX_SURVIVAL_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = livingCells(cells);
  return [...countNeighbors(living).entries()]
    .filter(([key, candidate]) => lives(candidate, living.has(key)))
    .map(([, candidate]) => candidate.cell);
}
